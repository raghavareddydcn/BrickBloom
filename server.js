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

app.get('/public', (req, res) => {
  res.redirect('/');
});

app.get('/public/:asset(*)', (req, res) => {
  const assetPath = req.params.asset;
  res.redirect(`/${assetPath}`);
});

app.post('/api/leads', (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !company || !message) {
    return res.status(400).json({ message: 'Please complete every field so we can prepare your quote.' });
  }

  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    const safeName = String(name).replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    return res.send(`<!doctype html><html><head><meta charset="utf-8"><title>Inquiry received</title></head><body><h1>Thank you, ${safeName}</h1><p>Our sourcing desk will contact you shortly.</p><p><a href="/">Back to home</a></p></body></html>`);
  }

  res.json({ message: `Thank you, ${name}. Our sourcing desk will contact you shortly.` });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`BrickBloom site running on http://localhost:${PORT}`);
});
