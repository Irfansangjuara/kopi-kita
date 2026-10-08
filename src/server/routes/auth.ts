import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { getPool, type DbPool } from '../db';
import { requireAdmin } from '../middleware/auth';
import { reportServerError } from '../observability';
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SESSION_TTL_DAYS,
} from '../session-cookie';

const router = Router();

// Password guessing on the single admin account is throttled per (email, IP):
// after RATE_LIMIT_MAX_FAILURES failures inside the window, logins are refused
// until the window slides past. Counters live in Postgres, not in memory,
// because serverless instances do not share memory.
const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_FAILURES = 5;
let loginAttemptsTableEnsured = false;
async function ensureLoginAttemptsTable(pool: DbPool) {
  if (loginAttemptsTableEnsured) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_attempts (
        id SERIAL PRIMARY KEY,
        key TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_login_attempts_key ON login_attempts(key, created_at);
    `);
    loginAttemptsTableEnsured = true;
  } catch (err) {
    console.error('Error ensuring login_attempts table:', err);
  }
}

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const pool = getPool();
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }

    const forwarded = req.headers['x-forwarded-for'];
    const ip =
      typeof forwarded === 'string' && forwarded.length > 0
        ? forwarded.split(',')[0].trim()
        : req.ip ?? 'unknown';
    const attemptKey = `${email.toLowerCase()}:${ip}`;
    await ensureLoginAttemptsTable(pool);

    const recentFailures = await pool.query<{ failures: number }>(
      `SELECT COUNT(*)::int AS failures FROM login_attempts WHERE key = $1 AND created_at > NOW() - INTERVAL '15 minutes'`,
      [attemptKey],
    );

    if (recentFailures.rows[0].failures >= RATE_LIMIT_MAX_FAILURES) {
      await reportServerError(
        new Error(`Login throttled after ${recentFailures.rows[0].failures} failed attempts`),
        'Login rate limit hit',
      );
      res.status(429).json({ error: 'Too many attempts, try again later' });
      return;
    }

    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      // Same generic answer as a wrong password: no user enumeration.
      await pool.query('INSERT INTO login_attempts (key) VALUES ($1)', [attemptKey]);
      console.warn(`[security] failed admin login key=${attemptKey}`);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const admin = result.rows[0] as { id: number; email: string; password_hash: string };
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatch) {
      await pool.query('INSERT INTO login_attempts (key) VALUES ($1)', [attemptKey]);
      console.warn(`[security] failed admin login key=${attemptKey}`);
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // A successful login clears the failure counter for this email + IP
    await pool.query('DELETE FROM login_attempts WHERE key = $1', [attemptKey]);

    // Store session in DB
    const sessionId = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 24 * 60 * 60 * 1000);

    await pool.query(
      'INSERT INTO sessions (id, admin_id, expires_at) VALUES ($1, $2, $3)',
      [sessionId, admin.id, expiresAt],
    );

    res.cookie(SESSION_COOKIE_NAME, sessionId, {
      ...SESSION_COOKIE_OPTIONS,
      maxAge: SESSION_TTL_DAYS * 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'Login successful', admin: { id: admin.id, email: admin.email } });
  } catch (error) {
    await reportServerError(error, 'Login error');
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
  const sessionId = req.cookies?.sessionId as string | undefined;
  if (sessionId) {
    try {
      const pool = getPool();
      await pool.query('DELETE FROM sessions WHERE id = $1', [sessionId]);
    } catch (err) {
      // Best-effort deletion; continue logout regardless
      await reportServerError(err, 'Session delete error');
    }
  }
  res.clearCookie(SESSION_COOKIE_NAME, SESSION_COOKIE_OPTIONS);
  res.status(204).end();
});

// GET /api/auth/me
router.get('/me', async (req, res) => {
  const sessionId = req.cookies?.sessionId as string | undefined;
  if (!sessionId) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    const pool = getPool();
    const result = await pool.query<{ admin_id: number; email: string }>(
      `SELECT s.admin_id, a.email
         FROM sessions s
         JOIN admins a ON a.id = s.admin_id
        WHERE s.id = $1
          AND s.expires_at > NOW()`,
      [sessionId],
    );
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid or expired session' });
      return;
    }
    const { admin_id, email } = result.rows[0];
    res.json({ admin: { id: admin_id, email } });
  } catch (err) {
    await reportServerError(err, 'Auth/me error');
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/auth/change-password
router.post('/change-password', requireAdmin, async (req, res) => {
  try {
    const pool = getPool();
    const { currentPassword, newPassword } = req.body as {
      currentPassword?: string;
      newPassword?: string;
    };

    if (!currentPassword || !newPassword) {
      res.status(400).json({ error: 'Current password and new password are required' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ error: 'New password must be at least 8 characters' });
      return;
    }

    const adminId = req.adminSession?.adminId;
    const result = await pool.query('SELECT * FROM admins WHERE id = $1', [adminId]);
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Admin not found' });
      return;
    }

    const admin = result.rows[0] as { id: number; email: string; password_hash: string };
    const passwordMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Current password incorrect' });
      return;
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE admins SET password_hash = $1 WHERE id = $2', [newHash, adminId]);
    await pool.query('DELETE FROM sessions WHERE admin_id = $1', [adminId]);

    console.log(`[security] Admin password updated for ${admin.email}`);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    await reportServerError(err, 'Password update error');
    res.status(500).json({ error: 'Failed to update password' });
  }
});

export default router;
