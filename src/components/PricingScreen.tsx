import React, { useEffect, useState } from 'react';
import { callBackend } from '../lib/backendApi';
import { Check, ArrowRight, Sparkles, X } from 'lucide-react';

interface PricingScreenProps { onNavigateToContact: () => void; onOpenLiveChat: () => void; onShowToast: (title: string, message: string) => void; }
type Plan = { plan_name: string; monthly_price: number; annual_price: number; description: string; features: string[]; highlighted: boolean };
type RequestForm = { name: string; email: string; phone: string; company: string; message: string };
const emptyForm: RequestForm = { name: '', email: '', phone: '', company: '', message: '' };

export const PricingScreen: React.FC<PricingScreenProps> = ({ onNavigateToContact, onShowToast }) => {
  const [annual, setAnnual] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [faq, setFaq] = useState<number | null>(0);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [form, setForm] = useState<RequestForm>(emptyForm);
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { callBackend<{ prices: Plan[] }>({ action: 'config', slug: 'sales-chatbot' }).then(r => setPlans(r.prices || [])).catch(() => setPlans([])); }, []);
  const faqs = [
    ['Can I change plans?', 'Yes. Choose the plan that fits your business as you grow.'],
    ['Can I use my own website content?', 'Yes. Your chatbot can be configured for your business and knowledge.'],
    ['Are AI keys secure?', 'Yes. Provider keys stay on the backend, not in the browser.'],
  ];
  const openRequest = (plan: Plan) => { setSelectedPlan(plan); setSubmitted(false); setForm(emptyForm); };
  const submitRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setSending(true);
    const amount = annual ? Number(selectedPlan.annual_price || 0) * 12 : Number(selectedPlan.monthly_price || 0);
    try {
      await callBackend({
        action: 'lead', name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), company: form.company.trim(),
        plan_name: selectedPlan.plan_name, billing_type: annual ? 'annual' : 'monthly', requested_price: amount,
        primary_goal: 'Pricing request', chatbot_name: selectedPlan.plan_name, order_type: 'Pricing request',
        message: ['Pricing request from website.', 'Plan: ' + selectedPlan.plan_name, 'Billing: ' + (annual ? 'Yearly' : 'Monthly'),
          'Price: $' + amount + (annual ? ' per year' : ' per month'), form.message.trim() ? 'Business needs: ' + form.message.trim() : ''].filter(Boolean).join('\n'),
      });
      setSubmitted(true);
      onShowToast('Request sent', 'Your pricing request has been sent to our team.');
    } catch (error) { onShowToast('Could not send request', error instanceof Error ? error.message : 'Please try again.'); }
    finally { setSending(false); }
  };

  return <div className="w-full bg-white pb-10">
    <section className="px-5 sm:px-8 lg:px-12 pt-10 pb-8"><div className="max-w-6xl mx-auto">
      <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700"><Sparkles size={13}/>Simple pricing</span>
      <h1 className="mt-4 font-headline text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-950">Choose your AI chatbot plan.</h1>
      <p className="mt-3 max-w-xl text-base text-gray-600">Choose monthly or yearly billing, then send us your details to get started.</p>
      <div className="mt-6 inline-flex rounded-xl bg-gray-100 p-1">
        <button onClick={() => setAnnual(false)} className={'px-4 py-2 rounded-lg text-xs font-bold ' + (!annual ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500')}>Monthly</button>
        <button onClick={() => setAnnual(true)} className={'px-4 py-2 rounded-lg text-xs font-bold ' + (annual ? 'bg-gray-950 text-white' : 'text-gray-500')}>Yearly <span className="ml-1 opacity-70">Save 20%</span></button>
      </div>
    </div></section>
    <section className="bg-gray-50 border-y border-gray-100 px-5 sm:px-8 lg:px-12 py-8"><div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
      {plans.map(plan => {
        const displayedPrice = annual ? Number(plan.annual_price || 0) : Number(plan.monthly_price || 0);
        const annualTotal = Number(plan.annual_price || 0) * 12;
        return <article key={plan.plan_name} className={'rounded-2xl bg-white p-6 border ' + (plan.highlighted ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/10' : 'border-gray-200 shadow-sm')}>
          {plan.highlighted && <span className="inline-flex mb-3 rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Most popular</span>}
          <h2 className="text-xl font-bold text-gray-950">{plan.plan_name}</h2><p className="mt-2 min-h-[40px] text-sm text-gray-600">{plan.description}</p>
          <div className="mt-5"><span className="text-4xl font-extrabold text-gray-950">$ {displayedPrice}</span><span className="text-sm text-gray-500">/mo</span></div>
          <p className="mt-1 text-[11px] text-gray-400">{annual ? 'Billed yearly · $' + annualTotal + ' total per year' : 'Billed monthly · cancel according to plan terms'}</p>
          <ul className="mt-5 space-y-2.5 border-t pt-5">{(plan.features || []).slice(0, 5).map((f, i) => <li key={i} className="flex gap-2 text-sm text-gray-700"><Check size={16} className="mt-0.5 shrink-0 text-emerald-500"/>{f}</li>)}</ul>
          <button onClick={() => openRequest(plan)} className={'mt-6 w-full h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-bold ' + (plan.highlighted ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-950 hover:bg-gray-800 text-white')}>Get Started <ArrowRight size={15}/></button>
        </article>;
      })}
    </div>{plans.length === 0 && <div className="max-w-2xl mx-auto rounded-2xl bg-white border p-6 text-center text-sm text-gray-500">Pricing is temporarily unavailable.</div>}</section>
    <section className="px-5 sm:px-8 lg:px-12 py-8"><div className="max-w-3xl mx-auto">
      <h2 className="font-headline text-2xl font-bold text-gray-950">Quick answers</h2>
      <div className="mt-4 divide-y border-y">{faqs.map((f, i) => { const open = faq === i; return <div key={i}><button onClick={() => setFaq(open ? null : i)} className="w-full py-4 flex justify-between text-left text-sm font-semibold text-gray-900">{f[0]}<span>{open ? '−' : '+'}</span></button>{open && <p className="pb-4 pr-8 text-sm leading-6 text-gray-600">{f[1]}</p>}</div>; })}</div>
      <button onClick={onNavigateToContact} className="mt-5 text-sm font-bold text-blue-600">Have a question? Contact us <ArrowRight size={14} className="inline"/></button>
    </div></section>
    {selectedPlan && <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-labelledby="pricing-request-title">
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl sm:p-7">
        <button onClick={() => setSelectedPlan(null)} className="absolute right-4 top-4 rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Close form"><X size={19}/></button>
        {!submitted ? <>
          <div className="text-xs font-bold uppercase tracking-wider text-blue-600">Get started</div><h2 id="pricing-request-title" className="mt-2 pr-8 text-2xl font-extrabold text-slate-950">Request {selectedPlan.plan_name}</h2>
          <div className="mt-3 rounded-2xl bg-slate-50 p-4"><div className="text-sm font-semibold text-slate-700">{annual ? 'Yearly billing' : 'Monthly billing'}</div>
            <div className="mt-1 text-xl font-extrabold text-slate-950">{annual ? '$' + (Number(selectedPlan.annual_price || 0) * 12) + '/year' : '$' + Number(selectedPlan.monthly_price || 0) + '/month'}</div>
            {annual && <p className="mt-1 text-xs text-slate-500">Equivalent to ${Number(selectedPlan.annual_price || 0)}/month, billed yearly.</p>}
          </div>
          <form onSubmit={submitRequest} className="mt-5 space-y-3">
            <input required maxLength={120} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"/>
            <input required type="email" maxLength={254} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address" className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"/>
            <input required type="tel" maxLength={40} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone / WhatsApp number" className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"/>
            <input required maxLength={160} value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Business / company name" className="w-full rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"/>
            <textarea maxLength={2000} rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us briefly what you need (optional)" className="w-full resize-y rounded-xl border border-slate-200 p-3 text-sm outline-none focus:border-blue-500"/>
            <button disabled={sending} type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">{sending ? 'Sending request…' : 'Send pricing request'}</button>
            <p className="text-center text-xs text-slate-500">This form sends your request to our team; it does not charge you or process a payment.</p>
          </form>
        </> : <div className="py-8 text-center"><div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check size={28}/></div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-950">Request received!</h2><p className="mt-2 text-sm text-slate-600">Thank you. Our team will contact you about the {selectedPlan.plan_name} plan.</p>
          <button onClick={() => setSelectedPlan(null)} className="mt-6 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white">Done</button></div>}
      </div>
    </div>}
  </div>;
};
