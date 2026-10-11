# Feature Specification: Inventory Tracking

**Status**: Reverse-engineered from current implementation

**Scope**: Staff view current product stock, identify items at or below a threshold, and edit stock counts. Invoice operations also change product stock.

## User Scenarios & Testing

### User Story 1 - Review stock status (Priority: P1)

Staff search the inventory list and identify products marked low or out of stock.

**Independent Test**: Open inventory, search for a product, and verify its displayed quantity/status against the current Firestore record.

### User Story 2 - Adjust a stock count (Priority: P1)

An editor/admin changes a count and saves the updated product record.

**Independent Test**: Change a valid stock value as an editable role, then reload and check the saved value; repeat as viewer to verify editing is blocked in the interface.

**Acceptance Scenarios**:
1. Given a product with stock and threshold values, when the user opens inventory, then its current quantity and threshold status are shown.
2. Given an editable user, when a valid quantity is saved, then the Firestore product record updates and the live list reflects the change.
3. Given a viewer role, when they inspect a product, then stock editing is unavailable or blocked by the current UI.

## Requirements

### Functional Requirements

- **REQ-001**: The workspace MUST display product stock records from its current live data source.
- **REQ-002**: The interface MUST flag stock at or below the configured threshold using its current status rules.
- **REQ-003**: Non-viewer roles MUST be able to edit and save valid stock counts through the workspace.
- **REQ-004**: Invoice create/edit/delete operations MUST remain a source of stock adjustments under their existing delta rules.

### Key Entities

- **Inventory product**: Product record with quantity and low-stock threshold.
- **Stock adjustment**: User-entered or invoice-derived change to a product quantity.

## Edge Cases

- Missing stock or threshold values default to zero, which can cause low-stock flags.
- Invalid or negative input is silently ignored in the observed interface.
- Write errors are logged but no user-facing failure feedback is apparent.
- Packing-related records are excluded from the workspace filter.
- Role enforcement is client-side in the visible app; no backend authorization rule was found.

## Success Criteria

- **SC-001**: A user can identify a product's displayed stock and threshold status from the workspace.
- **SC-002**: A valid stock change by an editable role persists and is reflected by the live list.
- **SC-003**: Viewer actions cannot change stock through the visible workspace controls.

## Evidence And Assumptions

- Evidence: `src/pages/InventoryWorkspace.tsx`, `src/pages/InvoiceWorkspace.tsx`, `src/lib/firebase.ts`.
- Assumption: Firestore product values are authoritative only for this operational workspace, not for public product detail stock labels.