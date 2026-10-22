import React from 'react';
import { Bot, Mail, Share2, Workflow, FileText, ArrowUpRight, Sparkles } from 'lucide-react';

const tools = [
  { title: 'AI Chatbot Demos', description: 'Try interactive assistants for customer support, sales, and business FAQs.', href: '/chatbots', label: 'Try chatbot demos', icon: Bot, tone: 'text-blue-700 bg-blue-50', status: 'Interactive' },
  { title: 'Email Sender & Reader', description: 'Draft professional emails, summarize messages, and prepare replies.', href: '/email', label: 'Open email demo', icon: Mail, tone: 'text-violet-700 bg-violet-50', status: 'Email workspace' },
  { title: 'Auto Post Generator', description: 'Create social captions, calls to action, hashtags, and post images.', href: '/auto-post-generator', label: 'Create a post', icon: Share2, tone: 'text-pink-700 bg-pink-50', status: 'Content creation' },
  { title: 'AI Automation', description: 'Explore workflow triggers, actions, and approval steps in a dedicated workspace.', href: '/ai-automation', label: 'Explore automation', icon: Workflow, tone: 'text-emerald-700 bg-emerald-50', status: 'Workflow demos' },
  { title: 'AI Content Writer', description: 'Prepare product descriptions, business copy, proposals, and short documents.', href: '/ai-content-writer', label: 'Write with AI', icon: FileText, tone: 'text-amber-700 bg-amber-50', status: 'Writing workspace' },
];

const navLink = 'rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950';

export const AIToolsCatalog: React.FC = () => (
  <div className="min-h-screen bg-white text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-950"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white"><Sparkles size={19}/></span><span>AI Tools & Automation</span></a>
        <div className="flex flex-wrap items-center gap-1"><a href="/" className={navLink}>Home</a><a href="/ai-tools" aria-current="page" className={navLink + ' bg-slate-100 text-slate-950'}>AI Tools</a><a href="/chatbots" className={navLink}>Chatbots</a><a href="/ai-automation" className={navLink}>Automation</a><a href="/contact" className={navLink}>Contact</a></div>
      </nav>
    </header>
    <main className="min-h-[calc(100vh-9rem)] bg-slate-50">
      <section className="border-b border-slate-200 bg-white"><div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8"><div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800"><Sparkles size={14}/> AI tools library</div><h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">Choose a tool. Try it yourself.</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Every tool opens in its own workspace. Enter your own example, explore the result, and see how it could help your business.</p></div></section>
      <section className="mx-auto max-w-7xl px-4 py-9 sm:px-6 lg:px-8"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{tools.map(tool => { const Icon = tool.icon; return <a key={tool.href} href={tool.href} className="group flex min-h-64 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"><div className="flex items-center justify-between"><span className={'flex h-12 w-12 items-center justify-center rounded-xl ' + tool.tone}><Icon size={23}/></span><ArrowUpRight size={18} className="text-slate-400 transition group-hover:text-blue-700"/></div><span className="mt-5 inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">{tool.status}</span><h2 className="mt-3 text-lg font-bold text-slate-950">{tool.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{tool.description}</p><span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700">{tool.label}<ArrowUpRight size={15}/></span></a>})}</div></section>
    </main>
    <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-sm text-slate-500 sm:px-6 lg:px-8"><a href="/" className="font-bold text-slate-800">AI Tools & Automation</a><div className="flex gap-4"><a href="/chatbots" className="hover:text-blue-700">Chatbots</a><a href="/ai-automation" className="hover:text-blue-700">Automation</a><a href="/contact" className="hover:text-blue-700">Contact</a></div></div></footer>
  </div>
);
