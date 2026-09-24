import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import type { WorkflowCredentials } from '../../types';
import {
  Mail,
  Bot,
  Key,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock,
  ArrowRight,
  RotateCcw,
  Send,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Zap
} from 'lucide-react';

function formatRemainingTime(ms: number): string {
  if (ms <= 0) return '00h 00m 00s';
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
}

export type FieldKey =
  | 'googleClientId'
  | 'googleClientSecret'
  | 'openAiApiKey'
  | 'apifyApiKey'
  | 'linkedInCookie'
  | 'whatsAppBusinessId'
  | 'whatsAppAccessToken'
  | 'whatsAppRecipientPhone';

export type FieldErrors = Partial<Record<FieldKey, string>>;

export function validateSingleField(field: FieldKey, rawValue: string | undefined): string | undefined {
  const val = rawValue ? rawValue.trim() : '';

  switch (field) {
    case 'googleClientId':
      if (!val) return 'This field is remaining: Enter your Google Client ID.';
      if (val.length < 15 || (!val.includes('.apps.googleusercontent.com') && val.length < 20)) {
        return 'Invalid format: Must be a valid Google Client ID (e.g. xxxxx.apps.googleusercontent.com).';
      }
      return undefined;

    case 'googleClientSecret':
      if (!val) return 'This field is remaining: Enter your Google Client Secret.';
      if (val.length < 8) {
        return 'Invalid format: Client Secret must be at least 8 characters (e.g. GOCSPX-xxxxxx).';
      }
      return undefined;

    case 'openAiApiKey':
      if (!val) return 'This field is remaining: Enter your OpenAI API Key.';
      if (!val.startsWith('sk-') || val.length < 20) {
        return 'Invalid format: Must start with "sk-" and be at least 20 characters.';
      }
      return undefined;

    case 'apifyApiKey':
      if (!val) return 'This field is remaining: Enter your Apify API Key.';
      if (!val.startsWith('apify_') || val.length < 15) {
        return 'Invalid format: Must start with "apify_api_" or "apify_" (min 15 chars).';
      }
      return undefined;

    case 'whatsAppBusinessId':
      if (!val) return 'This field is remaining: Enter your Meta Phone Number ID.';
      if (!/^\d{10,20}$/.test(val.replace(/\D/g, ''))) {
        return 'Invalid format: Must be the 10-20 digit numeric Phone Number ID from Meta Dev Portal.';
      }
      return undefined;

    case 'whatsAppAccessToken':
      if (!val) return 'This field is remaining: Enter your WhatsApp Access Token.';
      if (!val.startsWith('EAA') || val.length < 25) {
        return 'Invalid format: Meta Access Token must start with "EAA..." (min 25 chars).';
      }
      return undefined;

    case 'whatsAppRecipientPhone':
      if (val && !/^\+?\d{8,16}$/.test(val.replace(/[\s()-]/g, ''))) {
        return 'Invalid format: Must include country code (e.g. 919876543210 or +12345678900).';
      }
      return undefined;

    case 'linkedInCookie':
      if (val && val.length < 8) {
        return 'Invalid format: LinkedIn cookie must be a valid li_at string (min 8 chars).';
      }
      return undefined;

    default:
      return undefined;
  }
}

