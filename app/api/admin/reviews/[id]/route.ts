import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, jsonError } from '@/lib/api-helpers';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (typeof body?.hidden !== 'boolean') return jsonError('hidden (boolean) is required.');

  const review = await prisma.review.update({ where: { id: params.id }, data: { hidden: body.hidden } });

  const agg = await prisma.review.aggregate({
    where: { bookId: review.bookId, hidden: false },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.book.update({ where: { id: review.bookId }, data: { ratingAverage: agg._avg.rating ?? 0, ratingCount: agg._count.rating } });

  return NextResponse.json({ review });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const review = await prisma.review.findUnique({ where: { id: params.id } });
  if (!review) return jsonError('Review not found.', 404);

  await prisma.review.delete({ where: { id: params.id } });

  const agg = await prisma.review.aggregate({
    where: { bookId: review.bookId, hidden: false },
    _avg: { rating: true },
    _count: { rating: true },
  });
  await prisma.book.update({ where: { id: review.bookId }, data: { ratingAverage: agg._avg.rating ?? 0, ratingCount: agg._count.rating } });

  return NextResponse.json({ ok: true });
}
