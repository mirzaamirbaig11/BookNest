import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const history = await prisma.readingHistory.findMany({
    where: { userId: auth.session.userId },
    include: { book: { select: { id: true, slug: true, title: true, coverImageUrl: true } } },
    orderBy: { lastReadAt: 'desc' },
    take: 20,
  });

  return NextResponse.json({ history });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const bookId = body?.bookId;
  const lastPage = Number(body?.lastPage);
  const totalPages = body?.totalPages ? Number(body.totalPages) : undefined;

  if (!bookId || !lastPage || lastPage < 1) return jsonError('bookId and a valid lastPage are required.');

  const book = await prisma.book.findUnique({ where: { id: bookId } });
  if (!book || !book.readingEnabled || !book.published) return jsonError('This book is not available to read.', 404);

  const progress = await prisma.readingHistory.upsert({
    where: { userId_bookId: { userId: auth.session.userId, bookId } },
    update: { lastPage, totalPages, lastReadAt: new Date() },
    create: { userId: auth.session.userId, bookId, lastPage, totalPages },
  });

  return NextResponse.json({ progress });
}
