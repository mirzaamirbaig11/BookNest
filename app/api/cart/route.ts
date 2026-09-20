import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser } from '@/lib/api-helpers';

export async function GET() {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const cart = await prisma.cart.findUnique({
    where: { userId: auth.session.userId },
    include: { items: { include: { book: true }, orderBy: { createdAt: 'asc' } } },
  });

  if (!cart) return NextResponse.json({ items: [], subtotal: 0 });

  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.book.sellingPrice) * item.quantity, 0);

  return NextResponse.json({
    items: cart.items.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      book: {
        id: item.book.id,
        slug: item.book.slug,
        title: item.book.title,
        coverImageUrl: item.book.coverImageUrl,
        sellingPrice: Number(item.book.sellingPrice),
        originalPrice: Number(item.book.originalPrice),
        stockQuantity: item.book.stockQuantity,
      },
    })),
    subtotal,
  });
}
