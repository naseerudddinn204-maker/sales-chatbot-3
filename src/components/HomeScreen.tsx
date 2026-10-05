import React from 'react';
import { ArrowRight, Bot, Check, MessageSquare, Zap, ShieldCheck, BarChart3 } from 'lucide-react';

interface HomeScreenProps {
  onNavigateToDemo: () => void;
  onNavigateToContact: () => void;
  onOpenLiveChat: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToDemo,
  onNavigateToContact,
  onOpenLiveChat,
}) => {
  return (
    <div className="w-full overflow-hidden bg-white text-gray-900">
      {/* Hero */}
      <section className="px-5 sm:px-8 lg:px-12 pt-10 sm:pt-14 pb-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
              AI Automation for Business
            </div>

            <h1 className="mt-5 font-headline text-[38px] sm:text-[52px] lg:text-[60px] font-extrabold leading-[1.03] tracking-[-0.03em] text-gray-950">
              Turn your website into an
              <span className="text-blue-600"> AI sales assistant.</span>
            </h1>

            <p className="mt-5 max-w-xl text-[16px] sm:text-[18px] leading-7 text-gray-600">
              Ready-to-use AI chatbots that answer customers, qualify leads, support visitors, and help your business sell 24/7.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                onClick={onNavigateToDemo}
                className="h-12 px-6 rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Bot size={18} />
                Explore AI Chatbots
                <ArrowRight size={16} />
              </button>
              <button
                onClick={onNavigateToContact}
                className="h-12 px-6 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-900 text-sm font-bold flex items-center justify-center gap-2 transition-all"
              >
                Get Your Chatbot
              </button>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-gray-500">
              <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> 24/7 customer support</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Lead generation</span>
              <span className="flex items-center gap-1.5"><Check size={14} className="text-emerald-600" /> Easy website integration</span>
            </div>
          </div>

          {/* AI Automation Visual */}
          <div className="relative">
            <div className="absolute -inset-6 bg-blue-50/70 rounded-[40px] blur-2xl" />
            <div className="relative rounded-[28px] border border-gray-200 bg-gray-50 p-4 sm:p-6 shadow-xl">
              <div className="rounded-2xl bg-white border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-gray-950 text-white flex items-center justify-center">
                      <Bot size={19} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">AI Sales Assistant</div>
                      <div className="text-[10px] text-emerald-600 font-semibold">● Online</div>
                    </div>
                  </div>
                  <Zap size={17} className="text-blue-600" />
                </div>

                <div className="p-4 sm:p-5 space-y-3">
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Bot size={14} /></div>
                    <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-3.5 py-2.5 text-xs sm:text-sm text-gray-700">
                      Hi! How can I help your business today?
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-sm bg-gray-950 px-3.5 py-2.5 text-xs sm:text-sm text-white">
                      I want to see your chatbot plans.
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0"><Bot size={14} /></div>
                    <div className="rounded-2xl rounded-tl-sm bg-gray-100 px-3.5 py-2.5 text-xs sm:text-sm text-gray-700">
                      Absolutely. I can show you plans and help you choose the right one.
                    </div>
                  </div>
                </div>

                <div className="px-4 py-3 border-t border-gray-100 grid grid-cols-3 gap-2">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-center">
                    <MessageSquare size={15} className="mx-auto text-blue-600" />
                    <span className="mt-1 block text-[10px] font-bold text-gray-600">Chat</span>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-2.5 text-center">
                    <Zap size={15} className="mx-auto text-emerald-600" />
                    <span className="mt-1 block text-[10px] font-bold text-gray-600">Automate</span>
                  </div>
                  <div className="rounded-xl bg-purple-50 p-2.5 text-center">
                    <BarChart3 size={15} className="mx-auto text-purple-600" />
                    <span className="mt-1 block text-[10px] font-bold text-gray-600">Convert</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-xl bg-white border border-gray-200 p-3 text-center">
                  <div className="text-lg font-extrabold text-gray-950">24/7</div>
                  <div className="text-[10px] text-gray-500">Always online</div>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-3 text-center">
                  <div className="text-lg font-extrabold text-gray-950">AI</div>
                  <div className="text-[10px] text-gray-500">Smart replies</div>
                </div>
                <div className="rounded-xl bg-white border border-gray-200 p-3 text-center">
                  <div className="text-lg font-extrabold text-gray-950">1-click</div>
                  <div className="text-[10px] text-gray-500">Website setup</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What we sell */}
      <section className="px-5 sm:px-8 lg:px-12 py-10 bg-gray-50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Simple AI solutions</div>
            <h2 className="mt-2 font-headline text-2xl sm:text-3xl font-extrabold text-gray-950">
              AI chatbots built to do real business work.
            </h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Pick a chatbot, test it live, choose a plan, and put it on your website.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-gray-200 p-5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><MessageSquare size={20} /></div>
              <h3 className="mt-4 font-bold">Sales Chatbot</h3>
              <p className="mt-1 text-sm text-gray-600">Answer product questions, qualify prospects, and turn visitors into leads.</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Bot size={20} /></div>
              <h3 className="mt-4 font-bold">Support Chatbot</h3>
              <p className="mt-1 text-sm text-gray-600">Give customers instant answers and reduce repetitive support requests.</p>
            </div>
            <div className="rounded-2xl bg-white border border-gray-200 p-5">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center"><Zap size={20} /></div>
              <h3 className="mt-4 font-bold">Custom AI Automation</h3>
              <p className="mt-1 text-sm text-gray-600">Connect your AI assistant to the workflows and information your business needs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-5 sm:px-8 lg:px-12 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">How it works</div>
            <h2 className="mt-2 font-headline text-2xl sm:text-3xl font-extrabold text-gray-950">From idea to AI assistant.</h2>
          </div>

          <div className="mt-7 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              ['01', 'Choose', 'Select the AI chatbot that fits your business.'],
              ['02', 'Test', 'Try the live chatbot before you buy.'],
              ['03', 'Launch', 'Add it to your website and start serving customers.'],
            ].map(([num, title, text]) => (
              <div key={num} className="rounded-2xl border border-gray-200 bg-white p-5">
                <span className="text-xs font-extrabold text-blue-600">{num}</span>
                <h3 className="mt-2 font-bold text-lg">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / CTA */}
      <section className="px-5 sm:px-8 lg:px-12 pb-10">
        <div className="max-w-6xl mx-auto rounded-3xl bg-gray-950 p-6 sm:p-9 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-blue-300"><ShieldCheck size={17} /> Built for modern businesses</div>
            <h2 className="mt-2 font-headline text-2xl sm:text-3xl font-extrabold">Ready to put AI on your website?</h2>
            <p className="mt-2 text-sm text-gray-300">Explore the available chatbots and find the right plan for your business.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <button onClick={onNavigateToDemo} className="h-11 px-5 rounded-xl bg-white text-gray-950 text-sm font-bold hover:bg-gray-100 transition-colors">
              View Chatbots
            </button>
            <button onClick={onNavigateToContact} className="h-11 px-5 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-500 transition-colors">
              Talk to Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
