import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bot, CheckCircle2, CreditCard, Headset, LayoutDashboard, LogOut, RefreshCw, UserRound } from 'lucide-react';
import type { SiteSession } from '../lib/userAuth';

type Order = { id:string; created_at:string; chatbot_name?:string|null; plan_name?:string|null; requested_price?:number|string|null; billing_type?:string|null; payment_status?:string|null; order_status?:string|null; delivery_status?:string|null; delivery_chatbot_id?:string|null };
type Chatbot = { id:string; name:string; slug:string; embed_code?:string|null; logo_url?:string|null; enabled?:boolean };
type Tab = 'overview'|'chatbots'|'orders'|'support'|'profile';

const API = 'https://tlkmcfpzfdokcnyyvkov.supabase.co/functions/v1/sales-chatbot-api';
const KEY = 'sb_publishable_-gNvioLExBonu8hGuWa8lQ_eIWmhMn6';

export function ClientDashboard({ session, onLogout }: { session: SiteSession; onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('overview');
  const [orders, setOrders] = useState<Order[]>([]);
  const [bots, setBots] = useState<Chatbot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState('');

  async function request(action: string, extra: Record<string, unknown> = {}) {
    const response = await fetch(API, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + session.access_token, 'Content-Type': 'application/json' }, body: JSON.stringify({ action, ...extra }) });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Request failed. Please try again.');
    return data;
  }
  async function refresh() {
    setLoading(true); setError('');
    try { const data = await request('client_portal'); setOrders(data.orders || []); setBots(data.chatbots || []); }
    catch (e) { setError(e instanceof Error ? e.message : 'Could not load your account data.'); }
    finally { setLoading(false); }
  }
  useEffect(() => { void refresh(); }, [session.access_token]);
  async function sendSupport(e: React.FormEvent) {
    e.preventDefault(); setSending(true); setNotice('');
    try { const data = await request('client_support', { subject, message }); setNotice(data.message || 'Support request sent.'); setSubject(''); setMessage(''); }
    catch (e) { setNotice(e instanceof Error ? e.message : 'Could not send your request.'); }
    finally { setSending(false); }
  }
  const status = (v?: string|null) => (v || 'Pending').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  const nav: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    {id:'overview',label:'Overview',icon:LayoutDashboard},{id:'chatbots',label:'My Chatbots',icon:Bot},{id:'orders',label:'My Orders',icon:CreditCard},{id:'support',label:'Support',icon:Headset},{id:'profile',label:'My Profile',icon:UserRound}
  ];
  const input = 'mt-1 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
      <div><p className="text-xs font-bold uppercase tracking-widest text-blue-700">Sales Chatbot</p><h1 className="mt-1 text-xl font-extrabold sm:text-2xl">Client Dashboard</h1></div>
      <div className="flex gap-2"><a href="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600"><ArrowLeft size={15}/><span className="hidden sm:inline">Back to website</span><span className="sm:hidden">Website</span></a><button onClick={onLogout} className="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-3 py-2 text-sm font-bold text-white"><LogOut size={15}/>Log out</button></div>
    </div></header>
    <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[230px_minmax(0,1fr)] lg:py-8">
      <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"><div className="mb-2 border-b border-slate-100 px-3 py-3"><p className="truncate text-sm font-bold">{session.user.user_metadata?.full_name || 'Account holder'}</p><p className="mt-1 truncate text-xs text-slate-500">{session.user.email}</p></div>
        <nav className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-1">{nav.map(n=>{const Icon=n.icon;return <button key={n.id} onClick={()=>setTab(n.id)} className={'flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold '+(tab===n.id?'bg-blue-50 text-blue-800':'text-slate-600 hover:bg-slate-50')}><Icon size={17}/>{n.label}</button>})}</nav>
      </aside>
      <main className="min-w-0">
        {error && <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><span>{error}</span><button onClick={()=>void refresh()} className="font-bold underline">Try again</button></div>}
        {loading && <p className="mb-4 flex items-center gap-2 rounded-xl bg-white p-3 text-sm text-slate-500"><RefreshCw size={16}/>Loading your account details…</p>}
        {tab==='overview' && <section className="space-y-5"><div><h2 className="text-2xl font-extrabold">Welcome back, {(session.user.user_metadata?.full_name||'there').split(' ')[0]}!</h2><p className="mt-1 text-sm text-slate-500">Manage your chatbot orders, delivered bots and support.</p></div>
          <div className="grid gap-3 sm:grid-cols-3">{[['My Orders',orders.length],['My Chatbots',bots.length],['Delivered',orders.filter(o=>o.delivery_status==='delivered'||o.order_status==='Completed').length]].map(([label,value])=><div key={String(label)} className="rounded-2xl border border-slate-200 bg-white p-5"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-extrabold">{value}</p></div>)}</div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5"><div className="flex items-center justify-between"><h3 className="font-bold">Recent orders</h3><button onClick={()=>setTab('orders')} className="text-sm font-bold text-blue-700">View all</button></div>{orders.length===0?<p className="mt-3 text-sm text-slate-500">Your orders will appear here when submitted with this login email.</p>:orders.slice(0,3).map(o=><div key={o.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 py-3"><div><p className="font-semibold">{o.plan_name||o.chatbot_name||'Chatbot order'}</p><p className="text-xs text-slate-500">{new Date(o.created_at).toLocaleDateString()}</p></div><span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-800">{status(o.order_status||o.payment_status)}</span></div>)}</div>
        </section>}
        {tab==='chatbots' && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="text-2xl font-extrabold">My Chatbots</h2><p className="mt-1 text-sm text-slate-500">Chatbots assigned to your orders appear here.</p>{bots.length===0?<p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">No chatbot is linked to your orders yet. Once your payment is confirmed and our team creates your chatbot, it will appear here.</p>:<div className="mt-5 grid gap-3 md:grid-cols-2">{bots.map(b=><article key={b.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex items-center gap-3">{b.logo_url?<img src={b.logo_url} alt="" className="h-10 w-10 rounded-xl object-contain"/>:<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Bot size={21}/></div>}<div className="min-w-0"><h3 className="truncate font-bold">{b.name}</h3><p className="text-xs text-slate-500">{b.enabled?'Active':'Not active yet'}</p></div></div><div className="mt-4 flex flex-wrap gap-2"><a target="_blank" rel="noreferrer" href={'/embed/'+encodeURIComponent(b.slug)} className="rounded-xl bg-blue-700 px-3 py-2 text-sm font-bold text-white">Test chatbot</a><button onClick={async()=>{const code=b.embed_code||'<script src="'+window.location.origin+'/embed.js" data-chatbot="'+b.slug+'" defer></script>';try{await navigator.clipboard.writeText(code);setNotice('Embed code copied.');}catch{setNotice(code);}setTab('support');}} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold">Copy embed code</button></div></article>)}</div>}</section>}
        {tab==='orders' && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="text-2xl font-extrabold">My Orders & Pricing</h2><p className="mt-1 text-sm text-slate-500">Track your order, payment and delivery status.</p>{orders.length===0?<p className="mt-5 rounded-xl bg-slate-50 p-5 text-sm text-slate-600">No pricing orders found for this login email. Submit an order while using this same email address.</p>:<div className="mt-5 space-y-3">{orders.map(o=><article key={o.id} className="rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{o.plan_name||o.chatbot_name||'Chatbot order'}</h3><p className="mt-1 text-xs text-slate-500">Order #{o.id.slice(0,8)} · {new Date(o.created_at).toLocaleDateString()}</p></div><p className="font-extrabold">{o.requested_price==null?'To be confirmed':'$'+Number(o.requested_price).toLocaleString()}{o.billing_type?' / '+o.billing_type:''}</p></div><div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">{[['Order status',status(o.order_status)],['Payment status',status(o.payment_status)],['Delivery',status(o.delivery_status)]].map(([k,v])=><div key={k}><p className="text-xs text-slate-500">{k}</p><p className="mt-1 font-semibold">{v}</p></div>)}</div></article>)}</div>}</section>}
        {tab==='support' && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-50 p-3 text-blue-700"><Headset size={22}/></div><div><h2 className="text-2xl font-extrabold">Support & Help</h2><p className="text-sm text-slate-500">Send a question directly to our team.</p></div></div>{notice&&<div role="status" className="mt-4 break-words rounded-xl bg-blue-50 p-3 text-sm text-blue-800">{notice}</div>}<form onSubmit={sendSupport} className="mt-5 space-y-4"><label className="block text-sm font-semibold">Subject<input className={input} value={subject} onChange={e=>setSubject(e.target.value)} maxLength={160} placeholder="e.g. Help with chatbot installation" required/></label><label className="block text-sm font-semibold">How can we help?<textarea className={input+' min-h-32 resize-y'} value={message} onChange={e=>setMessage(e.target.value)} maxLength={2000} minLength={5} placeholder="Describe your question or issue…" required/></label><p className="text-xs text-slate-500">Reply contact: {session.user.email}</p><button disabled={sending} className="rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white disabled:opacity-50">{sending?'Sending…':'Send support request'}</button></form></section>}
        {tab==='profile' && <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><h2 className="text-2xl font-extrabold">My Profile</h2><p className="mt-1 text-sm text-slate-500">Your signed-in account details.</p><div className="mt-5 space-y-4 rounded-xl bg-slate-50 p-4"><div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Full name</p><p className="mt-1 font-semibold">{session.user.user_metadata?.full_name||'Account holder'}</p></div><div><p className="text-xs font-bold uppercase tracking-wide text-slate-500">Email address</p><p className="mt-1 break-all font-semibold">{session.user.email}</p></div><div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700"><CheckCircle2 size={17}/> Signed in securely</div></div><a href="/forgot-password" className="mt-5 inline-flex rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold">Reset password</a></section>}
      </main>
    </div>
  </div>;
}
