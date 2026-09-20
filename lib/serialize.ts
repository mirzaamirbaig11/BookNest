import { BookCardData } from '@/components/BookCard';

type BookWithCategory = {
  id: string;
  slug: string;
  title: string;
  author: string;
  coverImageUrl: string | null;
  category?: { name: string } | null;
  ratingAverage: unknown;
  ratingCount: number;
  originalPrice: unknown;
  sellingPrice: unknown;
  discountPercent: number;
  stockQuantity: number;
  readingEnabled: boolean;
  storeEnabled: boolean;
};

export function toBookCard(book: BookWithCategory): BookCardData {
  return {
    id: book.id,
    slug: book.slug,
    title: book.title,
    author: book.author,
    coverImageUrl: book.coverImageUrl,
    categoryName: book.category?.name,
    ratingAverage: Number(book.ratingAverage),
    ratingCount: book.ratingCount,
    originalPrice: Number(book.originalPrice),
    sellingPrice: Number(book.sellingPrice),
    discountPercent: book.discountPercent,
    stockQuantity: book.stockQuantity,
    readingEnabled: book.readingEnabled,
    storeEnabled: book.storeEnabled,
  };
}
