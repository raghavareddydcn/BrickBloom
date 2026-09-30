# 🌿 BrickBloom — Modern Cocopeat Sourcing & Operations Platform

![React](https://img.shields.io/badge/React-18.3-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff.svg)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)
![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)
![Express](https://img.shields.io/badge/Express-5.2-000000.svg)
![License](https://img.shields.io/badge/License-MIT-brightgreen.svg)

**BrickBloom** is a modern B2B platform and operations suite engineered for commercial coconut-based growing media (cocopeat, coco bricks, growbags, growslabs, coir disks, and retail DIY kits).

Engineered for precision growers, hydroponic nurseries, and international importers, BrickBloom pairs a high-performance marketing and sourcing front-end with an integrated business operations backend for invoicing, inventory tracking, audit logging, and automated WhatsApp client dispatch.

---

## ✨ Features

### 🛍️ Client & Marketing Portal
- **Interactive Product Catalog**: Detailed crop programs, EC benchmarks, and physical specifications for 8+ commercial formats (Ready Pot, Starter Kit, Medium Kit, Premium Kit, Coco Grow Disks, Premium Cocopeat, Coco Bricks, GrowSlabs, and Coir Chips).
- **Substrate Visualizer & Spec Calculator**: Interactive tools explaining hydration ratios, water retention, and expansion yields.
- **B2B Inquiry System**: Lead capture form supporting direct contact dispatch and JSON API submission.
- **Responsive Nature-Tech Aesthetics**: Typography powered by *Plus Jakarta Sans* and *DM Serif Display*, smooth Framer Motion interactions, and custom Tailwind styling.

### 🏢 Operations & Admin Suite
- **GST Tax Invoice Generator**: Complete GST-compliant billing engine with automated HSN lookups, reverse CGST/SGST/IGST tax splits, discount management, balance due tracking, and PDF print exports.
- **Cloud & Server Invoice Persistence**: Save, load, and edit invoice drafts with repo-level JSON persistence and Firebase cloud backup.
- **Inventory Tracking Workspace**: Real-time stock management with threshold alerts, low-stock notifications, and live ledger updates.
- **WhatsApp Client Dispatch Engine**:
  - **Meta Cloud API**: Automated direct broadcast using official Meta WhatsApp Business Cloud APIs.
  - **Click-to-Chat Mode**: Zero-backend direct client dispatch from any mobile or desktop browser.
  - **Puppeteer Session Engine**: Local browser QR code authentication with session keep-alive.
- **Audit Logging**: Traceable, immutable event logs recording all invoice creation, stock adjustments, and system activity.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite 6](https://vitejs.dev/) |
| **Routing** | [React Router v6](https://reactrouter.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/), [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/) |
| **Styling & Motion** | [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Backend & APIs** | [Express 5](https://expressjs.com/), [Node.js](https://nodejs.org/) (ES Modules) |
| **Document Processing** | [SheetJS (xlsx)](https://sheetjs.com/), [html2canvas](https://html2canvas.hertzen.com/), [QRCode](https://github.com/soldair/node-qrcode) |
| **Storage & Sync** | Local JSON persistence, [Firebase Firestore](https://firebase.google.com/) |
| **CI/CD & Deployment** | [GitHub Actions](https://github.com/features/actions) → [GitHub Pages](https://pages.github.com/), [Vercel](https://vercel.com/) |

---

## 📁 Repository Structure

```text
BrickBloom/
├── .github/workflows/         # Automated GitHub Actions deployment workflows
│   └── deploy.yml             # Builds React SPA and publishes to GitHub Pages
├── Docs/                      # Offline catalogs, customer databases, reference PDFs
│   ├── Customers.xlsx         # Client address book
│   └── *.pdf                  # Product & pricing catalogs
├── invoices/                  # Server-side persistent JSON invoice records
├── public/                    # Static assets copied into dist/ on build
│   ├── images/                # Single source of truth for all brand & product media
│   ├── CNAME                  # Custom domain (brickbloom.co.in)
│   ├── .nojekyll              # Disables Jekyll processing on GitHub Pages
│   └── whatsapp.html          # Standalone WhatsApp dispatch utility
├── src/                       # React 18 application source code
│   ├── components/            # Reusable UI, layout, and section components
│   ├── data/                  # Product catalog specifications and benchmarks
│   ├── lib/                   # Firebase config, utility helpers, and formatters
│   ├── pages/                 # Route views (Home, ProductDetail, AdminHub, Workspaces)
│   ├── App.tsx                # Client-side router configuration
│   ├── index.css              # Global design tokens and Tailwind directives
│   └── main.tsx               # React application entry point
├── .gitignore                 # Git ignore rules for node_modules, logs, and dev files
├── index.html                 # Vite HTML shell & SEO metadata
├── package.json               # Dependencies and build scripts
├── package-lock.json          # Deterministic dependency lockfile
├── postcss.config.js          # PostCSS configuration for Tailwind
├── server.js                  # Express backend (API routes & static preview)
├── tailwind.config.js         # Tailwind CSS design system configuration
├── tsconfig.json              # TypeScript application compiler options
├── tsconfig.node.json         # TypeScript tooling configuration
├── vercel.json                # Vercel serverless routing configuration
└── vite.config.ts             # Vite bundler, path aliases, and build settings
```

---

## ⚡ Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/raghavareddydcn/BrickBloom.git
cd BrickBloom
npm install
```

### 2. Running Locally

#### Option A: Run the Backend & Static App on Port 3000 (Recommended)
Build the frontend and run the Express server:
```bash
npm run build
npm start
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

#### Option B: Vite Hot-Reload Development Server
For rapid React component development with instant hot module replacement:
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)**. API calls to `/api/*` are automatically proxied to port 3000.

---

## 📡 API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/market-intelligence` | `GET` | Returns product specifications, regional sourcing hubs, and quality notes. |
| `/api/leads` | `POST` | Ingests new B2B buyer inquiries and sends email notification. |
| `/api/invoices` | `GET` | Retrieves all saved JSON invoices from the server repository. |
| `/api/invoices` | `POST` | Persists an invoice draft as a formatted JSON document. |
| `/api/invoices/:id` | `DELETE` | Deletes a stored invoice record. |
| `/api/audit-log` | `GET` / `POST` | Appends and retrieves tamper-evident operations audit log entries. |
| `/api/wa/*` | Various | WhatsApp Puppeteer session initialization, QR status, and bulk dispatch. |

---

## 🚀 Deployment

### GitHub Pages (Continuous Deployment)
Every push to the `main` branch triggers [.github/workflows/deploy.yml](.github/workflows/deploy.yml):
1. Checks out the code and sets up Node 20.
2. Installs clean dependencies via `npm ci --ignore-scripts`.
3. Runs `npm run build` (`tsc -b && vite build`) to generate the optimized static bundle in `dist/`.
4. Deploys `dist/` directly to GitHub Pages at **[https://brickbloom.co.in](https://brickbloom.co.in)**.

### Vercel / Render Deployment
- **Vercel**: Import the repository on [vercel.com](https://vercel.com). The included [vercel.json](vercel.json) configures serverless routing to `server.js`.
- **Render**: Connect the repo as a **Web Service** with build command `npm install && npm run build` and start command `npm start`.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for details.

---

## 👨‍💻 Maintainer & Sourcing Desk

Developed & Maintained by **[Raghavareddy](https://github.com/raghavareddydcn)**  
Website: [https://brickbloom.co.in](https://brickbloom.co.in)  
Repository: [https://github.com/raghavareddydcn/BrickBloom](https://github.com/raghavareddydcn/BrickBloom)
