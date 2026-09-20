'use client';

import { useEffect, useState } from 'react';

interface ReviewRow {
  id: string;
  rating: number;
  comment: string;
  hidden: boolean;
  createdAt: string;
  book: { title: string };
  user: { fullName: string; email: string };
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewRow[]>([]);

  async function load() {
    const res = await fetch('/api/admin/reviews');
    const data = await res.json();
    setReviews(data.reviews ?? []);
  }

  useEffect(() => { load(); }, []);

  async function toggleHidden(review: ReviewRow) {
    await fetch(`/api/admin/reviews/${review.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hidden: !review.hidden }),
    });
    load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this review permanently?')) return;
    await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Reviews</h1>
      <div className="flex flex-col gap-3">
        {reviews.length === 0 ? (
          <p className="text-gray-400">No reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{r.book.title}</p>
                  <p className="text-xs text-gray-500">{r.user.fullName} ({r.user.email}) · {'★'.repeat(r.rating)}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => toggleHidden(r)} className="btn-secondary !px-3 !py-1 text-xs">
                    {r.hidden ? 'Unhide' : 'Hide'}
                  </button>
                  <button onClick={() => remove(r.id)} className="text-xs font-medium text-red-600 hover:underline">Delete</button>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
              {r.hidden && <span className="mt-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-500">Hidden</span>}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