export function validateAllFields(form: WorkflowCredentials): {
  errors: FieldErrors;
  isValid: boolean;
  remainingCount: number;
  formatErrorCount: number;
  summaryMessage: string;
} {
  const errors: FieldErrors = {};
  let remainingCount = 0;
  let formatErrorCount = 0;

  const requiredKeys: FieldKey[] = [
    'googleClientId',
    'googleClientSecret',
    'openAiApiKey',
    'apifyApiKey',
    'whatsAppBusinessId',
    'whatsAppAccessToken'
  ];

  requiredKeys.forEach((key) => {
    const val = (form[key as keyof WorkflowCredentials] as string) || '';
    if (!val.trim()) {
      errors[key] = 'This field is remaining: Please enter your credential.';
      remainingCount++;
    } else {
      const err = validateSingleField(key, val);
      if (err) {
        errors[key] = err;
        formatErrorCount++;
      }
    }
  });

  if (form.whatsAppRecipientPhone?.trim()) {
    const err = validateSingleField('whatsAppRecipientPhone', form.whatsAppRecipientPhone);
    if (err) {
      errors.whatsAppRecipientPhone = err;
      formatErrorCount++;
    }
  }

  if (form.linkedInCookie?.trim()) {
    const err = validateSingleField('linkedInCookie', form.linkedInCookie);
    if (err) {
      errors.linkedInCookie = err;
      formatErrorCount++;
    }
  }

  const isValid = Object.keys(errors).length === 0;

  let summaryMessage = '';
  if (!isValid) {
    if (remainingCount === 6) {
      summaryMessage = 'Cannot activate: All 6 required credential fields are remaining.';
    } else if (remainingCount > 0 && formatErrorCount > 0) {
      summaryMessage = `Cannot activate: ${remainingCount} field(s) remaining and ${formatErrorCount} invalid format(s).`;
    } else if (remainingCount > 0) {
      summaryMessage = `Cannot activate: ${remainingCount} required credential field(s) remaining.`;
    } else {
      summaryMessage = 'Cannot activate: Please correct invalid credential formats highlighted below.';
    }
  }

  return { errors, isValid, remainingCount, formatErrorCount, summaryMessage };
}

interface SimpleFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder: string;
  hint?: string;
  isPassword?: boolean;
  error?: string;
  isValid?: boolean;
  required?: boolean;
}

