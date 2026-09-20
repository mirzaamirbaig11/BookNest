import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import BookCard from '@/components/BookCard';
import EmptyState from '@/components/EmptyState';
import SearchBox from '@/components/SearchBox';
import AutoSubmitSelect from '@/components/AutoSubmitSelect';

export const metadata = { title: 'Read Online' };

const SORT_OPTIONS: Record<string, Prisma.BookOrderByWithRelationInput> = {
  newest: { createdAt: 'desc' },
  popular: { ratingCount: 'desc' },
};

export default async function ReadPage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string; author?: string; language?: string; sort?: string };
}) {
  const { q, category, author, language, sort } = searchParams;

  const where: Prisma.BookWhereInput = {
    published: true,
    readingEnabled: true,
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { author: { contains: q, mode: 'insensitive' } },
        { isbn: { contains: q, mode: 'insensitive' } },
      ],
    }),
    ...(category && { category: { slug: category } }),
    ...(author && { author: { contains: author, mode: 'insensitive' } }),
    ...(language && { language }),
  };

  const [books, categories, languages, session] = await Promise.all([
    prisma.book.findMany({
      where,
      include: { category: true },
      orderBy: SORT_OPTIONS[sort ?? ''] ?? { createdAt: 'desc' },
      take: 48,
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.book.findMany({ where: { readingEnabled: true }, select: { language: true }, distinct: ['language'] }),
    getSession(),
  ]);

  const favoriteIds = session
    ? new Set((await prisma.favorite.findMany({ where: { userId: session.userId }, select: { bookId: true } })).map((f) => f.bookId))
    : new Set<string>();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Read Online</h1>

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <SearchBox basePath="/read" placeholder="Search reading library…" />
        <form className="flex flex-wrap gap-2" method="get">
          {q && <input type="hidden" name="q" value={q} />}
          <AutoSubmitSelect name="category" defaultValue={category ?? ''} className="input-field !w-auto">
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </AutoSubmitSelect>
          <AutoSubmitSelect name="language" defaultValue={language ?? ''} className="input-field !w-auto">
            <option value="">All Languages</option>
            {languages.map((l) => (
              <option key={l.language} value={l.language}>{l.language}</option>
            ))}
          </AutoSubmitSelect>
          <AutoSubmitSelect name="sort" defaultValue={sort ?? 'newest'} className="input-field !w-auto">
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
          </AutoSubmitSelect>
        </form>
      </div>

      {books.length === 0 ? (
        <EmptyState message="No books found." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {books.map((book) => (
            <BookCard key={book.id} book={{ ...book, ratingAverage: Number(book.ratingAverage), originalPrice: Number(book.originalPrice), sellingPrice: Number(book.sellingPrice), categoryName: book.category.name }} isFavorited={favoriteIds.has(book.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
