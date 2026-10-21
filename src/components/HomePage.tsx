import React from 'react';
import { Bot, Headset, ShoppingBag, Building2, ArrowUpRight, Sparkles } from 'lucide-react';

const demos = [
  { title: 'Customer Support Demos', description: 'Try chatbots that answer common questions and help customers find the right information.', icon: Headset, tone: 'text-blue-700 bg-blue-50' },
  { title: 'Sales & Lead Generation Demos', description: 'Explore assistants designed to explain products, qualify leads, and guide visitors.', icon: ShoppingBag, tone: 'text-violet-700 bg-violet-50' },
  { title: 'Industry Chatbot Demos', description: 'Discover examples for services, retail, hospitality, education, and other businesses.', icon: Building2, tone: 'text-emerald-700 bg-emerald-50' },
];

export const HomePage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" aria-current="page" className="flex items-center gap-2 font-extrabold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white"><Sparkles size={19}/></span><span>AI Tools & Automation</span></a>
        <div className="flex flex-wrap items-center gap-1 text-sm font-bold">
          <a href="/ai-tools" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">AI Tools</a>
          <a href="/demos" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Demos</a>
          <a href="/ai-automation" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Automation</a>
          <a href="/chatbots" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Chatbots</a>
          <a href="/contact" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Contact</a>
        </div>
      </nav>
    </header>
    <main className="px-4 py-10 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800"><Bot size={14}/> Chatbot demo directory</div>
          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Explore chatbot demos</h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">The home page is only for chatbot demo categories. Open AI Tools, Automation, or Contact from the navigation to visit its own dedicated page.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {demos.map(demo => { const Icon = demo.icon; return (
            <a key={demo.title} href="/demos" className="group flex min-h-60 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
              <div className="flex items-start justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${demo.tone}`}><Icon size={24}/></span><ArrowUpRight size={19} className="text-slate-400 transition group-hover:text-blue-700"/></div>
              <h2 className="mt-5 text-xl font-extrabold">{demo.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{demo.description}</p>
              <span className="mt-5 text-sm font-extrabold text-blue-700">Explore demos →</span>
            </a>
          )})}
        </div>
      </section>
    </main>
  </div>
);
