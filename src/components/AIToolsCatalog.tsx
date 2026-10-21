import React from 'react';
import { Bot, Mail, Share2, Workflow, FileText, ArrowUpRight, Sparkles } from 'lucide-react';

const tools = [
  { title: 'AI Chatbot Demos', description: 'Explore interactive chatbot examples for customer support, sales, and business FAQs.', href: '/chatbots', label: 'Browse demos', icon: Bot, tone: 'text-blue-700 bg-blue-50' },
  { title: 'Email Sender & Reader', description: 'Draft professional emails, prepare replies, and summarize pasted messages.', href: '/email', label: 'Open email workspace', icon: Mail, tone: 'text-violet-700 bg-violet-50' },
  { title: 'Auto Post Generator', description: 'Generate social captions, calls to action, hashtags, and a separate post image.', href: '/auto-post-generator', label: 'Create a post', icon: Share2, tone: 'text-pink-700 bg-pink-50' },
  { title: 'AI Automation', description: 'Plan repeatable workflows with triggers, actions, and human approval steps.', href: '/ai-automation', label: 'Open automation workspace', icon: Workflow, tone: 'text-emerald-700 bg-emerald-50' },
  { title: 'AI Content Writer', description: 'Prepare business copy, product descriptions, proposals, and short documents.', href: '/ai-content-writer', label: 'Open writing workspace', icon: FileText, tone: 'text-amber-700 bg-amber-50' },
];

export const AIToolsCatalog: React.FC = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 font-extrabold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white"><Sparkles size={19}/></span><span>AI Tools & Automation</span></a>
        <div className="flex items-center gap-2 text-sm font-bold"><a href="/" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Home</a><a href="/ai-tools" aria-current="page" className="rounded-lg bg-blue-50 px-3 py-2 text-blue-700">AI Tools</a><a href="/chatbots" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Chatbots</a></div>
      </nav>
    </header>
    <main className="px-4 py-10 sm:px-6 lg:px-8">
    <section className="mx-auto max-w-7xl">
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800"><Sparkles size={14}/> AI tools library</div>
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Choose an AI tool</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">This page contains tool cards only. Open a card to use that tool on its own dedicated page.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {tools.map(tool => { const Icon = tool.icon; return (
          <a key={tool.href} href={tool.href} className="group flex min-h-60 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
            <div className="flex items-start justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${tool.tone}`}><Icon size={24}/></span><ArrowUpRight size={19} className="text-slate-400 transition group-hover:text-blue-700"/></div>
            <h2 className="mt-5 text-xl font-extrabold">{tool.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{tool.description}</p>
            <span className="mt-5 text-sm font-extrabold text-blue-700">{tool.label} →</span>
          </a>
        )})}
      </div>
    </section>
    </main>
  </div>
);
