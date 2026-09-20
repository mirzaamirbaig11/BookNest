export const metadata = { title: 'FAQ' };

const faqs = [
  { q: 'How do I read a book online?', a: 'Go to the Read section, open any book with reading enabled, and it will open in our in-browser reader. Your progress is saved automatically if you\'re logged in.' },
  { q: 'How does payment work?', a: 'We use direct UPI payments. After checkout, scan the QR code or tap "Pay with UPI App", then submit your UTR/Transaction ID so our team can verify it.' },
  { q: 'How long does payment verification take?', a: 'Our team manually verifies each UPI payment against the UTR you submit. You will see the updated status on your Orders page.' },
  { q: 'Can I download books?', a: 'Only books with downloading explicitly enabled by the admin can be downloaded. Others are for online reading only.' },
  { q: 'How do I return or cancel an order?', a: 'See our Refund Policy and Shipping Policy pages, or contact us directly.' },
];

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Frequently Asked Questions</h1>
      <div className="flex flex-col gap-4">
        {faqs.map((item) => (
          <div key={item.q} className="card p-4">
            <p className="font-semibold text-gray-900">{item.q}</p>
            <p className="mt-1 text-sm text-gray-600">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
