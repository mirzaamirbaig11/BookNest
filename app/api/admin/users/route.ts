import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const q = request.nextUrl.searchParams.get('q')?.trim();

  const users = await prisma.user.findMany({
    where: q
      ? { OR: [{ fullName: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }, { mobile: { contains: q, mode: 'insensitive' } }] }
      : undefined,
    select: {
      id: true, fullName: true, email: true, mobile: true, role: true, createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({ users });
}
