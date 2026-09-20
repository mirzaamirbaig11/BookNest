import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { jsonError } from '@/lib/api-helpers';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const book = await prisma.book.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { category: true, subcategory: true },
  });
  if (!book) return jsonError('Book not found.', 404);
  return NextResponse.json({ book });
}
