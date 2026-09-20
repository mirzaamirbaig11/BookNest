import { NextResponse } from 'next/server';
import { getSession, SessionPayload } from './auth';

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

/** Ensures the request has a valid session. Returns the session or a 401 response. */
export async function requireUser(): Promise<
  { session: SessionPayload } | { error: NextResponse }
> {
  const session = await getSession();
  if (!session) return { error: jsonError('Please log in to continue.', 401) };
  return { session };
}

/** Ensures the request is from a logged-in ADMIN. Returns the session or a 401/403 response. */
export async function requireAdmin(): Promise<
  { session: SessionPayload } | { error: NextResponse }
> {
  const session = await getSession();
  if (!session) return { error: jsonError('Please log in to continue.', 401) };
  if (session.role !== 'ADMIN') return { error: jsonError('Admin access required.', 403) };
  return { session };
}

/** Very small in-memory rate limiter — good enough for a single-instance deployment.
 *  For multi-instance production deployments, replace with a Redis-backed limiter. */
const attempts = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || now > entry.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count += 1;
  return true;
}
