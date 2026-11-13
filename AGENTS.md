# AGENTS.md

Instructions for the shopping app; nested `AGENTS.md` files add guidance for their directories. Follow explicit user requests when they differ from project defaults.

- Stack: React, TypeScript, Vite and shared CSS; FastAPI, SQLAlchemy and local SQLite. See `README.md` for setup and practice accounts.
- Shoppers browse, check out and view their own orders. Admins can additionally manage products, view all orders and update statuses. Enforce permissions in the backend as well as the UI.
- Preserve stable `data-testid` attributes on interactive controls and add them to new controls. Keep Swagger and UI/API automation practical.
- Keep changes focused; update the README for changes to setup, auth, API contracts, major UI behavior or the shared visual direction.
- Preserve user data unless deletion is explicitly requested. Do not use destructive git commands or manually edit `.venv/`, `dist/` or `node_modules/`.
- Before finishing, run `python -m py_compile backend/main.py backend/auth.py backend/models.py`, `npm run build --prefix frontend`, and `node scripts/check-test-ids.js` from the repository root. Exercise affected behavior and permissions; report checks that could not run.
