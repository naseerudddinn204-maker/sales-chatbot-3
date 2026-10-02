import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

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

      // Check for human takeover
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
    <div className="flex flex-col w-full pb-10">
      {/* Header Info */}
      <section className="px-4 sm:px-6 py-6 flex flex-col items-start gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fee2e2] text-[#991b1b]">
          <span className="w-2 h-2 rounded-full bg-[#d61616] animate-pulse" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Live Interactive Sandbox
          </span>
        </div>

        <h1 className="font-headline text-[26px] sm:text-[32px] text-[#111827] tracking-tight font-extrabold leading-[1.2]">
          Experience Real-Time Autonomy
        </h1>

        <p className="text-[14px] sm:text-[15px] text-[#4b5563]">
          Test bot intelligence, prompt adherence, and zero-delay human handoffs in a sandbox pre-loaded with mock enterprise data.
        </p>

        {/* Persona Mode Switcher */}
        <div className="w-full mt-3 p-1 bg-gray-200/70 rounded-xl grid grid-cols-3 gap-1">
          <button
            onClick={() => handleModeChange('support')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              botMode === 'support'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Support Bot
          </button>
          <button
            onClick={() => handleModeChange('sales')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              botMode === 'sales'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sales Closer
          </button>
          <button
            onClick={() => handleModeChange('technical')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              botMode === 'technical'
                ? 'bg-white text-gray-900 shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Tech Architect
          </button>
        </div>
      </section>

      {/* Telemetry Micro-Bar */}
      <section className="px-4 sm:px-6 pb-3">
        <div className="bg-[#f0f3ff] rounded-xl p-3 border border-blue-100 grid grid-cols-3 gap-2 text-center text-xs">
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-semibold">Latency</span>
            <span className="font-bold text-gray-900 tabular-nums">{lastLatency}ms</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-semibold">Detected Intent</span>
            <span className="font-bold text-[#0050cc] truncate block">{detectedIntent}</span>
          </div>
          <div>
            <span className="text-[10px] text-gray-500 block uppercase font-semibold">Handoff Status</span>
            <span
              className={`font-bold ${
                isLiveHandoff ? 'text-[#ac0008]' : 'text-[#10b981]'
              }`}
            >
              {isLiveHandoff ? 'Human Engaged' : 'AI Autonomous'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Chat Interface */}
      <section className="px-4 sm:px-6 pb-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden flex flex-col h-[520px]">
          {/* Chat Window Top Bar */}
          <div className="p-3.5 bg-gray-50/90 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-white ${
                  isLiveHandoff ? 'bg-[#d61616]' : 'bg-[#0266ff]'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isLiveHandoff ? 'support_agent' : 'smart_toy'}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block leading-tight">
                  {isLiveHandoff ? 'Live Specialist Active' : 'ChatBot AI Agent'}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Grounded in company docs
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleResetSandbox}
                title="Reset conversation"
                className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={() => handleSend('Transfer to a human specialist')}
                className="px-2.5 py-1 rounded-lg bg-[#fee2e2] text-[#991b1b] text-xs font-bold hover:bg-red-100 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">support_agent</span>
                <span>Handoff</span>
              </button>
            </div>
          </div>

          {/* Chat Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#f9f9ff]">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';
              const isAgent = msg.sender === 'agent';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  {msg.agentName && (
                    <span className="text-[10px] font-bold text-[#ac0008] mb-1 px-1">
                      {msg.agentName}
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-[#0266ff] text-white rounded-br-xs'
                        : isAgent
                        ? 'bg-amber-50 border border-amber-200 text-gray-900 rounded-bl-xs'
                        : 'bg-white border border-gray-200 text-gray-900 rounded-bl-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>

                  {msg.options && (
                    <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                      {msg.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(opt)}
                          className="text-[11px] font-medium bg-white hover:bg-blue-50 text-gray-700 hover:text-[#0266ff] border border-gray-200 rounded-lg px-2.5 py-1 transition-all cursor-pointer shadow-xs active:scale-95 text-left"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-2 bg-white border border-gray-200 rounded-xl w-14">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-gray-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message or query..."
                className="flex-1 h-10 px-3.5 bg-[#f3f4f6] border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0266ff] transition-all"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="w-10 h-10 rounded-xl bg-[#d61616] hover:bg-[#bd1313] disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs"
                aria-label="Send message"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Enterprise Integration Callout */}
      <section className="px-4 sm:px-6">
        <div className="bg-[#eff6ff] rounded-2xl p-4 sm:p-5 border border-blue-100 flex items-center justify-between gap-3">
          <div>
            <h4 className="font-headline text-sm sm:text-base font-bold text-gray-900">
              Need a sandbox with your live website data?
            </h4>
            <p className="text-xs text-gray-600 mt-0.5">
              Submit your URL and our engineers will spin up a private instance in 15 minutes.
            </p>
          </div>
          <button
            onClick={onNavigateToContact}
            className="h-9 px-3.5 rounded-lg bg-[#0266ff] hover:bg-blue-700 text-white text-xs font-bold whitespace-nowrap shadow-xs cursor-pointer transition-colors"
          >
            Request Sandbox
          </button>
        </div>
      </section>
    </div>
  );
};
