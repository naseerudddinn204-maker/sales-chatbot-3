import React, { useEffect, useState } from 'react';
import { Bot, Code2, LogOut, Plus, Save, Trash2, DollarSign, Copy, Check, ClipboardList, PanelLeftClose, PanelLeftOpen, Users, LayoutDashboard, Settings, Search, RefreshCw, Mail, ExternalLink, X, ChevronLeft, ChevronRight, CalendarDays, ArrowUpDown } from 'lucide-react';
import { createChatbot, createPrice, deleteChatbot, deletePrice, getAdminUser, getSession, listChatbots, listLeads, listPrices, listProfiles, signOut, updateChatbot, updatePrice } from '../lib/supabaseAdmin';
import { AdminLogin } from './AdminLogin';
import { PricingOrdersPanel } from './PricingOrdersPanel';

type Bot = { id:string; name:string; slug:string; description:string; system_prompt:string; welcome_message:string; enabled:boolean; embed_code?:string; logo_url?:string; brand_color?:string; knowledge_description?:string; knowledge_text?:string };
type Price = { id:string; plan_name:string; monthly_price:number; annual_price:number; description:string; features:string[]; highlighted:boolean; enabled:boolean; sort_order:number };
type UserProfile = { id:string; full_name:string; email:string; email_confirmed_at:string | null; created_at:string };
type Lead = { id:string; name:string; email:string; company?:string; phone?:string; company_website?:string | null; traffic_volume?:string; primary_goal?:string; message?:string; chatbot_name?:string | null; order_type?:string | null; plan_name?:string | null; order_status?:string | null; created_at:string };

