import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Screen, Meeting, WorkflowCredentials, WorkflowStatus } from '../types';
import { initialMeetings, initialCredentials, mockWorkflowStatus } from '../data/mockData';

export const LOCK_DURATION_MS = 30 * 1000; // ⚠️ TESTING: 30 seconds (change to 24 * 60 * 60 * 1000 for production)

function sanitizeCredentialsIfExpired(creds: WorkflowCredentials): WorkflowCredentials {
  if (creds.expiresAtTimestamp && Date.now() >= creds.expiresAtTimestamp) {
    return {
      googleClientId: '',
      googleClientSecret: '',
      openAiApiKey: '',
      apifyApiKey: '',
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

interface AppContextType {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
  selectedMeetingId: string;
  setSelectedMeetingId: (id: string) => void;
  meetings: Meeting[];
  credentials: WorkflowCredentials;
  updateCredentials: (updates: Partial<WorkflowCredentials>) => void;
  simulateLockExpiry: () => void;
  resetForNewCredentials: () => void;
  deleteCredentials: () => void;
  fillDummyCredentials: () => Partial<WorkflowCredentials>;
  viewMeetingPrep: (meetingId: string) => void;
  workflowStatus: WorkflowStatus;
  isGuideOpen: boolean;
  openGuide: () => void;
  closeGuide: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<Screen>('dashboard');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string>('');
  const [meetings] = useState<Meeting[]>(initialMeetings);

  // Initialize credentials from localStorage if available, applying auto-purge if >24h
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

  // Workflow status is read-only mock data — no live n8n connection yet
  const [workflowStatus] = useState<WorkflowStatus>(mockWorkflowStatus);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  const openGuide = () => setIsGuideOpen(true);
  const closeGuide = () => setIsGuideOpen(false);

  // Periodic security check to automatically trigger 24h lock & purge
  useEffect(() => {
    const timer = setInterval(() => {
      setCredentials(prev => {
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

  const updateCredentials = (updates: Partial<WorkflowCredentials>) => {
    const now = Date.now();
    const expiresAt = now + LOCK_DURATION_MS;
    const formattedTime = new Date(now).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const newCreds: WorkflowCredentials = {
      ...credentials,
      ...updates,
      status: 'Submitted',
      submittedAtTimestamp: now,
      expiresAtTimestamp: expiresAt,
      lastSubmitted: `${formattedTime} (Auto-locks in 24h)`
    };

    setCredentials(newCreds);
    try {
      localStorage.setItem('meetprep_credentials', JSON.stringify(newCreds));
    } catch {}
  };

  const simulateLockExpiry = () => {
    const expiredTimestamp = Date.now() - 1000;
    const expiredCreds: WorkflowCredentials = {
      googleClientId: '',
      googleClientSecret: '',
      openAiApiKey: '',
      apifyApiKey: '',
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
  };

  const resetForNewCredentials = () => {
    const blankCreds: WorkflowCredentials = {
      googleClientId: '',
      googleClientSecret: '',
      openAiApiKey: '',
      apifyApiKey: '',
      whatsAppBusinessId: '',
      whatsAppAccessToken: '',
      status: 'Not Configured',
    };
    setCredentials(blankCreds);
    try {
      localStorage.removeItem('meetprep_credentials');
    } catch {}
  };

  const deleteCredentials = () => {
    const blankCreds: WorkflowCredentials = {
      googleClientId: '',
      googleClientSecret: '',
      openAiApiKey: '',
      apifyApiKey: '',
      whatsAppBusinessId: '',
      whatsAppAccessToken: '',
      status: 'Not Configured',
    };
    setCredentials(blankCreds);
    try {
      localStorage.removeItem('meetprep_credentials');
    } catch {}
  };

  const fillDummyCredentials = (): Partial<WorkflowCredentials> => {
    // ★ Dummy values use realistic formats & lengths that pass the validation rules.
    //   These are NOT real credentials — they are sample placeholders only.
    return {
      googleClientId:      '847293610584-a8kd9f3hm2nqp5rv7xwb1ycz4ej6otlu.apps.googleusercontent.com',   // 72 chars
      googleClientSecret:  'GOCSPX-mK9pN2qR4sT6uV8wX0yB3dF5hJ7',                                       // 35 chars
      openAiApiKey:        'sk-proj-aB3cD5eF7gH9iJ1kL3mN5oP7qR9sT1uV3wX5yZ7aB9cD1eF',                   // 56 chars
      apifyApiKey:         'apify_api_kM9nP2qR4sT6uV8wX0yB3dF5hJ7lN9pQ',                                // 42 chars
      whatsAppBusinessId:  '109876543210985',                                                             // 15 digits
      whatsAppAccessToken: 'EAAGm0PX4ZBsEBO3kZBwVjRqHtN2mFpL5sQdK8xW1nU7yC3vA9bD6eG0hI2jK4lM8nO0pQ2rS4tU6vW8xY0zA1bC3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1pQ3rS5tU7vW9xY1zA3bC5dE7f', // 183 chars
    };
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
        fillDummyCredentials,
        viewMeetingPrep,
        workflowStatus,
        isGuideOpen,
        openGuide,
        closeGuide
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
