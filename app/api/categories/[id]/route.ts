import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, jsonError } from '@/lib/api-helpers';
import { slugify } from '@/lib/validation';

export const dynamic = 'force-dynamic';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body?.name) return jsonError('Category name is required.');

  const category = await prisma.category.update({
    where: { id: params.id },
    data: { name: body.name.trim(), slug: slugify(body.name) },
  });
  return NextResponse.json({ category });
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const booksUsingCategory = await prisma.book.count({ where: { categoryId: params.id } });
  if (booksUsingCategory > 0) {
    return jsonError('Cannot delete a category that still has books. Reassign or delete those books first.', 409);
  }

  await prisma.category.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
