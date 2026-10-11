---
name: admin-product-showcase
description: "Use when changing or reverse-engineering BrickBloom's admin-facing catalog, product search/filter/sort, quick view, order sheet, or invoice handoff."
---

# Admin Product Showcase Skill

## Source Map

- Workspace and shared catalog UI: `src/pages/ProductCatalogWorkspace.tsx`, `src/components/shop/ProductCatalogView.tsx`, `src/components/shop/QuickViewModal.tsx`.
- Static catalog: `src/data/catalogProducts.ts`.
- Current scope: `Docs/features/admin-product-showcase/spec.md`.

## Workflow

1. Trace whether a change belongs to showcase state, shared catalog UI, or invoice handoff.
2. Treat `CATALOG_PRODUCTS` as static presentation data; this workspace does not edit Firestore products or inventory.
3. Preserve public catalog behavior when modifying shared components; test both public and admin use.
4. Do not label this workspace as a product editor or stock-management screen unless those capabilities are implemented.
5. Run `npm run build` after code changes.