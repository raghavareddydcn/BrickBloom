import express from 'express';
import path from 'path';
import cors from 'cors';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Directories
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');
const invoicesDir = path.join(__dirname, 'invoices');
const logsDir = path.join(__dirname, 'logs');

if (!fs.existsSync(invoicesDir)) fs.mkdirSync(invoicesDir, { recursive: true });
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });

// Static assets
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}
app.use(express.static(publicDir));

// ── Market Intelligence Catalog API ─────────────────────────────────────────
const marketIntelligence = {
  overview: 'Premium BrickBloom sourcing for hydroponics, nurseries, and commercial growers.',
  formats: [
    {
      name: 'Ready Pot',
      benefit: 'A ready-to-gift 4" eco-coir pot with coco peat and premium seeds in an eco-friendly gift box.',
      path: '/products/ready-pot',
      image: '/images/actual-products/Ready-Pot.JPG'
    },
    {
      name: 'Starter Kit',
      benefit: 'A compact 2-pot DIY coir kit with coco peat and premium seed balls for easy at-home growing.',
      path: '/products/starter-kit',
      image: '/images/actual-products/Strater-kit.JPG'
    },
    {
      name: 'Medium Kit',
      benefit: 'A complete 2-pot medium DIY coir kit with larger 6" pots, coco peat, and premium seed balls.',
      path: '/products/medium-kit',
      image: '/images/actual-products/Medium-Kit.JPG'
    },
    {
      name: 'Premium Kit',
      benefit: 'Our top-tier kit with 6 eco-coir pots, a hanging coir basket, and a coco support pole in a luxury box.',
      path: '/products/premium-kit',
      image: '/images/actual-products/premium.png'
    },
    {
      name: 'Coco Grow Disk',
      benefit: 'Uniform coco grow disks for clean propagation, quick rooting, and tidy nursery handling.',
      path: '/products/coco-grow-disk',
      image: '/images/actual-products/disk.png'
    },
    {
      name: 'Premium Cocopeat',
      benefit: 'Premium cocopeat media formulated for strong root growth and reliable moisture retention.',
      path: '/products/premium-cocopeat',
      image: '/images/actual-products/Brick.JPG'
    },
    {
      name: 'Coco Bricks',
      benefit: 'Compressed cocopeat bricks for potting mixes and seedling beds.',
      path: '/products/coco-bricks',
      image: '/images/Brick5KG.jpeg'
    },
    {
      name: 'Coco GrowSlabs',
      benefit: 'Ready-to-use slabs with controlled peat, fiber, and chip ratios.',
      path: '/products/coco-growslabs',
      image: '/images/ALL products.png'
    },
    {
      name: 'Coir Chips',
      benefit: 'Open-structure coir chips for enhanced drainage, aeration, and soil blending in nursery media.',
      path: '/products/coir-chips',
      image: '/images/coir-chips.svg'
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

// ── Contact / Leads API ──────────────────────────────────────────────────────
app.post('/api/leads', (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !company || !message) {
    return res.status(400).json({ message: 'Please complete every field so we can prepare your quote.' });
  }

  res.json({ message: `Thank you, ${name}. Our sourcing desk will contact you shortly.` });
});

// ── Invoice Persistence API ──────────────────────────────────────────────────
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

// ── Audit Log Endpoint ───────────────────────────────────────────────────────
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

// ── Admin Tools Routes ───────────────────────────────────────────────────────
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(publicDir, 'admin.html'));
});

app.get('/invoice', (req, res) => {
  res.sendFile(path.join(publicDir, 'invoice.html'));
});

app.get('/inventory', (req, res) => {
  res.sendFile(path.join(publicDir, 'inventory.html'));
});

app.get('/whatsapp', (req, res) => {
  res.sendFile(path.join(publicDir, 'whatsapp.html'));
});

// ── SPA Catch-all Route ──────────────────────────────────────────────────────
app.get('/{*path}', (req, res) => {
  const indexPath = fs.existsSync(path.join(distDir, 'index.html'))
    ? path.join(distDir, 'index.html')
    : path.join(publicDir, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`BrickBloom modern application running on http://localhost:${PORT}`);
});
