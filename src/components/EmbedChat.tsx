import React, { useEffect, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

const API = 'https://tlkmcfpzfdokcnyyvkov.supabase.co/functions/v1/sales-chatbot-api';

type Message = { role: 'user' | 'assistant'; text: string };

export function EmbedChat({ slug }: { slug: string }) {
  const [config, setConfig] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState('');
  const [backendError, setBackendError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'config', slug }),
    })
      .then(async r => {
        const d = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(d?.error || 'Unable to load chatbot configuration.');
        if (!cancelled) {
          setConfig(d.chatbot || null);
          if (d?.chatbot?.welcome_message) {
            setMessages([{ role: 'assistant', text: d.chatbot.welcome_message }]);
          }
        }
      })
      .catch(error => {
        if (!cancelled) setBackendError(error instanceof Error ? error.message : 'Unable to load chatbot.');
      });
    return () => { cancelled = true; };
  }, [slug]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setBackendError('');
    setInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setLoading(true);

    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, session_id: session, slug }),
      });
      const d = await r.json().catch(() => ({}));

      if (d.session_id) setSession(d.session_id);

      if (!r.ok) {
        const error = typeof d?.error === 'string' ? d.error : 'Backend request failed.';
        setBackendError(error);
        setMessages(m => [...m, { role: 'assistant', text: error }]);
        return;
      }

      if (!d.reply) {
        const error = 'Backend returned no chatbot reply.';
        setBackendError(error);
        setMessages(m => [...m, { role: 'assistant', text: error }]);
        return;
      }

      setMessages(m => [...m, { role: 'assistant', text: d.reply }]);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error.';
      setBackendError(message);
      setMessages(m => [...m, { role: 'assistant', text: 'Connection error: ' + message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[min(760px,calc(100vh-2rem))] overflow-hidden rounded-2xl bg-white shadow-xl border border-slate-200 flex flex-col">
        <div className="shrink-0 bg-slate-950 px-5 py-3.5 text-white flex items-center gap-3">
          <MessageCircle />
          <div className="min-w-0 flex-1">
            <div className="font-bold truncate">{config?.name || 'AI Chatbot'}</div>
            <div className="text-xs text-white/60">Online assistant</div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          {backendError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {backendError}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={'max-w-[82%] rounded-2xl px-4 py-3 text-sm ' + (m.role === 'user' ? 'text-white bg-slate-950' : 'bg-slate-100 text-slate-800')}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-slate-400">Typing…</div>}
        </div>

        <form
          onSubmit={e => { e.preventDefault(); send(); }}
          className="shrink-0 border-t p-3 bg-white flex gap-2"
        >
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 min-w-0 rounded-xl border px-3 py-2.5 outline-none"
            placeholder="Ask about this business…"
            aria-label="Ask the chatbot"
          />
          <button
            type="submit"
            disabled={loading}
            className="rounded-xl px-4 text-white disabled:opacity-50"
            style={{ backgroundColor: config?.brand_color || '#020617' }}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
