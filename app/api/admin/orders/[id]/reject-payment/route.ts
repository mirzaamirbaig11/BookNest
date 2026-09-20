import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, jsonError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { payment: true } });
  if (!order || !order.payment) return jsonError('Order not found.', 404);
  if (order.payment.status !== 'PAYMENT_PENDING') return jsonError('This payment has already been processed.', 409);

  await prisma.payment.update({ where: { id: order.payment.id }, data: { status: 'PAYMENT_REJECTED' } });
  const updatedOrder = await prisma.order.update({
    where: { id: order.id },
    data: { paymentStatus: 'PAYMENT_REJECTED', orderStatus: 'CANCELLED' },
  });

  await prisma.auditLog.create({
    data: {
      adminId: auth.session.userId,
      action: 'PAYMENT_REJECTED',
      entityType: 'Order',
      entityId: order.id,
      previousValue: 'PAYMENT_PENDING',
      newValue: 'PAYMENT_REJECTED',
    },
  });

  return NextResponse.json({ order: updatedOrder });
}
