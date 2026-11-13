---
name: backend-workflow
description: Implement and validate FastAPI, authentication, SQLite, or shopping API changes in this repository.
---

# Backend workflow

Read `backend/AGENTS.md` and inspect the affected endpoint, models, and dependencies before changing them. Keep the API contract and frontend in sync; document setup or contract changes in the README.

For permission-sensitive changes, exercise anonymous access, shopper access, admin access, and another shopper's order where relevant. Check order totals and snapshots when checkout or product pricing changes. Use `SHOP_DB_PATH` to point tests at a disposable SQLite file; do not reset or modify the user's database for validation.

From the repository root, run `python -m py_compile backend/main.py backend/auth.py backend/models.py`. Start the API as needed, check `/health`, and exercise the affected endpoints and `/docs`. Report checks that could not run.
