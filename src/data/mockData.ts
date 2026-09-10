import type { Meeting, WorkflowCredentials, WorkflowStatus } from '../types';

// ─── Meetings ─────────────────────────────────────────────────────────────────
// Populated live by the "Check For Upcoming Meetings" trigger (Google Calendar OAuth2).

export const initialMeetings: Meeting[] = [];

// ─── Workflow Credentials ─────────────────────────────────────────────────────
// All fields start blank — filled in by the user via the Connections screen.

export const initialCredentials: WorkflowCredentials = {
  // Google Integration
  googleClientId: '',
  googleClientSecret: '',

  // OpenAI
  openAiApiKey: '',

  // Apify
  apifyApiKey: '',

  // WhatsApp
  whatsAppBusinessId: '',
  whatsAppAccessToken: '',

  status: 'Not Configured',
};

// ─── Workflow Status ───────────────────────────────────────────────────────────
// Reflects a fresh, unconfigured state — no runs yet.

export const mockWorkflowStatus: WorkflowStatus = {
  name: 'AI Meeting Prep & WhatsApp Dispatch',
  isActive: false,
  triggerSchedule: 'Every 1 hour (Schedule Trigger)',
  lastRunAt: '—',
  nextRunAt: '—',
  totalRunsLast30Days: 0,
  successfulRuns: 0,
  failedRuns: 0,
  avgDurationSeconds: 0,
  credentialIssues: [],
  recentRuns: [],
};
