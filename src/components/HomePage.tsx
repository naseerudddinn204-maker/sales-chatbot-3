import React from 'react';
import { Bot, Mail, Share2, Workflow, FileText, ArrowUpRight, Sparkles } from 'lucide-react';

const demos = [
  { title: 'AI Chatbot Demos', description: 'Try interactive business bots for customer support and common questions.', href: '/chatbots', label: 'View chatbot demos', icon: Bot, color: 'text-blue-700', bg: 'bg-blue-50' },
  { title: 'Email Sender & Reader Demo', description: 'Open the email workspace to draft messages and summarize emails.', href: '/email', label: 'Try email tools', icon: Mail, color: 'text-violet-700', bg: 'bg-violet-50' },
  { title: 'Auto Post Generator Demo', description: 'Create social captions, calls to action, and hashtags for a campaign.', href: '/auto-post-generator', label: 'Try post generator', icon: Share2, color: 'text-pink-700', bg: 'bg-pink-50' },
  { title: 'AI Automation Demo', description: 'Explore a separate workspace for planning repeatable AI workflows.', href: '/ai-automation', label: 'Try automation', icon: Workflow, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { title: 'AI Content Writer Demo', description: 'Open a writing workspace for business copy, product descriptions, and proposals.', href: '/ai-content-writer', label: 'Try content writer', icon: FileText, color: 'text-amber-700', bg: 'bg-amber-50' },
];

export const HomePage: React.FC = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white"><Sparkles size={21}/></span>
        <div><div className="text-lg font-extrabold tracking-tight">AI Workbench</div><div className="text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">AI demos</div></div>
      </div>
    </header>
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <div className="max-w-3xl">
        <p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">Explore demos</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl">Try an AI demo</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">This homepage is only a demo directory. Choose a card to open its own separate page and workspace.</p>
      </div>
      <div className="mt-9 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {demos.map((demo) => { const Icon = demo.icon; return (
          <a key={demo.href} href={demo.href} className="group flex min-h-60 flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
            <div className="flex items-start justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${demo.bg} ${demo.color}`}><Icon size={24}/></span><ArrowUpRight size={19} className="text-slate-400 transition group-hover:text-blue-700"/></div>
            <h2 className="mt-5 text-xl font-extrabold">{demo.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{demo.description}</p>
            <span className="mt-5 text-sm font-extrabold text-blue-700">{demo.label} →</span>
          </a>
        )})}
      </div>
    </main>
    <footer className="border-t border-slate-200 bg-slate-950 px-4 py-7 text-center text-xs text-slate-400">AI Workbench · Choose a demo to open its separate page</footer>
  </div>
);
