'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  profilePictureUrl: string | null;
}

interface Address {
  id: string;
  fullName: string;
  mobile: string;
  line1: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

interface HistoryItem {
  id: string;
  lastPage: number;
  totalPages: number | null;
  book: { id: string; slug: string; title: string; coverImageUrl: string | null };
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [form, setForm] = useState({ fullName: '', email: '', mobile: '' });
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me').then((r) => r.json()).then((data) => {
      if (data.user) {
        setUser(data.user);
        setForm({ fullName: data.user.fullName, email: data.user.email, mobile: data.user.mobile });
      }
    });
    fetch('/api/addresses').then((r) => r.json()).then((data) => setAddresses(data.addresses ?? []));
    fetch('/api/reading-progress').then((r) => r.json()).then((data) => setHistory(data.history ?? []));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setMessage(null);
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error);
      setStatus('error');
      return;
    }
    setUser(data.user);
    setMessage('Profile updated.');
    setStatus('idle');
  }

  async function handlePictureChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'profile-picture');
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    const data = await res.json();
    setUploading(false);
    if (res.ok && user) setUser({ ...user, profilePictureUrl: data.url });
  }

  if (!user) return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-gray-500">Loading profile…</div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">My Profile</h1>

      <div className="card mb-6 flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
        <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-100">
          {user.profilePictureUrl ? (
            <Image src={user.profilePictureUrl} alt={user.fullName} fill className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-2xl text-gray-400">👤</div>
          )}
        </div>
        <label className="btn-secondary w-fit cursor-pointer text-xs">
          {uploading ? 'Uploading…' : 'Change Photo'}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handlePictureChange} />
        </label>
      </div>

      {message && <p className="mb-3 text-sm text-gray-600">{message}</p>}

      <form onSubmit={handleSave} className="card mb-8 flex flex-col gap-4 p-5">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Full Name</label>
          <input className="input-field" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input className="input-field" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Mobile</label>
          <input className="input-field" value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
        </div>
        <button type="submit" disabled={status === 'loading'} className="btn-primary w-fit">
          {status === 'loading' ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      <div className="mb-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Saved Addresses</h2>
        {addresses.length === 0 ? (
          <p className="text-sm text-gray-500">No saved addresses yet. Add one at checkout.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {addresses.map((addr) => (
              <li key={addr.id} className="card p-3 text-sm text-gray-600">
                {addr.fullName} · {addr.mobile}<br />
                {addr.line1}, {addr.city}, {addr.state} {addr.pincode}
                {addr.isDefault && <span className="ml-2 rounded bg-brand-50 px-2 py-0.5 text-xs text-brand-600">Default</span>}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Continue Reading</h2>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">You haven't started reading any books yet.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {history.map((h) => (
              <li key={h.id} className="card flex items-center justify-between p-3 text-sm">
                <span>{h.book.title} — page {h.lastPage}{h.totalPages ? ` of ${h.totalPages}` : ''}</span>
                <Link href={`/read/${h.book.id}`} className="font-medium text-brand-600 hover:underline">Continue</Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 flex gap-4 text-sm">
        <Link href="/orders" className="font-medium text-brand-600 hover:underline">View Orders</Link>
        <Link href="/favorites" className="font-medium text-brand-600 hover:underline">View Favorites</Link>
      </div>
    </div>
  );
}
