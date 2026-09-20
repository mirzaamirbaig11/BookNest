'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EmptyState from '@/components/EmptyState';
import { calculateShipping } from '@/lib/pricing';

interface CartItem {
  id: string;
  quantity: number;
  book: {
    id: string;
    slug: string;
    title: string;
    coverImageUrl: string | null;
    sellingPrice: number;
    originalPrice: number;
    stockQuantity: number;
  };
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function load() {
    const res = await fetch('/api/cart');
    if (res.status === 401) {
      router.push('/login?next=/cart');
      return;
    }
    const data = await res.json();
    setItems(data.items);
  }

  useEffect(() => {
    load();
  }, []);

  async function updateQuantity(itemId: string, quantity: number) {
    setError(null);
    const res = await fetch(`/api/cart/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) {
      const data = await res.json();
      setError(data.error);
      return;
    }
    load();
  }

  async function removeItem(itemId: string) {
    await fetch(`/api/cart/items/${itemId}`, { method: 'DELETE' });
    load();
  }

  if (items === null) {
    return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-gray-500">Loading your cart…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <EmptyState message="Your cart is empty." />
        <div className="mt-4 text-center">
          <Link href="/store" className="btn-primary">Browse the Store</Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.book.sellingPrice * item.quantity, 0);
  const discount = items.reduce((sum, item) => sum + (item.book.originalPrice - item.book.sellingPrice) * item.quantity, 0);
  const shipping = calculateShipping(subtotal);
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Your Cart</h1>
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="flex flex-col gap-4">
          {items.map((item) => (
            <li key={item.id} className="card flex gap-4 p-4">
              <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100">
                {item.book.coverImageUrl && <Image src={item.book.coverImageUrl} alt={item.book.title} fill className="object-cover" />}
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link href={`/book/${item.book.slug}`} className="font-medium text-gray-900 hover:text-brand-600">{item.book.title}</Link>
                  <p className="text-sm text-gray-500">₹{item.book.sellingPrice.toFixed(2)} each</p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="btn-secondary !px-2 !py-1 text-xs">－</button>
                  <span className="text-sm">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.book.stockQuantity} className="btn-secondary !px-2 !py-1 text-xs">＋</button>
                  <button onClick={() => removeItem(item.id)} className="ml-4 text-xs font-medium text-red-600 hover:underline">Remove</button>
                </div>
              </div>
              <div className="text-right font-semibold text-gray-900">₹{(item.book.sellingPrice * item.quantity).toFixed(2)}</div>
            </li>
          ))}
        </ul>

        <div className="card h-fit p-5">
          <h2 className="mb-4 font-semibold text-gray-900">Order Summary</h2>
          <dl className="flex flex-col gap-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>₹{subtotal.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Discount</dt><dd className="text-green-600">-₹{discount.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</dd></div>
            <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-base font-bold text-gray-900"><dt>Total</dt><dd>₹{total.toFixed(2)}</dd></div>
          </dl>
          <Link href="/checkout" className="btn-primary mt-4 w-full">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  );
}
