'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function FavoriteButton({
  bookId,
  initiallyFavorited,
}: {
  bookId: string;
  initiallyFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    try {
      const res = await fetch('/api/favorites', {
        method: favorited ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId }),
      });
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      if (res.ok) setFavorited(!favorited);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
      className="rounded-full bg-white/90 p-2 text-lg shadow transition hover:scale-105 disabled:opacity-60"
    >
      {favorited ? '❤️' : '🤍'}
    </button>
  );
}
