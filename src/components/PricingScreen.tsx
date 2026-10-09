import React, { useEffect, useState } from 'react';
import { callBackend } from '../lib/backendApi';
import { Check, ArrowRight, Sparkles } from 'lucide-react';

interface PricingScreenProps {
  onNavigateToContact: (planName?: string, billingType?: string) => void;
  onOpenLiveChat: () => void;
  onShowToast: (title: string, message: string) => void;
}
type Plan = { plan_name: string; one_time_price: number; monthly_price: number; annual_price: number; description: string; features: string[]; highlighted: boolean };

export const PricingScreen: React.FC<PricingScreenProps> = ({ onNavigateToContact }) => {
  const [billing, setBilling] = useState<'one_time' | 'monthly' | 'annual'>('monthly');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [faq, setFaq] = useState<number | null>(0);
  useEffect(() => {
    callBackend<{ prices: Plan[] }>({ action: 'config', slug: 'sales-chatbot' })
      .then(result => setPlans(result.prices || [])).catch(() => setPlans([]));
  }, []);
  const faqs = [
    ['Can I change plans?', 'Yes. Choose the plan that fits your business as you grow.'],
    ['Can I use my own website content?', 'Yes. Your chatbot can be configured for your business and knowledge.'],
    ['Are AI keys secure?', 'Yes. Provider keys stay on the backend, not in the browser.'],
  ];
  return <div className="w-full bg-white pb-10">
    <section className="px-5 pt-10 pb-8 sm:px-8 lg:px-12"><div className="mx-auto max-w-6xl">
      <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-blue-700"><Sparkles size={13} /> Simple pricing</span>
      <h1 className="mt-4 font-headline text-3xl font-extrabold tracking-tight text-gray-950 sm:text-5xl">Choose your AI chatbot plan.</h1>
      <p className="mt-3 max-w-xl text-base text-gray-600">Start small, test your chatbot, and scale when your business grows.</p>
      <div className="mt-6 inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1">{(['one_time', 'monthly', 'annual'] as const).map(option =>
        <button key={option} onClick={() => setBilling(option)} className={'rounded-lg px-4 py-2 text-xs font-bold ' + (billing === option ? 'bg-gray-950 text-white' : 'text-gray-500')}>{option === 'one_time' ? 'One-time' : option === 'monthly' ? 'Monthly' : 'Annual'}</button>
      )}</div>
    </div></section>
    <section className="border-y border-gray-100 bg-gray-50 px-5 py-8 sm:px-8 lg:px-12"><div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 md:grid-cols-3">
      {plans.map(plan => {
        const price = billing === 'one_time' ? Number(plan.one_time_price || 0) : billing === 'annual' ? Number(plan.annual_price || 0) : Number(plan.monthly_price || 0);
        const customQuote = billing === 'one_time' && !(price > 0);
        return <article key={plan.plan_name} className={'rounded-2xl border bg-white p-6 ' + (plan.highlighted ? 'border-blue-500 shadow-lg ring-2 ring-blue-500/10' : 'border-gray-200 shadow-sm')}>
          {plan.highlighted && <span className="mb-3 inline-flex rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-700">Most popular</span>}
          <h2 className="text-xl font-bold text-gray-950">{plan.plan_name}</h2><p className="mt-2 min-h-[40px] text-sm text-gray-600">{plan.description}</p>
          <div className="mt-5"><span className="text-4xl font-extrabold text-gray-950">{customQuote ? 'Custom quote' : '$' + price}</span>{!customQuote && billing !== 'one_time' && <span className="ml-1 text-sm text-gray-500">{billing === 'annual' ? '/year' : '/mo'}</span>}</div>
          <p className="mt-1 text-[11px] text-gray-400">{billing === 'one_time' ? 'One-time payment' : billing === 'annual' ? 'Billed annually' : 'Billed monthly'}</p>
          <ul className="mt-5 space-y-2.5 border-t pt-5">{(plan.features || []).slice(0, 5).map((feature, index) => <li key={index} className="flex gap-2 text-sm text-gray-700"><Check size={16} className="mt-0.5 shrink-0 text-emerald-500" />{feature}</li>)}</ul>
          <button onClick={() => plan.plan_name === 'Enterprise' ? onNavigateToContact() : onNavigateToContact(plan.plan_name, billing)} className={'mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl text-sm font-bold ' + (plan.highlighted ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-950 text-white hover:bg-gray-800')}>{plan.plan_name === 'Enterprise' ? 'Contact us' : 'Get started'} <ArrowRight size={15} /></button>
        </article>;
      })}
    </div>{plans.length === 0 && <div className="mx-auto max-w-2xl rounded-2xl border bg-white p-6 text-center text-sm text-gray-500">Pricing is temporarily unavailable.</div>}</section>
    <section className="px-5 py-8 sm:px-8 lg:px-12"><div className="mx-auto max-w-3xl"><h2 className="font-headline text-2xl font-bold text-gray-950">Quick answers</h2>
      <div className="mt-4 divide-y border-y">{faqs.map((item, index) => { const open = faq === index; return <div key={item[0]}>
        <button onClick={() => setFaq(open ? null : index)} className="flex w-full justify-between py-4 text-left text-sm font-semibold text-gray-900">{item[0]}<span>{open ? '−' : '+'}</span></button>{open && <p className="pb-4 pr-8 text-sm leading-6 text-gray-600">{item[1]}</p>}
      </div>; })}</div>
      <button onClick={() => onNavigateToContact()} className="mt-5 text-sm font-bold text-blue-600">Have a question? Contact us <ArrowRight size={14} className="inline" /></button>
    </div></section>
  </div>;
};
