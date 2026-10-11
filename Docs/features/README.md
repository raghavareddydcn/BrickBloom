# BrickBloom Feature Inventory

This directory records user-visible workflows reverse-engineered from the current application. The specifications describe observed behavior; they are not promises that undocumented or dormant code is active. Feature-specific Copilot skills are in `.github/skills/`.

| Feature | Specification | Primary surface |
| --- | --- | --- |
| Storefront discovery, catalog, and cart | [spec.md](storefront-discovery/spec.md) | Home, shop, product detail, cart |
| B2B sourcing inquiries | [spec.md](sourcing-inquiries/spec.md) | Home and product detail inquiry forms |
| Admin access and account lifecycle | [spec.md](admin-access/spec.md) | Admin access gate and profile actions |
| Operations overview | [spec.md](operations-overview/spec.md) | Admin hub |
| Admin product showcase | [spec.md](admin-product-showcase/spec.md) | Product catalog workspace |
| Invoices and billing | [spec.md](invoices-billing/spec.md) | Invoice workspace |
| Inventory tracking | [spec.md](inventory-tracking/spec.md) | Inventory workspace |
| WhatsApp outreach | [spec.md](whatsapp-outreach/spec.md) | Admin workspace and standalone page |
| Admin user management | [spec.md](user-management/spec.md) | Users workspace |
| Audit trail | [spec.md](audit-trail/spec.md) | Audit log workspace and API |

## Cross-Cutting Boundaries And Known Gaps

- Three product data sources are visible and are not synchronized: static detail data, static catalog data, and Firestore inventory records.
- The React invoice workspace uses Firestore; a separate server JSON invoice API has no discovered frontend consumer.
- `/api/market-intelligence` has no discovered frontend consumer. `SubstrateVisualizer.tsx` is not mounted in the routed application.
- Admin authorization is client-side in the observed code. No Firestore security rules or backend authorization middleware were found.
- `public/whatsapp.html` and the React `/admin/whatsapp` workspace are separate surfaces with different role-check behavior.
- No automated test files or test script were found. `npm run build` is the documented project-level compile/build check.
- Several existing README and skill claims differ from current wiring. The feature specs call out observed behavior and do not silently adopt unverified claims.