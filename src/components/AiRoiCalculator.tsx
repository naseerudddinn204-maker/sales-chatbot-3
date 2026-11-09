import React, { useMemo, useState } from 'react';
import { Calculator, Clock3, Wallet, Users, TrendingUp, Bot, Mail } from 'lucide-react';

const inputClass = 'mt-2 w-full rounded-xl border border-white/10 bg-[#0b1930] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/10';
const labelClass = 'text-xs font-semibold leading-5 text-slate-300';

export function AiRoiCalculator() {
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
    const emailShare = Math.min(100, Math.max(0, emailWorkShare)) / 100;
    const coverage = Math.min(100, Math.max(0, automationCoverage)) / 100;
    const emailPayroll = totalPayroll * emailShare;
    const salaryEquivalentSaved = emailPayroll * coverage;
    const hoursSaved = people * Math.max(0, workHours) * Math.max(1, workDays) * emailShare * coverage;
    const aiCost = Math.max(0, monthlyAiCost);
    const monthlyNet = salaryEquivalentSaved - aiCost;
    const yearlyNet = monthlyNet * 12 - Math.max(0, setupCost);
    const payback = monthlyNet > 0 && setupCost > 0 ? setupCost / monthlyNet : null;
    return { totalPayroll, salaryEquivalentSaved, hoursSaved, monthlyNet, yearlyNet, payback, breakEvenAiCost: salaryEquivalentSaved };
  }, [employees, salaryPerEmployee, workDays, workHours, emailWorkShare, automationCoverage, monthlyAiCost, setupCost]);

  const money = (value: number) => new Intl.NumberFormat('en-PK', {
    style: 'currency', currency, maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

  const number = (value: number) => new Intl.NumberFormat('en-PK', { maximumFractionDigits: 1 }).format(value);

  return (
    <section id="ai-roi-calculator" className="bg-[#071225] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <span className="inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-2 text-xs font-bold tracking-wide text-blue-300">FREE BUSINESS TOOL</span>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white sm:text-5xl">Discover Your <span className="text-blue-400">AI Automation ROI</span></h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">Find out how much time and potential labor value your business could save by automating routine email reading and replies.</p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-white/10 bg-[#101f38] p-5 shadow-xl shadow-black/10 sm:p-7">
            <h3 className="mb-7 text-xl font-bold text-white sm:text-2xl">Tell us about your business</h3>

            <div className="space-y-7">
              <div>
                <div className="mb-4 flex items-center gap-2"><Users size={17} className="text-blue-400"/><h4 className="font-semibold text-white">Your office team</h4></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>Number of employees<input className={inputClass} type="number" min="0" step="1" value={employees} onChange={e=>setEmployees(Math.max(0,Number(e.target.value)||0))}/></label>
                  <label className={labelClass}>Monthly salary per employee<input className={inputClass} type="number" min="0" step="500" value={salaryPerEmployee} onChange={e=>setSalaryPerEmployee(Math.max(0,Number(e.target.value)||0))}/></label>
                  <label className={labelClass}>Working days per month<input className={inputClass} type="number" min="1" max="31" step="1" value={workDays} onChange={e=>setWorkDays(Math.min(31,Math.max(1,Number(e.target.value)||1)))}/></label>
                  <label className={labelClass}>Working hours per employee / day<input className={inputClass} type="number" min="1" max="24" step="0.5" value={workHours} onChange={e=>setWorkHours(Math.min(24,Math.max(1,Number(e.target.value)||1)))}/></label>
                </div>
                <p className="mt-3 rounded-xl border border-white/5 bg-[#0b1930] p-3 text-xs leading-5 text-slate-400">Example: 3 employees × Rs 20,000 monthly salary = Rs 60,000 total monthly payroll, working 8 hours per day.</p>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="mb-4 flex items-center gap-2"><Mail size={17} className="text-blue-400"/><h4 className="font-semibold text-white">Email work handled by AI</h4></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>Share of staff time spent on emails (%)<input className={inputClass} type="number" min="0" max="100" step="5" value={emailWorkShare} onChange={e=>setEmailWorkShare(Math.min(100,Math.max(0,Number(e.target.value)||0)))}/><span className="mt-1 block font-normal text-slate-500">100% means their full workday is email reading and replying.</span></label>
                  <label className={labelClass}>How much email work will AI automate? (%)<input className={inputClass} type="number" min="0" max="100" step="5" value={automationCoverage} onChange={e=>setAutomationCoverage(Math.min(100,Math.max(0,Number(e.target.value)||0)))}/><span className="mt-1 block font-normal text-slate-500">Sensitive replies can still require human approval.</span></label>
                  <label className={labelClass + ' sm:col-span-2'}>AI system availability per day (hours)<input className={inputClass} type="number" min="0" max="24" step="1" value={automationHours} onChange={e=>setAutomationHours(Math.min(24,Math.max(0,Number(e.target.value)||0)))}/><span className="mt-1 block font-normal text-slate-500">AI can monitor incoming emails 24/7. This does not mean employees save 24 working hours every day.</span></label>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6">
                <div className="mb-4 flex items-center gap-2"><Wallet size={17} className="text-blue-400"/><h4 className="font-semibold text-white">Automation investment</h4></div>
                <div className="mb-4 flex items-center justify-between gap-3"><label htmlFor="roi-currency" className="text-xs font-semibold text-slate-300">Currency</label><select id="roi-currency" className="rounded-xl border border-white/10 bg-[#0b1930] px-3 py-2 text-sm font-semibold text-white outline-none focus:border-blue-400" value={currency} onChange={e=>setCurrency(e.target.value)}><option value="PKR">PKR (Rs)</option><option value="USD">USD ($)</option><option value="GBP">GBP (£)</option><option value="EUR">EUR (€)</option></select></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className={labelClass}>AI automation cost per month<input className={inputClass} type="number" min="0" step="500" value={monthlyAiCost} onChange={e=>setMonthlyAiCost(Math.max(0,Number(e.target.value)||0))}/></label>
                  <label className={labelClass}>One-time setup cost (optional)<input className={inputClass} type="number" min="0" step="500" value={setupCost} onChange={e=>setSetupCost(Math.max(0,Number(e.target.value)||0))}/></label>
                </div>
              </div>
            </div>
          </section>

          <section className="h-fit rounded-3xl border border-blue-400/20 bg-gradient-to-br from-[#122c52] to-[#10172c] p-5 shadow-xl shadow-black/10 sm:p-7">
            <span className="text-xs font-bold tracking-wider text-blue-300">YOUR ESTIMATED RESULTS</span>
            <h3 className="mt-2 text-2xl font-bold text-white">Your AI Savings Report</h3>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Result label="Total monthly salaries" value={money(result.totalPayroll)}/>
              <Result label="AI availability" value={`${automationHours} hours/day`}/>
              <Result label="Potential hours saved / month" value={number(result.hoursSaved)} suffix=" hrs"/>
              <Result label="Monthly labor value" value={money(result.salaryEquivalentSaved)}/>
              <Result label="AI cost / month" value={money(monthlyAiCost)}/>
              <Result label="Break-even AI budget / month" value={money(result.breakEvenAiCost)}/>
            </div>
            <div className="mt-4 rounded-2xl border border-blue-300/20 bg-blue-500/10 p-5">
              <p className="text-sm font-medium text-blue-200">Estimated monthly net benefit / capacity value</p>
              <p className={`mt-2 break-words text-3xl font-bold tabular-nums sm:text-4xl ${result.monthlyNet >= 0 ? 'text-white' : 'text-rose-300'}`}>{money(result.monthlyNet)}</p>
              <p className="mt-2 text-xs leading-5 text-blue-100/70">Estimated salary-cost equivalent released minus AI monthly cost.</p>
              <div className="mt-5 border-t border-blue-300/20 pt-4">
                <p className="text-sm text-blue-200">Estimated first-year net benefit</p>
                <p className="mt-1 text-2xl font-bold text-white">{money(result.yearlyNet)}</p>
                <p className="mt-4 text-sm text-blue-200">Estimated setup payback</p>
                <p className="mt-1 text-xl font-semibold text-white">{setupCost === 0 ? 'No setup cost' : result.payback === null ? 'Not reached' : `${result.payback.toFixed(1)} months`}</p>
              </div>
            </div>
            <a href="https://orken.us/" target="_blank" rel="noopener noreferrer" className="mt-5 flex w-full items-center justify-center rounded-xl bg-blue-500 px-5 py-4 text-center text-sm font-bold text-white transition hover:bg-blue-400">Get My Personalized AI Automation Plan →</a>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-400"><Clock3 size={14} className="mt-0.5 shrink-0"/> Illustrative estimates only. Staff time value is not automatically cash saved. Actual results depend on email volume, automation coverage, accuracy, human review and AI system costs.</p>
          </section>
        </div>

        <section className="mt-12 text-center">
          <h3 className="text-2xl font-bold text-white">Why automate your business?</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Feature icon={<Clock3 size={19}/>} title="Save Time" description="Reduce repetitive manual tasks and free your team for valuable work."/>
            <Feature icon={<Bot size={19}/>} title="Work Smarter" description="Automate email reading, replies and everyday business workflows."/>
            <Feature icon={<TrendingUp size={19}/>} title="Grow Faster" description="Build efficient systems that can support your business growth."/>
          </div>
        </section>
        <footer className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-slate-500">Powered by Orken AI · AI Solutions & Automation</footer>
      </div>
    </section>
  );
}

function Result({ label, value, suffix = '' }: { label: string; value: string; suffix?: string }) {
  return <div className="rounded-2xl border border-white/10 bg-white/5 p-4"><p className="text-xs leading-5 text-slate-400">{label}</p><p className="mt-2 break-words text-xl font-bold text-white sm:text-2xl">{value}{suffix}</p></div>;
}

function Feature({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="rounded-2xl border border-white/10 bg-[#101f38] p-5 text-left"><span className="inline-flex rounded-xl bg-blue-500/10 p-2 text-blue-300">{icon}</span><h4 className="mt-3 text-base font-semibold text-blue-300">{title}</h4><p className="mt-2 text-sm leading-6 text-slate-400">{description}</p></div>;
}
