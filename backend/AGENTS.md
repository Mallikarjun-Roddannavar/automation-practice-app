# Backend agent instructions

- The FastAPI entry point and SQLAlchemy models are in `backend/main.py`, request schemas in `backend/models.py`, and JWT helpers in `backend/auth.py`.
- Shopping endpoints require Bearer authentication. Shoppers may access only their own orders; admins can manage products, view all orders and update statuses. Preserve `/token`, `/health`, and usable `/docs` unless the user requests a contract change.
- Store prices as integer minor units and calculate checkout totals on the server. Order items snapshot product names and prices, so later product changes do not alter historical orders.
- Preserve the local SQLite database and return clear `detail` errors. For tests that write data, set `SHOP_DB_PATH` to a disposable SQLite file instead of touching the user's database.
- For backend changes, check `/health` and exercise affected endpoints, including authentication and role boundaries when relevant. Update the README when setup, environment variables or API contracts change.
