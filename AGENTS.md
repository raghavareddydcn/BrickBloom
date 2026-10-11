# BrickBloom Agent Guidance

## Project Scope

BrickBloom is a React 18 and TypeScript storefront with an Express server and an admin operations area. Follow the existing architecture and keep changes scoped to the requested workflow.

## Source Of Truth

- Routes are defined in `src/App.tsx`; page workflows live in `src/pages/` and shared behavior in `src/components/`, `src/context/`, and `src/lib/`.
- Product information has separate sources: static detail data in `src/data/products.ts`, storefront/admin catalog data in `src/data/catalogProducts.ts`, and operational stock records in Firestore `products`. Do not assume they synchronize.
- Invoice UI persistence and stock deltas use Firestore. `server.js` also has a JSON invoice API, but no frontend consumer was found.
- Admin route gates and role checks are client-side in the visible application. Do not describe them as server-enforced authorization; no Firestore rules were found in the workspace.
- API routes and the standalone WhatsApp page are implemented in `server.js` and `public/whatsapp.html`. Verify whether a route is mounted or consumed before changing or documenting it as active.

## Implementation And Validation

- Preserve the established React, TypeScript, Vite, Tailwind, and Express conventions; reuse nearby components and helpers.
- Keep secrets out of client code and avoid introducing new credentials. Existing client-side credentials or authorization weaknesses should be treated as risks, not as patterns to copy.
- For code changes, run `npm run build` from this directory. The project has no discovered automated test suite; do not claim test coverage that does not exist.
- For UI changes, follow the validation and screenshot guidance in `SKILL.md`.
- Preserve existing user changes and data. Do not add generated build output, logs, or unrelated files.

## Feature Documentation

- Reverse-engineered feature specifications live under `Docs/features/` and describe observed behavior, not proposed behavior.
- Feature-specific Copilot workflows live under `.github/skills/<feature>/SKILL.md`.
- When documentation and implementation disagree, record the discrepancy and verify behavior in code before treating documentation as current.