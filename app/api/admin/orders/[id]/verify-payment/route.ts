import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, jsonError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const order = await prisma.order.findUnique({ where: { id: params.id }, include: { payment: true, items: true } });
  if (!order || !order.payment) return jsonError('Order not found.', 404);
  if (order.payment.status !== 'PAYMENT_PENDING') return jsonError('This payment has already been processed.', 409);

  try {
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Re-check stock at verification time and decrement it now — inventory only ever
      // changes on a verified payment, per spec section 23.
      for (const item of order.items) {
        const book = await tx.book.findUnique({ where: { id: item.bookId } });
        if (!book || book.stockQuantity < item.quantity) {
          throw new Error(`Insufficient stock for "${item.titleSnapshot}".`);
        }
      }
      for (const item of order.items) {
        await tx.book.update({ where: { id: item.bookId }, data: { stockQuantity: { decrement: item.quantity } } });
      }

      await tx.payment.update({ where: { id: order.payment!.id }, data: { status: 'PAYMENT_VERIFIED' } });
      const result = await tx.order.update({
        where: { id: order.id },
        data: { paymentStatus: 'PAYMENT_VERIFIED', orderStatus: 'CONFIRMED' },
      });

      await tx.auditLog.create({
        data: {
          adminId: auth.session.userId,
          action: 'PAYMENT_VERIFIED',
          entityType: 'Order',
          entityId: order.id,
          previousValue: 'PAYMENT_PENDING',
          newValue: 'PAYMENT_VERIFIED',
        },
      });

      return result;
    });

    return NextResponse.json({ order: updatedOrder });
  } catch (err) {
    return jsonError(err instanceof Error ? err.message : 'Could not verify payment.', 409);
  }
}
