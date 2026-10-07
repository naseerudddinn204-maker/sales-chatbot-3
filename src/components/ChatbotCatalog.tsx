import React, { useEffect, useState } from 'react';
import { Bot, ExternalLink, ShoppingCart, X } from 'lucide-react';

const SUPABASE_URL = 'https://tlkmcfpzfdokcnyyvkov.supabase.co';
const SUPABASE_KEY = 'sb_publishable_-gNvioLExBonu8hGuWa8lQ_eIWmhMn6';

type Chatbot={id:string;name:string;slug:string;description?:string|null;enabled:boolean;embed_code?:string|null;logo_url?:string|null;brand_color?:string|null};
type Price={chatbot_id:string;plan_name:string;monthly_price:number;annual_price:number;highlighted?:boolean;enabled:boolean};

function getDemoSlug(bot:Chatbot){const code=bot.embed_code||'';const match=code.match(/data-chatbot\s*=\s*["']([^"']+)["']/i);return match?.[1]||bot.slug;}

export const ChatbotCatalog:React.FC<{onNavigateToContact?:()=>void}>=({onNavigateToContact})=>{
 const[bots,setBots]=useState<Chatbot[]>([]),[prices,setPrices]=useState<Price[]>([]),[loading,setLoading]=useState(true),[error,setError]=useState(''),[demo,setDemo]=useState<{slug:string;name:string}|null>(null);
 useEffect(()=>{const load=async()=>{try{const headers={apikey:SUPABASE_KEY,Authorization:'Bearer '+SUPABASE_KEY};const[botRes,priceRes]=await Promise.all([fetch(SUPABASE_URL+'/rest/v1/chatbots?select=id,name,slug,description,enabled,embed_code,logo_url,brand_color&enabled=eq.true&order=created_at.desc',{headers}),fetch(SUPABASE_URL+'/rest/v1/chatbot_prices?select=chatbot_id,plan_name,monthly_price,annual_price,highlighted,enabled&enabled=eq.true&order=sort_order.asc',{headers})]);if(!botRes.ok||!priceRes.ok)throw new Error('Could not load chatbots');setBots(await botRes.json());setPrices(await priceRes.json());}catch{setError('Chatbots could not be loaded right now.')}finally{setLoading(false)}};load()},[]);
 useEffect(()=>{if(!demo)return;const onKey=(e:KeyboardEvent)=>{if(e.key==='Escape')setDemo(null)};document.addEventListener('keydown',onKey);return()=>document.removeEventListener('keydown',onKey)},[demo]);
 return <section className="px-4 sm:px-6 pt-5 pb-7">
  <div className="mb-5"><div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider">Available AI Chatbots</div><h2 className="font-headline text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2">Choose a chatbot to test</h2></div>
  {loading&&<div className="rounded-2xl bg-white border p-6 text-sm text-gray-500">Loading chatbots…</div>}
  {error&&<div className="rounded-2xl bg-red-50 border border-red-100 p-6 text-sm text-red-700">{error}</div>}
  {!loading&&!error&&bots.length===0&&<div className="rounded-2xl bg-white border p-6 text-sm text-gray-500">No enabled chatbots yet.</div>}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{bots.map(bot=>{const botPrices=prices.filter(p=>p.chatbot_id===bot.id);const cheapest=botPrices.length?Math.min(...botPrices.map(p=>Number(p.monthly_price))):null;const demoSlug=getDemoSlug(bot);return <article key={bot.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex flex-col">
   <div className="flex items-start justify-between gap-3"><div className="w-11 h-11 rounded-xl text-white flex items-center justify-center overflow-hidden" style={{backgroundColor:bot.brand_color||'#030712'}}>{bot.logo_url?<img src={bot.logo_url} alt={bot.name} className="w-full h-full object-contain bg-white p-1"/>:<Bot size={22}/>}</div><span className="text-[10px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">Live Demo</span></div>
   <h3 className="font-bold text-lg text-gray-900 mt-4">{bot.name}</h3><div className="mt-2 text-[11px] font-semibold text-gray-500">Add your information and ask questions</div><p className="text-sm text-gray-600 mt-1 min-h-[40px]">{bot.description||'AI chatbot for sales and customer support.'}</p>
   <div className="mt-4 flex items-end justify-between gap-3"><div>{cheapest!==null?<><span className="text-xs text-gray-500">Starting from</span><div className="font-extrabold text-xl text-gray-900">{'$'}{cheapest}<span className="text-xs font-medium text-gray-500">/mo</span></div></>:<span className="text-sm text-gray-500">Pricing available on request</span>}</div>
    <div className="flex gap-2"><button onClick={()=>setDemo({slug:demoSlug,name:bot.name})} className="h-9 px-3 rounded-lg bg-gray-950 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-gray-800"><ExternalLink size={14}/> Demo</button><button onClick={onNavigateToContact} className="h-9 px-3 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-blue-700"><ShoppingCart size={14}/> Get Started</button></div>
   </div>
   {botPrices.length>0&&<div className="mt-4 pt-4 border-t text-xs text-gray-500 flex flex-wrap gap-2">{botPrices.slice(0,3).map(p=><span key={p.plan_name} className={p.highlighted?'font-bold text-blue-700':''}>{p.plan_name}: {'$'}{p.monthly_price}/mo</span>)}</div>}
  </article>})}</div>
  {demo&&<div className="fixed inset-0 z-[100] bg-black/35 backdrop-blur-md flex items-center justify-center p-3 sm:p-6" onMouseDown={e=>{if(e.target===e.currentTarget)setDemo(null)}}>
   <div className="w-full max-w-[430px] h-[88vh] max-h-[820px] bg-white rounded-[24px] shadow-2xl overflow-hidden border border-white/70 flex flex-col">
    <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b bg-white"><span className="font-bold text-sm text-gray-900">{demo.name} Demo</span><button onClick={()=>setDemo(null)} aria-label="Close demo" className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-600"><X size={17}/></button></div>
    <iframe src={'/embed/'+encodeURIComponent(demo.slug)} title={demo.name+' Demo'} className="w-full flex-1 border-0 bg-white" />
   </div>
  </div>}
 </section>;
};