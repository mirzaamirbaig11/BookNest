'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AddToCartButton({
  bookId,
  inStock,
  label = 'Add to Cart',
  variant = 'primary',
}: {
  bookId: string;
  inStock: boolean;
  label?: string;
  variant?: 'primary' | 'secondary';
}) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const router = useRouter();

  async function addToCart() {
    setStatus('loading');
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
      if (!res.ok) {
        setStatus('error');
        return;
      }
      setStatus('done');
      router.refresh();
      setTimeout(() => setStatus('idle'), 1500);
    } catch {
      setStatus('error');
    }
  }

  if (!inStock) {
    return (
      <button disabled className="btn-secondary w-full !opacity-50">
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={addToCart}
      disabled={status === 'loading'}
      className={variant === 'primary' ? 'btn-primary w-full' : 'btn-secondary w-full'}
    >
      {status === 'loading' ? 'Adding…' : status === 'done' ? 'Added ✓' : status === 'error' ? 'Try again' : label}
    </button>
  );
}
