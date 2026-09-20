import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { bookId: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ progress: null });

  const progress = await prisma.readingHistory.findUnique({
    where: { userId_bookId: { userId: session.userId, bookId: params.bookId } },
  });

  return NextResponse.json({ progress });
}
