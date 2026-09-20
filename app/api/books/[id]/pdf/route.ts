import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { prisma } from '@/lib/prisma';
import { resolvePdfPath } from '@/lib/storage';
import { jsonError } from '@/lib/api-helpers';

// NOTE: browser-based PDF viewing is not real DRM. A determined user can always capture
// content that renders in their browser. This endpoint's job is only to keep the file from
// being reachable via a guessable public URL and to stop a plain "download" link when
// Download Enabled is off — it is not a guarantee against copying.
export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const book = await prisma.book.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }], published: true, readingEnabled: true },
  });

  if (!book || !book.pdfFileUrl) return jsonError('This book is not available to read.', 404);

  try {
    const filePath = resolvePdfPath(book.pdfFileUrl);
    const buffer = await readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        // "inline" — opens in the embedded reader rather than triggering a download.
        'Content-Disposition': 'inline; filename="book.pdf"',
        'Cache-Control': 'private, no-store',
      },
    });
  } catch {
    return jsonError('The book file could not be loaded.', 500);
  }
}
