import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Search, 
  Video, 
  Calendar, 
  Clock, 
  ArrowRight,
  Settings,
  RefreshCw
} from 'lucide-react';
import type { PreparationStatus } from '../../types';

export const MeetingsView: React.FC = () => {
  const { meetings, viewMeetingPrep, setCurrentScreen, isSyncing, syncCalendar } = useApp();
  const [filter, setFilter] = useState<'All' | PreparationStatus>('All');
  const [search, setSearch] = useState('');

  const filteredMeetings = meetings.filter(meeting => {
    const matchesFilter = filter === 'All' || meeting.status === filter;
    const matchesSearch =
      meeting.attendeeName.toLowerCase().includes(search.toLowerCase()) ||
      meeting.attendeeCompany.toLowerCase().includes(search.toLowerCase()) ||
      meeting.title.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Search / Filters */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-zinc-100 tracking-tight">Upcoming Meetings</h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Review calendar sessions and their automated research dossiers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search attendee or company..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              />
            </div>

            {/* Filter Tabs & Sync */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-lg border border-zinc-800 text-xs">
                {(['All', 'Prepared', 'In Progress', 'Scheduled'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setFilter(tab)}
                    className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                      filter === tab
                        ? 'bg-zinc-800 text-zinc-100 shadow-sm'
                        : 'text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <button
                onClick={syncCalendar}
                disabled={isSyncing}
                className="px-3 py-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 text-zinc-300 text-xs font-medium border border-zinc-800 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                title="Refresh calendar sessions"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-zinc-400 ${isSyncing ? 'animate-spin text-emerald-400' : ''}`} />
                <span className="hidden sm:inline">{isSyncing ? 'Syncing...' : 'Sync'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Meetings List */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400">
          <span>Showing {filteredMeetings.length} of {meetings.length} meetings</span>
          <span className="text-zinc-500">Auto-synced with Google Calendar</span>
        </div>

        <div className="divide-y divide-zinc-850">

          {/* Empty state: no meetings at all */}
          {meetings.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-zinc-500" />
              </div>
              <p className="text-sm font-medium text-zinc-300">No meetings synced yet</p>
              <p className="text-xs text-zinc-500 mt-1.5 max-w-sm leading-relaxed">
                Connect your Google Calendar via the Connections page. Once the automation workflow runs, upcoming meetings will appear here automatically.
              </p>
              <button
                onClick={() => setCurrentScreen('connections')}
                className="mt-5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5"
              >
                <Settings className="w-3.5 h-3.5" />
                Set up credentials
              </button>
            </div>
          )}

          {/* Empty state: meetings exist but search/filter yields nothing */}
          {meetings.length > 0 && filteredMeetings.length === 0 && (
            <div className="p-12 text-center text-zinc-500 text-xs">
              No meetings match your current search or filter.
            </div>
          )}

          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="p-5 hover:bg-zinc-850/30 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Left: Attendee Info */}
              <div className="flex items-start gap-4 min-w-[320px]">
                {meeting.attendeeAvatar ? (
                  <img
                    src={meeting.attendeeAvatar}
                    alt={meeting.attendeeName}
                    className="w-12 h-12 rounded-full object-cover border border-zinc-700 flex-shrink-0 mt-0.5"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-sm font-semibold text-zinc-300 flex-shrink-0 mt-0.5">
                    {meeting.attendeeName.charAt(0)}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-zinc-100">{meeting.attendeeName}</h3>
                    <span className="text-xs text-zinc-500">•</span>
                    <span className="text-xs text-zinc-300 font-medium">{meeting.attendeeCompany}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{meeting.attendeeRole}</p>
                  <p className="text-xs text-zinc-500 mt-1 font-medium">{meeting.title}</p>
                </div>
              </div>

              {/* Middle: Time & Platform */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-400 pl-16 lg:pl-0">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span className="text-zinc-300 font-medium">{meeting.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-zinc-500" />
                  <span>{meeting.time}</span>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-300">
                  <Video className="w-3.5 h-3.5 text-zinc-400" />
                  <span>{meeting.platform}</span>
                </div>
              </div>

              {/* Right: Status Pill & Action */}
              <div className="flex items-center gap-3 pl-16 lg:pl-0 self-start lg:self-center">
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                  meeting.status === 'Prepared'
                    ? 'bg-emerald-950/70 border border-emerald-800/70 text-emerald-400'
                    : meeting.status === 'In Progress'
                    ? 'bg-amber-950/70 border border-amber-800/70 text-amber-400'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                }`}>
                  {meeting.status}
                </span>

                {meeting.status === 'Prepared' ? (
                  <button
                    onClick={() => viewMeetingPrep(meeting.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span>View Preparation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => viewMeetingPrep(meeting.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5"
                  >
                    <span>Details</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
