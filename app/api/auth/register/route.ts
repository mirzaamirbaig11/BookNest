import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validation';
import { hashPassword, createSessionToken, setSessionCookie } from '@/lib/auth';
import { jsonError, rateLimit } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`register:${ip}`, 10, 60_000)) {
    return jsonError('Too many attempts. Please try again in a minute.', 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input.', 422);
  }

  const { fullName, email, mobile, password } = parsed.data;

  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase();
  if (adminEmail && email === adminEmail) {
    // The admin account is provisioned only by `npm run prisma:seed` from ADMIN_PASSWORD.
    // Public registration must never be able to grant the ADMIN role.
    return jsonError('This email address is reserved.', 409);
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, { mobile }] },
    select: { email: true, mobile: true },
  });

  if (existing) {
    if (existing.email === email) return jsonError('An account with this email already exists.', 409);
    return jsonError('An account with this mobile number already exists.', 409);
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: { fullName, email, mobile, passwordHash, role: 'USER' },
  });

  const token = await createSessionToken({ userId: user.id, role: user.role, email: user.email });
  setSessionCookie(token);

  return NextResponse.json({
    user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
  });
}
