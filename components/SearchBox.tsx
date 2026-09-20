'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Suggestion {
  id: string;
  slug: string;
  title: string;
  author: string;
}

export default function SearchBox({ basePath, placeholder = 'Search by title, author, ISBN…' }: { basePath: string; placeholder?: string }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/books/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
      setOpen(true);
    }, 250);
    return () => clearTimeout(timeout);
  }, [query]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setOpen(false);
    router.push(`${basePath}?q=${encodeURIComponent(query)}`);
  }

  return (
    <div className="relative w-full max-w-lg">
      <form onSubmit={submitSearch}>
        <input
          className="input-field"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
      </form>
      {open && suggestions.length > 0 && (
        <ul className="absolute z-30 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {suggestions.map((s) => (
            <li key={s.id}>
              <Link href={`/book/${s.slug}`} className="block px-4 py-2 text-sm hover:bg-gray-50">
                <span className="font-medium">{s.title}</span>{' '}
                <span className="text-gray-500">— {s.author}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
