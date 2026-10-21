import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Send, Sparkles } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState('');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent('AI Tools & Automation enquiry');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    setNotice('Your email app should open with this message prepared. This website does not send the email automatically.');
  };

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex min-h-16 max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-2 font-extrabold tracking-tight"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white"><Sparkles size={19}/></span><span>AI Tools & Automation</span></a>
        <div className="flex flex-wrap gap-1 text-sm font-bold">
          <a href="/ai-tools" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">AI Tools</a>
          <a href="/demos" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Demos</a>
          <a href="/ai-automation" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Automation</a>
          <a href="/chatbots" className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100">Chatbots</a>
          <a href="/contact" aria-current="page" className="rounded-lg bg-blue-50 px-3 py-2 text-blue-700">Contact</a>
        </div>
      </nav>
    </header>
    <main className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
      <section className="max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800"><MessageSquare size={14}/> Contact</div>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-950">How can we help?</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">Ask us about chatbot demos, AI tools, or automation workflows. This page is dedicated to contact requests, separate from the tools and demos.</p>
        <div className="mt-7 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Mail size={20}/></span><div><p className="text-sm font-bold">Email enquiry</p><p className="mt-1 text-xs text-slate-500">Your email app will open with the message filled in.</p></div></div>
      </section>
      <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="text-xl font-extrabold">Send a message</h2>
        <label className="mt-6 block text-sm font-bold" htmlFor="contact-name">Your name</label>
        <input id="contact-name" required value={name} onChange={e=>setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Full name"/>
        <label className="mt-4 block text-sm font-bold" htmlFor="contact-email">Email address</label>
        <input id="contact-email" required type="email" value={email} onChange={e=>setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="you@company.com"/>
        <label className="mt-4 block text-sm font-bold" htmlFor="contact-message">How can we help?</label>
        <textarea id="contact-message" required rows={5} value={message} onChange={e=>setMessage(e.target.value)} className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" placeholder="Tell us what you need..."/>
        <button type="submit" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800"><Send size={16}/> Prepare email</button>
        {notice&&<p role="status" className="mt-3 text-sm leading-6 text-slate-600">{notice}</p>}
        <p className="mt-3 text-xs leading-5 text-slate-500">This prepares an email in your email app; it does not send anything automatically.</p>
      </form>
    </main>
  </div>;
};
