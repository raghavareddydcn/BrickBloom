# Feature Specification: Storefront Discovery, Catalog, And Cart

**Status**: Reverse-engineered from current implementation

**Scope**: Public visitors browse BrickBloom products, inspect product details, and prepare an order inquiry through the cart. This does not create a paid order or a persisted customer order record.

## User Scenarios & Testing

### User Story 1 - Browse and compare products (Priority: P1)

Visitors discover products from the home page and shop catalog and inspect specifications before contacting BrickBloom.

**Independent Test**: Browse the home page, use catalog search/filter/sort, then open a quick view and product detail.

**Acceptance Scenarios**:
1. Given the public shop, when a visitor searches or selects a category, then the catalog displays matching products.
2. Given a listed product, when a visitor opens quick view or its detail page, then the interface displays the product information available in the corresponding data source.

### User Story 2 - Prepare an order intent (Priority: P1)

Visitors add products to a cart, adjust quantities, and start an order conversation.

**Independent Test**: Add a catalog item, reload the page, edit or remove cart lines, and use the WhatsApp order action.

**Acceptance Scenarios**:
1. Given a product, when the visitor adds it to cart, then the cart reflects the line and persists its state in the browser.
2. Given cart lines, when the visitor changes quantity, removes a line, applies a supported coupon, or clears the cart, then the displayed cart state updates.
3. Given a non-empty cart, when the visitor chooses WhatsApp ordering, then the app prepares a message and opens the messaging handoff; no payment or order record is created by this action.

## Requirements

### Functional Requirements

- **REQ-001**: The public site MUST provide product discovery through home and shop surfaces.
- **REQ-002**: Visitors MUST be able to search, filter, sort, and inspect catalog entries using the controls present in the shop.
- **REQ-003**: Visitors MUST be able to add, update, and remove cart lines and clear the cart.
- **REQ-004**: Cart state MUST persist across reloads in the same browser using the existing client-side storage behavior.
- **REQ-005**: The cart MUST provide its currently implemented coupon, shipping-estimate, and WhatsApp handoff actions.

### Key Entities

- **Catalog product**: Public item description, displayed price, category, and specifications from static product datasets.
- **Cart line**: Selected product and quantity held in browser state.

## Edge Cases

- The catalog dataset and product-detail dataset differ in coverage and may differ in displayed names or prices.
- Quick-view tier pricing is not recalculated when cart quantity changes.
- Product detail stock text is not connected to the operational inventory source.
- Unknown catalog-to-detail pricing may use the current fallback value; do not present it as authoritative pricing.
- Cart-to-invoice handoff uses display names and base prices and requires admin access.

## Success Criteria

- **SC-001**: A visitor can locate a product using each available catalog control and inspect it without entering the admin area.
- **SC-002**: Cart add, quantity, removal, clear, and reload behavior produce a consistent visible cart state.
- **SC-003**: The visitor can initiate the available messaging handoff from a non-empty cart without the interface implying that payment or order persistence occurred.

## Evidence And Assumptions

- Evidence: `src/App.tsx`, `src/pages/Home.tsx`, `src/pages/Shop.tsx`, `src/pages/ProductDetail.tsx`, `src/components/shop/ProductCatalogView.tsx`, `src/components/shop/QuickViewModal.tsx`, `src/components/cart/CartDrawer.tsx`, `src/context/CartContext.tsx`, `src/data/products.ts`, `src/data/catalogProducts.ts`.
- Assumption: Only currently routed and mounted public flows are in scope; dormant components are not treated as active features.