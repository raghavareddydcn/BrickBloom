# Feature Specification: WhatsApp Outreach

**Status**: Reverse-engineered from current implementation

**Scope**: Staff import contact lists, compose personalized messages, select a dispatch mode, and monitor local progress. Dispatch completion in the UI is not proof of recipient delivery.

## User Scenarios & Testing

### User Story 1 - Prepare and send a contact batch (Priority: P1)

Staff import a spreadsheet, map contact columns, preview recipients, compose a message template, select a dispatch method, and monitor results.

**Independent Test**: Import a sample workbook, map name/phone fields, preview contacts, and run each available mode with test recipients.

**Acceptance Scenarios**:
1. Given a supported XLSX, XLS, or CSV file, when it is imported, then the first sheet is parsed and contacts are previewed after basic phone filtering.
2. Given a template containing `{name}`, when a batch is processed, then the contact name is substituted by the selected mode.
3. Given a selected mode, when dispatch starts, then the interface records progress and per-contact outcomes using that mode's behavior.

### User Story 2 - Connect a server WhatsApp session (Priority: P2)

Staff connect or clear the server session and monitor connection state before using server dispatch.

**Independent Test**: Connect using the QR/session flow, inspect connection state, and disconnect or clear the session.

## Requirements

### Functional Requirements

- **REQ-001**: The workspace MUST accept spreadsheet contact imports and allow name/phone column mapping and recipient preview.
- **REQ-002**: Staff MUST be able to compose templated messages, optionally select media, and choose Meta Cloud, click-to-chat, or server-session mode.
- **REQ-003**: The interface MUST provide the connection and progress controls currently implemented for each mode.
- **REQ-004**: Server mode MUST report session/recipient errors returned by the existing API rather than treating every attempted contact as delivered.

### Key Entities

- **Recipient**: Imported name and phone details held in workspace memory.
- **Message batch**: Template, recipient selection, optional media, mode, progress, and per-recipient log.
- **WhatsApp session**: Server-side connection state and local session files used by server mode.

## Edge Cases

- Import uses the first sheet and does not visibly deduplicate contacts.
- Server mode prefixes `91` to ten-digit numbers; other modes may normalize differently.
- Click-to-chat marks progress when a URL opens, not when WhatsApp reports delivery.
- Cloud mode sends local attachment bytes as text unless a hosted media URL is configured.
- Cloud credentials and backend URL are stored in browser local storage.
- Server send endpoints are unauthenticated in the visible Express app. The React workspace has no visible role check; standalone `public/whatsapp.html` has a separate viewer check.
- `/whatsapp` route behavior differs between the React router and Express static serving.

## Success Criteria

- **SC-001**: Staff can import a supported file, map recipient fields, and review the selected contact list before dispatch.
- **SC-002**: The interface shows a per-recipient result state for the selected mode and does not equate opening a chat URL with confirmed delivery.
- **SC-003**: Server session connection errors and send failures are visible to the operator.

## Evidence And Assumptions

- Evidence: `src/pages/WhatsAppWorkspace.tsx`, `server.js` (`/api/wa/*`), `public/whatsapp.html`, `src/pages/AdminHub.tsx`, `src/App.tsx`.
- Assumption: Contacts and logs are transient unless the current mode explicitly persists a server session; no contact database was found.