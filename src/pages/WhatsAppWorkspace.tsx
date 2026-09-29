import { useEffect, useRef, useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import {
    CheckCircle2,
  Clock,
  Cloud,
  FileSpreadsheet,
  FileText,
  LoaderCircle,
  LogOut,
  MessageCircle,
  Paperclip,
  Play,
  QrCode,
  RefreshCw,
  RotateCcw,
  Send,
  Server,
  Settings,
  SkipForward,
  Square,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type WaStatus = 'disconnected' | 'initializing' | 'qr' | 'ready';

interface Contact {
  name: string;
  phone: string;
  status?: 'pending' | 'sent' | 'skipped';
}

interface LogEntry {
  id: string;
  timestamp: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

interface MediaAttachment {
  filename: string;
  mimetype: string;
  data: string; // base64
  size: number;
}

export default function WhatsAppWorkspace() {
  // ── Backend Server URL (persisted) ─────────────────────────────────────────
  const [serverUrl, setServerUrl] = useState<string>(
    () => localStorage.getItem('wa_server_url') ?? 'http://localhost:3000'
  );
  const [serverUrlInput, setServerUrlInput] = useState<string>(
    () => localStorage.getItem('wa_server_url') ?? 'http://localhost:3000'
  );

  // Helper: prefix every /api call with the configured server base URL
  const api = useCallback(
    (path: string) => `${serverUrl.replace(/\/$/, '')}${path}`,
    [serverUrl]
  );

  const saveServerUrl = () => {
    const trimmed = serverUrlInput.trim().replace(/\/$/, '');
    setServerUrl(trimmed);
    localStorage.setItem('wa_server_url', trimmed);
  };

  // Session State
  const [status, setStatus] = useState<WaStatus>('disconnected');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  // Contacts & File State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [rawRows, setRawRows] = useState<Record<string, unknown>[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [nameCol, setNameCol] = useState<string>('');
  const [phoneCol, setPhoneCol] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');

  // Message Template & Media State
  const [template, setTemplate] = useState<string>('Hello {name}, greetings from BrickBloom! We wanted to follow up regarding your order and inquiry.');
  const [media, setMedia] = useState<MediaAttachment | null>(null);
  const templateRef = useRef<HTMLTextAreaElement>(null);

  // Sending Controls State
  const [engineMode, setEngineMode] = useState<'cloud' | 'direct' | 'server'>('cloud');
  const [directTarget, setDirectTarget] = useState<'web' | 'app'>('web');
  const [directIndex, setDirectIndex] = useState<number>(0);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  // ── Meta WhatsApp Cloud API State (Persisted) ──────────────────────────────
  const [cloudPhoneId, setCloudPhoneId] = useState<string>(
    () => localStorage.getItem('wa_cloud_phone_id') ?? ''
  );
  const [cloudAccessToken, setCloudAccessToken] = useState<string>(
    () => localStorage.getItem('wa_cloud_token') ?? ''
  );
  const [cloudMediaUrl, setCloudMediaUrl] = useState<string>(
    () => localStorage.getItem('wa_cloud_media_url') ?? ''
  );
  const [showCloudConfig, setShowCloudConfig] = useState<boolean>(false);

  const saveCloudConfig = (pId: string, tok: string, mUrl: string) => {
    setCloudPhoneId(pId.trim());
    setCloudAccessToken(tok.trim());
    setCloudMediaUrl(mUrl.trim());
    localStorage.setItem('wa_cloud_phone_id', pId.trim());
    localStorage.setItem('wa_cloud_token', tok.trim());
    localStorage.setItem('wa_cloud_media_url', mUrl.trim());
    addLog('info', 'Meta Cloud API credentials saved locally.');
  };

  const [sendMode, setSendMode] = useState<'batch' | 'manual'>('batch');
  const [batchSize, setBatchSize] = useState<string>('all');
  const [delaySec, setDelaySec] = useState<number>(1);
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState<{ current: number; total: number } | null>(null);

  // Manual Review Mode State
  const [manualIdx, setManualIdx] = useState<number>(0);
  const [manualActive, setManualActive] = useState<boolean>(false);
  const [manualCustomMsg, setManualCustomMsg] = useState<string>('');

  // Activity Log
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const addLog = (type: LogEntry['type'], message: string) => {
    const entry: LogEntry = {
      id: crypto.randomUUID(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      message,
    };
    setLogs((prev) => [...prev.slice(-150), entry]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Apply state from server
  const applyState = (data: { status?: WaStatus; qr?: string | null; error?: string | null }) => {
    if (data.status) setStatus(data.status);
    setQrCode(data.qr || null);
    setSessionError(data.error || null);
  };

  // Poll / Status check
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(api('/api/wa/status'));
      if (res.ok) {
        const data = await res.json();
        applyState(data);
      }
    } catch {
      // Local server might be offline
    }
  }, [api]);

  // SSE Stream listener — reconnects whenever serverUrl changes
  useEffect(() => {
    fetchStatus();

    let sse: EventSource | null = null;
    try {
      sse = new EventSource(api('/api/wa/stream'));
      sse.addEventListener('state', (e) => {
        try {
          const data = JSON.parse(e.data);
          applyState(data);
        } catch {
          // ignore
        }
      });
      sse.onerror = () => {
        // SSE dropped or server restarted, browser retries
      };
    } catch {
      // fallback to polling
    }

    const interval = window.setInterval(fetchStatus, 4000);

    return () => {
      if (sse) sse.close();
      window.clearInterval(interval);
    };
  }, [api, fetchStatus]);

  // Connect WhatsApp session
  const handleConnect = async () => {
    setBusyAction('connecting');
    setSessionError(null);
    addLog('info', 'Connecting to WhatsApp Web client...');
    try {
      const res = await fetch(api('/api/wa/connect'), { method: 'POST' });
      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error(
          `Backend server at ${serverUrl} is not responding with API data (Status: ${res.status}). Make sure server.js is running (npm run server) and Backend Server URL is configured.`
        );
      }
      const data = await res.json();
      if (!res.ok || data.ok === false) {
        throw new Error(data.error || 'Server error');
      }
      if (data.status) applyState(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSessionError(msg);
      addLog('error', `Connect failed: ${msg}`);
    } finally {
      setBusyAction(null);
    }
  };

  // Disconnect WhatsApp session
  const handleDisconnect = async () => {
    setBusyAction('disconnecting');
    addLog('info', 'Disconnecting WhatsApp session...');
    try {
      await fetch(api('/api/wa/disconnect'), { method: 'POST' });
      setStatus('disconnected');
      setQrCode(null);
      addLog('info', 'WhatsApp session disconnected.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog('error', `Disconnect error: ${msg}`);
    } finally {
      setBusyAction(null);
    }
  };

  // Clear Session & Lock Files
  const handleClearSession = async () => {
    if (!window.confirm('Clear saved WhatsApp session and remove cache? You will need to scan the QR code again.')) {
      return;
    }
    setBusyAction('clearing');
    addLog('warning', 'Clearing WhatsApp session directory (.wwebjs_auth) & browser locks...');
    try {
      const res = await fetch(api('/api/wa/clear-session'), { method: 'POST' });
      if (res.ok) {
        setStatus('disconnected');
        setQrCode(null);
        setSessionError(null);
        addLog('success', 'Session directory cleared. Click "Connect WhatsApp" to generate a fresh QR code.');
      } else {
        throw new Error('Failed to clear session');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog('error', `Clear session error: ${msg}`);
    } finally {
      setBusyAction(null);
    }
  };

  // Excel / CSV File upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const buffer = evt.target?.result;
        const wb = file.name.toLowerCase().endsWith('.csv')
          ? XLSX.read(buffer as string, { type: 'string' })
          : XLSX.read(new Uint8Array(buffer as ArrayBuffer), { type: 'array' });

        const firstSheetName = wb.SheetNames[0];
        const sheet = wb.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: '' });

        if (!json.length) {
          alert('Spreadsheet appears to be empty.');
          return;
        }

        setRawRows(json);
        const cols = Object.keys(json[0]);
        setColumns(cols);

        // Auto-detect name & phone columns
        let bestN = cols[0] || '';
        let bestP = cols[1] || cols[0] || '';

        for (const c of cols) {
          const lower = c.toLowerCase();
          if (/name|customer|company|client|buyer/i.test(lower)) bestN = c;
          if (/phone|mobile|number|whatsapp|wa|contact/i.test(lower)) bestP = c;
        }

        setNameCol(bestN);
        setPhoneCol(bestP);
        extractContacts(json, bestN, bestP);
        addLog('info', `Imported ${file.name} with ${json.length} raw rows.`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        alert(`Could not parse spreadsheet: ${msg}`);
      }
    };

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file, 'utf-8');
    } else {
      reader.readAsArrayBuffer(file);
    }
  };

  const extractContacts = (rows: Record<string, unknown>[], nCol: string, pCol: string) => {
    const parsed: Contact[] = rows
      .map((row) => {
        const nameVal = String(row[nCol] ?? '').trim();
        let rawPhone = String(row[pCol] ?? '').replace(/[^0-9+]/g, '');
        if (rawPhone.startsWith('+')) rawPhone = rawPhone.slice(1);
        if (rawPhone.length === 10) rawPhone = '91' + rawPhone;
        return { name: nameVal || 'Customer', phone: rawPhone, status: 'pending' as const };
      })
      .filter((c) => c.phone.length >= 10);

    setContacts(parsed);
    setDirectIndex(0);
  };

  const handleNameColChange = (col: string) => {
    setNameCol(col);
    extractContacts(rawRows, col, phoneCol);
  };

  const handlePhoneColChange = (col: string) => {
    setPhoneCol(col);
    extractContacts(rawRows, nameCol, col);
  };

  // Insert token at cursor
  const insertToken = (token: string) => {
    if (!templateRef.current) return;
    const textarea = templateRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const nextVal = template.substring(0, start) + token + template.substring(end);
    setTemplate(nextVal);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + token.length, start + token.length);
    }, 0);
  };

  // Media Attachment handler
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 16 * 1024 * 1024) {
      alert('File size exceeds the 16MB WhatsApp attachment limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const b64 = result.split(',')[1];
      setMedia({
        filename: file.name,
        mimetype: file.type || 'application/octet-stream',
        data: b64,
        size: file.size,
      });
      addLog('info', `Media attached: ${file.name} (${Math.round(file.size / 1024)} KB)`);
    };
    reader.readAsDataURL(file);
  };

  const removeMedia = () => {
    setMedia(null);
  };

  // Interpolate message
  const mergeMessage = (tmpl: string, contact?: Contact) => {
    const custName = contact?.name || 'Valued Customer';
    return tmpl.replace(/{name}/gi, custName);
  };

  // Stream NDJSON helper
  const readNDJSON = async (
    response: Response,
    onRow: (row: { status: string; name?: string; phone?: string; error?: string }) => void
  ) => {
    if (!response.body) return;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buf = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split('\n');
      buf = lines.pop() ?? '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          onRow(JSON.parse(line));
        } catch {
          // ignore malformed
        }
      }
    }
    if (buf.trim()) {
      try {
        onRow(JSON.parse(buf));
      } catch {
        // ignore
      }
    }
  };

  const getWhatsAppUrl = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^\d]/g, '');
    const encoded = encodeURIComponent(text);
    if (directTarget === 'web') {
      return `https://web.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`;
    }
    return `https://wa.me/${cleanPhone}?text=${encoded}`;
  };

  const handleDirectSendCurrent = () => {
    const current = contacts[directIndex];
    if (!current) return;

    const message = mergeMessage(template, current);
    const url = getWhatsAppUrl(current.phone, message);

    window.open(url, '_blank', 'noopener,noreferrer');

    setContacts((prev) =>
      prev.map((c, i) => (i === directIndex ? { ...c, status: 'sent' } : c))
    );
    addLog('success', `Opened WhatsApp for ${current.name} (+${current.phone})`);

    if (autoAdvance && directIndex < contacts.length - 1) {
      setDirectIndex((prev) => prev + 1);
    }
  };

  const handleDirectSkipCurrent = () => {
    const current = contacts[directIndex];
    if (!current) return;

    setContacts((prev) =>
      prev.map((c, i) => (i === directIndex ? { ...c, status: 'skipped' } : c))
    );
    addLog('warning', `Skipped ${current.name} (+${current.phone})`);

    if (directIndex < contacts.length - 1) {
      setDirectIndex((prev) => prev + 1);
    }
  };

  const handleDirectResetQueue = () => {
    if (!window.confirm('Reset queue progress and mark all leads as pending?')) return;
    setContacts((prev) => prev.map((c) => ({ ...c, status: 'pending' })));
    setDirectIndex(0);
    addLog('info', 'Queue progress reset to beginning.');
  };

  // ── Meta WhatsApp Cloud API Direct Dispatcher ──────────────────────────────
  const sendCloudMessage = async (contact: Contact, text: string) => {
    if (!cloudPhoneId || !cloudAccessToken) {
      throw new Error('Meta Cloud API credentials missing. Please configure Phone Number ID and Access Token.');
    }

    const cleanPhone = contact.phone.replace(/[^\d]/g, '');
    const endpoint = `https://graph.facebook.com/v20.0/${cloudPhoneId}/messages`;

    // Determine payload: document/image with caption vs plain text
    let body: Record<string, unknown>;

    // If media attachment or hosted media URL provided
    const targetMediaUrl = cloudMediaUrl.trim();

    if (targetMediaUrl) {
      const isPdf = /\.pdf($|\?)/i.test(targetMediaUrl) || media?.mimetype === 'application/pdf';
      if (isPdf) {
        body = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'document',
          document: {
            link: targetMediaUrl,
            caption: text,
            filename: media?.filename || 'BrickBloom_Document.pdf',
          },
        };
      } else {
        body = {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: cleanPhone,
          type: 'image',
          image: {
            link: targetMediaUrl,
            caption: text,
          },
        };
      }
    } else {
      body = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: cleanPhone,
        type: 'text',
        text: { preview_url: true, body: text },
      };
    }

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cloudAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) {
      const errDetail =
        data?.error?.error_user_msg ||
        data?.error?.message ||
        `HTTP ${res.status}: Failed to deliver`;
      throw new Error(errDetail);
    }

    return data;
  };

  const handleStartCloudBatchSend = async () => {
    if (!cloudPhoneId || !cloudAccessToken) {
      setShowCloudConfig(true);
      alert('Please configure your Meta WhatsApp Cloud API credentials first.');
      return;
    }
    if (!contacts.length) {
      alert('Upload recipient contacts first.');
      return;
    }

    let toSend = contacts;
    if (batchSize !== 'all') {
      const limit = parseInt(batchSize, 10);
      toSend = contacts.slice(0, limit);
    }

    if (
      !window.confirm(
        `Start automated Meta Cloud API broadcast to ${toSend.length} contacts? Messages will be sent in background.`
      )
    ) {
      return;
    }

    setIsSending(true);
    setSendProgress({ current: 0, total: toSend.length });
    addLog('info', `[Meta Cloud API] Initiating automated broadcast to ${toSend.length} leads...`);

    let sent = 0;
    let failed = 0;

    for (let i = 0; i < toSend.length; i++) {
      const contact = toSend[i];
      const message = mergeMessage(template, contact);

      try {
        await sendCloudMessage(contact, message);
        sent++;
        setContacts((prev) =>
          prev.map((c) => (c.phone === contact.phone ? { ...c, status: 'sent' } : c))
        );
        addLog('success', `[Meta API] Delivered to ${contact.name} (+${contact.phone})`);
      } catch (err: unknown) {
        failed++;
        const msg = err instanceof Error ? err.message : String(err);
        setContacts((prev) =>
          prev.map((c) => (c.phone === contact.phone ? { ...c, status: 'skipped' } : c))
        );
        addLog('error', `[Meta API] Failed for ${contact.name} (+${contact.phone}): ${msg}`);
      }

      setSendProgress({ current: i + 1, total: toSend.length });

      if (i < toSend.length - 1 && delaySec > 0) {
        await new Promise((r) => setTimeout(r, delaySec * 1000));
      }
    }

    setIsSending(false);
    setSendProgress(null);
    addLog(
      'info',
      `[Meta Cloud API] Broadcast finished: ${sent} delivered, ${failed} failed or skipped.`
    );
  };

  // Batch Send
  const handleStartBatchSend = async () => {
    if (status !== 'ready') {
      alert('WhatsApp session is not connected.');
      return;
    }
    if (!contacts.length) {
      alert('Please upload a spreadsheet with recipient contacts first.');
      return;
    }
    if (!template.trim() && !media) {
      alert('Please provide a message template or attach media.');
      return;
    }

    const limit = batchSize === 'all' ? contacts.length : parseInt(batchSize, 10);
    const toSend = contacts.slice(0, limit);

    if (!window.confirm(`Confirm sending WhatsApp updates to ${toSend.length} recipient(s) with ${delaySec}s delay between messages?`)) {
      return;
    }

    setIsSending(true);
    setSendProgress({ current: 0, total: toSend.length });
    addLog('info', `Starting batch delivery to ${toSend.length} contacts...`);

    try {
      const payloadMedia = media ? { mimetype: media.mimetype, data: media.data, filename: media.filename } : null;
      const res = await fetch(api('/api/wa/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: toSend,
          template,
          media: payloadMedia,
          delay_ms: delaySec * 1000,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: `Server error ${res.status}` }));
        throw new Error(errData.error || `HTTP ${res.status}`);
      }

      let count = 0;
      await readNDJSON(res, (row) => {
        if (row.status === 'success') {
          count++;
          setSendProgress({ current: count, total: toSend.length });
          addLog('success', `Sent to ${row.name || 'Customer'} (${row.phone})`);
        } else if (row.status === 'error') {
          count++;
          setSendProgress({ current: count, total: toSend.length });
          addLog('error', `Failed: ${row.name || 'Customer'} (${row.phone}): ${row.error || 'Unknown error'}`);
        } else if (row.status === 'fatal') {
          addLog('error', `Fatal session error: ${row.error}`);
          setStatus('disconnected');
        } else if (row.status === 'done') {
          addLog('info', 'Batch delivery finished.');
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog('error', `Send interrupted: ${msg}`);
    } finally {
      setIsSending(false);
      setSendProgress(null);
    }
  };

  // Start Manual Mode
  const handleStartManualMode = () => {
    if (!contacts.length) {
      alert('Upload recipient contacts first.');
      return;
    }
    setManualIdx(0);
    setManualActive(true);
    setManualCustomMsg(mergeMessage(template, contacts[0]));
  };

  const handleManualSendCurrent = async () => {
    const contact = contacts[manualIdx];
    if (!contact) return;

    addLog('info', `Sending manual message to ${contact.name} (${contact.phone})...`);
    try {
      const payloadMedia = media ? { mimetype: media.mimetype, data: media.data, filename: media.filename } : null;
      const res = await fetch(api('/api/wa/send'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: [contact],
          template: manualCustomMsg,
          media: payloadMedia,
        }),
      });

      if (!res.ok) {
        const e = await res.json().catch(() => ({ error: 'Error' }));
        throw new Error(e.error || 'Send failed');
      }

      await readNDJSON(res, (row) => {
        if (row.status === 'success') {
          addLog('success', `Sent to ${contact.name}`);
        } else if (row.status === 'error') {
          addLog('error', `Failed: ${contact.name}: ${row.error}`);
        }
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      addLog('error', `Error sending to ${contact.name}: ${msg}`);
    }

    advanceManual();
  };

  const advanceManual = () => {
    const nextIdx = manualIdx + 1;
    if (nextIdx >= contacts.length) {
      addLog('info', 'Manual review sequence complete.');
      setManualActive(false);
      return;
    }
    setManualIdx(nextIdx);
    setManualCustomMsg(mergeMessage(template, contacts[nextIdx]));
  };

  const handleManualSkip = () => {
    const contact = contacts[manualIdx];
    if (contact) addLog('warning', `Skipped ${contact.name} (${contact.phone})`);
    advanceManual();
  };

  const handleManualStop = () => {
    setManualActive(false);
  };

  const isConnected = status === 'ready';

  const currentDirect = contacts[directIndex];
  const directSentCount = contacts.filter((c) => c.status === 'sent').length;
  const directSkippedCount = contacts.filter((c) => c.status === 'skipped').length;
  const directProgressPercent =
    contacts.length > 0 ? Math.round((directSentCount / contacts.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-[#e2d5be] bg-white p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
              WhatsApp Outreach
            </h1>
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                engineMode === 'cloud'
                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                  : engineMode === 'direct'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : isConnected
                  ? 'bg-emerald-100 text-emerald-800'
                  : status === 'qr'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {engineMode === 'cloud'
                ? 'Meta Cloud API (Official Bulk + Media)'
                : engineMode === 'direct'
                ? 'Direct Click-to-Chat (Zero Backend)'
                : isConnected
                ? 'Node.js Connected'
                : status === 'qr'
                ? 'Scan QR'
                : 'Server Offline'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {engineMode === 'cloud'
              ? 'Official Meta WhatsApp Cloud API. Sends 1-click automated bulk messages with PDF/image attachments directly from GitHub Pages.'
              : engineMode === 'direct'
              ? 'Zero-backend Click-to-Chat runner. Opens conversations directly in WhatsApp Web or App.'
              : 'Automated background outreach powered by local Node.js / Puppeteer Chromium instance.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setEngineMode('cloud')}
              className={`rounded px-2.5 py-1 transition ${
                engineMode === 'cloud'
                  ? 'bg-white text-blue-900 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ⚡ Meta Cloud API (Bulk + Media)
            </button>
            <button
              type="button"
              onClick={() => setEngineMode('direct')}
              className={`rounded px-2.5 py-1 transition ${
                engineMode === 'direct'
                  ? 'bg-white text-emerald-800 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Direct Web
            </button>
            <button
              type="button"
              onClick={() => setEngineMode('server')}
              className={`rounded px-2.5 py-1 transition ${
                engineMode === 'server'
                  ? 'bg-white text-brand-900 shadow-sm font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Node.js Server
            </button>
          </div>

          {engineMode === 'cloud' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowCloudConfig((prev) => !prev)}
              className="h-8 text-xs font-semibold gap-1.5 border-blue-200 text-blue-800 hover:bg-blue-50"
            >
              <Settings className="h-3.5 w-3.5" />
              API Keys
            </Button>
          )}

          {engineMode === 'direct' && (
            <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDirectTarget('web')}
                className={`rounded px-2.5 py-1 transition ${
                  directTarget === 'web'
                    ? 'bg-white text-brand-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                WhatsApp Web
              </button>
              <button
                type="button"
                onClick={() => setDirectTarget('app')}
                className={`rounded px-2.5 py-1 transition ${
                  directTarget === 'app'
                    ? 'bg-white text-brand-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                App / wa.me
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Meta Cloud API Configuration Drawer/Banner */}
      {(showCloudConfig || (engineMode === 'cloud' && (!cloudPhoneId || !cloudAccessToken))) && (
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 shadow-sm space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-900 font-bold">
              <Cloud className="h-4 w-4 text-blue-600" />
              <span>Meta WhatsApp Cloud API Configuration</span>
            </div>
            <button
              type="button"
              onClick={() => setShowCloudConfig(false)}
              className="text-blue-500 hover:text-blue-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-blue-700 text-[11px] leading-relaxed">
            Get your credentials free from{' '}
            <a
              href="https://developers.facebook.com/apps"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-bold"
            >
              developers.facebook.com
            </a>{' '}
            &rarr; Your App &rarr; WhatsApp &rarr; API Setup. Your token is stored safely in your browser&apos;s localStorage only.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Phone Number ID *
              </label>
              <input
                type="text"
                defaultValue={cloudPhoneId}
                id="cloud-phone-id"
                placeholder="e.g. 109283746592817"
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Access Token (Bearer) *
              </label>
              <input
                type="password"
                defaultValue={cloudAccessToken}
                id="cloud-access-token"
                placeholder="EAAG..."
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Public PDF / Media URL (Optional)
              </label>
              <input
                type="text"
                defaultValue={cloudMediaUrl}
                id="cloud-media-url"
                placeholder="https://.../catalog.pdf"
                className="w-full rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-1">
            <Button
              size="sm"
              onClick={() => {
                const p = (document.getElementById('cloud-phone-id') as HTMLInputElement)?.value;
                const t = (document.getElementById('cloud-access-token') as HTMLInputElement)?.value;
                const m = (document.getElementById('cloud-media-url') as HTMLInputElement)?.value;
                saveCloudConfig(p, t, m);
                setShowCloudConfig(false);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-8 px-4"
            >
              Save Credentials
            </Button>
          </div>
        </div>
      )}

      {/* Backend Server Configuration Banner (only in server mode) */}
      {engineMode === 'server' && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <Server className="h-4 w-4 text-brand-700 shrink-0" />
            <div>
              <span className="font-bold text-slate-800">Backend Server:</span>{' '}
              <span className="text-slate-500 font-mono">{serverUrl}</span>
              <span className="block text-[11px] text-slate-500">
                WhatsApp Web uses a Node.js/Chromium instance (<code>npm run server</code>). Set this to your local or hosted backend.
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={serverUrlInput}
              onChange={(e) => setServerUrlInput(e.target.value)}
              placeholder="http://localhost:3000"
              className="w-48 sm:w-56 rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-none"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={saveServerUrl}
              className="h-8 text-xs font-semibold"
            >
              Save & Connect
            </Button>
          </div>
        </div>
      )}

      {/* WhatsApp Session Status Card (only in server mode) */}
      {engineMode === 'server' && (
        <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className={`grid h-10 w-10 place-items-center rounded-xl ${
                  isConnected
                    ? 'bg-emerald-100 text-emerald-700'
                    : status === 'qr'
                    ? 'bg-blue-100 text-blue-700'
                    : status === 'initializing'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-lg">Session Status</CardTitle>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      isConnected
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : status === 'qr'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                        : status === 'initializing'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isConnected
                          ? 'bg-emerald-500'
                          : status === 'qr'
                          ? 'bg-blue-500'
                          : status === 'initializing'
                          ? 'bg-amber-500 animate-ping'
                          : 'bg-rose-500'
                      }`}
                    />
                    {isConnected
                      ? 'Connected & Ready'
                      : status === 'qr'
                      ? 'Scan QR Code'
                      : status === 'initializing'
                      ? 'Launching Client…'
                      : 'Disconnected'}
                  </span>
                </div>
                <CardDescription className="mt-0.5">
                  {isConnected
                    ? 'Authenticated session is active. You can broadcast batch messages and media.'
                    : status === 'qr'
                    ? 'Point your WhatsApp mobile camera at the QR code below.'
                    : status === 'initializing'
                    ? 'Launching background Chromium session. The QR code will appear momentarily…'
                    : 'Connect your phone to send messages directly from BrickBloom.'}
                </CardDescription>
              </div>
            </div>

            {/* Session Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {isConnected ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDisconnect}
                  disabled={busyAction !== null}
                  className="text-rose-700 hover:bg-rose-50 hover:text-rose-800"
                >
                  <LogOut className="mr-1.5 h-3.5 w-3.5" />
                  Disconnect
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={handleConnect}
                  disabled={busyAction !== null || status === 'initializing'}
                  className="bg-brand-700 hover:bg-brand-800"
                >
                  {status === 'initializing' || busyAction === 'connecting' ? (
                    <>
                      <LoaderCircle className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      Starting…
                    </>
                  ) : (
                    <>
                      <QrCode className="mr-1.5 h-3.5 w-3.5" />
                      Connect WhatsApp
                    </>
                  )}
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSession}
                disabled={busyAction !== null}
                title="Clears .wwebjs_auth cache and terminates stuck Chrome processes"
                className="text-slate-500 hover:text-slate-800"
              >
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Clear Cache
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* QR Code Presentation */}
        {status === 'qr' && qrCode && (
          <CardContent className="border-t border-slate-100 bg-slate-50/70 p-6">
            <div className="flex flex-col items-center justify-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="rounded-xl border-4 border-white bg-white p-2 shadow-md">
                <img src={qrCode} alt="WhatsApp QR Code" className="h-48 w-48 object-contain" />
              </div>
              <div className="max-w-md space-y-2">
                <h3 className="text-base font-bold text-slate-800">Scan QR Code to Link WhatsApp</h3>
                <ol className="space-y-1 text-xs leading-relaxed text-slate-600">
                  <li>1. Open <strong>WhatsApp</strong> on your mobile device.</li>
                  <li>2. Tap <strong>Menu (⋮)</strong> or <strong>Settings (⚙️)</strong>.</li>
                  <li>3. Select <strong>Linked Devices</strong> and tap <strong>Link a Device</strong>.</li>
                  <li>4. Point your camera at this QR code to authenticate.</li>
                </ol>
                <p className="text-[11px] text-slate-400">
                  The code refreshes automatically. If it expires, click &quot;Connect WhatsApp&quot; again.
                </p>
              </div>
            </div>
          </CardContent>
        )}

        {sessionError && (
          <div className="border-t border-rose-100 bg-rose-50 px-4 py-3 text-xs font-semibold text-rose-700">
            ⚠️ {sessionError}
          </div>
        )}
      </Card>
      )}

      {/* Main Outreach Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Contacts & Message Template */}
        <div className="space-y-6">
          {/* Card: Import Contacts */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="h-4 w-4 text-brand-700" />
                  <CardTitle className="text-base">1. Import Contact List</CardTitle>
                </div>
                {contacts.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" />
                    {contacts.length} recipients loaded
                  </span>
                )}
              </div>
              <CardDescription className="text-xs">
                Upload an Excel (.xlsx, .xls) or CSV sheet with customer names and WhatsApp phone numbers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <input
                  type="file"
                  id="excelFileInput"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-brand-800 hover:file:bg-brand-100"
                />
                {fileName && <p className="mt-1 text-[11px] text-slate-500">Loaded: {fileName}</p>}
              </div>

              {/* Column Mapping (shown once file is parsed) */}
              {columns.length > 0 && (
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-600">Column Mapping</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Name Column</label>
                      <select
                        value={nameCol}
                        onChange={(e) => handleNameColChange(e.target.value)}
                        className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 outline-none"
                      >
                        {columns.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-600 block mb-1">Phone Column</label>
                      <select
                        value={phoneCol}
                        onChange={(e) => handlePhoneColChange(e.target.value)}
                        className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 outline-none"
                      >
                        {columns.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Recipient preview snippet */}
                  <div className="overflow-hidden rounded border border-slate-200 bg-white">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-[10px] uppercase font-bold text-slate-500">
                        <tr>
                          <th className="px-2.5 py-1.5">#</th>
                          <th className="px-2.5 py-1.5">Name</th>
                          <th className="px-2.5 py-1.5">Phone</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {contacts.slice(0, 4).map((c, i) => (
                          <tr key={i}>
                            <td className="px-2.5 py-1 text-slate-400 font-mono text-[11px]">{i + 1}</td>
                            <td className="px-2.5 py-1 font-medium">{c.name}</td>
                            <td className="px-2.5 py-1 font-mono text-[11px] text-slate-600">{c.phone}</td>
                          </tr>
                        ))}
                        {contacts.length > 4 && (
                          <tr>
                            <td colSpan={3} className="px-2.5 py-1 text-center text-[10px] text-slate-400">
                              …and {contacts.length - 4} more contacts
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card: Message Template & Media */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-brand-700" />
                  <CardTitle className="text-base">2. Message Template</CardTitle>
                </div>
                <button
                  type="button"
                  onClick={() => insertToken('{name}')}
                  className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-1 text-[11px] font-mono font-bold text-brand-800 hover:bg-brand-50"
                  title="Insert recipient name token"
                >
                  + &#123;name&#125;
                </button>
              </div>
              <CardDescription className="text-xs">
                Draft your text message. Use &#123;name&#125; to personalize each message with recipient&apos;s name.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                ref={templateRef}
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
                rows={4}
                placeholder="Write your template message here..."
                className="w-full rounded-lg border border-slate-200 p-3 text-xs leading-relaxed text-slate-800 outline-none focus:border-brand-600 focus:ring-1 focus:ring-brand-500"
              />

              {/* Attach Media */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                  <Paperclip className="h-3.5 w-3.5" />
                  Attach Media (Optional: Image or PDF)
                </label>
                {media ? (
                  <div className="flex items-center justify-between rounded-lg border border-brand-200 bg-brand-50/60 px-3 py-2 text-xs">
                    <span className="font-semibold text-brand-900 truncate max-w-[280px]">
                      📎 {media.filename} ({Math.round(media.size / 1024)} KB)
                    </span>
                    <button
                      type="button"
                      onClick={removeMedia}
                      className="text-slate-400 hover:text-rose-600"
                      title="Remove attachment"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleMediaUpload}
                    className="block w-full text-xs text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                  />
                )}
              </div>

              {/* Live Preview */}
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Preview for First Recipient ({contacts[0]?.name || 'Sample Customer'})
                </p>
                <p className="mt-1 whitespace-pre-wrap text-xs text-slate-700">
                  {mergeMessage(template, contacts[0]) || 'Enter a message to see preview.'}
                </p>
                {media && (
                  <p className="mt-1 text-[11px] font-medium text-emerald-700">
                    + [Attached File: {media.filename}]
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Execution & Terminal Log */}
        <div className="space-y-6">
          {/* Card: Send Controls */}
          {engineMode === 'cloud' ? (
            <Card className="border-blue-200 shadow-sm">
              <CardHeader className="pb-3 bg-blue-50/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cloud className="h-4 w-4 text-blue-600" />
                    <CardTitle className="text-base text-blue-950">3. Meta Cloud API Automated Bulk Delivery</CardTitle>
                  </div>
                  {contacts.length > 0 && (
                    <span className="text-xs font-bold text-blue-700 font-mono">
                      {contacts.length} leads
                    </span>
                  )}
                </div>
                <CardDescription className="text-xs text-blue-700/80">
                  Sends automated background messages directly through Meta's official WhatsApp Cloud servers with PDF/image support.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4 pt-4">
                {contacts.length === 0 ? (
                  <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
                    <Users className="h-8 w-8 mx-auto text-slate-400" />
                    <p className="text-xs font-medium text-slate-600">
                      Upload an Excel or CSV file on the left to start sending.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Batch Limit</label>
                        <select
                          value={batchSize}
                          onChange={(e) => setBatchSize(e.target.value)}
                          disabled={isSending}
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 outline-none"
                        >
                          <option value="all">All Contacts ({contacts.length})</option>
                          <option value="5">First 5</option>
                          <option value="10">First 10</option>
                          <option value="25">First 25</option>
                          <option value="50">First 50</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Delay Between API Calls</label>
                        <select
                          value={delaySec}
                          onChange={(e) => setDelaySec(Number(e.target.value))}
                          disabled={isSending}
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 outline-none"
                        >
                          <option value={0}>Instant (0s)</option>
                          <option value={1}>1 second (recommended)</option>
                          <option value={2}>2 seconds</option>
                          <option value={3}>3 seconds</option>
                        </select>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    {sendProgress && (
                      <div className="space-y-1.5 rounded-lg border border-blue-100 bg-blue-50/60 p-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-blue-900">
                          <span>Dispatching via Meta Cloud API…</span>
                          <span>
                            {sendProgress.current} / {sendProgress.total}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200">
                          <div
                            className="h-full bg-blue-600 transition-all duration-300"
                            style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleStartCloudBatchSend}
                        disabled={isSending || contacts.length === 0}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 shadow-sm"
                      >
                        {isSending ? (
                          <>
                            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                            Broadcasting via Meta API…
                          </>
                        ) : (
                          <>
                            <Play className="mr-2 h-4 w-4" />
                            Start Meta Cloud Broadcast ({batchSize === 'all' ? contacts.length : Math.min(Number(batchSize), contacts.length)} Leads)
                          </>
                        )}
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDirectResetQueue}
                        disabled={isSending}
                        className="h-10 text-xs text-slate-600 hover:text-slate-900"
                        title="Reset progress to beginning"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Recipient list table */}
                    <div className="space-y-2 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Recipient Queue ({contacts.length})</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          Live delivery status
                        </span>
                      </div>

                      <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-inner">
                        <table className="w-full text-left text-xs">
                          <thead className="sticky top-0 bg-slate-100 text-[10px] uppercase font-bold text-slate-500">
                            <tr>
                              <th className="px-3 py-1.5">#</th>
                              <th className="px-3 py-1.5">Name</th>
                              <th className="px-3 py-1.5">Phone</th>
                              <th className="px-3 py-1.5">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {contacts.map((c, i) => (
                              <tr key={i} className="transition hover:bg-slate-50">
                                <td className="px-3 py-1.5 font-mono text-[11px] text-slate-400">
                                  {i + 1}
                                </td>
                                <td className="px-3 py-1.5 truncate max-w-[140px] font-medium">{c.name}</td>
                                <td className="px-3 py-1.5 font-mono text-[11px] text-slate-600">
                                  {c.phone}
                                </td>
                                <td className="px-3 py-1.5">
                                  {c.status === 'sent' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                                      <CheckCircle2 className="h-3 w-3" /> Sent
                                    </span>
                                  )}
                                  {c.status === 'skipped' && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-700">
                                      <X className="h-3 w-3" /> Failed
                                    </span>
                                  )}
                                  {(!c.status || c.status === 'pending') && (
                                    <span className="text-[10px] font-medium text-slate-400">
                                      Pending
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : engineMode === 'direct' ? (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Send className="h-4 w-4 text-emerald-700" />
                    <CardTitle className="text-base">3. Direct WhatsApp Dispatch Runner</CardTitle>
                  </div>
                  {contacts.length > 0 && (
                    <span className="text-xs font-bold text-slate-600 font-mono">
                      {directIndex + 1} / {contacts.length}
                    </span>
                  )}
                </div>
                <CardDescription className="text-xs">
                  Runs directly in your browser. Click to open each recipient in WhatsApp Web / App with their message pre-filled.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {contacts.length === 0 ? (
                  <div className="text-center py-8 rounded-xl border border-dashed border-slate-200 bg-slate-50/50 space-y-2">
                    <Users className="h-8 w-8 mx-auto text-slate-400" />
                    <p className="text-xs font-medium text-slate-600">
                      Upload an Excel or CSV file on the left to start sending.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span>
                          Progress: {directSentCount} sent, {directSkippedCount} skipped
                        </span>
                        <span>{directProgressPercent}%</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${directProgressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Active Lead Box */}
                    {currentDirect ? (
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/30 p-4 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wide">
                                Lead #{directIndex + 1}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  currentDirect.status === 'sent'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : currentDirect.status === 'skipped'
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {currentDirect.status?.toUpperCase() || 'PENDING'}
                              </span>
                            </div>
                            <h3 className="text-sm font-extrabold text-slate-900 mt-1">
                              {currentDirect.name}
                            </h3>
                            <p className="text-xs font-mono font-medium text-slate-600">
                              +{currentDirect.phone}
                            </p>
                          </div>

                          <div className="text-right">
                            <label className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={autoAdvance}
                                onChange={(e) => setAutoAdvance(e.target.checked)}
                                className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                              />
                              Auto-advance
                            </label>
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-100">
                          <Button
                            onClick={handleDirectSendCurrent}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm h-9 px-4"
                          >
                            <MessageCircle className="mr-1.5 h-4 w-4" />
                            Send in WhatsApp
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDirectSkipCurrent}
                            className="text-xs h-9 border-slate-200"
                          >
                            <SkipForward className="mr-1 h-3.5 w-3.5" />
                            Skip
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleDirectResetQueue}
                            className="text-xs h-9 text-slate-500 hover:text-slate-800 ml-auto"
                            title="Reset progress to beginning"
                          >
                            <RotateCcw className="mr-1 h-3.5 w-3.5" />
                            Reset
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                        <CheckCircle2 className="h-8 w-8 mx-auto text-emerald-600" />
                        <p className="text-xs font-bold text-slate-800">
                          All contacts reviewed!
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleDirectResetQueue}
                          className="text-xs"
                        >
                          Start Over
                        </Button>
                      </div>
                    )}

                    {/* Recipient list table */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>Recipient Queue ({contacts.length})</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          Click row to jump to contact
                        </span>
                      </div>

                      <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-inner">
                        <table className="w-full text-left text-xs">
                          <thead className="sticky top-0 bg-slate-100 text-[10px] uppercase font-bold text-slate-500">
                            <tr>
                              <th className="px-3 py-1.5">#</th>
                              <th className="px-3 py-1.5">Name</th>
                              <th className="px-3 py-1.5">Phone</th>
                              <th className="px-3 py-1.5">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-slate-700">
                            {contacts.map((c, i) => {
                              const isCurrent = i === directIndex;
                              return (
                                <tr
                                  key={i}
                                  onClick={() => setDirectIndex(i)}
                                  className={`cursor-pointer transition hover:bg-slate-50 ${
                                    isCurrent ? 'bg-emerald-50/80 font-bold' : ''
                                  }`}
                                >
                                  <td className="px-3 py-1.5 font-mono text-[11px] text-slate-400">
                                    {i + 1}
                                  </td>
                                  <td className="px-3 py-1.5 truncate max-w-[140px]">{c.name}</td>
                                  <td className="px-3 py-1.5 font-mono text-[11px] text-slate-600">
                                    {c.phone}
                                  </td>
                                  <td className="px-3 py-1.5">
                                    {c.status === 'sent' && (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                                        <CheckCircle2 className="h-3 w-3" /> Sent
                                      </span>
                                    )}
                                    {c.status === 'skipped' && (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700">
                                        <Clock className="h-3 w-3" /> Skipped
                                      </span>
                                    )}
                                    {(!c.status || c.status === 'pending') && (
                                      <span className="text-[10px] font-medium text-slate-400">
                                        Pending
                                      </span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="border-slate-200 shadow-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Send className="h-4 w-4 text-brand-700" />
                  <CardTitle className="text-base">3. Outreach Delivery Mode</CardTitle>
                </div>
                <CardDescription className="text-xs">
                  Choose between automated batch delivery or step-by-step manual review.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mode Toggle */}
                <div className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 p-1 bg-slate-50 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => {
                      setSendMode('batch');
                      setManualActive(false);
                    }}
                    className={`rounded-md py-1.5 transition ${
                      sendMode === 'batch'
                        ? 'bg-white text-brand-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    🚀 Automatic Batch
                  </button>
                  <button
                    type="button"
                    onClick={() => setSendMode('manual')}
                    className={`rounded-md py-1.5 transition ${
                      sendMode === 'manual'
                        ? 'bg-white text-brand-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    🔍 Manual Review Mode
                  </button>
                </div>

                {/* Mode A: Batch Configuration */}
                {sendMode === 'batch' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Batch Size</label>
                        <select
                          value={batchSize}
                          onChange={(e) => setBatchSize(e.target.value)}
                          disabled={isSending}
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 outline-none"
                        >
                          <option value="all">All Contacts ({contacts.length})</option>
                          <option value="5">First 5</option>
                          <option value="10">First 10</option>
                          <option value="25">First 25</option>
                          <option value="50">First 50</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-slate-600 block mb-1">Delay Between Sends</label>
                        <select
                          value={delaySec}
                          onChange={(e) => setDelaySec(Number(e.target.value))}
                          disabled={isSending}
                          className="h-8 w-full rounded-md border border-slate-200 bg-white px-2 text-xs font-medium text-slate-800 outline-none"
                        >
                          <option value={3}>3 seconds</option>
                          <option value={5}>5 seconds (recommended)</option>
                          <option value={10}>10 seconds</option>
                          <option value={15}>15 seconds (safe)</option>
                        </select>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    {sendProgress && (
                      <div className="space-y-1.5 rounded-lg border border-brand-100 bg-brand-50/60 p-3">
                        <div className="flex items-center justify-between text-xs font-semibold text-brand-900">
                          <span>Sending batch progress…</span>
                          <span>
                            {sendProgress.current} / {sendProgress.total}
                          </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-brand-200">
                          <div
                            className="h-full bg-brand-600 transition-all duration-300"
                            style={{ width: `${(sendProgress.current / sendProgress.total) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleStartBatchSend}
                      disabled={isSending || !isConnected || contacts.length === 0}
                      className="w-full bg-brand-700 hover:bg-brand-800 text-white font-semibold"
                    >
                      {isSending ? (
                        <>
                          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                          Sending Batch…
                        </>
                      ) : (
                        <>
                          <Play className="mr-2 h-4 w-4" />
                          Start Batch Delivery
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Mode B: Manual Step-Through Box */}
                {sendMode === 'manual' && (
                  <div className="space-y-3">
                    {!manualActive ? (
                      <div className="text-center py-4 space-y-2">
                        <p className="text-xs text-slate-600">
                          Review and customize the message for each recipient one-by-one before sending.
                        </p>
                        <Button
                          onClick={handleStartManualMode}
                          disabled={!isConnected || contacts.length === 0}
                          variant="outline"
                          className="border-brand-600 text-brand-700 hover:bg-brand-50"
                        >
                          <Users className="mr-1.5 h-4 w-4" />
                          Begin Manual Review ({contacts.length} recipients)
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-brand-200 bg-brand-50/40 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-brand-900">
                            Recipient {manualIdx + 1} of {contacts.length}
                          </span>
                          <span className="font-mono text-xs font-semibold text-slate-600">
                            {contacts[manualIdx]?.phone}
                          </span>
                        </div>

                        <p className="text-xs font-semibold text-slate-800">
                          {contacts[manualIdx]?.name}
                        </p>

                        <textarea
                          value={manualCustomMsg}
                          onChange={(e) => setManualCustomMsg(e.target.value)}
                          rows={3}
                          className="w-full rounded-md border border-slate-200 p-2 text-xs text-slate-800 outline-none"
                        />

                        <div className="flex flex-wrap items-center gap-2 pt-1">
                          <Button
                            size="sm"
                            onClick={handleManualSendCurrent}
                            className="bg-brand-700 hover:bg-brand-800 text-xs"
                          >
                            <Send className="mr-1.5 h-3.5 w-3.5" />
                            Send &amp; Next
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleManualSkip}
                            className="text-xs"
                          >
                            <SkipForward className="mr-1.5 h-3.5 w-3.5" />
                            Skip
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleManualStop}
                            className="text-xs text-rose-600 hover:bg-rose-50"
                          >
                            <Square className="mr-1.5 h-3.5 w-3.5" />
                            Stop Review
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Card: Live Activity Log */}
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Real-Time Delivery &amp; Server Log</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLogs([])}
                  className="h-7 text-xs text-slate-400 hover:text-slate-700"
                >
                  <Trash2 className="mr-1 h-3 w-3" />
                  Clear
                </Button>
              </div>
              <CardDescription className="text-xs">
                Live stream of WhatsApp Web client events, delivery confirmations, and send errors.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                ref={logContainerRef}
                className="h-56 overflow-y-auto rounded-lg bg-slate-950 p-3 font-mono text-[11px] leading-relaxed text-slate-300 shadow-inner space-y-1.5"
              >
                {logs.length === 0 ? (
                  <div className="text-slate-600 italic">No activity logged yet. System ready.</div>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="flex items-start gap-1.5">
                      <span className="shrink-0 text-slate-500 font-mono">[{log.timestamp}]</span>
                      <span
                        className={
                          log.type === 'success'
                            ? 'text-emerald-400 font-semibold'
                            : log.type === 'error'
                            ? 'text-rose-400 font-semibold'
                            : log.type === 'warning'
                            ? 'text-amber-300 font-semibold'
                            : 'text-slate-300'
                        }
                      >
                        {log.message}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
