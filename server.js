import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import nodemailer from 'nodemailer';
import whatsappWeb from 'whatsapp-web.js';
import qrcode from 'qrcode';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const { Client, LocalAuth, MessageMedia } = whatsappWeb;

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
if (fs.existsSync(distDir)) app.use(express.static(distDir));
app.use(express.static(publicDir));
app.use(express.static(__dirname));

const marketIntelligence = {
  overview: 'Premium BrickBloom sourcing for hydroponics, nurseries, and commercial growers.',
  formats: [
    {
      name: 'Ready Pot',
      benefit: 'A ready-to-gift 4" eco-coir pot with coco peat and premium seeds in an eco-friendly gift box.',
      path: '/open-top-growbags.html',
      image: '/images/actual-products/Ready-Pot.JPG'
    },
    {
      name: 'Starter Kit',
      benefit: 'A compact 2-pot DIY coir kit with coco peat and premium seed balls for easy at-home growing.',
      path: '/tabs.html',
      image: '/images/actual-products/Strater-kit.JPG'
    },
    {
      name: 'Medium Kit',
      benefit: 'A complete 2-pot medium DIY coir kit with larger 6" pots, coco peat, and premium seed balls.',
      path: '/loose.html',
      image: '/images/actual-products/Medium-Kit.JPG'
    },
    {
      name: 'Premium Kit',
      benefit: 'Our top-tier kit with 6 eco-coir pots, a hanging coir basket, and a coco support pole in a luxury box.',
      path: '/growbags.html',
      image: '/images/actual-products/premium.png'
    },
    {
      name: 'Coco Grow Disk',
      benefit: 'Uniform coco grow disks for clean propagation, quick rooting, and tidy nursery handling.',
      path: '/coco-grow-cubes.html',
      image: '/images/actual-products/disk.png'
    },
    {
      name: 'Premium Cocopeat',
      benefit: 'Premium cocopeat media formulated for strong root growth and reliable moisture retention.',
      path: '/blocks.html',
      image: '/images/actual-products/Brick.JPG'
    }
  ],
  sourcingHubs: [
    { region: 'India', focus: 'Large-scale processing, low-EC custom blends, and compressed bales.' },
    { region: 'Sri Lanka', focus: 'Naturally aged, high-porosity cocopeat for premium media mixes.' },
    { region: 'Global directories', focus: 'Direct sourcing from certified mills and exporters.' }
  ],
  qualityNotes: [
    'Washed and buffered media for lower salinity.',
    'Custom peat-to-chip ratios for different crop programs.',
    'Bulk freight-ready packaging for long-haul export.'
  ]
};

app.get('/api/market-intelligence', (req, res) => {
  res.json(marketIntelligence);
});

app.post('/api/leads', async (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !company || !message) {
    return res.status(400).json({ message: 'Please complete every field so we can prepare your quote.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: `"${name}" <${email}>`, 
      to: 'admin@brickbloom.co.in',
      subject: `BrickBloom Sourcing Inquiry from ${company}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nInquiry:\n${message}`
    };

    if (process.env.SMTP_USER) {
      await transporter.sendMail(mailOptions);
    } else {
      console.log("Simulating email send (SMTP not configured):", mailOptions);
    }

    if (req.headers.accept && req.headers.accept.includes('text/html')) {
      const safeName = String(name).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      return res.send(`<!doctype html><html><head><meta charset="utf-8"><title>Inquiry received</title></head><body><h1>Thank you, ${safeName}</h1><p>Our sourcing desk will contact you shortly.</p><p><a href="/">Back to home</a></p></body></html>`);
    }

    res.json({ message: `Thank you, ${name}. Our sourcing desk will contact you shortly.` });
  } catch (error) {
    console.error("Email sending error:", error);
    res.status(500).json({ message: 'There was an error processing your inquiry. Please try again later.' });
  }
});

// ─── Invoice Persistence API ────────────────────────────────────────────────
const invoicesDir = path.join(__dirname, 'invoices');
if (!fs.existsSync(invoicesDir)) {
  fs.mkdirSync(invoicesDir, { recursive: true });
}

