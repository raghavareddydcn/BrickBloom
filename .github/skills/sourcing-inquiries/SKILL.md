---
name: sourcing-inquiries
description: "Use when changing or reverse-engineering BrickBloom's public B2B inquiry forms, lead API, email dispatch, or external form fallback."
---

# Sourcing Inquiries Skill

## Source Map

- Form UI and browser validation: `src/components/sections/ContactForm.tsx`, `src/pages/ProductDetail.tsx`.
- Lead API and mail configuration: `server.js` (`POST /api/leads`).
- Current behavior and known gaps: `Docs/features/sourcing-inquiries/spec.md`.

## Workflow

1. Trace the form submission and server response together; browser and server required-field validation differ.
2. Preserve visible pending/success/error feedback and test both the local API and external fallback paths.
3. Check fallback HTTP status handling before treating a resolved fetch as successful.
4. Keep SMTP secrets in server environment configuration; never add credentials to client code or log unnecessary personal data.
5. Do not describe the flow as a CRM or durable lead store; none was found.
6. Run `npm run build` after code changes and exercise the lead endpoint separately when server behavior changes.