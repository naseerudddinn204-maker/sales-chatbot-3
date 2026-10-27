import React, { useEffect, useRef, useState } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle } from 'lucide-react';
import { callBackend } from '../lib/backendApi';

type AgentMessage = { id: string; role: 'assistant' | 'user'; text: string };

const SITE_CONTEXT = `
You are the OrkenAI Labs website-wide assistant. Treat every page and tool as equally important; do not prioritize chatbot demos unless the visitor specifically asks about chatbots. Use the following website knowledge to answer the visitor's actual question. Keep replies short, clear, friendly, and practical, usually 1–3 sentences. For usage questions, explain the correct page and the next step. Do not dump the entire knowledge base in a reply. Use plain text only; never output Markdown formatting, bold markers, asterisks, headings, or bullet lists.

WEBSITE OVERVIEW
OrkenAI Labs demonstrates AI tools, workflow automation ideas, business content tools, email utilities, and chatbot demos for businesses.

PUBLIC PAGES AND HOW TO USE THEM
Home (/): overview of the website and demo cards.
AI Tools (/ai-tools): browse the AI tools available on the site.
Demos (/demos): explore available product demonstrations.
Automation (/automation): AI Automation Builder. Describe a repetitive task or process, add relevant context, and generate a workflow plan. This is a planning demo and does not automatically execute connected workflows.
Chatbots (/chatbots): browse and try the available chatbot demos. Discuss these when asked, but do not make chatbots the default topic for unrelated tool questions.
Email Sender & Reader (/email): Email Sender helps draft an email from the purpose and details the visitor provides. Email Reader summarizes an email when the visitor pastes its text and chooses the summarize action. Drafts need review; the tool does not send emails directly.
Auto Post Generator (/auto-post): enter a topic/product, audience, and preferred goal or style, then generate a social caption, call to action, and hashtags. Optional image generation may be available.
AI Content Writer (/content-writer): enter the topic, intended purpose, and useful context to create a business-content draft; review and edit the result.
Contact (/contact): submit an inquiry about pricing, buying, custom setup, integrations, or implementation.

LIMITATIONS AND ACCURACY
There is no confirmed checkout or published price list in this knowledge. Direct pricing and custom-service questions to /contact. Do not claim a message was sent, an automation ran, a purchase completed, or an integration connected unless the website explicitly confirms it. Never invent features, prices, or business details.

RESPONSE RULES
Answer based on this knowledge and address only what the visitor asked. When asked how to use a tool, give the relevant page path and a practical next step. If the visitor asks an unrelated question or something this knowledge does not cover, do not answer it. Reply: "I can't answer that because it isn't related to this website. If you share your mobile number or email address, I'll forward it to my manager, and they'll contact you as soon as possible." Do not answer the unrelated question. Confirm that contact details were saved only if the backend confirms the lead was saved.
`.trim();

function isContactValue(value: string) {
  const candidate = value.trim();
  const digits = candidate.replace(/\D/g, '');
  const phone = /^\+?[\d\s().-]{7,24}$/.test(candidate) && digits.length >= 7 && digits.length <= 15;
  const email = candidate.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate);
  return phone || email;
}

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
    text: 'Hi! I’m Labs 3.5 Flash. I can help you explore our website, try chatbot demos, understand the AI tools, or learn how to request pricing and setup.',
  },
];

