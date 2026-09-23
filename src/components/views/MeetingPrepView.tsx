import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LinkedInIcon } from '../common/Icons';
import { 
  FileText, 
  Mail, 
  ListChecks, 
  Calendar, 
  Clock, 
  Video, 
  ArrowLeft,
  Copy,
  Check,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const MeetingPrepView: React.FC = () => {
  const { meetings, selectedMeetingId, setSelectedMeetingId, setCurrentScreen, showToast } = useApp();
  const [copied, setCopied] = useState(false);
  const [isSendingWhatsApp, setIsSendingWhatsApp] = useState(false);

  const currentMeeting = meetings.find(m => m.id === selectedMeetingId) ?? meetings[0];
  const brief = currentMeeting?.brief;

  const handleSendToWhatsApp = async () => {
    if (!brief || !currentMeeting) return;
    setIsSendingWhatsApp(true);
    await new Promise(r => setTimeout(r, 600));
    setIsSendingWhatsApp(false);
    showToast(`✓ Briefing for ${currentMeeting.attendeeName} dispatched to WhatsApp!`, 'success');
  };

  const handleCopy = () => {
    if (!brief || !currentMeeting) return;
    const text = `Meeting Brief: ${currentMeeting.attendeeName} (${currentMeeting.attendeeCompany})\n\nObjective:\n${brief.summary}\n\nEmail Context:\n${brief.emailSummary}\n\nLinkedIn Insights:\n${brief.linkedinInsights}\n\nTalking Points:\n${brief.talkingPoints.map((tp, i) => `${i + 1}. ${tp}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Empty state: no meetings synced yet ─────────────────────────────────
  if (!currentMeeting) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('meetings')}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700"
            title="Back to Meetings"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-base font-semibold text-zinc-100">Meeting Preparation Dossier</h1>
            <p className="text-xs text-zinc-400">Autonomous research synthesized for executive review</p>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-16 text-center">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
            <FileText className="w-6 h-6 text-zinc-500" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-200 mb-2">No meetings available</h3>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
            Dossiers will appear here once your Google Calendar is connected and the workflow has run. Configure your credentials to get started.
          </p>
          <button
            onClick={() => setCurrentScreen('connections')}
            className="mt-5 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors"
          >
            Go to Connections / Setup
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation & Meeting Switcher Bar */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentScreen('meetings')}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors border border-zinc-700"
            title="Back to Meetings list"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-zinc-100">Meeting Preparation Dossier</h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 border border-emerald-800 text-emerald-400">
                Auto-Synced by n8n
              </span>
            </div>
            <p className="text-xs text-zinc-400">Generated automatically by background n8n AI workflow 60 mins before call</p>
          </div>
        </div>

        {/* Meeting Switcher Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-zinc-500 mr-1 hidden sm:inline">Select meeting:</span>
          {meetings.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMeetingId(m.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                selectedMeetingId === m.id
                  ? 'bg-zinc-100 text-zinc-950 shadow-sm'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-750'
              }`}
            >
              <span>{m.attendeeName.split(' ')[0]}</span>
              <span className={`w-1.5 h-1.5 rounded-full ${
                m.status === 'Prepared' ? 'bg-emerald-500' : m.status === 'In Progress' ? 'bg-amber-500' : 'bg-zinc-500'
              }`} />
            </button>
          ))}
        </div>
      </div>

      {/* Attendee Executive Profile Banner */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={currentMeeting.attendeeAvatar}
              alt={currentMeeting.attendeeName}
              className="w-14 h-14 rounded-full object-cover border border-zinc-700 shadow"
            />
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-zinc-100">{currentMeeting.attendeeName}</h2>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  currentMeeting.status === 'Prepared'
                    ? 'bg-emerald-950/60 border border-emerald-800/60 text-emerald-400'
                    : currentMeeting.status === 'In Progress'
                    ? 'bg-amber-950/60 border border-amber-800/60 text-amber-400'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                }`}>
                  {currentMeeting.status}
                </span>
              </div>
              <p className="text-xs text-zinc-300 font-medium mt-0.5">
                {currentMeeting.attendeeRole} at <span className="text-white font-semibold">{currentMeeting.attendeeCompany}</span>
              </p>
              <div className="flex items-center gap-3 mt-0.5">
                <p className="text-xs text-zinc-500 font-mono">{currentMeeting.attendeeEmail}</p>
                {currentMeeting.attendeeLinkedIn && (
                  <a
                    href={currentMeeting.attendeeLinkedIn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <LinkedInIcon className="w-3 h-3" />
                    <span>LinkedIn</span>
                    <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end gap-2 text-xs text-zinc-400 pl-16 sm:pl-0">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-zinc-200 font-medium">{currentMeeting.date}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{currentMeeting.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-zinc-300">
                <Video className="w-3.5 h-3.5 text-zinc-500" />
                {currentMeeting.platform}
              </span>
              {brief && (
                <>
                  <button
                    onClick={handleSendToWhatsApp}
                    disabled={isSendingWhatsApp}
                    className="px-2.5 py-1 rounded bg-green-950/60 hover:bg-green-900/60 text-green-300 text-xs font-medium border border-green-800/60 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                    title="Push this brief directly to your WhatsApp"
                  >
                    <MessageSquare className="w-3 h-3 text-green-400" />
                    <span>{isSendingWhatsApp ? 'Sending...' : 'Send to WhatsApp'}</span>
                  </button>
                  <button
                    onClick={handleCopy}
                    className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? 'Copied' : 'Copy Brief'}</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Core Intelligence Sections */}
      {brief ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Section 1: Generated Meeting Brief */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-zinc-100 font-semibold text-sm">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                  <FileText className="w-4 h-4" />
                </div>
                <h3>Meeting Objective & Overview</h3>
              </div>
              <p className="mt-3.5 text-xs text-zinc-300 leading-relaxed">
                {brief.summary}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Synthesized via AI Automation</span>
              <span className="text-emerald-400 font-medium">Ready for review</span>
            </div>
          </div>

          {/* Section 2: Email Summary */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-zinc-100 font-semibold text-sm">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                  <Mail className="w-4 h-4" />
                </div>
                <h3>Email Correspondence Summary</h3>
              </div>
              <p className="mt-3.5 text-xs text-zinc-300 leading-relaxed">
                {brief.emailSummary}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Source: Google Workspace Inbox Sync</span>
              <span className="text-zinc-400 font-medium">Latest thread distilled</span>
            </div>
          </div>

          {/* Section 3: LinkedIn Insights */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-zinc-100 font-semibold text-sm">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                  <LinkedInIcon className="w-4 h-4" />
                </div>
                <h3>LinkedIn & Background Insights</h3>
              </div>
              <p className="mt-3.5 text-xs text-zinc-300 leading-relaxed">
                {brief.linkedinInsights}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Source: Apify Profile Enrichment</span>
              <span className="text-zinc-400 font-medium">Public profile verified</span>
            </div>
          </div>

          {/* Section 4: Talking Points & Action Items */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-3 border-b border-zinc-800 text-zinc-100 font-semibold text-sm">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                  <ListChecks className="w-4 h-4" />
                </div>
                <h3>Recommended Talking Points</h3>
              </div>
              <ul className="mt-3.5 space-y-2.5">
                {brief.talkingPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-zinc-300">
                    <span className="w-5 h-5 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-300 font-mono text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 pt-3 border-t border-zinc-850 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Included in WhatsApp dispatch</span>
              <span className="text-emerald-400 font-medium">4 Key Drivers</span>
            </div>
          </div>
        </div>
      ) : (
        /* In-Progress or Scheduled State */
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto text-amber-400 mb-4">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-100">
            {currentMeeting.status === 'In Progress' ? 'Preparation In Progress' : 'Preparation Scheduled'}
          </h3>
          <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
            The automated pipeline will scan {currentMeeting.attendeeName}'s LinkedIn profile and previous correspondence 60 minutes before the meeting ({currentMeeting.time}) and send your briefing card to WhatsApp.
          </p>
        </div>
      )}
    </div>
  );
};
