export const metadata = { title: 'Privacy Policy' };
export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-gray-700">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Privacy Policy</h1>
      <p>We collect only the information needed to run your account and orders: name, email, mobile number, delivery addresses, and order/payment history you provide.</p>
      <p className="mt-4">Passwords are stored as salted hashes and are never visible to our team. Payment verification is done manually against the UTR you submit — we do not store your UPI app credentials.</p>
      <p className="mt-4">For questions or data-deletion requests, contact mirzaamirbaig54@gmail.com.</p>
      <p className="mt-4 text-sm text-gray-400">Replace this placeholder policy with one reviewed by a legal professional before going live.</p>
    </div>
  );
}
