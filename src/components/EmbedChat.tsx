import React, { useEffect, useState } from 'react';
import { FileText, MessageCircle, Send, Upload, X } from 'lucide-react';

const SUPABASE_URL = 'https://tlkmcfpzfdokcnyyvkov.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-gNvioLExBonu8hGuWa8lQ_eIWmhMn6';
const API = import.meta.env.VITE_SUPABASE_API_URL || SUPABASE_URL + '/functions/v1/sales-chatbot-api';

type Message = { role: 'user' | 'assistant'; text: string };

const headers = {
  apikey: SUPABASE_KEY,
  'Content-Type': 'application/json',
};

function looksLikePhone(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function EmbedChat({ slug }: { slug: string }) {
  const [config, setConfig] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState('');
  const [backendError, setBackendError] = useState('');
  const [visitorDescription, setVisitorDescription] = useState('');
  const [visitorKnowledge, setVisitorKnowledge] = useState('');
  const [knowledgeFile, setKnowledgeFile] = useState('');
  const [knowledgeLoading, setKnowledgeLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        const url = SUPABASE_URL + '/rest/v1/chatbots?select=id,name,slug,description,welcome_message,brand_color,logo_url,knowledge_description,knowledge_text&slug=eq.' + encodeURIComponent(slug) + '&enabled=eq.true&limit=1';
        const response = await fetch(url, { headers });
        const data = await response.json().catch(() => []);
        if (!response.ok || !Array.isArray(data) || !data[0]) {
          throw new Error('Unable to load chatbot configuration.');
        }
        if (!cancelled) {
          setConfig(data[0]);
          if (data[0].welcome_message) {
            setMessages([{ role: 'assistant', text: data[0].welcome_message }]);
          }
        }
      } catch (error) {
        if (!cancelled) setBackendError(error instanceof Error ? error.message : 'Unable to load chatbot.');
      }
    }

    loadConfig();
    return () => { cancelled = true; };
  }, [slug]);

  async function saveLead(phone: string, question: string) {
    const response = await fetch(SUPABASE_URL + '/rest/v1/leads', {
      method: 'POST',
      headers: { ...headers, Prefer: 'return=minimal' },
      body: JSON.stringify({
        name: 'Website Chat Visitor',
        email: null,
        company: null,
        phone,
        message: question,
        company_website: null,
        traffic_volume: null,
        primary_goal: 'Manager follow-up',
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(detail || 'Unable to save the client question.');
    }
  }

  async function handleKnowledgeFile(file?: File) {
    if (!file) return;
    setKnowledgeLoading(true);
    setBackendError('');
    try {
      const form = new FormData();
      form.append('action', 'visitor_knowledge');
      form.append('slug', slug);
      form.append('file', file);
      const r = await fetch(API, { method: 'POST', headers: { apikey: SUPABASE_KEY }, body: form });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d?.error || 'Could not read the file.');
      setVisitorKnowledge(String(d.knowledge_text || ''));
      setKnowledgeFile(file.name);
    } catch (error) {
      setBackendError(error instanceof Error ? error.message : 'Could not read the file.');
    } finally {
      setKnowledgeLoading(false);
    }
  }

  function clearVisitorKnowledge() {
    setVisitorDescription('');
    setVisitorKnowledge('');
    setKnowledgeFile('');
  }

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    setBackendError('');

    const previousAssistant = [...messages].reverse().find(m => m.role === 'assistant')?.text || '';
    const previousQuestion = [...messages].reverse().find(m => m.role === 'user')?.text || '';
    const isPhoneReply = looksLikePhone(text) && /phone|number|contact/i.test(previousAssistant);

    setInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setLoading(true);

    try {
      if (isPhoneReply && previousQuestion) {
        await saveLead(text, previousQuestion);
        const reply = 'Thank you! Your contact number has been recorded. Our manager will follow up with you.';
        setMessages(m => [...m, { role: 'assistant', text: reply }]);
        return;
      }

      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          session_id: session,
          slug,
          business_description: config?.knowledge_description || '',
          knowledge_text: [config?.knowledge_text || '', visitorDescription.trim(), visitorKnowledge].filter(Boolean).join('\n\n'),
        }),
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

        <div className="shrink-0 border-t bg-slate-50 px-3 pt-3">
          <div className="rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-slate-900">How to use this chatbot</div>
                <div className="text-xs text-slate-500">Apni business information yahan dein, phir chatbot usi information se jawab dega.</div>
              </div>
              {(visitorDescription || visitorKnowledge) && (
                <button type="button" onClick={clearVisitorKnowledge} className="text-xs text-slate-500 hover:text-red-600"><X size={15}/></button>
              )}
            </div>
            <textarea
              value={visitorDescription}
              onChange={e => setVisitorDescription(e.target.value)}
              rows={2}
              className="mt-2 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none"
              placeholder="Business description, products, services, prices, policies, FAQs..."
            />
            <div className="mt-2 flex items-center gap-2">
              <input
                id={"knowledge-file-" + slug}
                type="file"
                accept=".pdf,.txt,.md,.csv,.json,.html,.htm,.xml,text/plain,text/markdown,text/csv,application/json,application/pdf,text/html,text/xml"
                className="hidden"
                onChange={e => handleKnowledgeFile(e.target.files?.[0])}
              />
              <label htmlFor={"knowledge-file-" + slug} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                <Upload size={14}/> {knowledgeLoading ? 'Reading…' : 'Upload information file'}
              </label>
              {knowledgeFile && <span className="flex min-w-0 items-center gap-1 text-xs text-emerald-700"><FileText size={13}/><span className="truncate">{knowledgeFile}</span></span>}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">Supported: PDF, TXT, MD, CSV, JSON, HTML, XML. This information is used for this chat session.</div>
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); send(); }} className="shrink-0 border-t p-3 bg-white flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            className="flex-1 min-w-0 rounded-xl border px-3 py-2.5 outline-none"
            placeholder="Ask about this business…"
            aria-label="Ask the chatbot"
          />
          <button type="submit" disabled={loading} className="rounded-xl px-4 text-white disabled:opacity-50" style={{ backgroundColor: config?.brand_color || '#020617' }}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
