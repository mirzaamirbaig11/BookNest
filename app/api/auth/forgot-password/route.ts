import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/validation';
import { sendPasswordResetEmail } from '@/lib/mail';
import { jsonError, rateLimit } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`forgot:${ip}`, 5, 60_000)) {
    return jsonError('Too many requests. Please try again in a minute.', 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input.', 422);

  const { email } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  // Always return success, whether or not the account exists, so this endpoint
  // can't be used to check which emails are registered.
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: token, resetPasswordExpiresAt: expiresAt },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
    const resetUrl = `${baseUrl}/reset-password?token=${token}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  return NextResponse.json({
    message: 'If an account exists for that email, a reset link has been sent.',
  });
}