app.get('/api/invoices', (req, res) => {
  try {
    const files = fs.readdirSync(invoicesDir).filter(f => f.endsWith('.json'));
    const invoices = files.map(f => {
      try {
        return JSON.parse(fs.readFileSync(path.join(invoicesDir, f), 'utf8'));
      } catch (err) {
        return null;
      }
    }).filter(Boolean);
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read invoices' });
  }
});

app.post('/api/invoices', (req, res) => {
  try {
    const invoice = req.body;
    if (!invoice || !invoice.id) {
      return res.status(400).json({ error: 'Invoice ID is required' });
    }
    const filename = `${String(invoice.id).replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
    const filePath = path.join(invoicesDir, filename);
    fs.writeFileSync(filePath, JSON.stringify(invoice, null, 2), 'utf8');
    res.json({ success: true, message: 'Invoice saved to repo', filename });
  } catch (err) {
    console.error('Error saving invoice:', err);
    res.status(500).json({ error: 'Failed to save invoice to server' });
  }
});

app.delete('/api/invoices/:id', (req, res) => {
  try {
    const id = req.params.id;
    const filename = `${String(id).replace(/[^a-zA-Z0-9_-]/g, '_')}.json`;
    const filePath = path.join(invoicesDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    res.json({ success: true, message: 'Invoice deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
});

const waLogFile = path.join(__dirname, 'wa-debug.log');
function waLog(level, msg) {
  const line = `[${new Date().toISOString()}] [${level}] ${msg}\n`;
  try { fs.appendFileSync(waLogFile, line); } catch (_) {}
  console.log(line.trim());
}

// ─── WhatsApp Bulk Sender ─────────────────────────────────────────────────────
// ── State ──────────────────────────────────────────────────────────────────────
let waClient   = null;
let waStatus   = 'disconnected';  // disconnected | initializing | qr | ready
let waQrData   = null;            // base64 QR PNG
let waError    = null;
let waInitTimeout = null;
const SSE_CLIENTS = new Set();

// ── SSE helpers ────────────────────────────────────────────────────────────────
function sseWrite(res, event, data) {
  try { res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`); } catch (_) {}
}

function broadcast(event, data) {
  for (const res of SSE_CLIENTS) sseWrite(res, event, data);
}

async function stopWAClient(client) {
  if (!client) return;
  try {
    const proc = client.pupBrowser ? client.pupBrowser.process() : null;
    const pid = proc ? proc.pid : null;

    await Promise.race([
      client.destroy(),
      new Promise(r => setTimeout(r, 3000))
    ]);

    if (pid) {
      try {
        await execAsync(`taskkill /pid ${pid} /T /F`);
      } catch (_) {}
    }
  } catch (e) {
    console.warn('[WA] Error destroying client:', e.message);
  }
}

async function closeWASession(reason) {
  waLog('warn', 'closeWASession called: ' + (reason || 'no reason'));
  clearTimeout(waInitTimeout);
  const prev = waClient;
  waClient = null;
  waStatus = 'disconnected';
  waQrData = null;
  waError = reason || null;
  broadcast('state', { status: 'disconnected', error: waError });

  if (prev) {
    await stopWAClient(prev);
  }
}

async function clearWASession(reason) {
  await closeWASession(reason);
  await new Promise(r => setTimeout(r, 600));

  const authDir = path.join(__dirname, '.wwebjs_auth');
  if (fs.existsSync(authDir)) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        fs.rmSync(authDir, { recursive: true, force: true });
        console.log('[WA] Cleared session folder .wwebjs_auth');
        break;
      } catch (e) {
        if (attempt === 3) {
          console.warn('[WA] Could not delete .wwebjs_auth folder after 3 attempts:', e.message);
        } else {
          await new Promise(r => setTimeout(r, 500));
        }
      }
    }
  }
}

async function resetWA(reason) {
  await closeWASession(reason);
}

// ── GET /api/wa/status ─────────────────────────────────────────────────────────
app.get('/api/wa/status', (req, res) => {
  res.json({ status: waStatus, qr: waQrData, error: waError });
});

