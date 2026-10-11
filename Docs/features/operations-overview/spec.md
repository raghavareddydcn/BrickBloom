# Feature Specification: Operations Overview

**Status**: Reverse-engineered from current implementation

**Scope**: The protected admin hub summarizes operational counts and links users to individual workspaces. It is informational and does not mutate business records.

## User Scenarios & Testing

### User Story 1 - Review operational status (Priority: P1)

An authenticated admin-suite user opens the dashboard to review invoice/revenue, inventory, user, catalog, and WhatsApp status summaries.

**Independent Test**: Sign in, open the admin hub, compare visible summary groups with their underlying current collections, and follow workspace navigation.

**Acceptance Scenarios**:
1. Given access to the admin suite, when the user opens the hub, then the dashboard displays its available counts and summary values.
2. Given a dashboard navigation action, when the user selects a workspace, then the corresponding admin route opens.

## Requirements

### Functional Requirements

- **REQ-001**: The admin hub MUST be protected by the existing admin route gate.
- **REQ-002**: The dashboard MUST display the invoice/revenue, inventory, user, catalog, and WhatsApp status summaries currently wired to it.
- **REQ-003**: The dashboard MUST provide navigation to the available admin workspaces.

### Key Entities

- **Dashboard summary**: Aggregated display values read from invoice, product, and admin-user records.
- **WhatsApp status**: Status payload retrieved from the server endpoint.

## Edge Cases

- WhatsApp status is fetched once on mount rather than streamed on the dashboard.
- Firestore loading and listener error states are not apparent in the dashboard implementation.
- Role-specific summary visibility is not apparent; route protection is the observed gate.

## Success Criteria

- **SC-001**: An authenticated user can view each dashboard summary exposed by the current implementation.
- **SC-002**: Each visible workspace navigation entry opens its corresponding route.
- **SC-003**: The hub does not present itself as a live status stream where its values are fetched only on mount.

## Evidence And Assumptions

- Evidence: `src/pages/AdminHub.tsx`, `src/components/layout/AdminLayout.tsx`, `src/App.tsx`.
- Assumption: Dashboard values are informational snapshots; no additional dashboard action is implied.