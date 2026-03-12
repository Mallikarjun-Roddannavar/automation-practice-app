# Frontend Workflow Skill

## Purpose
Use this skill when working on React + TypeScript + Vite frontend changes in this repository.

## Applies to
- `frontend/src/**/*`
- `frontend/package.json`
- `frontend/index.html`
- `frontend/vite.config.ts`

## Core rules
- Preserve route behavior:
  - `/login`
  - `/oauth/callback`
  - `/folders`
  - `/folders/:folderId`
  - `/preferences`
- Keep `data-testid` on all interactive elements.
- Keep RBAC UI behavior aligned with backend role rules.
- Keep theme and profile menu behaviors intact.
- Keep toast notifications (`react-toastify`) for async user feedback.

## Standard workflow
1. Update components/pages with minimal diffs.
2. Reuse shared classes (`btn-primary`, `btn-secondary`, `btn-danger`, `icon-btn`, `app-card`, `app-input`).
3. Keep API calls through `src/api.ts`.
4. Ensure new actions have test IDs.
5. Build and verify.

## Validation commands
Run from `frontend/`:

```bash
npm install
npm run build
npm run dev
```

## Playwright-focused checklist
- Interactive controls have stable test IDs.
- Success/error toasts remain visible and deterministic.
- Deep links continue to work in new tab and direct navigation.
- Polling/refresh behavior remains available on folder and file views.

## Guardrails
- Do not remove existing test IDs without explicit request.
- Avoid one-off button styles; use shared button classes.
- Keep API auth as Bearer token-based.

## Verification Marker (Temporary)
- If this skill is applied in a run, include this exact phrase once in a progress update:
  - `frontend-workflow skill applied`
