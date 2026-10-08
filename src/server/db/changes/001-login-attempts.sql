-- 001 — login throttling table
--
-- Run by hand (this project has no migration tool):
--   psql "$DATABASE_URL" -f src/server/db/changes/001-login-attempts.sql
-- against the dev database first, then against production, before deploying
-- the code that uses it.

CREATE TABLE IF NOT EXISTS login_attempts (
  id         SERIAL PRIMARY KEY,
  key        TEXT NOT NULL,               -- email + request IP
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_login_attempts_key ON login_attempts(key, created_at);
