import Link from 'next/link';

const columns = [
  {
    title: 'Company',
    links: [
      { href: '/about', label: 'About Us' },
      { href: '/contact', label: 'Contact' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/privacy-policy', label: 'Privacy Policy' },
      { href: '/terms', label: 'Terms & Conditions' },
      { href: '/refund-policy', label: 'Refund Policy' },
      { href: '/shipping-policy', label: 'Shipping Policy' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-brand-900 text-brand-50">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <span className="font-serif text-xl font-bold">BookNest</span>
          </div>
          <p className="text-sm text-brand-100">Discover. Read. Learn. Buy.</p>
          <p className="mt-4 text-sm text-brand-100">mirzaamirbaig54@gmail.com</p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-brand-100">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-brand-100 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-brand-700 py-4 text-center text-xs text-brand-200">
        © {new Date().getFullYear()} BookNest. All rights reserved.
      </div>
    </footer>
  );
}
