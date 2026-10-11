---
name: user-management
description: "Use when changing BrickBloom admin user search, role/status changes, password generation/reset, or account administration controls."
---

# User Management Skill

## Source Map

- User workspace: `src/pages/UsersWorkspace.tsx`.
- Role/session helpers: `src/lib/auth.ts`, `src/components/auth/AdminAccessGate.tsx`.
- Current behavior and limitations: `Docs/features/user-management/spec.md`.

## Workflow

1. Trace user record reads and writes, then verify the refreshed UI reflects successful changes.
2. Preserve the distinction between account role/status administration and the user's own sign-in lifecycle.
3. Treat client-side role checks as presentation controls, not authorization. Do not add privileged backend operations without server-side authorization.
4. Do not use `Math.random()` or client-generated credentials for new security-sensitive behavior; surface update failures to the operator.
5. Check what happens to active sessions after a role or status change.
6. Run `npm run build` after code changes and validate changes with a non-production account.