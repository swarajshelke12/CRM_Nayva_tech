import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mail,
  Key,
  Bot,
  Send,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  Lock,
  Pencil,
  X,
  MessageSquare,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Clock,
  RotateCcw,
  Wand2,
  Trash2,
  Edit3,
  Unlock,
  Info,
} from 'lucide-react';
import { LinkedInIcon } from '../common/Icons';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function maskValue(value: string, showLast = 4): string {
  if (!value || value.length <= showLast) return value;
  return '•'.repeat(Math.min(value.length - showLast, 24)) + value.slice(-showLast);
}

function isBlank(value: string): boolean {
  return !value || value.trim() === '';
}

function formatRemainingTime(ms: number): string {
  if (ms <= 0) return '00h 00m 00s';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
}

// ─── Validation Rules ─────────────────────────────────────────────────────────

interface ValidationRule {
  minLength: number;
  maxLength: number;
  prefix?: string;
  suffix?: string;
  patternRegex?: RegExp;
  patternLabel?: string;
  formatExample: string;
}

const CREDENTIAL_VALIDATIONS: Record<string, ValidationRule> = {
  googleClientId: {
    minLength: 50,
    maxLength: 100,
    suffix: '.apps.googleusercontent.com',
    formatExample: '123456789-xxxxx.apps.googleusercontent.com',
  },
  googleClientSecret: {
    minLength: 24,
    maxLength: 50,
    prefix: 'GOCSPX-',
    formatExample: 'GOCSPX-xxxxxxxxxxxxxxxxxxxxxxxx',
  },
  openAiApiKey: {
    minLength: 40,
    maxLength: 200,
    prefix: 'sk-',
    formatExample: 'sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx',
  },
  apifyApiKey: {
    minLength: 30,
    maxLength: 60,
    prefix: 'apify_api_',
    formatExample: 'apify_api_xxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  linkedInCookie: {
    minLength: 40,
    maxLength: 350,
    formatExample: 'li_at=AQEDATxxxxxxxxxxxxxxxxxxxxxxxx',
  },
  whatsAppBusinessId: {
    minLength: 13,
    maxLength: 20,
    patternRegex: /^\d+$/,
    patternLabel: 'numbers only',
    formatExample: '109876543210985',
  },
  whatsAppAccessToken: {
    minLength: 100,
    maxLength: 300,
    prefix: 'EAA',
    formatExample: 'EAAxxxxxxxxxxxxxxxx... (150–200+ characters)',
  },
};

interface ValidationResult {
  valid: boolean;
  message: string;
  severity: 'success' | 'error' | 'idle';
}

function validateCredential(value: string, rules: ValidationRule): ValidationResult {
  if (isBlank(value)) return { valid: true, message: '', severity: 'idle' };

  if (rules.prefix && !value.startsWith(rules.prefix)) {
    return { valid: false, message: `Should start with "${rules.prefix}"`, severity: 'error' };
  }
  if (rules.suffix && !value.endsWith(rules.suffix)) {
    return { valid: false, message: `Should end with "${rules.suffix}"`, severity: 'error' };
  }
  if (rules.patternRegex && !rules.patternRegex.test(value)) {
    return { valid: false, message: `Invalid format — expected ${rules.patternLabel || 'valid characters'}`, severity: 'error' };
  }
  if (value.length < rules.minLength) {
    return { valid: false, message: `Too short — ${value.length} / ${rules.minLength} minimum characters`, severity: 'error' };
  }
  if (value.length > rules.maxLength) {
    return { valid: false, message: `Too long — ${value.length} / ${rules.maxLength} maximum characters`, severity: 'error' };
  }
  return { valid: true, message: `✓ Valid format (${value.length} characters)`, severity: 'success' };
}

// ─── CredentialField ──────────────────────────────────────────────────────────

interface CredentialFieldProps {
  label: string;
  sublabel: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  hint: string;
  fieldKey: string;
  warning?: string;
  disabled?: boolean;
  hidden?: boolean;
}

