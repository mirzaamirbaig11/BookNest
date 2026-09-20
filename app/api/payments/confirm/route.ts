import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError, rateLimit } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  if (!rateLimit(`confirm-payment:${auth.session.userId}`, 20, 60_000)) {
    return jsonError('Too many attempts. Please wait a moment.', 429);
  }

  const body = await request.json().catch(() => null);
  const orderId = body?.orderId;
  const utr = typeof body?.utr === 'string' ? body.utr.trim() : '';

  if (!orderId || utr.length < 4) {
    return jsonError('Please enter a valid UPI Transaction ID / UTR number.');
  }

  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: auth.session.userId },
    include: { payment: true },
  });
  if (!order || !order.payment) return jsonError('Order not found.', 404);

  if (order.payment.status !== 'PAYMENT_PENDING') {
    return jsonError('This order has already been processed.', 409);
  }

  // IMPORTANT: submitting a UTR only records the buyer's claim for the admin to check.
  // It never changes paymentStatus — that happens only via admin verification.
  const payment = await prisma.payment.update({
    where: { id: order.payment.id },
    data: { utrNumber: utr, utrSubmittedAt: new Date() },
  });

  return NextResponse.json({ payment, message: 'Thanks — your payment is pending verification by our team.' });
}
