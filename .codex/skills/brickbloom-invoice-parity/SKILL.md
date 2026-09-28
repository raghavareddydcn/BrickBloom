---
name: brickbloom-invoice-parity
description: Rebuild or maintain BrickBloom invoices in React while preserving the legacy invoice workflow, validation, stock, audit, printing, and Firebase behavior.
---

# BrickBloom invoice parity

Use this skill when changing the React invoice workspace. The target is a React-only experience with the same business behavior as the legacy `public/invoice.html`; do not route users back to a legacy page.

Before changing invoice behavior, read [the legacy contract](references/legacy-contract.md). Treat its rules and stored data shape as compatibility requirements. Preserve existing Firestore invoice records and the local-storage migration path.

## Implementation requirements

- Keep Firestore `invoices`, `products`, `counters`, `audit_logs`, and `admin_users` compatible with the legacy pages.
- Make invoice writes and stock deltas safe: calculate changes against the pre-edit invoice, exclude non-inventory charges, and restore stock when deleting.
- Enforce the documented required fields and role permissions in the React UI, not only visually.
- Retain edit, duplicate, draft reset, auto-numbering, tier pricing, custom products, GST totals, print, and image-export actions.
- Log material invoice and stock actions using the documented audit payload. Failures to write an audit record must not silently corrupt invoice or inventory data.
- Validate by building the React app and manually exercising a new invoice, an edit, a duplicate, and a delete against a disposable record.

When a legacy behavior is unclear, inspect the corresponding function in `public/invoice.html` and update the contract reference before implementing the React equivalent.
