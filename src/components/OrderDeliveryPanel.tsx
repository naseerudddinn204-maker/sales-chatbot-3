import React, { useEffect, useState } from 'react';
import { Bot, Copy, ExternalLink, CheckCircle2, RefreshCw } from 'lucide-react';
import { createChatbot, listChatbots, listLeads, updateLead } from '../lib/supabaseAdmin';

type Order = { id:string; name:string; email:string; company?:string|null; phone?:string|null; chatbot_name?:string|null; plan_name?:string|null; payment_status?:string|null; delivery_chatbot_id?:string|null; delivery_status?:string|null; created_at:string };
type BotRow = { id:string; name:string; slug:string; embed_code?:string|null };

export function OrderDeliveryPanel() {
  const [orders,setOrders] = useState<Order[]>([]);
  const [bots,setBots] = useState<BotRow[]>([]);
  const [loading,setLoading] = useState(true);
  const [working,setWorking] = useState<string|null>(null);
  const [notice,setNotice] = useState('');
  const origin = window.location.origin;
  async function refresh() {
    setLoading(true);
    try {
      const [leads, chatbotRows] = await Promise.all([listLeads(), listChatbots()]);
      setOrders((leads||[]).filter((x:Order)=>x.plan_name || (x as any).order_type==='Pricing order'));
      setBots(chatbotRows||[]);
    } catch(e) { setNotice(e instanceof Error ? e.message : 'Could not load delivery details.'); }
    finally { setLoading(false); }
  }
  useEffect(()=>{ void refresh(); },[]);
  async function createBot(order:Order) {
    if(order.payment_status!=='paid') { setNotice('Payment status ko Paid set karein jab payment confirm ho jaye.'); return; }
    setWorking(order.id); setNotice('');
    try {
      const slug = 'client-' + order.id.replace(/-/g,'').slice(0,12) + '-' + Date.now().toString().slice(-6);
      const name = ((order.company || order.name) + ' - ' + (order.chatbot_name || 'AI Chatbot')).slice(0,160);
      const code = '<script src="' + origin + '/embed.js" data-chatbot="' + slug + '" defer></script>';
      const result = await createChatbot({name,slug,description:'Client chatbot for '+(order.company||order.name)+'. Plan: '+(order.plan_name||'AI Chatbot'),system_prompt:'You are a helpful business customer-support assistant. Answer using only the business information configured for this chatbot. If information is missing, ask the visitor to contact the business.',welcome_message:'Hello! How can I help you today?',enabled:true,embed_code:code,logo_url:'',brand_color:'#2563eb',knowledge_description:'',knowledge_text:''});
      const bot = result?.[0];
      if(!bot?.id) throw new Error('Chatbot ID was not returned.');
      await updateLead(order.id,{delivery_chatbot_id:bot.id,delivery_status:'chatbot_created',order_status:'In Progress'});
      setNotice('Client chatbot created. Ab admin Chatbots page par is bot ka business knowledge, logo aur color configure karein, phir test karein.');
      await refresh();
    } catch(e) { setNotice(e instanceof Error ? e.message : 'Could not create chatbot.'); }
    finally { setWorking(null); }
  }
  async function copyCode(order:Order) {
    const bot=bots.find(x=>x.id===order.delivery_chatbot_id);
    if(!bot) { setNotice('Linked chatbot nahi mila. Refresh karein.'); return; }
    const code=bot.embed_code || '<script src="'+origin+'/embed.js" data-chatbot="'+bot.slug+'" defer></script>';
    try { await navigator.clipboard.writeText(code); setNotice('Embed code copied. Client ki website mein HTML ke </body> se pehle add karwayen.'); }
    catch { setNotice(code); }
  }
  async function markDelivered(order:Order) {
    if(!order.delivery_chatbot_id) return;
    setWorking(order.id);
    try { await updateLead(order.id,{delivery_status:'delivered',order_status:'Completed'}); setNotice('Order delivered mark ho gaya.'); await refresh(); }
    catch(e) { setNotice(e instanceof Error ? e.message : 'Could not update delivery status.'); }
    finally { setWorking(null); }
  }
  return <section className="mt-6 rounded-3xl border border-blue-100 bg-white p-4 shadow-sm sm:p-6">
    <div className="mb-4 flex flex-wrap items-center gap-3"><Bot size={21}/><div className="min-w-0 flex-1"><h2 className="text-xl font-bold">Client Chatbot Delivery</h2><p className="text-sm text-slate-500">Payment confirm karein, unique chatbot banayein, test karein aur embed code client ko dein.</p></div><button onClick={()=>void refresh()} disabled={loading} className="flex items-center gap-2 rounded-xl border px-3 py-2 text-sm"><RefreshCw size={15}/>Refresh</button></div>
    {notice && <div className="mb-4 break-words rounded-xl bg-blue-50 p-3 text-sm text-blue-800">{notice}</div>}
    {loading ? <p className="text-sm text-slate-500">Loading…</p> : orders.length===0 ? <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">No pricing orders to deliver yet.</p> : <div className="space-y-3">{orders.map(order=>{const bot=bots.find(x=>x.id===order.delivery_chatbot_id);return <article key={order.id} className="rounded-2xl border p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{order.name}{order.company?' · '+order.company:''}</h3><p className="text-sm text-slate-500">{order.email} · {order.plan_name||'Plan not specified'}</p><p className="mt-1 text-xs text-slate-500">Payment: {order.payment_status||'unknown'} · Delivery: {order.delivery_status||'not_started'}</p></div>{bot && <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">{bot.name}</span>}</div>
    <div className="mt-3 flex flex-wrap gap-2">{!order.delivery_chatbot_id ? <button onClick={()=>void createBot(order)} disabled={working===order.id} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-50"><Bot size={15}/>{working===order.id?'Creating…':'Create client chatbot'}</button> : <><button onClick={()=>void copyCode(order)} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"><Copy size={15}/>Copy embed code</button><button onClick={()=>bot && window.open(origin+'/embed/'+encodeURIComponent(bot.slug),'_blank','noopener,noreferrer')} className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold"><ExternalLink size={15}/>Test chatbot</button>{order.delivery_status!=='delivered'&&<button onClick={()=>void markDelivered(order)} disabled={working===order.id} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-3 py-2 text-sm font-bold text-white"><CheckCircle2 size={15}/>Mark delivered</button>}</>}</div></article>})}</div>}
  </section>;
}
