'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BuyNowButton({ bookId, inStock }: { bookId: string; inStock: boolean }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function buyNow() {
    setLoading(true);
    try {
      const res = await fetch('/api/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId, quantity: 1 }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (res.ok) router.push('/checkout');
    } finally {
      setLoading(false);
    }
  }

  if (!inStock) return null;

  return (
    <button onClick={buyNow} disabled={loading} className="btn-primary w-full bg-accent-500 hover:bg-accent-600">
      {loading ? 'Please wait…' : 'Buy Now'}
    </button>
  );
}
