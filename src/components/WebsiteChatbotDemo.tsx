import React, { useState } from 'react';
import { ArrowRight, Bot, CheckCircle2, Globe, Loader2, MessageCircle, RefreshCw, Send, ShieldCheck, Sparkles } from 'lucide-react';

const API_URL = 'https://tlkmcfpzfdokcnyyvkov.supabase.co/functions/v1/website-chatbot-demo';
const API_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-gNvioLExBonu8hGuWa8lQ_eIWmhMn6';

type ChatMessage = { role: 'assistant' | 'user'; text: string };
type ScanResult = { ok: boolean; website_url: string; title: string; description: string; pages_scanned: number; knowledge_text: string; error?: string };

async function request<T>(payload: Record<string, unknown>): Promise<T> {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { apikey: API_KEY, Authorization: `Bearer ${API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data?.error || 'The demo service could not complete this request.');
  return data as T;
}

const field = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
const primary = 'inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50';

export function WebsiteChatbotDemo() {
  const [website, setWebsite] = useState('');
  const [scan, setScan] = useState<ScanResult | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState('');
  const [scanning, setScanning] = useState(false);
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);

  async function createDemo(event: React.FormEvent) {
    event.preventDefault();
    setScanning(true); setNotice(''); setScan(null); setMessages([]);
    try {
      const result = await request<ScanResult>({ action: 'scan_website', website_url: website.trim() });
      setScan(result);
      setMessages([{ role: 'assistant', text: `Hi! I’m the demo assistant for ${result.title || new URL(result.website_url).hostname}. Ask me about the information found on this website.` }]);
      setNotice(`Demo ready. Scanned ${result.pages_scanned} public page(s).`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'We could not scan this website.');
    } finally { setScanning(false); }
  }

  async function sendQuestion(event: React.FormEvent) {
    event.preventDefault();
    const text = question.trim();
    if (!text || !scan || sending) return;
    setMessages(previous => [...previous, { role: 'user', text }]);
    setQuestion(''); setSending(true);
    try {
      const result = await request<{ reply: string }>({ action: 'chat_website', website_url: scan.website_url, knowledge_text: scan.knowledge_text, question: text });
      setMessages(previous => [...previous, { role: 'assistant', text: result.reply || 'I could not find that information on the scanned website.' }]);
    } catch (error) {
      setMessages(previous => [...previous, { role: 'assistant', text: error instanceof Error ? error.message : 'The chatbot could not respond. Please try again.' }]);
    } finally { setSending(false); }
  }

  function resetDemo() {
    setScan(null); setMessages([]); setNotice(''); setWebsite(''); setQuestion('');
  }

  return <main className={scan ? "fixed inset-0 z-[100] h-[100dvh] w-screen overflow-hidden bg-slate-100" : "mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8"}>
    {!scan&&<a href="/ai-tools" className="text-sm font-bold text-blue-700 hover:text-blue-900">← All AI tools</a>}
    {!scan&&<div className="mt-5 flex items-start gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Bot size={25}/></span>
      <div><p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">OrkenAI Labs · Interactive demo</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">Build a chatbot from your website</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Enter a public website address. We’ll read a limited set of public pages and place a floating chatbot over your website preview.</p></div>
    </div>}

    {!scan ? <section className="mt-7 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
      <form onSubmit={createDemo} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div className="flex items-center gap-2 text-sm font-extrabold"><Globe size={18} className="text-blue-700"/> Website address</div>
        <label className="mt-5 block text-xs font-bold text-slate-600" htmlFor="website-demo-url">Your website URL</label>
        <input id="website-demo-url" className={field} type="url" required value={website} onChange={e=>setWebsite(e.target.value)} placeholder="https://www.example.com"/>
        <p className="mt-2 text-xs leading-5 text-slate-500">Use a public website you own or have permission to test. Login-only pages are not scanned.</p>
        <button className={primary+' mt-5 w-full'} disabled={scanning}>{scanning?<><Loader2 size={16} className="animate-spin"/> Reading website…</>:<>Create my chatbot demo <ArrowRight size={16}/></>}</button>
        {notice&&<p role="status" className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">{notice}</p>}
      </form>
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">How it works</p>
        <div className="mt-5 space-y-5">
          {[['01','Add your website','Share a public URL that you own or are authorised to test.'],['02','Build website knowledge','The demo reads a small number of public pages and extracts visible text.'],['03','Test your assistant','Ask questions and see answers grounded in the scanned website content.']].map(([number,title,copy])=><div key={number} className="flex gap-3"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-sm font-black text-blue-700">{number}</span><div><h2 className="text-sm font-extrabold">{title}</h2><p className="mt-1 text-sm leading-6 text-slate-600">{copy}</p></div></div>)}
        </div>
        <div className="mt-6 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4"><div className="flex items-center gap-2 text-sm font-extrabold text-emerald-900"><ShieldCheck size={17}/> Private, temporary demo</div><p className="mt-1 text-xs leading-5 text-emerald-900/80">Website text stays in this browser session for testing and is not saved as a permanent chatbot or shared with other demos.</p></div>
      </section>
    </section> : <section className="h-full w-full overflow-hidden bg-white">
      <div className="absolute left-3 right-3 top-3 z-30 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white/95 p-3 shadow-lg backdrop-blur sm:left-5 sm:right-5 sm:top-5 sm:px-5"><div className="flex min-w-0 items-center gap-3"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><CheckCircle2 size={21}/></span><div className="min-w-0"><h2 className="truncate text-sm font-extrabold">{scan.title || new URL(scan.website_url).hostname}</h2><p className="truncate text-xs text-slate-500">{scan.website_url} · {scan.pages_scanned} pages scanned</p></div></div><div className="flex gap-2"><button type="button" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50" onClick={()=>setShowPreview(!showPreview)}>{showPreview?'Hide':'Show'} preview</button><button type="button" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50" onClick={resetDemo}><RefreshCw size={14}/> New website</button></div></div>
      {notice&&<p role="status" className="border-b border-blue-100 bg-blue-50 px-5 py-2.5 text-xs text-blue-900">{notice}</p>}
      {showPreview&&<section className="relative overflow-hidden bg-slate-100">
        <div className="absolute left-3 top-[88px] z-20 flex max-w-[calc(100%-24px)] items-center gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-2 shadow-md backdrop-blur sm:left-5 sm:top-[92px]"><div className="min-w-0"><h3 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">Live preview</h3><p className="max-w-[40vw] truncate text-[11px] text-slate-500">{scan.website_url}</p></div><a href={scan.website_url} target="_blank" rel="noreferrer" className="shrink-0 text-[11px] font-bold text-blue-700 hover:text-blue-900">Open ↗</a></div>
        <div className="relative isolate h-[100dvh] w-full overflow-hidden">
          <iframe title="Website preview with floating chatbot" src={scan.website_url} className="absolute inset-0 h-full w-full border-0 bg-white" sandbox="allow-scripts allow-forms allow-same-origin" referrerPolicy="no-referrer"/>
          {chatOpen&&<section className="absolute bottom-4 right-4 z-20 flex aspect-square h-auto w-[min(360px,calc(100%-32px))] max-h-[calc(100%-32px)] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:bottom-6 sm:right-6">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-800 to-indigo-700 p-4 text-white"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Bot size={21}/></span><div className="min-w-0 flex-1"><h3 className="text-sm font-extrabold">Website AI Assistant</h3><p className="text-[11px] text-blue-100">Online · Website knowledge loaded</p></div><button type="button" onClick={()=>setChatOpen(false)} className="rounded-lg p-2 text-white/90 hover:bg-white/15" aria-label="Minimize chatbot">−</button></div>
            <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/80 p-4">{messages.map((message,index)=><div key={index} className={message.role==='user'?'ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-blue-700 px-4 py-3 text-sm leading-6 text-white':'max-w-[92%] rounded-2xl rounded-tl-sm border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-700'}>{message.text}</div>)}{sending&&<div className="flex items-center gap-2 text-xs text-slate-500"><Loader2 size={14} className="animate-spin"/> Assistant is typing…</div>}</div>
            <form onSubmit={sendQuestion} className="flex gap-2 border-t border-slate-100 bg-white p-3"><input className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-500" value={question} onChange={e=>setQuestion(e.target.value)} placeholder="Ask about this website…" aria-label="Ask the website chatbot" maxLength={600}/><button className={primary+' px-3'} disabled={!question.trim()||sending} aria-label="Send question"><Send size={16}/></button></form>
          </section>}
          {!chatOpen&&<button type="button" onClick={()=>setChatOpen(true)} className="absolute bottom-6 right-6 z-20 flex h-16 w-16 items-center justify-center rounded-full bg-blue-700 text-white shadow-xl transition hover:scale-105 hover:bg-blue-800" aria-label="Open website chatbot"><MessageCircle size={27}/></button>}
        </div>
        
      </section>}
    </section>}
    {!scan&&<p className="mt-5 text-xs leading-5 text-slate-500">This is a temporary evaluation demo only. It does not install a chatbot on the original website, provide embed code, or make a payment request. Answers may miss information that is hidden behind logins, loaded dynamically, or outside the scanned pages.</p>
  </main>;
}
