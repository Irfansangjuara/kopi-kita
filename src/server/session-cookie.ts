/**
 * Session cookie definition shared by the login/logout routes and the
 * `requireAdmin` middleware, so the name and the flags can never drift apart.
 *
 * Flags: HttpOnly (no JavaScript access), Secure in production (localhost may
 * stay plain HTTP), SameSite=Lax (blocks cross-site CSRF), path '/' and a
 * Max-Age that matches the row lifetime in the `sessions` table.
 */
export const SESSION_COOKIE_NAME = 'sessionId';

export const SESSION_TTL_DAYS = 7;

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
} as const;
