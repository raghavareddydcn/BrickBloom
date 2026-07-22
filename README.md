# 🌿 BrickBloom — Modern Cocopeat Sourcing Platform

![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![Express](https://img.shields.io/badge/Express-4.22-blue.svg)
![AngularJS](https://img.shields.io/badge/AngularJS-1.8.2-red.svg)
![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)
![Free Cloud Ready](https://img.shields.io/badge/Deploy-Render%20%7C%20Vercel-success)

**BrickBloom** is a premium B2B web application and market-intelligence platform engineered for coconut-based growing media (cocopeat, growbags, growslabs, bricks, tabs, blocks, and loose substrates). Designed for commercial growers, hydroponic nurseries, and international importers, it showcases product specifications, global sourcing hubs, quality standards, and captures high-intent trade inquiries.

---

## ✨ Features

- **🛍️ Product Showcase**: Dedicated specs and landing pages for 8+ commercial cocopeat formats (Coco Bricks, Growbags, GrowSlabs, Open Top Growbags, Coco Tabs, Grow Cubes, Loose Substrates).
- **📊 Market Intelligence API**: Express REST endpoint delivering dynamic product catalogs, regional sourcing hub details (India, Sri Lanka), and quality benchmarks.
- **📩 Lead Capture System**: High-converting B2B inquiry form with both JSON AJAX submission and fallback HTML handling.
- **🎨 Apple-Inspired Aesthetic**: Modern typography (`Inter`), clean visual hierarchy, responsive grid layouts, custom CSS tokens, and glassmorphism headers.
- **☁️ Zero-Cost Cloud Deployment Ready**: Pre-configured for instant free hosting on **Render** or **Vercel**.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js (`cors`, `express.json`)
- **Frontend**: AngularJS 1.8.2 (SPA Controller), Vanilla HTML5/CSS3
- **Design System**: Vanilla CSS with custom properties (`:root`) and responsive grid/flexbox
- **Typography & Icons**: Google Fonts (`Inter`), SVG vector assets

---

## 📁 Project Structure

```text
cocopeat-site/
├── public/
│   ├── app.js                 # AngularJS single-page application controller
│   ├── styles.css             # Design tokens, Apple-inspired theme & layout styles
│   ├── index.html             # Main landing page & interactive lead form
│   ├── blocks.html            # Coco Blocks product detail page
│   ├── coco-bricks.html       # Coco Bricks product detail page
│   ├── coco-grow-cubes.html   # Grow Cubes product detail page
│   ├── coco-growslabs.html    # GrowSlabs product detail page
│   ├── coir-chips.html        # Coir Chips product detail page
│   ├── growbags.html          # Standard Growbags product detail page
│   ├── loose.html             # Loose Substrate product detail page
│   ├── open-top-growbags.html # Open Top Growbags product detail page
│   ├── tabs.html              # Coco Tabs product detail page
│   └── images/                # Brand logos, favicons, and graphic assets
├── server.js                  # Express server & REST API endpoints
├── SKILLS.md                  # Comprehensive skills & architectural audit
├── vercel.json                # Vercel serverless deployment configuration
├── package.json               # Node.js dependencies & run scripts
└── README.md                  # Project documentation & deployment guide
```

---

## ⚡ Quick Start (Local Setup)

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/raghavareddydcn/BrickBloom.git
   cd BrickBloom
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the local server**:
   ```bash
   npm start
   ```

4. **Access in browser**:
   Open [http://localhost:3000](http://localhost:3000)

---

## 📡 API Endpoints

### 1. `GET /api/market-intelligence`
Returns JSON catalog of product formats, regional sourcing hubs, and quality parameters.

**Sample Response:**
```json
{
  "overview": "Premium BrickBloom sourcing for hydroponics, nurseries...",
  "formats": [
    { "name": "Coco Tabs", "path": "/tabs.html", "benefit": "Eco-friendly propagation..." }
  ],
  "sourcingHubs": [
    { "region": "India", "focus": "Large-scale processing..." }
  ]
}
```

### 2. `POST /api/leads`
Receives buyer lead inquiries (Name, Email, Company, Message).

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@farm.com",
  "company": "Green Farms Ltd",
  "message": "Interested in 5000 units of Coco GrowSlabs."
}
```

---

## 🚀 Free Cloud Deployment Guide ($0 Cost)

This project can be hosted completely **FREE** forever on **Render** or **Vercel**. Choose either method below:

---

### Option 1: Render (Recommended for Node.js Express) — 100% Free

[Render](https://render.com) provides a free Web Service tier with continuous GitHub deployment.

1. Sign up for free at **[render.com](https://render.com)**.
2. Click **New +** → **Web Service**.
3. Connect your GitHub account and select **`raghavareddydcn/BrickBloom`**.
4. Configure settings:
   - **Name**: `brickbloom` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: **Free** ($0/month)
5. Click **Create Web Service**.
6. 🚀 Your live website URL will be ready in ~1 minute (e.g. `https://brickbloom.onrender.com`).

---

### Option 2: Vercel — 100% Free

[Vercel](https://vercel.com) provides instant global CDN hosting with zero configuration via the included `vercel.json`.

1. Sign up at **[vercel.com](https://vercel.com)** with your GitHub account.
2. Click **Add New...** → **Project**.
3. Import **`raghavareddydcn/BrickBloom`**.
4. Keep default settings and click **Deploy**.
5. 🚀 Live URL generated instantly (e.g. `https://brickbloom.vercel.app`).

---

### Option 3: Koyeb / Railway / Glitch — Free Alternatives

- **Koyeb**: Connect repository → Deploy Node.js app on free micro instance.
- **Glitch**: Import repository URL for instant sandbox preview.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author & Sourcing Desk

Developed & Maintained by **[Raghavareddy](https://github.com/raghavareddydcn)**  
Repository: [https://github.com/raghavareddydcn/BrickBloom](https://github.com/raghavareddydcn/BrickBloom)
