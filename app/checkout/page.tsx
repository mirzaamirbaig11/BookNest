'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { calculateShipping } from '@/lib/pricing';

interface Address {
  id: string;
  fullName: string;
  mobile: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

interface CartItem {
  id: string;
  quantity: number;
  book: { title: string; sellingPrice: number; originalPrice: number };
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<{ items: CartItem[]; subtotal: number } | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ fullName: '', mobile: '', line1: '', city: '', state: '', pincode: '', country: 'India' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      fetch('/api/cart').then((r) => (r.status === 401 ? null : r.json())),
      fetch('/api/addresses').then((r) => (r.status === 401 ? null : r.json())),
    ]).then(([cartData, addressData]) => {
      if (!cartData) {
        router.push('/login?next=/checkout');
        return;
      }
      setCart(cartData);
      setAddresses(addressData?.addresses ?? []);
      if (addressData?.addresses?.length > 0) setSelectedAddressId(addressData.addresses[0].id);
      else setShowNewAddress(true);
    });
  }, [router]);

  async function saveNewAddress(): Promise<string | null> {
    const res = await fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? 'Could not save address.');
      return null;
    }
    return data.address.id as string;
  }

  async function placeOrder() {
    setError(null);
    setLoading(true);
    try {
      let addressId = selectedAddressId;
      if (showNewAddress) {
        const savedId = await saveNewAddress();
        if (!savedId) return;
        addressId = savedId;
      }
      if (!addressId) {
        setError('Please select or add a delivery address.');
        return;
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addressId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Could not place order.');
        return;
      }
      router.push(`/orders/${data.order.id}/payment`);
    } finally {
      setLoading(false);
    }
  }

  if (!cart) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-gray-500">Loading checkout…</div>;

  const shipping = calculateShipping(cart.subtotal);
  const total = cart.subtotal + shipping;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Checkout</h1>
      {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_320px]">
        <div className="card p-5">
          <h2 className="mb-3 font-semibold text-gray-900">Delivery Address</h2>

          {addresses.length > 0 && !showNewAddress && (
            <div className="flex flex-col gap-2">
              {addresses.map((addr) => (
                <label key={addr.id} className="flex cursor-pointer items-start gap-2 rounded-lg border border-gray-200 p-3 text-sm has-[:checked]:border-brand-500">
                  <input type="radio" name="address" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} className="mt-1" />
                  <span>
                    <strong>{addr.fullName}</strong> · {addr.mobile}<br />
                    {addr.line1}, {addr.city}, {addr.state} {addr.pincode}, {addr.country}
                  </span>
                </label>
              ))}
              <button onClick={() => setShowNewAddress(true)} className="mt-2 w-fit text-sm font-medium text-brand-600 hover:underline">
                + Add a new address
              </button>
            </div>
          )}

          {showNewAddress && (
            <div className="flex flex-col gap-3">
              <input className="input-field" placeholder="Full Name" value={newAddress.fullName} onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })} />
              <input className="input-field" placeholder="Mobile Number" value={newAddress.mobile} onChange={(e) => setNewAddress({ ...newAddress, mobile: e.target.value })} />
              <input className="input-field" placeholder="Address" value={newAddress.line1} onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className="input-field" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} />
                <input className="input-field" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input className="input-field" placeholder="Pincode" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} />
                <input className="input-field" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} />
              </div>
              {addresses.length > 0 && (
                <button onClick={() => setShowNewAddress(false)} className="w-fit text-sm text-gray-500 hover:underline">Use a saved address instead</button>
              )}
            </div>
          )}
        </div>

        <div className="card h-fit p-5">
          <h2 className="mb-3 font-semibold text-gray-900">Order Summary</h2>
          <ul className="mb-3 flex flex-col gap-1 text-sm text-gray-600">
            {cart.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span className="line-clamp-1">{item.book.title} × {item.quantity}</span>
                <span>₹{(item.book.sellingPrice * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <dl className="flex flex-col gap-1 border-t border-gray-200 pt-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>₹{cart.subtotal.toFixed(2)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd>{shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}</dd></div>
            <div className="flex justify-between text-base font-bold text-gray-900"><dt>Total</dt><dd>₹{total.toFixed(2)}</dd></div>
          </dl>
          <button onClick={placeOrder} disabled={loading} className="btn-primary mt-4 w-full">
            {loading ? 'Placing order…' : 'Continue to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
}
