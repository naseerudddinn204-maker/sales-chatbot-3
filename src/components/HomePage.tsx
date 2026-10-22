import React from 'react';
import { Bot, Mail, Share2, Workflow, FileText, ArrowRight, Sparkles, ShieldCheck, MousePointerClick } from 'lucide-react';

const demos = [
  { title: 'Customer Support Chatbots', description: 'Let visitors ask questions and explore how an AI assistant helps customers.', href: '/chatbots', icon: Bot, tone: 'bg-blue-50 text-blue-700', tag: 'Interactive demos' },
  { title: 'Sales & Lead Assistants', description: 'See how AI can explain services, answer product questions, and guide new leads.', href: '/chatbots', icon: MousePointerClick, tone: 'bg-violet-50 text-violet-700', tag: 'Business demos' },
  { title: 'Industry Chatbots', description: 'Explore sample assistants for shops, agencies, services, and other industries.', href: '/chatbots', icon: ShieldCheck, tone: 'bg-emerald-50 text-emerald-700', tag: 'Explore use cases' },
];

const tools = [
  { title: 'Email Sender & Reader', description: 'Draft emails, summarize messages, and prepare replies.', href: '/email', icon: Mail, tone: 'bg-violet-50 text-violet-700' },
  { title: 'Auto Post Generator', description: 'Create social captions, hashtags, and post images.', href: '/auto-post-generator', icon: Share2, tone: 'bg-pink-50 text-pink-700' },
  { title: 'AI Content Writer', description: 'Write product descriptions, business copy, and proposals.', href: '/ai-content-writer', icon: FileText, tone: 'bg-amber-50 text-amber-700' },
  { title: 'AI Automation', description: 'Explore workflows, triggers, actions, and review steps.', href: '/ai-automation', icon: Workflow, tone: 'bg-emerald-50 text-emerald-700' },
];

const navLink = 'rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950';

export const HomePage: React.FC = () => (
  <div className="min-h-screen bg-white text-slate-900">
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav aria-label="Main navigation" className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2.5 font-extrabold tracking-tight text-slate-950"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white"><Sparkles size={19}/></span><span>AI Tools & Automation</span></a>
        <div className="flex flex-wrap items-center gap-1">
          <a href="/" aria-current="page" className={navLink + ' bg-slate-100 text-slate-950'}>Home</a>
          <a href="/ai-tools" className={navLink}>AI Tools</a>
          <a href="/chatbots" className={navLink}>Chatbots</a>
          <a href="/ai-automation" className={navLink}>Automation</a>
          <a href="/contact" className={navLink}>Contact</a>
        </div>
      </nav>
    </header>
    <main>
      <section className="border-b border-slate-200 bg-gradient-to-b from-blue-50/80 to-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[1.15fr_.85fr] lg:px-8 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1.5 text-xs font-bold text-blue-800 shadow-sm"><Sparkles size={14}/> Try AI before you choose it</div>
            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">Explore AI tools. <span className="text-blue-700">Try them yourself.</span></h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Test practical AI tools and chatbot demos in one simple place. Open a demo, enter your own example, and see what it can do—no account needed.</p>
            <div className="mt-7 flex flex-wrap gap-3"><a href="/ai-tools" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800">Explore AI tools <ArrowRight size={17}/></a><a href="/chatbots" className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3.5 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50">Try chatbot demos</a></div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600"><span className="inline-flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-600"/> No sign-up required</span><span className="inline-flex items-center gap-2"><MousePointerClick size={16} className="text-blue-700"/> Simple, self-guided demos</span></div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-sm font-bold text-slate-950">Your AI demo hub</p><p className="mt-1 text-xs text-slate-500">Choose a demo to get started</p></div><span className="rounded-xl bg-blue-50 p-2.5 text-blue-700"><Sparkles size={21}/></span></div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {tools.map(tool => { const Icon = tool.icon; return <a key={tool.href} href={tool.href} className="group rounded-2xl border border-slate-200 p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"><span className={'flex h-10 w-10 items-center justify-center rounded-xl ' + tool.tone}><Icon size={20}/></span><span className="mt-3 block text-sm font-bold text-slate-900">{tool.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{tool.description}</span><span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-blue-700">Open demo <ArrowRight size={13}/></span></a>})}
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold text-blue-700">CHATBOT LIBRARY</p><h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">Try a chatbot for your business</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">Pick a category and explore real demo conversations at your own pace.</p></div><a href="/chatbots" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">Browse all chatbots <ArrowRight size={16}/></a></div>
        <div className="mt-7 grid gap-4 md:grid-cols-3">{demos.map(demo => { const Icon = demo.icon; return <a key={demo.title} href={demo.href} className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"><div className="flex items-center justify-between"><span className={'flex h-11 w-11 items-center justify-center rounded-xl ' + demo.tone}><Icon size={22}/></span><ArrowRight size={17} className="text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700"/></div><span className="mt-4 inline-block text-xs font-bold text-slate-500">{demo.tag}</span><h3 className="mt-1 text-lg font-bold text-slate-950">{demo.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{demo.description}</p></a>})}</div>
      </section>
      <section className="border-t border-slate-200 bg-slate-50"><div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8"><div><h2 className="text-xl font-extrabold text-slate-950">Ready to try a demo?</h2><p className="mt-1 text-sm text-slate-600">Start with a tool or chatbot—no complicated setup.</p></div><div className="flex flex-wrap gap-3"><a href="/ai-tools" className="rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800">Browse AI tools</a><a href="/contact" className="rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-800 hover:bg-slate-100">Contact us</a></div></div></section>
    </main>
    <footer className="border-t border-slate-200 bg-white"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-6 text-sm text-slate-500 sm:px-6 lg:px-8"><a href="/" className="font-bold text-slate-800">AI Tools & Automation</a><div className="flex gap-4"><a href="/ai-tools" className="hover:text-blue-700">AI Tools</a><a href="/chatbots" className="hover:text-blue-700">Chatbots</a><a href="/contact" className="hover:text-blue-700">Contact</a></div></div></footer>
  </div>
);
