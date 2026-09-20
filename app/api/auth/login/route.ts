import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validation';
import { verifyPassword, createSessionToken, setSessionCookie } from '@/lib/auth';
import { jsonError, rateLimit } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`login:${ip}`, 15, 60_000)) {
    return jsonError('Too many login attempts. Please try again in a minute.', 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input.', 422);
  }

  const { identifier, password } = parsed.data;
  const isEmail = identifier.includes('@');

  const user = await prisma.user.findFirst({
    where: isEmail ? { email: identifier.toLowerCase() } : { mobile: identifier },
  });

  // Same generic error whether the account doesn't exist or the password is wrong,
  // so login attempts can't be used to enumerate registered accounts.
  const genericError = () => jsonError('Invalid email/mobile or password.', 401);

  if (!user) return genericError();

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return genericError();

  const token = await createSessionToken({ userId: user.id, role: user.role, email: user.email });
  setSessionCookie(token);

  return NextResponse.json({
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
  });
}
