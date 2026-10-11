---
name: audit-trail
description: "Use when changing BrickBloom audit event creation, Firestore audit views, server audit-log endpoints, or operational event coverage."
---

# Audit Trail Skill

## Source Map

- Audit UI: `src/pages/AuditLogWorkspace.tsx`.
- Invoice event writers: `src/pages/InvoiceWorkspace.tsx`.
- Server append/read API: `server.js` (`/api/audit-log`).
- Other operations for coverage comparison: `src/pages/InventoryWorkspace.tsx`, `src/pages/UsersWorkspace.tsx`.
- Current scope and gaps: `Docs/features/audit-trail/spec.md`.

## Workflow

1. Trace event creation, persistence, and display as separate steps; Firestore and the server text log are distinct stores.
2. Keep event fields consistent across destinations and define how partial write failures are reported.
3. Do not claim immutability, tamper evidence, or complete sensitive-action coverage unless independently enforced and verified.
4. Treat client-provided actor/action/details as untrusted; do not expose unauthenticated write endpoints as a trustworthy audit boundary.
5. Test a known invoice event in both destinations and verify what the UI actually reads.
6. Run `npm run build` after code changes and exercise server behavior separately when API code changes.