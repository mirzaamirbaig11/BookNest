'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface SessionUser {
  id: string;
  fullName: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

const links = [
  { href: '/', label: 'Home' },
  { href: '/read', label: 'Read' },
  { href: '/store', label: 'Store' },
  { href: '/favorites', label: 'Favorites' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [user, setUser] = useState<SessionUser | null | undefined>(undefined);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));
  }, [pathname]);

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">📚</span>
          <span className="font-serif text-xl font-bold text-brand-700">BookNest</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-brand-600 ${
                pathname === link.href ? 'text-brand-600' : 'text-gray-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link href="/cart" aria-label="Cart" className="text-gray-600 hover:text-brand-600">
            🛒
          </Link>
          {user === undefined ? null : user ? (
            <div className="flex items-center gap-3">
              <Link href="/orders" className="text-sm font-medium text-gray-600 hover:text-brand-600">
                Orders
              </Link>
              <Link href="/profile" className="text-sm font-medium text-gray-600 hover:text-brand-600">
                {user.fullName.split(' ')[0]}
              </Link>
              {user.role === 'ADMIN' && (
                <Link href="/admin" className="text-sm font-medium text-accent-600 hover:text-accent-500">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="btn-secondary !px-3 !py-1.5 text-xs">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="btn-secondary !px-3 !py-1.5 text-xs">
                Login
              </Link>
              <Link href="/register" className="btn-primary !px-3 !py-1.5 text-xs">
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="text-2xl md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-3">
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700">
                {link.label}
              </Link>
            ))}
            <Link href="/cart" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700">
              Cart
            </Link>
            {user ? (
              <>
                <Link href="/orders" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700">Orders</Link>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700">Profile</Link>
                {user.role === 'ADMIN' && (
                  <Link href="/admin" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-accent-600">Admin</Link>
                )}
                <button onClick={handleLogout} className="text-left text-sm font-medium text-gray-700">Logout</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700">Login</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="text-sm font-medium text-gray-700">Register</Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
