import { Request, Response, NextFunction } from 'express';

// Extend Express Request to include session
declare global {
  namespace Express {
    interface Request {
      session?: {
        adminId: number;
        email: string;
      };
    }
  }
}

// In-memory session storage (will move to database for production)
export const sessions = new Map<string, { adminId: number; email: string }>();

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.cookies?.sessionId;

  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized: No session' });
  }

  const session = sessions.get(sessionId);
  
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized: Invalid session' });
  }

  req.session = session;
  next();
};
