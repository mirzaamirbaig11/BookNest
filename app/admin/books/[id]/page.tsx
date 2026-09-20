'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BookForm, { BookFormValues } from '@/components/admin/BookForm';

export default function EditBookPage() {
  const { id } = useParams<{ id: string }>();
  const [values, setValues] = useState<Partial<BookFormValues> | null>(null);

  useEffect(() => {
    fetch(`/api/admin/books/${id}`)
      .then((r) => r.json())
      .then((data) => {
        const b = data.book;
        if (!b) return;
        setValues({
          title: b.title,
          author: b.author,
          description: b.description,
          categoryId: b.categoryId,
          subcategoryId: b.subcategoryId ?? '',
          publisher: b.publisher ?? '',
          isbn: b.isbn ?? '',
          language: b.language,
          pages: b.pages?.toString() ?? '',
          publicationYear: b.publicationYear?.toString() ?? '',
          type: b.type,
          originalPrice: String(b.originalPrice),
          sellingPrice: String(b.sellingPrice),
          discountPercent: String(b.discountPercent),
          stockQuantity: String(b.stockQuantity),
          featured: b.featured,
          published: b.published,
          readingEnabled: b.readingEnabled,
          storeEnabled: b.storeEnabled,
          downloadEnabled: b.downloadEnabled,
          coverImageUrl: b.coverImageUrl ?? '',
          pdfFileUrl: b.pdfFileUrl ?? '',
        });
      });
  }, [id]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Book</h1>
      {values ? <BookForm bookId={id} initialValues={values} /> : <p className="text-gray-500">Loading…</p>}
    </div>
  );
}
