import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import PdfReader from '@/components/PdfReader';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const book = await prisma.book.findFirst({ where: { OR: [{ id: params.id }, { slug: params.id }] } });
  if (!book) return {};
  return { title: `Reading: ${book.title}` };
}

export default async function ReadBookPage({ params }: { params: { id: string } }) {
  const [book, session] = await Promise.all([
    prisma.book.findFirst({
      where: { OR: [{ id: params.id }, { slug: params.id }], published: true, readingEnabled: true },
    }),
    getSession(),
  ]);

  if (!book || !book.pdfFileUrl) notFound();

  return (
    <div>
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6">
        <h1 className="text-lg font-semibold text-gray-900">{book.title}</h1>
        <p className="text-sm text-gray-500">by {book.author}</p>
      </div>
      <PdfReader bookId={book.id} isLoggedIn={Boolean(session)} />
    </div>
  );
}
