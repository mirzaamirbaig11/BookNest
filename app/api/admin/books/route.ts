import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, jsonError } from '@/lib/api-helpers';
import { bookSchema, slugify } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const q = request.nextUrl.searchParams.get('q')?.trim();

  const books = await prisma.book.findMany({
    where: q
      ? { OR: [{ title: { contains: q, mode: 'insensitive' } }, { author: { contains: q, mode: 'insensitive' } }] }
      : undefined,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 200,
  });

  return NextResponse.json({ books });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const parsed = bookSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? 'Invalid book data.', 422);

  const data = parsed.data;

  if (data.sellingPrice > data.originalPrice) {
    return jsonError('Selling price cannot be higher than the original price.');
  }

  let slug = slugify(data.title);
  const existingSlug = await prisma.book.findUnique({ where: { slug } });
  if (existingSlug) slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;

  const book = await prisma.book.create({
    data: {
      title: data.title,
      slug,
      author: data.author,
      description: data.description,
      categoryId: data.categoryId,
      subcategoryId: data.subcategoryId || null,
      publisher: data.publisher || null,
      isbn: data.isbn || null,
      language: data.language,
      pages: data.pages ?? null,
      publicationYear: data.publicationYear ?? null,
      type: data.type,
      originalPrice: data.originalPrice,
      sellingPrice: data.sellingPrice,
      discountPercent: data.discountPercent,
      stockQuantity: data.stockQuantity,
      featured: data.featured,
      published: data.published,
      readingEnabled: data.readingEnabled,
      storeEnabled: data.storeEnabled,
      downloadEnabled: data.downloadEnabled,
      coverImageUrl: body.coverImageUrl || null,
      pdfFileUrl: body.pdfFileUrl || null,
      pdfFileSizeBytes: body.pdfFileSizeBytes || null,
    },
  });

  await prisma.auditLog.create({
    data: { adminId: auth.session.userId, action: 'CREATE', entityType: 'Book', entityId: book.id, newValue: book.title },
  });

  return NextResponse.json({ book });
}
