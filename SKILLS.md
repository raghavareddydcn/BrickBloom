# BrickBloom Site — Project Architecture, Code Review & Skills Matrix

## 1. Executive Summary

**BrickBloom** (`brickbloom-site` / `cocopeat-site`) is a modern B2B e-commerce and market-intelligence web application for coconut-based growing media (cocopeat, growbags, growslabs, bricks, tabs, blocks, and loose media). The project serves commercial growers, hydroponic farms, and international importers by showcasing product specs, regional sourcing hubs, quality standards, and capturing high-intent business leads.

---

## Validation Skill (Post-Change Gate)

Use this skill after every UI, content, or backend change before pushing code.

1. **Static quality gate**
   - Run editor diagnostics and ensure no new errors in changed files.
   - Confirm synced source/public parity for mirrored files (`index.html`, `styles.css`, `app.js`, `site.js`).

2. **Behavior validation gate**
   - Verify changed UI blocks exist in both source and `public/` copies.
   - Check responsive behavior at desktop, tablet, and mobile breakpoints.

3. **Git integrity gate**
   - Ensure only intended files are changed.
   - Commit with a scoped message and push only after checks pass.

4. **Release note gate**
   - Summarize what changed, what was validated, and the commit hash.

---

## 2. Technical Stack Matrix

| Layer | Technology / Library | Version / Details | Purpose |
| :--- | :--- | :--- | :--- |
| **Backend Runtime** | Node.js | v18+ | Server execution environment |
| **Web Framework** | Express.js | `^4.22.2` | REST API routing, static asset serving |
| **Middleware** | CORS, Body Parser | `^2.8.6` | Cross-origin resource sharing, JSON/URL-encoded parsing |
| **Frontend Framework**| AngularJS | `v1.8.2` | Single Page Application controller & binding (`index.html`) |
| **Styling** | Vanilla CSS | CSS3 Variables | Design system, Apple-inspired responsive layout |
| **Typography** | Google Fonts | Inter | Modern font family |
| **Deployment Target** | Node Environment | Port 3000 / `process.env.PORT` | Standard cloud host (Vercel, Render, Heroku, AWS) |

---

## 3. Developer Skills & Competency Matrix

To effectively maintain, extend, and scale this project, developers require the following technical skills:

### Primary Technical Competencies

1. **Node.js & Express API Engineering**
   - Design RESTful endpoints (`/api/market-intelligence`, `/api/leads`).
   - Implement middleware for logging, rate limiting, and CORS validation.
   - Robust input validation and error handling.

2. **Legacy & Modern Frontend Architecture**
   - Proficiency in AngularJS 1.x scopes, controllers, `$http` services, and directives (`ng-repeat`, `ng-model`, `ng-submit`, `ng-if`).
   - Migration capability to modern frameworks (React, Next.js, or Vite/Vue) for long-term support.

3. **Modern CSS & UI/UX Systems**
   - Deep understanding of CSS Custom Properties (`:root`), Flexbox, CSS Grid layouts, and media queries (`max-width: 1080px`, `760px`).
   - Design systems inspired by Apple aesthetics: high contrast, smooth backdrop blurs (`backdrop-filter: blur`), custom shadows, and subtle micro-animations.

4. **Web Security & Sanitization**
   - Protection against Cross-Site Scripting (XSS) when rendering dynamic server responses (`res.send`).
   - Input validation, email address validation, rate limiting, and anti-spam (reCAPTCHA/Turnstile) integration for lead capture forms.

5. **DevOps & Git Version Control**
   - Multi-environment setup (`process.env`), production build readiness, and deployment pipelines.
   - Modular Git workflows and repository hygiene (`.gitignore`, branching models).

---

## 4. Architectural Analysis

### Backend (`server.js`)
- **Static File Server**: Serves files from `public/` directory (`app.use(express.static)`).
- **In-Memory Data**: `marketIntelligence` object holding formats, sourcing hubs, and quality notes.
- **REST Endpoints**:
  - `GET /api/market-intelligence`: Returns JSON data for products and sourcing specs.
  - `POST /api/leads`: Processes lead form submissions. Returns JSON or fallback HTML depending on `Accept` headers.
