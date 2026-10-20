import React from 'react';
import { Bot, Mail, Share2, Workflow, FileText, ArrowUpRight } from 'lucide-react';

const demos = [
  { title: 'AI Chatbot Demos', description: 'Interactive business chatbots for customer support and common questions.', href: '/chatbots', label: 'Open demos', icon: Bot, color: 'text-blue-700', bg: 'bg-blue-50' },
  { title: 'Email Sender & Reader', description: 'Draft emails, prepare replies, and summarize messages.', href: '/email', label: 'Open email tools', icon: Mail, color: 'text-violet-700', bg: 'bg-violet-50' },
  { title: 'Auto Post Generator', description: 'Create social captions, calls to action, and hashtags.', href: '/auto-post-generator', label: 'Open post generator', icon: Share2, color: 'text-pink-700', bg: 'bg-pink-50' },
  { title: 'AI Automation', description: 'Plan repeatable workflows with triggers and actions.', href: '/ai-automation', label: 'Open automation', icon: Workflow, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { title: 'AI Content Writer', description: 'Write business copy, product descriptions, and proposals.', href: '/ai-content-writer', label: 'Open writing tool', icon: FileText, color: 'text-amber-700', bg: 'bg-amber-50' },
];

export const HomePage: React.FC = () => (
  <main className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto grid max-w-7xl gap-5 sm:grid-cols-2 xl:grid-cols-3">
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
);
