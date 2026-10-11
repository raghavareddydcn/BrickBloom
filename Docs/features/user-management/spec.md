# Feature Specification: Admin User Management

**Status**: Reverse-engineered from current implementation

**Scope**: Admins search user accounts, adjust roles/status, and reset credentials from the protected users workspace. It is distinct from a user's own sign-in and password lifecycle.

## User Scenarios & Testing

### User Story 1 - Review user accounts (Priority: P1)

An admin-suite user searches the account list and views profile and role information.

**Independent Test**: Open the users workspace, search for a known account, and inspect its visible profile.

### User Story 2 - Administer an account (Priority: P2)

An admin changes account role or status, generates a password, or resets another user's password.

**Independent Test**: As admin, perform each supported action on a test account and verify the stored record; repeat with a non-admin to confirm protected controls are hidden or blocked.

**Acceptance Scenarios**:
1. Given an admin user, when they change a role or status, then the user record is updated in the configured collection.
2. Given a non-admin user, when they open the workspace, then protected account actions are not available through the current UI.

## Requirements

### Functional Requirements

- **REQ-001**: The workspace MUST display and search user records from the current user collection.
- **REQ-002**: The interface MUST restrict role/status/password administration controls to the current admin role check.
- **REQ-003**: Admins MUST be able to change role/status and use the current password generation/reset actions.

### Key Entities

- **Admin user**: Account identity, role, status, phone, and credential data.
- **Role change**: Updated role value applied to an account record.

## Edge Cases

- Role checks are performed in the client; no backend authorization was found.
- Role/status update failures are logged to the console without visible user feedback.
- Generated passwords use `Math.random()` in the observed code.
- Updating or disabling an account does not visibly revoke an existing browser session.

## Success Criteria

- **SC-001**: A workspace user can locate an account by the available search controls.
- **SC-002**: Admin actions update the target record and the refreshed workspace shows the resulting values.
- **SC-003**: Non-admin users cannot perform account changes through the visible workspace controls.

## Evidence And Assumptions

- Evidence: `src/pages/UsersWorkspace.tsx`, `src/lib/auth.ts`, `src/components/auth/AdminAccessGate.tsx`, `src/App.tsx`.
- Assumption: This specification records current UI role checks and does not imply secure server-side account administration.