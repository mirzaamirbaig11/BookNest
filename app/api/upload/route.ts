import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { saveUploadedFile, FileValidationError } from '@/lib/storage';
import { jsonError } from '@/lib/api-helpers';

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return jsonError('Please log in to continue.', 401);

  const formData = await request.formData().catch(() => null);
  const file = formData?.get('file');
  const purpose = formData?.get('purpose');

  if (!(file instanceof File)) return jsonError('No file was uploaded.');

  if (purpose === 'profile-picture') {
    try {
      const { url } = await saveUploadedFile(file, 'cover');
      await prisma.user.update({ where: { id: session.userId }, data: { profilePictureUrl: url } });
      return NextResponse.json({ url });
    } catch (err) {
      if (err instanceof FileValidationError) return jsonError(err.message);
      throw err;
    }
  }

  if (purpose === 'book-cover' || purpose === 'book-pdf') {
    if (session.role !== 'ADMIN') return jsonError('Admin access required.', 403);
    try {
      const result = await saveUploadedFile(file, purpose === 'book-cover' ? 'cover' : 'pdf');
      return NextResponse.json(result);
    } catch (err) {
      if (err instanceof FileValidationError) return jsonError(err.message);
      throw err;
    }
  }

  return jsonError('Unknown upload purpose.');
}
