import React, { useMemo, useState } from 'react';
import { callBackend } from '../lib/backendApi';
import { Bot, Mail, MailOpen, Send, Share2, Workflow, FileText, Sparkles, ArrowRight, Copy, Check, WandSparkles, Zap, ShieldCheck, ChevronRight, Menu, X, Clock3, Link2, ImagePlus } from 'lucide-react';

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

function renderResultText(text: string) {
  return text.split('\\n').map((line, index) => {
    const parts = line.split(/(\\*\\*.*?\\*\\*)/g);
    return (
      <React.Fragment key={index}>
        {index > 0 && <br />}
        {parts.map((part, partIndex) => {
          const boldMatch = part.match(/^\\*\\*(.*?)\\*\\*$/);
          if (boldMatch) return <strong key={partIndex} className="font-bold text-slate-800">{boldMatch[1]}</strong>;
          return <React.Fragment key={partIndex}>{part.replace(/\\*\\*/g, '')}</React.Fragment>;
        })}
      </React.Fragment>
    );
  });
}

function makeDraft(kind: string, topic: string, tone: string, audience: string) {
  const subject = topic.trim() || 'our latest update';
  const who = audience.trim() || 'our customers';
  if (kind === 'email') return `Subject: ${subject.charAt(0).toUpperCase() + subject.slice(1)}\n\nHello ${who},\n\nI hope you are doing well. I’m reaching out regarding ${subject}.\n\n${tone === 'Friendly' ? 'I’d be happy to answer any questions and help you find the best next step.' : tone === 'Concise' ? 'Please let me know if you would like more details.' : 'We would love to help you make the most of this opportunity.'}\n\nThank you for your time.\n\nBest regards,\nYour Name`;
  if (kind === 'social') return `✨ ${subject.charAt(0).toUpperCase() + subject.slice(1)}\n\nHelping ${who} get better results starts with the right tools and a clear plan. Discover a smarter way to work, save time, and focus on what matters.\n\nLearn more today.\n\n#Business #Innovation #AITools #Productivity`;
  if (kind === 'writer') return `${subject.charAt(0).toUpperCase() + subject.slice(1)}\n\nDesigned for ${who}, this solution helps simplify everyday work with a practical, reliable approach. It brings key information together, reduces repetitive tasks, and makes it easier to take the next step.\n\nKey benefits:\n• Clear, useful information\n• A smoother workflow\n• More time for important work\n\nNext step: tailor this draft with your product details, proof points, and preferred call to action.`;
  return `Workflow: ${subject}\n\nTrigger: When ${who} submits a form or a new item arrives.\nAction 1: Validate the required fields and remove duplicates.\nAction 2: Prepare a personalized AI draft using the submitted details.\nAction 3: Send the draft to a human reviewer for approval.\nAction 4: After approval, send the message and record the result.\n\nSafety check: Keep human approval enabled before sending messages or publishing content.\n\nThis is a workflow plan only. Connect the relevant accounts and automation service before enabling it.`;
}

