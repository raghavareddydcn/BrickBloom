---
name: brickbloom-invoice-parity
description: Rebuild or maintain BrickBloom invoices in React while preserving the legacy invoice workflow, validation, stock, audit, printing, and Firebase behavior.
---

# BrickBloom Invoice Parity

Use this skill when changing the React invoice workspace ([src/pages/InvoiceWorkspace.tsx](file:///e:/code_base/BrickBloom_Git/BrickBloom/src/pages/InvoiceWorkspace.tsx)). The target is a modern React-only experience with full fidelity to the established business rules; do not route users back to legacy standalone HTML pages.

Before modifying invoice behavior, review [the legacy contract](references/legacy-contract.md). Treat its business rules and data shapes as strict compatibility requirements. Always preserve existing Firestore invoice records and backward compatibility.

## Implementation Requirements

- **Data Models**: Keep Firestore collections (`invoices`, `products`, `counters`, `audit_logs`, `admin_users`) aligned with the schema contract.
- **Stock Delta Calculation**: Make invoice writes and stock adjustments safe: calculate net changes against the pre-edit invoice (`newQty - oldQty`), exclude non-inventory charges (packing/transport), and restore stock automatically upon deletion.
- **Form Actions**: Retain edit, duplicate, draft reset, sequential financial-year numbering (`BB/YY-YY/NNN`), tier pricing (1/50/100 units), custom product insertion, and real-time CGST/SGST/IGST breakdown.
- **Audit Logging**: Log material invoice and stock actions using the documented audit payload to both Firestore `audit_logs` and `POST /api/audit-log`. Failures to log must not corrupt invoice or inventory data.
- **Document Output**:
  - Maintain the official Konaseema Coco Products LLP legal header, GSTIN `29ABGFK2654K1ZX`, official brand logo, and signatory seal.
  - Support high-resolution PNG export via `html2canvas` and exact A4 portrait browser PDF printing.
- **Validation**: Validate changes with `npm run build` (`tsc -b && vite build`) and verify invoice creation, edit, calculation, and export workflows.
