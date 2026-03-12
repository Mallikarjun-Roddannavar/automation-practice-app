# AGENTS.md (Frontend)

Frontend-specific instructions for `playwright-practice-app/frontend`.

## Scope
- Applies only to files under `frontend/`.
- Overrides root guidance when there is a conflict.

## Current frontend architecture
- Stack: React + TypeScript + Vite + Tailwind
- Routing in `src/App.tsx`
- Auth context in `src/context/AuthContext.tsx`
- API client in `src/api.ts`
- Shared layout/components in `src/components/`
- Pages in `src/pages/`

## UX/testability requirements
- Every interactive element must have a stable `data-testid`.
- Do not remove existing test IDs unless explicitly requested.
- For any new button/input/link/dialog action, add a `data-testid`.
- Keep deep links functional:
  - `/folders/:folderId`
  - `/oauth/callback`

## Auth and RBAC requirements
- Use Bearer token auth from `api.ts` for protected calls.
- Role is derived from JWT payload and drives UI visibility/disable states.
- UI permissions must match backend rules:
  - `viewer`: read-only
  - `editor`: create/edit/upload
  - `admin`: delete allowed

## UI behavior that must remain intact
- Profile menu + preferences flow
- Theme preference support (white/black)
- Folder and file CRUD dialogs
- Bulk delete controls (where implemented)
- Real-time sync aids:
  - manual refresh buttons
  - periodic polling
- Toast notifications via `react-toastify`

## Styling conventions
- Reuse existing utility classes and semantic classes from `src/index.css`:
  - `btn-primary`, `btn-secondary`, `btn-danger`, `icon-btn`
  - `app-card`, `app-input`, `app-table`, etc.
- Keep button styles consistent; avoid ad hoc one-off button variants.

## Verification commands
- Install/update deps when needed:
  - `npm install`
- Build check:
  - `npm run build`
- Dev server:
  - `npm run dev`

## Change hygiene
- Prefer small, focused updates.
- Keep component responsibilities clear.
- If API contracts change, update `api.ts` and affected pages together.
