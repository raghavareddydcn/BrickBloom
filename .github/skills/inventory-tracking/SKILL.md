---
name: inventory-tracking
description: "Use when changing BrickBloom stock display, threshold status, manual quantity edits, Firestore product listeners, or invoice-driven stock adjustments."
---

# Inventory Tracking Skill

## Source Map

- Inventory workspace: `src/pages/InventoryWorkspace.tsx`.
- Invoice-driven stock changes: `src/pages/InvoiceWorkspace.tsx`.
- Firebase setup: `src/lib/firebase.ts`.
- Current behavior and known gaps: `Docs/features/inventory-tracking/spec.md`.

## Workflow

1. Trace manual edits and invoice stock deltas separately; both affect Firestore products.
2. Preserve the current viewer UI restriction but do not treat it as server authorization.
3. Check missing/zero thresholds, negative and invalid input, write failures, and packing-item filtering.
4. Confirm the behavior after reload or listener update; do not assume public product stock labels use this collection.
5. Avoid changing invoice stock semantics without reviewing the invoice skill and prior-invoice delta behavior.
6. Run `npm run build` after code changes.