import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  Video,
  ChevronRight,
  Zap,
  AlertTriangle,
  Settings,
  MessageSquare,
  Users,
  HelpCircle,
  Sparkles,
  Lock
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { meetings, viewMeetingPrep, setCurrentScreen, workflowStatus, credentials, openGuide } = useApp();

  const preparedCount  = meetings.filter(m => m.status === 'Prepared').length;
  const inProgressCount = meetings.filter(m => m.status === 'In Progress').length;
  const scheduledCount  = meetings.filter(m => m.status === 'Scheduled').length;
  const isLocked        = credentials.status === 'Locked & Expired' || (credentials.expiresAtTimestamp ? Date.now() >= credentials.expiresAtTimestamp : false);
  const isConfigured    = (credentials.status === 'Configured' || credentials.status === 'Submitted') && !isLocked;
  const hasRuns         = workflowStatus.totalRunsLast30Days > 0;

  const successRate = hasRuns
    ? Math.round((workflowStatus.successfulRuns / workflowStatus.totalRunsLast30Days) * 100)
    : 0;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">

      {/* ── Welcome Banner ────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                workflowStatus.isActive
                  ? 'bg-emerald-950/70 border border-emerald-800/70 text-emerald-400'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${workflowStatus.isActive ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                {workflowStatus.isActive ? 'n8n Background Engine Active' : 'n8n Engine Pending'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
                100% Automated
              </span>
            </div>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
              Welcome back, Swaraj
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed max-w-xl">
              Your background n8n workflow monitors your calendar 24/7, conducts email & web research, and dispatches briefings to WhatsApp 60 minutes before each call.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={openGuide}
              className="px-3.5 py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
              How It Works
            </button>
            <button
              onClick={() => setCurrentScreen('connections')}
              className="px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Setup
            </button>
          </div>
        </div>
      </div>

      {/* ── Non-Technical Flow Banner ─────────────────────────────────────── */}
      <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
              How Your Background n8n Workflow Runs (Zero Technical Effort Required)
            </h3>
          </div>
          <button
            onClick={openGuide}
            className="text-[11px] text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
          >
            <span>View Full Guide</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-blue-950 text-blue-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
              1
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">Calendar Watch</p>
              <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">n8n checks your Google Calendar hourly</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-950 text-amber-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
              2
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">Email & Web Scraping</p>
              <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">Scans Gmail threads & attendee background</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-purple-950 text-purple-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
              3
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">AI Briefing Dossier</p>
              <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">GPT-4o generates goals & talking points</p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950 border border-zinc-800 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-md bg-emerald-950 text-emerald-400 flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
              4
            </div>
            <div>
              <p className="text-xs font-semibold text-zinc-200">WhatsApp & Web Sync</p>
              <p className="text-[11px] text-zinc-500 leading-snug mt-0.5">Displays here & arrives on WhatsApp</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Credentials warning (if not configured) ───────────────────────── */}
      {!isConfigured && (
        <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-300 text-xs">
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-400" />
          <div className="flex-1 leading-relaxed">
            <span className="font-semibold text-amber-200">One-Time Setup Required:</span>
            {' '}Please visit the{' '}
            <button
              onClick={() => setCurrentScreen('connections')}
              className="underline underline-offset-2 hover:text-amber-100 transition-colors font-medium"
            >
              Connections / Setup Page
            </button>
            {' '}to enter your API keys and Google / WhatsApp credentials so your n8n background workflow can run.
          </div>
        </div>
      )}

      {/* ── Stats Row ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Meetings',
            value: meetings.length,
            sub: 'Upcoming this week',
            icon: <Users className="w-3.5 h-3.5" />,
            color: 'text-zinc-300',
            bg: 'bg-zinc-800 border-zinc-700'
          },
          {
            label: 'Briefs Ready',
            value: preparedCount,
            sub: inProgressCount > 0 ? `${inProgressCount} in progress` : scheduledCount > 0 ? `${scheduledCount} scheduled` : 'None yet',
            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
            color: 'text-emerald-400',
            bg: 'bg-emerald-950/50 border-emerald-800/50'
          },
          {
            label: 'Success Rate',
            value: hasRuns ? `${successRate}%` : '—',
            sub: hasRuns ? 'Last 30 days' : 'No runs yet',
            icon: <Zap className="w-3.5 h-3.5" />,
            color: 'text-zinc-300',
            bg: 'bg-zinc-800 border-zinc-700'
          },
          {
            label: 'Avg. Run Time',
            value: hasRuns ? `${workflowStatus.avgDurationSeconds}s` : '—',
            sub: hasRuns ? 'Per execution' : 'No runs yet',
            icon: <Clock className="w-3.5 h-3.5" />,
            color: 'text-zinc-300',
            bg: 'bg-zinc-800 border-zinc-700'
          }
        ].map(stat => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-zinc-400">{stat.label}</span>
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className={`text-2xl font-bold tracking-tight ${stat.color === 'text-emerald-400' ? 'text-zinc-100' : 'text-zinc-100'}`}>
              {stat.value}
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main Content: Meetings + Workflow ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Upcoming Meetings (wider) */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">Upcoming Meetings</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">Auto-synced from Google Calendar</p>
            </div>
            <button
              onClick={() => setCurrentScreen('meetings')}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-3">
                <Calendar className="w-5 h-5 text-zinc-500" />
              </div>
              <p className="text-sm text-zinc-400 font-medium">No meetings yet</p>
              <p className="text-xs text-zinc-600 mt-1 max-w-xs">
                Once your Google Calendar is connected and the workflow runs, upcoming meetings will appear here.
              </p>
              <button
                onClick={() => setCurrentScreen('connections')}
                className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
              >
                Set up credentials
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {meetings.slice(0, 5).map(meeting => (
                <div key={meeting.id} className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-zinc-850/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    {meeting.attendeeAvatar ? (
                      <img
                        src={meeting.attendeeAvatar}
                        alt={meeting.attendeeName}
                        className="w-8 h-8 rounded-full object-cover border border-zinc-700 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-semibold text-zinc-400 flex-shrink-0">
                        {meeting.attendeeName.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-zinc-200 truncate">{meeting.attendeeName}</p>
                      <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-0.5">
                        <span>{meeting.date}</span>
                        <span>·</span>
                        <Video className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{meeting.platform}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                      meeting.status === 'Prepared'
                        ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                        : meeting.status === 'In Progress'
                        ? 'bg-amber-950/60 border-amber-800/60 text-amber-400'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400'
                    }`}>
                      {meeting.status === 'Prepared' ? 'Ready' : meeting.status}
                    </span>
                    {meeting.status === 'Prepared' && (
                      <button
                        onClick={() => viewMeetingPrep(meeting.id)}
                        className="p-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700 transition-colors"
                        title="View brief"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Workflow info */}
        <div className="lg:col-span-2 space-y-4">

          {/* Workflow Status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <Zap className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-100">Workflow</h2>
                <p className="text-[11px] text-zinc-500">{workflowStatus.triggerSchedule}</p>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Status</span>
                <span className={`font-medium ${workflowStatus.isActive ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {workflowStatus.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Last run</span>
                <span className="text-zinc-300 font-medium">{workflowStatus.lastRunAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Next run</span>
                <span className="text-zinc-300 font-medium truncate ml-2 text-right">{workflowStatus.nextRunAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Runs (30d)</span>
                <span className="text-zinc-300 font-medium">
                  {hasRuns ? `${workflowStatus.successfulRuns} / ${workflowStatus.totalRunsLast30Days}` : '—'}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-800">
              {isLocked ? (
                <div className="flex items-center gap-2 text-[11px] text-amber-400 font-medium">
                  <Lock className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>🔒 Keys Purged & Locked (24h Limit)</span>
                </div>
              ) : workflowStatus.credentialIssues.length === 0 && isConfigured ? (
                <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>All credentials healthy</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[11px] text-amber-400">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{isConfigured ? workflowStatus.credentialIssues[0] : 'Credentials not configured'}</span>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp Dispatch */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-100">WhatsApp Dispatch</h2>
                <p className="text-[11px] text-zinc-500">Sent 1h before each meeting</p>
              </div>
            </div>

            {hasRuns && workflowStatus.recentRuns.length > 0 ? (
              <div className="space-y-2">
                {workflowStatus.recentRuns.slice(0, 3).map(run => (
                  <div key={run.id} className="flex items-center justify-between gap-2 text-xs py-1.5 border-b border-zinc-800/60 last:border-0">
                    <span className="text-zinc-400 truncate">{run.attendeeName ?? 'Unknown'}</span>
                    <span className={`text-[11px] font-medium flex-shrink-0 ${
                      run.status === 'success' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {run.status === 'success' ? `✓ ${run.durationSeconds}s` : '✗ Failed'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-zinc-600 leading-relaxed">
                No dispatches yet. Once configured, briefings will be sent here automatically before each call.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
