import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_PDF_TYPE = 'application/pdf';
const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB
const MAX_PDF_BYTES = 100 * 1024 * 1024; // 100MB

export class FileValidationError extends Error {}

function safeExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  return ext.replace(/[^a-z0-9.]/g, '');
}

/**
 * Saves an uploaded cover image or PDF.
 *
 * STORAGE_MODE=local (default): writes to /public/uploads — fine for a single-server deploy
 * or local development, and requires no extra credentials.
 *
 * STORAGE_MODE=s3: wire this function up to your S3-compatible SDK (AWS S3, Cloudflare R2,
 * Backblaze B2, etc.) using STORAGE_URL / STORAGE_BUCKET / STORAGE_ACCESS_KEY / STORAGE_SECRET_KEY
 * from the environment. The function's contract (return a public URL string) stays the same,
 * so nothing else in the app needs to change when you switch modes.
 */
export async function saveUploadedFile(
  file: File,
  kind: 'cover' | 'pdf'
): Promise<{ url: string; sizeBytes: number }> {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (kind === 'cover') {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      throw new FileValidationError('Cover image must be JPEG, PNG or WebP.');
    }
    if (buffer.byteLength > MAX_IMAGE_BYTES) {
      throw new FileValidationError('Cover image must be under 5MB.');
    }
  } else {
    if (file.type !== ALLOWED_PDF_TYPE) {
      throw new FileValidationError('Book file must be a PDF.');
    }
    if (buffer.byteLength > MAX_PDF_BYTES) {
      throw new FileValidationError('PDF must be under 100MB.');
    }
  }

  const storageMode = process.env.STORAGE_MODE ?? 'local';
  const filename = `${crypto.randomUUID()}${safeExt(file.name)}`;
  const subdir = kind === 'cover' ? 'covers' : 'pdfs';

  if (storageMode === 's3') {
    // TODO: integrate your S3-compatible SDK here using STORAGE_URL / STORAGE_BUCKET /
    // STORAGE_ACCESS_KEY / STORAGE_SECRET_KEY, then return the resulting public/CDN URL.
    throw new Error(
      'STORAGE_MODE=s3 is selected but no S3 client is wired up yet. See lib/storage.ts.'
    );
  }

  if (kind === 'cover') {
    // Covers are not sensitive — serve them directly as static files.
    const dir = path.join(process.cwd(), 'public', 'uploads', 'covers');
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
    return { url: `/uploads/covers/${filename}`, sizeBytes: buffer.byteLength };
  }

  // PDFs live OUTSIDE /public so they can never be fetched by guessing a static URL.
  // The only way to read one is through app/api/books/[id]/pdf/route.ts, which checks
  // that the book is published + reading-enabled before streaming any bytes.
  const dir = path.join(process.cwd(), 'private-storage', 'pdfs');
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  // We store just the filename in the DB (via the returned "url"); the API route resolves it.
  return { url: filename, sizeBytes: buffer.byteLength };
}

export function resolvePdfPath(filename: string): string {
  // Reject anything that isn't a bare filename to rule out path traversal.
  const safe = path.basename(filename);
  return path.join(process.cwd(), 'private-storage', 'pdfs', safe);
}
