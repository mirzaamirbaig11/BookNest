'use client';

import { useEffect, useState } from 'react';

interface Subcategory { id: string; name: string; }
interface Category { id: string; name: string; subcategories: Subcategory[]; }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data.categories ?? []);
  }

  useEffect(() => {
    load();
  }, []);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      return;
    }
    setNewCategory('');
    load();
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category?')) return;
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) setError(data.error);
    load();
  }

  async function addSubcategory(categoryId: string) {
    const name = newSubcategory[categoryId]?.trim();
    if (!name) return;
    await fetch('/api/admin/subcategories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ categoryId, name }),
    });
    setNewSubcategory((prev) => ({ ...prev, [categoryId]: '' }));
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Categories</h1>
      {error && <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <form onSubmit={addCategory} className="card mb-6 flex gap-2 p-4">
        <input className="input-field" placeholder="New category name" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        <button className="btn-primary !text-sm">Add Category</button>
      </form>

      <div className="flex flex-col gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="card p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">{cat.name}</h2>
              <button onClick={() => deleteCategory(cat.id)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
            </div>
            <div className="mb-2 flex flex-wrap gap-2">
              {cat.subcategories.map((s) => (
                <span key={s.id} className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">{s.name}</span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input-field !py-1 text-xs"
                placeholder="New subcategory"
                value={newSubcategory[cat.id] ?? ''}
                onChange={(e) => setNewSubcategory((prev) => ({ ...prev, [cat.id]: e.target.value }))}
              />
              <button onClick={() => addSubcategory(cat.id)} className="btn-secondary !py-1 text-xs">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
