import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, jsonError } from '@/lib/api-helpers';
import { bookSchema } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const book = await prisma.book.findUnique({ where: { id: params.id }, include: { category: true, subcategory: true } });
  if (!book) return jsonError('Book not found.', 404);
  return NextResponse.json({ book });
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const existing = await prisma.book.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError('Book not found.', 404);

  const body = await request.json().catch(() => null);

  // Partial update: admins can toggle a single flag (e.g. publish) without resending the whole form.
  const parsed = bookSchema.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? 'Invalid book data.', 422);
  const data = parsed.data;

  const book = await prisma.book.update({
    where: { id: params.id },
    data: {
      ...data,
      subcategoryId: data.subcategoryId === '' ? null : data.subcategoryId,
      coverImageUrl: body.coverImageUrl ?? undefined,
      pdfFileUrl: body.pdfFileUrl ?? undefined,
      pdfFileSizeBytes: body.pdfFileSizeBytes ?? undefined,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId: auth.session.userId,
      action: 'UPDATE',
      entityType: 'Book',
      entityId: book.id,
      previousValue: JSON.stringify(existing),
      newValue: JSON.stringify(book),
    },
  });

  return NextResponse.json({ book });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const existing = await prisma.book.findUnique({ where: { id: params.id } });
  if (!existing) return jsonError('Book not found.', 404);

  const orderCount = await prisma.orderItem.count({ where: { bookId: params.id } });
  if (orderCount > 0) {
    // Preserve order history integrity — unpublish instead of hard-deleting a book that has orders.
    await prisma.book.update({ where: { id: params.id }, data: { published: false, storeEnabled: false, readingEnabled: false } });
    return NextResponse.json({ ok: true, message: 'Book has existing orders, so it was unpublished instead of deleted.' });
  }

  await prisma.book.delete({ where: { id: params.id } });

  await prisma.auditLog.create({
    data: { adminId: auth.session.userId, action: 'DELETE', entityType: 'Book', entityId: params.id, previousValue: existing.title },
  });

  return NextResponse.json({ ok: true });
}
