import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import BookCard from '@/components/BookCard';
import { toBookCard } from '@/lib/serialize';

async function getFavoriteIds(userId: string | null) {
  if (!userId) return new Set<string>();
  const favorites = await prisma.favorite.findMany({ where: { userId }, select: { bookId: true } });
  return new Set(favorites.map((f) => f.bookId));
}

function Section({
  title,
  href,
  books,
  favoriteIds,
}: {
  title: string;
  href: string;
  books: ReturnType<typeof toBookCard>[];
  favoriteIds: Set<string>;
}) {
  if (books.length === 0) return null;
  return (
    <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <Link href={href} className="text-sm font-medium text-brand-600 hover:underline">
          View all →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} isFavorited={favoriteIds.has(book.id)} />
        ))}
      </div>
    </section>
  );
}

export default async function HomePage() {
  const session = await getSession();
  const baseWhere = { published: true, OR: [{ readingEnabled: true }, { storeEnabled: true }] };

  const [featured, popular, newArrivals, bestSellers, recentlyAdded, categories, favoriteIds] = await Promise.all([
    prisma.book.findMany({ where: { ...baseWhere, featured: true }, include: { category: true }, take: 6, orderBy: { createdAt: 'desc' } }),
    prisma.book.findMany({ where: baseWhere, include: { category: true }, take: 6, orderBy: { ratingCount: 'desc' } }),
    prisma.book.findMany({ where: baseWhere, include: { category: true }, take: 6, orderBy: { createdAt: 'desc' } }),
    prisma.book.findMany({ where: { ...baseWhere, storeEnabled: true }, include: { category: true }, take: 6, orderBy: { ratingAverage: 'desc' } }),
    prisma.book.findMany({ where: baseWhere, include: { category: true }, take: 6, orderBy: { createdAt: 'desc' }, skip: 6 }),
    prisma.category.findMany({ take: 8, orderBy: { name: 'asc' } }),
    getFavoriteIds(session?.userId ?? null),
  ]);

  return (
    <div>
      <section className="bg-gradient-to-br from-brand-700 to-brand-900 py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">Discover. Read. Learn. Buy.</h1>
          <p className="mx-auto mt-4 max-w-xl text-brand-100">
            Explore books for learning, entertainment and everyday knowledge.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/read" className="btn-primary bg-accent-500 hover:bg-accent-600">
              Start Reading
            </Link>
            <Link href="/store" className="rounded-lg border border-white px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10">
              Explore Store
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h2 className="mb-4 text-xl font-bold text-gray-900">Browse Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/store?category=${cat.slug}`}
              className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-brand-500 hover:text-brand-600"
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </section>

      <Section title="Featured Books" href="/store?filter=featured" books={featured.map(toBookCard)} favoriteIds={favoriteIds} />
      <Section title="Popular Books" href="/store?sort=popular" books={popular.map(toBookCard)} favoriteIds={favoriteIds} />
      <Section title="New Arrivals" href="/store?sort=newest" books={newArrivals.map(toBookCard)} favoriteIds={favoriteIds} />
      <Section title="Best Sellers" href="/store?sort=top-rated" books={bestSellers.map(toBookCard)} favoriteIds={favoriteIds} />
      <Section title="Recently Added Books" href="/store?sort=newest" books={recentlyAdded.map(toBookCard)} favoriteIds={favoriteIds} />
    </div>
  );
}
