import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError } from '@/lib/api-helpers';
import { addressSchema } from '@/lib/validation';

export async function GET() {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const addresses = await prisma.address.findMany({
    where: { userId: auth.session.userId },
    orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
  });
  return NextResponse.json({ addresses });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const parsed = addressSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? 'Invalid address.', 422);

  if (body.isDefault) {
    await prisma.address.updateMany({ where: { userId: auth.session.userId }, data: { isDefault: false } });
  }

  const address = await prisma.address.create({
    data: { ...parsed.data, userId: auth.session.userId, isDefault: Boolean(body.isDefault) },
  });

  return NextResponse.json({ address });
}
