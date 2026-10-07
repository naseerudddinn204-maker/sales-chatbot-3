import React, { useEffect, useState } from 'react';
import { FileText, MessageCircle, Send, UploadCloud, X } from 'lucide-react';

const API='https://tlkmcfpzfdokcnyyvkov.supabase.co/functions/v1/sales-chatbot-api';
const MAX_TOTAL_KNOWLEDGE=100000;
const SUPPORTED_EXTENSIONS=['.txt','.md','.csv','.json'];

type KnowledgeFile={name:string;text:string;size:number};

export function EmbedChat({ slug }: { slug: string }) {
  const [config,setConfig]=useState<any>(null);
  const [messages,setMessages]=useState<{role:string;text:string}[]>([]);
  const [input,setInput]=useState('');
  const [loading,setLoading]=useState(false);
  const [session,setSession]=useState('');
  const [businessDescription,setBusinessDescription]=useState('');
  const [files,setFiles]=useState<KnowledgeFile[]>([]);
  const [showKnowledge,setShowKnowledge]=useState(false);
  const [knowledgeActive,setKnowledgeActive]=useState(false);
  const [fileError,setFileError]=useState('');
  const [backendError,setBackendError]=useState('');

  useEffect(()=>{
    fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'config',slug})})
      .then(r=>r.json()).then(d=>setConfig(d.chatbot||d)).catch(()=>{});
  },[slug]);

  useEffect(()=>{
    if(config?.welcome_message) setMessages([{role:'assistant',text:config.welcome_message}]);
    if(config?.knowledge_description) setBusinessDescription(config.knowledge_description);
    if(config?.knowledge_text) setFiles([{name:'Saved business knowledge',text:config.knowledge_text,size:config.knowledge_text.length}]);
    if(config?.knowledge_description || config?.knowledge_text) setKnowledgeActive(true);
  },[config?.welcome_message]);

  async function handleFiles(selected:FileList|null){
    if(!selected)return;
    setFileError('');
    const next=[...files];
    let total=next.reduce((sum,f)=>sum+f.size,0);
    for(const file of Array.from(selected)){
      const lower=file.name.toLowerCase();
      const ext=SUPPORTED_EXTENSIONS.find(x=>lower.endsWith(x));
      if(!ext){setFileError('Use TXT, MD, CSV, or JSON files.');continue;}
      if(total+file.size>MAX_TOTAL_KNOWLEDGE){setFileError('Maximum knowledge size is 100 KB per chat session.');break;}
      const text=await file.text();
      next.push({name:file.name,text,size:file.size});
      total+=file.size;
    }
    setFiles(next);
  }

  function removeFile(name:string){ setFiles(current=>current.filter(file=>file.name!==name)); }

  function activateKnowledge(){
    const has=Boolean(businessDescription.trim()||files.length);
    setKnowledgeActive(has);
    setShowKnowledge(false);
    if(has) setMessages(current=>[...current,{role:'assistant',text:'Business knowledge is active for this chat session. I will answer only from the information you provided.'}]);
  }

  function resetKnowledge(){
    setBusinessDescription('');
    setFiles([]);
    setKnowledgeActive(false);
    setFileError('');
    setShowKnowledge(false);
    setMessages(config?.welcome_message?[{role:'assistant',text:config.welcome_message}]:[]);
  }

  async function send(){
    const text=input.trim(); if(!text||loading)return;
    setBackendError('');
    setInput('');
    setMessages(m=>[...m,{role:'user',text}]);
    setLoading(true);
    try{
      const knowledgeText=files.map(f=>'FILE: '+f.name+'\n'+f.text).join('\n\n');
      const r=await fetch(API,{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          message:text,session_id:session,slug,
          business_description:knowledgeActive?businessDescription.trim():'',
          knowledge_text:knowledgeActive?knowledgeText:''
        })
      });
      const d=await r.json().catch(()=>({}));
      if(d.session_id)setSession(d.session_id);
      if(!r.ok){
        const detail=typeof d?.details==='string'?d.details:'';
        const error=typeof d?.error==='string'?d.error:'Backend request failed';
        const full=detail?`${error}: ${detail}`:error;
        setBackendError(full);
        setMessages(m=>[...m,{role:'assistant',text:`Backend error (${r.status}): ${full}`}]);
        return;
      }
      if(!d.reply){
        const error='Backend returned no chatbot reply.';
        setBackendError(error);
        setMessages(m=>[...m,{role:'assistant',text:error}]);
        return;
      }
      setMessages(m=>[...m,{role:'assistant',text:d.reply}]);
    }catch(error){
      const message=error instanceof Error?error.message:'Network error: unable to reach the chatbot backend.';
      setBackendError(message);
      setMessages(m=>[...m,{role:'assistant',text:`Connection error: ${message}`}]);
    }finally{setLoading(false);}
  }

  return <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl border">
      <div className="bg-slate-950 px-5 py-4 text-white flex items-center gap-3">
        <MessageCircle/>
        <div className="min-w-0"><div className="font-bold truncate">{config?.name||'AI Chatbot'}</div><div className="text-xs text-white/60">Online assistant</div></div>
      </div>

      <div className="border-b bg-white px-4 py-3">
        <div className="mb-3 rounded-xl bg-slate-50 border border-slate-200 px-3 py-2.5">
          <div className="text-xs font-bold text-slate-900 mb-1">How to use this chatbot</div>
          <div className="text-[11px] leading-relaxed text-slate-500">1. Add your business information using the Optional section. 2. Click “Use this knowledge”. 3. Ask questions about your business, services, prices, policies, or other information you provided.</div>
        </div>

        <button onClick={()=>setShowKnowledge(v=>!v)} className="w-full flex items-center justify-between text-left">
          <span className="flex items-center gap-2 text-sm font-bold text-slate-900"><FileText size={17}/> Customize with your business</span>
          <span className={knowledgeActive?'text-emerald-600 text-[11px] font-bold':'text-slate-400 text-[11px]'}>{knowledgeActive?'Knowledge active':'Optional'}</span>
        </button>

        {showKnowledge&&<div className="mt-3 space-y-3">
          <textarea value={businessDescription} onChange={e=>setBusinessDescription(e.target.value)} rows={4} placeholder="Describe your business, products, services, prices, policies, opening hours, FAQs, etc." className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-slate-200"/>
          <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-4 text-xs font-semibold text-slate-600 cursor-pointer hover:bg-slate-100">
            <UploadCloud size={17}/> Upload TXT, MD, CSV or JSON
            <input type="file" multiple accept=".txt,.md,.csv,.json,text/plain,text/csv,application/json" className="hidden" onChange={e=>handleFiles(e.target.files)}/>
          </label>
          {fileError&&<div className="text-xs text-red-600">{fileError}</div>}
          {files.length>0&&<div className="space-y-1">{files.map(file=><div key={file.name} className="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2.5 py-2 text-xs"><span className="truncate">{file.name}</span><button type="button" onClick={()=>removeFile(file.name)} className="text-slate-400 hover:text-red-600"><X size={14}/></button></div>)}</div>}
          <div className="flex gap-2">
            <button type="button" onClick={activateKnowledge} className="flex-1 rounded-xl bg-slate-950 py-2.5 text-xs font-bold text-white">Use this knowledge</button>
            <button type="button" onClick={resetKnowledge} className="rounded-xl border px-3 py-2.5 text-xs font-semibold text-slate-600">Clear</button>
          </div>
        </div>}
      </div>

      <div className="h-[470px] overflow-y-auto p-4 space-y-3">
        {backendError&&<div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700"><div className="font-bold mb-1">Chatbot backend error</div><div className="break-words">{backendError}</div></div>}
        {messages.map((m,i)=><div key={i} className={`flex ${m.role==='user'?'justify-end':'justify-start'}`}><div className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${m.role==='user'?'text-white bg-slate-950':'bg-slate-100 text-slate-800'}`}>{m.text}</div></div>)}
        {loading&&<div className="text-xs text-slate-400">Typing…</div>}
      </div>

      <form onSubmit={e=>{e.preventDefault();send()}} className="border-t p-3 flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 rounded-xl border px-3 py-3 outline-none" placeholder={knowledgeActive?'Ask about your business…':'Type a message…'}/>
        <button disabled={loading} className="rounded-xl px-4 text-white disabled:opacity-50" style={{backgroundColor:config?.brand_color||'#020617'}}><Send size={18}/></button>
      </form>
    </div>
  </div>;
}
