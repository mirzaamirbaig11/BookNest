import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError } from '@/lib/api-helpers';
import { z } from 'zod';

const updateSchema = z.object({
  fullName: z.string().trim().min(2).max(100).optional(),
  email: z.string().trim().toLowerCase().email().optional(),
  mobile: z.string().trim().regex(/^(\+91)?[6-9]\d{9}$/).optional(),
});

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input.', 422);

  if (parsed.data.email || parsed.data.mobile) {
    const conflict = await prisma.user.findFirst({
      where: {
        id: { not: auth.session.userId },
        OR: [
          ...(parsed.data.email ? [{ email: parsed.data.email }] : []),
          ...(parsed.data.mobile ? [{ mobile: parsed.data.mobile }] : []),
        ],
      },
    });
    if (conflict) return jsonError('That email or mobile number is already in use.', 409);
  }

  const user = await prisma.user.update({
    where: { id: auth.session.userId },
    data: parsed.data,
    select: { id: true, fullName: true, email: true, mobile: true, profilePictureUrl: true, role: true },
  });

  return NextResponse.json({ user });
}
