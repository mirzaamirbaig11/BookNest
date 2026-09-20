import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const bookId = body?.bookId;
  const quantity = Math.max(1, Number(body?.quantity) || 1);
  if (!bookId) return jsonError('bookId is required.');

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || !book.storeEnabled || !book.published) return jsonError('This book is not available for purchase.', 404);

  const cart = await prisma.cart.upsert({
    where: { userId: auth.session.userId },
    update: {},
    create: { userId: auth.session.userId },
  });

  const existing = await prisma.cartItem.findUnique({ where: { cartId_bookId: { cartId: cart.id, bookId } } });
  const desiredQuantity = (existing?.quantity ?? 0) + quantity;

  if (desiredQuantity > book.stockQuantity) {
    return jsonError(`Only ${book.stockQuantity} in stock.`, 409);
  }

  const item = await prisma.cartItem.upsert({
    where: { cartId_bookId: { cartId: cart.id, bookId } },
    update: { quantity: desiredQuantity },
    create: { cartId: cart.id, bookId, quantity },
  });

  return NextResponse.json({ item });
}
