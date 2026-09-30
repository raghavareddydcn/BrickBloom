---
name: brickbloom-engineering-and-validation
description: Comprehensive development standards, architectural map, validation gates, and operational procedures for BrickBloom.
---

# BrickBloom Engineering & Validation Skill

This guide defines the architectural standards, code quality gates, validation checklists, and release procedures for the **BrickBloom** platform.

---

## 1. Quality & Pre-Commit Validation Gate

Run these checks whenever modifying code or adding features before pushing code:

```bash
# 1. Typecheck & production bundle build
npm run build

# 2. Start the local server
npm start

# 3. Verify health on port 3000
curl -I http://localhost:3000
curl -s http://localhost:3000/api/market-intelligence
```

### Mandatory Visual & Screenshot Testing Gate:
- **Always Test Changes Live**: Run the application and open the affected views.
- **Capture Screenshots**: Take browser screenshots of the modified pages across both desktop and mobile viewports.
- **Analyze for Regressions**: Thoroughly analyze the captured screenshots for visual defects:
  - Layout misalignments or broken flex/grid wrapping
  - Typography clipping, awkward line breaks, or contrast issues
  - Broken image links or missing media assets
  - Spacing, padding, or overflow inconsistencies
- **Fix Before Staging**: If any defect or regression is spotted in the screenshot analysis, resolve it immediately before staging files.

### Validation Checklist:
1. **Type Safety (`tsc -b`)**: Zero TypeScript compile errors in `src/`. No implicit `any` in core models.
2. **Visual & Screenshot Verification**: Captured and analyzed screenshots; verified zero UI bugs or regressions.
3. **Selective File Staging (`git add <file>`)**: **NEVER use `git add .` or `git add -A`.** Explicitly stage only intended, required files to prevent accidental commits of debug logs or temporary files.
4. **Branching & PR Rule**: **NEVER push or merge directly to `main`.** Always create a descriptive branch (`feature/...`, `fix/...`, `docs/...`) and open a Pull Request (PR) for review and validation.
5. **Asset Path Hygiene**: All static images, logos, and media **must** reside in `public/images/`. Never create an outer root `images/` directory.
6. **No Scratch/Dump Scripts**: Never commit or leave temporary `chk*.js`, `fix*.js`, `temp*.js`, or `test_*.js` files in the repository.
7. **Clean Git Working Tree**: Confirm `git status` shows no untracked artifacts or unwanted debug logs.
8. **Route Shells in `dist/`**: Ensure `vite.config.ts` plugin generates SPA fallback entry points in `dist/` for GitHub Pages direct routing.

---

## 2. Git Workflow & Branching Protocol

To protect repository stability and production deployments, strictly follow this protocol:

### Step 1: Create a Feature/Bugfix Branch
- Direct commits and direct pushes to `main` are strictly prohibited.
- Branch off the latest `main`:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b feature/your-feature-name
  # or: fix/your-bugfix-name, docs/your-doc-update
  ```

### Step 2: Implement, Test & Analyze Screenshots
- Apply the code changes.
- Build and verify: `npm run build`.
- Load the live preview on `http://localhost:3000`.
- Capture browser screenshots of modified pages, inspect them critically, and fix any layout/styling defects discovered.

### Step 3: Add Required Files Only — Never Use Blanket `git add .` or `git add -A`
- **Never** execute `git add .` or `git add -A`.
- Explicitly stage **only** the specific files you modified or created:
  ```bash
  # Correct:
  git add src/pages/Home.tsx src/components/layout/Navbar.tsx
  
  # Incorrect / Forbidden:
  git add .
  git add -A
  ```
- Inspect staged changes before committing:
  ```bash
  git status
  git diff --staged
  ```

### Step 4: Commit & Open a Pull Request (PR)
- Commit with a clear, conventional message:
  ```bash
  git commit -m "feat(section): improve product grid layout and responsiveness"
  ```
- Push your branch to `origin`:
  ```bash
  git push -u origin feature/your-feature-name
  ```
- Open a Pull Request (PR) against `main`. Do not merge until automated CI checks succeed.

---

## 3. Architecture & File Layout

| Directory / File | Role & Constraints |
| :--- | :--- |
| **`src/`** | React 18 + TypeScript SPA source. Contains components, routing (`App.tsx`), and workspaces. |
| **`src/pages/`** | Top-level routed views (`Home.tsx`, `ProductDetail.tsx`, `AdminHub.tsx`, `InvoiceWorkspace.tsx`, `InventoryWorkspace.tsx`, `WhatsAppWorkspace.tsx`, `AuditLogWorkspace.tsx`, `UsersWorkspace.tsx`). |
| **`src/components/`** | Reusable UI widgets (`ui/`), layout shells (`layout/`), marketing sections (`sections/`), and auth gates (`auth/`). |
| **`public/images/`** | **Single source of truth** for all visual assets (brand logos, catalog photos, packaging). Copied to `dist/images/` during build. |
| **`public/CNAME`** | Custom domain configuration (`brickbloom.co.in`) for GitHub Pages. |
| **`public/.nojekyll`** | Disables Jekyll parsing on GitHub Pages to serve assets starting with underscores or dots. |
| **`server.js`** | Express 5 backend server. Serves local production build on port 3000 and handles REST API endpoints. |
| **`invoices/`** | Server-side directory storing persistent JSON invoice documents. |
| **`Docs/`** | Static business documentation, reference PDFs, and customer address books (`Customers.xlsx`). |
| **`.github/workflows/deploy.yml`** | GitHub Actions CI/CD pipeline deploying `dist/` to GitHub Pages upon push to `main`. |

---

## 4. Workspaces & Business Rules

### A. Invoice Workspace (`src/pages/InvoiceWorkspace.tsx`)
- **Numbering Pattern**: `BB/YY-YY/NNN` (April 1 financial year turnover).
- **Price Tiers**: Auto-lookup rates based on quantity thresholds (1, 50, 100 units).
- **GST Calculations**: Line-item CGST/SGST (intra-state) or IGST (inter-state) with 0%, 5%, 12%, and 18% support.
- **Stock Deltas**: Net invoice item edits automatically adjust inventory counts (`newQty - oldQty`).
- **Export Standards**: Pixel-perfect A4 printable CSS layout and high-DPI canvas capture with company seal.

### B. Inventory Workspace (`src/pages/InventoryWorkspace.tsx`)
- Tracks stock levels for all commercial coir products and kits.
- Real-time stock status flags (In Stock, Low Stock, Out of Stock).
- Synchronizes with Firestore cloud persistence and invoice deduction ledger.

### C. WhatsApp Bulk Dispatch (`src/pages/WhatsAppWorkspace.tsx`)
- **Meta Cloud API Mode**: Serverless, official WhatsApp Business API integration.
- **Click-to-Chat Mode**: Zero-backend dispatch through direct `wa.me` deep links.
- **Session Automator**: Node.js Puppeteer session keep-alive via `server.js`.

### D. Audit Logging (`src/pages/AuditLogWorkspace.tsx` & `/api/audit-log`)
- Append-only event tracking for sensitive actions: invoice generation, price edits, inventory adjustments, and user access.
- Recorded both to local server log (`logs/audit.log`) and Firestore `audit_logs` collection.

---

## 5. Deployment Protocol

- **GitHub Pages**: Automated on push to `main`. Never manually commit `dist/` to the `main` branch.
- **Backend / APIs**: When self-hosting or deploying to cloud VPS / Render / Vercel:
  ```bash
  npm install
  npm run build
  npm start
  ```
  Backend starts by default on port `3000` (or `process.env.PORT`).