const SimpleField: React.FC<SimpleFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  hint,
  isPassword = true,
  error,
  isValid = false,
  required = true
}) => {
  const [show, setShow] = useState(false);
  const isFilled = value.trim().length > 0;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-zinc-300 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-amber-400 text-xs" title="Required field">*</span>}
          {isValid && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
          {error && <AlertCircle className="w-3.5 h-3.5 text-red-400" />}
        </label>
        {hint && <span className="text-[11px] text-zinc-500">{hint}</span>}
      </div>

      <div className="relative">
        <input
          type={isPassword && !show ? 'password' : 'text'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full bg-zinc-950 border rounded-lg px-3.5 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none transition-all pr-10 font-mono ${
            error
              ? 'border-red-500/80 focus:border-red-500 ring-1 ring-red-900/40 bg-red-950/15'
              : isValid
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

      {error && (
        <p className="text-[11px] text-red-400 flex items-center gap-1.5 mt-1 leading-tight animate-in fade-in duration-150">
          <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
          <span>{error}</span>
        </p>
      )}
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
    testWhatsAppAlert,
    showToast
  } = useApp();

  const [form, setForm] = useState<WorkflowCredentials>(credentials);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const [remainingMs, setRemainingMs] = useState<number>(0);
  const [showAdvancedHelp, setShowAdvancedHelp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);
  const [webhookUrl, setWebhookUrlState] = useState<string>(() => {
    try {
      return localStorage.getItem('meetprep_webhook_url') || (import.meta as any).env?.VITE_N8N_WEBHOOK_URL || '';
    } catch {
      return '';
    }
  });

  const handleUpdateWebhookUrl = (url: string) => {
    setWebhookUrlState(url);
    try {
      if (url.trim()) {
        localStorage.setItem('meetprep_webhook_url', url.trim());
      } else {
        localStorage.removeItem('meetprep_webhook_url');
      }
    } catch {}
  };

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

  const setField = (field: FieldKey, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (hasAttemptedSubmit || touched[field]) {
      const err = validateSingleField(field, value);
      setErrors((prev) => ({ ...prev, [field]: err }));
    }
  };

  const handleBlur = (field: FieldKey) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const val = (form[field as keyof WorkflowCredentials] as string) || '';
    const err = validateSingleField(field, val);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const isLocked =
    credentials.status === 'Locked & Expired' ||
    (credentials.expiresAtTimestamp ? Date.now() >= credentials.expiresAtTimestamp : false);

  const isConfigured =
    (credentials.status === 'Submitted' || credentials.status === 'Configured') && !isLocked;

  // Individual card readiness checks
  const isGoogleValid =
    Boolean(form.googleClientId?.trim() && form.googleClientSecret?.trim()) &&
    !validateSingleField('googleClientId', form.googleClientId) &&
    !validateSingleField('googleClientSecret', form.googleClientSecret);

  const isOpenAiValid =
    Boolean(form.openAiApiKey?.trim()) &&
    !validateSingleField('openAiApiKey', form.openAiApiKey);

  const isApifyValid =
    Boolean(form.apifyApiKey?.trim()) &&
    !validateSingleField('apifyApiKey', form.apifyApiKey) &&
    (!form.linkedInCookie?.trim() || !validateSingleField('linkedInCookie', form.linkedInCookie));

  const isWhatsAppValid =
    Boolean(form.whatsAppBusinessId?.trim() && form.whatsAppAccessToken?.trim()) &&
    !validateSingleField('whatsAppBusinessId', form.whatsAppBusinessId) &&
    !validateSingleField('whatsAppAccessToken', form.whatsAppAccessToken);

  const readyCardsCount = [isGoogleValid, isOpenAiValid, isApifyValid, isWhatsAppValid].filter(Boolean).length;

  const handleSaveAndContinue = async () => {
    setHasAttemptedSubmit(true);
    const { errors: newErrors, isValid, summaryMessage } = validateAllFields(form);

    if (!isValid) {
      setErrors(newErrors);
      showToast(summaryMessage, 'error');
      return;
    }

    setErrors({});
    setIsSaving(true);
    await updateCredentials(form);
    setIsSaving(false);
    showToast('✓ Credentials verified and secured in 12-hour vault!', 'success');
    setCurrentScreen('dashboard');
  };

  const handleTestWhatsApp = async () => {
    const bizErr = validateSingleField('whatsAppBusinessId', form.whatsAppBusinessId);
    const tokenErr = validateSingleField('whatsAppAccessToken', form.whatsAppAccessToken);

    if (bizErr || tokenErr) {
      showToast('Please enter a valid WhatsApp Phone Number ID and Access Token before testing.', 'error');
      setErrors((prev) => ({
        ...prev,
        whatsAppBusinessId: bizErr,
        whatsAppAccessToken: tokenErr
      }));
      setTouched((prev) => ({ ...prev, whatsAppBusinessId: true, whatsAppAccessToken: true }));
      return;
    }

    if (!form.whatsAppRecipientPhone?.trim()) {
      showToast('Please enter your recipient WhatsApp phone number (with country code) below.', 'info');
      setErrors((prev) => ({
        ...prev,
        whatsAppRecipientPhone: 'Enter recipient WhatsApp phone number (e.g. 919876543210).'
      }));
      setTouched((prev) => ({ ...prev, whatsAppRecipientPhone: true }));
      return;
    }

    setIsTestingWhatsApp(true);
    await testWhatsAppAlert(
      form.whatsAppRecipientPhone,
      undefined,
      form.whatsAppBusinessId,
      form.whatsAppAccessToken
    );
    setIsTestingWhatsApp(false);
  };

  const handleTestTemplateWhatsApp = async () => {
    const bizErr = validateSingleField('whatsAppBusinessId', form.whatsAppBusinessId);
    const tokenErr = validateSingleField('whatsAppAccessToken', form.whatsAppAccessToken);

    if (bizErr || tokenErr) {
      showToast('Please enter a valid WhatsApp Phone Number ID and Access Token before testing.', 'error');
      setErrors((prev) => ({
        ...prev,
        whatsAppBusinessId: bizErr,
        whatsAppAccessToken: tokenErr
      }));
      setTouched((prev) => ({ ...prev, whatsAppBusinessId: true, whatsAppAccessToken: true }));
      return;
    }

    if (!form.whatsAppRecipientPhone?.trim()) {
      showToast('Please enter your recipient WhatsApp phone number (with country code) below.', 'info');
      setErrors((prev) => ({
        ...prev,
        whatsAppRecipientPhone: 'Enter recipient WhatsApp phone number (e.g. 919876543210).'
      }));
      setTouched((prev) => ({ ...prev, whatsAppRecipientPhone: true }));
      return;
    }

    setIsTestingWhatsApp(true);
    await testWhatsAppAlert(
      form.whatsAppRecipientPhone,
      undefined,
      form.whatsAppBusinessId,
      form.whatsAppAccessToken,
      true // send template
    );
    setIsTestingWhatsApp(false);
  };

  const handleReset = () => {
    resetForNewCredentials();
    setErrors({});
    setTouched({});
    setHasAttemptedSubmit(false);
  };

  const handleDirectWhatsAppTest = () => {
    const text = `🚀 *MeetPrep CRM Direct WhatsApp Test*\n\nYour AI meeting preparation briefing portal is connected and ready.`;
    const recipient = form.whatsAppRecipientPhone ? form.whatsAppRecipientPhone.replace(/\D/g, '') : '';
    const url = recipient
      ? `https://wa.me/${recipient}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
                    : readyCardsCount === 4
                    ? 'bg-emerald-950/70 border border-emerald-800/70 text-emerald-400'
                    : 'bg-amber-950/70 border border-amber-800/70 text-amber-400'
                }`}
              >
                {isConfigured
                  ? '🟢 Production Active'
                  : readyCardsCount === 4
                  ? '4 of 4 Ready to Lock'
                  : `⚠️ ${readyCardsCount} of 4 Ready (Action Required)`}
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Enter your integration keys. All fields are strictly verified before locking into the 12-hour ephemeral vault.
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

        {/* 12-Hour Ephemeral Privacy Assurance Banner */}
        <div className="mt-4 pt-3.5 border-t border-zinc-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong className="text-zinc-200">12-Hour Ephemeral Vault:</strong> Keys are held in temporary browser memory and auto-purged every 12 hours. Zero permanent database storage.
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

      {/* ── 4 Connection Cards ──────────────────────────────────────────────── */}
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
            {isGoogleValid ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Ready
              </span>
            ) : errors.googleClientId || errors.googleClientSecret ? (
              <span className="text-[10px] text-red-400 font-medium">Error</span>
            ) : (
              <span className="text-[10px] text-amber-400 font-medium">Pending</span>
            )}
          </div>

          <SimpleField
            label="Client ID"
            value={form.googleClientId}
            onChange={(val) => setField('googleClientId', val)}
            onBlur={() => handleBlur('googleClientId')}
            error={errors.googleClientId}
            isValid={isGoogleValid || (Boolean(form.googleClientId.trim()) && !errors.googleClientId && !validateSingleField('googleClientId', form.googleClientId))}
            placeholder="xxxxxx.apps.googleusercontent.com"
          />
          <SimpleField
            label="Client Secret"
            value={form.googleClientSecret}
            onChange={(val) => setField('googleClientSecret', val)}
            onBlur={() => handleBlur('googleClientSecret')}
            error={errors.googleClientSecret}
            isValid={isGoogleValid || (Boolean(form.googleClientSecret.trim()) && !errors.googleClientSecret && !validateSingleField('googleClientSecret', form.googleClientSecret))}
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
            {isOpenAiValid ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Ready
              </span>
            ) : errors.openAiApiKey ? (
              <span className="text-[10px] text-red-400 font-medium">Error</span>
            ) : (
              <span className="text-[10px] text-amber-400 font-medium">Pending</span>
            )}
          </div>

          <SimpleField
            label="OpenAI API Key"
            value={form.openAiApiKey}
            onChange={(val) => setField('openAiApiKey', val)}
            onBlur={() => handleBlur('openAiApiKey')}
            error={errors.openAiApiKey}
            isValid={isOpenAiValid || (Boolean(form.openAiApiKey.trim()) && !errors.openAiApiKey && !validateSingleField('openAiApiKey', form.openAiApiKey))}
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
            {isApifyValid ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Ready
              </span>
            ) : errors.apifyApiKey || errors.linkedInCookie ? (
              <span className="text-[10px] text-red-400 font-medium">Error</span>
            ) : (
              <span className="text-[10px] text-amber-400 font-medium">Pending</span>
            )}
          </div>

          <SimpleField
            label="Apify API Key"
            value={form.apifyApiKey}
            onChange={(val) => setField('apifyApiKey', val)}
            onBlur={() => handleBlur('apifyApiKey')}
            error={errors.apifyApiKey}
            isValid={isApifyValid || (Boolean(form.apifyApiKey.trim()) && !errors.apifyApiKey && !validateSingleField('apifyApiKey', form.apifyApiKey))}
            placeholder="apify_api_xxxxxxxxxxxx"
          />
          <SimpleField
            label="LinkedIn Cookie (Optional)"
            value={form.linkedInCookie || ''}
            onChange={(val) => setField('linkedInCookie', val)}
            onBlur={() => handleBlur('linkedInCookie')}
            error={errors.linkedInCookie}
            isValid={Boolean(form.linkedInCookie?.trim()) && !errors.linkedInCookie && !validateSingleField('linkedInCookie', form.linkedInCookie)}
            placeholder="li_at=AQEDAT..."
            hint="For deep profile context"
            required={false}
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
                <h3 className="text-xs font-semibold text-zinc-100">WhatsApp Cloud API</h3>
                <p className="text-[11px] text-zinc-500">Delivers briefings 60m before every call</p>
              </div>
            </div>
            {isWhatsAppValid ? (
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Ready
              </span>
            ) : errors.whatsAppBusinessId || errors.whatsAppAccessToken ? (
              <span className="text-[10px] text-red-400 font-medium">Error</span>
            ) : (
              <span className="text-[10px] text-amber-400 font-medium">Pending</span>
            )}
          </div>

          <SimpleField
            label="WhatsApp Phone Number ID"
            value={form.whatsAppBusinessId}
            onChange={(val) => setField('whatsAppBusinessId', val)}
            onBlur={() => handleBlur('whatsAppBusinessId')}
            error={errors.whatsAppBusinessId}
            isValid={isWhatsAppValid || (Boolean(form.whatsAppBusinessId.trim()) && !errors.whatsAppBusinessId && !validateSingleField('whatsAppBusinessId', form.whatsAppBusinessId))}
            placeholder="15-digit ID (e.g. 100609349424982)"
            hint="From Meta Dev Portal"
            isPassword={false}
          />
          <SimpleField
            label="WhatsApp Access Token"
            value={form.whatsAppAccessToken}
            onChange={(val) => setField('whatsAppAccessToken', val)}
            onBlur={() => handleBlur('whatsAppAccessToken')}
            error={errors.whatsAppAccessToken}
            isValid={isWhatsAppValid || (Boolean(form.whatsAppAccessToken.trim()) && !errors.whatsAppAccessToken && !validateSingleField('whatsAppAccessToken', form.whatsAppAccessToken))}
            placeholder="EAAxxxxxxxxxxxxxxxxxxxx"
          />
          <SimpleField
            label="Recipient WhatsApp Phone Number"
            value={form.whatsAppRecipientPhone || ''}
            onChange={(val) => setField('whatsAppRecipientPhone', val)}
            onBlur={() => handleBlur('whatsAppRecipientPhone')}
            error={errors.whatsAppRecipientPhone}
            isValid={Boolean(form.whatsAppRecipientPhone?.trim()) && !errors.whatsAppRecipientPhone && !validateSingleField('whatsAppRecipientPhone', form.whatsAppRecipientPhone)}
            placeholder="e.g. 919876543210 (with country code)"
            hint="Where briefings are sent"
            isPassword={false}
            required={false}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestWhatsApp}
              disabled={isTestingWhatsApp}
              className="py-1.5 px-2.5 rounded-lg bg-green-950/40 hover:bg-green-900/40 text-green-300 text-xs font-medium border border-green-800/40 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              title="Test Meta Cloud API briefing text delivery"
            >
              <Send className="w-3 h-3 text-green-400" />
              <span>{isTestingWhatsApp ? 'Dispatching...' : 'Test AI Briefing'}</span>
            </button>
            <button
              type="button"
              onClick={handleTestTemplateWhatsApp}
              disabled={isTestingWhatsApp}
              className="py-1.5 px-2.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 text-xs font-medium border border-emerald-800/40 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
              title="Send Meta pre-approved hello_world template (bypasses 24h window)"
            >
              <MessageSquare className="w-3 h-3 text-emerald-400" />
              <span>Test Template</span>
            </button>
            <button
              type="button"
              onClick={handleDirectWhatsAppTest}
              className="py-1.5 px-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 transition-colors flex items-center justify-center gap-1"
              title="Open test message directly in WhatsApp Web / App"
            >
              <ExternalLink className="w-3 h-3 text-zinc-400" />
              <span>WhatsApp Web</span>
            </button>
          </div>

          <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-400 leading-snug space-y-1">
            <div className="font-semibold text-zinc-300">💡 Why a message might not appear on your phone:</div>
            <div>• <strong>24-Hour Rule:</strong> Send a quick message (e.g. <em>&quot;Hi&quot;</em>) from your phone to the test business number to open Meta&apos;s 24h customer window for AI text.</div>
            <div>• <strong>Template Test:</strong> Click <strong>&quot;Test Template&quot;</strong> above to send Meta&apos;s pre-approved <em>hello_world</em> template instantly.</div>
          </div>
        </div>
      </div>

      {/* ── Expandable Step-by-Step Helper ──────────────────────────────────── */}
      <div className="border border-zinc-800/80 rounded-xl bg-zinc-950/40 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowAdvancedHelp(!showAdvancedHelp)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <span className="flex items-center gap-2">
            <span>Where do I find these credentials in Meta &amp; Google?</span>
          </span>
          {showAdvancedHelp ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvancedHelp && (
          <div className="p-4 pt-1 border-t border-zinc-800 text-xs text-zinc-400 space-y-2.5 leading-relaxed bg-zinc-950/80">
            <p>• <strong>Google OAuth:</strong> Google Cloud Console → APIs &amp; Services → Credentials → OAuth 2.0 Client ID (Enable Calendar &amp; Gmail scopes).</p>
            <p>• <strong>OpenAI:</strong> From your OpenAI Dashboard (<span className="text-zinc-300 font-mono">platform.openai.com</span>) under API Keys (starts with <span className="font-mono text-zinc-300">sk-</span>).</p>
            <p>• <strong>Apify:</strong> From Apify Console (<span className="text-zinc-300 font-mono">console.apify.com</span>) → Settings → Integrations (starts with <span className="font-mono text-zinc-300">apify_api_</span>).</p>
            <p>• <strong>Meta WhatsApp Cloud API:</strong> Go to <span className="text-zinc-300 font-mono">developers.facebook.com</span> → Your App → <strong>WhatsApp → API Setup</strong>:
              <br /><span className="text-zinc-300">1.</span> Copy the 15-digit <strong>Phone number ID</strong> (e.g. <span className="font-mono text-zinc-300">100609349424982</span>).
              <br /><span className="text-zinc-300">2.</span> Copy the <strong>Temporary access token</strong> (or permanent System User token).
              <br /><span className="text-zinc-300">3.</span> Under Step 2 ("To"), add your personal WhatsApp number to Meta's authorized test list if using developer sandbox mode.
            </p>
          </div>
        )}
      </div>

      {/* ── n8n Automation Engine Webhook (Production Bridge) ──────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-pink-950/50 border border-pink-900/50 flex items-center justify-center text-pink-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-zinc-100">n8n Automation Engine Webhook</h3>
              <p className="text-[11px] text-zinc-500">Live webhook endpoint for calendar synchronization &amp; background triggers</p>
            </div>
          </div>
          <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            webhookUrl.trim()
              ? 'bg-emerald-950/70 border border-emerald-800/70 text-emerald-400'
              : 'bg-zinc-800 text-zinc-400'
          }`}>
            {webhookUrl.trim() ? '🟢 Linked to n8n' : 'Standalone / Vault Mode'}
          </span>
        </div>

        <SimpleField
          label="n8n Production Webhook URL"
          value={webhookUrl}
          onChange={handleUpdateWebhookUrl}
          placeholder="https://n8n.yourcompany.com/webhook/meetprep-production"
          hint="Optional"
          isPassword={false}
          required={false}
        />
        <div className="p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80 text-[11px] text-zinc-400 leading-snug">
          When configured, calendar syncs, briefing generations, and credentials submissions connect directly to your live n8n pipeline.
        </div>
      </div>

      {/* ── Primary Action Bar ──────────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Timeline: <strong>12-Hour Production Ephemeral Vault</strong></span>
        </div>

        <div className="flex items-center gap-2.5 justify-end">
          {isConfigured && (
            <button
              type="button"
              onClick={handleReset}
              className="px-3 py-2 rounded-lg bg-red-950/40 hover:bg-red-900/40 text-red-300 text-xs font-medium border border-red-800/40 transition-colors flex items-center gap-1.5"
              title="Purge all credentials immediately from temporary memory"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Purge &amp; Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveAndContinue}
            disabled={isSaving}
            className={`px-5 py-2.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 ${
              readyCardsCount === 4
                ? 'bg-zinc-100 hover:bg-white text-zinc-950'
                : 'bg-zinc-800 hover:bg-zinc-750 text-zinc-300 border border-zinc-700'
            }`}
          >
            <span>{isSaving ? 'Securing & Activating...' : 'Save & Continue to Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
