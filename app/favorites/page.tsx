import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import BookCard from '@/components/BookCard';
import EmptyState from '@/components/EmptyState';
import { toBookCard } from '@/lib/serialize';

export const metadata = { title: 'My Favorites' };

export default async function FavoritesPage() {
  const session = await getSession();

  const favorites = await prisma.favorite.findMany({
    where: { userId: session!.userId },
    include: { book: { include: { category: true } } },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Favorites</h1>

      {favorites.length === 0 ? (
        <EmptyState message="You haven't favorited any books yet." />
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {favorites.map((f) => (
            <BookCard key={f.id} book={toBookCard(f.book)} isFavorited />
          ))}
        </div>
      )}
    </div>
  );
}
