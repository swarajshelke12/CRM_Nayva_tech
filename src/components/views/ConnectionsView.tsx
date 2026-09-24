import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Bot,
  Key,
  MessageSquare,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  ArrowRight,
  RotateCcw,
  Send,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

function formatRemainingTime(ms: number): string {
  if (ms <= 0) return '00h 00m 00s';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
}

interface SimpleFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  hint?: string;
  isPassword?: boolean;
}

const SimpleField: React.FC<SimpleFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  hint,
  isPassword = true
}) => {
  const [show, setShow] = useState(false);
  const isFilled = value.trim().length > 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
          <span>{label}</span>
          {isFilled && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
        </label>
        {hint && <span className="text-[11px] text-zinc-500">{hint}</span>}
      </div>

      <div className="relative">
        <input
          type={isPassword && !show ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-zinc-950 border rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all pr-10 font-mono ${
            isFilled
              ? 'border-emerald-800/60 focus:border-emerald-500 ring-1 ring-emerald-900/30'
              : 'border-zinc-800 focus:border-zinc-600'
          }`}
        />
        {isPassword && isFilled && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
            title={show ? 'Hide value' : 'Show value'}
          >
            {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
};

export const ConnectionsView: React.FC = () => {
  const {
    credentials,
    updateCredentials,
    resetForNewCredentials,
    setCurrentScreen,
    openGuide,
    testWhatsAppAlert
  } = useApp();

  const [form, setForm] = useState(credentials);
  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [showAdvancedHelp, setShowAdvancedHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);

  useEffect(() => {
    setForm(credentials);
  }, [credentials]);

  useEffect(() => {
    const updateTimer = () => {
      if (credentials.expiresAtTimestamp) {
        const diff = credentials.expiresAtTimestamp - Date.now();
        setRemainingMs(Math.max(0, diff));
      } else {
        setRemainingMs(0);
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [credentials.expiresAtTimestamp]);

  const setField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isLocked =
    credentials.status === 'Locked & Expired' ||
    (credentials.expiresAtTimestamp ? Date.now() >= credentials.expiresAtTimestamp : false);

  const isConfigured =
    (credentials.status === 'Submitted' || credentials.status === 'Configured') && !isLocked;

  const countFilled = [
    form.googleClientId && form.googleClientSecret,
    form.openAiApiKey,
    form.apifyApiKey,
    form.whatsAppBusinessId && form.whatsAppAccessToken
  ].filter(Boolean).length;

  const handleSaveAndContinue = async () => {
    setIsSaving(true);
    await updateCredentials(form);
    setIsSaving(false);
    setCurrentScreen('dashboard');
  };

  const handleTestWhatsApp = async () => {
    setIsTestingWhatsApp(true);
    await testWhatsAppAlert();
    setIsTestingWhatsApp(false);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-semibold text-zinc-100">Setup &amp; Connections</h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${
                  isConfigured
                    ? 'bg-emerald-950/70 border border-emerald-800/70 text-emerald-400'
                    : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
                }`}
              >
                {isConfigured ? '🟢 Production Active' : `${countFilled} of 4 Ready`}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Enter your service keys once. All briefings and WhatsApp alerts run automatically in the background.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={openGuide}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium border border-zinc-700 transition-colors"
            >
              Help Guide
            </button>
          </div>
        </div>

        {/* 12-Hour Ephemeral Privacy Assurance */}
        <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong className="text-zinc-200">12-Hour Zero-Knowledge Vault:</strong> Keys are held in temporary memory and auto-purged every 12 hours. Zero permanent database storage.
            </span>
          </div>
          {isConfigured && credentials.expiresAtTimestamp && (
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] bg-amber-950/40 px-2.5 py-1 rounded border border-amber-900/50 flex-shrink-0">
              <Clock className="w-3 h-3" />
              <span>Auto-purges in: {formatRemainingTime(remainingMs)}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── 4 Crisp, Clean Connection Cards ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Google Calendar & Gmail */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-950/50 border border-blue-900/50 flex items-center justify-center text-blue-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100">Google Calendar &amp; Gmail</h3>
                <p className="text-[11px] text-zinc-500">Reads upcoming invites &amp; email threads</p>
              </div>
            </div>
            {form.googleClientId && form.googleClientSecret ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Configured" />
            ) : (
              <span className="text-[10px] text-amber-400 font-medium">Pending</span>
            )}
          </div>

          <SimpleField
            label="Client ID"
            value={form.googleClientId}
            onChange={(val) => setField('googleClientId', val)}
            placeholder="xxxxxx.apps.googleusercontent.com"
          />
          <SimpleField
            label="Client Secret"
            value={form.googleClientSecret}
            onChange={(val) => setField('googleClientSecret', val)}
            placeholder="GOCSPX-xxxxxx"
          />
        </div>

        {/* Card 2: AI Intelligence (OpenAI) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-950/50 border border-purple-900/50 flex items-center justify-center text-purple-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100">AI Intelligence (GPT-4o)</h3>
                <p className="text-[11px] text-zinc-500">Synthesizes dossiers &amp; talking points</p>
              </div>
            </div>
            {form.openAiApiKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Configured" />
            ) : (
              <span className="text-[10px] text-amber-400 font-medium">Pending</span>
            )}
          </div>

          <SimpleField
            label="OpenAI API Key"
            value={form.openAiApiKey}
            onChange={(val) => setField('openAiApiKey', val)}
            placeholder="sk-proj-xxxxxxxxxxxx"
            hint="Private key"
          />
          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-500 leading-snug">
            Your key generates 4 executive talking points per meeting and is never used for model training.
          </div>
        </div>

        {/* Card 3: Executive Research (Apify & LinkedIn) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-950/50 border border-emerald-900/50 flex items-center justify-center text-emerald-400">
                <Key className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100">Attendee Research (Apify)</h3>
                <p className="text-[11px] text-zinc-500">Pulls attendee career &amp; company background</p>
              </div>
            </div>
            {form.apifyApiKey ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Configured" />
            ) : (
              <span className="text-[10px] text-amber-400 font-medium">Pending</span>
            )}
          </div>

          <SimpleField
            label="Apify API Key"
            value={form.apifyApiKey}
            onChange={(val) => setField('apifyApiKey', val)}
            placeholder="apify_api_xxxxxxxxxxxx"
          />
          <SimpleField
            label="LinkedIn Cookie (Optional)"
            value={form.linkedInCookie || ''}
            onChange={(val) => setField('linkedInCookie', val)}
            placeholder="li_at=AQEDAT..."
            hint="For deep profile context"
          />
        </div>

        {/* Card 4: WhatsApp Alerts (Meta Cloud) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-green-950/50 border border-green-900/50 flex items-center justify-center text-green-400">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-zinc-100">WhatsApp Dispatch</h3>
                <p className="text-[11px] text-zinc-500">Delivers briefings 60m before every call</p>
              </div>
            </div>
            {form.whatsAppBusinessId && form.whatsAppAccessToken ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Configured" />
            ) : (
              <span className="text-[10px] text-amber-400 font-medium">Pending</span>
            )}
          </div>

          <SimpleField
            label="WhatsApp Business ID"
            value={form.whatsAppBusinessId}
            onChange={(val) => setField('whatsAppBusinessId', val)}
            placeholder="15-digit Meta Business ID"
            isPassword={false}
          />
          <SimpleField
            label="WhatsApp Access Token"
            value={form.whatsAppAccessToken}
            onChange={(val) => setField('whatsAppAccessToken', val)}
            placeholder="EAAxxxxxxxxxxxxxxxxxxxx"
          />

          {form.whatsAppBusinessId && form.whatsAppAccessToken && (
            <button
              type="button"
              onClick={handleTestWhatsApp}
              disabled={isTestingWhatsApp}
              className="w-full mt-2 py-1.5 px-3 rounded-lg bg-green-950/40 hover:bg-green-900/40 text-green-300 text-xs font-medium border border-green-800/40 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Send className="w-3 h-3 text-green-400" />
              <span>{isTestingWhatsApp ? 'Dispatching Test Message...' : 'Send Test WhatsApp Briefing'}</span>
            </button>
          )}
        </div>
      </div>

      {/* ── Expandable Step-by-Step Helper (Keeps page clean by default) ──────── */}
      <div className="border border-zinc-800/80 rounded-xl bg-zinc-950/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvancedHelp(!showAdvancedHelp)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>Where do I find these credentials?</span>
          </span>
          {showAdvancedHelp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvancedHelp && (
          <div className="p-4 pt-1 border-t border-zinc-800 text-xs text-zinc-400 space-y-2.5 leading-relaxed bg-zinc-950/80">
            <p>• <strong>Google:</strong> In Google Cloud Console → APIs &amp; Services → Credentials → OAuth 2.0 Client ID (Gmail &amp; Calendar enabled).</p>
            <p>• <strong>OpenAI:</strong> From your OpenAI Dashboard (<span className="text-zinc-300">platform.openai.com</span>) under API Keys.</p>
            <p>• <strong>Apify:</strong> From Apify Console → Settings → Integrations.</p>
            <p>• <strong>WhatsApp:</strong> From Meta Business Manager → System Users → Generate Token with WhatsApp permissions.</p>
          </div>
        )}
      </div>

      {/* ── Primary Action Bar ──────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Timeline: <strong>12-Hour Production Vault</strong></span>
        </div>

        <div className="flex items-center gap-2.5 justify-end">
          {isConfigured && (
            <button
              type="button"
              onClick={() => {
                resetForNewCredentials();
              }}
              className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5"
              title="Clear credentials to re-enter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
          >
            <span>{isSaving ? 'Securing & Activating...' : 'Save & Continue to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
