import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { jsonError } from '@/lib/api-helpers';
import { buildUpiUri, generateUpiQrDataUrl } from '@/lib/upi';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return jsonError('Please log in to continue.', 401);

  const order = await prisma.order.findFirst({
    where: {
      OR: [{ id: params.id }, { orderNumber: params.id }],
      ...(session.role === 'ADMIN' ? {} : { userId: session.userId }),
    },
    include: { items: { include: { book: true } }, payment: true, address: true },
  });

  if (!order) return jsonError('Order not found.', 404);

  let qrDataUrl: string | null = null;
  if (order.payment && order.payment.status === 'PAYMENT_PENDING') {
    const upiUri = buildUpiUri({ amount: Number(order.payment.amount), orderNumber: order.orderNumber, upiId: order.payment.upiId });
    qrDataUrl = await generateUpiQrDataUrl(upiUri);
  }

  return NextResponse.json({ order, qrDataUrl });
}
