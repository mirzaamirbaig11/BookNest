import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, jsonError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (typeof body?.read !== 'boolean') return jsonError('read (boolean) is required.');

  const message = await prisma.contactMessage.update({ where: { id: params.id }, data: { read: body.read } });
  return NextResponse.json({ message });
}
