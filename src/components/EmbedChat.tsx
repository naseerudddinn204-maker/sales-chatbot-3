import React, { useEffect, useState } from 'react';
import { FileText, MessageCircle, Send, Upload, X, ChevronDown, ChevronUp, Mic, MicOff, Volume2 } from 'lucide-react';
import { Header } from './Header';
import { HomeScreen } from './HomeScreen';
import { ScreenTab } from '../types';

const SUPABASE_URL = 'https://tlkmcfpzfdokcnyyvkov.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_-gNvioLExBonu8hGuWa8lQ_eIWmhMn6';
const API = import.meta.env.VITE_SUPABASE_API_URL || SUPABASE_URL + '/functions/v1/sales-chatbot-api';

type Message = { role: 'user' | 'assistant'; text: string };

const headers = { apikey: SUPABASE_KEY, 'Content-Type': 'application/json' };

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
  const [showKnowledge, setShowKnowledge] = useState(false);
  const [listening, setListening] = useState(false);

  function toggleVoiceInput() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBackendError('Voice input is not supported in this browser. Please use Chrome or Edge.');
      return;
    }
    if (listening) {
      (window as any).__salesChatRecognition?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript || '';
      setInput(transcript);
      if (transcript.trim()) sendVoiceMessage(transcript.trim());
    };
    recognition.onerror = () => { setListening(false); setBackendError('Could not hear your voice. Please try again.'); };
    recognition.onend = () => { setListening(false); (window as any).__salesChatRecognition = null; };
    (window as any).__salesChatRecognition = recognition;
    setBackendError('');
    recognition.start();
  }

  function speakAnswer(text: string) {
    if (!('speechSynthesis' in window)) {
      setBackendError('Voice playback is not supported in this browser.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }

  async function sendVoiceMessage(text: string) {
    if (!text || loading) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const r = await fetch(API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, session_id: session, slug, business_description: config?.knowledge_description || '', knowledge_text: [config?.knowledge_text || '', visitorDescription.trim(), visitorKnowledge].filter(Boolean).join('\n\n') }) });
      const d = await r.json().catch(() => ({}));
      if (d.session_id) setSession(d.session_id);
      if (!r.ok || !d.reply) throw new Error(d?.error || 'Backend returned no chatbot reply.');
      setMessages(m => [...m, { role: 'assistant', text: d.reply }]);
      speakAnswer(d.reply);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Connection error.';
      setBackendError(message);
      setMessages(m => [...m, { role: 'assistant', text: message }]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function loadConfig() {
      try {
        const url = SUPABASE_URL + '/rest/v1/chatbots?select=id,name,slug,description,welcome_message,brand_color,logo_url,knowledge_description,knowledge_text&slug=eq.' + encodeURIComponent(slug) + '&enabled=eq.true&limit=1';
        const response = await fetch(url, { headers });
        const data = await response.json().catch(() => []);
        if (!response.ok || !Array.isArray(data) || !data[0]) throw new Error('Unable to load chatbot configuration.');
        if (!cancelled) {
          setConfig(data[0]);
          if (data[0].welcome_message) setMessages([{ role: 'assistant', text: data[0].welcome_message }]);
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
      body: JSON.stringify({ name: 'Website Chat Visitor', email: null, company: null, phone, message: question, company_website: null, traffic_volume: null, primary_goal: 'Manager follow-up' }),
    });
    if (!response.ok) throw new Error((await response.text()) || 'Unable to save the client question.');
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
        setMessages(m => [...m, { role: 'assistant', text: 'Thank you! Your contact number has been recorded. Our manager will follow up with you.' }]);
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
    <div className="relative w-full min-h-screen overflow-hidden bg-[#f9f9ff]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="min-h-screen scale-[1.02] blur-[7px] opacity-75">
          <Header
            currentTab={'home' as ScreenTab}
            onTabChange={() => {}}
            isFramedView={false}
            onToggleFrameView={() => {}}
          />
          <main className="pt-16">
            <HomeScreen
              onNavigateToDemo={() => {}}
              onNavigateToContact={() => {}}
              onOpenLiveChat={() => {}}
            />
          </main>
        </div>
        <div className="absolute inset-0 bg-white/45" />
      </div>

      <div className="relative z-50 w-full min-h-screen flex items-center justify-center p-2.5 sm:p-4 md:p-6">
        <div className="w-full max-w-[520px] h-[calc(100vh-1.25rem)] sm:h-[min(820px,calc(100vh-2rem))] md:h-[min(860px,calc(100vh-3rem))] max-h-[900px] overflow-hidden rounded-xl sm:rounded-2xl bg-white shadow-2xl border border-slate-200 flex flex-col">
        <div className="shrink-0 bg-[#1e3a5f] px-5 py-3.5 text-white flex items-center gap-3">
          <MessageCircle />
          <div className="min-w-0 flex-1">
            <div className="font-bold truncate">{config?.name || 'AI Chatbot'}</div>
            <div className="text-xs text-white/60">Online assistant</div>
          </div>
        </div>

        <div className="shrink-0 border-b bg-slate-50 px-3 py-2">
          <div className="flex items-center justify-end">
            <button
              type="button"
              onClick={() => setShowKnowledge(v => !v)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 shadow-sm hover:bg-slate-50"
              aria-expanded={showKnowledge}
            >
              {showKnowledge ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
              {showKnowledge ? 'Hide information' : 'Add information'}
            </button>
          </div>
          {showKnowledge && <div className="mt-2 rounded-xl border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-slate-900">How to use this chatbot</div>
                <div className="text-xs text-slate-500">Provide your business information below, then the chatbot will answer using that information.</div>
              </div>
              {(visitorDescription || visitorKnowledge) && (
                <button type="button" onClick={clearVisitorKnowledge} className="text-xs text-slate-500 hover:text-red-600"><X size={15}/></button>
              )}
            </div>
            <textarea value={visitorDescription} onChange={e => setVisitorDescription(e.target.value)} rows={2} className="mt-2 w-full resize-none rounded-lg border px-3 py-2 text-sm outline-none" placeholder="Business description, products, services, prices, policies, FAQs..." />
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input id={"knowledge-file-" + slug} type="file" accept=".pdf,.txt,.md,.csv,.json,.html,.htm,.xml,text/plain,text/markdown,text/csv,application/json,application/pdf,text/html,text/xml" className="hidden" onChange={e => handleKnowledgeFile(e.target.files?.[0])} />
              <label htmlFor={"knowledge-file-" + slug} className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700">
                <Upload size={14}/> {knowledgeLoading ? 'Reading…' : 'Upload information file'}
              </label>
              {(visitorDescription.trim() || visitorKnowledge.trim()) && (
                <button type="button" onClick={() => setShowKnowledge(false)} className="inline-flex items-center gap-1.5 rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800">
                  <FileText size={14}/> Use knowledge
                </button>
              )}
              {knowledgeFile && <span className="flex min-w-0 items-center gap-1 text-xs text-emerald-700"><FileText size={13}/><span className="truncate">{knowledgeFile}</span></span>}
            </div>
            <div className="mt-2 text-[11px] text-slate-400">Supported: PDF, TXT, MD, CSV, JSON, HTML, XML. This information is used for this chat session.</div>
          </div>}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
          {backendError && <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{backendError}</div>}
          {messages.map((m, i) => (
            <div key={i} className={'flex ' + (m.role === 'user' ? 'justify-end' : 'justify-start')}>
              <div className={'max-w-[82%] rounded-2xl px-4 py-3 text-sm ' + (m.role === 'user' ? 'text-white bg-slate-950' : 'bg-slate-100 text-slate-800')}>
                <div className="flex items-end gap-2">
                  <div className="whitespace-pre-wrap">{m.text}</div>
                  {m.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => speakAnswer(m.text)}
                      className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-white hover:text-slate-900"
                      aria-label="Read answer aloud"
                      title="Read answer aloud"
                    >
                      <Volume2 size={15} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {loading && <div className="text-xs text-slate-400">Typing…</div>}
        </div>

        <form onSubmit={e => { e.preventDefault(); send(); }} className="shrink-0 border-t p-3 bg-white flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 min-w-0 rounded-xl border px-3 py-2.5 outline-none" placeholder="Ask about this business…" aria-label="Ask the chatbot" />
          <button type="button" onClick={toggleVoiceInput} disabled={loading} className="rounded-xl px-3 text-white disabled:opacity-50" style={{ backgroundColor: listening ? '#dc2626' : (config?.brand_color || '#020617') }} aria-label={listening ? 'Stop voice input' : 'Ask by voice'}>{listening ? <MicOff size={18} /> : <Mic size={18} />}</button>
          <button type="submit" disabled={loading} className="rounded-xl px-4 text-white disabled:opacity-50" style={{ backgroundColor: config?.brand_color || '#020617' }}><Send size={18} /></button>
        </form>
        </div>
      </div>
    </div>
  );
}