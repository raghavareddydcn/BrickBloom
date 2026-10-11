# Feature Specification: Admin Product Showcase

**Status**: Reverse-engineered from current implementation

**Scope**: Authenticated staff use the shared catalog in an admin-facing mode to inspect products and prepare invoice line items. This workspace does not edit catalog records or synchronize stock.

## User Scenarios & Testing

### User Story 1 - Find and prepare a product (Priority: P1)

Staff browse and filter the product showcase, inspect an item, and add it to the order sheet or invoice handoff.

**Independent Test**: Open the workspace, search/filter the list, open a quick view, and add a product to the invoice flow.

**Acceptance Scenarios**:
1. Given the product showcase, when staff search, filter, or sort, then matching static catalog entries are displayed.
2. Given a catalog item, when staff add it to the order sheet or invoice handoff, then its displayed product details are passed to the next action.

## Requirements

### Functional Requirements

- **REQ-001**: The workspace MUST be available through the existing protected admin route.
- **REQ-002**: Staff MUST be able to browse, search, filter, sort, and inspect the shared catalog using its current controls.
- **REQ-003**: Staff MUST be able to prepare selected catalog items for the existing invoice workflow.

### Key Entities

- **Catalog product**: Static item record from `CATALOG_PRODUCTS`.
- **Order sheet line**: Product selection and quantity staged for handoff.

## Edge Cases

- Catalog data is static and is not read from Firestore inventory.
- The workspace does not provide product editing or stock synchronization despite its admin context.
- The admin route gate applies, but no separate role-based authorization for this workspace was found.

## Success Criteria

- **SC-001**: Staff can locate and inspect a product using the showcase controls.
- **SC-002**: A staged product can be handed off to the existing invoice flow.
- **SC-003**: The workspace does not imply that editing the static catalog changed operational stock.

## Evidence And Assumptions

- Evidence: `src/pages/ProductCatalogWorkspace.tsx`, `src/components/shop/ProductCatalogView.tsx`, `src/components/shop/QuickViewModal.tsx`, `src/data/catalogProducts.ts`, `src/App.tsx`.
- Assumption: “Showcase” is an order-preparation surface, not a product administration database.