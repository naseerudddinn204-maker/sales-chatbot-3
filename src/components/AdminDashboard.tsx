import React, { useEffect, useState } from 'react';
import { Bot, Code2, LogOut, Plus, Save, Trash2, DollarSign, Copy, Check, ClipboardList } from 'lucide-react';
import { createChatbot, createPrice, deleteChatbot, deletePrice, getAdminUser, getSession, listChatbots, listLeads, listPrices, signOut, updateChatbot, updatePrice } from '../lib/supabaseAdmin';
import { AdminLogin } from './AdminLogin';

type Bot = { id:string; name:string; slug:string; description:string; system_prompt:string; welcome_message:string; enabled:boolean; embed_code?:string; logo_url?:string; brand_color?:string; knowledge_description?:string; knowledge_text?:string };
type Price = { id:string; plan_name:string; monthly_price:number; annual_price:number; description:string; features:string[]; highlighted:boolean; enabled:boolean; sort_order:number };\ntype Lead = { id:string; name:string; email:string; company?:string; phone?:string; company_website:string; traffic_volume?:string; primary_goal?:string; message?:string; created_at:string };

export function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(!!getSession());
  const [authorized, setAuthorized] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  const [selected, setSelected] = useState<Bot | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);\n  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [embedCopied, setEmbedCopied] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const admin = await getAdminUser();
      if (!admin) { setAuthorized(false); return; }
      setAuthorized(true);
      const [data, leadData] = await Promise.all([listChatbots(), listLeads()]);
      setBots(data);
      setLeads(leadData || []);
      if (!selected && data[0]) setSelected(data[0]);
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Could not load dashboard'); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (loggedIn) load(); else setLoading(false); }, [loggedIn]);
  useEffect(() => { if (selected) listPrices(selected.id).then(setPrices).catch(() => setPrices([])); }, [selected?.id]);

  if (!loggedIn) return <AdminLogin onLoggedIn={() => setLoggedIn(true)} />;
  if (loading) return <div className="min-h-screen grid place-items-center p-4 text-center">Loading admin dashboard…</div>;
  if (!authorized) return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow">
        <h1 className="text-xl font-bold">Account not authorized</h1>
        <p className="mt-2 text-sm text-slate-500">Your Supabase Auth account exists, but it has not been added to the admin_users table yet.</p>
        <button onClick={() => { signOut(); setLoggedIn(false); }} className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-white">Sign out</button>
      </div>
    </div>
  );

  const origin = window.location.origin;
  const defaultEmbedCode = selected ? `<script src="${origin}/embed.js" data-chatbot="${selected.slug}" defer></script>` : '';
  const embedCode = selected?.embed_code?.trim() || defaultEmbedCode;
  const liveUrl = selected ? `${origin}/embed/${selected.slug}` : '';

  async function addBot() {
    const rows = await createChatbot({ name:'New Chatbot', slug:`chatbot-${Date.now()}`, description:'', system_prompt:'You are a helpful AI sales assistant.', welcome_message:'Hello! How can I help you?', enabled:true, embed_code:'', logo_url:'', brand_color:'#111827', knowledge_description:'', knowledge_text:'' });
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

  const inputClass = "box-border w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100";
  const smallInputClass = "box-border w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-slate-400";

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-20 w-full max-w-full border-b bg-white/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
          <div className="min-w-0">
            <div className="truncate text-lg font-bold">Chatbot Admin</div>
            <div className="truncate text-xs text-slate-500">Manage bots, pricing & embeds</div>
          </div>
          <button onClick={() => { signOut(); setLoggedIn(false); }} className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2 text-sm sm:w-auto">
            <LogOut size={16}/> Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl box-border px-3 py-4 sm:px-4 sm:py-6 lg:px-6">
        {notice && <div className="mb-4 break-words rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</div>}

        <div className="mb-4 min-w-0 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList size={20}/>
            <div>
              <h2 className="text-xl font-bold">Chatbot Requests</h2>
              <p className="text-sm text-slate-500">“Request your AI chatbot” forms submitted from the Contact Expert page.</p>
            </div>
            <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{leads.length}</span>
          </div>
          {leads.length === 0 ? <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No chatbot requests yet.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead><tr className="border-b text-xs uppercase text-slate-500"><th className="p-3">Date</th><th className="p-3">Client</th><th className="p-3">Email</th><th className="p-3">Website</th><th className="p-3">Goal</th><th className="p-3">Traffic</th><th className="p-3">Message</th></tr></thead>
                <tbody>{leads.map(lead=><tr key={lead.id} className="border-b last:border-0"><td className="p-3 whitespace-nowrap">{new Date(lead.created_at).toLocaleString()}</td><td className="p-3 font-semibold">{lead.name}{lead.company && <div className="text-xs font-normal text-slate-500">{lead.company}</div>}</td><td className="p-3">{lead.email}{lead.phone && <div className="text-xs text-slate-500">{lead.phone}</div>}</td><td className="p-3"><a className="text-blue-600 hover:underline" href={lead.company_website} target="_blank" rel="noreferrer">{lead.company_website}</a></td><td className="p-3">{lead.primary_goal||'—'}</td><td className="p-3">{lead.traffic_volume||'—'}</td><td className="p-3 max-w-[280px]">{lead.message||'—'}</td></tr>)}</tbody>
              </table>
            </div>
          )}
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
          <aside className="min-w-0 rounded-3xl bg-white p-3 shadow-sm sm:p-4 lg:h-fit lg:sticky lg:top-24">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="truncate font-bold">Your Chatbots</h2>
              <button onClick={addBot} className="shrink-0 rounded-xl bg-slate-900 p-2 text-white"><Plus size={17}/></button>
            </div>
            <div className="grid gap-2">
              {bots.map(bot => (
                <button key={bot.id} onClick={() => setSelected(bot)} className={`w-full min-w-0 overflow-hidden rounded-2xl p-3 text-left ${selected?.id===bot.id?'bg-slate-900 text-white':'bg-slate-50'}`}>
                  <div className="flex min-w-0 items-center gap-2">{bot.logo_url ? <img src={bot.logo_url} alt="" className="h-7 w-7 shrink-0 rounded-lg object-contain"/> : <Bot className="shrink-0" size={17}/>}<span className="truncate font-semibold">{bot.name}</span></div>
                  <div className="mt-1 truncate text-xs opacity-70">/{bot.slug}</div>
                </button>
              ))}
            </div>
          </aside>

          <section className="min-w-0 space-y-4 sm:space-y-6">
            {!selected ? (
              <div className="rounded-3xl bg-white p-6 text-center sm:p-10">Create your first chatbot.</div>
            ) : <>
              <div className="min-w-0 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><h2 className="text-xl font-bold">Chatbot settings</h2><p className="text-sm text-slate-500">These settings control the public chatbot.</p></div>
                  <button onClick={saveBot} className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white sm:w-auto"><Save size={16}/> Save</button>
                </div>
                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                  <input className={inputClass} value={selected.name} onChange={e=>setSelected({...selected,name:e.target.value})} placeholder="Chatbot name"/>
                  <input className={inputClass} value={selected.slug} onChange={e=>setSelected({...selected,slug:e.target.value})} placeholder="slug"/>
                  <textarea className={inputClass} value={selected.description||''} onChange={e=>setSelected({...selected,description:e.target.value})} placeholder="Description"/>
                  <textarea className={inputClass} rows={5} value={selected.system_prompt||''} onChange={e=>setSelected({...selected,system_prompt:e.target.value})} placeholder="System prompt"/>
                  <textarea className={inputClass + " md:col-span-2"} rows={3} value={selected.welcome_message||''} onChange={e=>setSelected({...selected,welcome_message:e.target.value})} placeholder="Welcome message"/>
                  <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold">Chatbot Logo</label>
                      <input className={inputClass} value={selected.logo_url||''} onChange={e=>setSelected({...selected,logo_url:e.target.value})} placeholder="Logo image URL (https://...)" />
                      {selected.logo_url && <img src={selected.logo_url} alt={selected.name} className="mt-3 h-14 w-14 rounded-2xl object-contain border p-1" />}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold">Brand Color</label>
                      <div className="flex gap-2">
                        <input type="color" className="h-11 w-14 rounded-lg border" value={selected.brand_color||'#111827'} onChange={e=>setSelected({...selected,brand_color:e.target.value})} />
                        <input className={inputClass} value={selected.brand_color||'#111827'} onChange={e=>setSelected({...selected,brand_color:e.target.value})} placeholder="#111827" />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 border-t pt-4">
                    <h3 className="font-bold">Business Knowledge</h3>
                    <p className="mt-1 text-sm text-slate-500">Ye knowledge isi chatbot ke saath database mein save hogi.</p>
                    <textarea className={inputClass + " mt-3"} rows={5} value={selected.knowledge_description||''} onChange={e=>setSelected({...selected,knowledge_description:e.target.value})} placeholder="Business description / FAQs / approved answers" />
                    <textarea className={inputClass + " mt-3 font-mono text-xs"} rows={8} value={selected.knowledge_text||''} onChange={e=>setSelected({...selected,knowledge_text:e.target.value})} placeholder="Uploaded knowledge text..." />
                    <input
                      className={inputClass + " mt-3"}
                      type="file"
                      accept=".txt,.md,.csv,.json"
                      onChange={async e=>{
                        const file=e.target.files?.[0];
                        if(!file) return;
                        const text=await file.text();
                        setSelected({...selected,knowledge_text:text});
                      }}
                    />
                  </div>
                  <label className="flex min-w-0 items-center gap-2 text-sm"><input type="checkbox" checked={selected.enabled} onChange={e=>setSelected({...selected,enabled:e.target.checked})}/> Public chatbot enabled</label>
                </div>
              </div>

              <div className="min-w-0 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><h2 className="flex items-center gap-2 text-xl font-bold"><DollarSign size={20}/> Pricing</h2><p className="text-sm text-slate-500">Change pricing here; the public site reads it from Supabase.</p></div>
                  <button onClick={addPrice} className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white sm:w-auto"><Plus size={16}/> Add plan</button>
                </div>
                <div className="space-y-4">
                  {prices.map(p=><div key={p.id} className="min-w-0 rounded-2xl border p-3 sm:p-4">
                    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <input className={smallInputClass} value={p.plan_name} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,plan_name:e.target.value}:x))}/>
                      <input className={smallInputClass} type="number" value={p.monthly_price} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,monthly_price:Number(e.target.value)}:x))}/>
                      <input className={smallInputClass} type="number" value={p.annual_price} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,annual_price:Number(e.target.value)}:x))}/>
                      <div className="flex min-w-0 gap-2"><button onClick={()=>savePrice(p)} className="min-w-0 flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Save</button><button onClick={()=>removePrice(p.id)} className="shrink-0 rounded-lg border p-2"><Trash2 size={16}/></button></div>
                    </div>
                    <input className={smallInputClass + " mt-3"} value={p.description||''} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,description:e.target.value}:x))} placeholder="Plan description"/>
                    <textarea className={smallInputClass + " mt-3"} rows={2} value={(p.features||[]).join(', ')} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,features:e.target.value.split(',').map(v=>v.trim()).filter(Boolean)}:x))} placeholder="Features, comma separated"/>
                  </div>)}
                </div>
              </div>

              <div className="min-w-0 rounded-3xl bg-white p-4 shadow-sm sm:p-6">
                <div className="mb-4 flex min-w-0 items-center gap-2"><Code2 className="shrink-0" size={20}/><h2 className="truncate text-xl font-bold">Embed this chatbot</h2></div>
                <p className="break-words text-sm text-slate-500">Har chatbot ka apna embed code yahan save karein. Agar aap kuch paste nahi karte, default code automatically use hoga.</p>
                <textarea
                  className={inputClass + " mt-4 font-mono text-xs sm:text-sm"}
                  rows={5}
                  value={selected.embed_code || defaultEmbedCode}
                  onChange={e=>setSelected({...selected,embed_code:e.target.value})}
                  placeholder="Paste your chatbot embed code here"
                />
                <p className="mt-2 break-words text-xs text-slate-500">Custom code save karne ke liye upar <b>Save</b> button dabayein. Neeche wala code sirf copy/use ke liye hai; dashboard custom HTML ko execute nahi karta.</p>
                <pre className="mt-4 max-w-full overflow-hidden whitespace-pre-wrap break-all rounded-2xl bg-slate-950 p-3 text-xs text-slate-100 sm:p-4 sm:text-sm">{embedCode}</pre>
                <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
                  <button onClick={copyEmbed} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white sm:w-auto">{embedCopied?<Check size={16}/>:<Copy size={16}/>} {embedCopied?'Copied':'Copy embed code'}</button>
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center rounded-xl border px-4 py-2 sm:w-auto">Open live chatbot</a>
                  <button onClick={removeBot} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-red-600 sm:w-auto"><Trash2 size={16}/> Delete chatbot</button>
                </div>
              </div>
            </>}
          </section>
        </div>
      </main>
    </div>
  );
}
