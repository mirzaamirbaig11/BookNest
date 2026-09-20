import Link from 'next/link';

const links = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/books', label: 'Books', icon: '📚' },
  { href: '/admin/books/new', label: 'Add Book', icon: '➕' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { href: '/admin/orders', label: 'Orders', icon: '🧾' },
  { href: '/admin/users', label: 'Users', icon: '👥' },
  { href: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { href: '/admin/messages', label: 'Contact Messages', icon: '✉️' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-8">
      <aside className="w-full flex-shrink-0 lg:w-56">
        <div className="card sticky top-20 p-3">
          <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-gray-400">Admin</p>
          <nav className="flex flex-row flex-wrap gap-1 lg:flex-col">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-brand-50 hover:text-brand-700">
                <span className="mr-2">{link.icon}</span>{link.label}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
