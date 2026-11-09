import React, { useMemo, useState } from 'react';
import { Calculator, ArrowUpRight, Clock3, Wallet } from 'lucide-react';

const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

export function AiRoiCalculator() {
  const [hoursPerWeek, setHoursPerWeek] = useState(10);
  const [hourlyCost, setHourlyCost] = useState(15);
  const [monthlyAiCost, setMonthlyAiCost] = useState(100);
  const [setupCost, setSetupCost] = useState(0);
  const [currency, setCurrency] = useState('USD');

  const result = useMemo(() => {
    const hoursMonthly = Math.max(0, hoursPerWeek) * 4.33;
    const grossMonthly = hoursMonthly * Math.max(0, hourlyCost);
    const netMonthly = grossMonthly - Math.max(0, monthlyAiCost);
    const annualBenefit = grossMonthly * 12;
    const annualCosts = Math.max(0, monthlyAiCost) * 12 + Math.max(0, setupCost);
    const roi = annualCosts > 0 ? ((annualBenefit - annualCosts) / annualCosts) * 100 : null;
    const payback = netMonthly > 0 && setupCost > 0 ? setupCost / netMonthly : null;
    return { hoursMonthly, grossMonthly, netMonthly, roi, payback };
  }, [hoursPerWeek, hourlyCost, monthlyAiCost, setupCost]);

  const money = (value: number) => new Intl.NumberFormat(undefined, {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

  return (
    <section id="ai-roi-calculator" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-200"><Calculator size={24}/></span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-200">Business calculator</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">AI ROI Calculator</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Estimate the potential value of time saved with AI tools and automation. Adjust the figures to match your business.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_.9fr]">
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div><h3 className="font-extrabold text-slate-900">Your business estimates</h3><p className="mt-1 text-xs text-slate-500">Use your own approximate costs.</p></div>
              <select aria-label="Currency" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700" value={currency} onChange={e=>setCurrency(e.target.value)}>
                <option value="USD">USD ($)</option><option value="PKR">PKR (Rs)</option><option value="GBP">GBP (£)</option><option value="EUR">EUR (€)</option>
              </select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-xs font-bold text-slate-600">Hours saved per week<input className={fieldClass} type="number" min="0" step="0.5" value={hoursPerWeek} onChange={e=>setHoursPerWeek(Math.max(0,Number(e.target.value)||0))}/></label>
              <label className="text-xs font-bold text-slate-600">Employee cost per hour<input className={fieldClass} type="number" min="0" step="1" value={hourlyCost} onChange={e=>setHourlyCost(Math.max(0,Number(e.target.value)||0))}/></label>
              <label className="text-xs font-bold text-slate-600">AI tools cost per month<input className={fieldClass} type="number" min="0" step="1" value={monthlyAiCost} onChange={e=>setMonthlyAiCost(Math.max(0,Number(e.target.value)||0))}/></label>
              <label className="text-xs font-bold text-slate-600">One-time setup cost (optional)<input className={fieldClass} type="number" min="0" step="1" value={setupCost} onChange={e=>setSetupCost(Math.max(0,Number(e.target.value)||0))}/></label>
            </div>
            <p className="mt-4 text-xs leading-5 text-slate-500">The estimate treats saved work time as potential labour capacity value. It does not assume staff reductions or guaranteed cash savings.</p>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><Wallet size={17} className="text-blue-700"/> Estimated results</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">Hours saved / month</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{result.hoursMonthly.toFixed(1)}</p></div>
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">Time value / month</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{money(result.grossMonthly)}</p></div>
              <div className="col-span-2 rounded-xl border border-white bg-white p-4"><p className="text-xs text-slate-500">Estimated net value per month</p><p className={`mt-1 text-2xl font-extrabold tabular-nums ${result.netMonthly >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{money(result.netMonthly)}</p><p className="mt-1 text-xs text-slate-500">Time value minus monthly AI tool costs</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-blue-100 pt-4"><div><p className="text-xs text-slate-500">Estimated first-year ROI</p><p className="mt-1 text-lg font-extrabold text-slate-900">{result.roi === null ? '—' : `${result.roi.toFixed(1)}%`}</p></div><div className="text-right"><p className="text-xs text-slate-500">Setup payback period</p><p className="mt-1 text-lg font-extrabold text-slate-900">{setupCost === 0 ? 'No setup cost' : result.payback === null ? 'Not reached' : `${result.payback.toFixed(1)} months`}</p></div></div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><Clock3 size={14} className="mt-0.5 shrink-0"/> Illustrative estimate only. Actual results depend on adoption, task quality, implementation, and business costs.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
