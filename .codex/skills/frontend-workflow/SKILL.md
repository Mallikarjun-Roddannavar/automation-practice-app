---
name: frontend-workflow
description: Implement and validate React, TypeScript, Vite, or shopping UI changes in this repository.
---

# Frontend workflow

Read `frontend/AGENTS.md` and inspect the affected UI and API usage. The current app keeps its shopping views and request helper in `frontend/src/App.tsx`, with shared styling in `frontend/src/index.css`.

Preserve stable test IDs, role-specific controls, INR formatting, and clear accessible feedback. Reuse the shared styling and compact action notifications; test tooltips with both hover and keyboard focus when changed. Keep the UI usable at narrow widths and honor reduced-motion preferences.

From the repository root, run `npm run build --prefix frontend` and `node scripts/check-test-ids.js`. For changed interactions, exercise relevant shopper and admin flows in a browser or with an available UI automation tool. Use disposable data for tests, and report any unverified behavior.
