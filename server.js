const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const marketIntelligence = {
  overview: 'Premium BrickBloom sourcing for hydroponics, nurseries, and commercial growers.',
  formats: [
    {
      name: 'Coco Tabs',
      benefit: 'Eco-friendly propagation tablets for seed starting and cuttings.',
      path: '/tabs.html',
      image: '/images/coco-tabs.svg'
    },
    {
      name: 'Coco Grow Cubes',
      benefit: 'Preformed grow cubes for uniform rooting and clean handling.',
      path: '/coco-grow-cubes.html',
      image: '/images/coco-grow-cubes.svg'
    },
    {
      name: 'Coco Bricks',
      benefit: 'Compressed cocopeat bricks for potting mixes and seedling beds.',
      path: '/coco-bricks.html',
      image: '/images/coco-bricks.png'
    },
    {
      name: 'Coco Blocks',
      benefit: 'Bulk cocopeat blocks for growers and export-ready packs.',
      path: '/blocks.html',
      image: '/images/coco-blocks-branded.svg'
    },
    {
      name: 'Coco GrowSlabs',
      benefit: 'Ready-to-use slabs with controlled peat, fiber, and chip ratios.',
      path: '/coco-growslabs.html',
      image: '/images/coco-growslabs.png'
    },
    {
      name: 'Coco Growbags',
      benefit: 'Standard coco growbags for transplanting and greenhouse crops.',
      path: '/growbags.html',
      image: '/images/coco-growbags-branded.svg'
    },
    {
      name: 'Open Top Growbags',
      benefit: 'Open top growbags for premium planting and easy crop access.',
      path: '/open-top-growbags.html',
      image: '/images/open-top-growbags-branded.svg'
    },
    {
      name: 'Coco Loose Substrates',
      benefit: 'Loose cocopeat substrate for bulk potting and media mixing.',
      path: '/loose.html',
      image: '/images/coco-loose.svg'
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BrickBloom site running on http://localhost:${PORT}`);
});
