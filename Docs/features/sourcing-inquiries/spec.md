# Feature Specification: B2B Sourcing Inquiries

**Status**: Reverse-engineered from current implementation

**Scope**: Public visitors submit a product or sourcing inquiry from the home or product-detail experience. This flow is not a persisted CRM or lead-management workspace.

## User Scenarios & Testing

### User Story 1 - Contact the sourcing desk (Priority: P1)

A prospective buyer provides contact and company details with an inquiry and receives a visible submission result.

**Independent Test**: Submit a valid form and an incomplete form from an inquiry surface; verify result feedback and request handling.

**Acceptance Scenarios**:
1. Given the inquiry form, when the visitor submits all browser-required fields, then the app attempts its lead API and displays success or error feedback.
2. Given the local lead API is unavailable or returns a non-success response, when fallback dispatch resolves, then the current UI reports the inquiry as submitted.

## Requirements

### Functional Requirements

- **REQ-001**: Public inquiry forms MUST collect name, email, phone, company, product, and message.
- **REQ-002**: The interface MUST validate required form fields before submission and display a submission result.
- **REQ-003**: The lead endpoint MUST accept inquiry data and attempt email dispatch when SMTP configuration is available; otherwise it logs a simulated dispatch.
- **REQ-004**: The form MUST use its configured external form fallback when the local API flow fails.

### Key Entities

- **Inquiry**: Contact details, company, selected product, and message supplied by a prospective buyer.

## Edge Cases

- The server validates fewer fields than the browser form; direct API requests can omit phone and product.
- The external fallback treats a resolved fetch as success without checking its HTTP status.
- No lead database, admin inbox, or durable lead record was found.
- SMTP delivery depends on environment configuration; without it the server only logs simulated dispatch.

## Success Criteria

- **SC-001**: A visitor can submit a complete inquiry and receives visible success or error feedback.
- **SC-002**: Invalid browser form input is blocked before dispatch.
- **SC-003**: Failed local API submission follows the existing fallback path and returns the interface to a terminal state.

## Evidence And Assumptions

- Evidence: `src/components/sections/ContactForm.tsx`, `src/pages/ProductDetail.tsx`, `server.js` (`POST /api/leads`).
- Assumption: Inquiry submission means dispatch attempt; no CRM persistence is implied.