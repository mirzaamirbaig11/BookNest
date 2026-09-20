import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError } from '@/lib/api-helpers';

async function ownedItem(itemId: string, userId: string) {
  return prisma.cartItem.findFirst({
    where: { id: itemId, cart: { userId } },
    include: { book: true },
  });
}

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const quantity = Number(body?.quantity);
  if (!quantity || quantity < 1) return jsonError('quantity must be at least 1.');

  const item = await ownedItem(params.id, auth.session.userId);
  if (!item) return jsonError('Cart item not found.', 404);

  if (quantity > item.book.stockQuantity) {
    return jsonError(`Only ${item.book.stockQuantity} in stock.`, 409);
  }

  const updated = await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } });
  return NextResponse.json({ item: updated });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const item = await ownedItem(params.id, auth.session.userId);
  if (!item) return jsonError('Cart item not found.', 404);

  await prisma.cartItem.delete({ where: { id: item.id } });
  return NextResponse.json({ ok: true });
}
