import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const q = request.nextUrl.searchParams.get('q')?.trim();
  const paymentStatus = request.nextUrl.searchParams.get('paymentStatus');
  const orderStatus = request.nextUrl.searchParams.get('orderStatus');

  const orders = await prisma.order.findMany({
    where: {
      ...(paymentStatus ? { paymentStatus: paymentStatus as any } : {}),
      ...(orderStatus ? { orderStatus: orderStatus as any } : {}),
      ...(q
        ? {
            OR: [
              { orderNumber: { contains: q, mode: 'insensitive' } },
              { user: { fullName: { contains: q, mode: 'insensitive' } } },
              { user: { mobile: { contains: q, mode: 'insensitive' } } },
              { payment: { utrNumber: { contains: q, mode: 'insensitive' } } },
            ],
          }
        : {}),
    },
    include: { items: true, payment: true, user: { select: { fullName: true, mobile: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({ orders });
}
