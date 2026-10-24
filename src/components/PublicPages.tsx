import React, { useState } from 'react';
import { callBackend } from '../lib/backendApi';
import { ArrowRight, Bot, Download, FileText, Image as ImageIcon, Mail, Menu, Share2, Sparkles, Workflow, X } from 'lucide-react';

type PageId = 'home' | 'ai-tools' | 'email' | 'automation' | 'social' | 'writer' | 'demos' | 'contact';
const links = [
  { label: 'Home', href: '/' },
  { label: 'AI Tools', href: '/ai-tools' },
  { label: 'Demos', href: '/demos' },
  { label: 'Automation', href: '/automation' },
  { label: 'Chatbots', href: '/chatbots' },
  { label: 'Contact', href: '/contact' },
];
const cards = [
  { title: 'Email Sender & Reader', description: 'Draft emails and summarize pasted messages.', href: '/email', icon: Mail, status: 'Try Demo' },
  { title: 'Auto Post Generator', description: 'Create a social caption, CTA, hashtags, and campaign image.', href: '/auto-post', icon: Share2, status: 'Try Demo' },
  { title: 'AI Automation Builder', description: 'Plan triggers, workflow steps, approvals, and error handling.', href: '/automation', icon: Workflow, status: 'Try Demo' },
  { title: 'AI Content Writer', description: 'Draft business copy, product descriptions, and proposals.', href: '/content-writer', icon: FileText, status: 'Try Demo' },
  { title: 'AI Chatbots', description: 'Explore interactive business chatbot demos.', href: '/chatbots', icon: Bot, status: 'Try Demo' },
];
const button = 'inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-50';
const input = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100';
const toolConfig: Record<string, { title: string; description: string; tool: string; placeholder: string; icon: React.ElementType }> = {
  email: { title: 'Email Sender & Reader', description: 'Draft an email or paste one to get a clear summary. Drafts stay here for review; sending opens your own mail app.', tool: 'email', placeholder: 'e.g. Follow up with a customer after a product demo', icon: Mail },
  automation: { title: 'AI Automation Builder', description: 'Plan a repeatable workflow with clear steps and human approval. This demo creates a plan; it does not run connected accounts.', tool: 'automation', placeholder: 'e.g. When a lead form arrives, draft a personalized follow-up for review', icon: Workflow },
  social: { title: 'Auto Post Generator', description: 'Generate a social post and optionally create a matching campaign image.', tool: 'social', placeholder: 'e.g. Launch announcement for our new AI service', icon: Share2 },
  writer: { title: 'AI Content Writer', description: 'Create a useful first draft for business content, product pages, proposals, or articles.', tool: 'writer', placeholder: 'e.g. Write a product description for a small-business AI assistant', icon: FileText },
};
function saveTextFile(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  URL.revokeObjectURL(url);
}
function ResultCard({ title, result, onDownload }: { title: string; result: string; onDownload: () => void }) {
  return <section className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:p-5"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-extrabold text-slate-900">{title}</h3>{result && <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700" onClick={onDownload}><Download size={14}/> Download .txt</button>}</div><div className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{result || 'Your result will appear here after you generate it.'}</div></section>;
}
function ToolPage({ kind }: { kind: 'email' | 'automation' | 'social' | 'writer' }) {
  const config = toolConfig[kind];
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Professional');
  const [draft, setDraft] = useState('');
  const [summarySource, setSummarySource] = useState('');
  const [summary, setSummary] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [imageBusy, setImageBusy] = useState(false);
  const [image, setImage] = useState('');
  const [recipient, setRecipient] = useState('');
  const [mailSubject, setMailSubject] = useState('');
  const [mailBody, setMailBody] = useState('');

  async function generate(tool: string, value: string, setter: (v: string) => void) {
    if (!value.trim()) { setNotice(tool === 'email_summary' ? 'Paste an email to summarize first.' : 'Enter a topic or brief first.'); return; }
    setBusy(true); setNotice('');
    try {
      const response = await callBackend<{ ok?: boolean; result?: string; error?: string; tool?: string }>({ action: 'tool_generate', tool, input: value.trim(), audience: audience.trim(), tone });
      if (!response?.result) throw new Error(response?.error || 'The AI returned no result.');
      if (response.tool && response.tool !== tool) throw new Error('The backend returned a result for a different tool. Nothing was placed in this result card.');
      setter(response.result);
      setNotice('Result ready. Review it before sending or publishing.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Generation failed. Please try again.'); }
    finally { setBusy(false); }
  }
  async function generateImage() {
    if (!topic.trim()) { setNotice('Describe the image you want first.'); return; }
    setImageBusy(true); setImage(''); setNotice('');
    try {
      const response = await callBackend<{ imageData?: string; mimeType?: string; error?: string }>({ action: 'tool_image_generate', input: topic.trim(), audience: audience.trim(), tone });
      if (!response?.imageData) throw new Error(response?.error || 'The AI returned no image.');
      setImage(response.imageData.startsWith('data:') ? response.imageData : 'data:' + (response.mimeType || 'image/png') + ';base64,' + response.imageData);
      setNotice('Image generated. You can preview and download it below.');
    } catch (error) { setNotice(error instanceof Error ? error.message : 'Image generation failed. Please try again.'); }
    finally { setImageBusy(false); }
  }
  const Icon = config.icon;
  return <main className="mx-auto max-w-5xl px-4 py-9 sm:px-6 lg:px-8"><a href="/ai-tools" className="text-sm font-bold text-blue-700 hover:text-blue-900">← All AI tools</a><div className="mt-5 flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Icon size={24}/></span><div><p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">Interactive demo</p><h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{config.title}</h1><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{config.description}</p></div></div>
    {kind === 'email' ? <div className="mt-7 grid gap-5 lg:grid-cols-2"><section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-extrabold">Write an email</h2><label className="mt-4 block text-xs font-bold text-slate-600">Topic or purpose</label><input className={input} value={topic} onChange={e=>setTopic(e.target.value)} placeholder={config.placeholder}/><label className="mt-4 block text-xs font-bold text-slate-600">Audience / recipient</label><input className={input} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. a potential customer"/><label className="mt-4 block text-xs font-bold text-slate-600">Tone</label><select className={input} value={tone} onChange={e=>setTone(e.target.value)}><option>Professional</option><option>Friendly</option><option>Concise</option></select><button className={button+' mt-4 w-full'} disabled={busy} onClick={()=>generate('email',topic,setDraft)}>{busy?'Generating…':'Generate email with AI'} <Sparkles size={16}/></button><ResultCard title="Email draft result" result={draft} onDownload={()=>saveTextFile('email-draft.txt',draft)}/><div className="mt-4 grid gap-3"><input className={input+' mt-0'} type="email" value={recipient} onChange={e=>setRecipient(e.target.value)} placeholder="Recipient email address"/><input className={input+' mt-0'} value={mailSubject} onChange={e=>setMailSubject(e.target.value)} placeholder="Email subject"/><textarea className={input+' mt-0 min-h-28'} value={mailBody} onChange={e=>setMailBody(e.target.value)} placeholder="Message body"/><button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50" onClick={()=>{if(!recipient.trim()||!mailSubject.trim()||!mailBody.trim()){setNotice('Add recipient, subject, and message first.');return;}window.location.href='mailto:'+encodeURIComponent(recipient)+'?subject='+encodeURIComponent(mailSubject)+'&body='+encodeURIComponent(mailBody);setNotice('Your mail app should open with the prepared email. This website has not sent it.');}}>Open in email app (not sent here)</button></div></section>
    <section className="rounded-2xl border border-slate-200 bg-white p-5"><h2 className="text-lg font-extrabold">Read / summarize an email</h2><p className="mt-1 text-sm text-slate-600">Paste the message you received. The summary will appear in this separate card.</p><textarea className={input+' min-h-48'} value={summarySource} onChange={e=>setSummarySource(e.target.value)} placeholder="Paste an email here…"/><button className={button+' mt-4 w-full'} disabled={busy} onClick={()=>generate('email_summary',summarySource,setSummary)}>{busy?'Summarizing…':'Summarize with AI'} <Sparkles size={16}/></button><ResultCard title="Email summary result" result={summary} onDownload={()=>saveTextFile('email-summary.txt',summary)}/></section></div> :
    <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6"><label className="block text-xs font-bold text-slate-600">Topic / task brief</label><textarea className={input+' min-h-32'} value={topic} onChange={e=>setTopic(e.target.value)} placeholder={config.placeholder}/><div className="mt-4 grid gap-4 sm:grid-cols-2"><div><label className="block text-xs font-bold text-slate-600">Audience</label><input className={input} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. small business owners"/></div><div><label className="block text-xs font-bold text-slate-600">Style</label><select className={input} value={tone} onChange={e=>setTone(e.target.value)}><option>Professional</option><option>Friendly</option><option>Concise</option><option>Creative</option></select></div></div><div className="mt-4 flex flex-wrap gap-3"><button className={button} disabled={busy} onClick={()=>generate(config.tool,topic,setDraft)}>{busy?'Generating…':'Generate with AI'} <Sparkles size={16}/></button>{kind==='social'&&<button className="inline-flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-50 disabled:opacity-50" disabled={imageBusy} onClick={generateImage}>{imageBusy?'Creating image…':'Generate image'} <ImageIcon size={16}/></button>}</div><ResultCard title={kind==='social'?'Social post result':kind==='automation'?'Automation plan result':'Content draft result'} result={draft} onDownload={()=>saveTextFile(kind+'-result.txt',draft)}/>{image&&<section className="mt-5 rounded-2xl border border-slate-200 p-4"><div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-extrabold">Generated image</h3><a className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold" href={image} download="social-campaign.png"><Download size={14}/> Download image</a></div><img className="mt-3 max-h-[520px] w-full rounded-xl object-contain" src={image} alt="AI generated campaign visual"/></section>}</section>}
    {notice&&<p role="status" className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900">{notice}</p>}
    <p className="mt-6 text-xs leading-5 text-slate-500">Demo note: generated content needs human review. Email sending, social publishing, and automation execution require separate provider connections.</p></main>;
}
function CardGrid({ title, description, subset = cards }: { title: string; description: string; subset?: typeof cards }) {
  return <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"><div className="max-w-3xl"><p className="text-xs font-extrabold uppercase tracking-widest text-blue-700">SalesChatbot · AI Workbench</p><h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1><p className="mt-3 text-sm leading-6 text-slate-600">{description}</p></div><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{subset.map(card=>{const Icon=card.icon;return <article key={card.href} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-300 hover:shadow-md"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon size={22}/></span><h2 className="mt-4 text-lg font-extrabold">{card.title}</h2><p className="mt-2 flex-1 text-sm leading-6 text-slate-600">{card.description}</p><a className="mt-5 inline-flex items-center gap-2 self-start text-sm font-extrabold text-blue-700 hover:text-blue-900" href={card.href}>{card.status} <ArrowRight size={16}/></a></article>})}</div></main>;
}
export const PublicPages: React.FC<{ page: PageId }> = ({ page }) => {
  if (page === 'email') return <ToolPage kind="email"/>;
  if (page === 'automation') return <ToolPage kind="automation"/>;
  if (page === 'social') return <ToolPage kind="social"/>;
  if (page === 'writer') return <ToolPage kind="writer"/>;
  if (page === 'ai-tools') return <CardGrid title="AI Tools" description="Choose one focused tool. Each opens on its own page and keeps its own result." />;
  if (page === 'demos') return <CardGrid title="Demo Library" description="Open an interactive demo and see what each tool can do." />;
  if (page === 'contact') return <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6"><h1 className="text-3xl font-extrabold">Request a demo</h1><p className="mt-3 text-sm leading-6 text-slate-600">Explore the demos first, then contact your SalesChatbot team to discuss integrations and custom workflows.</p><div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5"><p className="font-bold">Available demos</p><div className="mt-3 flex flex-wrap gap-3"><a className={button} href="/demos">Browse demos <ArrowRight size={16}/></a><a className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold" href="/ai-tools">Explore AI tools</a></div></div></main>;
  return <CardGrid title="Explore the demos" description="Home is kept simple: open a demo card to visit that tool's own page." subset={[cards[4], cards[0], cards[1], cards[2], cards[3]]} />;
};
export const PublicLayout: React.FC<{ children: React.ReactNode; page: PageId }> = ({ children, page }) => {
  const [menu, setMenu] = useState(false);
  return <div className="min-h-screen bg-slate-50 text-slate-900"><header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"><a href="/" className="flex items-center gap-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-700 text-white"><Sparkles size={19}/></span><span><strong className="block text-sm font-extrabold">SalesChatbot</strong><span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">AI Workbench</span></span></a><nav className="hidden items-center gap-1 md:flex">{links.map(link=><a key={link.href} href={link.href} className={'rounded-lg border px-3 py-2 text-xs font-bold '+((link.href==='/'&&page==='home')||(link.href==='/ai-tools'&&page==='ai-tools')||(link.href==='/demos'&&page==='demos')||(link.href==='/automation'&&page==='automation')||(link.href==='/contact'&&page==='contact')?'border-blue-200 bg-blue-50 text-blue-800': 'border-transparent text-slate-600 hover:bg-slate-100')}>{link.label}</a>)}</nav><button className="rounded-lg border border-slate-200 p-2 md:hidden" onClick={()=>setMenu(!menu)} aria-label="Toggle menu">{menu?<X size={18}/>:<Menu size={18}/>}</button></div>{menu&&<nav className="grid gap-1 border-t border-slate-100 bg-white p-3 md:hidden">{links.map(link=><a key={link.href} href={link.href} className="rounded-lg p-3 text-sm font-bold text-slate-700">{link.label}</a>)}</nav>}</header>{children}<footer className="mt-10 border-t border-slate-200 bg-white px-4 py-5 text-center text-xs text-slate-500">SalesChatbot AI Workbench · Review AI drafts before taking action.</footer></div>;
};
