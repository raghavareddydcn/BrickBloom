const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static(path.join(__dirname)));

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

// ─── Admin portal ──────────────────────────────────────────────────────────
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/invoice', (req, res) => {
  res.sendFile(path.join(__dirname, 'invoice.html'));
});

app.get('/public', (req, res) => {
  res.redirect('/');
});

app.get('/public/:asset(*)', (req, res) => {
  const assetPath = req.params.asset;
  res.redirect(`/${assetPath}`);
});

const nodemailer = require('nodemailer');

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
const fs = require('fs');
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

app.get('/whatsapp', (req, res) => {
  res.sendFile(path.join(__dirname, 'whatsapp.html'));
});

// ─── WhatsApp Integration ────────────────────────────────────────────────
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');
const qrcode = require('qrcode');

// Simple debug logger: console + append to wa-debug.log
const waLogFile = path.join(__dirname, 'wa-debug.log');
function waDebug(level, msg) {
  try {
    const line = `[${new Date().toISOString()}] [${level}] ${msg}`;
    console.log(line);
    fs.appendFile(waLogFile, line + '\n', () => {});
  } catch (e) {
    console.error('waDebug error', e);
  }
}

let waClient = null;
let waStatus = 'disconnected'; // 'disconnected', 'qr', 'ready'
let waQrUrl = null;
let waLastError = null;
let waInitTimer = null;
let qrSubscribers = [];

