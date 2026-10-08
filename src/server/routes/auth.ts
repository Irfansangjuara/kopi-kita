import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { getPool } from '../db';
import { reportServerError } from '../observability';
import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_OPTIONS,
  SESSION_TTL_DAYS,
} from '../session-cookie';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const pool = getPool();
    const { email, password } = req.body as { email?: string; password?: string };

    if (!email || !password) {
      res.status(400).json({ error: 'Missing email or password' });
      return;
    }

    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const admin = result.rows[0] as { id: number; email: string; password_hash: string };
    const passwordMatch = await bcrypt.compare(password, admin.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

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

export default router;
