import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Lightweight autocomplete/suggestions endpoint used by the search box.
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json({ suggestions: [] });

  const books = await prisma.book.findMany({
    where: {
      published: true,
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { author: { contains: q, mode: 'insensitive' } },
        { isbn: { contains: q, mode: 'insensitive' } },
        { publisher: { contains: q, mode: 'insensitive' } },
      ],
    },
    select: { id: true, slug: true, title: true, author: true, coverImageUrl: true },
    take: 8,
  });

  return NextResponse.json({ suggestions: books });
}
