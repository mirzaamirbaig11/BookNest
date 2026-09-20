import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import EmptyState from '@/components/EmptyState';

export const metadata = { title: 'My Orders' };

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-gray-100 text-gray-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-indigo-100 text-indigo-700',
  SHIPPED: 'bg-purple-100 text-purple-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

const PAYMENT_COLORS: Record<string, string> = {
  PAYMENT_PENDING: 'bg-yellow-100 text-yellow-700',
  PAYMENT_VERIFIED: 'bg-green-100 text-green-700',
  PAYMENT_REJECTED: 'bg-red-100 text-red-700',
};

export default async function OrdersPage() {
  const session = await getSession();
  const orders = await prisma.order.findMany({
    where: { userId: session!.userId },
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Orders</h1>

      {orders.length === 0 ? (
        <EmptyState message="You haven't placed any orders yet." />
      ) : (
        <ul className="flex flex-col gap-4">
          {orders.map((order) => (
            <li key={order.id} className="card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order.orderNumber}</p>
                  <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[order.orderStatus]}`}>{order.orderStatus}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${PAYMENT_COLORS[order.paymentStatus]}`}>{order.paymentStatus.replace('PAYMENT_', '')}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">{order.items.length} item(s) · ₹{Number(order.totalAmount).toFixed(2)}</p>
              <div className="mt-3 flex gap-3">
                <Link href={`/orders/${order.id}`} className="text-sm font-medium text-brand-600 hover:underline">View Details</Link>
                {order.paymentStatus === 'PAYMENT_PENDING' && (
                  <Link href={`/orders/${order.id}/payment`} className="text-sm font-medium text-accent-600 hover:underline">Complete Payment</Link>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
