import { prisma } from '@/lib/prisma';

export const metadata = { title: 'Admin Dashboard' };

function StatCard({ label, value, tone = 'default' }: { label: string; value: string | number; tone?: 'default' | 'warn' | 'good' }) {
  const toneClass = tone === 'warn' ? 'text-yellow-600' : tone === 'good' ? 'text-green-600' : 'text-gray-900';
  return (
    <div className="card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}

export default async function AdminDashboardPage() {
  const [
    totalUsers,
    totalBooks,
    readingBooks,
    storeBooks,
    totalOrders,
    pendingOrders,
    verifiedPayments,
    pendingPayments,
    revenueAgg,
    lowStockBooks,
  ] = await Promise.all([
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.book.count(),
    prisma.book.count({ where: { readingEnabled: true } }),
    prisma.book.count({ where: { storeEnabled: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: 'PENDING' } }),
    prisma.payment.count({ where: { status: 'PAYMENT_VERIFIED' } }),
    prisma.payment.count({ where: { status: 'PAYMENT_PENDING' } }),
    prisma.order.aggregate({ where: { paymentStatus: 'PAYMENT_VERIFIED' }, _sum: { totalAmount: true } }),
    prisma.book.findMany({ where: { storeEnabled: true, stockQuantity: { lte: 5 } }, orderBy: { stockQuantity: 'asc' }, take: 8 }),
  ]);

  const revenue = Number(revenueAgg._sum.totalAmount ?? 0);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Users" value={totalUsers} />
        <StatCard label="Total Books" value={totalBooks} />
        <StatCard label="Reading Books" value={readingBooks} />
        <StatCard label="Store Books" value={storeBooks} />
        <StatCard label="Total Orders" value={totalOrders} />
        <StatCard label="Pending Orders" value={pendingOrders} tone="warn" />
        <StatCard label="Successful Payments" value={verifiedPayments} tone="good" />
        <StatCard label="Pending Payments" value={pendingPayments} tone="warn" />
        <StatCard label="Revenue" value={`₹${revenue.toFixed(2)}`} tone="good" />
        <StatCard label="Low Stock Books" value={lowStockBooks.length} tone="warn" />
      </div>

      {lowStockBooks.length > 0 && (
        <div className="card mt-6 p-5">
          <h2 className="mb-3 font-semibold text-gray-900">Low Stock Alert</h2>
          <ul className="flex flex-col gap-1 text-sm text-gray-700">
            {lowStockBooks.map((b) => (
              <li key={b.id} className="flex justify-between">
                <span>{b.title}</span>
                <span className="font-medium text-yellow-600">{b.stockQuantity} left</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
