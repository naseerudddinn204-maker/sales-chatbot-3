import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { callBackend } from '../lib/backendApi';

interface LiveChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast: (title: string, message: string) => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [{
  id: 'm1',
  sender: 'bot',
  text: 'Hello! I am your AI sales concierge. I can answer questions about our chatbot, integrations, pricing, or connect you with a human specialist.',
  time: 'Just now',
  options: ['What models power this?', 'How does human handoff work?', 'What are your prices?', 'Connect me to a human specialist']
}];

export const LiveChatModal: React.FC<LiveChatModalProps> = ({ isOpen, onClose, onSuccessToast }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isHandedOver, setIsHandedOver] = useState(false);
  const [sessionId, setSessionId] = useState<string>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isOpen, isTyping]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const result = await callBackend<{ reply: string; session_id: string }>({
        message: text,
        session_id: sessionId,
        slug: 'sales-chatbot',
        chat_mode: 'pricing_popup'
      });
      setSessionId(result.session_id);
      const lower = text.toLowerCase();
      const human = lower.includes('human') || lower.includes('specialist') || lower.includes('representative') || lower.includes('agent');
      if (human) {
        setIsHandedOver(true);
        onSuccessToast('Human Representative Requested', 'Your request has been sent to the sales team.');
      }
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: human ? 'agent' : 'bot',
        agentName: human ? 'Sales Specialist' : undefined,
        text: result.reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: human ? undefined : ['What are your prices?', 'How does human handoff work?', 'Book a demo']
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: 'I could not reach the AI backend right now. Please try again in a moment or request a human specialist.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        options: ['Try again', 'Connect me to a human specialist']
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[85vh] max-h-[640px] border border-gray-100">
        <div className="px-4 py-3.5 bg-[#f0f3ff] border-b border-gray-200/80 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="relative"><div className="w-9 h-9 rounded-xl bg-[#0266ff] flex items-center justify-center text-white shadow-xs"><span className="material-symbols-outlined text-[20px]">{isHandedOver ? 'support_agent' : 'smart_toy'}</span></div><span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white animate-pulse" /></div>
            <div><div className="flex items-center gap-2"><h3 className="font-headline font-bold text-sm text-gray-900 leading-tight">{isHandedOver ? 'Sales Specialist' : 'ChatBot AI Concierge'}</h3><span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">{isHandedOver ? 'Human Requested' : 'Active'}</span></div><p className="text-[11px] text-gray-500">Powered by your Sales Chatbot backend</p></div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-200/60 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer" aria-label="Close live chat"><span className="material-symbols-outlined text-[20px]">close</span></button>
        </div>
        <div className="bg-[#eff6ff] px-4 py-2 border-b border-blue-100 flex items-center justify-between text-xs text-[#1e40af]"><div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px]">verified_user</span><span>Need a human sales specialist?</span></div>{!isHandedOver && <button onClick={() => handleSend('Connect me to a human specialist')} className="font-bold underline hover:text-blue-900 cursor-pointer">Request Rep</button>}</div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#f9f9ff]">
          {messages.map(msg => { const isUser=msg.sender==='user'; const isAgent=msg.sender==='agent'; return <div key={msg.id} className={`flex flex-col ${isUser?'items-end':'items-start'}`}>
            {msg.agentName && <span className="text-[10px] font-semibold text-blue-700 mb-1 px-1">{msg.agentName}</span>}
            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${isUser?'bg-[#0266ff] text-white rounded-br-xs':isAgent?'bg-amber-50 border border-amber-200 text-gray-900 rounded-bl-xs':'bg-white border border-gray-200/80 text-gray-900 rounded-bl-xs'}`}>{msg.text}</div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
            {msg.options && <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">{msg.options.map((opt,i)=><button key={i} onClick={()=>handleSend(opt==='Try again' ? textForRetry(messages) : opt)} className="text-[11px] font-medium bg-white hover:bg-blue-50 text-gray-700 hover:text-[#0266ff] border border-gray-200 rounded-lg px-2.5 py-1 transition-all cursor-pointer shadow-xs active:scale-95 text-left">{opt}</button>)}</div>}
          </div> })}
          {isTyping && <div className="flex items-center gap-1.5 p-2.5 bg-white border border-gray-200 rounded-xl w-16"><span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"/><span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.2s]"/><span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:0.4s]"/></div>}
          <div ref={messagesEndRef}/>
        </div>
        <div className="p-3 bg-white border-t border-gray-200"><form onSubmit={e=>{e.preventDefault();handleSend();}} className="flex items-center gap-2"><input type="text" value={inputText} onChange={e=>setInputText(e.target.value)} placeholder="Ask anything about our AI chatbot..." className="flex-1 h-10 px-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0266ff] focus:bg-white transition-all"/><button type="submit" disabled={!inputText.trim()||isTyping} className="w-10 h-10 rounded-xl bg-[#0266ff] hover:bg-blue-700 disabled:opacity-40 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs" aria-label="Send message"><span className="material-symbols-outlined text-[18px]">send</span></button></form></div>
      </div>
    </div>
  );
};

function textForRetry(messages: ChatMessage[]) {
  const last = [...messages].reverse().find(m => m.sender === 'user');
  return last?.text || 'Hello';
}
