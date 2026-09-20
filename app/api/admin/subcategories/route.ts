import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin, jsonError } from '@/lib/api-helpers';
import { slugify } from '@/lib/validation';

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body?.categoryId || !body?.name) return jsonError('categoryId and name are required.');

  const slug = slugify(body.name);
  const existing = await prisma.subcategory.findUnique({
    where: { categoryId_slug: { categoryId: body.categoryId, slug } },
  });
  if (existing) return jsonError('This subcategory already exists.', 409);

  const subcategory = await prisma.subcategory.create({
    data: { name: body.name.trim(), slug, categoryId: body.categoryId },
  });

  return NextResponse.json({ subcategory });
}