export const AiToolsPlatform: React.FC<{ initialTool?: Exclude<ToolId, 'all'> }> = ({ initialTool }) => {
  const routeTool: ToolId = initialTool ?? (window.location.pathname.startsWith('/email') ? 'email' : window.location.pathname.startsWith('/auto-post-generator') ? 'social' : window.location.pathname.startsWith('/ai-automation') ? 'automation' : window.location.pathname.startsWith('/ai-content-writer') ? 'writer' : 'all');
  const [activeTool, setActiveTool] = useState<ToolId>(routeTool);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState('Friendly');
  const [outputs, setOutputs] = useState<Record<string, string>>({});
  const [automationResults, setAutomationResults] = useState<Record<string, string>>({});
  const [automationLoading, setAutomationLoading] = useState<string>('');
  const [sourceText, setSourceText] = useState('');
  const [notice, setNotice] = useState('');\n  const [copiedKey, setCopiedKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isExecutingAutomation, setIsExecutingAutomation] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [automationTrigger, setAutomationTrigger] = useState('When a new lead form is submitted');
  const [automationAction, setAutomationAction] = useState('Draft a personalized follow-up email');
  const [automationDestination, setAutomationDestination] = useState('Send to me for approval');

  const visibleTools = useMemo(() => activeTool === 'all' ? tools : tools.filter(t => t.id === activeTool), [activeTool]);
  const selected = tools.find(t => t.id === activeTool);
  const generate = async (kind: string) => {
    const input = kind === 'reader' ? sourceText.trim() : topic.trim();
    if (!input) {
      setNotice(kind === 'reader' ? 'Paste an email or message first.' : 'Describe what you want to create first.');
      return;
    }
    setIsGenerating(true);
    setNotice('');
    try {
      const tool = kind === 'reader' ? 'email_summary' : kind;
      const requestInput = kind === 'automation'
        ? `${input}\nTrigger: ${automationTrigger}\nAction: ${automationAction}\nDestination: ${automationDestination}`
        : input;
      const response = await callBackend<{ ok: boolean; result: string; error?: string }>({
        action: 'tool_generate',
        tool,
        // The edge function validates `message`; keep `input` for compatible handlers.
        message: requestInput,
        input: requestInput,
        audience,
        tone,
      });
      if (!response?.result) throw new Error(response?.error || 'The AI returned no result.');
      setOutputs(previous => ({ ...previous, [kind]: response.result }));
      setNotice('AI result ready. Review it before sending or publishing.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'AI generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  const generateAutomationDemo = async (demo: { title: string; goal: string; trigger: string; action: string }) => {
    setAutomationLoading(demo.title);
    setNotice('');
    try {
      const prompt = `Automation demo: ${demo.title}\nGoal: ${demo.goal}\nTrigger: ${demo.trigger}\nAI action: ${demo.action}\nDestination: Send to me for approval\nCreate the specific output this automation would produce, then briefly list the trigger, action, review step, and expected result. Do not claim the workflow was actually executed.`;
      const response = await callBackend<{ ok: boolean; result: string; error?: string }>({
        action: 'tool_generate',
        tool: 'automation',
        message: prompt,
        input: prompt,
        audience: audience || 'business team',
        tone,
      });
      if (!response?.result) throw new Error(response?.error || 'The AI returned no result.');
      setAutomationResults(previous => ({ ...previous, [demo.title]: response.result }));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : `Could not generate ${demo.title}.`);
    } finally {
      setAutomationLoading('');
    }
  };
  const generateImage = async () => {
    if (!topic.trim()) {
      setNotice('Add a topic for your social post before generating an image.');
      return;
    }
    setIsGeneratingImage(true);
    setNotice('');
    try {
      const response = await callBackend<{ ok: boolean; image_data_url?: string; error?: string }>({
        action: 'tool_image_generate',
        tool: 'social',
        message: topic.trim(),
        input: topic.trim(),
        audience,
        tone,
      });
      if (!response?.image_data_url) throw new Error(response?.error || 'The image service returned no image.');
      setGeneratedImage(response.image_data_url);
      setNotice('Image generated. Review it before using it in a post.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Image generation failed. Please try again.');
    } finally {
      setIsGeneratingImage(false);
    }
  };
  const copyText = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setNotice('Copied successfully. ✓');
      window.setTimeout(() => setCopiedKey(current => current === key ? '' : current), 2200);
    } catch {
      setNotice('Copy failed. Please select the result and copy it manually.');
    }
  };
  const copyOutput = (kind: string) => copyText(kind, outputs[kind] || '');
  const openEmail = async () => {
    if (!emailAddress.trim() || !emailSubject.trim() || !emailBody.trim()) { setNotice('Add a recipient, subject, and message first.'); return; }
    setIsSendingEmail(true);
    setNotice('');
    try {
      const response = await callBackend<{ ok: boolean; message?: string; error?: string }>({
        action: 'email_send',
        recipient: emailAddress.trim(),
        subject: emailSubject.trim(),
        text: emailBody.trim(),
      });
      if (!response?.ok) throw new Error(response?.error || 'Email could not be sent.');
      setNotice(response.message || 'Email accepted by the provider.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Email sending failed. Please check the provider settings.');
    } finally {
      setIsSendingEmail(false);
    }
  };
  const executeAutomation = async () => {
    if (!topic.trim()) { setNotice('Enter a workflow goal before running it.'); return; }
    setIsExecutingAutomation(true);
    setNotice('');
    try {
      const response = await callBackend<{ ok: boolean; message?: string; error?: string }>({
        action: 'automation_execute',
        goal: topic.trim(),
        trigger: automationTrigger,
        workflow_action: automationAction,
        destination: automationDestination,
        payload: { recipient: emailAddress.trim(), subject: emailSubject.trim(), text: emailBody.trim(), audience: audience.trim() },
      });
      if (!response?.ok) throw new Error(response?.error || 'Workflow runner did not accept this request.');
      setNotice(response.message || 'Workflow runner accepted the request.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Workflow execution failed.');
    } finally {
      setIsExecutingAutomation(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <button onClick={() => { window.location.href = '/'; }} className="flex items-center gap-3 text-left">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-700 text-white shadow-sm"><Sparkles size={21} /></span>
            <span><span className="block text-lg font-extrabold tracking-tight">AI Workbench</span><span className="block text-[11px] font-semibold uppercase tracking-[.16em] text-slate-500">Tools & Automation</span></span>
          </button>
          {routeTool === 'all' ? <nav className="hidden items-center gap-1 md:flex">
            {tools.map(t => <a key={t.id} href={t.id === 'chatbot' ? '/chatbots' : t.id === 'email' ? '/email' : t.id === 'social' ? '/auto-post-generator' : t.id === 'automation' ? '/ai-automation' : '/ai-content-writer'} aria-current={window.location.pathname === (t.id === 'chatbot' ? '/chatbots' : t.id === 'email' ? '/email' : t.id === 'social' ? '/auto-post-generator' : t.id === 'automation' ? '/ai-automation' : '/ai-content-writer') ? 'page' : undefined} className={"rounded-lg border px-3 py-2 text-sm font-semibold transition " + (activeTool === t.id ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100" : "border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50")}>{t.title}</a>)}
          </nav> : <a href="/ai-tools" className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50">← All tools</a>}
          {routeTool === 'all' && <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 md:hidden" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle navigation">{mobileMenu ? <X size={18}/> : <Menu size={18}/>} Tools</button>}
        </div>
        {mobileMenu && routeTool === 'all' && <div className="grid gap-1 border-t border-slate-100 bg-white p-3 md:hidden">{tools.map(t=><a key={t.id} href={t.id === 'chatbot' ? '/chatbots' : t.id === 'email' ? '/email' : t.id === 'social' ? '/auto-post-generator' : t.id === 'automation' ? '/ai-automation' : '/ai-content-writer'} className="rounded-lg p-3 text-left text-sm font-semibold hover:bg-slate-50">{t.title}</a>)}</div>}
      </header>

      <main>
        {activeTool === 'all' && <><section className="relative overflow-hidden bg-white">
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

        </>}

        {activeTool !== 'all' && (
          <section id="workspace" className="scroll-mt-24 border-y border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
              <div className="mb-7"><a href="/ai-tools" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900">← Back to all tools</a></div><div className="mb-7 flex items-start gap-4"><span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${selected?.bg} ${selected?.color}`}>{selected && React.createElement(selected.icon,{size:24})}</span><div><p className="text-xs font-extrabold uppercase tracking-[.18em] text-blue-700">Tool workspace</p><h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">{selected?.title}</h2><p className="mt-2 text-sm leading-6 text-slate-600">{selected?.description}</p></div></div>
              {activeTool === 'chatbot' ? <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 sm:p-8"><h3 className="text-xl font-extrabold">Try the chatbot demos</h3><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Explore the existing demo chatbot collection. Ask questions and test how a business assistant can help visitors.</p><a href="/chatbots" className={`${buttonClass} mt-5`}>Open chatbot demos <ArrowRight size={17}/></a></div> :
              activeTool === 'email' ? <div className="grid gap-5 lg:grid-cols-2"><div className="rounded-3xl border border-slate-200 p-5 sm:p-6"><h3 className="font-extrabold">Write an email</h3><p className="mt-1 text-xs leading-5 text-slate-500">Create a starting draft, then review it before sending.</p><label className="mt-4 block text-xs font-bold text-slate-600">Topic or purpose</label><input className={`${inputClass} mt-2`} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Follow up after a product demo"/><label className="mt-4 block text-xs font-bold text-slate-600">Recipient / audience</label><input className={`${inputClass} mt-2`} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. a potential customer"/><label className="mt-4 block text-xs font-bold text-slate-600">Tone</label><select className={`${inputClass} mt-2`} value={tone} onChange={e=>setTone(e.target.value)}><option>Friendly</option><option>Concise</option><option>Professional</option></select><button className={`${buttonClass} mt-4 w-full`} onClick={()=>generate('email')} disabled={isGenerating}>{isGenerating?'Generating…':'Generate email with AI'} <WandSparkles size={17}/></button><div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50/70 p-4"><div className="flex items-center justify-between gap-3"><h4 className="font-extrabold text-slate-800">Email sender result</h4>{outputs.email&&<button onClick={()=>copyOutput('email')} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-200 bg-white px-3 py-2 text-xs font-bold text-blue-700">{copiedKey==='email'?<><Check size={13}/> Copied ✓</>:<><Copy size={13}/> Copy</>}</button>}</div>{outputs.email?<><div className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{renderResultText(outputs.email)}</div><button className="mt-3 w-full rounded-xl bg-blue-700 px-4 py-3 text-sm font-bold text-white hover:bg-blue-800" onClick={()=>{setEmailSubject('AI-generated email draft');setEmailBody(outputs.email);setNotice('Draft copied into the send form below. Review the recipient and message before opening your email app.')}}>Use draft in send form</button></>:<p className="mt-3 text-xs leading-5 text-slate-500">Your generated email draft will appear here. Enter a topic and select Generate email with AI.</p>}</div><div className="mt-6 border-t border-slate-100 pt-5"><h4 className="font-bold">Prepare an email to send</h4><input className={`${inputClass} mt-3`} value={emailAddress} onChange={e=>setEmailAddress(e.target.value)} placeholder="Recipient email address" type="email"/><input className={`${inputClass} mt-3`} value={emailSubject} onChange={e=>setEmailSubject(e.target.value)} placeholder="Email subject"/><textarea className={`${inputClass} mt-3 min-h-28 resize-y`} value={emailBody} onChange={e=>setEmailBody(e.target.value)} placeholder="Message body"/><button className={`${buttonClass} mt-3 w-full`} onClick={openEmail} disabled={isSendingEmail}><Send size={16}/> {isSendingEmail?'Sending email…':'Send email securely'}</button><p className="mt-2 text-xs leading-5 text-slate-500">Email is sent through the server-side provider only when its API key, verified sender, and approved test-recipient list are configured.</p></div></div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6"><h3 className="font-extrabold">Read or summarize an email</h3><p className="mt-1 text-xs leading-5 text-slate-500">Paste the email text you want to understand.</p><textarea className={`${inputClass} mt-4 min-h-44 resize-y`} value={sourceText} onChange={e=>setSourceText(e.target.value)} placeholder="Paste an email or message here..."/><button className={`${buttonClass} mt-3 w-full`} onClick={()=>generate('reader')} disabled={isGenerating}><MailOpen size={17}/> {isGenerating?'Summarizing…':'Summarize with AI'}</button><div className="mt-4 rounded-2xl border border-violet-200 bg-violet-50/70 p-4"><div className="flex items-center justify-between gap-3"><h4 className="font-extrabold text-slate-800">Email reader result</h4>{outputs.reader&&<button onClick={()=>copyOutput('reader')} className="inline-flex items-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700">{copiedKey==='reader'?<><Check size={13}/> Copied ✓</>:<><Copy size={13}/> Copy</>}</button>}</div>{outputs.reader?<div className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">{renderResultText(outputs.reader)}</div>:<p className="mt-3 text-xs leading-5 text-slate-500">Your email summary will appear here. Paste an email above and select Summarize with AI.</p>}</div></div></div> : <>{activeTool === 'automation' && <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 sm:p-6"><div className="mb-4"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-emerald-700">Automation demos</p><h3 className="mt-1 text-xl font-extrabold">See what one automation workspace can do</h3><p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">Choose an example to load its trigger and AI action into the builder. Each demo shows a different output type—email drafts, social content, summaries, CRM notes, or support replies—in this same page.</p></div><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {[{title:'Lead follow-up email',tag:'Email draft',description:'A new lead arrives and AI prepares a personalized follow-up email.',trigger:'When a new lead form is submitted',action:'Draft a personalized follow-up email',goal:'Follow up with a new lead who requested information about our AI tools'},{title:'Social media post',tag:'Social content',description:'Turn a product update into a caption and hashtags for social media.',trigger:'Every weekday morning',action:'Create a social post draft',goal:'Promote our AI tools workspace and explain how it saves small businesses time'},{title:'Incoming email summary',tag:'Email reader',description:'Summarize a new email and classify what needs attention.',trigger:'When a new email arrives',action:'Summarize the message and classify it',goal:'Review incoming customer emails, summarize the request, and mark urgency'},{title:'CRM lead summary',tag:'CRM notes',description:'Prepare a clean lead summary for your sales team.',trigger:'When a spreadsheet row is added',action:'Prepare a CRM lead summary',goal:'Summarize a new sales lead, their business needs, and the recommended next step'},{title:'Customer support reply',tag:'Support reply',description:'Draft a helpful answer for a customer question for human review.',trigger:'When a customer asks for support',action:'Draft a customer support reply',goal:'Draft a friendly support response that answers the customer and suggests the next step'}].map(d=><div key={d.title} className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-center justify-between gap-2"><span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-emerald-800 ring-1 ring-slate-200">{d.tag}</span><Workflow size={17} className="text-emerald-700"/></div><h4 className="mt-3 font-extrabold">{d.title}</h4><p className="mt-1 flex-1 text-xs leading-5 text-slate-600">{d.description}</p><div className="mt-3 rounded-xl border border-slate-200 bg-white p-3"><p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Trigger</p><p className="mt-1 text-xs font-semibold text-slate-700">{d.trigger}</p><p className="mt-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">AI action</p><p className="mt-1 text-xs font-semibold text-slate-700">{d.action}</p></div><button className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2.5 text-xs font-extrabold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50" disabled={automationLoading===d.title} onClick={()=>{setTopic(d.goal);setAutomationTrigger(d.trigger);setAutomationAction(d.action);setAutomationDestination('Send to me for approval');generateAutomationDemo(d)}}>{automationLoading===d.title?'Generating result…':'Generate this demo'} <ArrowRight size={14}/></button>{automationResults[d.title]&&<div className="mt-3 rounded-xl border border-emerald-200 bg-white p-3"><div className="flex items-center justify-between gap-2"><p className="text-xs font-extrabold text-emerald-900">{d.title} result</p><button onClick={()=>copyText(`automation-${d.title}`, automationResults[d.title])} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-bold text-emerald-700">{copiedKey === `automation-${d.title}` ? <><Check size={13}/> Copied ✓</> : <><Copy size={13}/> Copy</>}</button></div><div className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words text-xs leading-5 text-slate-700">{renderResultText(automationResults[d.title])}</div></div>}</div>)}
              </div><p className="mt-4 text-xs leading-5 text-slate-500">Demo mode: these examples generate workflow plans and drafts for review. They do not actually send emails, publish posts, or update a CRM until integrations are connected.</p></section>}
              <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]"><div className="rounded-3xl border border-slate-200 p-5 sm:p-6"><h3 className="font-extrabold">{activeTool==='social'?'Create a social post':activeTool==='automation'?'Plan an automation':'Write content'}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{activeTool==='social'?'Generate a caption idea and hashtags.':activeTool==='automation'?'Describe the repetitive task you want to streamline.':'Prepare a first draft for your business.'}</p>{activeTool==='automation' ? <><label className="mt-5 block text-xs font-bold text-slate-600">Workflow goal</label><textarea className={`${inputClass} mt-2 min-h-24 resize-y`} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Follow up with new website leads quickly"/><label className="mt-4 block text-xs font-bold text-slate-600">When should it start? (Trigger)</label><select className={`${inputClass} mt-2`} value={automationTrigger} onChange={e=>setAutomationTrigger(e.target.value)}><option>When a new lead form is submitted</option><option>When a new email arrives</option><option>When a spreadsheet row is added</option><option>Every weekday morning</option><option>When a customer asks for support</option></select><label className="mt-4 block text-xs font-bold text-slate-600">What should AI do? (Action)</label><select className={`${inputClass} mt-2`} value={automationAction} onChange={e=>setAutomationAction(e.target.value)}><option>Draft a personalized follow-up email</option><option>Summarize the message and classify it</option><option>Create a social post draft</option><option>Prepare a CRM lead summary</option><option>Draft a customer support reply</option></select><label className="mt-4 block text-xs font-bold text-slate-600">After the action</label><select className={`${inputClass} mt-2`} value={automationDestination} onChange={e=>setAutomationDestination(e.target.value)}><option>Send to me for approval</option><option>Save as a draft only</option><option>Notify my team</option></select><div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4"><h4 className="text-sm font-extrabold text-emerald-950">Execution details (optional)</h4><input className={`${inputClass} mt-3`} type="email" value={emailAddress} onChange={e=>setEmailAddress(e.target.value)} placeholder="Recipient email for connected workflow"/><input className={`${inputClass} mt-3`} value={emailSubject} onChange={e=>setEmailSubject(e.target.value)} placeholder="Email subject / task title"/><textarea className={`${inputClass} mt-3 min-h-20 resize-y`} value={emailBody} onChange={e=>setEmailBody(e.target.value)} placeholder="Email body or data for the connected workflow"/><button className={`${buttonClass} mt-3 w-full`} onClick={executeAutomation} disabled={isExecutingAutomation}><Workflow size={16}/>{isExecutingAutomation?'Sending to workflow runner…':'Execute connected workflow'}</button><p className="mt-2 text-xs leading-5 text-slate-500">Runs only when a secure HTTPS workflow webhook is configured on the backend. Otherwise the server returns a setup message.</p></div></> : <><label className="mt-5 block text-xs font-bold text-slate-600">Topic / product / goal</label><textarea className={`${inputClass} mt-2 min-h-32 resize-y`} value={topic} onChange={e=>setTopic(e.target.value)} placeholder="e.g. Launching our new online store"/></>}<label className="mt-4 block text-xs font-bold text-slate-600">Audience</label><input className={`${inputClass} mt-2`} value={audience} onChange={e=>setAudience(e.target.value)} placeholder="e.g. small business owners"/><label className="mt-4 block text-xs font-bold text-slate-600">Style</label><select className={`${inputClass} mt-2`} value={tone} onChange={e=>setTone(e.target.value)}><option>Friendly</option><option>Concise</option><option>Professional</option></select><div className="mt-5 grid gap-3 sm:grid-cols-2"><button className={`${buttonClass} w-full`} onClick={()=>generate(activeTool==='social'?'social':activeTool==='automation'?'automation':'writer')} disabled={isGenerating}>{isGenerating?'Generating…':activeTool==='automation'?'Generate AI workflow plan':'Generate with AI'} <WandSparkles size={17}/></button>{activeTool==='social'&&<button className="inline-flex items-center justify-center gap-2 rounded-xl border border-pink-200 bg-pink-50 px-4 py-3 text-sm font-bold text-pink-800 transition hover:bg-pink-100 disabled:cursor-not-allowed disabled:opacity-50" onClick={generateImage} disabled={isGeneratingImage}>{isGeneratingImage?'Generating image…':'Generate image'} <ImagePlus size={17}/></button>}</div>{activeTool==='automation'&&<p className="mt-3 text-xs leading-5 text-slate-500">Plans are not run automatically. Email, social, and CRM connections plus a workflow runner are needed to execute them.</p>}</div><div className="min-h-72 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><h3 className="font-extrabold">{activeTool==='automation'?'Automation workflow result':activeTool==='social'?'Social post result':'Content result'}</h3>{outputs[activeTool]&&<button onClick={()=>copyOutput(activeTool)} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-100">{copiedKey===activeTool?<><Check size={14} className="text-emerald-600"/> Copied ✓</>:<><Copy size={14}/> Copy</>}</button>}</div>{outputs[activeTool]?<div className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">{renderResultText(outputs[activeTool])}</div>:<div className="flex min-h-56 flex-col items-center justify-center text-center"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-700 shadow-sm"><Sparkles size={22}/></span><p className="mt-4 text-sm font-bold text-slate-700">{activeTool==='automation'?'Your workflow plan will appear here':activeTool==='social'?'Your social post will appear here':'Your content draft will appear here'}</p><p className="mt-1 max-w-xs text-xs leading-5 text-slate-500">{activeTool==='automation'?'Choose a demo above or describe a workflow, then generate its plan.':activeTool==='social'?'Enter a topic and choose Generate to create a caption and hashtags.':'Enter a topic and choose Generate to prepare a starting point.'}</p></div>}</div>{activeTool==='social'&&<div className="mt-5 rounded-3xl border border-pink-200 bg-white p-5 sm:p-6"><div className="flex items-center justify-between gap-3"><h3 className="font-extrabold">Generated post image</h3>{generatedImage&&<button onClick={()=>{const a=document.createElement('a');a.href=generatedImage;a.download='ai-social-post.png';a.click();}} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold hover:bg-slate-50">Save image</button>}</div>{generatedImage?<img src={generatedImage} alt="AI-generated social post visual" className="mt-4 max-h-[480px] w-full rounded-2xl border border-slate-100 object-contain"/>:<p className="mt-3 text-sm leading-6 text-slate-500">Your generated image will appear here separately from the caption and hashtags.</p>}</div>}</div></>}
              {notice && <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800" role="status">{notice}</div>}
            </div>
          </section>
        )}
      </main>
      <footer className="border-t border-slate-200 bg-slate-950 px-4 py-8 text-slate-300 sm:px-6"><div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><div className="font-extrabold text-white">AI Workbench</div><p className="mt-1 text-xs text-slate-400">Practical tools for content, communication, and workflows.</p></div><div className="flex flex-wrap gap-4 text-xs text-slate-400"><a href="#tools" className="hover:text-white">Explore tools</a><a href="/chatbots" className="hover:text-white">Chatbot demos</a><a href="mailto:hello@example.com" className="hover:text-white">Contact</a></div></div></footer>
    </div>
  );
};
