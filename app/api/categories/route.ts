import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/api-helpers';
import { jsonError } from '@/lib/api-helpers';
import { slugify } from '@/lib/validation';

export async function GET() {
  const categories = await prisma.category.findMany({
    include: { subcategories: true },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body?.name || typeof body.name !== 'string') return jsonError('Category name is required.');

  const slug = slugify(body.name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return jsonError('A category with this name already exists.', 409);

  const category = await prisma.category.create({ data: { name: body.name.trim(), slug } });
  return NextResponse.json({ category });
}
