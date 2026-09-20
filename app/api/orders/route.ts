import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError, rateLimit } from '@/lib/api-helpers';
import { generateOrderNumber } from '@/lib/order-number';
import { buildPayeeReference } from '@/lib/upi';
import { calculateShipping } from '@/lib/pricing';

export async function GET() {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const orders = await prisma.order.findMany({
    where: { userId: auth.session.userId },
    include: { items: true, payment: true, address: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ orders });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  if (!rateLimit(`checkout:${auth.session.userId}`, 10, 60_000)) {
    return jsonError('Too many checkout attempts. Please wait a moment.', 429);
  }

  const body = await request.json().catch(() => null);
  const addressId = body?.addressId;
  if (!addressId) return jsonError('Please select or add a delivery address.');

  const address = await prisma.address.findFirst({ where: { id: addressId, userId: auth.session.userId } });
  if (!address) return jsonError('Address not found.', 404);

  const cart = await prisma.cart.findUnique({
    where: { userId: auth.session.userId },
    include: { items: { include: { book: true } } },
  });

  if (!cart || cart.items.length === 0) return jsonError('Your cart is empty.', 400);

  // Re-verify current price and stock for every item — never trust anything the client sent.
  for (const item of cart.items) {
    if (!item.book.storeEnabled || !item.book.published) {
      return jsonError(`"${item.book.title}" is no longer available.`, 409);
    }
    if (item.quantity > item.book.stockQuantity) {
      return jsonError(`Only ${item.book.stockQuantity} left of "${item.book.title}".`, 409);
    }
  }

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.book.sellingPrice) * item.quantity, 0);
  const discountAmount = cart.items.reduce(
    (sum, item) => sum + (Number(item.book.originalPrice) - Number(item.book.sellingPrice)) * item.quantity,
    0
  );
  const shippingAmount = calculateShipping(subtotal);
  const totalAmount = subtotal + shippingAmount;

  const orderNumber = generateOrderNumber();
  const isTestOrder = (process.env.PAYMENT_MODE ?? 'test') !== 'production';
  const upiId = process.env.UPI_ID ?? '';

  const order = await prisma.order.create({
    data: {
      orderNumber,
      userId: auth.session.userId,
      addressId: address.id,
      subtotal,
      discountAmount,
      shippingAmount,
      totalAmount,
      isTestOrder,
      items: {
        create: cart.items.map((item) => ({
          bookId: item.bookId,
          titleSnapshot: item.book.title,
          priceSnapshot: item.book.sellingPrice,
          quantity: item.quantity,
        })),
      },
      payment: {
        create: {
          method: 'UPI',
          upiId,
          amount: totalAmount,
          upiPayeeReference: buildPayeeReference(orderNumber),
          isTestPayment: isTestOrder,
        },
      },
    },
    include: { items: true, payment: true },
  });

  // Cart is cleared only after the order is successfully created.
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return NextResponse.json({ order });
}
