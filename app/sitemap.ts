import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  const books = await prisma.book.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  const staticRoutes = ['', '/read', '/store', '/contact', '/login', '/register'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  const bookRoutes = books.map((book) => ({
    url: `${baseUrl}/book/${book.slug}`,
    lastModified: book.updatedAt,
  }));

  return [...staticRoutes, ...bookRoutes];
}