const CredentialField: React.FC<CredentialFieldProps> = ({
  label,
  sublabel,
  value,
  onChange,
  placeholder,
  hint,
  fieldKey,
  warning,
  disabled = false,
  hidden = false,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [showPlaintext, setShowPlaintext] = useState(false);

  const rules = CREDENTIAL_VALIDATIONS[fieldKey];
  const validation = rules ? validateCredential(value, rules) : null;

  /* ── State: Submitted but NOT revealed ─────────────────────────────────── */
  if (hidden && !isBlank(value)) {
    return (
      <div className="py-3.5 border-b border-zinc-800 last:border-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <div>
            <p className="text-xs font-semibold text-zinc-200">{label}</p>
            <p className="text-[11px] text-zinc-500">{sublabel}</p>
          </div>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex-shrink-0">
            {value.length} chars
          </span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
          <span className="text-xs text-emerald-400 font-medium">
            Credential saved securely — use "Unlock &amp; View" above to reveal
          </span>
        </div>
      </div>
    );
  }

  /* ── State: Locked / Expired ───────────────────────────────────────────── */
  if (disabled) {
    return (
      <div className="py-3.5 border-b border-zinc-800 last:border-0">
        <div className="mb-1.5">
          <p className="text-xs font-semibold text-zinc-200">{label}</p>
          <p className="text-[11px] text-zinc-500">{sublabel}</p>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Lock className="w-3 h-3 text-amber-500 flex-shrink-0" />
          <span className="text-xs text-amber-400 font-mono italic">
            🔒 Purged — credential permanently deleted after 24 h window
          </span>
        </div>
      </div>
    );
  }

  /* ── State: Editable / Not yet submitted ───────────────────────────────── */
  return (
    <div className="py-3.5 border-b border-zinc-800 last:border-0">
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div>
          <p className="text-xs font-semibold text-zinc-200">{label}</p>
          <p className="text-[11px] text-zinc-500">{sublabel}</p>
        </div>
        {!editMode && (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <Pencil className="w-3 h-3" />
            Edit
          </button>
        )}
      </div>

      {editMode ? (
        <div className="space-y-2">
          {/* Password-masked input (always) */}
          <div className="relative">
            <input
              type={showPlaintext ? 'text' : 'password'}
              value={value}
              onChange={e => onChange(e.target.value)}
              placeholder={placeholder}
              autoFocus
              className={`w-full bg-zinc-950 border rounded-lg px-3.5 py-2 text-xs text-zinc-200 font-mono placeholder-zinc-600 focus:outline-none pr-20 ${
                validation && validation.severity === 'error'
                  ? 'border-red-700 ring-1 ring-red-800/60 focus:ring-red-500'
                  : validation && validation.severity === 'success'
                  ? 'border-emerald-700 ring-1 ring-emerald-800/60 focus:ring-emerald-500'
                  : 'border-zinc-700 ring-1 ring-zinc-600 focus:ring-zinc-500'
              }`}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {!isBlank(value) && (
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                  validation && validation.severity === 'error'
                    ? 'text-red-400 bg-red-950/50'
                    : validation && validation.severity === 'success'
                    ? 'text-emerald-400 bg-emerald-950/50'
                    : 'text-zinc-500 bg-zinc-900'
                }`}>
                  {value.length}
                </span>
              )}
              <button
                type="button"
                onClick={() => setShowPlaintext(!showPlaintext)}
                className="text-zinc-500 hover:text-zinc-300 p-0.5"
                title={showPlaintext ? 'Hide' : 'Reveal'}
              >
                {showPlaintext ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Validation feedback */}
          {validation && validation.message && (
            <div className={`flex items-center gap-1.5 text-[11px] ${
              validation.severity === 'error'   ? 'text-red-400' :
              validation.severity === 'success' ? 'text-emerald-400' :
              'text-zinc-500'
            }`}>
              {validation.severity === 'error'   && <AlertTriangle className="w-3 h-3 flex-shrink-0" />}
              {validation.severity === 'success' && <CheckCircle2  className="w-3 h-3 flex-shrink-0" />}
              <span>{validation.message}</span>
            </div>
          )}

          {/* Expected format hint */}
          {rules && (
            <p className="text-[10px] text-zinc-600 font-mono leading-relaxed">
              Expected format: {rules.formatExample} &nbsp;•&nbsp; {rules.minLength}–{rules.maxLength} characters
            </p>
          )}

          <button
            type="button"
            onClick={() => { setEditMode(false); setShowPlaintext(false); }}
            className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center gap-1.5"
          >
            <X className="w-3 h-3" />
            Done
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-2 min-w-0">
          <Lock className="w-3 h-3 text-zinc-700 flex-shrink-0" />
          <span className={`text-xs truncate ${
            isBlank(value)
              ? 'text-zinc-600 italic'
              : 'font-mono text-zinc-400 tracking-wider'
          }`}>
            {isBlank(value) ? 'Not yet entered' : maskValue(value)}
          </span>
          {!isBlank(value) && (
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 flex-shrink-0">
              {value.length} chars
            </span>
          )}
        </div>
      )}

      <p className="text-[11px] text-zinc-600 mt-1.5 leading-relaxed">{hint}</p>

      {warning && (
        <div className="mt-2 flex items-start gap-2 text-[11px] text-amber-500/80 bg-amber-950/20 border border-amber-900/30 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3 h-3 flex-shrink-0 mt-0.5" />
          <span>{warning}</span>
        </div>
      )}
    </div>
  );
};

// ─── GroupCard ─────────────────────────────────────────────────────────────────

interface GroupCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  workflowNodes: string;
  isConfigured: boolean;
  children: React.ReactNode;
}

const GroupCard: React.FC<GroupCardProps> = ({
  icon, title, description, workflowNodes, isConfigured, children
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
      {/* Group Header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-zinc-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 flex-shrink-0">
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
              <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                isConfigured
                  ? 'bg-emerald-950/60 border border-emerald-800/50 text-emerald-400'
                  : 'bg-amber-950/60 border border-amber-800/50 text-amber-400'
              }`}>
                {isConfigured ? 'Configured' : 'Pending'}
              </span>
            </div>
            <p className="text-xs text-zinc-500">{description}</p>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 mt-1 inline-block">
              {workflowNodes}
            </span>
          </div>
        </div>
        {collapsed
          ? <ChevronDown className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          : <ChevronUp className="w-4 h-4 text-zinc-500 flex-shrink-0" />
        }
      </button>

      {/* Fields */}
      {!collapsed && (
        <div className="px-5 pb-2 border-t border-zinc-800">
          {children}
        </div>
      )}
    </div>
  );
};

// ─── ConnectionsView ──────────────────────────────────────────────────────────

export const ConnectionsView: React.FC = () => {
  const {
    credentials,
    updateCredentials,
    simulateLockExpiry,
    resetForNewCredentials,
    deleteCredentials,
    fillDummyCredentials,
    openGuide
  } = useApp();

  // Local input state
  const [googleClientId, setGoogleClientId] = useState(credentials.googleClientId);
  const [googleClientSecret, setGoogleClientSecret] = useState(credentials.googleClientSecret);
  const [openAiApiKey, setOpenAiApiKey] = useState(credentials.openAiApiKey);
  const [apifyApiKey, setApifyApiKey] = useState(credentials.apifyApiKey);
  const [linkedInCookie, setLinkedInCookie] = useState(credentials.linkedInCookie || '');
  const [whatsAppBusinessId, setWhatsAppBusinessId] = useState(credentials.whatsAppBusinessId);
  const [whatsAppAccessToken, setWhatsAppAccessToken] = useState(credentials.whatsAppAccessToken);

  const [submitted, setSubmitted] = useState(false);
  const [remainingMs, setRemainingMs] = useState<number>(0);

  // ★ Controls whether credential values are visible after submission.
  //   Defaults to false — credentials are HIDDEN by default (like OpenAI / Gemini).
  //   User must click "Unlock & View" to reveal within the 24-hour window.
  const [credentialsRevealed, setCredentialsRevealed] = useState(false);

  // Keep local inputs synced with context (e.g. reset, load from storage)
  useEffect(() => {
    setGoogleClientId(credentials.googleClientId);
    setGoogleClientSecret(credentials.googleClientSecret);
    setOpenAiApiKey(credentials.openAiApiKey);
    setApifyApiKey(credentials.apifyApiKey);
    setLinkedInCookie(credentials.linkedInCookie || '');
    setWhatsAppBusinessId(credentials.whatsAppBusinessId);
    setWhatsAppAccessToken(credentials.whatsAppAccessToken);
    // When credentials are reset, unlock state should also reset
    if (credentials.status === 'Not Configured') {
      setCredentialsRevealed(false);
    }
  }, [credentials]);

  // Countdown timer
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

  const isLocked = credentials.status === 'Locked & Expired' || (credentials.expiresAtTimestamp ? Date.now() >= credentials.expiresAtTimestamp : false);
  const isSubmitted = (credentials.status === 'Submitted' || credentials.status === 'Configured') && !isLocked;

  // Whether credential values should be hidden in the UI
  const fieldsHidden = isSubmitted && !credentialsRevealed;

  const googleDone = !isBlank(googleClientId) && !isBlank(googleClientSecret);
  const openAiDone = !isBlank(openAiApiKey);
  const apifyDone  = !isBlank(apifyApiKey);
  const linkedInDone = !isBlank(linkedInCookie);
  const whatsAppDone = !isBlank(whatsAppBusinessId) && !isBlank(whatsAppAccessToken);

  const handleSubmit = () => {
    updateCredentials({
      googleClientId,
      googleClientSecret,
      openAiApiKey,
      apifyApiKey,
      linkedInCookie,
      whatsAppBusinessId,
      whatsAppAccessToken,
    });
    // Immediately hide credentials after submit — like OpenAI/Gemini
    setCredentialsRevealed(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 8000);
  };

  const handleLoadDummyData = () => {
    const dummy = fillDummyCredentials();
    if (dummy.googleClientId) setGoogleClientId(dummy.googleClientId);
    if (dummy.googleClientSecret) setGoogleClientSecret(dummy.googleClientSecret);
    if (dummy.openAiApiKey) setOpenAiApiKey(dummy.openAiApiKey);
    if (dummy.apifyApiKey) setApifyApiKey(dummy.apifyApiKey);
    if (dummy.linkedInCookie) setLinkedInCookie(dummy.linkedInCookie);
    if (dummy.whatsAppBusinessId) setWhatsAppBusinessId(dummy.whatsAppBusinessId);
    if (dummy.whatsAppAccessToken) setWhatsAppAccessToken(dummy.whatsAppAccessToken);
  };

  const handleDeleteCredentials = () => {
    deleteCredentials();
    setCredentialsRevealed(false);
  };

  return (
    <div className="space-y-5 max-w-3xl mx-auto">

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 flex-shrink-0 mt-0.5">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-base font-semibold text-zinc-100">Automation Credentials</h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                isLocked
                  ? 'bg-amber-950/80 border border-amber-800/80 text-amber-400'
                  : isSubmitted
                  ? 'bg-emerald-950/70 border border-emerald-800/70 text-emerald-400'
                  : 'bg-zinc-800 border border-zinc-700 text-zinc-400'
              }`}>
                {isLocked ? '🔒 Locked & Purged' : credentials.status}
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enter your integration keys below. The <strong className="text-zinc-200">Navya Tech Solutions team</strong> configures them inside your background <strong className="text-zinc-200">n8n workflow</strong>.
            </p>
            {credentials.lastSubmitted && (
              <p className="text-[11px] text-zinc-500">Last update: {credentials.lastSubmitted}</p>
            )}
          </div>
          <button
            onClick={openGuide}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-medium border border-amber-500/30 transition-colors flex items-center gap-1.5 flex-shrink-0"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Need Help?</span>
          </button>
        </div>

        {/* Security Badges */}
        <div className="mt-5 pt-4 border-t border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: <Lock className="w-3.5 h-3.5 text-amber-400" />, label: '24-Hour Auto-Purge', sub: 'Keys are deleted from portal after 24 hours' },
            { icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />, label: 'No Database Storage', sub: 'Keys are never saved in permanent databases' },
            { icon: <RotateCcw className="w-3.5 h-3.5 text-blue-400" />, label: 'Fresh Submission Only', sub: 'Expired keys require re-entering new ones' }
          ].map(b => (
            <div key={b.label} className="flex items-start gap-2 text-xs text-zinc-400">
              <div className="flex-shrink-0 mt-0.5">{b.icon}</div>
              <div>
                <p className="font-medium text-zinc-300">{b.label}</p>
                <p className="text-zinc-600 text-[11px]">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Success banner */}
        {submitted && (
          <div className="mt-4 p-3.5 rounded-lg bg-emerald-950/70 border border-emerald-800/70 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-400" />
            <span>
              <strong>Credentials submitted &amp; hidden!</strong> The 24-hour security lock timer is now active. Navya Tech team is linking your keys to your n8n workflow. Your credentials are no longer visible on this page.
            </span>
          </div>
        )}
      </div>

      {/* ── 24-Hour Security Warning Note ─────────────────────────────────── */}
      <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-2">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 text-xs text-amber-200/90 leading-relaxed">
            <p className="font-semibold text-amber-100">⚠️ Important — 24-Hour Credential Access Window</p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-200/80">
              <li>After submitting, your credentials are <strong className="text-amber-100">immediately hidden</strong> from this page — just like OpenAI or Google API dashboards.</li>
              <li>You can use the <strong className="text-amber-100">"Unlock &amp; View"</strong> button to reveal credentials <strong className="text-amber-100">only within the 24-hour window</strong>.</li>
              <li>After 24 hours, all credentials are <strong className="text-amber-100">permanently purged from browser memory</strong>. They cannot be recovered.</li>
              <li>If your current credentials are lost after the 24-hour window, you will need to <strong className="text-amber-100">generate new credentials</strong> from each provider (Google, OpenAI, Apify, LinkedIn, Meta) and re-submit them.</li>
              <li>The Navya Tech team must retrieve and save your keys to the n8n workflow <strong className="text-amber-100">within the 24-hour window</strong>.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── Quick Tools Bar ─────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleLoadDummyData}
            disabled={isLocked}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium border border-zinc-700 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            title="Populate fields with sample test data (correct format & length)"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Fill Sample / Dummy Data</span>
          </button>

          <button
            type="button"
            onClick={() => { resetForNewCredentials(); setCredentialsRevealed(false); }}
            className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium border border-zinc-700 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Unlock fields to edit existing or new credentials"
          >
            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
            <span>Edit / Unlock Form</span>
          </button>

          {/* ★ Unlock & View / Lock button — only shows when credentials are submitted */}
          {isSubmitted && (
            <button
              type="button"
              onClick={() => setCredentialsRevealed(!credentialsRevealed)}
              className={`px-3.5 py-2 rounded-lg font-medium border transition-colors flex items-center gap-1.5 shadow-sm ${
                credentialsRevealed
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
              }`}
              title={credentialsRevealed ? 'Lock and hide credential values' : 'Temporarily reveal credential values'}
            >
              {credentialsRevealed
                ? <><Lock className="w-3.5 h-3.5" /><span>Lock &amp; Hide</span></>
                : <><Unlock className="w-3.5 h-3.5" /><span>Unlock &amp; View</span></>
              }
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleDeleteCredentials}
          className="px-3.5 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-300 font-medium border border-red-900/50 transition-colors flex items-center gap-1.5 shadow-sm"
          title="Delete all stored credentials immediately"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Saved Keys</span>
        </button>
      </div>

      {/* ── Active Countdown Banner ────────────────────────────────────── */}
      {!isLocked && credentials.expiresAtTimestamp && (
        <div className="p-4 rounded-xl bg-zinc-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
              <Clock className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <p className="font-semibold text-zinc-200">24-Hour Security Lock Active</p>
              <p className="text-[11px] text-zinc-400">
                Credentials will be permanently purged when time expires. They are <strong className="text-amber-300">{credentialsRevealed ? 'currently visible' : 'currently hidden'}</strong>.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
            <span className="font-mono text-amber-300 font-bold bg-amber-950/60 px-3 py-1 rounded border border-amber-800/60 text-xs">
              {formatRemainingTime(remainingMs)}
            </span>
            <button
              onClick={simulateLockExpiry}
              className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 text-[11px] font-medium border border-zinc-700 transition-colors"
              title="Simulate immediate 24h expiration for demo"
            >
              Simulate 24h Lock
            </button>
          </div>
        </div>
      )}

      {/* ── LOCKED & EXPIRED Security Banner ──────────────────────────── */}
      {isLocked && (
        <div className="p-5 rounded-xl bg-amber-950/30 border border-amber-800/60 text-amber-200 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-900/40 border border-amber-700/60 text-amber-300 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-semibold text-sm text-amber-100">
                🔒 Credentials Expired &amp; Automatically Purged
              </h3>
              <p className="text-xs text-amber-200/90 leading-relaxed">
                For security reasons, all submitted credentials have been <strong className="text-amber-100">permanently wiped from browser memory &amp; local storage</strong> after the 24-hour window. Neither you nor the tech team can read or extract previously submitted keys.
              </p>
              <p className="text-xs text-amber-300 font-medium mt-1.5">
                → You must generate <strong>new credentials</strong> from each provider and re-submit if the previous ones were not saved during the 24-hour window.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-amber-900/40">
            <p className="text-[11px] text-amber-300/80">
              The background n8n workflow holds its own instance setup. Click below to re-enter fresh credentials.
            </p>
            <button
              type="button"
              onClick={resetForNewCredentials}
              className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold transition-colors flex items-center justify-center gap-2 flex-shrink-0 shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-Enter / Update Credentials</span>
            </button>
          </div>
        </div>
      )}

      {/* ── Credential Groups ──────────────────────────────────────────── */}

      {/* 1. Google Integration */}
      <GroupCard
        icon={<Mail className="w-4 h-4" />}
        title="Google Integration"
        description="Gmail, Google Calendar — OAuth2 via Google Cloud"
        workflowNodes="Check For Upcoming Meetings · Get Last Correspondence · Get Message Contents"
        isConfigured={isSubmitted && googleDone}
      >
        <CredentialField
          label="Google Client ID"
          sublabel="OAuth2 Client ID from Google Cloud Console"
          value={googleClientId}
          onChange={setGoogleClientId}
          fieldKey="googleClientId"
          placeholder="e.g. 123456789012-xxxxxxxxxxxx.apps.googleusercontent.com"
          hint="Create a project in Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID. Enable the Gmail API and Google Calendar API first."
          disabled={isLocked}
          hidden={fieldsHidden}
        />
        <CredentialField
          label="Google Client Secret"
          sublabel="OAuth2 Client Secret from Google Cloud Console"
          value={googleClientSecret}
          onChange={setGoogleClientSecret}
          fieldKey="googleClientSecret"
          placeholder="GOCSPX-••••••••••••••••••••••••••"
          hint="Found alongside the Client ID in Google Cloud Console. Keep this confidential — it authorises your automation workflow to act on behalf of your Google account."
          disabled={isLocked}
          hidden={fieldsHidden}
        />
      </GroupCard>

      {/* 2. OpenAI */}
      <GroupCard
        icon={<Bot className="w-4 h-4" />}
        title="OpenAI API Key"
        description="Powers all 4 AI agents in the workflow (GPT-4o)"
        workflowNodes="Extract Attendee Info · Correspondence Recap · Attendee Research Agent · LinkedIn Summarizer"
        isConfigured={isSubmitted && openAiDone}
      >
        <CredentialField
          label="OpenAI API Key"
          sublabel="Secret key from platform.openai.com"
          value={openAiApiKey}
          onChange={setOpenAiApiKey}
          fieldKey="openAiApiKey"
          placeholder="sk-proj-••••••••••••••••"
          hint="Used exclusively for your private briefing prompts. Model: gpt-4o-2024-08-06. No data is shared with public AI training pipelines."
          disabled={isLocked}
          hidden={fieldsHidden}
        />
      </GroupCard>

      {/* 3. Apify */}
      <GroupCard
        icon={<Key className="w-4 h-4" />}
        title="Apify API Key"
        description="LinkedIn profile scraping via Apify Web Scraper"
        workflowNodes="APIFY Web Scraper"
        isConfigured={isSubmitted && apifyDone}
      >
        <CredentialField
          label="Apify API Key"
          sublabel="Found in your Apify Console → Settings → Integrations"
          value={apifyApiKey}
          onChange={setApifyApiKey}
          fieldKey="apifyApiKey"
          placeholder="apify_api_••••••••••••••••"
          hint="Navya Tech will configure the Apify Web Scraper actor in your automation workflow to run under your Apify account. Free tier includes $5/month credit."
          disabled={isLocked}
          hidden={fieldsHidden}
        />
      </GroupCard>

      {/* 4. LinkedIn Session Cookie */}
      <GroupCard
        icon={<LinkedInIcon className="w-4 h-4 text-[#0A66C2]" />}
        title="LinkedIn Session Cookie"
        description="Browser session cookie that authenticates attendee profile scraping"
        workflowNodes="Set LinkedIn Cookie · Apify Web Scraper"
        isConfigured={isSubmitted && linkedInDone}
      >
        <CredentialField
          label="LinkedIn li_at Cookie"
          sublabel="Session cookie from your browser DevTools"
          value={linkedInCookie}
          onChange={setLinkedInCookie}
          fieldKey="linkedInCookie"
          placeholder="li_at=AQEDATxxxxxxxxxxxxxxxxxxxxxxxx"
          hint='To get this: log into LinkedIn → open browser DevTools (F12) → Application tab → Cookies (https://www.linkedin.com) → copy the value of the "li_at" cookie. Paste the full string including "li_at=" prefix.'
          warning="LinkedIn Security Recommendation: For production use, consider using a dedicated secondary LinkedIn account rather than your primary personal profile."
          disabled={isLocked}
          hidden={fieldsHidden}
        />
      </GroupCard>

      {/* 5. WhatsApp Business Cloud */}
      <GroupCard
        icon={<MessageSquare className="w-4 h-4" />}
        title="WhatsApp Business Cloud"
        description="Meta Business API — sends meeting briefings to your WhatsApp"
        workflowNodes="WhatsApp Business Cloud"
        isConfigured={isSubmitted && whatsAppDone}
      >
        <CredentialField
          label="WhatsApp Business ID"
          sublabel="Your Meta Business Account ID"
          value={whatsAppBusinessId}
          onChange={setWhatsAppBusinessId}
          fieldKey="whatsAppBusinessId"
          placeholder="e.g. 109876543210985"
          hint="Found in Meta Business Manager → Business Settings → Business Info → Business Account ID."
          disabled={isLocked}
          hidden={fieldsHidden}
        />
        <CredentialField
          label="WhatsApp Access Token"
          sublabel="Permanent / long-lived access token from Meta"
          value={whatsAppAccessToken}
          onChange={setWhatsAppAccessToken}
          fieldKey="whatsAppAccessToken"
          placeholder="EAAxxxxxxxxxxxxxxxxxxxxxxxx..."
          hint="Generate a permanent token in Meta Business Manager → System Users → Generate Token. Ensure the token has whatsapp_business_messaging and whatsapp_business_management permissions."
          disabled={isLocked}
          hidden={fieldsHidden}
        />
      </GroupCard>

      {/* ── Submit / Action Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
        <div className="text-xs text-zinc-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>24-Hour Auto-Purge Protection Active</span>
        </div>
        {isLocked ? (
          <button
            type="button"
            onClick={resetForNewCredentials}
            className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Unlock Form &amp; Enter New Keys</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Submit / Update Credentials</span>
          </button>
        )}
      </div>

    </div>
  );
};