function notifySubscribers(event, data) {
  qrSubscribers.forEach(res => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${data}\n\n`);
  });
}

app.get('/api/wa/status', (req, res) => {
  res.json({ state: waStatus, error: waLastError });
});

app.get('/api/wa/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  qrSubscribers.push(res);
  
  // Send immediate state
  if (waStatus === 'qr' && waQrUrl) {
    res.write(`event: qr\ndata: ${waQrUrl}\n\n`);
  } else if (waStatus === 'ready') {
    res.write(`event: ready\ndata: {}\n\n`);
  } else if (waStatus === 'starting') {
    res.write(`event: starting\ndata: {}\n\n`);
  }
  
  req.on('close', () => {
    qrSubscribers = qrSubscribers.filter(s => s !== res);
  });
});

app.post('/api/wa/connect', (req, res) => {
  if (waClient) {
    return res.json({ success: true, message: 'Already initializing or connected' });
  }
  waDebug('info', 'POST /api/wa/connect called');
  waStatus = 'starting';
  waLastError = null;
  clearTimeout(waInitTimer);
  waClient = new Client({
    authStrategy: new LocalAuth({ clientId: 'brickbloom' }),
    webVersionCache: { type: 'none' },
    takeoverOnConflict: true,
    takeoverTimeoutMs: 1000,
    puppeteer: {
      headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  });

  waClient.on('qr', async (qr) => {
    waStatus = 'qr';
    waQrUrl = await qrcode.toDataURL(qr);
    waDebug('info', 'QR generated for scanning');
    notifySubscribers('qr', waQrUrl);
  });

  // Notify listeners that initialization has started
  notifySubscribers('starting', '{}');
  waDebug('info', 'WhatsApp initialization started');

  waClient.on('ready', () => {
    clearTimeout(waInitTimer);
    waStatus = 'ready';
    waLastError = null;
    waQrUrl = null;
    notifySubscribers('ready', '{}');
    waDebug('info', 'WhatsApp Client is ready');
  });

  waClient.on('authenticated', () => {
    waDebug('info', 'WhatsApp authentication completed');
  });

  waClient.on('change_state', (state) => {
    waDebug('info', `WhatsApp state changed: ${state}`);
  });

  waClient.on('disconnected', () => {
    clearTimeout(waInitTimer);
    waStatus = 'disconnected';
    waDebug('warn', 'WhatsApp client disconnected');
    waClient = null;
    notifySubscribers('disconnected', '{}');
  });

  waClient.on('auth_failure', (message) => {
    waLastError = `WhatsApp authentication failed: ${message}`;
    waDebug('error', waLastError);
    notifySubscribers('error', JSON.stringify({ message: waLastError }));
  });

  waClient.initialize().catch(err => {
    clearTimeout(waInitTimer);
    waLastError = err && err.message ? err.message : String(err);
    waDebug('error', `WhatsApp Init Error: ${err && err.stack ? err.stack : err}`);
    waStatus = 'disconnected';
    waClient = null;
    notifySubscribers('error', JSON.stringify({ message: waLastError }));
    notifySubscribers('disconnected', '{}');
  });

  waInitTimer = setTimeout(async () => {
    if (waStatus === 'starting' && waClient) {
      await resetWAClient('WhatsApp initialization timed out. Please scan a fresh QR code.');
    }
  }, 30000);

  res.json({ success: true });
});

app.post('/api/wa/disconnect', async (req, res) => {
  const client = waClient;
  clearTimeout(waInitTimer);
  waClient = null;
  waStatus = 'disconnected';
  waLastError = null;
  notifySubscribers('disconnected', '{}');
  if (client) {
    try {
      await Promise.race([
        client.destroy(),
        new Promise(resolve => setTimeout(resolve, 5000))
      ]);
    } catch (err) {
      waDebug('warn', `WhatsApp disconnect cleanup failed: ${err.message}`);
    }
  }
  res.json({ success: true });
});

// Return recent WA debug log (last N chars) for quick inspection
app.get('/api/wa/log', (req, res) => {
  try {
    if (!fs.existsSync(waLogFile)) return res.json({ ok: true, log: '' });
    const stat = fs.statSync(waLogFile);
    const max = 20000;
    const size = stat.size;
    const start = Math.max(0, size - max);
    const fd = fs.openSync(waLogFile, 'r');
    const buffer = Buffer.alloc(Math.min(max, size));
    fs.readSync(fd, buffer, 0, buffer.length, start);
    fs.closeSync(fd);
    res.json({ ok: true, log: buffer.toString('utf8') });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

const delay = ms => new Promise(res => setTimeout(res, ms));

async function waClientIsUsable() {
  if (!waClient || waStatus !== 'ready') return false;
  if (!waClient.pupBrowser || !waClient.pupBrowser.isConnected()) return false;
  if (!waClient.pupPage || waClient.pupPage.isClosed()) return false;
  return true;
}

async function resetWAClient(reason) {
  waDebug('warn', `Resetting WhatsApp client: ${reason}`);
  const client = waClient;
  waClient = null;
  waStatus = 'disconnected';
  waLastError = reason;
  notifySubscribers('error', JSON.stringify({ message: reason }));
  notifySubscribers('disconnected', '{}');
  if (client) {
    try {
      await client.destroy();
    } catch (err) {
      waDebug('warn', `WhatsApp client cleanup failed: ${err.message}`);
    }
  }
}

app.post('/api/wa/send', async (req, res) => {
  if (!(await waClientIsUsable())) {
    if (waClient) await resetWAClient('WhatsApp browser session is no longer active. Please reconnect.');
    return res.status(400).json({ error: 'WhatsApp is not ready' });
  }

  const { contacts, template, media } = req.body;
  if (!contacts || !Array.isArray(contacts)) {
    return res.status(400).json({ error: 'Invalid contacts array' });
  }

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  let mediaObj = null;
  if (media && media.mimetype && media.data) {
    mediaObj = new MessageMedia(media.mimetype, media.data, media.filename);
  }

  waDebug('info', `Send requested: contacts=${contacts.length}, templateLen=${String(template||'').length}, media=${mediaObj ? 'yes' : 'no'}`);

  for (let i = 0; i < contacts.length; i++) {
    const c = contacts[i];
    const name = c.name || 'Customer';
    let phone = c.phone.replace(/\D/g, '');
    
    // Add 91 if it is an Indian 10-digit number
    if (phone.length === 10) phone = '91' + phone;
    
    const numberId = phone + '@c.us';
    const message = template.replace(/{name}/gi, name);

    try {
      const resolvedId = await waClient.getNumberId(phone);
      if (!resolvedId || !resolvedId._serialized) {
        throw new Error(`The number ${phone} is not registered on WhatsApp`);
      }

      waDebug('info', `Sending to ${resolvedId._serialized} (name=${name})`);
      if (mediaObj) {
        // Send the caption and attachment as one WhatsApp message.
        await waClient.sendMessage(numberId, message, {
          media: mediaObj,
          sendMediaAsDocument: mediaObj.mimetype === 'application/pdf'
        });
      } else {
        await waClient.sendMessage(resolvedId._serialized, message);
      }
      waDebug('info', `Sent to ${resolvedId._serialized} (name=${name})`);
      res.write(JSON.stringify({ status: 'success', name, phone }) + '\n');
    } catch (err) {
      waDebug('error', `Send error to ${numberId} (name=${name}): ${err && err.stack ? err.stack : err}`);
      if (/detached Frame|Target closed|Session closed|Execution context was destroyed/i.test(err.message || '')) {
        await resetWAClient('WhatsApp browser session became inactive. Please reconnect.');
      }
      res.write(JSON.stringify({ status: 'error', name, phone, error: err.message }) + '\n');
    }

    // Delay 3 seconds between sends to avoid getting banned
    if (i < contacts.length - 1) {
      await delay(3000);
    }
  }

  res.write(JSON.stringify({ status: 'done' }) + '\n');
  res.end();
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BrickBloom site running on http://localhost:${PORT}`);
});
