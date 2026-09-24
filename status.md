# MeetPrep CRM — Build Context & Project Overview

**Last Updated**: September 23, 2026  
**Project**: MeetPrep CRM (MeetingOS)  
**Owner**: Navya Tech Solutions  
**Status**: Production-ready client delivery portal

---

## Quick Reference

### Project Identity

- **Name**: `meetprep-crm`
- **Version**: `1.0.0`
- **Purpose**: AI-powered meeting preparation & executive intelligence portal
- **License**: Proprietary (UNLICENSED)

### Development Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # TypeScript compilation + Vite production build
npm run lint     # Oxlint static analysis
npm run preview  # Preview production build locally
```

### Critical Configuration

- **Auto-purge Duration**: 12 hours (`LOCK_DURATION_MS` in `src/context/AppContext.tsx:11`)
- **Storage**: Client-side localStorage (ephemeral, no backend database)
- **Webhook Endpoint**: Optional via `VITE_N8N_WEBHOOK_URL` in `.env`

---

## Technology Stack

| Layer               | Technology        | Version      | Role                                      |
| ------------------- | ----------------- | ------------ | ----------------------------------------- |
| **UI Framework**    | React             | 19.2.x       | Component architecture                    |
| **Language**        | TypeScript        | 6.0.x        | Type safety                               |
| **Build Tool**      | Vite              | 8.2.x        | Dev server + bundler                      |
| **Styling**         | Tailwind CSS      | v4.3.x       | Utility-first CSS via `@tailwindcss/vite` |
| **Icons**           | Lucide React      | 1.42.x       | SVG icons                                 |
| **Linting**         | Oxlint            | 1.79.x       | Fast static analysis                      |
| **Typography**      | Plus Jakarta Sans | Google Fonts | Executive sans-serif                      |

---

## Project Architecture

### Directory Structure

```
src/
├── main.tsx                    # React DOM entry point
├── App.tsx                     # Root layout orchestrator & view router
├── index.css                   # Tailwind v4 base styling & scrollbar tokens
│
├── types/
│   └── index.ts                # Core interfaces: Meeting, Brief, Credentials, WorkflowStatus
│
├── context/
│   └── AppContext.tsx          # Global state, validation guard & 12h auto-purge timer
│
├── data/
│   └── mockData.ts             # Initial state definitions
│
├── services/
│   └── webhookService.ts       # n8n webhook dispatcher & calendar sync
│
└── components/
    ├── layout/
    │   ├── Sidebar.tsx         # Responsive navigation & agency branding
    │   └── TopHeader.tsx       # Live status header & user guide toggle
    ├── views/
    │   ├── DashboardView.tsx   # Executive metrics, active workflow & upcoming calls
    │   ├── MeetingsView.tsx    # Filterable scheduled sessions list
    │   ├── MeetingPrepView.tsx # 4-quadrant executive preparation dossier
    │   └── ConnectionsView.tsx # Strict credential validation, setup & 12h vault lock
    └── common/
        └── HowItWorksModal.tsx # Non-technical client workflow walkthrough
```
│
├── services/
│   └── webhookService.ts       # n8n webhook integration (optional live sync)
│
└── components/
    ├── layout/
    │   ├── Sidebar.tsx         # Navigation sidebar
    │   └── TopHeader.tsx       # Header with breadcrumbs + status
    │
    ├── views/
    │   ├── DashboardView.tsx   # Executive KPIs + WhatsApp preview
    │   ├── MeetingsView.tsx    # Calendar table + filters
    │   ├── MeetingPrepView.tsx # Intelligence dossier cards
    │   └── ConnectionsView.tsx # Ephemeral credential portal
    │
    └── common/
        ├── HowItWorksModal.tsx # User guide modal
        ├── Card.tsx            # Reusable card component
        ├── Badge.tsx           # Status badge component
        └── Icons.tsx           # Custom SVG icons
```

### Core Data Models (`src/types/index.ts`)

#### `Meeting`

