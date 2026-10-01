/**
 * Express application entry point.
 * This file only creates and configures the app; it does NOT call app.listen().
 * Next.js mounts it via the catch-all API route (app/api/[...slug]/route.ts).
 */
import express from 'express';
import cookieParser from 'cookie-parser';

import productsRouter from './routes/products';
import bookingsRouter from './routes/bookings';
import authRouter from './routes/auth';

const app = express();

// Parse JSON bodies and cookies
app.use(express.json());
app.use(cookieParser());

// Routes — all mounted under /api/* so the catch-all forwards correctly
app.use('/api/products', productsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// 404 fallback
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _next: express.NextFunction,
  ) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  },
);

export default app;
