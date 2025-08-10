'use client';

import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input) return;
    const userMsg: Message = { role: 'user', content: input };
    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setLoading(true);
    try {
      const res = await fetch('/api/itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages })
      });
      const data = await res.json();
      const assistantMsg: Message = {
        role: 'assistant',
        content: data.summary || '…'
      };
      setMessages([...nextMessages, assistantMsg]);
    } catch (err) {
      const errorMsg: Message = {
        role: 'assistant',
        content: 'There was an error retrieving a response.'
      };
      setMessages([...nextMessages, errorMsg]);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <div className="h-64 overflow-y-auto mb-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`my-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block px-2 py-1 rounded ${
                m.role === 'user'
                  ? 'bg-green text-white'
                  : 'bg-gray-200 text-navy'
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question…"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-4 py-2 bg-green text-white rounded"
        >
          {loading ? '…' : 'Send'}
        </button>
      </div>
    </div>
  );
}