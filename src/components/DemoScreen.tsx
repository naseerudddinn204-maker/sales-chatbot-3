import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { ChatbotCatalog } from './ChatbotCatalog';
import { X } from 'lucide-react';

interface DemoScreenProps {
  onNavigateToContact: () => void;
  onShowToast: (title: string, message: string) => void;
}

type BotMode = 'support' | 'sales' | 'technical';

export const DemoScreen: React.FC<DemoScreenProps> = ({
  onNavigateToContact,
  onShowToast,
}) => {
  const [botMode, setBotMode] = useState<BotMode>('support');
  const [botTone, setBotTone] = useState<'friendly' | 'concise' | 'playful'>('friendly');
  const [isLiveHandoff, setIsLiveHandoff] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [detectedIntent, setDetectedIntent] = useState('General Inbound');
  const [lastLatency, setLastLatency] = useState(148);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const countdownTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'd1',
      sender: 'bot',
      text: 'Hi! 👋 Welcome to the AI Chatbot demo. I’m ready to help—ask me anything about support, sales, or technical questions.',
      time: '12:00 PM',
      options: [
        'How do I process a refund?',
        'Can you integrate with Shopify?',
        'Transfer to a human specialist'
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleModeChange = (mode: BotMode) => {
    setBotMode(mode);
    setIsLiveHandoff(false);
    let greeting = '';
    let options: string[] = [];

    if (mode === 'support') {
      greeting = 'Hi! 👋 Customer Support Mode is active. Ask me about troubleshooting, policies, order tracking, or warranty claims.';
      options = ['Where is my shipment #4928?', 'What is your refund policy?', 'Transfer to a human rep'];
    } else if (mode === 'sales') {
      greeting = 'Hi! 👋 Sales & Lead Qualification Mode is active. Ask me about pricing, pilots, or sales calls.';
      options = ['What does enterprise pricing look like?', 'Do you offer a pilot period?', 'Connect me with Taylor in Sales'];
    } else {
      greeting = 'Hi! 👋 Technical Architect Mode is active. Ask me about latency, webhooks, security, or data residency.';
      options = ['What is your p99 latency?', 'How do webhooks fire during handoff?', 'Is customer data kept isolated?'];
    }

    setMessages([
      {
        id: Date.now().toString(),
        sender: 'bot',
        text: greeting,
        time: 'Just now',
        options
      }
    ]);
    onShowToast('Mode Updated', `Switched sandbox to ${mode.toUpperCase()} persona.`);
  };

  const handleSend = (textInput?: string) => {
    const text = (textInput || inputText).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);
    setCountdown(3);

    const startTime = performance.now();
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    countdownTimerRef.current = setInterval(() => {
      setCountdown((current) => {
        if (current === null || current <= 1) {
          if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
          countdownTimerRef.current = null;
          return null;
        }
        return current - 1;
      });
    }, 1000);

    setTimeout(() => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
      setIsTyping(false);
      setCountdown(null);
      const latency = Math.round(performance.now() - startTime + 90);
      setLastLatency(latency);

      const lower = text.toLowerCase();

      if (lower.includes('human') || lower.includes('rep') || lower.includes('agent') || lower.includes('transfer') || lower.includes('specialist')) {
        setIsLiveHandoff(true);
        setDetectedIntent('High-Value Deal / Human Escalate');
        const agentMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          sender: 'agent',
          agentName: 'Taylor · Senior Support Lead',
          text: 'Hello! Taylor here. I have seamlessly intercepted the chat. The bot transferred your full context with zero repeat questions needed. How can I assist you?',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, agentMsg]);
        onShowToast('Seamless Takeover', 'Human rep Taylor assumed control of the conversation.');
        return;
      }

      let reply = '';
      let intent = 'Website Information';
      let suggestions: string[] = [];

      // This demo assistant is strictly limited to information about this website.
      // It must not answer general knowledge, personal, political, medical, coding,
      // or unrelated questions.
      const greeting = /^(hi|hello|hey|salam|assalamualaikum|aoa|good morning|good afternoon|good evening)[!.\\s]*$/i.test(text);

      if (greeting) {
        intent = 'Website Greeting';
        reply = 'Hi! 👋 Welcome! I can help you with this website, AI chatbot features, chatbot pricing, how to use the demos, and how to get started.';
        suggestions = ['What are the chatbot prices?', 'How do I use a chatbot?', 'How do I get started?'];
      } else if (/(price|pricing|cost|plan|plans|monthly|annual|yearly|subscription|fee)/i.test(lower)) {
        intent = 'Chatbot Pricing';
        reply = 'Our chatbot plans are Starter $49/month ($39/month billed annually), Growth $149/month ($119/month annually), and Enterprise $499/month ($399/month annually). Annual billing saves 20%.';
        suggestions = ['What is included in Starter?', 'What is included in Growth?', 'What is Enterprise?'];
      } else if (/(starter|growth|enterprise)/i.test(lower)) {
        intent = 'Plan Information';
        if (/starter/i.test(lower)) {
          reply = 'Starter is $49/month or $39/month billed annually and includes 1,000 monthly conversations, 1 AI chatbot agent, website URL scraping, email support, and basic conversion metrics.';
        } else if (/growth/i.test(lower)) {
          reply = 'Growth is $149/month or $119/month billed annually and includes 5,000 monthly conversations, 3 AI agents, human handoff, integrations, custom tone and prompt guardrails, and priority support.';
        } else {
          reply = 'Enterprise is $499/month or $399/month billed annually with unlimited conversations and seats, custom grounding/fine-tuning, a dedicated Solutions Architect, SOC 2 Type II/GDPR support, SLA support, SSO, and audit logs.';
        }
        suggestions = ['Compare the plans', 'How do I get started?'];
      } else if (/(how.*(use|work)|use.*chatbot|test.*chatbot|demo|try|choose a chatbot|available chatbot)/i.test(lower)) {
        intent = 'How To Use';
        reply = 'To use a chatbot, choose one from the Available AI Chatbots section and click Demo to test it. Use Get Started when you want to request that chatbot for your business.';
        suggestions = ['What chatbots are available?', 'What does Get Started do?'];
      } else if (/(get started|buy|purchase|request|contact|sign up|signup|launch|own chatbot)/i.test(lower)) {
        intent = 'Getting Started';
        reply = 'Choose the chatbot you want, click Get Started, and submit your business details through the contact form. Enterprise customers can contact us directly from the pricing page.';
        suggestions = ['What are the prices?', 'How do I test a chatbot?'];
      } else if (/(chatbot|ai assistant|ai bot|feature|features|human handoff|shopify|slack|zendesk|knowledge|upload|website content|security|gdpr|soc 2|integration|integrations)/i.test(lower)) {
        intent = 'Website Features';
        reply = 'This website provides AI chatbots for customer support, sales, lead generation, bookings, FAQs, and other business use cases. Chatbots can use your business knowledge, support human handoff, and selected plans include integrations.';
        suggestions = ['What are the prices?', 'How do I use a chatbot?'];
      } else {
        intent = 'Out Of Scope';
        reply = 'Sorry, I can only answer questions about this website, its AI chatbots, features, pricing, demos, and how to get started. Please ask me something related to the website.';
        suggestions = ['What are the chatbot prices?', 'How do I use a chatbot?', 'How do I get started?'];
      }


      setDetectedIntent(intent);

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: isLiveHandoff ? 'agent' : 'bot',
        agentName: isLiveHandoff ? 'Taylor · Senior Support Lead' : undefined,
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: suggestions,
      };

      setMessages((prev) => [...prev, botMsg]);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, []);

  const handleResetSandbox = () => {
    setIsLiveHandoff(false);
    setDetectedIntent('General Inbound');
    handleModeChange(botMode);
  };

  return (
    <div className="flex flex-col w-full pb-12 bg-[#f9f9ff]">
      <section className="px-4 sm:px-6 pt-8 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
          Free AI Demo
        </div>
        <h1 className="font-headline text-[28px] sm:text-[36px] text-[#111827] tracking-tight font-extrabold leading-tight mt-3">Try the AI chatbot for free.</h1>
        <p className="text-[14px] sm:text-[15px] text-[#4b5563] mt-2 max-w-2xl">Test different chatbot modes, ask questions, and see how an AI assistant can support your customers and generate leads.</p>
        <div className="w-full mt-5 p-1 bg-gray-100 rounded-xl grid grid-cols-3 gap-1">
          {(['support','sales','technical'] as BotMode[]).map((mode) => (
            <button key={mode} onClick={() => handleModeChange(mode)} className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${botMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
              {mode === 'support' ? 'Support' : mode === 'sales' ? 'Sales' : 'Technical'}
            </button>
          ))}
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="mb-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">Available AI chatbots</div>
            <h2 className="mt-1 font-headline text-xl sm:text-2xl font-extrabold text-gray-950">Choose a chatbot to test.</h2>
            <p className="mt-1 text-xs sm:text-sm text-gray-600">Every enabled chatbot from the admin dashboard appears here automatically.</p>
          </div>
          <ChatbotCatalog onNavigateToContact={onNavigateToContact} />
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-4">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center"><span className="text-[10px] text-gray-400 uppercase font-semibold block">Response</span><span className="font-bold text-gray-900 text-sm">{lastLatency}ms</span></div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center min-w-0"><span className="text-[10px] text-gray-400 uppercase font-semibold block">Intent</span><span className="font-bold text-gray-900 text-xs truncate block mt-0.5">{detectedIntent}</span></div>
          <div className="bg-white border border-gray-200 rounded-xl p-3 text-center"><span className="text-[10px] text-gray-400 uppercase font-semibold block">Status</span><span className={`font-bold text-xs ${isLiveHandoff ? 'text-[#d61616]' : 'text-emerald-600'}`}>{isLiveHandoff ? 'Human' : 'AI Live'}</span></div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-6">
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsChatbotOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 rounded-full bg-[#111827] text-white shadow-2xl border-4 border-white flex items-center justify-center hover:scale-105 transition-transform cursor-pointer"
            aria-label="Open AI Chatbot"
          >
            <span className="material-symbols-outlined text-[30px]">smart_toy</span>
            <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-white" />
          </button>

          {isChatbotOpen && (
            <div className="fixed inset-0 z-50 pointer-events-none">
              <div className="pointer-events-auto absolute bottom-5 right-5 w-[calc(100vw-2rem)] max-w-md h-[min(720px,calc(100vh-2rem))] overflow-hidden rounded-3xl bg-white shadow-2xl border border-gray-200 flex flex-col">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3 bg-white">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 ${isLiveHandoff ? 'bg-[#2563eb]' : 'bg-[#111827]'}`}>
                      <span className="material-symbols-outlined text-[20px]">{isLiveHandoff ? 'support_agent' : 'smart_toy'}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-gray-900 block">{isLiveHandoff ? 'Human Specialist' : 'AI Chatbot'}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">● Online and ready</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={handleResetSandbox} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 cursor-pointer">Reset</button>
                    <button onClick={() => handleSend('Transfer to a human specialist')} className="px-3 py-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold cursor-pointer">Handoff</button>
                    <button type="button" onClick={() => setIsChatbotOpen(false)} className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer" aria-label="Close AI Chatbot"><X size={18} /></button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9f9ff]">
                  {messages.map((msg) => {
                    const isUser = msg.sender === 'user';
                    const isAgent = msg.sender === 'agent';
                    return <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                      {msg.agentName && <span className="text-[10px] font-bold text-[#2563eb] mb-1 px-1">{msg.agentName}</span>}
                      <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${isUser ? 'bg-[#111827] text-white rounded-br-sm' : isAgent ? 'bg-blue-50 border border-blue-200 text-gray-900 rounded-bl-sm' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'}`}>{msg.text}</div>
                      <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                      {msg.options && <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">{msg.options.map((opt, i) => <button key={i} onClick={() => handleSend(opt)} className="text-[11px] font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 cursor-pointer">{opt}</button>)}</div>}
                    </div>;
                  })}
                  {isTyping && <div className="flex items-center justify-center w-14 h-10 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 font-extrabold text-lg">{countdown}</div>}
                </div>
                <div className="p-3 border-t border-gray-200 bg-white">
                  <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
                    <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask the AI chatbot anything..." className="flex-1 h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/10" />
                    <button type="submit" disabled={!inputText.trim()} className="w-11 h-11 rounded-xl bg-[#2563eb] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer" aria-label="Send message"><span className="material-symbols-outlined text-[18px]">send</span></button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="px-4 sm:px-6">
        <div className="bg-[#111827] rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div><h4 className="font-headline text-base sm:text-lg font-bold text-white">Ready for your own AI chatbot?</h4><p className="text-xs sm:text-sm text-gray-300 mt-1">Launch an AI assistant for your website and start serving customers 24/7.</p></div>
          <button onClick={onNavigateToContact} className="h-10 px-4 rounded-lg bg-white text-gray-900 text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-gray-100">Get Your Chatbot</button>
        </div>
      </section>
    </div>
  );
};
