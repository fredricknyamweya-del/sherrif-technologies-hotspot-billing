# Sherrif Technologies WiFi Billing System

A WiFi hotspot billing platform for ISP businesses in Kenya. Customers connect to the hotspot, land on a captive portal, buy a time-based internet package through M-Pesa STK Push, and are granted timed access on a MikroTik router. Admins manage packages, vouchers, clients, routers, SMS campaigns, support tickets and the look of the portal from a dedicated admin portal.

## How it works

1. A customer connects to the WiFi and is redirected to the captive portal.
2. They pick a package, enter their phone number and tap **Pay Now**.
3. The backend triggers an M-Pesa STK Push through the Safaricom Daraja API.
4. The customer enters their M-Pesa PIN on their phone.
5. Safaricom sends a callback confirming success or failure.
6. The backend provisions a time-limited hotspot user on the MikroTik router (RouterOS API).
7. A scheduled job expires the session when the paid time runs out.
8. Fallback: the customer reconnects with their M-Pesa transaction code or an admin-issued voucher.

## Packages

| Package | Price (KSh) |
|---|---|
| Smoke Plan (5 min) | 2 |
| 30 min | 5 |
| 45 min | 7 |
| 1 hour | 10 |
| 2 hours | 15 |
| 3 hours | 20 |
| 4 hours | 30 |
| 6 hours | 35 |
| 12 hours | 45 |
| 24 hours | 55 |
| Weekly | 175 |
| Monthly | 595 |

Prices and packages are editable from the admin portal.

## Features

**Customer portal (mobile first)**
- Package selection, M-Pesa payment and live payment status
- Reconnect with an M-Pesa transaction code
- Voucher activation
- Customer care contacts (call, WhatsApp, email): 0719221177
- Light and dark mode toggle, green by default

**Admin portal**
- Admin login, password change
- Dashboard and reports (revenue, packages, users, vouchers, router usage) with PDF/CSV/Excel export
- Packages management (create, edit price, archive)
- Vouchers (generate, copy, track)
- Transactions, active users, session history
- Clients (separate from active users) with profile history, block and unblock
- FreeRADIUS management
- Hotspots and routers
- MikroTik monitoring (CPU, memory, uptime, traffic, alerts)
- Client router migration wizard
- Network settings
- SMS marketing
- Support tickets
- Announcements shown on the captive portal
- Appearance: change the primary colour and theme
- System logs
- Customer care settings

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, JavaScript, Vite, Tailwind CSS v4, react-router |
| Backend | Python 3.12, Flask |
| Database | PostgreSQL via SQLAlchemy and Flask-Migrate |
| Auth | Flask-JWT-Extended (HttpOnly cookie and CSRF token) |
| Scheduling | Flask-APScheduler |
| Router integration | RouterOS API (routeros-api) |
| Payments | Safaricom Daraja (M-Pesa STK Push) |
| SMS | Africa's Talking |
| Package managers | npm (frontend), pipenv (backend) |

The frontend uses npm only. Do not use pnpm, yarn or bun.

## Project structure

```
sikazwe-wifi-billing/
├── frontend/          React + Vite app (customer portal and admin portal)
├── backend/           Flask API
│   ├── app/
│   │   ├── models/    SQLAlchemy models
│   │   ├── routes/    Blueprints (public and admin)
│   │   ├── services/  Daraja, RouterOS, FreeRADIUS, SMS, reports
│   │   ├── jobs/      Scheduled jobs (session expiry)
│   │   └── utils/
│   ├── migrations/
│   ├── scripts/       seed.py
│   └── tests/
├── docs/              api-contract.md
├── .nvmrc
└── README.md
```

## Getting started

### Prerequisites
- Node.js 20 or newer and npm 10 or newer
- Python 3.12 and pipenv
- Docker (for local PostgreSQL) or a PostgreSQL 15+ server

### 1. Database

```bash
cd backend
docker compose up -d postgres
```

### 2. Backend

```bash
cd backend
cp .env.example .env        # then fill in the values
pipenv install --dev
pipenv run flask db upgrade
pipenv run python scripts/seed.py
pipenv run flask run        # http://127.0.0.1:5555
```

Alternative with pip: `python -m venv .venv`, activate it, then `pip install -r requirements.txt`.

### 3. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev                 # development server
npm run build               # production build
npm run preview             # preview the production build
```

In development the frontend proxies `/api` requests to `http://127.0.0.1:5555`.

## Environment variables

Create `backend/.env` (never commit it):

```env
FLASK_ENV=development
SECRET_KEY=replace_with_a_random_secret_of_at_least_32_characters
JWT_SECRET_KEY=replace_with_another_random_secret
ADMIN_USERNAME=admin
ADMIN_PASSWORD=replace_with_a_strong_password
ADMIN_TOKEN_EXP_MINUTES=30
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sikazwe_billing
TEST_DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sikazwe_billing_test
CORS_ORIGINS=http://localhost:5173

DARAJA_ENV=sandbox
DARAJA_CONSUMER_KEY=
DARAJA_CONSUMER_SECRET=
DARAJA_SHORTCODE=
DARAJA_PASSKEY=
DARAJA_CALLBACK_URL=

ROUTEROS_HOST=
ROUTEROS_USER=
ROUTEROS_PASSWORD=
ROUTEROS_PORT=8728

SMS_USERNAME=
SMS_API_KEY=
SMS_SENDER_ID=
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=/api
VITE_USE_MOCK=false
```

The seed script creates the first admin from `ADMIN_USERNAME` and `ADMIN_PASSWORD` and forces a password change on first login. Never commit real credentials.

## API overview

Base URL (development): `http://127.0.0.1:5555/api`

Protected endpoints use an HttpOnly JWT cookie set at login. Unsafe requests (POST, PATCH, DELETE) also need the `X-CSRF-TOKEN` header copied from the readable `csrf_access_token` cookie.

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/login`, `POST /admin/password/change` |
| Customer | `GET /packages`, `POST /stkpush`, `GET /payment/status/<id>`, `POST /reconnect`, `POST /vouchers/activate` |
| Payments | `POST /mpesa/callback` (called by Safaricom) |
| Admin | transactions, active-users, sessions, clients, vouchers, plans, routers, hotspots, mikrotik, migration, freeradius, sms, tickets, announcements, appearance, network-settings, logs, reports |

The full request and response contracts live in `docs/api-contract.md`.

## Git workflow

- `main`: always deployable and protected
- `develop`: integration branch
- `feature/frontend-*` and `feature/backend-*`: one branch per task
- Pull requests go into `develop`, never straight to `main`
- Merge `develop` into `main` only after full end-to-end testing
- Commit messages follow Conventional Commits, for example `feat(backend): add voucher activation endpoint`

## Hardware and client requirements

- MikroTik router (hAP ac2 or hAP ac3 recommended), bought by the client
- Safaricom M-Pesa Paybill or Till number (registered shortcode) with Daraja access
- VPS or hosting account for the backend and frontend (Render or a VPS)
- ISP internet connection feeding the MikroTik WAN port (ether1)
- SMS gateway account and credits (for SMS marketing)

## Hosting

- Frontend: Render static site built with `npm run build`
- Backend: Render web service or VPS, started with `gunicorn wsgi:app --bind 0.0.0.0:$PORT`
- Database: managed PostgreSQL or a VPS-hosted instance

## Known complex areas

1. Safaricom asynchronous callbacks: confirmations can be delayed, duplicated or never arrive. Handle idempotency and provide the reconnect fallback.
2. RouterOS API integration: less documented, test against a real MikroTik early.

## License

Proprietary. All rights reserved by Sikazwe Technologies.
