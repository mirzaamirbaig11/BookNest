import { notFound } from 'next/navigation';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export const metadata = { title: 'Order Details' };

const TRACKING_STEPS = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  const order = await prisma.order.findFirst({
    where: { id: params.id, userId: session!.userId },
    include: { items: true, payment: true, address: true },
  });

  if (!order) notFound();

  const currentStep = TRACKING_STEPS.indexOf(order.orderStatus);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
      <p className="mb-6 text-sm text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>

      {order.orderStatus !== 'CANCELLED' && (
        <div className="card mb-6 p-5">
          <div className="flex items-center justify-between">
            {TRACKING_STEPS.map((step, i) => (
              <div key={step} className="flex flex-1 flex-col items-center text-center">
                <div className={`h-3 w-3 rounded-full ${i <= currentStep ? 'bg-brand-600' : 'bg-gray-200'}`} />
                <span className={`mt-2 text-[10px] font-medium ${i <= currentStep ? 'text-brand-600' : 'text-gray-400'}`}>{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {order.paymentStatus === 'PAYMENT_PENDING' && (
        <div className="mb-6 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Payment verification pending.{' '}
          <Link href={`/orders/${order.id}/payment`} className="font-semibold underline">Complete or check payment →</Link>
        </div>
      )}
      {order.paymentStatus === 'PAYMENT_REJECTED' && (
        <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Payment rejected. Please contact support at mirzaamirbaig54@gmail.com.
        </div>
      )}

      <div className="card mb-6 p-5">
        <h2 className="mb-3 font-semibold text-gray-900">Items</h2>
        <ul className="flex flex-col gap-2 text-sm">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>{item.titleSnapshot} × {item.quantity}</span>
              <span>₹{(Number(item.priceSnapshot) * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 flex flex-col gap-1 border-t border-gray-200 pt-3 text-sm">
          <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd>₹{Number(order.subtotal).toFixed(2)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Discount</dt><dd className="text-green-600">-₹{Number(order.discountAmount).toFixed(2)}</dd></div>
          <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd>{Number(order.shippingAmount) === 0 ? 'Free' : `₹${Number(order.shippingAmount).toFixed(2)}`}</dd></div>
          <div className="flex justify-between text-base font-bold text-gray-900"><dt>Total</dt><dd>₹{Number(order.totalAmount).toFixed(2)}</dd></div>
        </dl>
      </div>

      <div className="card p-5">
        <h2 className="mb-2 font-semibold text-gray-900">Shipping Address</h2>
        <p className="text-sm text-gray-600">
          {order.address.fullName} · {order.address.mobile}<br />
          {order.address.line1}, {order.address.city}, {order.address.state} {order.address.pincode}, {order.address.country}
        </p>
      </div>
    </div>
  );
}
