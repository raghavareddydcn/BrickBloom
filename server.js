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

// Serve built React assets from dist/ if available, otherwise public/
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}
app.use(express.static(publicDir));

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

// Contact / Leads Endpoint
app.post('/api/leads', (req, res) => {
  const { name, email, company, message } = req.body;

  if (!name || !email || !company || !message) {
    return res.status(400).json({ message: 'Please complete every field so we can prepare your quote.' });
  }

  res.json({ message: `Thank you, ${name}. Our sourcing desk will contact you shortly.` });
});

// SPA Catch-all Route
app.get('/{*path}', (req, res) => {
  const indexPath = fs.existsSync(path.join(distDir, 'index.html'))
    ? path.join(distDir, 'index.html')
    : path.join(publicDir, 'index.html');
  res.sendFile(indexPath);
});

app.listen(PORT, () => {
  console.log(`BrickBloom modern React application running on http://localhost:${PORT}`);
});
