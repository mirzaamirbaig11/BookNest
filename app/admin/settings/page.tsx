export const metadata = { title: 'Settings' };

export default function AdminSettingsPage() {
  const rows = [
    { label: 'Admin Email', value: process.env.ADMIN_EMAIL ?? 'Not set' },
    { label: 'UPI ID', value: process.env.UPI_ID ?? 'Not set' },
    { label: 'UPI Merchant Name', value: process.env.UPI_MERCHANT_NAME ?? 'BookNest' },
    { label: 'Payment Mode', value: (process.env.PAYMENT_MODE ?? 'test').toUpperCase() },
    { label: 'Storage Mode', value: (process.env.STORAGE_MODE ?? 'local').toUpperCase() },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Settings</h1>
      <div className="card p-5">
        <p className="mb-4 text-sm text-gray-500">
          These values come from your <code className="rounded bg-gray-100 px-1">.env</code> file. Change them there and
          restart the app — they are intentionally not editable from this screen to avoid secrets being stored in the database.
        </p>
        <dl className="flex flex-col gap-2 text-sm">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between border-b border-gray-100 py-2">
              <dt className="text-gray-500">{row.label}</dt>
              <dd className="font-medium text-gray-900">{row.value}</dd>
            </div>
          ))}
        </dl>
        {(process.env.PAYMENT_MODE ?? 'test') !== 'production' && (
          <p className="mt-4 rounded-lg bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            PAYMENT_MODE is "test" — all orders are flagged as test orders. Set PAYMENT_MODE=production in .env when you're ready to accept real payments.
          </p>
        )}
      </div>
    </div>
  );
}