- Properties: `id`, `title`, `attendeeName`, `attendeeRole`, `attendeeCompany`, `attendeeEmail`, `attendeeAvatar`, `date`, `time`, `platform`, `status`, `brief`
- Platform: `'Google Meet' | 'Zoom' | 'Microsoft Teams'`
- Status: `'Prepared' | 'In Progress' | 'Scheduled'`

#### `MeetingBrief`

- `summary`: Strategic meeting objective
- `emailSummary`: Distilled email thread history
- `linkedinInsights`: Career + recent activity
- `talkingPoints`: Array of 4 conversation starters

#### `WorkflowCredentials`

- **Google**: `googleClientId`, `googleClientSecret`
- **OpenAI**: `openAiApiKey`
- **Apify**: `apifyApiKey`
- **LinkedIn**: `linkedInCookie` (li_at session cookie)
- **WhatsApp**: `whatsAppBusinessId`, `whatsAppAccessToken`
- **Security Metadata**: `status`, `submittedAtTimestamp`, `expiresAtTimestamp`
- Status: `'Not Configured' | 'Submitted' | 'Configured' | 'Locked & Expired'`

#### `WorkflowStatus`

- Properties: `name`, `isActive`, `triggerSchedule`, `lastRunAt`, `nextRunAt`, `totalRunsLast30Days`, `successfulRuns`, `failedRuns`, `avgDurationSeconds`, `recentRuns`, `credentialIssues`

---

## State Management (`src/context/AppContext.tsx`)

### Global Context Provider: `AppProvider`

- **Current Screen**: `'dashboard' | 'meetings' | 'preparation' | 'connections'`
- **Meetings**: Array of meeting objects (loaded from `mockData.ts`)
- **Credentials**: Stored in localStorage with auto-purge enforcement
- **Workflow Status**: Mock monitoring data (no live backend yet)
- **Toast Notifications**: 4-second auto-dismiss messages

### Key Functions

- `updateCredentials(updates)`: Saves to localStorage + triggers 12h expiry timer + optional webhook dispatch
- `syncCalendar()`: Triggers manual n8n workflow sync (if webhook configured)
- `testWhatsAppAlert()`: Sends test WhatsApp message dispatch
- `simulateLockExpiry()`: Instant credential purge for testing
- `deleteCredentials()`: Manual credential wipe
- `viewMeetingPrep(meetingId)`: Navigate to specific dossier

### Security Timer

- **Interval Check**: Every 5 seconds (`useEffect` in AppContext.tsx:116-135)
- **Auto-Purge**: Overwrites all credential fields with empty strings when `Date.now() >= expiresAtTimestamp`
- **Duration Constant**: `LOCK_DURATION_MS = 12 * 60 * 60 * 1000` (line 11)

---

## Application Views

### 1. Dashboard (`DashboardView.tsx`)

- **KPI Cards**: Meetings scheduled, briefs prepared, hours saved
- **Workflow Status Badge**: Active/Inactive indicator
- **Upcoming Meetings**: Next 3 calls with attendee info
- **WhatsApp Preview**: Sample briefing message card

### 2. Meetings (`MeetingsView.tsx`)

- **Search Bar**: Real-time filter by attendee name, company, or title
- **Status Filters**: All / Prepared / In Progress / Scheduled
- **Table Columns**: Attendee, Company, Date/Time, Platform, Status
- **Actions**: "View Prep" button navigates to dossier

### 3. Meeting Preparation (`MeetingPrepView.tsx`)

- **Attendee Switcher**: Dropdown to change between meetings
- **Profile Card**: Avatar, name, role, company, email, platform badge
- **4 Intelligence Sections**:
  1. Meeting Objective & Overview
  2. Email Correspondence Summary
  3. LinkedIn & OSINT Insights
  4. Recommended Talking Points (numbered list)
- **Copy Brief Button**: Exports full dossier to clipboard

### 4. Connections (`ConnectionsView.tsx`)