function safeWebsiteUrl(value?: string | null) {
  if (!value) return null;
  try { const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`); return ['http:', 'https:'].includes(url.protocol) ? url.href : null; } catch { return null; }
}

export function AdminDashboard() {
  const [loggedIn, setLoggedIn] = useState(!!getSession());
  const [authorized, setAuthorized] = useState(false);
  const [bots, setBots] = useState<Bot[]>([]);
  const [selected, setSelected] = useState<Bot | null>(null);
  const [prices, setPrices] = useState<Price[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState('');
  const [embedCopied, setEmbedCopied] = useState(false);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [requestSearch, setRequestSearch] = useState('');
  const [requestTypeFilter, setRequestTypeFilter] = useState('all');
  const [requestChatbotFilter, setRequestChatbotFilter] = useState('all');
  const [requestDateFilter, setRequestDateFilter] = useState('all');
  const [requestSort, setRequestSort] = useState<'date' | 'client' | 'email'>('date');
  const [requestSortAsc, setRequestSortAsc] = useState(false);
  const [requestPage, setRequestPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<Lead | null>(null);

  async function load() {
    setLoading(true);
    try {
      const admin = await getAdminUser();
      if (!admin) { setAuthorized(false); return; }
      setAuthorized(true);
      const [data, leadData] = await Promise.all([listChatbots(), listLeads()]);
      setBots(data);
      setLeads(leadData || []);
      const profiles = await listProfiles().catch(() => []);
      setUserProfiles(profiles || []);
      if (!selected && data[0]) setSelected(data[0]);
    } catch (e) { setNotice(e instanceof Error ? e.message : 'Could not load dashboard'); }
    finally { setLoading(false); }
  }

  useEffect(() => { if (loggedIn) load(); else setLoading(false); }, [loggedIn]);
  useEffect(() => { if (selected) listPrices(selected.id).then(setPrices).catch(() => setPrices([])); }, [selected?.id]);

  if (!loggedIn) return <AdminLogin onLoggedIn={() => setLoggedIn(true)} />;
  if (loading) return <div className="min-h-screen grid place-items-center p-4 text-center">Loading admin dashboard…</div>;
  if (!authorized) return (
    <div className="min-h-screen grid place-items-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 text-center shadow">
        <h1 className="text-xl font-bold">Account not authorized</h1>
        <p className="mt-2 text-sm text-slate-500">Your Supabase Auth account exists, but it has not been added to the admin_users table yet.</p>
        <button onClick={() => { signOut(); setLoggedIn(false); }} className="mt-6 rounded-xl bg-slate-900 px-5 py-3 text-white">Sign out</button>
      </div>
    </div>
  );

  const origin = window.location.origin;
  const adminPath = window.location.pathname;
  const adminPage = adminPath.startsWith('/admin/settings') ? 'settings' : adminPath.startsWith('/admin/dashboard') || adminPath === '/admin/' || adminPath === '/admin' ? 'dashboard' : adminPath.startsWith('/admin/users') ? 'users' : adminPath.startsWith('/admin/questions') ? 'questions' : adminPath.startsWith('/admin/pricing-orders') ? 'pricing-orders' : adminPath.startsWith('/admin/requests') ? 'requests' : 'chatbots';
  const defaultEmbedCode = selected ? `<script src="${origin}/embed.js" data-chatbot="${selected.slug}" defer></script>` : '';
  const embedCode = selected?.embed_code?.trim() || defaultEmbedCode;
  const liveUrl = selected ? `${origin}/embed/${selected.slug}` : '';
  // Only form submissions with an email and website belong in Client Requests.
  // Chatbot manager-follow-up questions belong in Client Questions instead.
  const requestLeads = leads.filter(lead => !!lead.email && (!!lead.company_website || !!lead.chatbot_name || !!lead.order_type) && lead.primary_goal !== 'Manager follow-up' && !lead.plan_name && lead.order_type !== 'Pricing order');
  const clientQuestions = leads.filter(lead => lead.primary_goal === 'Manager follow-up' && !!lead.message);
  const pricingOrders = leads.filter(lead => !!lead.plan_name || lead.order_type === 'Pricing order');
  const requestTypes = [...new Set(requestLeads.map(lead => lead.order_type || 'General inquiry'))].sort();
  const requestChatbots = [...new Set(requestLeads.map(lead => lead.chatbot_name || 'Not specified'))].sort();
  const filteredRequests = requestLeads.filter(lead => {
    const term = requestSearch.trim().toLowerCase();
    const matchesSearch = !term || [lead.name, lead.email, lead.company, lead.phone, lead.company_website].some(value => String(value || '').toLowerCase().includes(term));
    const matchesType = requestTypeFilter === 'all' || (lead.order_type || 'General inquiry') === requestTypeFilter;
    const matchesBot = requestChatbotFilter === 'all' || (lead.chatbot_name || 'Not specified') === requestChatbotFilter;
    const date = new Date(lead.created_at);
    const age = Date.now() - date.getTime();
    const matchesDate = requestDateFilter === 'all' || (requestDateFilter === 'today' && date.toDateString() === new Date().toDateString()) || (requestDateFilter === '7d' && age <= 7 * 86400000) || (requestDateFilter === '30d' && age <= 30 * 86400000);
    return matchesSearch && matchesType && matchesBot && matchesDate;
  }).sort((a,b) => {
    const valueA = requestSort === 'client' ? a.name.toLowerCase() : requestSort === 'email' ? a.email.toLowerCase() : a.created_at;
    const valueB = requestSort === 'client' ? b.name.toLowerCase() : requestSort === 'email' ? b.email.toLowerCase() : b.created_at;
    const result = valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    return requestSortAsc ? result : -result;
  });
  const requestPageSize = 10;
  const requestPageCount = Math.max(1, Math.ceil(filteredRequests.length / requestPageSize));
  const visibleRequests = filteredRequests.slice((requestPage - 1) * requestPageSize, requestPage * requestPageSize);

  async function addBot() {
    const rows = await createChatbot({ name:'New Chatbot', slug:`chatbot-${Date.now()}`, description:'', system_prompt:'You are a helpful AI sales assistant.', welcome_message:'Hello! How can I help you?', enabled:true, embed_code:'', logo_url:'', brand_color:'#111827', knowledge_description:'', knowledge_text:'' });
    const bot = rows[0];
    setBots([bot, ...bots]);
    setSelected(bot);
  }

  async function saveBot() {
    if (!selected) return;
    const rows = await updateChatbot(selected.id, selected);
    const bot = rows[0];
    setBots(bots.map(b => b.id === bot.id ? bot : b));
    setSelected(bot);
    setNotice('Chatbot saved.');
  }

  async function removeBot() {
    if (!selected || !confirm('Delete this chatbot and its pricing?')) return;
    await deleteChatbot(selected.id);
    setBots(bots.filter(b => b.id !== selected.id));
    setSelected(null);
    setPrices([]);
  }

  async function addPrice() {
    if (!selected) return;
    const rows = await createPrice({ chatbot_id:selected.id, plan_name:'New Plan', monthly_price:99, annual_price:79, description:'', features:['Feature 1'], highlighted:false, enabled:true, sort_order:prices.length });
    setPrices([...prices, rows[0]]);
  }

  async function savePrice(price: Price) {
    const rows = await updatePrice(price.id, price);
    setPrices(prices.map(p => p.id === price.id ? rows[0] : p));
    setNotice('Pricing saved.');
  }
  async function removePrice(id:string) {
    if (!confirm('Delete this pricing plan?')) return;
    await deletePrice(id);
    setPrices(prices.filter(p => p.id !== id));
  }

  async function copyEmbed() {
    await navigator.clipboard.writeText(embedCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 1500);
  }

  const inputClass = "box-border w-full min-w-0 max-w-full rounded-xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-violet-100";
  const smallInputClass = "box-border w-full min-w-0 max-w-full rounded-lg border border-slate-200 bg-white p-2 text-sm outline-none focus:border-slate-400";

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#f4f7fc] text-slate-900 selection:bg-blue-100 lg:flex lg:h-screen lg:min-h-0 lg:overflow-hidden">
      {sidebarVisible && <aside className="w-full shrink-0 bg-[#111827] text-white lg:sticky lg:top-0 lg:h-screen lg:w-[220px] lg:overflow-y-auto">
        <div className="flex h-full flex-col px-3 py-3 lg:px-4 lg:py-5">
          <a href="/admin/chatbots" className="flex items-center gap-2 px-2 py-1.5">
            <span className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-br from-white to-blue-50 shadow-lg shadow-blue-950/20"><img src="/orken-mark.svg" alt="Orken AI logo" className="h-full w-full object-contain p-1" /></span>
            <span className="min-w-0"><span className="block text-base font-extrabold tracking-tight">SalesChatbot</span><span className="block text-[10px] text-white/55">Admin workspace</span></span>
          </a>
          <div className="mt-6 hidden px-2 text-[10px] font-bold uppercase tracking-[.18em] text-blue-200/60 lg:block">Workspace</div>
          <nav className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-1.5 lg:flex lg:flex-col" aria-label="Dashboard pages">
            <a href="/admin/dashboard" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${adminPage==='dashboard'?'bg-[#6D4AFF] text-white shadow-lg shadow-violet-950/20':'text-white/70 hover:bg-white/10 hover:text-white'}`}><LayoutDashboard size={16}/><span>Dashboard</span></a>
            <a href="/admin/chatbots" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${adminPage==='chatbots'?'bg-[#6D4AFF] text-white shadow-lg shadow-violet-950/20':'text-white/70 hover:bg-white/10 hover:text-white'}`}><Bot size={16}/><span>Chatbots</span></a>
            <a href="/admin/requests" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${adminPage==='requests'?'bg-[#6D4AFF] text-white shadow-lg shadow-violet-950/20':'text-white/70 hover:bg-white/10 hover:text-white'}`}><ClipboardList size={16}/><span>Client Requests</span></a>
            <a href="/admin/questions" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${adminPage==='questions'?'bg-[#6D4AFF] text-white shadow-lg shadow-violet-950/20':'text-white/70 hover:bg-white/10 hover:text-white'}`}><Code2 size={16}/><span>Client Questions</span></a>
            <a href="/admin/pricing-orders" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${adminPage==='pricing-orders'?'bg-[#6D4AFF] text-white shadow-lg shadow-violet-950/20':'text-white/70 hover:bg-white/10 hover:text-white'}`}><DollarSign size={16}/><span>Pricing Orders</span></a>
            <a href="/admin/users" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${adminPage==='users'?'bg-[#6D4AFF] text-white shadow-lg shadow-violet-950/20':'text-white/70 hover:bg-white/10 hover:text-white'}`}><Users size={16}/><span>Users</span></a>
            <a href="/admin/settings" className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${adminPage==='settings'?'bg-[#6D4AFF] text-white shadow-lg shadow-violet-950/20':'text-white/70 hover:bg-white/10 hover:text-white'}`}><Settings size={16}/><span>Settings</span></a>
          </nav>
          <div className="mt-auto hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-4 shadow-inner lg:block">
            <div className="text-xs font-semibold">Manage smarter</div><p className="mt-1 text-[11px] leading-4 text-white/50">Your chatbot settings, leads and client questions in one place.</p>
          </div>
        </div>
      </aside>}
      <div className="min-w-0 flex-1 lg:flex lg:h-screen lg:min-h-0 lg:flex-col">
      <header className="sticky top-0 z-20 w-full border-b border-slate-200/70 bg-white/85 shadow-[0_8px_30px_rgba(15,35,65,0.04)] backdrop-blur-2xl">
        <div className="flex min-h-[82px] w-full items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <div className="min-w-0">
            <div className="truncate text-xl font-extrabold tracking-tight text-[#10233f]">{adminPage==='dashboard'?'Dashboard overview':adminPage==='settings'?'Settings':adminPage==='users'?'Registered Users':adminPage==='requests'?'Client Requests':adminPage==='questions'?'Client Questions':adminPage==='pricing-orders'?'Pricing Orders':'Chatbot Workspace'}</div>
            <div className="truncate text-xs text-slate-500">SalesChatbot  /  Manage your business workspace</div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button onClick={() => setSidebarVisible(v => !v)} aria-label={sidebarVisible ? "Hide sidebar" : "Show sidebar"} title={sidebarVisible ? "Hide sidebar" : "Show sidebar"} className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">
              {sidebarVisible ? <PanelLeftClose size={17}/> : <PanelLeftOpen size={17}/>} <span className="hidden md:inline">{sidebarVisible ? "Hide sidebar" : "Show sidebar"}</span>
            </button>
            <button onClick={() => { signOut(); setLoggedIn(false); }} className="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-red-200 hover:bg-red-50 hover:text-[#d61616] sm:px-4">
              <LogOut size={16}/> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className={`mx-auto w-full max-w-[1500px] box-border px-3 py-5 sm:px-5 sm:py-7 lg:min-h-0 lg:flex-1 lg:px-8 ${adminPage === 'chatbots' ? 'lg:overflow-hidden' : 'lg:overflow-y-auto'}`}>
        {notice && <div className="mb-4 break-words rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{notice}</div>}

        {adminPage === 'dashboard' && <section className="mb-5 grid grid-cols-2 gap-3 xl:grid-cols-5" aria-label="Dashboard overview">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Total chatbots</span><span className="rounded-xl bg-blue-100 p-2 text-blue-700"><Bot size={17}/></span></div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{bots.length}</div><div className="mt-1 text-xs text-slate-500">Across your workspace</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Client questions</span><span className="rounded-xl bg-violet-100 p-2 text-violet-700"><ClipboardList size={17}/></span></div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{clientQuestions.length}</div><div className="mt-1 text-xs text-slate-500">Manager follow-ups</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Pricing orders</span><span className="rounded-xl bg-amber-100 p-2 text-amber-700"><DollarSign size={17}/></span></div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{pricingOrders.length}</div><div className="mt-1 text-xs text-slate-500">Orders received</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Client requests</span><span className="rounded-xl bg-violet-100 p-2 text-violet-700"><ClipboardList size={17}/></span></div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{requestLeads.length}</div><div className="mt-1 text-xs text-slate-500">Requests to review</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-500">Registered users</span><span className="rounded-xl bg-amber-100 p-2 text-amber-700"><Users size={17}/></span></div>
            <div className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900">{userProfiles.length}</div><div className="mt-1 text-xs text-slate-500">User accounts</div>
          </div>
        </section>}

        {adminPage === 'dashboard' && <section className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-3"><div><h2 className="font-bold text-slate-900">Recent client requests</h2><p className="mt-1 text-sm text-slate-500">Latest inquiries from your website</p></div><a href="/admin/requests" className="text-sm font-semibold text-[#6D4AFF] hover:underline">View all</a></div>
            {requestLeads.slice(0,5).length ? <div className="mt-4 divide-y divide-slate-100">{requestLeads.slice(0,5).map(lead => <div key={lead.id} className="flex min-w-0 items-center justify-between gap-3 py-3"><div className="min-w-0"><div className="truncate text-sm font-semibold text-slate-800">{lead.name || 'Unnamed client'}</div><div className="truncate text-xs text-slate-500">{lead.email}</div></div><div className="shrink-0 text-right"><div className="text-xs font-medium text-slate-700">{lead.chatbot_name || lead.order_type || 'Inquiry'}</div><div className="mt-1 text-[11px] text-slate-400">{new Date(lead.created_at).toLocaleDateString()}</div></div></div>)}</div> : <div className="mt-4 rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No client requests yet.</div>}
          </div>
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm"><h2 className="font-bold text-slate-900">Quick actions</h2><p className="mt-1 text-sm text-slate-500">Jump straight to common tasks.</p><div className="mt-4 grid gap-2"><a href="/admin/requests" className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold hover:border-violet-200 hover:bg-violet-50"><ClipboardList size={17} className="text-[#6D4AFF]"/> View client requests</a><a href="/admin/chatbots" className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold hover:border-violet-200 hover:bg-violet-50"><Bot size={17} className="text-[#6D4AFF]"/> Manage chatbots</a><a href="/admin/pricing-orders" className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold hover:border-violet-200 hover:bg-violet-50"><DollarSign size={17} className="text-[#6D4AFF]"/> Review pricing orders</a></div></div>
        </section>}

        {adminPage === 'settings' && <section className="max-w-3xl rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center gap-3"><div className="rounded-xl bg-violet-100 p-3 text-[#6D4AFF]"><Settings size={20}/></div><div><h2 className="text-lg font-bold">Workspace settings</h2><p className="text-sm text-slate-500">Read-only configuration overview</p></div></div><div className="mt-6 divide-y divide-slate-100"><div className="py-4"><div className="text-sm font-semibold">Backend</div><div className="mt-1 text-sm text-slate-500">Supabase connected through the existing project configuration.</div></div><div className="py-4"><div className="text-sm font-semibold">AI provider</div><div className="mt-1 text-sm text-slate-500">Google Gemini is called from the server-side Edge Function.</div></div><div className="py-4"><div className="text-sm font-semibold">Security</div><div className="mt-1 text-sm text-slate-500">Admin access is checked against the admin_users table. Never share API keys or service-role secrets in this dashboard.</div></div></div></section>}

        {adminPage === 'pricing-orders' && <PricingOrdersPanel />}

        {adminPage === 'users' && <div className="min-w-0 rounded-[1.5rem] border border-slate-200/70 bg-white p-4 shadow-[0_12px_40px_rgba(15,35,65,0.06)] sm:p-6">
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700"><Users size={22}/></div>
            <div className="min-w-0"><h2 className="text-xl font-bold">Registered Users</h2><p className="text-sm text-slate-500">Names, emails and email verification status. Passwords are never visible here.</p></div>
            <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{userProfiles.length} users</span>
          </div>
          {userProfiles.length === 0 ? <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No registered users found yet. Newly registered accounts appear here automatically after signup.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left text-sm">
                <thead><tr className="border-b text-xs uppercase text-slate-500"><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Email status</th><th className="p-3">Registered</th></tr></thead>
                <tbody>{userProfiles.map(user => <tr key={user.id} className="border-b last:border-0 hover:bg-slate-50/70">
                  <td className="p-3 font-semibold">{user.full_name || '—'}</td>
                  <td className="p-3 break-all">{user.email}</td>
                  <td className="p-3"><span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${user.email_confirmed_at ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>{user.email_confirmed_at ? 'Verified' : 'Not verified'}</span></td>
                  <td className="p-3 whitespace-nowrap text-slate-500">{new Date(user.created_at).toLocaleString()}</td>
                </tr>)}</tbody>
              </table>
            </div>
          )}
        </div>}

        {adminPage === 'questions' && <div className="min-w-0 rounded-[1.5rem] border border-slate-200/70 bg-white p-4 shadow-[0_12px_40px_rgba(15,35,65,0.06)] sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList size={20}/>
            <div>
              <h2 className="text-xl font-bold">Client Questions</h2>
              <p className="text-sm text-slate-500">Questions from visitors who requested a manager call.</p>
            </div>
            <span className="ml-auto rounded-full bg-slate-100 px-3 py-1 text-xs font-bold">{clientQuestions.length}</span>
          </div>
          {clientQuestions.length === 0 ? <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">No client questions yet.</div> : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead><tr className="border-b text-xs uppercase text-slate-500"><th className="p-3">Date & Time</th><th className="p-3">Phone Number</th><th className="p-3">Email</th><th className="p-3">Question</th></tr></thead>
                <tbody>{clientQuestions.map(lead => <tr key={lead.id} className="border-b last:border-0">
                  <td className="p-3 whitespace-nowrap">{new Date(lead.created_at).toLocaleString()}</td>
                  <td className="p-3 font-semibold whitespace-nowrap">{lead.phone || '—'}</td><td className="p-3 break-all">{lead.email || '—'}</td>
                  <td className="p-3 max-w-[520px] break-words">{lead.message}</td>
                </tr>)}</tbody>
              </table>            </div>
          )}
        </div>}

        {adminPage === 'requests' && <section className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-start gap-3"><div className="rounded-xl bg-violet-100 p-3 text-[#6D4AFF]"><ClipboardList size={21}/></div><div><h2 className="text-xl font-bold">Client Requests</h2><p className="mt-1 text-sm text-slate-500">Search, filter and review real inquiries from your website.</p></div></div><button onClick={() => load()} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold hover:bg-slate-50"><RefreshCw size={16}/> Refresh data</button></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="relative block sm:col-span-2"><span className="sr-only">Search requests</span><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"/><input value={requestSearch} onChange={e=>{setRequestSearch(e.target.value);setRequestPage(1);}} className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#6D4AFF] focus:ring-2 focus:ring-violet-100" placeholder="Search client, company, email or website"/></label>
              <select value={requestTypeFilter} onChange={e=>{setRequestTypeFilter(e.target.value);setRequestPage(1);}} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D4AFF]"><option value="all">All request types</option>{requestTypes.map(type=><option key={type} value={type}>{type}</option>)}</select>
              <select value={requestChatbotFilter} onChange={e=>{setRequestChatbotFilter(e.target.value);setRequestPage(1);}} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D4AFF]"><option value="all">All chatbots</option>{requestChatbots.map(name=><option key={name} value={name}>{name}</option>)}</select>
              <select value={requestDateFilter} onChange={e=>{setRequestDateFilter(e.target.value);setRequestPage(1);}} className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#6D4AFF] sm:col-span-2 xl:col-span-1"><option value="all">Any date</option><option value="today">Today</option><option value="7d">Last 7 days</option><option value="30d">Last 30 days</option></select>
              <button onClick={()=>{setRequestSearch('');setRequestTypeFilter('all');setRequestChatbotFilter('all');setRequestDateFilter('all');setRequestPage(1);}} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50">Clear filters</button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm"><span className="text-slate-500">Showing <b className="text-slate-800">{filteredRequests.length ? (requestPage-1)*requestPageSize+1 : 0}–{Math.min(requestPage*requestPageSize,filteredRequests.length)}</b> of <b className="text-slate-800">{filteredRequests.length}</b> matching requests</span><label className="flex items-center gap-2 text-slate-500">Sort by <select value={requestSort} onChange={e=>{setRequestSort(e.target.value as 'date'|'client'|'email');setRequestPage(1);}} className="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm text-slate-700"><option value="date">Date</option><option value="client">Client name</option><option value="email">Email</option></select><button onClick={()=>setRequestSortAsc(v=>!v)} className="rounded-lg border border-slate-200 p-1.5" title="Toggle sort direction"><ArrowUpDown size={15}/></button></label></div>
          </div>
          {filteredRequests.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-500"><Search size={20}/></div><h3 className="mt-3 font-bold text-slate-900">{requestLeads.length ? 'No matching requests' : 'No client requests yet'}</h3><p className="mt-1 text-sm text-slate-500">{requestLeads.length ? 'Try changing or clearing your filters.' : 'Requests submitted from the website will appear here.'}</p></div> : <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto"><table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="p-3"><button className="inline-flex items-center gap-1" onClick={()=>{setRequestSort('date');setRequestSortAsc(v=>!v);}}>Date <ArrowUpDown size={12}/></button></th><th className="p-3"><button className="inline-flex items-center gap-1" onClick={()=>{setRequestSort('client');setRequestSortAsc(v=>!v);}}>Client <ArrowUpDown size={12}/></button></th><th className="p-3"><button className="inline-flex items-center gap-1" onClick={()=>{setRequestSort('email');setRequestSortAsc(v=>!v);}}>Email <ArrowUpDown size={12}/></button></th><th className="p-3">Chatbot</th><th className="p-3">Type</th><th className="p-3">Website</th><th className="p-3">Details</th></tr></thead>
              <tbody>{visibleRequests.map(lead=>{const website=safeWebsiteUrl(lead.company_website);return <tr key={lead.id} onClick={()=>setSelectedRequest(lead)} tabIndex={0} onKeyDown={e=>{if(e.key==='Enter')setSelectedRequest(lead);}} className="cursor-pointer border-t border-slate-100 transition hover:bg-violet-50/40 focus:bg-violet-50/40"><td className="whitespace-nowrap p-3 text-slate-500">{new Date(lead.created_at).toLocaleString()}</td><td className="p-3"><div className="font-semibold text-slate-900">{lead.name||'Unnamed client'}</div><div className="text-xs text-slate-500">{lead.company||'—'}</div></td><td className="p-3"><span className="break-all">{lead.email}</span>{lead.phone&&<div className="text-xs text-slate-500">{lead.phone}</div>}</td><td className="p-3">{lead.chatbot_name||'Not specified'}</td><td className="p-3">{lead.order_type||'General inquiry'}</td><td className="p-3">{website?<a href={website} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} title={website} className="inline-flex max-w-[170px] items-center gap-1 text-[#6D4AFF] hover:underline"><span className="truncate">{lead.company_website}</span><ExternalLink size={13} className="shrink-0"/></a>:'—'}</td><td className="p-3"><button onClick={e=>{e.stopPropagation();setSelectedRequest(lead);}} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold hover:border-violet-300 hover:text-[#6D4AFF]">View details</button></td></tr>})}</tbody>
            </table></div>
            <div className="flex flex-col gap-3 border-t border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><span className="text-xs text-slate-500">Page {requestPage} of {requestPageCount}</span><div className="flex items-center gap-2"><button disabled={requestPage<=1} onClick={()=>setRequestPage(p=>Math.max(1,p-1))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft size={15}/> Previous</button><button disabled={requestPage>=requestPageCount} onClick={()=>setRequestPage(p=>Math.min(requestPageCount,p+1))} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40">Next <ChevronRight size={15}/></button></div></div>
          </div>}
          {selectedRequest && <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/40" onClick={()=>setSelectedRequest(null)}><aside role="dialog" aria-modal="true" aria-label="Request details" onClick={e=>e.stopPropagation()} className="h-full w-full max-w-xl overflow-y-auto bg-white p-5 shadow-2xl sm:p-7"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-wide text-[#6D4AFF]">Client inquiry</p><h2 className="mt-1 text-xl font-bold">{selectedRequest.name||'Unnamed client'}</h2><p className="mt-1 text-sm text-slate-500">{new Date(selectedRequest.created_at).toLocaleString()}</p></div><button onClick={()=>setSelectedRequest(null)} className="rounded-lg border border-slate-200 p-2" aria-label="Close details"><X size={18}/></button></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Email</div><div className="mt-1 break-all text-sm font-semibold">{selectedRequest.email||'—'}</div><div className="mt-3 flex flex-wrap gap-2"><button onClick={()=>{if(selectedRequest.email)navigator.clipboard.writeText(selectedRequest.email).then(()=>setNotice('Email copied.')).catch(()=>setNotice('Could not copy email.'));}} className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold"><Mail size={13}/> Copy email</button>{selectedRequest.email&&<a href={'mailto:'+selectedRequest.email} className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold">Open email</a>}</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Phone</div><div className="mt-1 text-sm font-semibold">{selectedRequest.phone||'—'}</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Company</div><div className="mt-1 break-words text-sm font-semibold">{selectedRequest.company||'—'}</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Chatbot / order type</div><div className="mt-1 break-words text-sm font-semibold">{selectedRequest.chatbot_name||'Not specified'} · {selectedRequest.order_type||'General inquiry'}</div></div><div className="rounded-xl bg-slate-50 p-3 sm:col-span-2"><div className="text-xs text-slate-500">Website</div>{safeWebsiteUrl(selectedRequest.company_website)?<a href={safeWebsiteUrl(selectedRequest.company_website)!} target="_blank" rel="noreferrer" className="mt-1 inline-flex max-w-full items-center gap-2 break-all text-sm font-semibold text-[#6D4AFF] hover:underline">{selectedRequest.company_website}<ExternalLink size={14}/></a>:'—'}</div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Primary goal</div><div className="mt-1 break-words text-sm">{selectedRequest.primary_goal||'—'}</div></div><div className="rounded-xl bg-slate-50 p-3"><div className="text-xs text-slate-500">Traffic volume</div><div className="mt-1 break-words text-sm">{selectedRequest.traffic_volume||'—'}</div></div><div className="rounded-xl bg-slate-50 p-3 sm:col-span-2"><div className="text-xs text-slate-500">Message</div><div className="mt-1 whitespace-pre-wrap break-words text-sm">{selectedRequest.message||'No message provided.'}</div></div></div></aside></div>}
        </section>}

        {adminPage === 'chatbots' && <div className="grid min-w-0 gap-4 lg:h-full lg:min-h-0 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6">
          <aside className="min-w-0 rounded-[1.5rem] border border-slate-200/70 bg-white p-3 shadow-[0_12px_40px_rgba(15,35,65,0.06)] sm:p-4 lg:h-full lg:min-h-0 lg:overflow-y-auto">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="truncate font-bold">Your Chatbots</h2>
              <button onClick={addBot} className="shrink-0 rounded-xl bg-[#6D4AFF] p-2 text-white shadow-md shadow-violet-700/15 transition hover:bg-[#5a39e8]"><Plus size={17}/></button>
            </div>
            <div className="grid gap-2">
              {bots.map(bot => (
                <button key={bot.id} onClick={() => setSelected(bot)} className={`w-full min-w-0 overflow-hidden rounded-2xl p-3 text-left ${selected?.id===bot.id?'bg-[#10233f] text-white':'bg-slate-50'}`}>
                  <div className="flex min-w-0 items-center gap-2">{bot.logo_url ? <img src={bot.logo_url} alt="" className="h-7 w-7 shrink-0 rounded-lg object-contain"/> : <Bot className="shrink-0" size={17}/>}<span className="truncate font-semibold">{bot.name}</span></div>
                  <div className="mt-1 truncate text-xs opacity-70">/{bot.slug}</div>
                </button>
              ))}
            </div>
          </aside>

          <section className="min-w-0 space-y-4 sm:space-y-6 lg:h-full lg:min-h-0 lg:overflow-y-auto">
            {!selected ? (
              <div className="rounded-3xl bg-white p-6 text-center sm:p-10">Create your first chatbot.</div>
            ) : <>
              <div className="min-w-0 rounded-[1.5rem] border border-slate-200/70 bg-white p-4 shadow-[0_12px_40px_rgba(15,35,65,0.06)] sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><h2 className="text-xl font-bold">Chatbot settings</h2><p className="text-sm text-slate-500">These settings control the public chatbot.</p></div>
                  <button onClick={saveBot} className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2 text-white shadow-md shadow-violet-700/15 transition hover:bg-[#5a39e8] sm:w-auto"><Save size={16}/> Save</button>
                </div>
                <div className="grid min-w-0 gap-4 md:grid-cols-2">
                  <input className={inputClass} value={selected.name} onChange={e=>setSelected({...selected,name:e.target.value})} placeholder="Chatbot name"/>
                  <input className={inputClass} value={selected.slug} onChange={e=>setSelected({...selected,slug:e.target.value})} placeholder="slug"/>
                  <textarea className={inputClass} value={selected.description||''} onChange={e=>setSelected({...selected,description:e.target.value})} placeholder="Description"/>
                  <textarea className={inputClass} rows={5} value={selected.system_prompt||''} onChange={e=>setSelected({...selected,system_prompt:e.target.value})} placeholder="System prompt"/>
                  <textarea className={inputClass + " md:col-span-2"} rows={3} value={selected.welcome_message||''} onChange={e=>setSelected({...selected,welcome_message:e.target.value})} placeholder="Welcome message"/>
                  <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-semibold">Chatbot Logo</label>
                      <input className={inputClass} value={selected.logo_url||''} onChange={e=>setSelected({...selected,logo_url:e.target.value})} placeholder="Logo image URL (https://...)" />
                      {selected.logo_url && <img src={selected.logo_url} alt={selected.name} className="mt-3 h-14 w-14 rounded-2xl object-contain border p-1" />}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-semibold">Brand Color</label>
                      <div className="flex gap-2">
                        <input type="color" className="h-11 w-14 rounded-lg border" value={selected.brand_color||'#111827'} onChange={e=>setSelected({...selected,brand_color:e.target.value})} />
                        <input className={inputClass} value={selected.brand_color||'#111827'} onChange={e=>setSelected({...selected,brand_color:e.target.value})} placeholder="#111827" />
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 border-t pt-5">
                    <div className="flex flex-col gap-1">
                      <h3 className="font-bold">Client Business Information</h3>
                      <p className="text-sm text-slate-500">Client yahan apne business ki information, FAQs, products, services aur approved answers de. Save karne ke baad chatbot isi information se visitors ko jawab dega.</p>
                    </div>

                    <label className="mt-4 mb-1 block text-sm font-semibold">Business information</label>
                    <textarea
                      className={inputClass}
                      rows={8}
                      value={selected.knowledge_description||''}
                      onChange={e=>setSelected({...selected,knowledge_description:e.target.value})}
                      placeholder={"Example:\nBusiness name: ...\nWhat we offer: ...\nServices: ...\nPricing: ...\nHow to use: ...\nContact details: ...\nFAQs and approved answers: ..."}
                    />

                    <label className="mt-4 mb-1 block text-sm font-semibold">Additional knowledge / instructions</label>
                    <textarea
                      className={inputClass + " font-mono text-xs"}
                      rows={8}
                      value={selected.knowledge_text||''}
                      onChange={e=>setSelected({...selected,knowledge_text:e.target.value})}
                      placeholder={"Add extra approved information here.\n\nChatbot instructions:\n- Answer only about this business.\n- Use only the information supplied above.\n- Never guess or invent facts.\n- If the answer is not available, ask for the visitor's phone number so the manager can follow up.\n- Do not answer unrelated questions."}
                    />

                    <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4">
                      <h4 className="font-bold text-sm text-blue-950">How to use this chatbot</h4>
                      <ol className="mt-2 list-decimal pl-5 space-y-1 text-xs leading-5 text-blue-900">
                        <li>Enter the client's business information and FAQs above.</li>
                        <li>Add accurate pricing, features, services and usage instructions.</li>
                        <li>Click <b>Save</b>. The information is stored in Supabase and remains after refresh.</li>
                        <li>Open the chatbot Demo and ask questions about the business.</li>
                        <li>The chatbot must answer only from the saved information; it should not invent answers.</li>                        <li>For an unrelated or unknown question, it asks for the visitor's phone number for manager follow-up.</li>
                      </ol>
                    </div>

                    <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4 text-xs text-amber-900">
                      <b>Important:</b> Do not put passwords, API keys, private customer data or other secrets in the business knowledge.
                    </div>
                  </div>
                  <label className="flex min-w-0 items-center gap-2 text-sm"><input type="checkbox" checked={selected.enabled} onChange={e=>setSelected({...selected,enabled:e.target.checked})}/> Public chatbot enabled</label>
                </div>
              </div>

              <div className="min-w-0 rounded-[1.5rem] border border-slate-200/70 bg-white p-4 shadow-[0_12px_40px_rgba(15,35,65,0.06)] sm:p-6">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0"><h2 className="flex items-center gap-2 text-xl font-bold"><DollarSign size={20}/> Pricing</h2><p className="text-sm text-slate-500">Change pricing here; the public site reads it from Supabase.</p></div>
                  <button onClick={addPrice} className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2 text-white shadow-md shadow-violet-700/15 transition hover:bg-[#5a39e8] sm:w-auto"><Plus size={16}/> Add plan</button>
                </div>
                <div className="space-y-4">
                  {prices.map(p=><div key={p.id} className="min-w-0 rounded-2xl border border-slate-200/80 bg-slate-50/70 p-3 transition-colors hover:bg-white sm:p-4">
                    <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <input className={smallInputClass} value={p.plan_name} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,plan_name:e.target.value}:x))}/>
                      <input className={smallInputClass} type="number" value={p.monthly_price} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,monthly_price:Number(e.target.value)}:x))}/>
                      <input className={smallInputClass} type="number" value={p.annual_price} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,annual_price:Number(e.target.value)}:x))}/>
                      <div className="flex min-w-0 gap-2"><button onClick={()=>savePrice(p)} className="min-w-0 flex-1 rounded-lg bg-slate-900 px-3 py-2 text-sm text-white">Save</button><button onClick={()=>removePrice(p.id)} className="shrink-0 rounded-lg border p-2"><Trash2 size={16}/></button></div>
                    </div>
                    <input className={smallInputClass + " mt-3"} value={p.description||''} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,description:e.target.value}:x))} placeholder="Plan description"/>
                    <textarea className={smallInputClass + " mt-3"} rows={2} value={(p.features||[]).join(', ')} onChange={e=>setPrices(prices.map(x=>x.id===p.id?{...x,features:e.target.value.split(',').map(v=>v.trim()).filter(Boolean)}:x))} placeholder="Features, comma separated"/>
                  </div>)}
                </div>
              </div>

              <div className="min-w-0 rounded-[1.5rem] border border-slate-200/70 bg-white p-4 shadow-[0_12px_40px_rgba(15,35,65,0.06)] sm:p-6">
                <div className="mb-4 flex min-w-0 items-center gap-2"><Code2 className="shrink-0" size={20}/><h2 className="truncate text-xl font-bold">Embed this chatbot</h2></div>
                <p className="break-words text-sm text-slate-500">Har chatbot ka apna embed code yahan save karein. Agar aap kuch paste nahi karte, default code automatically use hoga.</p>
                <textarea
                  className={inputClass + " mt-4 font-mono text-xs sm:text-sm"}
                  rows={5}
                  value={selected.embed_code || defaultEmbedCode}
                  onChange={e=>setSelected({...selected,embed_code:e.target.value})}
                  placeholder="Paste your chatbot embed code here"
                />
                <p className="mt-2 break-words text-xs text-slate-500">Custom code save karne ke liye upar <b>Save</b> button dabayein. Neeche wala code sirf copy/use ke liye hai; dashboard custom HTML ko execute nahi karta.</p>
                <pre className="mt-4 max-w-full overflow-hidden whitespace-pre-wrap break-all rounded-2xl bg-slate-950 p-3 text-xs text-slate-100 sm:p-4 sm:text-sm">{embedCode}</pre>
                <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
                  <button onClick={copyEmbed} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#6D4AFF] px-4 py-2 text-white shadow-md shadow-violet-700/15 transition hover:bg-[#5a39e8] sm:w-auto">{embedCopied?<Check size={16}/>:<Copy size={16}/>} {embedCopied?'Copied':'Copy embed code'}</button>
                  <a href={liveUrl} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center rounded-xl border px-4 py-2 sm:w-auto">Open live chatbot</a>
                  <button onClick={removeBot} className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-red-600 sm:w-auto"><Trash2 size={16}/> Delete chatbot</button>
                </div>
              </div>
            </>}
          </section>
        </div>}
      </main>
      </div>
    </div>
  );
}