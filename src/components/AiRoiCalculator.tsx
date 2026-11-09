import React, { useMemo, useState } from 'react';
import { Calculator, Clock3, Wallet, Users, TrendingUp, Bot, Mail } from 'lucide-react';

const fieldClass = 'mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100';

export function AiRoiCalculator() {
  // Editable office example: 3 staff, Rs 20,000 each per month, 8-hour shifts.
  const [employees, setEmployees] = useState(3);
  const [salaryPerEmployee, setSalaryPerEmployee] = useState(20000);
  const [workDays, setWorkDays] = useState(26);
  const [workHours, setWorkHours] = useState(8);
  const [emailWorkShare, setEmailWorkShare] = useState(100);
  const [automationCoverage, setAutomationCoverage] = useState(100);
  const [automationHours, setAutomationHours] = useState(24);
  const [monthlyAiCost, setMonthlyAiCost] = useState(15000);
  const [setupCost, setSetupCost] = useState(0);
  const [currency, setCurrency] = useState('PKR');

  const result = useMemo(() => {
    const people = Math.max(0, employees);
    const salary = Math.max(0, salaryPerEmployee);
    const totalPayroll = people * salary;
    const emailPayroll = totalPayroll * Math.min(100, Math.max(0, emailWorkShare)) / 100;
    const coverage = Math.min(100, Math.max(0, automationCoverage)) / 100;
    const salaryEquivalentSaved = emailPayroll * coverage;
    const hoursSaved = people * Math.max(0, workHours) * Math.max(1, workDays) * (Math.min(100, Math.max(0, emailWorkShare)) / 100) * coverage;
    const aiCost = Math.max(0, monthlyAiCost);
    const monthlyNet = salaryEquivalentSaved - aiCost;
    const yearlyNet = monthlyNet * 12 - Math.max(0, setupCost);
    const payback = monthlyNet > 0 && setupCost > 0 ? setupCost / monthlyNet : null;
    const breakEvenAiCost = salaryEquivalentSaved;
    return { totalPayroll, emailPayroll, salaryEquivalentSaved, hoursSaved, monthlyNet, yearlyNet, payback, breakEvenAiCost };
  }, [employees, salaryPerEmployee, workDays, workHours, emailWorkShare, automationCoverage, monthlyAiCost, setupCost]);

  const money = (value: number) => new Intl.NumberFormat('en-PK', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

  return (
    <section id="ai-roi-calculator" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-6 sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan-200"><Calculator size={24}/></span>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-cyan-200">Real office example</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">Email Automation Savings Calculator</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">Estimate what your business could save by automating routine email reading and replies instead of having staff spend their working hours on them.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-7 p-5 sm:p-7 lg:grid-cols-[1fr_.95fr]">
          <div className="space-y-6">
            <div>
              <div className="mb-4 flex items-center gap-2"><Users size={17} className="text-blue-700"/><h3 className="font-extrabold text-slate-900">1. Your office team</h3></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">Number of employees<input className={fieldClass} type="number" min="0" step="1" value={employees} onChange={e=>setEmployees(Math.max(0,Number(e.target.value)||0))}/></label>
                <label className="text-xs font-bold text-slate-600">Monthly salary per employee<input className={fieldClass} type="number" min="0" step="500" value={salaryPerEmployee} onChange={e=>setSalaryPerEmployee(Math.max(0,Number(e.target.value)||0))}/></label>
                <label className="text-xs font-bold text-slate-600">Working days per month<input className={fieldClass} type="number" min="1" max="31" step="1" value={workDays} onChange={e=>setWorkDays(Math.min(31,Math.max(1,Number(e.target.value)||1)))}/></label>
                <label className="text-xs font-bold text-slate-600">Working hours per employee / day<input className={fieldClass} type="number" min="1" max="24" step="0.5" value={workHours} onChange={e=>setWorkHours(Math.min(24,Math.max(1,Number(e.target.value)||1)))}/></label>
              </div>
              <div className="mt-3 rounded-xl bg-slate-50 p-3 text-xs leading-5 text-slate-600">Example pre-filled: 3 employees × Rs 20,000 monthly salary = Rs 60,000 total monthly payroll, working 8 hours per day.</div>
            </div>
            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-center gap-2"><Mail size={17} className="text-blue-700"/><h3 className="font-extrabold text-slate-900">2. Email work handled by AI</h3></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">Share of staff time spent on emails<input className={fieldClass} type="number" min="0" max="100" step="5" value={emailWorkShare} onChange={e=>setEmailWorkShare(Math.min(100,Math.max(0,Number(e.target.value)||0)))}/><span className="mt-1 block font-normal text-slate-500">100% means their full workday is email reading and replying.</span></label>
                <label className="text-xs font-bold text-slate-600">How much of this email work will AI automate? (%)<input className={fieldClass} type="number" min="0" max="100" step="5" value={automationCoverage} onChange={e=>setAutomationCoverage(Math.min(100,Math.max(0,Number(e.target.value)||0)))}/><span className="mt-1 block font-normal text-slate-500">Use a realistic estimate; sensitive replies can still need approval.</span></label>
                <label className="text-xs font-bold text-slate-600 sm:col-span-2">AI system availability per day (hours)<input className={fieldClass} type="number" min="0" max="24" step="1" value={automationHours} onChange={e=>setAutomationHours(Math.min(24,Math.max(0,Number(e.target.value)||0)))}/><span className="mt-1 block font-normal text-slate-500">Automation can monitor incoming emails 24/7. This does not mean 24 employee work hours are saved daily.</span></label>
              </div>
            </div>
            <div className="border-t border-slate-100 pt-5">
              <div className="mb-4 flex items-center gap-2"><Wallet size={17} className="text-blue-700"/><h3 className="font-extrabold text-slate-900">3. Automation investment</h3></div>
              <div className="mb-4 flex items-center justify-between gap-3"><p className="text-xs text-slate-500">Currency</p><select aria-label="Currency" className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700" value={currency} onChange={e=>setCurrency(e.target.value)}><option value="PKR">PKR (Rs)</option><option value="USD">USD ($)</option><option value="GBP">GBP (£)</option><option value="EUR">EUR (€)</option></select></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-bold text-slate-600">AI automation cost per month<input className={fieldClass} type="number" min="0" step="500" value={monthlyAiCost} onChange={e=>setMonthlyAiCost(Math.max(0,Number(e.target.value)||0))}/></label>
                <label className="text-xs font-bold text-slate-600">One-time setup cost (optional)<input className={fieldClass} type="number" min="0" step="500" value={setupCost} onChange={e=>setSetupCost(Math.max(0,Number(e.target.value)||0))}/></label>
              </div>
            </div>
          </div>
          <div className="h-fit rounded-2xl border border-blue-100 bg-blue-50/60 p-5 lg:sticky lg:top-6">
            <div className="flex items-center gap-2 text-sm font-extrabold text-slate-900"><TrendingUp size={17} className="text-blue-700"/> Estimated savings for your office</div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">Total monthly salaries</p><p className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{money(result.totalPayroll)}</p></div>
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">AI availability</p><p className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{automationHours} hours/day</p></div>
              <div className="col-span-2 rounded-xl border border-white bg-white p-4"><p className="text-xs text-slate-500">Estimated staff hours freed per month</p><p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{result.hoursSaved.toLocaleString('en-PK',{maximumFractionDigits:1})} hours</p></div>
              <div className="col-span-2 rounded-xl border border-white bg-white p-4"><p className="text-xs text-slate-500">Monthly salary-cost equivalent of automated email work</p><p className="mt-1 text-2xl font-extrabold tabular-nums text-slate-900">{money(result.salaryEquivalentSaved)}</p><p className="mt-1 text-xs text-slate-500">Based on the email-work share and automation percentage above.</p></div>
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">AI cost / month</p><p className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{money(monthlyAiCost)}</p></div>
              <div className="rounded-xl border border-white bg-white p-3"><p className="text-xs text-slate-500">Break-even AI budget / month</p><p className="mt-1 text-lg font-extrabold tabular-nums text-slate-900">{money(result.breakEvenAiCost)}</p></div>
              <div className="col-span-2 rounded-xl border border-blue-200 bg-blue-100/70 p-4"><p className="text-xs font-bold text-blue-900">Estimated net monthly saving / capacity value</p><p className={`mt-1 text-2xl font-extrabold tabular-nums ${result.monthlyNet >= 0 ? 'text-blue-950' : 'text-rose-700'}`}>{money(result.monthlyNet)}</p><p className="mt-1 text-xs text-blue-900/80">Salary-cost equivalent released minus AI monthly cost.</p></div>
              <div className="col-span-2 rounded-xl border border-white bg-white p-4"><p className="text-xs text-slate-500">Estimated net value over 12 months, after setup cost</p><p className="mt-1 text-xl font-extrabold tabular-nums text-slate-900">{money(result.yearlyNet)}</p><p className="mt-1 text-xs text-slate-500">Includes 12 months of AI cost and one-time setup cost.</p></div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-blue-100 pt-4"><div><p className="text-xs text-slate-500">Setup payback estimate</p><p className="mt-1 text-lg font-extrabold text-slate-900">{setupCost === 0 ? 'No setup cost' : result.payback === null ? 'Not reached' : `${result.payback.toFixed(1)} months`}</p></div><div className="text-right"><p className="text-xs text-slate-500">Email work automated</p><p className="mt-1 text-lg font-extrabold text-slate-900">{automationCoverage}%</p></div></div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500"><Clock3 size={14} className="mt-0.5 shrink-0"/> Important: this is the salary-cost equivalent of staff capacity freed, not guaranteed cash savings or a recommendation to remove employees. If staff remain employed, the benefit is time they can use for other work. Actual results depend on email volume, accuracy, human review, and the AI system cost.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
