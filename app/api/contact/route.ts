import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactSchema } from '@/lib/validation';
import { getSession } from '@/lib/auth';
import { jsonError, rateLimit } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
  if (!rateLimit(`contact:${ip}`, 10, 60_000)) {
    return jsonError('Too many messages sent. Please try again later.', 429);
  }

  const body = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.errors[0]?.message ?? 'Invalid input.', 422);

  const session = await getSession();

  const message = await prisma.contactMessage.create({
    data: { ...parsed.data, userId: session?.userId },
  });

  return NextResponse.json({ message: 'Thanks for reaching out — we will get back to you soon.', id: message.id });
}
