# Kopi Kita Backend Setup

Panduan setup backend Module 3 untuk project Kopi Kita.

## Prerequisites

- Docker Desktop running
- Node.js v22+ installed
- PostgreSQL client (psql) optional untuk testing

## 1. Start Database

```bash
cd ~/Documents/###AI/AI\ CLASS\ JOGJA/Kopi\ Kita

# Start Postgres container
docker compose up -d

# Verify database is running
docker compose ps

# Test connection
docker compose exec db psql -U kopikita -d kopikita -c "SELECT version();"
```

## 2. Setup & Run API Server

```bash
cd api

# Install dependencies
npm install

# Run database migration (create tables & seed data)
npm run db:migrate

# Start development server
npm run dev
```

API akan berjalan di `http://localhost:4000`

## 3. Test API dengan curl

### Test Products Endpoint (Public)
```bash
# Get all products
curl http://localhost:4000/api/products

# Filter by category
curl "http://localhost:4000/api/products?category=kopi"
```

### Test Bookings Endpoint (Public untuk POST)
```bash
# Create booking
curl -X POST http://localhost:4000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "customer_name": "Test User",
    "whatsapp": "08123456789",
    "booking_date": "2030-12-25",
    "booking_time": "19:00",
    "party_size": 4,
    "notes": "Test booking"
  }'
```

### Test Admin Auth
```bash
# Try to access admin endpoint without login (should get 401)
curl -i http://localhost:4000/api/bookings

# Login as admin
curl -c /tmp/kopikita.txt -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@kopikita.id","password":"kopikita-admin"}'

# Access admin endpoint with session cookie (should work)
curl -b /tmp/kopikita.txt http://localhost:4000/api/bookings
```

## 4. Verify Database

```bash
# Connect to database
docker compose exec db psql -U kopikita -d kopikita

# Inside psql:
\dt                              # List tables
SELECT * FROM products;          # View products
SELECT * FROM bookings;          # View bookings
SELECT email FROM admins;        # View admin (don't show password_hash!)
\q                              # Quit psql
```

## API Endpoints

### Products
- `GET /api/products` - List all products (public, supports ?category=)
- `POST /api/products` - Add product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Bookings
- `POST /api/bookings` - Create booking (public)
- `GET /api/bookings` - List bookings (admin only)
- `PATCH /api/bookings/:id` - Update booking status (admin only)

### Auth
- `POST /api/auth/login` - Login admin
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current session

## Admin Credentials

- Email: `admin@kopikita.id`
- Password: `kopikita-admin`

## Troubleshooting

### Database won't start
```bash
# Check if port 5432 is already in use
lsof -i :5432

# If another postgres is running, either stop it or change port in docker-compose.yml
```

### API won't start
```bash
# Check if port 4000 is in use
lsof -i :4000

# Make sure database is running first
docker compose ps
```

### .env not found
```bash
# Copy from example
cd api
cp .env.example .env
```

## Next Steps

After backend is running, you'll build the CMS pages in Next.js to manage products and bookings through a UI instead of curl commands.
