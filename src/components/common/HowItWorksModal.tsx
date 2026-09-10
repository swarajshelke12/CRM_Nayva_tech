import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  HelpCircle,
  X,
  Calendar,
  Mail,
  Bot,
  MessageSquare,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const HowItWorksModal: React.FC = () => {
  const { isGuideOpen, closeGuide, setCurrentScreen, credentials } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'n8n' | 'setup'>('overview');

  if (!isGuideOpen) return null;

  const isConfigured = credentials.status === 'Configured' || credentials.status === 'Submitted';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-750 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-zinc-100">Non-Technical User Guide</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 border border-emerald-800 text-emerald-400">
                  n8n Powered
                </span>
              </div>
              <p className="text-xs text-zinc-400">How your automated meeting preparation system works for you</p>
            </div>
          </div>

          <button
            onClick={closeGuide}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-zinc-950/40 border-b border-zinc-800 flex items-center gap-2 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>1. What Is This App?</span>
          </button>
          <button
            onClick={() => setActiveTab('n8n')}
            className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'n8n'
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-400" />
            <span>2. How n8n Automation Works</span>
          </button>
          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2.5 font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'setup'
                ? 'border-zinc-100 text-zinc-100'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>3. Simple 3-Step Action Plan</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-zinc-300 leading-relaxed">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2">
                <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
                  <span>💡 Designed for Business Executives & Sales Leaders</span>
                </h3>
                <p className="text-zinc-400 text-xs">
                  You don't need any technical skills to use MeetPrep CRM. The backend automation engine (<strong className="text-zinc-200">n8n</strong>) works invisibly in the cloud. All you need to do is schedule your calls in Google Calendar and check your WhatsApp or this dashboard before your meeting!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-400 flex items-center justify-center font-bold">
                    1
                  </div>
                  <h4 className="font-semibold text-zinc-200 text-xs">No Manual Data Entry</h4>
                  <p className="text-[11px] text-zinc-400">
                    No need to copy-paste attendee details or read through dozens of old email threads.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-950/60 border border-amber-800/50 text-amber-400 flex items-center justify-center font-bold">
                    2
                  </div>
                  <h4 className="font-semibold text-zinc-200 text-xs">Delivered to WhatsApp</h4>
                  <p className="text-[11px] text-zinc-400">
                    Receive full executive dossier summaries on your phone 60 minutes before your call.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 flex items-center justify-center font-bold">
                    3
                  </div>
                  <h4 className="font-semibold text-zinc-200 text-xs">Centralized Web Dashboard</h4>
                  <p className="text-[11px] text-zinc-400">
                    Review past dossiers, check upcoming schedules, and manage API credentials anytime here.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/40 text-emerald-200 flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Setup Status: {isConfigured ? 'Connected & Ready' : 'Pending Credentials'}</p>
                  <p className="text-[11px] text-emerald-300/80 mt-0.5">
                    {isConfigured
                      ? 'Your credentials are ready. The n8n background workflow automatically prepares your meeting briefs.'
                      : 'You just need to complete the 1-time setup page to link your Google & WhatsApp accounts.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HOW N8N WORKS */}
          {activeTab === 'n8n' && (
            <div className="space-y-5">
              <p className="text-zinc-400">
                Behind the scenes, <strong className="text-zinc-200">n8n</strong> is an enterprise workflow engine configured by Navya Tech Solutions. Here is the exact 4-step chain running automatically in the background:
              </p>

              {/* Step Flow Diagram */}
              <div className="space-y-3">
                
                {/* Step 1 */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-zinc-200 text-xs">Step 1: Google Calendar Watcher</h4>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Runs hourly</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      n8n connects to your Google Calendar via OAuth2 and scans for meetings starting in the next 60 minutes.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-zinc-200 text-xs">Step 2: Email & Web Research</h4>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Gmail + Apify</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      n8n automatically fetches the latest email correspondence with the attendee and searches Apify for public background info.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-zinc-200 text-xs">Step 3: AI Intelligence Chain (GPT-4o)</h4>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">4 AI Nodes</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      GPT-4o distills the meeting objective, summarizes the email context, pulls career highlights, and generates 4 actionable talking points.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageSquare className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-zinc-200 text-xs">Step 4: Dual Dispatch (WhatsApp & App)</h4>
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">Meta WhatsApp API</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                      The dossier is dispatched to your personal WhatsApp chat 1 hour before the meeting starts and saved to this dashboard.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 3: SETUP ACTION PLAN */}
          {activeTab === 'setup' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 space-y-3">
                <h3 className="text-sm font-semibold text-zinc-100">All You Need To Do (3 Steps)</h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-200 font-semibold text-xs flex items-center justify-center flex-shrink-0">1</span>
                    <div>
                      <p className="font-semibold text-zinc-200">Go to "Connections / Setup"</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Open the setup screen from the left sidebar or top right button.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-200 font-semibold text-xs flex items-center justify-center flex-shrink-0">2</span>
                    <div>
                      <p className="font-semibold text-zinc-200">Paste Your 4 Integration Keys</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Google Client ID & Secret, OpenAI Key, Apify Key, and WhatsApp Access Token. (Clear step-by-step instructions are provided for each key).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900 border border-zinc-800">
                    <span className="w-6 h-6 rounded-full bg-zinc-800 text-zinc-200 font-semibold text-xs flex items-center justify-center flex-shrink-0">3</span>
                    <div>
                      <p className="font-semibold text-zinc-200">Click "Submit Credentials"</p>
                      <p className="text-[11px] text-zinc-400 mt-0.5">
                        Navya Tech engineers link your private n8n cloud instance. From then on, your meeting prep runs 100% automatically!
                      </p>
                    </div>
                  </div>
                </div>

                {/* 24-Hour Security Lock Callout */}
                <div className="p-3.5 rounded-lg bg-amber-950/30 border border-amber-800/40 text-amber-200 text-[11px] leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-100">🔒 24-Hour Security Lock Guarantee:</span>
                    {' '}Submitted keys are automatically purged from this web portal after 24 hours. After 24 hours, neither client nor tech team can access or read previous keys, keeping your API secrets 100% safe without permanent database storage.
                  </div>
                </div>
              </div>

              {/* Direct Setup Link */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-800/40 border border-zinc-700">
                <div>
                  <p className="font-semibold text-zinc-100 text-xs">Ready to complete setup?</p>
                  <p className="text-[11px] text-zinc-400">Click below to open the setup form now.</p>
                </div>
                <button
                  onClick={() => {
                    closeGuide();
                    setCurrentScreen('connections');
                  }}
                  className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Go to Setup Page</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Managed AI Client Portal · Navya Tech Solutions</span>
          </div>

          <button
            onClick={closeGuide}
            className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