export function AiAgentBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<AgentMessage[]>(START_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [awaitingContact, setAwaitingContact] = useState(false);
  const [followupCompleted, setFollowupCompleted] = useState(false);
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
      if (!awaitingContact && /\b(price|pricing|cost|monthly|per month|subscription|how much|chatbot fee|chatbot cost)\b/i.test(text)) {
        setMessages(current => [...current, { id: String(Date.now() + 1), role: 'assistant', text: "We don’t have a confirmed monthly chatbot price list on this website yet. Please visit the Contact page at /contact to request pricing and setup details from our team." }]);
        return;
      }
      if (!awaitingContact && /^(ok(?:ay)?|thanks?|thank you|got it|alright|understood|great|cool)[!.?\\s]*$/i.test(text)) {
        setMessages(current => [...current, { id: String(Date.now() + 1), role: 'assistant', text: "Sounds good! Let me know which AI tool or demo you’d like help with, and I’ll guide you to the right page." }]);
        return;
      }
      if (followupCompleted && /^(ok(?:ay)?|thanks?|thank you|got it|alright|understood|great|cool)[!.?\s]*$/i.test(text)) {
        setMessages(current => [...current, { id: String(Date.now() + 1), role: 'assistant', text: "You're welcome! Our manager can follow up using the contact details you shared. Is there anything else about our website I can help you with?" }]);
        return;
      }
      if (followupCompleted) setFollowupCompleted(false);
      const contactFollowup = awaitingContact && isContactValue(text);
      if (contactFollowup && sessionId) {
        const result = await callBackend<{ message?: string; lead_saved?: boolean }>({
          action: 'manager_followup',
          contact: text,
          consent: true,
          session_id: sessionId,
          slug: 'sales-chatbot',
        });
        const reply = result.message || 'Thank you! Your contact number has been recorded for manager follow-up.';
        setAwaitingContact(false);
        setFollowupCompleted(true);
        setMessages(current => [...current, { id: String(Date.now() + 1), role: 'assistant', text: reply }]);
      } else {
        const result = await callBackend<{ reply?: string; session_id?: string; lead_saved?: boolean }>({
          message: text,
          session_id: sessionId || undefined,
          slug: 'sales-chatbot',
          chat_mode: 'pricing_popup',
          business_description: SITE_CONTEXT,
          knowledge_text: SITE_CONTEXT,
        });
        if (result.session_id) setSessionId(result.session_id);
        const cleanedReply = cleanAgentReply(result.reply || 'Sorry, I could not prepare an answer. Please try again.');
        const reply = /i don't have that information|i don't have an answer to that question|add the relevant details in the business knowledge/i.test(cleanedReply)
          ? "I can't answer that because it isn't related to this website. If you share your phone number, our manager can follow up with you about your question."
          : cleanedReply;
        setAwaitingContact(/phone number|contact details|mobile number/i.test(reply));
        setMessages(current => [...current, { id: String(Date.now() + 1), role: 'assistant', text: reply }]);
      }
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
        <section className="fixed bottom-24 right-4 z-[70] flex h-[min(580px,calc(100vh-8rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/20 sm:bottom-24 sm:right-6" aria-label="Labs 3.5 Flash chat">
          <header className="flex items-center gap-3 bg-blue-700 px-4 py-3.5 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15"><Bot size={23} /></span>
            <div className="min-w-0 flex-1">
              <div className="font-bold">Labs 3.5 Flash</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-blue-100"><span className="h-2 w-2 rounded-full bg-emerald-300" /> Website help · Online</div>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-white/90 hover:bg-white/15" aria-label="Close Labs 3.5 Flash"><X size={18} /></button>
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
            {loading && <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500"><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:120ms]" /><span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:240ms]" /> Labs 3.5 Flash is typing</div>}
          </div>
          <div className="border-t border-slate-200 bg-white p-3">
            {awaitingContact && <p className="mb-2 text-xs leading-5 text-slate-600">Share your phone number or email. We’ll save your question for the manager to follow up.</p>}
            {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
            <form onSubmit={event => { event.preventDefault(); void send(); }} className="flex items-center gap-2">
              <input value={input} onChange={event => setInput(event.target.value)} placeholder={awaitingContact ? 'Your email or phone number' : 'Ask about tools, demos, or buying…'} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" aria-label="Message Labs 3.5 Flash" />
              <button type="submit" disabled={!input.trim() || loading} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-700 text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40" aria-label="Send message"><Send size={17} /></button>
            </form>
            <p className="mt-2 text-center text-[10px] text-slate-400">Labs 3.5 Flash · Website assistant</p>
          </div>
        </section>
      )}
      <button type="button" onClick={() => setOpen(value => !value)} className="fixed bottom-5 right-4 z-[70] inline-flex items-center gap-2 rounded-full bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/25 transition hover:-translate-y-0.5 hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:bottom-6 sm:right-6" aria-label={open ? 'Close Labs 3.5 Flash chat' : 'Open Labs 3.5 Flash chat'} aria-expanded={open}>
        {open ? <X size={19} /> : <MessageCircle size={20} />}
        <span>Labs 3.5 Flash</span>
        {!open && <Sparkles size={15} className="text-blue-200" />}
      </button>
    </>
  );
}
