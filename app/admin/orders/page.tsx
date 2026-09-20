'use client';

import { useEffect, useState } from 'react';

interface OrderRow {
  id: string;
  orderNumber: string;
  totalAmount: string;
  orderStatus: string;
  paymentStatus: 'PAYMENT_PENDING' | 'PAYMENT_VERIFIED' | 'PAYMENT_REJECTED';
  createdAt: string;
  user: { fullName: string; mobile: string };
  payment: { utrNumber: string | null; utrSubmittedAt: string | null } | null;
  items: { titleSnapshot: string; quantity: number }[];
}

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [q, setQ] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (paymentFilter) params.set('paymentStatus', paymentFilter);
    const res = await fetch(`/api/admin/orders?${params.toString()}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [paymentFilter]);

  async function verify(id: string) {
    if (!confirm('Confirm you have checked this UTR and the payment is genuine?')) return;
    const res = await fetch(`/api/admin/orders/${id}/verify-payment`, { method: 'POST' });
    const data = await res.json();
    if (!res.ok) alert(data.error);
    load();
  }

  async function reject(id: string) {
    if (!confirm('Reject this payment?')) return;
    await fetch(`/api/admin/orders/${id}/reject-payment`, { method: 'POST' });
    load();
  }

  async function updateStatus(id: string, orderStatus: string) {
    await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderStatus }),
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Orders</h1>

      <form onSubmit={(e) => { e.preventDefault(); load(); }} className="mb-4 flex flex-wrap gap-2">
        <input className="input-field" placeholder="Search order #, customer, mobile, UTR…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input-field !w-auto" value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="">All Payment Statuses</option>
          <option value="PAYMENT_PENDING">Pending Verification</option>
          <option value="PAYMENT_VERIFIED">Verified</option>
          <option value="PAYMENT_REJECTED">Rejected</option>
        </select>
        <button className="btn-secondary !text-sm">Search</button>
      </form>

      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-gray-400">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400">No orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="card p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{order.user.fullName} · {order.user.mobile} · {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <p className="text-lg font-bold text-gray-900">₹{Number(order.totalAmount).toFixed(2)}</p>
              </div>

              <ul className="mt-2 text-xs text-gray-600">
                {order.items.map((item, i) => <li key={i}>{item.titleSnapshot} × {item.quantity}</li>)}
              </ul>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <select value={order.orderStatus} onChange={(e) => updateStatus(order.id, e.target.value)} className="input-field !w-auto !py-1 text-xs">
                  {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                {order.paymentStatus === 'PAYMENT_PENDING' ? (
                  <>
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-medium text-yellow-700">
                      UTR: {order.payment?.utrNumber ?? 'Not submitted yet'}
                    </span>
                    <button onClick={() => verify(order.id)} className="btn-primary !px-3 !py-1 text-xs">Verify Payment</button>
                    <button onClick={() => reject(order.id)} className="btn-secondary !px-3 !py-1 text-xs !border-red-500 !text-red-600">Reject Payment</button>
                  </>
                ) : (
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${order.paymentStatus === 'PAYMENT_VERIFIED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {order.paymentStatus.replace('PAYMENT_', '')}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