// ── GET /api/wa/stream  (SSE) ──────────────────────────────────────────────────
app.get('/api/wa/stream', (req, res) => {
  res.setHeader('Content-Type',  'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection',    'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const hb = setInterval(() => { try { res.write(': ping\n\n'); } catch (_) {} }, 20000);

  SSE_CLIENTS.add(res);
  sseWrite(res, 'state', { status: waStatus, qr: waQrData, error: waError });

  req.on('close', () => {
    clearInterval(hb);
    SSE_CLIENTS.delete(res);
  });
});

// ── POST /api/wa/connect ───────────────────────────────────────────────────────
app.post('/api/wa/connect', async (req, res) => {
  waLog('info', 'POST /api/wa/connect called (status was: ' + waStatus + ')');
  if (waClient && (waStatus === 'initializing' || waStatus === 'qr' || waStatus === 'ready')) {
    return res.json({ ok: true, status: waStatus });
  }

  try {
    if (waClient) await closeWASession();

    waStatus = 'initializing';
    waError  = null;
    waQrData = null;
    broadcast('state', { status: 'initializing' });

    const client = new Client({
      authStrategy: new LocalAuth({ clientId: 'brickbloom' }),
      webVersionCache: { type: 'none' },
      takeoverOnConflict: true,
      takeoverTimeoutMs: 3000,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
      puppeteer: {
        headless: true,
        timeout: 60000,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--disable-extensions',
          '--disable-background-timer-throttling',
          '--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
        ]
      },
      authTimeoutMs: 120000,
      restartOnAuthFail: true
    });

    waClient = client;

    client.on('qr', async (qr) => {
      clearTimeout(waInitTimeout);
      waStatus = 'qr';
      waQrData = await qrcode.toDataURL(qr);
      broadcast('state', { status: 'qr', qr: waQrData });
      waLog('info', 'QR generated for scanning');
    });

    client.on('authenticated', () => {
      waLog('info', 'WhatsApp authentication completed');
    });

    client.on('ready', () => {
      clearTimeout(waInitTimeout);
      waStatus = 'ready';
      waQrData = null;
      waError  = null;
      broadcast('state', { status: 'ready' });
      waLog('info', 'WhatsApp Client is ready');
    });

    client.on('auth_failure', async (msg) => {
      waLog('error', 'Auth failure: ' + msg);
      waError = 'Authentication failed — please reconnect and scan QR again.';
      await clearWASession(waError);
    });

    client.on('disconnected', async (reason) => {
      waLog('warn', 'Client emitted disconnected: ' + reason);
      if (waClient === client) await closeWASession('WhatsApp disconnected: ' + reason);
    });

    waInitTimeout = setTimeout(async () => {
      if (waClient === client && waStatus === 'initializing') {
        await closeWASession('WhatsApp took too long to initialize. Please try again.');
      }
    }, 180000);

    client.initialize().catch(async (err) => {
      if (waClient === client) {
        waLog('error', 'WhatsApp Init Error: ' + (err && err.stack ? err.stack : err));
        await closeWASession('WhatsApp init failed: ' + (err && err.message ? err.message : String(err)));
      }
    });

    res.json({ ok: true, status: waStatus });
  } catch (err) {
    console.error('[WA] Module loading error:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

// ── POST /api/wa/disconnect ────────────────────────────────────────────────────
app.post('/api/wa/disconnect', async (req, res) => {
  await closeWASession();
  res.json({ ok: true, status: 'disconnected' });
});

app.post('/api/wa/clear-session', async (req, res) => {
  await clearWASession();
  res.json({ ok: true, status: 'disconnected', message: 'WhatsApp session cleared successfully' });
});

app.post('/api/wa/logout', async (req, res) => {
  await clearWASession();
  res.json({ ok: true, status: 'disconnected' });
});

// ── POST /api/wa/send ──────────────────────────────────────────────────────────
const delay = ms => new Promise(r => setTimeout(r, ms));

app.post('/api/wa/send', async (req, res) => {
  if (waStatus !== 'ready' || !waClient) {
    return res.status(400).json({ error: 'WhatsApp is not connected.' });
  }

  const { contacts, template, media, delay_ms } = req.body;
  if (!Array.isArray(contacts) || contacts.length === 0) {
    return res.status(400).json({ error: 'No contacts provided.' });
  }

  const DELAY = Math.max(2000, Math.min(parseInt(delay_ms) || 3000, 10000));

  // Build media object once (if any)
  let mediaObj = null;
  if (media && media.mimetype && media.data) {
    mediaObj = new MessageMedia(media.mimetype, media.data, media.filename || 'attachment');
  }

  // Stream progress back
  res.setHeader('Content-Type', 'application/x-ndjson');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.setHeader('X-Accel-Buffering', 'no');

  const writeRow = (obj) => res.write(JSON.stringify(obj) + '\n');

  for (let i = 0; i < contacts.length; i++) {
    if (waStatus !== 'ready' || !waClient) {
      writeRow({ status: 'error', name: contacts[i].name, phone: contacts[i].phone, error: 'WhatsApp disconnected during send.' });
      break;
    }

    const c = contacts[i];
    const name = (c.name || 'Customer').trim();
    let phone = c.phone.replace(/\D/g, '');
    if (phone.length === 10) phone = '91' + phone;   // default India country code

    const message = (template || '').replace(/{name}/gi, name);

    try {
      // Verify the number is on WhatsApp before sending
      const numberId = await waClient.getNumberId(phone);
      if (!numberId) throw new Error(`+${phone} is not registered on WhatsApp`);

      if (mediaObj) {
        // Send media with caption
        await waClient.sendMessage(numberId._serialized, mediaObj, { caption: message, sendMediaAsDocument: mediaObj.mimetype === 'application/pdf' });
      } else {
        await waClient.sendMessage(numberId._serialized, message);
      }

      console.log(`[WA] Sent → ${phone} (${name})`);
      writeRow({ status: 'success', name, phone: '+' + phone });
    } catch (err) {
      const errMsg = err && err.message ? err.message : String(err);
      console.error(`[WA] Send error → ${phone}:`, errMsg);

      // Detect fatal Chromium crash
      if (/detached|target closed|session closed|execution context/i.test(errMsg)) {
        writeRow({ status: 'error', name, phone: '+' + phone, error: errMsg });
        writeRow({ status: 'fatal', error: 'WhatsApp browser crashed. Reconnect required.' });
        resetWA('Browser session lost during send.');
        break;
      }

      writeRow({ status: 'error', name, phone: '+' + phone, error: errMsg });
    }

    if (i < contacts.length - 1) await delay(DELAY);
  }

  writeRow({ status: 'done' });
  res.end();
});

// ── Fallback (must stay LAST) ──────────────────────────────────────────────────

// ── Audit Log Endpoint & Logger ──
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
const auditLogFile = path.join(logsDir, 'audit.log');

app.post('/api/audit-log', (req, res) => {
  const { timestamp, action, performedBy, entityId, summary, details } = req.body || {};
  const now = timestamp || new Date().toISOString();
  const line = `[${now}] [${performedBy || 'admin'}] ${action || 'UNKNOWN'} | ID: ${entityId || '-'} | ${summary || ''} | Details: ${JSON.stringify(details || {})}\n`;
  
  fs.appendFile(auditLogFile, line, (err) => {
    if (err) console.error('Failed to write to audit.log:', err);
  });
  
  res.json({ ok: true });
});

app.get('/api/audit-log', (req, res) => {
  if (fs.existsSync(auditLogFile)) {
    const logs = fs.readFileSync(auditLogFile, 'utf8');
    res.type('text/plain').send(logs);
  } else {
    res.send('No audit logs recorded yet.');
  }
});

app.get('/{*path}', (req, res) => {
  const indexPath = fs.existsSync(path.join(distDir, 'index.html'))
    ? path.join(distDir, 'index.html')
    : path.join(__dirname, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`BrickBloom site running on http://localhost:${PORT}`);
});
