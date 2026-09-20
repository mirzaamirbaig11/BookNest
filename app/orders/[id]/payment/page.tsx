'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface OrderData {
  id: string;
  orderNumber: string;
  totalAmount: string;
  isTestOrder: boolean;
  paymentStatus: 'PAYMENT_PENDING' | 'PAYMENT_VERIFIED' | 'PAYMENT_REJECTED';
  payment: { upiId: string; amount: string; upiPayeeReference: string; utrNumber: string | null } | null;
}

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [utr, setUtr] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy UPI ID');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function load() {
    const res = await fetch(`/api/orders/${id}`);
    if (res.status === 401) {
      router.push('/login');
      return;
    }
    const data = await res.json();
    setOrder(data.order);
    setQrDataUrl(data.qrDataUrl);
  }

  useEffect(() => {
    load();
  }, [id]);

  async function submitUtr(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitStatus('loading');
    try {
      const res = await fetch('/api/payments/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: id, utr }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error);
        setSubmitStatus('error');
        return;
      }
      setSubmitStatus('done');
      load();
    } catch {
      setSubmitStatus('error');
    }
  }

  function copyUpiId() {
    if (!order?.payment) return;
    navigator.clipboard.writeText(order.payment.upiId);
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy UPI ID'), 1500);
  }

  if (!order) return <div className="mx-auto max-w-4xl px-4 py-16 text-center text-gray-500">Loading payment details…</div>;

  const amount = Number(order.totalAmount).toFixed(2);
  const upiDeepLink = order.payment
    ? `upi://pay?pa=${encodeURIComponent(order.payment.upiId)}&pn=BookNest&tr=${encodeURIComponent(order.orderNumber)}&am=${amount}&cu=INR`
    : '#';

  if (order.paymentStatus !== 'PAYMENT_PENDING') {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="card p-8">
          <p className="text-4xl">{order.paymentStatus === 'PAYMENT_VERIFIED' ? '✅' : '❌'}</p>
          <h1 className="mt-3 text-xl font-bold text-gray-900">
            {order.paymentStatus === 'PAYMENT_VERIFIED' ? 'Payment Verified' : 'Payment Rejected'}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {order.paymentStatus === 'PAYMENT_VERIFIED'
              ? 'Your order has been confirmed.'
              : 'Please contact support if you believe this is a mistake.'}
          </p>
          <Link href={`/orders`} className="btn-primary mt-6 inline-block">View My Orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {order.isTestOrder && (
        <div className="mb-4 rounded-lg bg-yellow-50 px-4 py-2 text-center text-sm font-medium text-yellow-800">
          TEST MODE — this is not a real payment.
        </div>
      )}
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Payment</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Recommended for You</h2>
          <div className="flex items-center gap-3 rounded-lg border border-brand-500 bg-brand-50 p-4">
            <span className="text-2xl">📱</span>
            <div>
              <p className="font-semibold text-gray-900">UPI</p>
              <p className="text-sm text-gray-600">Pay by any UPI app</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-gray-400">
            Other payment options can be added here later without changing how orders and inventory work.
          </p>
        </div>

        <div className="card flex flex-col items-center gap-4 p-5 text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Scan QR and Pay</h2>
          <p className="text-3xl font-bold text-gray-900">₹{amount}</p>
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="UPI payment QR code" className="h-56 w-56 rounded-lg border border-gray-200" />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center rounded-lg border border-gray-200 text-sm text-gray-400">Generating QR…</div>
          )}
          <p className="text-xs text-gray-500">Scan using any compatible UPI app</p>
          <div className="flex gap-2 text-lg">
            <span title="Google Pay">🟢</span>
            <span title="PhonePe">🟣</span>
            <span title="Paytm">🔵</span>
            <span title="BHIM">🟠</span>
          </div>

          <div className="flex w-full gap-2">
            <button onClick={copyUpiId} className="btn-secondary flex-1 !text-xs">{copyLabel}</button>
            <a href={upiDeepLink} className="btn-primary flex-1 !text-xs">Pay with UPI App</a>
          </div>
          {order.payment && <p className="text-xs text-gray-400">UPI ID: {order.payment.upiId}</p>}
        </div>
      </div>

      <div className="card mx-auto mt-8 max-w-md p-5">
        <h2 className="mb-1 font-semibold text-gray-900">Payment completed?</h2>
        <p className="mb-3 text-sm text-gray-600">Enter your UPI Transaction ID / UTR number to confirm.</p>
        {error && <p className="mb-2 text-sm text-red-600">{error}</p>}
        {submitStatus === 'done' ? (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Thanks — your payment is pending verification by our team. You'll see the update on your Orders page.
          </p>
        ) : (
          <form onSubmit={submitUtr} className="flex flex-col gap-3">
            <input required minLength={4} className="input-field" placeholder="UPI Transaction ID / UTR" value={utr} onChange={(e) => setUtr(e.target.value)} />
            <button type="submit" disabled={submitStatus === 'loading'} className="btn-primary">
              {submitStatus === 'loading' ? 'Submitting…' : 'Confirm Payment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