- **Credential Input Form**: 7 fields with validation
- **Validation Rules**:
  - Google Client ID: ends with `.apps.googleusercontent.com`, 50-100 chars
  - Google Client Secret: starts with `GOCSPX-`, 24-50 chars
  - OpenAI Key: starts with `sk-`, 40-200 chars
  - Apify Key: starts with `apify_api_`, 30-60 chars
  - LinkedIn Cookie: starts with `li_at=`, 40-350 chars
  - WhatsApp Business ID: numeric only, 13-20 digits
  - WhatsApp Token: starts with `EAA`, 100-300 chars
- **Actions**:
  - Fill Sample Data (demo mode)
  - Edit / Unlock Form
  - View / Hide (toggle masking)
  - Delete Saved Keys
  - Simulate 24h Lock (testing)
- **Status Display**: Submission timestamp + auto-lock countdown

---

## n8n Workflow Integration

### Workflow File

- **Location**: `actual_workflow/Automate Sales Meeting Prep with AI & APIFY Sent To WhatsApp.json`
- **Import**: n8n GUI → Add Workflow → Import from File

### Workflow Architecture

1. **Google Calendar Trigger**: Hourly cron → detects meetings starting in <60 mins
2. **Gmail API Query**: Searches email threads by attendee email
3. **Apify LinkedIn Scraper**: Uses `li_at` cookie for profile extraction
4. **4x OpenAI GPT-4o Nodes**: Sequential synthesis chain
5. **WhatsApp Business Cloud API**: Formatted message dispatch to client phone
6. **Frontend Webhook** (optional): Syncs dossier data back to portal via `webhookService.ts`

### Webhook Service (`src/services/webhookService.ts`)

- **`sendCredentialsToWebhook()`**: POST credentials to n8n (if `VITE_N8N_WEBHOOK_URL` configured)
- **`triggerMeetingSync()`**: Manual calendar sync trigger
- **`sendTestWhatsAppDispatch()`**: Test message to verify WhatsApp integration
- **Auth**: Optional bearer token via `VITE_N8N_AUTH_TOKEN`

---

## Security Model

### Zero-Knowledge Architecture

1. **No Backend Database**: All credentials stored in browser localStorage only
2. **12-Hour Auto-Purge**: Credentials automatically wiped after 12 hours
3. **Masked by Default**: Values displayed as `••••••••` unless explicitly unlocked
4. **Client-Side Validation**: Format + entropy checks before submission
5. **Instant Delete**: "Delete Keys" button immediately purges localStorage

### Purge Mechanism

- **Timer Start**: When credentials are submitted via `updateCredentials()`
- **Expiry Timestamp**: `submittedAtTimestamp + LOCK_DURATION_MS`
- **Enforcement**: Background interval check every 5 seconds
- **Sanitization**: All credential fields overwritten with empty strings
- **Status Change**: `'Locked & Expired'`

---

## Styling System

### Tailwind CSS v4

- **Plugin**: `@tailwindcss/vite` (integrated in `vite.config.ts`)
- **Base Styles**: `src/index.css` (imports Tailwind directives)
- **Custom Theme**: Uses default Tailwind palette + Plus Jakarta Sans font
- **Utilities**: `clsx` + `tailwind-merge` for conditional classes

### Design Tokens

- **Primary Colors**: Indigo/blue for actions, green for success, red for errors
- **Status Colors**:
  - Prepared: Green
  - In Progress: Yellow/amber
  - Scheduled: Gray/slate
- **Typography**: Plus Jakarta Sans (weights: 400, 500, 600, 700)

---

## Build Configuration

### TypeScript

- **Root Config**: `tsconfig.json` (references app + node configs)
- **App Config**: `tsconfig.app.json` (client-side code)
- **Node Config**: `tsconfig.node.json` (Vite tooling)
- **Strict Mode**: Enabled for type safety

### Vite (`vite.config.ts`)

