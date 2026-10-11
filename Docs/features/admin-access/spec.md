# Feature Specification: Admin Access And Account Lifecycle

**Status**: Reverse-engineered from current implementation

**Scope**: Existing admin-suite access, registration, password reset/change, session expiry, and sign-out behavior. This describes the current client-side mechanism, not a security endorsement.

## User Scenarios & Testing

### User Story 1 - Enter the admin suite (Priority: P1)

An admin-suite user signs in and reaches protected routes under an assigned role.

**Independent Test**: Sign in with a configured account, navigate to a protected route, then sign out and verify access is gated again.

**Acceptance Scenarios**:
1. Given valid account details, when a user signs in, then the current username and role are recorded in browser session state and admin routes become available.
2. Given an unauthenticated user, when they visit a protected admin route, then the access gate is shown.

### User Story 2 - Manage own credentials (Priority: P2)

A user registers or uses the available password reset/change flows and can end their session.

**Independent Test**: Exercise registration, password reset, own-password change, inactivity expiry, and sign-out.

**Acceptance Scenarios**:
1. Given the registration form, when required registration data and organization passkey are accepted, then an account is created in the configured user store.
2. Given inactivity beyond the configured 30-minute session window, when the user next interacts, then the session is expired.

## Requirements

### Functional Requirements

- **REQ-001**: The admin gate MUST support sign-in, registration, password reset/change, and sign-out actions currently exposed by the interface.
- **REQ-002**: The interface MUST distinguish admin, editor, and viewer roles for downstream UI behavior.
- **REQ-003**: The session MUST expire after the current activity-based timeout and retain its active identity in browser session storage.

### Key Entities

- **Admin user**: Username, password representation, phone, and role stored in the configured user collection.
- **Browser session**: Current signed-in flag, username, role, and activity expiry state.

## Edge Cases

- Authentication is custom client-side password checking, not Firebase Authentication.
- Bootstrap credentials and organization passkey are present in client code.
- Admin route gates and role checks are client-side; no server-side authorization or Firestore security rules were found.
- Changing or disabling an account does not visibly revoke an already-open session.

## Success Criteria

- **SC-001**: Signed-out visitors cannot proceed through the visible admin route gate.
- **SC-002**: Successful sign-in exposes the role used by downstream workspaces; sign-out removes the active session.
- **SC-003**: The inactivity timeout ends the browser session at the configured interval.

## Evidence And Assumptions

- Evidence: `src/components/auth/AdminAccessGate.tsx`, `src/components/layout/AdminLayout.tsx`, `src/lib/auth.ts`, `src/lib/firebase.ts`, `src/App.tsx`.
- Assumption: “Admin access” describes current UI gating and must not be read as a backend security boundary.