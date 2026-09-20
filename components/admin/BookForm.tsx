'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
}

export interface BookFormValues {
  title: string;
  author: string;
  description: string;
  categoryId: string;
  subcategoryId: string;
  publisher: string;
  isbn: string;
  language: string;
  pages: string;
  publicationYear: string;
  type: 'READING' | 'PHYSICAL' | 'BOTH';
  originalPrice: string;
  sellingPrice: string;
  discountPercent: string;
  stockQuantity: string;
  featured: boolean;
  published: boolean;
  readingEnabled: boolean;
  storeEnabled: boolean;
  downloadEnabled: boolean;
  coverImageUrl: string;
  pdfFileUrl: string;
}

const EMPTY: BookFormValues = {
  title: '', author: '', description: '', categoryId: '', subcategoryId: '',
  publisher: '', isbn: '', language: 'English', pages: '', publicationYear: '',
  type: 'READING', originalPrice: '', sellingPrice: '', discountPercent: '0', stockQuantity: '0',
  featured: false, published: false, readingEnabled: false, storeEnabled: false, downloadEnabled: false,
  coverImageUrl: '', pdfFileUrl: '',
};

export default function BookForm({
  bookId,
  initialValues,
}: {
  bookId?: string;
  initialValues?: Partial<BookFormValues>;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [values, setValues] = useState<BookFormValues>({ ...EMPTY, ...initialValues });
  const [coverUploading, setCoverUploading] = useState(false);
  const [pdfUploading, setPdfUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then((data) => setCategories(data.categories ?? []));
  }, []);

  function set<K extends keyof BookFormValues>(key: K, value: BookFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  async function uploadFile(file: File, purpose: 'book-cover' | 'book-pdf') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', purpose);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error);
    return data;
  }

  async function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploading(true);
    setError(null);
    try {
      const data = await uploadFile(file, 'book-cover');
      set('coverImageUrl', data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cover upload failed.');
    } finally {
      setCoverUploading(false);
    }
  }

  async function handlePdfChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPdfUploading(true);
    setError(null);
    try {
      const data = await uploadFile(file, 'book-pdf');
      set('pdfFileUrl', data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PDF upload failed.');
    } finally {
      setPdfUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload = { ...values, subcategoryId: values.subcategoryId || null };
      const res = await fetch(bookId ? `/api/admin/books/${bookId}` : '/api/admin/books', {
        method: bookId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Could not save book.');
        return;
      }
      router.push('/admin/books');
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const selectedCategory = categories.find((c) => c.id === values.categoryId);

  return (
    <form onSubmit={handleSubmit} className="card flex flex-col gap-4 p-5">
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
          <input required className="input-field" value={values.title} onChange={(e) => set('title', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Author</label>
          <input required className="input-field" value={values.author} onChange={(e) => set('author', e.target.value)} />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
        <textarea required rows={4} className="input-field" value={values.description} onChange={(e) => set('description', e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
          <select required className="input-field" value={values.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Subcategory</label>
          <select className="input-field" value={values.subcategoryId} onChange={(e) => set('subcategoryId', e.target.value)}>
            <option value="">None</option>
            {selectedCategory?.subcategories.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Publisher</label>
          <input className="input-field" value={values.publisher} onChange={(e) => set('publisher', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">ISBN</label>
          <input className="input-field" value={values.isbn} onChange={(e) => set('isbn', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Language</label>
          <input className="input-field" value={values.language} onChange={(e) => set('language', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Pages</label>
          <input type="number" className="input-field" value={values.pages} onChange={(e) => set('pages', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Publication Year</label>
          <input type="number" className="input-field" value={values.publicationYear} onChange={(e) => set('publicationYear', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Book Type</label>
          <select className="input-field" value={values.type} onChange={(e) => set('type', e.target.value as BookFormValues['type'])}>
            <option value="READING">Reading</option>
            <option value="PHYSICAL">Physical</option>
            <option value="BOTH">Both</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Original Price (₹)</label>
          <input required type="number" step="0.01" className="input-field" value={values.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Selling Price (₹)</label>
          <input required type="number" step="0.01" className="input-field" value={values.sellingPrice} onChange={(e) => set('sellingPrice', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Discount %</label>
          <input type="number" className="input-field" value={values.discountPercent} onChange={(e) => set('discountPercent', e.target.value)} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Stock Quantity</label>
          <input type="number" className="input-field" value={values.stockQuantity} onChange={(e) => set('stockQuantity', e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Cover Image</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleCoverChange} className="text-sm" />
          {coverUploading && <p className="text-xs text-gray-500">Uploading…</p>}
          {values.coverImageUrl && <img src={values.coverImageUrl} alt="Cover preview" className="mt-2 h-24 w-16 rounded object-cover" />}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">PDF File</label>
          <input type="file" accept="application/pdf" onChange={handlePdfChange} className="text-sm" />
          {pdfUploading && <p className="text-xs text-gray-500">Uploading…</p>}
          {values.pdfFileUrl && <p className="mt-2 text-xs text-green-600">PDF uploaded ✓</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        {([
          ['featured', 'Featured'],
          ['published', 'Published'],
          ['readingEnabled', 'Reading Enabled'],
          ['storeEnabled', 'Store Enabled'],
          ['downloadEnabled', 'Download Enabled'],
        ] as const).map(([key, label]) => (
          <label key={key} className="flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" checked={values[key]} onChange={(e) => set(key, e.target.checked)} />
            {label}
          </label>
        ))}
      </div>

      <button type="submit" disabled={saving} className="btn-primary w-fit">
        {saving ? 'Saving…' : bookId ? 'Save Changes' : 'Add Book'}
      </button>
    </form>
  );
}
