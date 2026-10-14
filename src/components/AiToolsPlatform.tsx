import React, { useMemo, useState } from 'react';
import { Bot, Mail, MailOpen, Send, Share2, Workflow, FileText, Sparkles, ArrowRight, Copy, Check, WandSparkles, Zap, ShieldCheck, ChevronRight, Menu, X, Clock3, Link2 } from 'lucide-react';

type ToolId = 'all' | 'chatbot' | 'email' | 'social' | 'automation' | 'writer';
type ToolCard = { id: Exclude<ToolId, 'all'>; title: string; description: string; label: string; icon: React.ElementType; color: string; bg: string };

const tools: ToolCard[] = [
  { id: 'chatbot', title: 'AI Chatbot', description: 'Try a business assistant that answers common customer questions and helps visitors find information.', label: 'Interactive demo', icon: Bot, color: 'text-blue-700', bg: 'bg-blue-50' },
  { id: 'email', title: 'Email Sender & Reader', description: 'Draft professional emails, prepare replies, and summarize messages you paste in.', label: 'Email workspace', icon: Mail, color: 'text-violet-700', bg: 'bg-violet-50' },
  { id: 'social', title: 'Auto Post Generator', description: 'Create social captions, calls to action, and hashtags for your business.', label: 'Content creation', icon: Share2, color: 'text-pink-700', bg: 'bg-pink-50' },
  { id: 'automation', title: 'AI Automation Builder', description: 'Plan repeatable workflows with triggers, actions, and a clear next step.', label: 'Workflow planner', icon: Workflow, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { id: 'writer', title: 'AI Content Writer', description: 'Prepare product descriptions, business copy, proposals, and short documents.', label: 'Writing assistant', icon: FileText, color: 'text-amber-700', bg: 'bg-amber-50' },
];

const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50';
const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

function makeDraft(kind: string, topic: string, tone: string, audience: string) {
  const subject = topic.trim() || 'our latest update';
  const who = audience.trim() || 'our customers';
  if (kind === 'email') return `Subject: ${subject.charAt(0).toUpperCase() + subject.slice(1)}\n\nHello ${who},\n\nI hope you are doing well. I’m reaching out regarding ${subject}.\n\n${tone === 'Friendly' ? 'I’d be happy to answer any questions and help you find the best next step.' : tone === 'Concise' ? 'Please let me know if you would like more details.' : 'We would love to help you make the most of this opportunity.'}\n\nThank you for your time.\n\nBest regards,\nYour Name`;
  if (kind === 'social') return `✨ ${subject.charAt(0).toUpperCase() + subject.slice(1)}\n\nHelping ${who} get better results starts with the right tools and a clear plan. Discover a smarter way to work, save time, and focus on what matters.\n\nLearn more today.\n\n#Business #Innovation #AITools #Productivity`;
  if (kind === 'writer') return `${subject.charAt(0).toUpperCase() + subject.slice(1)}\n\nDesigned for ${who}, this solution helps simplify everyday work with a practical, reliable approach. It brings key information together, reduces repetitive tasks, and makes it easier to take the next step.\n\nKey benefits:\n• Clear, useful information\n• A smoother workflow\n• More time for important work\n\nNext step: tailor this draft with your product details, proof points, and preferred call to action.`;
  return `Workflow: ${subject}\n\nTrigger: When ${who} submits a form or a new item arrives.\nAction 1: Validate the required fields and remove duplicates.\nAction 2: Prepare a personalized AI draft using the submitted details.\nAction 3: Send the draft to a human reviewer for approval.\nAction 4: After approval, send the message and record the result.\n\nSafety check: Keep human approval enabled before sending messages or publishing content.\n\nThis is a workflow plan only. Connect the relevant accounts and automation service before enabling it.`;
}

export const AiToolsPlatform: React.FC = () => {
  const [activeTool, setActiveTool] = useState<ToolId>('all');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Friendly');
  const [output, setOutput] = useState('');
  const [sourceText, setSourceText] = useState('');
  const [notice, setNotice] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const visibleTools = useMemo(() => activeTool === 'all' ? tools : tools.filter(t => t.id === activeTool), [activeTool]);
  const selected = tools.find(t => t.id === activeTool);
  const generate = (kind: string) => {
    if (kind === 'reader') {
      const text = sourceText.trim();
      if (!text) { setNotice('Paste an email or message first.'); return; }
      const sentences = text.replace(/\s+/g, ' ').split(/(?<=[.!?])\s+/).filter(Boolean);
      setOutput(`SUMMARY\n${sentences.slice(0, 3).join(' ') || text.slice(0, 450)}\n\nPOSSIBLE NEXT STEP\nReview the message, confirm any dates or requests, then write a reply based on the sender’s actual question.`);
      setNotice('Summary prepared from the text you provided.');
      return;
    }
    setOutput(makeDraft(kind, topic, tone, audience));
    setNotice('Draft ready. Review and personalize it before using.');
  };
  const copyOutput = async () => {
    try { await navigator.clipboard.writeText(output); setNotice('Copied to clipboard.'); }
    catch { setNotice('Select the draft and copy it manually.'); }
  };
  const openEmail = () => {
    if (!emailAddress.trim() || !emailSubject.trim() || !emailBody.trim()) { setNotice('Add a recipient, subject, and message first.'); return; }
    window.location.href = `mailto:${encodeURIComponent(emailAddress)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    setNotice('Your email app should open with the message prepared. It has not been sent by this website.');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button onClick={() => { setActiveTool('all'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-sm"><Sparkles size={21} /></span>
            <span><span className="block text-lg font-extrabold tracking-tight">AI Workbench</span><span className="block text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">Tools & Automation</span></span>
          </button>
          <nav className="hidden items-center gap-1 md:flex">
            <button onClick={() => setActiveTool('all')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTool === 'all' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>All tools</button>
            {tools.map(t => <button key={t.id} onClick={() => { setActiveTool(t.id); document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' }); }} className={`rounded-lg px-3 py-2 text-sm font-semibold ${activeTool === t.id ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-100'}`}>{t.title}</button>)}
          </nav>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 md:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">{mobileMenu ? <X size={18}/> : <Menu size={18}/>} Tools</button>
        </div>
        {mobileMenu && <div className="grid gap-1 border-t border-slate-100 bg-white p-3 md:hidden"><button onClick={() => {setActiveTool('all');setMobileMenu(false)}} className="rounded-lg p-3 text-left text-sm font-semibold">All tools</button>{tools.map(t=><button key={t.id} onClick={()=>{setActiveTool(t.id);setMobileMenu(false);document.getElementById('workspace')?.scrollIntoView({behavior:'smooth'})}} className="rounded-lg p-3 text-left text-sm font-semibold hover:bg-slate-50">{t.title}</button>)}</div>}
      </header>

      <main>
        <section className="relative overflow-hidden bg-white">
          <div className="absolute -right-20 -top-24 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
          <div className="absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-indigo-100/50 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.1fr_.9fr] lg:px-8 lg:py-24">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800"><span className="h-2 w-2 rounded-full bg-blue-600"/> A practical AI workspace</div>
              <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">Get more done with <span className="text-blue-700">AI tools that work for you.</span></h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">Draft emails, create social content, explore business chatbots, and map repeatable workflows from one clean workspace.</p>
              <div className="mt-8 flex flex-wrap gap-3"><button className={buttonClass} onClick={() => {setActiveTool('all');document.getElementById('tools')?.scrollIntoView({behavior:'smooth'})}}>Explore tools <ArrowRight size={17}/></button><button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50" onClick={() => {setActiveTool('automation');document.getElementById('workspace')?.scrollIntoView({behavior:'smooth'})}}><Workflow size={17}/> Build a workflow</button></div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-slate-500"><span className="flex items-center gap-2"><ShieldCheck size={17} className="text-emerald-600"/> No account required</span><span className="flex items-center gap-2"><Zap size={17} className="text-blue-600"/> Simple, focused tools</span><span className="flex items-center gap-2"><Clock3 size={17} className="text-blue-600"/> Human approval for actions</span></div>
            </div>
            <div className="relative rounded-[28px] border border-slate-200 bg-white p-4 shadow-2xl shadow-blue-950/10 sm:p-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4"><div><p className="text-sm font-extrabold">Your AI workspace</p><p className="mt-1 text-xs text-slate-500">Choose a task to get started</p></div><span className="rounded-xl bg-blue-50 p-3 text-blue-700"><WandSparkles size={22}/></span></div>
              <div className="mt-4 grid grid-cols-2 gap-3">{tools.slice(0,4).map(t=>{const Icon=t.icon;return <button key={t.id} onClick={()=>{setActiveTool(t.id);document.getElementById('workspace')?.scrollIntoView({behavior:'smooth'})}} className="rounded-2xl border border-slate-200 p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"><span className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${t.bg} ${t.color}`}><Icon size={20}/></span><span className="block text-sm font-bold">{t.title}</span><span className="mt-1 block text-xs leading-5 text-slate-500">{t.label}</span></button>})}</div>
              <div className="mt-4 rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 text-sm font-bold"><span className="h-2 w-2 rounded-full bg-emerald-500"/> Designed for practical work</div><p className="mt-1 text-xs leading-5 text-slate-500">Review drafts before sending. Connect accounts only when you are ready.</p></div>
            </div>
          </div>
        </section>

        <section id="tools" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">Tool library</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">One workspace. Multiple ways to work smarter.</h2><p className="mt-3 max-w-2xl leading-7 text-slate-600">Open a tool and try a focused task. Account-based sending and publishing integrations can be connected separately.</p></div><div className="flex flex-wrap gap-2">{(['all','chatbot','email','social','automation','writer'] as ToolId[]).map(id=><button key={id} onClick={()=>setActiveTool(id)} className={`rounded-full border px-3 py-2 text-xs font-bold capitalize ${activeTool===id?'border-blue-700 bg-blue-700 text-white':'border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}>{id==='all'?'All tools':id==='social'?'Auto post':id==='writer'?'Content writer':id==='email'?'Email tools':id==='chatbot'?'Chatbot': 'Automation'}</button>)}</div></div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleTools.map(t=>{const Icon=t.icon;return <article key={t.id} className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"><div className="flex items-start justify-between"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${t.bg} ${t.color}`}><Icon size={24}/></span><span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold text-slate-500">{t.label}</span></div><h3 className="mt-5 text-xl font-extrabold">{t.title}</h3><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{t.description}</p><button onClick={()=>{setActiveTool(t.id);document.getElementById('workspace')?.scrollIntoView({behavior:'smooth'})}} className="mt-6 inline-flex items-center gap-2 self-start text-sm font-extrabold text-blue-700 hover:text-blue-900">Open tool <ChevronRight size={17}/></button></article>})}
          </div>
        </section>

        {activeTool !== 'all' && (
          <section id="workspace" className="scroll-mt-24 border-y border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-7 flex items-start gap-4"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selected?.bg} ${selected?.color}`}>{selected && React.createElement(selected.icon,{size:24})}</span><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">Tool workspace</p><h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">{selected?.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{selected?.description}</p></div></div>
              {activeTool === 'chatbot' ? <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8"><h3 className="text-xl font-extrabold">Try the chatbot demos</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Explore the existing demo chatbot collection. Ask questions and test how a business assistant can help visitors.</p><a href="/chatbots" className={`${buttonClass} mt-5`}>Open chatbot demos <ArrowRight size={17}/></a></div> :
              activeTool === 'email' ? <div className="grid gap-5 lg:grid-cols-2"><div className="rounded-3xl border border-slate-200 p-5 sm:p-6"><h3 className="font-extrabold">Write an email</h3><p className="mt-1 text-xs leading-5 text-slate-500">Create a starting draft, then review it before sending.</p><label className="mt-4 block text-xs font-bold text-slate-600">Topic or purpose</label><input className={`${inputClass} mt-2`} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Follow up after a product demo"/><label className="mt-4 block text-xs font-bold text-slate-600">Recipient / audience</label><input className={`${inputClass} mt-2`} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. a potential customer"/><label className="mt-4 block text-xs font-bold text-slate-600">Tone</label><select className={`${inputClass} mt-2`} value={tone} onChange={e=>setTone(e.target.value)}><option>Friendly</option><option>Concise</option><option>Professional</option></select><button className={`${buttonClass} mt-4 w-full`} onClick={()=>generate('email')}>Prepare email draft <WandSparkles size={17}/></button><div className="mt-6 border-t border-slate-100 pt-5"><h4 className="font-bold">Prepare an email to send</h4><input className={`${inputClass} mt-3`} value={emailAddress} onChange={e=>setEmailAddress(e.target.value)} placeholder="Recipient email address" type="email"/><input className={`${inputClass} mt-3`} value={emailSubject} onChange={e=>setEmailSubject(e.target.value)} placeholder="Email subject"/><textarea className={`${inputClass} mt-3 min-h-28 resize-y`} value={emailBody} onChange={e=>setEmailBody(e.target.value)} placeholder="Message body"/><button className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold hover:bg-slate-50" onClick={openEmail}><Send size={16}/> Open email app to send</button><p className="mt-2 text-xs leading-5 text-slate-500">This opens your configured mail app; this website does not send email directly yet.</p></div></div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6"><h3 className="font-extrabold">Read or summarize an email</h3><p className="mt-1 text-xs leading-5 text-slate-500">Paste the email text you want to understand.</p><textarea className={`${inputClass} mt-4 min-h-44 resize-y`} value={sourceText} onChange={e=>setSourceText(e.target.value)} placeholder="Paste an email or message here..."/><button className={`${buttonClass} mt-3 w-full`} onClick={()=>generate('reader')}><MailOpen size={17}/> Summarize message</button></div></div> :
              <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><div className="rounded-3xl border border-slate-200 p-5 sm:p-6"><h3 className="font-extrabold">{activeTool==='social'?'Create a social post':activeTool==='automation'?'Plan an automation':'Write content'}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{activeTool==='social'?'Generate a caption idea and hashtags.':activeTool==='automation'?'Describe the repetitive task you want to streamline.':'Prepare a first draft for your business.'}</p><label className="mt-5 block text-xs font-bold text-slate-600">{activeTool==='automation'?'What should the workflow do?':'Topic / product / goal'}</label><textarea className={`${inputClass} mt-2 min-h-32 resize-y`} value={topic} onChange={e=>setTopic(e.target.value)} placeholder={activeTool==='automation'?'e.g. When a lead form arrives, prepare a follow-up email for review':'e.g. Launching our new online store'}/><label className="mt-4 block text-xs font-bold text-slate-600">Audience</label><input className={`${inputClass} mt-2`} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. small business owners"/><label className="mt-4 block text-xs font-bold text-slate-600">Style</label><select className={`${inputClass} mt-2`} value={tone} onChange={e=>setTone(e.target.value)}><option>Friendly</option><option>Concise</option><option>Professional</option></select><button className={`${buttonClass} mt-5 w-full`} onClick={()=>generate(activeTool==='social'?'social':activeTool==='automation'?'automation':'writer')}>{activeTool==='automation'?'Create workflow plan':'Generate draft'} <WandSparkles size={17}/></button>{activeTool==='automation'&&<p className="mt-3 text-xs leading-5 text-slate-500">Plans are not run automatically. Email, social, and CRM connections plus a workflow runner are needed to execute them.</p>}</div><div className="min-h-72 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><h3 className="font-extrabold">Your result</h3>{output&&<button onClick={copyOutput} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-100"><Copy size={14}/> Copy</button>}</div>{output?<pre className="mt-4 whitespace-pre-wrap break-words font-sans text-sm leading-7 text-slate-700">{output}</pre>:<div className="flex min-h-56 flex-col items-center justify-center text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm"><Sparkles size={22}/></span><p className="mt-4 text-sm font-bold text-slate-700">Your draft will appear here</p><p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">Enter a topic and choose Generate to prepare a starting point.</p></div>}</div></div>}
              {notice && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800" role="status">{notice}</div>}
            </div>
          </section>
        )}
      </main>
      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-slate-300 sm:px-6"><div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-extrabold text-white">AI Workbench</div><p className="mt-1 text-xs text-slate-400">Practical tools for content, communication, and workflows.</p></div><div className="flex flex-wrap gap-4 text-xs text-slate-400"><a href="#tools" className="hover:text-white">Explore tools</a><a href="/chatbots" className="hover:text-white">Chatbot demos</a><a href="mailto:hello@example.com" className="hover:text-white">Contact</a></div></div></footer>
    </div>
  );
};
