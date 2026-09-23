import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Calendar,
  CheckCircle2,
  ArrowRight,
  Video,
  ChevronRight,
  ShieldCheck,
  Settings,
  MessageSquare,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const {
    meetings,
    viewMeetingPrep,
    setCurrentScreen,
    workflowStatus,
    credentials,
    openGuide,
    justCompletedSetup,
    dismissCompletedSetupNotice,
    isSyncing,
    syncCalendar
  } = useApp();

  const preparedCount = meetings.filter((m) => m.status === 'Prepared').length;
  const inProgressCount = meetings.filter((m) => m.status === 'In Progress').length;
  const isLocked =
    credentials.status === 'Locked & Expired' ||
    (credentials.expiresAtTimestamp ? Date.now() >= credentials.expiresAtTimestamp : false);
  const isConfigured =
    (credentials.status === 'Configured' || credentials.status === 'Submitted') && !isLocked;

  return (
    <div className="space-y-4 max-w-5xl mx-auto">
      {/* ── Setup Completed Success Banner ─────────────────────────────────── */}
      {justCompletedSetup && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-200 text-xs flex items-center justify-between gap-3 shadow-lg animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-900/50 border border-emerald-700/60 flex items-center justify-center text-emerald-300 flex-shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-emerald-100">Setup Active — 12-Hour Production Vault Armed</p>
              <p className="text-[11px] text-emerald-300/80 mt-0.5">
                Your calendar is linked, briefings are ready, and your WhatsApp dispatch will trigger 60 minutes before calls.
              </p>
            </div>
          </div>
          <button
            onClick={dismissCompletedSetupNotice}
            className="text-emerald-400 hover:text-emerald-200 p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ── Welcome Banner ────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                  isConfigured
                    ? 'bg-emerald-950/70 border border-emerald-800/70 text-emerald-400'
                    : 'bg-amber-950/70 border border-amber-800/70 text-amber-300'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                {isConfigured ? 'Automated Intelligence Active' : 'Setup Required'}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700">
                12h Ephemeral Vault
              </span>
            </div>

            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">
              Executive Meeting Intelligence
            </h1>
            <p className="text-xs text-zinc-400 mt-1 leading-relaxed max-w-xl">
              Autonomous calendar monitoring, background attendee research, and executive WhatsApp briefings delivered 60 minutes before calls.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={syncCalendar}
              disabled={isSyncing}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Manually trigger Google Calendar sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Calendar'}</span>
            </button>
            <button
              onClick={openGuide}
              className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>How It Works</span>
            </button>
            <button
              onClick={() => setCurrentScreen('connections')}
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Connections</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Key Executive Metrics ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          {
            label: 'Upcoming Meetings',
            value: meetings.length,
            sub: 'Synced from calendar',
            icon: <Calendar className="w-3.5 h-3.5" />,
            color: 'text-blue-400',
            bg: 'bg-blue-950/40 border-blue-900/40'
          },
          {
            label: 'Briefs Prepared',
            value: preparedCount,
            sub: inProgressCount > 0 ? `${inProgressCount} in progress` : 'All caught up',
            icon: <CheckCircle2 className="w-3.5 h-3.5" />,
            color: 'text-emerald-400',
            bg: 'bg-emerald-950/40 border-emerald-900/40'
          },
          {
            label: 'WhatsApp Dispatch',
            value: isConfigured ? 'Active' : 'Pending',
            sub: 'Sent 60m before call',
            icon: <MessageSquare className="w-3.5 h-3.5" />,
            color: isConfigured ? 'text-green-400' : 'text-zinc-500',
            bg: isConfigured ? 'bg-green-950/40 border-green-900/40' : 'bg-zinc-800 border-zinc-700'
          },
          {
            label: 'Security Vault',
            value: '12h Cycle',
            sub: 'Zero-knowledge auto purge',
            icon: <ShieldCheck className="w-3.5 h-3.5" />,
            color: 'text-amber-400',
            bg: 'bg-amber-950/40 border-amber-900/40'
          }
        ].map((stat) => (
          <div key={stat.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-zinc-400">{stat.label}</span>
              <div className={`w-7 h-7 rounded-lg border flex items-center justify-center ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
            </div>
            <div className="text-xl font-bold tracking-tight text-zinc-100">{stat.value}</div>
            <p className="text-[11px] text-zinc-500 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* ── Main Content Grid ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Left: Upcoming Meetings (3 Cols) */}
        <div className="lg:col-span-3 bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">Upcoming Meetings &amp; Briefings</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">Click any meeting to review its AI executive dossier</p>
            </div>
            <button
              onClick={() => setCurrentScreen('meetings')}
              className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
            >
              <span>View all</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-zinc-800/60 flex-1">
            {meetings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-10 h-10 rounded-full bg-zinc-800/60 border border-zinc-700/60 flex items-center justify-center mb-3 text-zinc-500">
                  <Calendar className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-zinc-300">No scheduled meetings yet</p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-xs leading-relaxed">
                  Connect your Google Calendar or click "Sync Calendar" above to load upcoming sessions and auto-generate briefings.
                </p>
              </div>
            ) : (
              meetings.slice(0, 4).map((meeting) => (
                <div
                  key={meeting.id}
                  onClick={() => viewMeetingPrep(meeting.id)}
                  className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-zinc-800/40 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={meeting.attendeeAvatar}
                      alt={meeting.attendeeName}
                      className="w-9 h-9 rounded-full object-cover border border-zinc-700 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">
                          {meeting.attendeeName}
                        </p>
                        <span className="text-[10px] text-zinc-500">•</span>
                        <span className="text-[11px] text-zinc-400 truncate">{meeting.attendeeCompany}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-zinc-500 mt-0.5">
                        <span>{meeting.date} at {meeting.time.split(' - ')[0]}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Video className="w-3 h-3" />
                          <span>{meeting.platform}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 flex-shrink-0">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-medium rounded-full border ${
                        meeting.status === 'Prepared'
                          ? 'bg-emerald-950/60 border-emerald-800/60 text-emerald-400'
                          : 'bg-amber-950/60 border-amber-800/60 text-amber-400'
                      }`}
                    >
                      {meeting.status === 'Prepared' ? 'Brief Ready' : 'Researching'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewMeetingPrep(meeting.id);
                      }}
                      className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-zinc-700 transition-colors"
                      title="Open brief"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Compact Dispatch & Status (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Dispatch Status */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2.5 pb-2.5 border-b border-zinc-800">
              <div className="w-7 h-7 rounded-lg bg-green-950/50 border border-green-900/50 flex items-center justify-center text-green-400">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100">WhatsApp Dispatch</h3>
                <p className="text-[11px] text-zinc-500">Autonomous delivery</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Delivery Status</span>
                <span className={`font-medium ${isConfigured ? 'text-emerald-400' : 'text-zinc-500'}`}>
                  {isConfigured ? 'Ready & Active' : 'Setup Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Timing</span>
                <span className="text-zinc-300">60 mins before each call</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Next Scheduled Brief</span>
                <span className="text-zinc-200 font-medium truncate ml-2 text-right">
                  {meetings.length > 0
                    ? `${meetings[0].date} at ${meetings[0].time.split(' - ')[0]} (${meetings[0].attendeeName})`
                    : 'No upcoming calls scheduled'}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-zinc-850">
                <span className="text-zinc-500">Sync Engine</span>
                <span className="text-zinc-400 font-mono text-[10px]">{workflowStatus.nextRunAt}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-400 leading-relaxed">
              Briefings include attendees' recent email topics, career milestones, and 4 bulletproof talking points.
            </div>
          </div>

          {/* Security & 12h Timeline Badge */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>12-Hour Security Guarantee</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Your credentials are saved exclusively in your browser memory for 12 hours before being completely purged. Zero persistent database tracking.
            </p>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-zinc-500">Storage Type</span>
              <span className="font-mono text-zinc-300 text-[10px] bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
                Ephemeral 12h
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
