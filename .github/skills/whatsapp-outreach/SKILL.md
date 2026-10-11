---
name: whatsapp-outreach
description: "Use when changing BrickBloom contact import, message templates, WhatsApp Cloud/click-to-chat/server modes, session lifecycle, or dispatch progress."
---

# WhatsApp Outreach Skill

## Source Map

- React workspace: `src/pages/WhatsAppWorkspace.tsx`.
- Express endpoints and session handling: `server.js` (`/api/wa/*`).
- Standalone page and alternate route behavior: `public/whatsapp.html`, `src/App.tsx`.
- Current behavior and risk boundaries: `Docs/features/whatsapp-outreach/spec.md`.

## Workflow

1. Identify which mode owns the behavior; Cloud, click-to-chat, server session, and standalone page are separate paths.
2. Test recipient parsing, number normalization, template substitution, progress, and per-recipient failures with non-production contacts.
3. Do not equate opening a click-to-chat URL with message delivery. Handle Cloud media as a hosted-media contract, not a local attachment upload.
4. Keep access tokens and credentials out of source and browser storage; avoid exposing contact data in logs.
5. Treat current server endpoints as unauthenticated unless authorization is added and verified; do not rely on the React admin gate to protect them.
6. Run `npm run build` after frontend changes and exercise server API changes separately.