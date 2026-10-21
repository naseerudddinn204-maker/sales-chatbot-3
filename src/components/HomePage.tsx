import React from 'react';
import { Bot, Headset, ShoppingBag, Building2, ArrowUpRight } from 'lucide-react';

const demos = [
  { title: 'Customer Support Demos', description: 'Try chatbots that answer common questions and help customers find the right information.', icon: Headset, tone: 'text-blue-700 bg-blue-50' },
  { title: 'Sales & Lead Generation Demos', description: 'Explore assistants designed to explain products, qualify leads, and guide visitors.', icon: ShoppingBag, tone: 'text-violet-700 bg-violet-50' },
  { title: 'Industry Chatbot Demos', description: 'Discover examples for services, retail, hospitality, education, and other businesses.', icon: Building2, tone: 'text-emerald-700 bg-emerald-50' },
];

export const HomePage: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
    <section className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800"><Bot size={14}/> Live chatbot demos</div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Explore our AI demos</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Choose a demo category to explore interactive chatbots. AI tools and automation have their own separate pages.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {demos.map(demo => { const Icon = demo.icon; return (
          <a key={demo.title} href="/chatbots" className="group flex min-h-60 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
            <div className="flex items-start justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${demo.tone}`}><Icon size={24}/></span><ArrowUpRight size={19} className="text-slate-400 transition group-hover:text-blue-700"/></div>
            <h2 className="mt-5 text-xl font-extrabold">{demo.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{demo.description}</p>
            <span className="mt-5 text-sm font-extrabold text-blue-700">Explore demos →</span>
          </a>
        )})}
      </div>
    </section>
  </main>
);
