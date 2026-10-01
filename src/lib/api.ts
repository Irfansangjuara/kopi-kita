/**
 * Unified API fetch helper.
 *
 * All API calls go through this function so that:
 * - The base URL comes from a single env var (NEXT_PUBLIC_API_URL).
 * - In production (Vercel) the var is empty → relative paths (/api/...)
 *   are used, which avoids CORS entirely.
 * - Error handling is consistent across the app.
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '';

export async function apiFetch<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    credentials: 'include', // send session cookie on every request
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `API error ${res.status}`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // body wasn't JSON
    }
    throw new Error(message);
  }

  // 204 No Content has no body
  if (res.status === 204) return undefined as unknown as T;

  return res.json() as Promise<T>;
}