```typescript
plugins: [
  react(), // React Fast Refresh
  tailwindcss(), // Tailwind CSS v4
];
```

### Oxlint (`.oxlintrc.json`)

- High-performance linter for TypeScript + JSX
- Replacement for ESLint in this project

---

## Development Workflow

### Initial Setup

```bash
git clone https://github.com/swarajshelke12/CRM_Nayva_tech.git
cd CRM_Nayva_tech
npm install
```

### Environment Variables (`.env.example`)

```env
VITE_N8N_WEBHOOK_URL=https://n8n.yourdomain.com/webhook/meeting-os-trigger
VITE_N8N_AUTH_TOKEN=your-secret-token
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Common Tasks

- **Add New View**: Create in `src/components/views/`, add to `Screen` type in `types/index.ts`
- **Modify Auto-Purge**: Change `LOCK_DURATION_MS` in `src/context/AppContext.tsx:11`
- **Add Validation Rule**: Update `ConnectionsView.tsx` form validation logic
- **Update Mock Data**: Edit `src/data/mockData.ts`

---

## Deployment

### Static Hosting (Vercel/Netlify/Cloudflare Pages)

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Framework**: Vite

### Docker

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
```

---

## Current Status & Known Limitations

### ✅ Production-Ready

- Client-side portal with full UI implementation
- 12-hour credential auto-purge security system
- Mock meeting data for demos
- n8n workflow template included
- Responsive design (desktop + mobile)

### ⚠️ Not Yet Implemented

- **Backend Integration**: No live API connection (all data is mocked)
- **Supabase Auth**: Installed but not configured
- **Real-time Sync**: Webhook service exists but requires n8n setup
- **Multi-tenant Support**: Single-user design (localStorage only)
- **Database Persistence**: No permanent storage layer

### 🔧 Optional Enhancements

- Integrate Supabase for multi-user auth + persistent storage
- Connect webhook service to live n8n instance
- Add real-time calendar sync via Google Calendar API
- Implement push notifications for briefing readiness

---

## File Reference for AI Context

### When editing UI components:

- **Layout**: `src/components/layout/Sidebar.tsx`, `TopHeader.tsx`
- **Views**: `src/components/views/[ViewName].tsx`
- **Reusable**: `src/components/common/[Component].tsx`
- **Styling**: `src/index.css` (global), `src/App.css` (app-level)

### When editing state/logic:

- **Global State**: `src/context/AppContext.tsx`
- **Types**: `src/types/index.ts`
- **Mock Data**: `src/data/mockData.ts`
- **Webhook Integration**: `src/services/webhookService.ts`

### When editing configuration:

- **Build**: `vite.config.ts`, `tsconfig.*.json`
- **Linting**: `.oxlintrc.json`
- **Environment**: `.env.example`
- **Dependencies**: `package.json`

### When editing n8n workflow:

- **Workflow JSON**: `actual_workflow/Automate Sales Meeting Prep with AI & APIFY Sent To WhatsApp.json`

---

## Coding Conventions

### Observed Patterns

- **Component Structure**: Functional components with TypeScript interfaces
- **State Management**: React Context API (no Redux/Zustand)
- **Styling**: Tailwind utility classes (no CSS modules)
- **Icons**: Lucide React components
- **No Comments**: Code is self-documenting (avoid adding comments unless critical)
- **Type Safety**: Explicit types for all props, state, and functions

### Naming Conventions

- **Components**: PascalCase (e.g., `DashboardView.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useApp`)
- **Types**: PascalCase (e.g., `Meeting`, `WorkflowCredentials`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `LOCK_DURATION_MS`)

---

## Contact & Support

- **Client**: Navya Tech Solutions
- **Website**: https://www.navyatech.co.in/
- **Email**: contact@navyatech.co.in
- **GitHub**: https://github.com/swarajshelke12/CRM_Nayva_tech

---

**AI Usage Note**: This file provides complete project context to minimize token usage on codebase exploration. When working on this project, reference this file first before searching through source files.
