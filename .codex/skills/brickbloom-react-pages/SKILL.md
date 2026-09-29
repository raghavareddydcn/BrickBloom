---
name: brickbloom-react-pages
description: Maintain BrickBloom's React/Vite site and GitHub Pages deployment, including routed admin pages and visual consistency. Use for BrickBloom frontend or Pages work; do not reintroduce standalone legacy HTML pages.
---

# BrickBloom React Pages

BrickBloom is a React 18 + Vite application. Treat `src/` as the sole frontend source of truth:

- Put views in `src/pages/`, reusable UI in `src/components/`, shared styling in `src/index.css`, and routes in `src/App.tsx`.
- Use React Router paths such as `/admin/invoices`; do not add standalone `.html` page implementations or AngularJS code.
- Keep public files limited to static assets and GitHub Pages metadata (`CNAME` and `.nojekyll`).

## GitHub Pages

The Pages workflow publishes `dist`. The `githubPagesRoutesPlugin` in `vite.config.ts` creates HTML application shells in `dist` for direct admin URLs and `404.html`. Update that route list whenever a new direct admin route is added.

Use `BrowserRouter` so direct URLs work in both local development and the Pages artifact. Keep asset paths root-relative because the production site uses the `brickbloom.co.in` custom domain.

## Validation

Before committing frontend or deployment changes, run `npm run build`. Confirm the relevant route shell exists in `dist` and that obsolete standalone pages are not present in the build artifact.
