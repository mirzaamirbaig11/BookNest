import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import StarRating from '@/components/StarRating';
import FavoriteButton from '@/components/FavoriteButton';
import AddToCartButton from '@/components/AddToCartButton';
import BuyNowButton from '@/components/BuyNowButton';
import ReviewSection from '@/components/ReviewSection';

export async function generateMetadata({ params }: { params: { id: string } }) {
  const book = await prisma.book.findFirst({ where: { OR: [{ slug: params.id }, { id: params.id }] } });
  if (!book) return {};
  return {
    title: book.title,
    description: book.description.slice(0, 155),
    openGraph: { title: book.title, description: book.description.slice(0, 155), images: book.coverImageUrl ? [book.coverImageUrl] : [] },
  };
}

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  const book = await prisma.book.findFirst({
    where: { OR: [{ slug: params.id }, { id: params.id }], published: true },
    include: { category: true, subcategory: true },
  });

  if (!book) notFound();

  const [isFavorited, eligibleOrder] = await Promise.all([
    session
      ? prisma.favorite.findUnique({ where: { userId_bookId: { userId: session.userId, bookId: book.id } } }).then(Boolean)
      : false,
    session
      ? prisma.order.findFirst({
          where: {
            userId: session.userId,
            orderStatus: 'DELIVERED',
            items: { some: { bookId: book.id } },
            reviews: { none: { bookId: book.id, userId: session.userId } },
          },
          select: { id: true },
        })
      : null,
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[320px_1fr]">
        <div>
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100 shadow-sm">
            {book.coverImageUrl ? (
              <Image src={book.coverImageUrl} alt={book.title} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-gray-300">📘</div>
            )}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-xs font-medium uppercase tracking-wide text-brand-500">{book.category.name}</span>
              <h1 className="mt-1 text-2xl font-bold text-gray-900 sm:text-3xl">{book.title}</h1>
              <p className="mt-1 text-gray-600">by {book.author}</p>
              <div className="mt-2">
                <StarRating value={Number(book.ratingAverage)} count={book.ratingCount} />
              </div>
            </div>
            <FavoriteButton bookId={book.id} initiallyFavorited={Boolean(isFavorited)} />
          </div>

          {book.storeEnabled && (
            <div className="mt-4 flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900">₹{Number(book.sellingPrice).toFixed(2)}</span>
              {Number(book.originalPrice) > Number(book.sellingPrice) && (
                <>
                  <span className="text-lg text-gray-400 line-through">₹{Number(book.originalPrice).toFixed(2)}</span>
                  <span className="text-sm font-semibold text-accent-600">{book.discountPercent}% off</span>
                </>
              )}
            </div>
          )}

          {book.storeEnabled && (
            <p className="mt-1 text-sm">
              {book.stockQuantity > 0 ? (
                <span className="text-green-600">In Stock ({book.stockQuantity} available)</span>
              ) : (
                <span className="text-red-600">Out of Stock</span>
              )}
            </p>
          )}

          <p className="mt-4 whitespace-pre-line text-gray-700">{book.description}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600 sm:grid-cols-3">
            {book.publisher && <><dt className="font-medium text-gray-500">Publisher</dt><dd>{book.publisher}</dd></>}
            {book.isbn && <><dt className="font-medium text-gray-500">ISBN</dt><dd>{book.isbn}</dd></>}
            <dt className="font-medium text-gray-500">Language</dt><dd>{book.language}</dd>
            {book.pages && <><dt className="font-medium text-gray-500">Pages</dt><dd>{book.pages}</dd></>}
            {book.publicationYear && <><dt className="font-medium text-gray-500">Published</dt><dd>{book.publicationYear}</dd></>}
          </dl>

          <div className="mt-6 flex flex-col gap-3 sm:max-w-xs">
            {book.readingEnabled && (
              <Link href={`/read/${book.id}`} className="btn-secondary w-full">
                Read Online
              </Link>
            )}
            {book.storeEnabled && (
              <>
                <AddToCartButton bookId={book.id} inStock={book.stockQuantity > 0} />
                <BuyNowButton bookId={book.id} inStock={book.stockQuantity > 0} />
              </>
            )}
          </div>
        </div>
      </div>

      <ReviewSection bookId={book.id} eligibleOrderId={eligibleOrder?.id ?? null} />
    </div>
  );
}
