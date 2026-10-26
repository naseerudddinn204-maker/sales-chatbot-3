import React, { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { callBackend } from '../lib/backendApi';

type AgentMessage = { id: string; role: 'assistant' | 'user'; text: string };

const SITE_CONTEXT = `
You are the OrkenAI Labs website guide. Help visitors understand and use ALL website pages and tools, not just chatbot demos. Answer only questions about OrkenAI Labs, its pages, demos, tools, and requesting services. Keep answers short, friendly, plain text, and step-by-step when explaining how to use a tool. Usually answer in 1–3 short sentences. Do not use Markdown, bold formatting, asterisks, headings, or bullet lists. Do not dump the whole site guide unless asked; answer only what the visitor asked.

Website pages:
- Home (/): overview and demo cards.
- AI Tools (/ai-tools): browse the available AI tools.
- Demos (/demos): explore demonstrations.
- Automation (/automation): use the AI Automation Builder to describe a repetitive task, provide details such as audience or style if asked, then generate a workflow plan. It creates a plan only; it does not run connected workflows automatically.
- Chatbots (/chatbots): explore and try the available chatbot demos.
- Email Sender & Reader (/email): for writing, enter the purpose and relevant details of the email, then generate a draft and review it. For reading, paste the email text and choose summarize to get a short summary. It does not send emails directly; the user must review the draft and send it through their own mail app.
- Auto Post Generator (/auto-post): enter a topic or product, audience, and preferred style/goal, then generate a caption, call to action, and hashtags. An optional image may be generated when that feature is available.
- AI Content Writer (/content-writer): enter the subject, purpose, and useful details, then generate a business-content draft and review/edit it.
- Contact (/contact): submit a business inquiry for pricing, custom chatbot setup, integrations, or implementation.

Usage guidance:
When asked how to use a tool, explain the relevant page path and the next practical step(s), based only on the information above. Be clear about demo limitations. Never claim that an email was sent, an automation was executed, a purchase was completed, or an integration is connected unless that is actually confirmed. Do not invent prices or unsupported features.
For buying, custom setup, integrations, implementation, or pricing, direct visitors to /contact. If a question is unrelated to the website or cannot be answered from this information, politely ask for their phone number or email so the manager can follow up. Once they provide contact information, confirm it was saved only if the backend confirms lead_saved=true; otherwise tell them the request could not be saved and direct them to /contact.
`.trim();

function cleanAgentReply(value: string) {
  return value
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/__(.*?)__/g, '$1')
    .replace(/(^|\n)\s*#{1,6}\s+/g, '$1')
    .replace(/(^|\n)\s*[-*+]\s+/g, '$1')
    .replace(/\*([^*\n]+)\*/g, '$1')
    .replace(/_([^_\n]+)_/g, '$1')
    .replace(/`{1,3}/g, '')
    .trim();
}

const START_MESSAGES: AgentMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    text: 'Hi! I’m the OrkenAI Labs AI Agent. I can help you explore our website, try chatbot demos, understand the AI tools, or learn how to request pricing and setup.',
  },
];

export function AiAgentBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>(START_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [awaitingContact, setAwaitingContact] = useState(false);
  const [error, setError] = useState('');
  const transcriptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !transcriptRef.current) return;
    transcriptRef.current.scrollTo({ top: transcriptRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading, open]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? input).trim();
    if (!text || loading) return;
    setInput('');
    setError('');
    setMessages(current => [...current, { id: String(Date.now()), role: 'user', text }]);
    setLoading(true);
    try {
      const result = await callBackend<{ reply?: string; session_id?: string; lead_saved?: boolean }>({
        message: text,
        session_id: sessionId || undefined,
        slug: 'sales-chatbot',
        chat_mode: 'site_agent',
        business_description: SITE_CONTEXT,
        knowledge_text: SITE_CONTEXT,
      });
      if (result.session_id) setSessionId(result.session_id);
      const reply = cleanAgentReply(result.reply || 'Sorry, I could not prepare an answer. Please try again.');
      setAwaitingContact(/phone number or email|email address|contact details/i.test(reply));
      setMessages(current => [...current, { id: String(Date.now() + 1), role: 'assistant', text: reply }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Please try again in a moment.';
      setError(message);
      setMessages(current => [...current, {
        id: String(Date.now() + 1),
        role: 'assistant',
        text: 'I’m having trouble connecting right now. Please try again, or use the Contact page to reach our team.',
      }]);
    } finally {
      setLoading(false);
    }
  }

  const suggestions = ['What can I try on this website?', 'How do I buy or request pricing?', 'Show me the chatbot demos'];

  return (
    <>
      {open && (
        <section className="fixed bottom-24 right-4 z-[70] flex h-[min(580px,calc(100vh-8rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:bottom-24 sm:right-6" aria-label="AI Agent chat">
          <header className="flex items-center gap-3 bg-blue-700 px-4 py-3.5 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Bot size={23} /></span>
            <div className="min-w-0 flex-1">
              <div className="font-bold">AI Agent</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Website help · Online</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/90 hover:bg-white/15" aria-label="Close AI Agent"><X size={18} /></button>
          </header>
          <div ref={transcriptRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-3.5" aria-live="polite">
            {messages.map(message => (
              <div key={message.id} className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div className={'max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ' + (message.role === 'user' ? 'rounded-br-sm bg-blue-700 text-white' : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm')}>
                  {message.text}
                </div>
              </div>
            ))}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map(suggestion => <button key={suggestion} type="button" onClick={() => send(suggestion)} className="rounded-full border border-blue-200 bg-white px-3 py-1.5 text-left text-xs font-semibold text-blue-800 hover:bg-blue-50">{suggestion}</button>)}
              </div>
            )}
            {loading && <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" /> AI Agent is typing</div>}
          </div>
          <div className="border-t border-slate-200 bg-white p-3">
            {awaitingContact && <p className="mb-2 text-xs leading-5 text-slate-600">Share your phone number or email. We’ll save your question for the manager to follow up.</p>}
            {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
            <form onSubmit={event => { event.preventDefault(); void send(); }} className="flex items-center gap-2">
              <input value={input} onChange={event => setInput(event.target.value)} placeholder={awaitingContact ? 'Your email or phone number' : 'Ask about tools, demos, or buying…'} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" aria-label="Message AI Agent" />
              <button type="submit" disabled={!input.trim() || loading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><Send size={17} /></button>
            </form>
            <p className="mt-2 text-center text-[10px] text-slate-400">OrkenAI Labs · AI Agent demo</p>
          </div>
        </section>
      )}
      <button type="button" onClick={() => setOpen(value => !value)} className="fixed bottom-5 right-4 z-[70] inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/25 transition hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:bottom-6 sm:right-6" aria-label={open ? 'Close AI Agent chat' : 'Open AI Agent chat'} aria-expanded={open}>
        {open ? <X size={19} /> : <MessageCircle size={20} />}
        <span>AI Agent</span>
        {!open && <Sparkles size={15} className="text-blue-200" />}
      </button>
    </>
  );
}
