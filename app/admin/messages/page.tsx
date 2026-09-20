'use client';

import { useEffect, useState } from 'react';

interface MessageRow {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageRow[]>([]);

  async function load() {
    const res = await fetch('/api/admin/messages');
    const data = await res.json();
    setMessages(data.messages ?? []);
  }

  useEffect(() => { load(); }, []);

  async function markRead(id: string, read: boolean) {
    await fetch(`/api/admin/messages/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Contact Messages</h1>
      <div className="flex flex-col gap-3">
        {messages.length === 0 ? (
          <p className="text-gray-400">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`card p-4 ${m.read ? '' : 'border-brand-300'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-gray-900">{m.subject}</p>
                  <p className="text-xs text-gray-500">{m.name} · {m.email} · {new Date(m.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => markRead(m.id, !m.read)} className="btn-secondary !px-3 !py-1 text-xs">
                  {m.read ? 'Mark Unread' : 'Mark Read'}
                </button>
              </div>
              <p className="mt-2 text-sm text-gray-700">{m.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
