import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Screen, Meeting, WorkflowCredentials, WorkflowStatus } from '../types';
import { initialMeetings, initialCredentials, mockWorkflowStatus } from '../data/mockData';
import {
  sendCredentialsToWebhook,
  sendTestWhatsAppDispatch,
  triggerMeetingSync,
  type WebhookResponse
} from '../services/webhookService';

export const LOCK_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds (Production setting)

function sanitizeCredentialsIfExpired(creds: WorkflowCredentials): WorkflowCredentials {
  if (creds.expiresAtTimestamp && Date.now() >= creds.expiresAtTimestamp) {
    return {
      googleClientId: '',
      googleClientSecret: '',
      openAiApiKey: '',
      apifyApiKey: '',
      linkedInCookie: '',
      whatsAppBusinessId: '',
      whatsAppAccessToken: '',
      status: 'Locked & Expired',
      lastSubmitted: creds.lastSubmitted,
      submittedAtTimestamp: creds.submittedAtTimestamp,
      expiresAtTimestamp: creds.expiresAtTimestamp,
    };
  }
  return creds;
}

export interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedMeetingId: string;
  setSelectedMeetingId: (id: string) => void;
  meetings: Meeting[];
  credentials: WorkflowCredentials;
  updateCredentials: (updates: Partial<WorkflowCredentials>) => Promise<void>;
  simulateLockExpiry: () => void;
  resetForNewCredentials: () => void;
  deleteCredentials: () => void;
  viewMeetingPrep: (meetingId: string) => void;
  workflowStatus: WorkflowStatus;
  isGuideOpen: boolean;
  openGuide: () => void;
  closeGuide: () => void;
  justCompletedSetup: boolean;
  dismissCompletedSetupNotice: () => void;
  isSyncing: boolean;
  syncCalendar: () => Promise<void>;
  testWhatsAppAlert: () => Promise<WebhookResponse>;
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetings);
  const [justCompletedSetup, setJustCompletedSetup] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Initialize credentials from localStorage if available, applying auto-purge if >12h
  const [credentials, setCredentials] = useState<WorkflowCredentials>(() => {
    try {
      const saved = localStorage.getItem('meetprep_credentials');
      if (saved) {
        const parsed = JSON.parse(saved) as WorkflowCredentials;
        if (parsed.googleClientId?.includes('847293610584')) {
          localStorage.removeItem('meetprep_credentials');
          return initialCredentials;
        }
        return sanitizeCredentialsIfExpired(parsed);
      }
    } catch {
      // Fallback to initial blank credentials
    }
    return initialCredentials;
  });

  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>(() => {
    return {
      ...mockWorkflowStatus,
      isActive: credentials.status === 'Submitted' || credentials.status === 'Configured',
    };
  });

  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const openGuide = () => setIsGuideOpen(true);
  const closeGuide = () => setIsGuideOpen(false);
  const dismissCompletedSetupNotice = () => setJustCompletedSetup(false);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToast({ id, message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.id === id ? null : prev));
    }, 4000);
  };

  const dismissToast = () => setToast(null);

  // Periodic security check to automatically trigger 12h lock & purge
  useEffect(() => {
    const timer = setInterval(() => {
      setCredentials((prev) => {
        if (
          prev.expiresAtTimestamp &&
          Date.now() >= prev.expiresAtTimestamp &&
          prev.status !== 'Locked & Expired'
        ) {
          const sanitized = sanitizeCredentialsIfExpired(prev);
          try {
            localStorage.setItem('meetprep_credentials', JSON.stringify(sanitized));
          } catch {}
          return sanitized;
        }
        return prev;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const updateCredentials = async (updates: Partial<WorkflowCredentials>) => {
    const now = Date.now();
    const expiresAt = now + LOCK_DURATION_MS;
    const formattedTime = new Date(now).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const newCreds: WorkflowCredentials = {
      ...credentials,
      ...updates,
      status: 'Submitted',
      submittedAtTimestamp: now,
      expiresAtTimestamp: expiresAt,
      lastSubmitted: `${formattedTime} (Auto-locks in 12h)`,
    };

    setCredentials(newCreds);
    setWorkflowStatus((prev) => ({
      ...prev,
      isActive: true,
      lastRunAt: 'Just now',
      nextRunAt: 'In 60 minutes',
    }));
    setJustCompletedSetup(true);

    try {
      localStorage.setItem('meetprep_credentials', JSON.stringify(newCreds));
    } catch {}

    // Asynchronously dispatch to production n8n webhook if endpoint configured
    await sendCredentialsToWebhook(newCreds);
  };

  const syncCalendar = async () => {
    setIsSyncing(true);
    const result = await triggerMeetingSync();
    setIsSyncing(false);
    setWorkflowStatus((prev) => ({
      ...prev,
      lastRunAt: 'Just now',
    }));
    showToast(result.message, result.success ? 'success' : 'info');
  };

  const testWhatsAppAlert = async (): Promise<WebhookResponse> => {
    const res = await sendTestWhatsAppDispatch(
      credentials.whatsAppBusinessId,
      credentials.whatsAppAccessToken
    );
    showToast(res.message, res.success ? 'success' : 'error');
    return res;
  };

  const simulateLockExpiry = () => {
    const expiredTimestamp = Date.now() - 1000;
    const expiredCreds: WorkflowCredentials = {
      googleClientId: '',
      googleClientSecret: '',
      openAiApiKey: '',
      apifyApiKey: '',
      linkedInCookie: '',
      whatsAppBusinessId: '',
      whatsAppAccessToken: '',
      status: 'Locked & Expired',
      lastSubmitted: credentials.lastSubmitted,
      submittedAtTimestamp: credentials.submittedAtTimestamp ?? (Date.now() - LOCK_DURATION_MS - 5000),
      expiresAtTimestamp: expiredTimestamp,
    };
    setCredentials(expiredCreds);
    try {
      localStorage.setItem('meetprep_credentials', JSON.stringify(expiredCreds));
    } catch {}
    showToast('Simulated 12h session expiry: keys purged.', 'info');
  };

  const resetForNewCredentials = () => {
    const blankCreds: WorkflowCredentials = {
      googleClientId: '',
      googleClientSecret: '',
      openAiApiKey: '',
      apifyApiKey: '',
      linkedInCookie: '',
      whatsAppBusinessId: '',
      whatsAppAccessToken: '',
      status: 'Not Configured',
    };
    setCredentials(blankCreds);
    setMeetings([]);
    try {
      localStorage.removeItem('meetprep_credentials');
    } catch {}
    showToast('Credentials cleared for re-entry.', 'info');
  };

  const deleteCredentials = () => {
    const blankCreds: WorkflowCredentials = {
      googleClientId: '',
      googleClientSecret: '',
      openAiApiKey: '',
      apifyApiKey: '',
      linkedInCookie: '',
      whatsAppBusinessId: '',
      whatsAppAccessToken: '',
      status: 'Not Configured',
    };
    setCredentials(blankCreds);
    setMeetings([]);
    try {
      localStorage.removeItem('meetprep_credentials');
    } catch {}
  };

  const viewMeetingPrep = (meetingId: string) => {
    setSelectedMeetingId(meetingId);
    setCurrentScreen('preparation');
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedMeetingId,
        setSelectedMeetingId,
        meetings,
        credentials,
        updateCredentials,
        simulateLockExpiry,
        resetForNewCredentials,
        deleteCredentials,
        viewMeetingPrep,
        workflowStatus,
        isGuideOpen,
        openGuide,
        closeGuide,
        justCompletedSetup,
        dismissCompletedSetupNotice,
        isSyncing,
        syncCalendar,
        testWhatsAppAlert,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
