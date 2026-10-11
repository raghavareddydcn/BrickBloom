---
name: admin-access
description: "Use when changing BrickBloom admin sign-in, registration, session expiry, password reset/change, sign-out, or protected-route behavior."
---

# Admin Access Skill

## Source Map

- Gate and account UI: `src/components/auth/AdminAccessGate.tsx`, `src/components/layout/AdminLayout.tsx`.
- Account helpers and Firestore configuration: `src/lib/auth.ts`, `src/lib/firebase.ts`.
- Route wiring: `src/App.tsx`.
- Current behavior and security boundaries: `Docs/features/admin-access/spec.md`.

## Workflow

1. Trace each auth action from the gate through its persistence and session effects.
2. Preserve role names and existing session expiry behavior unless the requested change explicitly changes the contract.
3. Treat current client-side credential checks and route guards as UI behavior only, not a security boundary.
4. Do not copy embedded bootstrap credentials/passkeys or extend client-side password storage. Any security redesign needs an explicit server/auth-provider and data-migration plan.
5. Test sign-in, protected routing, sign-out, password flows, and inactivity expiry after changes.
6. Run `npm run build` after code changes.