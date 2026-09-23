import type { Meeting, WorkflowCredentials, WorkflowStatus } from '../types';

// ─── Meetings ─────────────────────────────────────────────────────────────────
// Populated live by the Google Calendar sync / n8n workflow trigger.
// Starts empty for real production use.

export const initialMeetings: Meeting[] = [];

// ─── Workflow Credentials ─────────────────────────────────────────────────────
// All fields start blank — filled in by the client via the Connections screen.

export const initialCredentials: WorkflowCredentials = {
  googleClientId: '',
  googleClientSecret: '',
  openAiApiKey: '',
  apifyApiKey: '',
  linkedInCookie: '',
  whatsAppBusinessId: '',
  whatsAppAccessToken: '',
  status: 'Not Configured',
};

// ─── Workflow Status ───────────────────────────────────────────────────────────
// Production initial state — updates live as workflow executes.

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
