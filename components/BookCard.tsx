import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';
import AddToCartButton from './AddToCartButton';
import StarRating from './StarRating';

export interface BookCardData {
  id: string;
  slug: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  categoryName?: string;
  ratingAverage: number;
  ratingCount: number;
  originalPrice: number;
  sellingPrice: number;
  discountPercent: number;
  stockQuantity: number;
  readingEnabled: boolean;
  storeEnabled: boolean;
}

export default function BookCard({
  book,
  isFavorited = false,
  showFavorite = true,
}: {
  book: BookCardData;
  isFavorited?: boolean;
  showFavorite?: boolean;
}) {
  return (
    <div className="card group relative flex flex-col overflow-hidden transition hover:shadow-md">
      <Link href={`/book/${book.slug}`} className="relative block aspect-[3/4] bg-gray-100">
        {book.coverImageUrl ? (
          <Image
            src={book.coverImageUrl}
            alt={book.title}
            fill
            sizes="(max-width: 768px) 50vw, 220px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-gray-300">📘</div>
        )}
        {book.discountPercent > 0 && (
          <span className="absolute left-2 top-2 rounded bg-accent-500 px-2 py-0.5 text-xs font-semibold text-white">
            {book.discountPercent}% OFF
          </span>
        )}
      </Link>

      {showFavorite && (
        <div className="absolute right-2 top-2">
          <FavoriteButton bookId={book.id} initiallyFavorited={isFavorited} />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-1 p-3">
        {book.categoryName && <span className="text-xs uppercase tracking-wide text-brand-500">{book.categoryName}</span>}
        <Link href={`/book/${book.slug}`} className="line-clamp-2 text-sm font-semibold text-gray-900 hover:text-brand-600">
          {book.title}
        </Link>
        <span className="text-xs text-gray-500">{book.author}</span>
        <StarRating value={book.ratingAverage} count={book.ratingCount} />

        {book.storeEnabled && (
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-base font-bold text-gray-900">₹{book.sellingPrice}</span>
            {book.originalPrice > book.sellingPrice && (
              <span className="text-xs text-gray-400 line-through">₹{book.originalPrice}</span>
            )}
          </div>
        )}

        <div className="mt-2 flex flex-col gap-2">
          {book.readingEnabled && (
            <Link href={`/read/${book.id}`} className="btn-secondary w-full !py-1.5 text-xs">
              Read Online
            </Link>
          )}
          {book.storeEnabled && (
            <AddToCartButton bookId={book.id} inStock={book.stockQuantity > 0} label="Add to Cart" />
          )}
        </div>
      </div>
    </div>
  );
}
