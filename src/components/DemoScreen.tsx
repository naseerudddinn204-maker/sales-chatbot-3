import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { ChatbotCatalog } from './ChatbotCatalog';

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
  const [detectedIntent, setDetectedIntent] = useState('General Inbound');
  const [lastLatency, setLastLatency] = useState(148);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'd1',
      sender: 'bot',
      text: 'Welcome to the interactive ChatBot sandbox! I am operating in Customer Support mode. Test my speed, knowledge, and our Zero Robot Lock-in human handoff.',
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
      greeting = 'Customer Support Mode active. Ask me about troubleshooting, policies, order tracking, or warranty claims.';
      options = ['Where is my shipment #4928?', 'What is your refund policy?', 'Transfer to a human rep'];
    } else if (mode === 'sales') {
      greeting = 'Sales & Lead Qualification Mode active. I proactively identify buyer intent, evaluate budget & timeline, and schedule sales calls.';
      options = ['What does enterprise pricing look like?', 'Do you offer a pilot period?', 'Connect me with Taylor in Sales'];
    } else {
      greeting = 'Technical Architect Mode active. Ask me about latency benchmarks, vector embeddings, webhook events, and SOC-2 data residency.';
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

    const startTime = performance.now();

    setTimeout(() => {
      setIsTyping(false);
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
      let intent = 'General QA';
      let suggestions: string[] = [];

      if (lower.includes('refund') || lower.includes('return') || lower.includes('money')) {
        intent = 'Policy / Billing';
        reply = 'Refunds are automatically processed within 3-5 business days to the original payment method upon return parcel scan. Would you like me to generate a prepaid label?';
        suggestions = ['Yes, generate label', 'Transfer to human rep'];
      } else if (lower.includes('shopify') || lower.includes('ecommerce') || lower.includes('catalog')) {
        intent = 'Integration Lookup';
        reply = 'We support real-time Shopify & BigCommerce webhooks. Product catalogs, live inventory balances, and order statuses update instantly across chats.';
        suggestions = ['Can I test live cart recovery?', 'Talk with AI Experts'];
      } else if (lower.includes('pricing') || lower.includes('cost') || lower.includes('budget')) {
        intent = 'Commercial Lead Qualification';
        reply = 'Our Growth tier is $149/mo for 5,000 monthly conversations with unlimited team seats and CRM sync. Custom enterprise volume starts at $499/mo.';
        suggestions = ['Book 15-min Demo Call', 'Transfer to sales rep'];
      } else if (lower.includes('latency') || lower.includes('speed') || lower.includes('fast')) {
        intent = 'Performance Telemetry';
        reply = `Our streaming architecture delivers average time-to-first-token (TTFT) under 180ms worldwide, as demonstrated by this reply (resolved in ${latency}ms).`;
        suggestions = ['Check security specs', 'Transfer to technical architect'];
      } else if (lower.includes('security') || lower.includes('soc') || lower.includes('gdpr')) {
        intent = 'Compliance & Security';
        reply = 'We are SOC 2 Type II certified and fully GDPR compliant with EU data residency options. Zero customer conversation logs are ever fed back into public model weights.';
        suggestions = ['Download security whitepaper', 'Talk with AI Experts'];
      } else {
        intent = 'Inbound Conversational';
        reply = `Great question! In ${botMode} mode with a ${botTone} tone, our model grounds every answer exclusively in your company's uploaded docs with zero hallucination.`;
        suggestions = ['Test human takeover', 'Schedule 1-on-1 walkthrough'];
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
    }, 600);
  };

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
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[520px]">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 ${isLiveHandoff ? 'bg-[#d61616]' : 'bg-[#111827]'}`}>
                <span className="material-symbols-outlined text-[18px]">{isLiveHandoff ? 'support_agent' : 'smart_toy'}</span>
              </div>
              <div className="min-w-0"><span className="text-sm font-bold text-gray-900 block">{isLiveHandoff ? 'Human Specialist' : 'AI Chatbot'}</span><span className="text-[10px] text-emerald-600 font-semibold">● Online and ready</span></div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={handleResetSandbox} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer">Reset</button>
              <button onClick={() => handleSend('Transfer to a human specialist')} className="px-3 py-2 rounded-lg bg-[#fee2e2] text-[#991b1b] text-xs font-bold cursor-pointer">Handoff</button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9f9ff]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isAgent = msg.sender === 'agent';
              return <div key={msg.id} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                {msg.agentName && <span className="text-[10px] font-bold text-[#d61616] mb-1 px-1">{msg.agentName}</span>}
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed ${isUser ? 'bg-[#111827] text-white rounded-br-sm' : isAgent ? 'bg-[#fff7ed] border border-orange-200 text-gray-900 rounded-bl-sm' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'}`}>{msg.text}</div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
                {msg.options && <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">{msg.options.map((opt, i) => <button key={i} onClick={() => handleSend(opt)} className="text-[11px] font-medium bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg px-2.5 py-1.5 cursor-pointer">{opt}</button>)}</div>}
              </div>;
            })}
            {isTyping && <div className="flex items-center gap-1.5 p-2.5 bg-white border border-gray-200 rounded-xl w-14"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" /><span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" /><span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" /></div>}
          </div>
          <div className="p-3 border-t border-gray-200">
            <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="flex items-center gap-2">
              <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Ask the AI chatbot anything..." className="flex-1 h-11 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-gray-900/10" />
              <button type="submit" disabled={!inputText.trim()} className="w-11 h-11 rounded-xl bg-[#d61616] hover:bg-[#bd1313] disabled:opacity-40 text-white flex items-center justify-center cursor-pointer" aria-label="Send message"><span className="material-symbols-outlined text-[18px]">send</span></button>
            </form>
          </div>
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
