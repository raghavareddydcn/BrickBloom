---
name: storefront-discovery
description: "Use when changing or reverse-engineering BrickBloom's public home, shop catalog, product details, quick view, cart, coupon, or WhatsApp order-intent flow."
---

# Storefront Discovery Skill

## Source Map

- Routes and product detail routing: `src/App.tsx`, `src/pages/Home.tsx`, `src/pages/Shop.tsx`, `src/pages/ProductDetail.tsx`.
- Catalog and quick view: `src/components/shop/ProductCatalogView.tsx`, `src/components/shop/QuickViewModal.tsx`.
- Cart state and presentation: `src/context/CartContext.tsx`, `src/components/cart/CartDrawer.tsx`.
- Static data: `src/data/products.ts`, `src/data/catalogProducts.ts`.

## Workflow

1. Trace the route and the component that owns the behavior before editing.
2. Check both static product datasets; they are distinct and not visibly synchronized.
3. Preserve existing browser cart persistence and public/admin route boundaries.
4. Do not claim cart checkout, payment, persisted orders, or live stock validation: the current cart prepares an order-intent handoff only.
5. Verify pricing across quick view, cart quantity changes, and invoice handoff; known mismatches are documented in `Docs/features/storefront-discovery/spec.md`.
6. Run `npm run build` after code changes.