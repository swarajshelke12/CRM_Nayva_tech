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

export function isCredentialComplete(creds: Partial<WorkflowCredentials>): boolean {
  return Boolean(
    creds.googleClientId?.trim() &&
    creds.googleClientSecret?.trim() &&
    creds.openAiApiKey?.trim() &&
    creds.apifyApiKey?.trim() &&
    creds.whatsAppBusinessId?.trim() &&
    creds.whatsAppAccessToken?.trim()
  );
}

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

  // If status claims Submitted/Configured but required fields are missing, treat as Not Configured
  if ((creds.status === 'Submitted' || creds.status === 'Configured') && !isCredentialComplete(creds)) {
    return initialCredentials;
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
  resetForNewCredentials: () => void;
  viewMeetingPrep: (meetingId: string) => void;
  workflowStatus: WorkflowStatus;
  isGuideOpen: boolean;
  openGuide: () => void;
  closeGuide: () => void;
  justCompletedSetup: boolean;
  dismissCompletedSetupNotice: () => void;
  isSyncing: boolean;
  syncCalendar: () => Promise<void>;
  testWhatsAppAlert: (
    recipientPhoneOverride?: string,
    messageOverride?: string,
    phoneIdOverride?: string,
    tokenOverride?: string,
    sendTemplateOverride?: boolean
  ) => Promise<WebhookResponse>;
  toast: ToastNotification | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [meetings, setMeetings] = useState<Meeting[]>(() => {
    try {
      const saved = localStorage.getItem('meetprep_meetings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialMeetings;
  });
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('meetprep_meetings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0].id;
      }
    } catch {}
    return '';
  });
  const [justCompletedSetup, setJustCompletedSetup] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  useEffect(() => {
    try {
      if (meetings.length > 0) {
        localStorage.setItem('meetprep_meetings', JSON.stringify(meetings));
      } else {
        localStorage.removeItem('meetprep_meetings');
      }
    } catch {}
  }, [meetings]);

  // Initialize credentials from localStorage if available, applying auto-purge if >12h
  const [credentials, setCredentials] = useState<WorkflowCredentials>(() => {
    try {
      const saved = localStorage.getItem('meetprep_credentials');
      if (saved) {
        const parsed = JSON.parse(saved) as WorkflowCredentials;
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

    const isComplete = isCredentialComplete(updates);

    const newCreds: WorkflowCredentials = {
      ...credentials,
      ...updates,
      status: isComplete ? 'Submitted' : 'Not Configured',
      submittedAtTimestamp: isComplete ? now : undefined,
      expiresAtTimestamp: isComplete ? expiresAt : undefined,
      lastSubmitted: isComplete ? `${formattedTime} (Auto-locks in 12h)` : undefined,
    };

    setCredentials(newCreds);

    if (isComplete) {
      setWorkflowStatus((prev) => ({
        ...prev,
        isActive: true,
        lastRunAt: 'Just now',
        nextRunAt: 'In 60 minutes',
      }));
      setJustCompletedSetup(true);
    }

    try {
      localStorage.setItem('meetprep_credentials', JSON.stringify(newCreds));
    } catch {}

    if (isComplete) {
      // Asynchronously dispatch to production n8n webhook if endpoint configured
      const res = await sendCredentialsToWebhook(newCreds);
      if (res.meetings && res.meetings.length > 0) {
        setMeetings(res.meetings);
        setSelectedMeetingId((prev) => prev || res.meetings![0].id);
      }
    }
  };

  const syncCalendar = async () => {
    setIsSyncing(true);
    const result = await triggerMeetingSync();
    setIsSyncing(false);
    if (result.meetings && result.meetings.length > 0) {
      setMeetings(result.meetings);
      setSelectedMeetingId((prev) => prev || result.meetings![0].id);
    }
    setWorkflowStatus((prev) => ({
      ...prev,
      lastRunAt: 'Just now',
    }));
    showToast(result.message, result.success ? 'success' : 'info');
  };

  const testWhatsAppAlert = async (
    recipientPhoneOverride?: string,
    messageOverride?: string,
    phoneIdOverride?: string,
    tokenOverride?: string,
    sendTemplateOverride?: boolean
  ): Promise<WebhookResponse> => {
    const phone = recipientPhoneOverride || credentials.whatsAppRecipientPhone;
    const phoneId = phoneIdOverride || credentials.whatsAppBusinessId;
    const token = tokenOverride || credentials.whatsAppAccessToken;

    const res = await sendTestWhatsAppDispatch(
      phoneId,
      token,
      phone,
      messageOverride,
      sendTemplateOverride
    );
    showToast(res.message, res.success ? 'success' : 'error');
    return res;
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
      whatsAppRecipientPhone: '',
      status: 'Not Configured',
    };
    setCredentials(blankCreds);
    setMeetings([]);
    try {
      localStorage.removeItem('meetprep_credentials');
      localStorage.removeItem('meetprep_meetings');
    } catch {}
    showToast('Credentials cleared for re-entry.', 'info');
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
        resetForNewCredentials,
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
