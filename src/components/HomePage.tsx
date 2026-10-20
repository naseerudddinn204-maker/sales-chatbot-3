import React from 'react';
import { Bot, Mail, Share2, Workflow, FileText, ArrowUpRight, Sparkles } from 'lucide-react';

const pages = [
  { title: 'AI Chatbot', description: 'Explore interactive chatbot demos for customer support and business questions.', href: '/chatbots', label: 'Open chatbot demos', icon: Bot, color: 'text-blue-700', bg: 'bg-blue-50' },
  { title: 'Email Sender & Reader', description: 'Draft emails, prepare replies, and summarize pasted messages.', href: '/email', label: 'Open email tools', icon: Mail, color: 'text-violet-700', bg: 'bg-violet-50' },
  { title: 'Auto Post Generator', description: 'Create social media captions, calls to action, and hashtags.', href: '/auto-post-generator', label: 'Create a post', icon: Share2, color: 'text-pink-700', bg: 'bg-pink-50' },
  { title: 'AI Automation', description: 'Plan repeatable workflows with triggers, actions, and review steps.', href: '/ai-automation', label: 'Open automation', icon: Workflow, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { title: 'AI Content Writer', description: 'Prepare product descriptions, business copy, proposals, and short documents.', href: '/ai-content-writer', label: 'Open writing tool', icon: FileText, color: 'text-amber-700', bg: 'bg-amber-50' },
];

export const HomePage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white"><Sparkles size={21}/></span>
        <div><div className="text-lg font-extrabold tracking-tight">AI Workbench</div><div className="text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">Tools & Automation</div></div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">Welcome</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Choose an AI tool</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">Open the tool you need. Each tool has its own page and workspace.</p>
      </div>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => { const Icon = page.icon; return (
          <a key={page.href} href={page.href} className="group flex min-h-60 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
            <div className="flex items-start justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${page.bg} ${page.color}`}><Icon size={24}/></span><ArrowUpRight size={19} className="text-slate-400 transition group-hover:text-blue-700"/></div>
            <h2 className="mt-5 text-xl font-extrabold">{page.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{page.description}</p>
            <span className="mt-5 text-sm font-extrabold text-blue-700">{page.label} →</span>
          </a>
        )})}
      </div>
    </main>
    <footer className="border-t border-slate-200 bg-slate-950 px-4 py-7 text-center text-xs text-slate-400">AI Workbench · Practical AI tools for everyday work</footer>
  </div>
);