- **SPA Fallback**: `app.get('*')` serves `index.html` for single-page routing.

### Frontend Structure (`public/`)
- `index.html`: Main landing page driven by AngularJS (`ng-app="brickbloomSite"`).
- `app.js`: Angular controller fetching `/api/market-intelligence` and handling `submitLead()`.
- Product Detail Pages: `blocks.html`, `coco-bricks.html`, `coco-grow-cubes.html`, `coco-growslabs.html`, `coir-chips.html`, `growbags.html`, `loose.html`, `open-top-growbags.html`, `tabs.html`.
- `styles.css`: Centralized CSS stylesheet containing design system design tokens and responsive rules.

---

## 5. Detailed Code Review & Findings

### Strengths
- **Clean Visual Design**: Excellent aesthetic consistency with CSS custom variables, clear typography hierarchy (`Inter`), and modern spacing.
- **Lightweight Dependencies**: Fast boot time and small runtime footprint (Express + CORS).
- **Responsive Layout**: Fluid breakpoints catering to desktop, tablet, and mobile displays.

### Identified Issues & Security Risks

1. **Security / XSS Risk in Fallback Lead Handler (`server.js`)**
   - *Issue*: Lines 88–90 in `server.js` render raw un-sanitized user input (`${name}`) directly into HTML output:
     ```javascript
     return res.send(`<!doctype html>...<h1>Thank you, ${name}</h1>...`);
     ```
   - *Impact*: Potential Reflected Cross-Site Scripting (XSS) if a user passes crafted HTML/script strings in the `name` field via direct form submission.
   - *Fix*: Sanitize HTML content or utilize JSON-only API responses.

2. **Form Submission Inconsistency (SPA vs HTML Forms)**
   - *Issue*: `index.html` submits forms via AngularJS AJAX (`ng-submit="submitLead()"`), showing inline state. Detail pages like `blocks.html` use plain standard HTML forms (`action="/api/leads" method="post"`).
   - *Impact*: Submitting a lead on `blocks.html` causes full page navigation to raw HTML/JSON response instead of preserving SPA UX.
   - *Fix*: Standardize lead form handling across all detail pages using client-side JavaScript / AJAX.

3. **AngularJS 1.8.2 Deprecation & Maintenance**
   - *Issue*: AngularJS 1.x reached End-Of-Life (EOL) in December 2021.
   - *Impact*: Potential security vulnerabilities and lack of modern module bundling capabilities.
   - *Fix*: Plan migration to modern framework (Vite + Vanilla JS/React/Vue) or lightweight modern alternative.

4. **Missing `.gitignore` File**
   - *Issue*: `node_modules/` directory was generated locally without a `.gitignore` file.
   - *Impact*: Committing `node_modules` causes massive repository bloat.
   - *Fix*: Create `.gitignore` ignoring `node_modules`, logs, and environment files.

5. **Lack of Server Input Validation & Anti-Spam**
   - *Issue*: `server.js` only checks truthiness of strings (`if (!name || !email...)`). No email regex validation or length checks exist.
   - *Impact*: Vulnerable to spam submissions and dirty database entries.

---

## 6. Actionable Refactoring Roadmap

1. **Immediate Fixes**:
   - Add `.gitignore` to prevent tracking `node_modules`.
   - Sanitize HTML in `server.js` lead endpoint.
   - Standardize all detail page contact forms to AJAX submit.

2. **Short-Term Enhancements**:
   - Add express-validator or custom schema validation for lead submissions.
   - Implement rate limiting (`express-rate-limit`) on POST `/api/leads`.
   - Move market intelligence data to a JSON/DB storage layer.

3. **Long-Term Modernization**:
   - Upgrade front-end architecture from AngularJS 1.8 to modern Vite + React/Vue framework.
