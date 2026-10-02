import React, { useState } from 'react';

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
  // ROI Calculator state
  const [monthlyTickets, setMonthlyTickets] = useState(3500);
  const [costPerHour, setCostPerHour] = useState(28);

  const hoursSaved = Math.round((monthlyTickets * 0.78 * 8) / 60);
  const estimatedSavings = Math.round(hoursSaved * costPerHour);

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 py-6 sm:py-8 flex flex-col items-start gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] text-[#1e40af]">
          <span className="w-2 h-2 rounded-full bg-[#0266ff] animate-ping" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Next-Gen Conversational Engine
          </span>
        </div>

        <h1 className="font-headline text-[30px] sm:text-[40px] text-[#111827] tracking-tight font-extrabold leading-[1.15]">
          Autonomous AI Chatbots that close deals &amp; resolve 82% of tickets
        </h1>

        <p className="text-[15px] sm:text-[17px] text-[#4b5563] leading-relaxed">
          Trained on your knowledge base in 60 seconds. High-fidelity LLM autonomy with guaranteed instant fallback to your human sales and support teams.
        </p>

        {/* Primary Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-2.5 mt-2">
          <button
            onClick={onNavigateToDemo}
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-[#d61616] hover:bg-[#bd1313] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">play_circle</span>
            <span>Test Interactive Sandbox</span>
          </button>
          <button
            onClick={onNavigateToContact}
            className="w-full sm:w-auto h-12 px-6 rounded-xl bg-white hover:bg-gray-50 border border-gray-200 text-gray-900 text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            <span>Talk with AI Experts</span>
          </button>
        </div>

        {/* Metric Bar */}
        <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-2">
          <div className="p-3 rounded-xl bg-[#f0f3ff] flex flex-col border border-blue-50">
            <span className="font-headline text-[20px] sm:text-[24px] text-[#111827] font-bold tabular-nums">
              82.4%
            </span>
            <span className="text-[11px] text-[#4b5563]">Instant Deflection</span>
          </div>
          <div className="p-3 rounded-xl bg-[#f0f3ff] flex flex-col border border-blue-50">
            <span className="font-headline text-[20px] sm:text-[24px] text-[#111827] font-bold tabular-nums">
              &lt; 180ms
            </span>
            <span className="text-[11px] text-[#4b5563]">Response Latency</span>
          </div>
          <div className="p-3 rounded-xl bg-[#f0f3ff] flex flex-col border border-blue-50">
            <span className="font-headline text-[20px] sm:text-[24px] text-[#111827] font-bold tabular-nums">
              3.4x
            </span>
            <span className="text-[11px] text-[#4b5563]">Pipeline Velocity</span>
          </div>
        </div>
      </section>

      {/* Simulated Live Interactive Chat Widget Preview */}
      <section className="px-4 sm:px-6 py-4">
        <div className="w-full rounded-2xl bg-white border border-gray-200/80 shadow-md p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0266ff] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span>
              </div>
              <div>
                <span className="text-xs font-bold text-gray-900 block leading-tight">
                  Live Conversational Preview
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Bot active on site data
                </span>
              </div>
            </div>
            <button
              onClick={onOpenLiveChat}
              className="text-xs font-bold text-[#0050cc] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Expand Chat</span>
              <span className="material-symbols-outlined text-[14px]">open_in_new</span>
            </button>
          </div>

          {/* Chat Bubble Exchanges */}
          <div className="space-y-2.5 py-1 text-xs sm:text-sm">
            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">smart_toy</span>
              </div>
              <div className="bg-[#f3f4f6] text-gray-900 px-3.5 py-2 rounded-2xl rounded-tl-xs max-w-[85%]">
                Hi! Welcome to ChatBot AI. How can I help boost your inbound conversions today?
              </div>
            </div>

            <div className="flex items-end justify-end gap-2">
              <div className="bg-[#0266ff] text-white px-3.5 py-2 rounded-2xl rounded-br-xs max-w-[85%]">
                Can I crawl our Zendesk help center and Shopify catalog automatically?
              </div>
            </div>

            <div className="flex items-start gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">smart_toy</span>
              </div>
              <div className="bg-[#f3f4f6] text-gray-900 px-3.5 py-2 rounded-2xl rounded-tl-xs max-w-[85%] space-y-2">
                <p>
                  Yes, exactly. Provide your help center URL or Shopify store link. We index thousands of articles, product SKUs, and return policies in under 60 seconds.
                </p>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Syncs real-time stock &amp; order lookups</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <span className="text-[11px] text-gray-400">Try interacting in our full sandbox</span>
            <button
              onClick={onNavigateToDemo}
              className="px-3 py-1.5 rounded-lg bg-[#eff6ff] hover:bg-blue-100 text-[#0050cc] text-xs font-bold transition-colors cursor-pointer"
            >
              Open Interactive Demo
            </button>
          </div>
        </div>
      </section>

      {/* Interactive ROI Calculator */}
      <section className="px-4 sm:px-6 py-4">
        <div className="bg-[#f0f3ff] rounded-2xl p-5 border border-blue-100 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-[#0050cc] uppercase tracking-wider block">
                Value Assessment
              </span>
              <h3 className="font-headline text-[18px] sm:text-[20px] font-bold text-gray-900">
                Calculate Your Monthly ROI
              </h3>
            </div>
            <div className="w-9 h-9 rounded-xl bg-white text-[#0050cc] flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">calculate</span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                <span>Monthly Customer Inquiries</span>
                <span className="font-bold text-[#0050cc] tabular-nums">{monthlyTickets.toLocaleString()} chats</span>
              </div>
              <input
                type="range"
                min="500"
                max="25000"
                step="500"
                value={monthlyTickets}
                onChange={(e) => setMonthlyTickets(Number(e.target.value))}
                className="w-full accent-[#0266ff] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                <span>Loaded Agent Cost / Hour</span>
                <span className="font-bold text-[#0050cc] tabular-nums">${costPerHour}/hr</span>
              </div>
              <input
                type="range"
                min="15"
                max="60"
                step="1"
                value={costPerHour}
                onChange={(e) => setCostPerHour(Number(e.target.value))}
                className="w-full accent-[#0266ff] cursor-pointer"
              />
            </div>
          </div>

          {/* Calculator Output */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200/60">
            <div className="bg-white p-3.5 rounded-xl border border-blue-100 flex flex-col">
              <span className="text-[11px] text-gray-500 font-medium">Rep Hours Reclaimed</span>
              <span className="font-headline text-[22px] font-bold text-gray-900 tabular-nums">
                {hoursSaved} hrs / mo
              </span>
            </div>
            <div className="bg-white p-3.5 rounded-xl border border-blue-100 flex flex-col">
              <span className="text-[11px] text-gray-500 font-medium">Estimated Net Savings</span>
              <span className="font-headline text-[22px] font-bold text-[#10b981] tabular-nums">
                ${estimatedSavings.toLocaleString()} / mo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section className="px-4 sm:px-6 py-4 flex flex-col gap-3">
        <h3 className="font-headline text-[18px] sm:text-[20px] font-bold text-gray-900">
          Why Enterprise Teams Choose ChatBot
        </h3>

        <div className="grid grid-cols-1 gap-2.5">
          <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-[#d61616] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">speed</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Sub-200ms Latency Engine</h4>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Streamed generation that feels as snappy as typing to a real person, eliminating customer drop-off.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0050cc] flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">transfer_within_a_station</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">Zero Robot Lock-in Handoff</h4>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                One-click or automatic transfer to human sales reps whenever high-intent deal signals or frustration are detected.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white border border-gray-100 shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">security</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">SOC 2 Type II &amp; Zero Training Retention</h4>
              <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                Your proprietary enterprise conversations and internal SOPs are never used to train public LLM weights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-6 py-4">
        <div className="bg-[#111827] text-white rounded-2xl p-5 sm:p-6 flex flex-col items-start gap-3 shadow-md">
          <span className="text-[11px] font-bold text-[#ffb4aa] uppercase tracking-wider">
            Ready to Accelerate?
          </span>
          <h3 className="font-headline text-[20px] sm:text-[22px] font-bold leading-tight">
            Deploy your tailored AI Chatbot in less than an afternoon.
          </h3>
          <p className="text-xs sm:text-sm text-gray-300">
            Book a 15-minute walkthrough or try the interactive sandbox with your team.
          </p>
          <button
            onClick={onNavigateToContact}
            className="w-full sm:w-auto h-11 px-5 mt-1 rounded-xl bg-[#d61616] hover:bg-[#bd1313] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <span>Schedule Consultation</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};
