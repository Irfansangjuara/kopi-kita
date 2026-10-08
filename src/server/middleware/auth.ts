import type { Request, Response, NextFunction } from 'express';
import { getPool } from '../db';
import { reportServerError } from '../observability';

// Extend Express Request to carry the verified admin info
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      adminSession?: {
        adminId: number;
        email: string;
      };
    }
  }
}

export const requireAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const sessionId = req.cookies?.sessionId as string | undefined;

  if (!sessionId) {
    res.status(401).json({ error: 'Unauthorized: No session' });
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
      res.status(401).json({ error: 'Unauthorized: Invalid or expired session' });
      return;
    }

    req.adminSession = {
      adminId: result.rows[0].admin_id,
      email: result.rows[0].email,
    };
    next();
  } catch (err) {
    await reportServerError(err, 'Session check error');
    res.status(500).json({ error: 'Internal server error' });
  }
};
