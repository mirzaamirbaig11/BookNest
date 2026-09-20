import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import BookCard from '@/components/BookCard';
import EmptyState from '@/components/EmptyState';
import SearchBox from '@/components/SearchBox';
import AutoSubmitSelect from '@/components/AutoSubmitSelect';

export const metadata = { title: 'Bookstore' };

const SORT_OPTIONS: Record<string, Prisma.BookOrderByWithRelationInput> = {
  newest: { createdAt: 'desc' },
   'price-low': { sellingPrice: 'asc' },
  'price-high': { sellingPrice: 'desc' },
  popular: { ratingCount: 'desc' },
  'top-rated': { ratingAverage: 'desc' },
};

export default async function StorePage({
  searchParams,
}: {
  searchParams: {
    q?: string;
    category?: string;
    author?: string;
    language?: string;
    minPrice?: string;
    maxPrice?: string;
    rating?: string;
    availability?: string;
    sort?: string;
    filter?: string;
  };
}) {
  const { q, category, author, language, minPrice, maxPrice, rating, availability, sort, filter } = searchParams;

  const where: Prisma.BookWhereInput = {
    published: true,
    storeEnabled: true,
    ...(filter === 'featured' && { featured: true }),
    ...(q && {
      OR: [
        { title: { contains: q, mode: 'insensitive' } },
        { author: { contains: q, mode: 'insensitive' } },
        { isbn: { contains: q, mode: 'insensitive' } },
        { publisher: { contains: q, mode: 'insensitive' } },
      ],
    }),
    ...(category && { category: { slug: category } }),
    ...(author && { author: { contains: author, mode: 'insensitive' } }),
    ...(language && { language }),
    ...((minPrice || maxPrice) && {
      sellingPrice: {
        ...(minPrice && { gte: Number(minPrice) }),
        ...(maxPrice && { lte: Number(maxPrice) }),
      },
    }),
    ...(rating && { ratingAverage: { gte: Number(rating) } }),
    ...(availability === 'in-stock' && { stockQuantity: { gt: 0 } }),
  };

  const [books, categories, session] = await Promise.all([
    prisma.book.findMany({
      where,
      include: { category: true },
      orderBy: SORT_OPTIONS[sort ?? ''] ?? { createdAt: 'desc' },
      take: 48,
    }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    getSession(),
  ]);

  const favoriteIds = session
    ? new Set((await prisma.favorite.findMany({ where: { userId: session.userId }, select: { bookId: true } })).map((f) => f.bookId))
    : new Set<string>();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Bookstore</h1>

      <div className="mb-6 flex flex-col gap-4">
        <SearchBox basePath="/store" placeholder="Search the store…" />
        <form className="flex flex-wrap gap-2" method="get">
          {q && <input type="hidden" name="q" value={q} />}
          <AutoSubmitSelect name="category" defaultValue={category ?? ''} className="input-field !w-auto">
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name}</option>
            ))}
          </AutoSubmitSelect>
          <input name="minPrice" defaultValue={minPrice ?? ''} placeholder="Min ₹" className="input-field !w-24" />
          <input name="maxPrice" defaultValue={maxPrice ?? ''} placeholder="Max ₹" className="input-field !w-24" />
          <AutoSubmitSelect name="rating" defaultValue={rating ?? ''} className="input-field !w-auto">
            <option value="">Any Rating</option>
            <option value="4">4★ &amp; up</option>
            <option value="3">3★ &amp; up</option>
          </AutoSubmitSelect>
          <AutoSubmitSelect name="availability" defaultValue={availability ?? ''} className="input-field !w-auto">
            <option value="">All Availability</option>
            <option value="in-stock">In Stock Only</option>
          </AutoSubmitSelect>
          <AutoSubmitSelect name="sort" defaultValue={sort ?? 'newest'} className="input-field !w-auto">
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="popular">Popular</option>
            <option value="top-rated">Highest Rated</option>
          </AutoSubmitSelect>
          <button type="submit" className="btn-secondary !py-1.5 text-xs">Apply</button>
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
