import React, { useEffect, useMemo, useState } from 'react';
import { Bot, Code2, LogOut, Plus, Save, Trash2, DollarSign, Copy, Check } from 'lucide-react';
import { createChatbot, createPrice, deleteChatbot, deletePrice, getAdminUser, getSession, listChatbots, listPrices, signOut, updateChatbot, updatePrice } from '../lib/supabaseAdmin';
import { AdminLogin } from './AdminLogin';

type Bot = { id:string; name:string; slug:string; description:string; system_prompt:string; welcome_message:string; enabled:boolean };
type Price = { id:string; plan_name:string; monthly_price:number; annual_price:number; description:string; features:string[]; highlighted:boolean; enabled:boolean; sort_order:number };

export function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(!!getSession());
  const [authorized, setAuthorized] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  const [selected, setSelected] = useState<Bot | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [embedCopied, setEmbedCopied] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const admin = await getAdminUser();
      if (!admin) { setAuthorized(false); return; }
      setAuthorized(true);
      const data = await listChatbots();
      setBots(data);
      if (!selected && data[0]) setSelected(data[0]);
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Could not load dashboard'); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (loggedIn) load(); else setLoading(false); }, [loggedIn]);
  useEffect(() => { if (selected) listPrices(selected.id).then(setPrices).catch(() => setPrices([])); }, [selected?.id]);

  if (!loggedIn) return <AdminLogin onLoggedIn={() => setLoggedIn(true)} />;
  if (loading) return <div className="min-h-screen grid place-items-center">Loading admin dashboard…</div>;
  if (!authorized) return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-6">
      <div className="max-w-md rounded-3xl bg-white p-8 text-center shadow">
        <h1 className="text-xl font-bold">Account not authorized</h1>
        <p className="mt-2 text-sm text-slate-500">Your Supabase Auth account exists, but it has not been added to the admin_users table yet.</p>
        <button onClick={() => { signOut(); setLoggedIn(false); }} className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-white">Sign out</button>
      </div>
    </div>
  );

  const origin = window.location.origin;
  const embedCode = selected ? `<script src="${origin}/embed.js" data-chatbot="${selected.slug}" defer></script>` : '';
  const liveUrl = selected ? `${origin}/embed/${selected.slug}` : '';

  async function addBot() {
    const rows = await createChatbot({ name:'New Chatbot', slug:`chatbot-${Date.now()}`, description:'', system_prompt:'You are a helpful AI sales assistant.', welcome_message:'Hello! How can I help you?', enabled:true });
    const bot = rows[0];
    setBots([bot, ...bots]);
    setSelected(bot);
  }

  async function saveBot() {
    if (!selected) return;
    const rows = await updateChatbot(selected.id, selected);
    const bot = rows[0];
    setBots(bots.map(b => b.id === bot.id ? bot : b));
    setSelected(bot);
    setNotice('Chatbot saved.');
  }

  async function removeBot() {
    if (!selected || !confirm('Delete this chatbot and its pricing?')) return;
    await deleteChatbot(selected.id);
    setBots(bots.filter(b => b.id !== selected.id));
    setSelected(null);
    setPrices([]);
  }

  async function addPrice() {
    if (!selected) return;
    const rows = await createPrice({ chatbot_id:selected.id, plan_name:'New Plan', monthly_price:99, annual_price:79, description:'', features:['Feature 1'], highlighted:false, enabled:true, sort_order:prices.length });
    setPrices([...prices, rows[0]]);
  }

  async function savePrice(price: Price) {
    const rows = await updatePrice(price.id, price);
    setPrices(prices.map(p => p.id === price.id ? rows[0] : p));
    setNotice('Pricing saved.');
  }

  async function removePrice(id:string) {
    if (!confirm('Delete this pricing plan?')) return;
    await deletePrice(id);
    setPrices(prices.filter(p => p.id !== id));
  }

  async function copyEmbed() {
    await navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 1500);
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div><div className="text-lg font-bold">Chatbot Admin</div><div className="text-xs text-slate-500">Manage bots, pricing & embeds</div></div>
          <button onClick={() => { signOut(); setLoggedIn(false); }} className="flex items-center gap-2 rounded-xl border px-4 py-2 text-sm"><LogOut size={16}/> Sign out</button>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">
        {notice && <div className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</div>}
        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          <aside className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Your Chatbots</h2><button onClick={addBot} className="rounded-xl bg-slate-900 p-2 text-white"><Plus size={17}/></button></div>
            <div className="space-y-2">
              {bots.map(bot => <button key={bot.id} onClick={() => setSelected(bot)} className={`w-full rounded-2xl p-3 text-left ${selected?.id===bot.id?'bg-slate-900 text-white':'bg-slate-50'}`}>
                <div className="flex items-center gap-2"><Bot size={17}/><span className="font-semibold">{bot.name}</span></div><div className="mt-1 text-xs opacity-70">/{bot.slug}</div>
              </button>)}
            </div>
          </aside>
          <section className="space-y-6">
            {!selected ? <div className="rounded-3xl bg-white p-10 text-center">Create your first chatbot.</div> : <>
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-bold">Chatbot settings</h2><p className="text-sm text-slate-500">These settings control the public chatbot.</p></div><button onClick={saveBot} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white"><Save size={16}/> Save</button></div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="rounded-xl border p-3" value={selected.name} onChange={e=>setSelected({...selected,name:e.target.value})} placeholder="Chatbot name"/>
                  <input className="rounded-xl border p-3" value={selected.slug} onChange={e=>setSelected({...selected,slug:e.target.value})} placeholder="slug"/>
                  <textarea className="rounded-xl border p-3 md:col-span-2" value={selected.description||''} onChange={e=>setSelected({...selected,description:e.target.value})} placeholder="Description"/>
                  <textarea className="rounded-xl border p-3 md:col-span-2" rows={5} value={selected.system_prompt||''} onChange={e=>setSelected({...selected,system_prompt:e.target.value})} placeholder="System prompt"/>
                  <input className="rounded-xl border p-3 md:col-span-2" value={selected.welcome_message||''} onChange={e=>setSelected({...selected,welcome_message:e.target.value})} placeholder="Welcome message"/>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={selected.enabled} onChange={e=>setSelected({...selected,enabled:e.target.checked})}/> Public chatbot enabled</label>
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between"><div><h2 className="flex items-center gap-2 text-xl font-bold"><DollarSign size={20}/> Pricing</h2><p className="text-sm text-slate-500">Change pricing here; the public site reads it from Supabase.</p></div><button onClick={addPrice} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white"><Plus size={16}/> Add plan</button></div>
                <div className="space-y-4">
                  {prices.map(p=><div key={p.id} className="rounded-2xl border p-4">
                    <div className="grid gap-3 md:grid-cols-4">
                      <input className="rounded-lg border p-2" value={p.plan_name} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,plan_name:e.target.value}:x))}/>
                      <input className="rounded-lg border p-2" type="number" value={p.monthly_price} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,monthly_price:Number(e.target.value)}:x))}/>
                      <input className="rounded-lg border p-2" type="number" value={p.annual_price} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,annual_price:Number(e.target.value)}:x))}/>
                      <div className="flex gap-2"><button onClick={()=>savePrice(p)} className="flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Save</button><button onClick={()=>removePrice(p.id)} className="rounded-lg border p-2"><Trash2 size={16}/></button></div>
                    </div>
                    <input className="mt-3 w-full rounded-lg border p-2" value={p.description||''} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,description:e.target.value}:x))} placeholder="Plan description"/>
                    <input className="mt-3 w-full rounded-lg border p-2" value={(p.features||[]).join(', ')} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,features:e.target.value.split(',').map(v=>v.trim()).filter(Boolean)}:x))} placeholder="Features, comma separated"/>
                  </div>)}
                </div>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-2"><Code2 size={20}/><h2 className="text-xl font-bold">Embed this chatbot</h2></div>
                <p className="text-sm text-slate-500">Paste this code into any website's HTML. The chatbot will load from your backend-powered embed page.</p>
                <pre className="mt-4 overflow-x-auto rounded-2xl bg-slate-950 p-4 text-sm text-slate-100">{embedCode}</pre>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button onClick={copyEmbed} className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white">{embedCopied?<Check size={16}/>:<Copy size={16}/>} {embedCopied?'Copied':'Copy embed code'}</button>
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="rounded-xl border px-4 py-2">Open live chatbot</a>
                </div>
              </div>
            </>}
          </section>
        </div>
      </main>
    </div>
  );
}
