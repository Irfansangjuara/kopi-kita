-- Products table: menu items managed from the CMS
CREATE TABLE IF NOT EXISTS products (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(255) NOT NULL,
  description  TEXT,
  price        INTEGER NOT NULL CHECK (price >= 0),
  category     VARCHAR(50) NOT NULL CHECK (category IN ('kopi', 'non-kopi', 'pastry')),
  image_url    TEXT,
  available    BOOLEAN DEFAULT true,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table: customer table reservations
CREATE TABLE IF NOT EXISTS bookings (
  id             SERIAL PRIMARY KEY,
  customer_name  VARCHAR(255) NOT NULL,
  whatsapp       VARCHAR(50)  NOT NULL,
  booking_date   DATE         NOT NULL,
  booking_time   VARCHAR(10)  NOT NULL,
  party_size     INTEGER      NOT NULL CHECK (party_size BETWEEN 1 AND 8),
  notes          TEXT,
  status         VARCHAR(20)  DEFAULT 'pending'
                 CHECK (status IN ('pending', 'confirmed', 'done', 'cancelled')),
  created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Admins table: accounts that can log in to the CMS
CREATE TABLE IF NOT EXISTS admins (
  id             SERIAL PRIMARY KEY,
  email          VARCHAR(255) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table: persistent admin sessions (survives serverless restarts)
CREATE TABLE IF NOT EXISTS sessions (
  id          VARCHAR(128) PRIMARY KEY,   -- random hex session id
  admin_id    INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  expires_at  TIMESTAMP NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Failed admin logins, used to throttle password guessing
CREATE TABLE IF NOT EXISTS login_attempts (
  id         SERIAL PRIMARY KEY,
  key        TEXT NOT NULL,               -- email + request IP
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_login_attempts_key  ON login_attempts(key, created_at);
CREATE INDEX IF NOT EXISTS idx_products_category   ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available  ON products(available);
CREATE INDEX IF NOT EXISTS idx_bookings_date       ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status     ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_sessions_admin      ON sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires    ON sessions(expires_at);
