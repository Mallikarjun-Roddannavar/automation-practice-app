# AGENTS.md (Backend)

Backend-specific instructions for `playwright-practice-app/backend`.

## Scope
- Applies only to files under `backend/`.
- Overrides root guidance when there is a conflict.

## Current backend architecture
- Entry point: `main.py`
- Auth module: `auth.py`
- Schemas: `models.py`
- Data store: `database.json`
- File store: `uploads/`

## Auth requirements
- Password flow endpoint:
  - `POST /token` (OAuth2PasswordRequestForm)
- JWT claims must include role (`admin|editor|viewer`) used by frontend RBAC.
- `get_current_user` dependency must protect folder/file endpoints.
- Optional external OAuth endpoints must continue working when configured:
  - `GET /auth/oauth/login`
  - `GET /auth/oauth/callback`

## RBAC contract (must not regress)
- `viewer`: read-only (`GET` endpoints only)
- `editor`: can create/rename/upload, cannot delete
- `admin`: full access including delete

## Storage and consistency rules
- Keep `database.json` compatible with existing format.
- Use BOM-safe JSON reads (`utf-8-sig`) and stable writes.
- File metadata in JSON must match real files in `uploads/`.
- On folder deletion, remove associated uploaded files from disk.

## API behavior requirements
- Maintain predictable errors (`detail` field) for frontend toasts/tests.
- Keep `/docs` usable for API automation practice.
- Preserve endpoint URLs unless user explicitly asks to change them.
- If adding endpoints, follow existing naming style and dependency injection pattern.

## Local verification
- Syntax:
  - `python -m py_compile main.py auth.py models.py`
- Run server:
  - `uvicorn main:app --reload --port 8000`
- Quick API checks:
  - `/health`
  - `/token` login
  - one protected endpoint using Bearer token

## Dependency rules
- Keep dependencies lean.
- Prefer stable, widely-used libs only.
- If dependency changes are made, update `requirements.txt` and README instructions.
