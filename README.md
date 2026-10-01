# Kopi Kita

A full-stack coffee shop website with a public menu, table booking, and an admin CMS — built with Next.js and PostgreSQL.

**Live Demo:** [https://kopikita.copilotmarketing.id](https://kopikita.copilotmarketing.id)

---

## Features

- **Public menu page** with real-time product data loaded from the database
- **Category filter** to browse by Coffee / Non-Coffee / Pastry
- **Table booking form** with input validation that saves reservations to the database
- **Admin CMS** to manage products (add / edit / delete / toggle availability) and bookings (filter and update status)
- **Secure admin login** with session-based authentication

---

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Express** (mounted inside Next.js)
- **PostgreSQL** (Docker for local development, Neon for production)
- **Vercel** (deployment)

---

## Running Locally

```bash
# 1. Start the database
docker compose up -d

# 2. Install dependencies
npm install

# 3. Copy env template and fill in values
cp .env.example .env.local

# 4. Seed the database
npm run db:reset

# 5. Start the development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Admin Credentials

Access the admin dashboard at [http://localhost:3000/admin/login](http://localhost:3000/admin/login):

- **Email:** `admin@kopikita.id`
- **Password:** `kopikita-admin`
