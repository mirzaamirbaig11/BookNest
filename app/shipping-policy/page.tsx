export const metadata = { title: 'Shipping Policy' };
export default function ShippingPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-gray-700">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Shipping Policy</h1>
      <p>Physical books are shipped after payment verification. Standard shipping is free on orders of ₹499 or more; a flat ₹49 fee applies to smaller orders.</p>
      <p className="mt-4">You can track your order status (Pending → Confirmed → Processing → Shipped → Delivered) from the Orders page.</p>
      <p className="mt-4 text-sm text-gray-400">Update delivery timelines and carrier details here to match your actual fulfillment process.</p>
    </div>
  );
}
