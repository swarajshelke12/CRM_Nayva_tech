import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Calendar,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export const HowItWorksModal: React.FC = () => {
  const { isGuideOpen, closeGuide, setCurrentScreen } = useApp();

  if (!isGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-zinc-100">How MeetPrep CRM Works</h2>
              <p className="text-[11px] text-zinc-400">100% automated — zero manual work for you</p>
            </div>
          </div>

          <button
            onClick={closeGuide}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="w-7 h-7 rounded-lg bg-blue-950/60 border border-blue-800/40 text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-zinc-200">1. Schedule as Usual</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Book your calls in Google Calendar like you normally do. The system automatically detects upcoming meetings with no manual data entry.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="w-7 h-7 rounded-lg bg-purple-950/60 border border-purple-800/40 text-purple-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-zinc-200">2. Autonomous AI Research</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  60 minutes prior to your call, AI analyzes past email correspondence and attendee professional background to distill core topics and key opportunities.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MessageSquare className="w-3.5 h-3.5" />
              </div>
              <div className="space-y-0.5">
                <p className="font-semibold text-zinc-200">3. Direct WhatsApp Dispatch</p>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  An executive cheat-sheet with 4 strategic talking points arrives directly on your WhatsApp phone and in this portal before you jump on the call.
                </p>
              </div>
            </div>
          </div>

          {/* 12-Hour Security Callout */}
          <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-start gap-2.5 text-[11px] text-amber-200/90 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-amber-100">🔒 12-Hour Production Vault:</strong> For enterprise privacy, client API credentials are wiped automatically every 12 hours from the portal. Your data is never permanently stored on external database servers.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-zinc-950/80 flex items-center justify-between">
          <button
            onClick={() => {
              closeGuide();
              setCurrentScreen('connections');
            }}
            className="text-xs text-zinc-400 hover:text-zinc-200 font-medium flex items-center gap-1.5 transition-colors"
          >
            <span>Open Setup Form</span>
            <ArrowRight className="w-3 h-3" />
          </button>

          <button
            onClick={closeGuide}
            className="px-4 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-zinc-950" />
            <span>Got It</span>
          </button>
        </div>
      </div>
    </div>
  );
};
