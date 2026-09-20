import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError } from '@/lib/api-helpers';
import { reviewSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const bookId = request.nextUrl.searchParams.get('bookId');
  if (!bookId) return jsonError('bookId is required.');

  const reviews = await prisma.review.findMany({
    where: { bookId, hidden: false },
    include: { user: { select: { fullName: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ reviews });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? 'Invalid review.', 422);

  const { bookId, orderId, rating, comment } = parsed.data;

  const eligibleOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: auth.session.userId,
      orderStatus: 'DELIVERED',
      items: { some: { bookId } },
    },
  });
  if (!eligibleOrder) {
    return jsonError('You can only review books from your own delivered orders.', 403);
  }

  const existing = await prisma.review.findUnique({
    where: { userId_bookId_orderId: { userId: auth.session.userId, bookId, orderId } },
  });
  if (existing) return jsonError('You already reviewed this book for this order.', 409);

  const review = await prisma.review.create({
    data: { bookId, orderId, userId: auth.session.userId, rating, comment },
    include: { user: { select: { fullName: true } } },
  });

  const agg = await prisma.review.aggregate({
    where: { bookId, hidden: false },
    _avg: { rating: true },
    _count: { rating: true },
  });

  await prisma.book.update({
    where: { id: bookId },
    data: { ratingAverage: agg._avg.rating ?? 0, ratingCount: agg._count.rating },
  });

  return NextResponse.json({ review });
}
