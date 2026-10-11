# Feature Specification: Audit Trail

**Status**: Reverse-engineered from current implementation

**Scope**: Staff review event records shown by the audit workspace. Invoice actions write events to Firestore and also attempt a local server log append; the two stores are not presented as one unified immutable ledger.

## User Scenarios & Testing

### User Story 1 - Review recorded events (Priority: P1)

An authenticated staff member searches and reviews events by time, action, actor, record, and summary.

**Independent Test**: Open the audit workspace after a known invoice action, filter/search, and verify the displayed Firestore event.

### User Story 2 - Record an invoice action (Priority: P1)

When invoice save or deletion occurs, the application attempts to record associated audit information.

**Independent Test**: Create or delete a test invoice and inspect Firestore `audit_logs` and the server audit log separately.

## Requirements

### Functional Requirements

- **REQ-001**: The audit workspace MUST display available Firestore audit events with the current search and filter controls.
- **REQ-002**: Invoice save/delete actions MUST emit the audit writes currently implemented to Firestore and the server API.
- **REQ-003**: The server audit API MUST append accepted event details to its local audit log and provide its current read behavior.

### Key Entities

- **Audit event**: Action, actor, timestamp, record reference, and summary/details.
- **Audit record store**: Firestore collection or server-local append log used by the corresponding writer.

## Edge Cases

- The UI reads Firestore `audit_logs`; it does not display the server text log.
- Inventory edits and user role/status/password actions do not visibly emit audit events.
- The server API accepts client-provided actor/action/details; no authentication middleware was found.
- “Immutable” or “tamper-evident” behavior is not established by the visible implementation or discovered security rules.
- Failed writes to one destination may leave the destinations inconsistent.

## Success Criteria

- **SC-001**: A user can locate a recorded event by the currently available search/filter fields.
- **SC-002**: An invoice event appears in the Firestore-backed audit view when its Firestore write succeeds.
- **SC-003**: Documentation and UI do not claim coverage of all sensitive actions or immutability beyond observed behavior.

## Evidence And Assumptions

- Evidence: `src/pages/AuditLogWorkspace.tsx`, `src/pages/InvoiceWorkspace.tsx`, `src/pages/InventoryWorkspace.tsx`, `src/pages/UsersWorkspace.tsx`, `server.js` (`/api/audit-log`).
- Assumption: Audit trail means only recorded events currently visible in these sources; it is not a complete compliance ledger.