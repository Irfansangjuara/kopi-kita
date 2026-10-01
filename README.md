# Kopi Kita — Coffee Shop Website

A full-stack coffee shop web application built as the guided project for the **AI Class Jogja** bootcamp (Modules 1–5).

**Live demo:** [https://kopi-kita.vercel.app](https://kopi-kita.vercel.app) *(deploy to update this link)*

---

## Features

- **Public menu** — product catalog with category filter (Coffee / Non-Coffee / Pastry), real database data, loading skeletons, and an error state with "Try Again"
- **Table booking form** — full validation (past dates, WhatsApp digits, party size 1–8), submits to the server and shows a confirmation card with booking ID
- **Admin CMS** — login-protected dashboard, product CRUD (add / edit / delete / toggle available), booking management with status workflow (pending → confirmed → done / cancelled)
- **Persistent sessions** — session IDs stored in Postgres so admin stays logged in across serverless restarts
- **Testimonials** — customer review cards on the landing page

---

## Screenshots

| Landing page | Menu page |
|---|---|
| *(add screenshot)* | *(add screenshot)* |

| CMS — Products | CMS — Bookings |
|---|---|
| *(add screenshot)* | *(add screenshot)* |

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, TypeScript) |
| Styling | Tailwind CSS 4 |
| Backend | Express mounted inside Next.js via catch-all API route |
| Database | PostgreSQL — Docker (local) · Neon (production) |
| Auth | Session cookies, bcrypt password hashing, DB-backed sessions |
| Deployment | Vercel (CI/CD on every push to `main`) |

---

## Running locally

### Prerequisites

- Node.js v22+
- Docker Desktop (for the local Postgres container)

### Steps

```bash
# 1. Clone the repo
git clone https://github.com/Irfansangjuara/kopi-kita.git
cd kopi-kita

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env.local
# Edit .env.local — set DATABASE_URL to the Docker connection string

# 4. Start Postgres
docker compose up -d

# 5. Load schema + seed data
docker compose exec db psql -U kopikita -d kopikita \
  -f /dev/stdin < src/server/db/schema.sql
docker compose exec db psql -U kopikita -d kopikita \
  -f /dev/stdin < src/server/db/seed.sql

# 6. Start the development server (one command — no separate API server needed)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Email: `admin@kopikita.id` · Password: `kopikita-admin`

### Resetting the database

```bash
npm run db:reset
```

---

## Deploying to Vercel

1. Create a free Postgres database on [neon.tech](https://neon.tech) and run the schema + seed against it.
2. Import this repo on [vercel.com](https://vercel.com).
3. Add environment variables in Vercel settings:
   - `DATABASE_URL` — Neon connection string
   - `NEXT_PUBLIC_API_URL` — leave empty (same-origin API)
4. Deploy. Every push to `main` triggers an automatic redeploy.
