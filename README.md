# Shopping App

A small shopping app for UI and API automation with tools such as Selenium and Playwright. React, TypeScript, Vite and Tailwind provide the frontend; FastAPI, SQLAlchemy and a local SQLite database provide the API and storage.

## Run locally

Requirements: Python 3.10+ and Node.js 18+.

```powershell
cd backend
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

In another terminal:

```powershell
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. API documentation is at http://localhost:8000/docs. Set `VITE_API_BASE_URL` to change the frontend API address and `JWT_SECRET_KEY` to change the development signing key.

## Demo accounts

- `admin` / `admin123`: shop, manage products, view all orders and update order statuses.
- `shopper` / `shopper123`: shop and view own orders.
- `shopper2` / `shopper123`: second shopper for access-control tests.

Products and accounts are seeded on first startup. The SQLite file is `backend/shop.sqlite3`. Prices are displayed in Indian rupees (INR). Cart contents are stored in the browser. Checkout records a simulated order with server-calculated prices; no payment is processed. Order items retain their original names and prices when products change.



## Checkout options

Checkout offers gift wrap, a simulated delivery method, an optional preferred date, and an optional attachment (up to 1 MB). These are saved with the order; shoppers can download their own attachments and admins can download any order attachment. Existing orders retain their data and receive default delivery options. Order details show items in a table.

## Checks

```powershell
python -m py_compile backend/main.py backend/auth.py backend/models.py
node scripts/check-test-ids.js
cd frontend
npm run build
```


The storefront uses a light, modern visual style with violet accents. Action notifications and hover or keyboard-focus tooltips give feedback during shopping and administration.
