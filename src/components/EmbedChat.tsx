import React, { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

const API='https://tlkmcfpzfdokcnyyvkov.supabase.co/functions/v1/sales-chatbot-api';

export function EmbedChat({ slug }: { slug: string }) {
  const [config,setConfig]=useState<any>(null);
  const [messages,setMessages]=useState<{role:string;text:string}[]>([]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const [session,setSession]=useState('');

  useEffect(()=>{ fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'config',slug})}).then(r=>r.json()).then(d=>setConfig(d.chatbot||d)).catch(()=>{}); },[slug]);

  useEffect(()=>{ if(config?.welcome_message) setMessages([{role:'assistant',text:config.welcome_message}]); },[config?.welcome_message]);

  async function send(){
    const text=input.trim(); if(!text||loading)return;
    setInput(''); setMessages(m=>[...m,{role:'user',text}]); setLoading(true);
    try{
      const r=await fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:text,session_id:session,slug})});
      const d=await r.json(); if(d.session_id)setSession(d.session_id);
      setMessages(m=>[...m,{role:'assistant',text:d.reply||'Sorry, I could not answer that.'}]);
    }catch{setMessages(m=>[...m,{role:'assistant',text:'The chatbot is temporarily unavailable.'}]);}
    finally{setLoading(false);}
  }

  return <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border">
      <div className="bg-slate-950 px-5 py-4 text-white flex items-center gap-3"><MessageCircle/><div><div className="font-bold">{config?.name||'AI Chatbot'}</div><div className="text-xs text-white/60">Online assistant</div></div></div>
      <div className="h-[520px] overflow-y-auto p-4 space-y-3">
        {messages.map((m,i)=><div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${m.role==='user'?'bg-slate-950 text-white':'bg-slate-100 text-slate-800'}`}>{m.text}</div></div>)}
        {loading&&<div className="text-xs text-slate-400">Typing…</div>}
      </div>
      <form onSubmit={e=>{e.preventDefault();send()}} className="border-t p-3 flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 rounded-xl border px-3 py-3 outline-none" placeholder="Type a message…"/><button className="rounded-xl bg-slate-950 px-4 text-white"><Send size={18}/></button></form>
    </div>
  </div>;
}
