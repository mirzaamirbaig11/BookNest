'use client';

import { useEffect, useState } from 'react';
import StarRating from './StarRating';

interface ReviewData {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { fullName: string };
}

export default function ReviewSection({ bookId, eligibleOrderId }: { bookId: string; eligibleOrderId: string | null }) {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/reviews?bookId=${bookId}`)
      .then((res) => res.json())
      .then((data) => setReviews(data.reviews ?? []));
  }, [bookId]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!eligibleOrderId) return;
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, orderId: eligibleOrderId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Could not submit review.');
        setStatus('error');
        return;
      }
      setReviews((prev) => [data.review, ...prev]);
      setComment('');
      setStatus('idle');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="mt-10">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Reviews</h2>

      {eligibleOrderId && (
        <form onSubmit={submitReview} className="card mb-6 flex flex-col gap-3 p-4">
          <p className="text-sm font-medium text-gray-700">Write a review</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="input-field !w-32">
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>{r} star{r > 1 ? 's' : ''}</option>
            ))}
          </select>
          <textarea required minLength={3} className="input-field" rows={3} placeholder="Share your thoughts…" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button type="submit" disabled={status === 'loading'} className="btn-primary w-fit">
            {status === 'loading' ? 'Submitting…' : 'Submit Review'}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="flex flex-col gap-4">
          {reviews.map((r) => (
            <li key={r.id} className="card p-4">
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">{r.user.fullName}</span>
                <StarRating value={r.rating} />
              </div>
              <p className="text-sm text-gray-700">{r.comment}</p>
              <p className="mt-1 text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
