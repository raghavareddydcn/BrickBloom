---
name: operations-overview
description: "Use when changing BrickBloom's admin hub summaries, Firestore dashboard reads, WhatsApp status indicator, or workspace navigation."
---

# Operations Overview Skill

## Source Map

- Dashboard: `src/pages/AdminHub.tsx`.
- Admin shell and navigation: `src/components/layout/AdminLayout.tsx`.
- Routes: `src/App.tsx`.
- Current summary sources and limitations: `Docs/features/operations-overview/spec.md`.

## Workflow

1. Identify the source collection or endpoint for each summary before changing labels or calculations.
2. Keep snapshot values distinct from live/streaming status; WhatsApp status is fetched on mount in the current dashboard.
3. Exercise empty, loading, and error states when modifying reads; visible handling is currently limited.
4. Keep navigation aligned with the route definitions and preserve the existing admin route gate.
5. Do not add role-based visibility claims unless implemented and enforced in the relevant layer.
6. Run `npm run build` after code changes.