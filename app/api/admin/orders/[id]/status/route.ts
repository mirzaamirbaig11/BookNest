import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, jsonError } from '@/lib/api-helpers';

const VALID_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (!VALID_STATUSES.includes(body?.orderStatus)) return jsonError('Invalid order status.');

  const existing = await prisma.order.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError('Order not found.', 404);

  const order = await prisma.order.update({ where: { id: params.id }, data: { orderStatus: body.orderStatus } });

  await prisma.auditLog.create({
    data: {
      adminId: auth.session.userId,
      action: 'ORDER_STATUS_CHANGE',
      entityType: 'Order',
      entityId: order.id,
      previousValue: existing.orderStatus,
      newValue: order.orderStatus,
    },
  });

  return NextResponse.json({ order });
}
