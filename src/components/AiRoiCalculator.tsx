import React, { useMemo, useState } from 'react';
import { Calculator, Clock3, Wallet, Users, TrendingUp, Bot } from 'lucide-react';

const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

export function AiRoiCalculator() {
  const [employees, setEmployees] = useState(5);
  const [payBasis, setPayBasis] = useState<'daily' | 'monthly'>('monthly');
  const [payPerEmployee, setPayPerEmployee] = useState(45000);
  const [workDays, setWorkDays] = useState(22);
  const [workHours, setWorkHours] = useState(8);
  const [hoursSaved, setHoursSaved] = useState(2);
  const [automationHours, setAutomationHours] = useState(24);
  const [monthlyAiCost, setMonthlyAiCost] = useState(15000);
  const [extraMonthlyProfit, setExtraMonthlyProfit] = useState(0);
  const [setupCost, setSetupCost] = useState(0);
  const [currency, setCurrency] = useState('PKR');

  const result = useMemo(() => {
    const people = Math.max(0, employees);
    const days = Math.max(1, workDays);
    const dailyPay = payBasis === 'daily' ? Math.max(0, payPerEmployee) : Math.max(0, payPerEmployee) / days;
    const hourlyPay = dailyPay / Math.max(1, workHours);
    const savedHoursPerPerson = Math.min(Math.max(0, hoursSaved), Math.max(0, workHours));
    const monthlyHoursSaved = people * savedHoursPerPerson * days;
    const monthlyCapacityValue = monthlyHoursSaved * hourlyPay;
    const monthlyAi = Math.max(0, monthlyAiCost);
    const additionalProfit = Math.max(0, extraMonthlyProfit);
    const directMonthlyImpact = additionalProfit - monthlyAi;
    const potentialMonthlyValue = monthlyCapacityValue + additionalProfit - monthlyAi;
    const annualPotentialValue = (monthlyCapacityValue + additionalProfit) * 12;
    const annualInvestment = monthlyAi * 12 + Math.max(0, setupCost);
    const roi = annualInvestment > 0 ? ((annualPotentialValue - annualInvestment) / annualInvestment) * 100 : null;
    const monthlyCashImpact = directMonthlyImpact;
    const payback = monthlyCashImpact > 0 && setupCost > 0 ? setupCost / monthlyCashImpact : null;
    return { monthlyHoursSaved, monthlyCapacityValue, directMonthlyImpact, potentialMonthlyValue, roi, payback, annualPotentialValue };
  }, [employees, payBasis, payPerEmployee, workDays, workHours, hoursSaved, monthlyAiCost, extraMonthlyProfit, setupCost]);

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
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">AI ROI & Profit Calculator</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">See how much staff time automation could free up, estimate its value, and compare it with your AI costs.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_.95fr]">
          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-center gap-2"><Users size={17} className="text-blue-700"/><h3 className="font-extrabold text-slate-900">1. Team and employee pay</h3></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">Number of employees<input className={fieldClass} type="number" min="0" step="1" value={employees} onChange={e=>setEmployees(Math.max(0,Number(e.target.value)||0))}/></label>
                <label className="text-xs font-bold text-slate-600">Pay frequency<select className={fieldClass} value={payBasis} onChange={e=>setPayBasis(e.target.value as 'daily' | 'monthly')}><option value="daily">Per employee / day</option><option value="monthly">Per employee / month</option></select></label>
                <label className="text-xs font-bold text-slate-600 sm:col-span-2">{payBasis === 'daily' ? 'Daily pay per employee' : 'Monthly pay per employee'}<input className={fieldClass} type="number" min="0" step="100" value={payPerEmployee} onChange={e=>setPayPerEmployee(Math.max(0,Number(e.target.value)||0))}/></label>
                <label className="text-xs font-bold text-slate-600">Working days per month<input className={fieldClass} type="number" min="1" max="31" step="1" value={workDays} onChange={e=>setWorkDays(Math.min(31,Math.max(1,Number(e.target.value)||1)))}/></label>
                <label className="text-xs font-bold text-slate-600">Work hours per employee / day<input className={fieldClass} type="number" min="1" max="24" step="0.5" value={workHours} onChange={e=>setWorkHours(Math.min(24,Math.max(1,Number(e.target.value)||1)))}/></label>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-center gap-2"><Bot size={17} className="text-blue-700"/><h3 className="font-extrabold text-slate-900">2. Automation and time saved</h3></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">Hours saved per employee / day<input className={fieldClass} type="number" min="0" max={workHours} step="0.5" value={hoursSaved} onChange={e=>setHoursSaved(Math.min(workHours,Math.max(0,Number(e.target.value)||0)))}/><span className="mt-1 block font-normal text-slate-500">Capped at the employee's daily working hours.</span></label>
                <label className="text-xs font-bold text-slate-600">Automation operating hours / day<input className={fieldClass} type="number" min="0" max="24" step="1" value={automationHours} onChange={e=>setAutomationHours(Math.min(24,Math.max(0,Number(e.target.value)||0)))}/><span className="mt-1 block font-normal text-slate-500">Set to 24 for round-the-clock availability.</span></label>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">Automation can run 24/7, but employee time savings are calculated only from the working hours you enter—not as 24 saved staff hours every day.</div>
            </div>
            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-center gap-2"><Wallet size={17} className="text-blue-700"/><h3 className="font-extrabold text-slate-900">3. AI costs and extra profit</h3></div>
              <div className="mb-4 flex items-center justify-between gap-3"><p className="text-xs text-slate-500">Choose the currency for all amounts.</p><select aria-label="Currency" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700" value={currency} onChange={e=>setCurrency(e.target.value)}><option value="PKR">PKR (Rs)</option><option value="USD">USD ($)</option><option value="GBP">GBP (£)</option><option value="EUR">EUR (€)</option></select></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">AI automation cost / month<input className={fieldClass} type="number" min="0" step="100" value={monthlyAiCost} onChange={e=>setMonthlyAiCost(Math.max(0,Number(e.target.value)||0))}/></label>
                <label className="text-xs font-bold text-slate-600">Extra monthly profit from faster service (optional)<input className={fieldClass} type="number" min="0" step="100" value={extraMonthlyProfit} onChange={e=>setExtraMonthlyProfit(Math.max(0,Number(e.target.value)||0))}/></label>
                <label className="text-xs font-bold text-slate-600 sm:col-span-2">One-time setup / implementation cost (optional)<input className={fieldClass} type="number" min="0" step="100" value={setupCost} onChange={e=>setSetupCost(Math.max(0,Number(e.target.value)||0))}/></label>
              </div>
            </div>
          </div>
          <div className="h-fit rounded-2xl border border-blue-100 bg-blue-50/60 p-5 lg:sticky lg:top-6">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><TrendingUp size={17} className="text-blue-700"/> Your estimated business results</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">Team members</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{employees}</p></div>
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">Automation coverage</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{automationHours} hrs/day</p></div>
              <div className="col-span-2 rounded-xl border border-white bg-white p-4"><p className="text-xs text-slate-500">Estimated staff hours freed / month</p><p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{result.monthlyHoursSaved.toLocaleString(undefined,{maximumFractionDigits:1})} hours</p></div>
              <div className="col-span-2 rounded-xl border border-white bg-white p-4"><p className="text-xs text-slate-500">Potential value of recovered staff time / month</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{money(result.monthlyCapacityValue)}</p><p className="mt-1 text-xs text-slate-500">Based on the employee pay and hours entered.</p></div>
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">Extra monthly profit entered</p><p className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{money(extraMonthlyProfit)}</p></div>
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">AI cost / month</p><p className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{money(monthlyAiCost)}</p></div>
              <div className="col-span-2 rounded-xl border border-white bg-white p-4"><p className="text-xs text-slate-500">Direct monthly profit impact*</p><p className={`mt-1 text-2xl font-extrabold tabular-nums ${result.directMonthlyImpact >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>{money(result.directMonthlyImpact)}</p><p className="mt-1 text-xs text-slate-500">Extra profit entered minus AI costs.</p></div>
              <div className="col-span-2 rounded-xl border border-blue-200 bg-blue-100/70 p-4"><p className="text-xs font-bold text-blue-900">Potential monthly value including staff capacity*</p><p className="mt-1 text-2xl font-extrabold tabular-nums text-blue-950">{money(result.potentialMonthlyValue)}</p><p className="mt-1 text-xs text-blue-900/80">Recovered time value + extra profit − AI cost.</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-blue-100 pt-4"><div><p className="text-xs text-slate-500">Illustrative first-year ROI</p><p className="mt-1 text-lg font-extrabold text-slate-900">{result.roi === null ? '—' : `${result.roi.toFixed(1)}%`}</p></div><div className="text-right"><p className="text-xs text-slate-500">Setup payback from extra profit*</p><p className="mt-1 text-lg font-extrabold text-slate-900">{setupCost === 0 ? 'No setup cost' : result.payback === null ? 'Not reached' : `${result.payback.toFixed(1)} months`}</p></div></div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><Clock3 size={14} className="mt-0.5 shrink-0"/> *Important: freed-up time is productivity capacity, not automatically cash profit. Direct profit impact uses only the extra profit you enter minus AI costs. Estimates are illustrative, not guaranteed.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
