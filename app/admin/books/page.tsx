'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Book {
  id: string;
  title: string;
  author: string;
  category: { name: string };
  sellingPrice: string;
  stockQuantity: number;
  published: boolean;
  featured: boolean;
  readingEnabled: boolean;
  storeEnabled: boolean;
}

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch(`/api/admin/books?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setBooks(data.books ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function toggle(book: Book, field: keyof Book) {
    await fetch(`/api/admin/books/${book.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !book[field] }),
    });
    load();
  }

  async function remove(book: Book) {
    if (!confirm(`Delete "${book.title}"?`)) return;
    await fetch(`/api/admin/books/${book.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Books</h1>
        <Link href="/admin/books/new" className="btn-primary !text-sm">+ Add Book</Link>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); load(); }} className="mb-4 flex gap-2">
        <input className="input-field" placeholder="Search by title or author…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn-secondary !text-sm">Search</button>
      </form>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Reading</th>
              <th className="px-4 py-3">Store</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-gray-400">Loading…</td></tr>
            ) : books.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-6 text-center text-gray-400">No books found.</td></tr>
            ) : (
              books.map((book) => (
                <tr key={book.id} className="border-b border-gray-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{book.title}</p>
                    <p className="text-xs text-gray-500">{book.author}</p>
                  </td>
                  <td className="px-4 py-3">{book.category.name}</td>
                  <td className="px-4 py-3">₹{Number(book.sellingPrice).toFixed(2)}</td>
                  <td className="px-4 py-3">{book.stockQuantity}</td>
                  {(['published', 'featured', 'readingEnabled', 'storeEnabled'] as const).map((field) => (
                    <td key={field} className="px-4 py-3">
                      <button onClick={() => toggle(book, field)} className={`rounded-full px-2 py-1 text-xs font-medium ${book[field] ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {book[field] ? 'On' : 'Off'}
                      </button>
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link href={`/admin/books/${book.id}`} className="text-xs font-medium text-brand-600 hover:underline">Edit</Link>
                      <button onClick={() => remove(book)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
