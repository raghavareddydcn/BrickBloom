---
name: invoices-billing
description: "Use when changing BrickBloom invoice creation, edits, numbering, tax/pricing, stock deltas, audit writes, printing, PNG export, or Firestore persistence."
---

# Invoices And Billing Skill

## Source Map

- Active React workspace: `src/pages/InvoiceWorkspace.tsx`.
- Cart and product handoff: `src/components/cart/CartDrawer.tsx`, `src/components/shop/QuickViewModal.tsx`.
- Current behavior and known gaps: `Docs/features/invoices-billing/spec.md`.
- Existing legacy compatibility contract: `.codex/skills/brickbloom-invoice-parity/SKILL.md` and its `references/legacy-contract.md`.

## Workflow

1. Read the current React implementation and the legacy compatibility contract before changing invoice behavior. If they disagree, surface the conflict instead of silently assuming either is current.
2. Preserve Firestore records and examine numbering, tier pricing, tax, discount, and balance calculations together.
3. For edits, calculate stock changes against the prior invoice; exclude packing/transport charges and restore stock on deletion as currently intended.
4. Exercise invoice save/edit/delete, custom and catalog lines, cart handoff, audit writes, A4 print, and PNG export when their code is affected.
5. Do not route users to legacy HTML or treat the server JSON invoice API as the active React persistence path; no frontend consumer was found.
6. Run `npm run build`. There is no discovered automated invoice test suite, so report manual validation honestly.