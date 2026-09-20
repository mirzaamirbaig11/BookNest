import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/validation';
import { hashPassword } from '@/lib/auth';
import { jsonError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input.', 422);

  const { token, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { resetPasswordToken: token } });

  if (!user || !user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
    return jsonError('This reset link is invalid or has expired. Please request a new one.', 400);
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash, resetPasswordToken: null, resetPasswordExpiresAt: null },
  });

  return NextResponse.json({ message: 'Password updated. You can now log in.' });
}
