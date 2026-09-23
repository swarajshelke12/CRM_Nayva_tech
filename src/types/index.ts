export type Screen = 'dashboard' | 'meetings' | 'preparation' | 'connections';

export type PreparationStatus = 'Prepared' | 'In Progress' | 'Scheduled';

export interface MeetingBrief {
  summary: string;
  emailSummary: string;
  linkedinInsights: string;
  talkingPoints: string[];
}

export interface Meeting {
  id: string;
  title: string;
  attendeeName: string;
  attendeeRole: string;
  attendeeCompany: string;
  attendeeEmail: string;
  attendeeLinkedIn?: string;
  attendeeAvatar: string;
  date: string;
  time: string;
  platform: 'Google Meet' | 'Zoom' | 'Microsoft Teams';
  status: PreparationStatus;
  brief?: MeetingBrief;
}

/**
 * Credentials required by the automation workflow:
 * "Automate Sales Meeting Prep with AI & APIFY Sent To WhatsApp"
 *
 * Google Integration (OAuth2 + API access)
 *   — Client ID & Secret     : Google Cloud OAuth2 app credentials
 *
 * OpenAI API Key             — 4x LLM chain nodes (gpt-4o-2024-08-06)
 * Apify API Key              — APIFY Web Scraper node (LinkedIn scraping)
 * WhatsApp Business Cloud    — Business ID + Access Token
 */
export interface WorkflowCredentials {
  // ── Google Integration ──────────────────────────────────────────────────────
  googleClientId: string;       // Google Cloud OAuth2 Client ID
  googleClientSecret: string;   // Google Cloud OAuth2 Client Secret

  // ── OpenAI ─────────────────────────────────────────────────────────────────
  openAiApiKey: string;

  // ── Apify ──────────────────────────────────────────────────────────────────
  apifyApiKey: string;

  // ── LinkedIn Session Cookie ────────────────────────────────────────────────
  linkedInCookie?: string;      // li_at session cookie from browser DevTools for Apify scraper

  // ── WhatsApp Business Cloud ────────────────────────────────────────────────
  whatsAppBusinessId: string;   // Meta Business Account ID
  whatsAppAccessToken: string;  // Permanent / long-lived access token from Meta

  // ── Status & Security Metadata ─────────────────────────────────────────────
  status: 'Not Configured' | 'Submitted' | 'Configured' | 'Locked & Expired';
  lastSubmitted?: string;
  submittedAtTimestamp?: number;  // Epoch ms timestamp when submitted
  expiresAtTimestamp?: number;    // Epoch ms timestamp when 12h lock triggers
}

// ─── Workflow Monitoring (mock data only — no live backend connection yet) ────

export type WorkflowRunStatus = 'success' | 'failed' | 'running';

export interface WorkflowRun {
  id: string;
  timestamp: string;
  triggerReason: string;
  status: WorkflowRunStatus;
  durationSeconds: number;
  attendeeName?: string;
  errorMessage?: string;
}

export interface WorkflowStatus {
  name: string;
  isActive: boolean;
  triggerSchedule: string;        // e.g. "Every 1 hour"
  lastRunAt: string;
  nextRunAt: string;
  totalRunsLast30Days: number;
  successfulRuns: number;
  failedRuns: number;
  avgDurationSeconds: number;
  recentRuns: WorkflowRun[];
  credentialIssues: string[];
}
