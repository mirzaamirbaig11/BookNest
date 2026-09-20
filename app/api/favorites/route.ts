import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireUser, jsonError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const favorites = await prisma.favorite.findMany({
    where: { userId: auth.session.userId },
    include: { book: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ favorites });
}

export async function POST(request: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body?.bookId) return jsonError('bookId is required.');

  const book = await prisma.book.findUnique({ where: { id: body.bookId } });
  if (!book) return jsonError('Book not found.', 404);

  await prisma.favorite.upsert({
    where: { userId_bookId: { userId: auth.session.userId, bookId: body.bookId } },
    update: {},
    create: { userId: auth.session.userId, bookId: body.bookId },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireUser();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body?.bookId) return jsonError('bookId is required.');

  await prisma.favorite.deleteMany({ where: { userId: auth.session.userId, bookId: body.bookId } });
  return NextResponse.json({ ok: true });
}
