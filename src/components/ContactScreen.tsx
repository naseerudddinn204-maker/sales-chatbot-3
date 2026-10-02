import React, { useState } from 'react';
import { DemoFormData } from '../types';

interface ContactScreenProps {
  onOpenLiveChat: () => void;
  onOpenBookDemo: () => void;
  onShowToast: (title: string, message: string) => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({
  onOpenLiveChat,
  onOpenBookDemo,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<DemoFormData>({
    fullName: '',
    workEmail: '',
    companyWebsite: '',
    trafficVolume: 'under10k',
    primaryGoal: 'support',
    message: '',
    agreedToTerms: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { callBackend } = await import('../lib/backendApi');
      await callBackend({
        action: 'lead',
        name: formData.fullName,
        email: formData.workEmail,
        company_website: formData.companyWebsite,
        traffic_volume: formData.trafficVolume,
        primary_goal: formData.primaryGoal,
        message: formData.message,
      });

      setIsSubmitted(true);
      onShowToast(
        'Inquiry Sent Successfully',
        `Thank you ${formData.fullName || 'there'}! Your inquiry has been saved and our AI Specialist will follow up shortly.`
      );

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          fullName: '',
          workEmail: '',
          companyWebsite: '',
          trafficVolume: 'under10k',
          primaryGoal: 'support',
          message: '',
          agreedToTerms: false,
        });
      }, 3500);
    } catch (error) {
      onShowToast(
        'Submission Failed',
        error instanceof Error ? error.message : 'Please try again in a moment.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText('sales@chatbot.com');
    setCopiedEmail(true);
    onShowToast('Email Copied to Clipboard', 'sales@chatbot.com is ready in your clipboard.');
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Hero Header Section */}
      <section className="px-4 sm:px-6 py-6 flex flex-col items-start gap-3">
        {/* Status / Channel Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fee2e2] text-[#991b1b]">
          <span className="w-2 h-2 rounded-full bg-[#d61616] animate-pulse" />
          <span className="text-[11px] font-bold tracking-wider uppercase font-sans">
            Get In Touch
          </span>
        </div>

        <h1 className="font-headline text-[28px] sm:text-[34px] text-[#111827] tracking-tight font-extrabold leading-[1.2]">
          Talk with our AI Chatbot Experts
        </h1>

        <p className="text-[15px] sm:text-[16px] text-[#4b5563] leading-relaxed">
          Have questions about enterprise setup, custom AI integrations, or want a tailored walkthrough? We are here to help.
        </p>

        {/* Quick Stats Metric Micro-Bar */}
        <div className="w-full grid grid-cols-2 gap-2 mt-2 pt-2">
          <div className="p-3 rounded-xl bg-[#f0f3ff] flex flex-col border border-blue-50/50">
            <span className="font-headline text-[22px] sm:text-[24px] text-[#111827] font-bold tabular-nums">
              &lt; 2 hrs
            </span>
            <span className="text-[12px] text-[#4b5563]">Average response time</span>
          </div>
          <div className="p-3 rounded-xl bg-[#f0f3ff] flex flex-col border border-blue-50/50">
            <div className="flex items-center gap-1">
              <span className="font-headline text-[22px] sm:text-[24px] text-[#111827] font-bold tabular-nums">
                35k+
              </span>
              <span className="material-symbols-outlined text-[#0050cc] text-[18px]">verified</span>
            </div>
            <span className="text-[12px] text-[#4b5563]">Active global brands</span>
          </div>
        </div>
      </section>

      {/* Quick Contact Channels */}
      <section className="px-4 sm:px-6 pb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[14px] text-[#111827] font-bold">Instant Channels</span>
          <span className="text-[12px] text-[#10b981] flex items-center gap-1.5 font-semibold">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-ping" />
            Live Team Ready
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Live Chat Card */}
          <button
            onClick={onOpenLiveChat}
            className="w-full p-4 rounded-xl bg-white shadow-xs hover:shadow-md border border-gray-100 transition-all active:scale-[0.99] flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#eff6ff] text-[#0050cc] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">chat_bubble</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[14px] text-[#111827] font-bold group-hover:text-[#0050cc] transition-colors">
                  Instant Live Chat
                </span>
                <span className="text-[12px] text-[#4b5563]">Typically replies in under 1 min</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] group-hover:bg-blue-50 group-hover:text-[#0050cc] transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </button>

          {/* 15-min Demo Call */}
          <button
            onClick={onOpenBookDemo}
            className="w-full p-4 rounded-xl bg-white shadow-xs hover:shadow-md border border-gray-100 transition-all active:scale-[0.99] flex items-center justify-between group cursor-pointer text-left"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#fee2e2] text-[#ac0008] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">calendar_month</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[14px] text-[#111827] font-bold group-hover:text-[#ac0008] transition-colors">
                  Book 15-min Demo Call
                </span>
                <span className="text-[12px] text-[#4b5563]">Schedule 1-on-1 with an architect</span>
              </div>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] group-hover:bg-red-50 group-hover:text-[#ac0008] transition-colors">
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </div>
          </button>

          {/* Direct Email Card */}
          <div className="w-full p-4 rounded-xl bg-white shadow-xs hover:shadow-md border border-gray-100 transition-all flex items-center justify-between group">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#e7eefe] text-[#111827] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[14px] text-[#111827] font-bold">Email Support</span>
                <span className="text-[12px] text-[#4b5563]">sales@chatbot.com</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyEmail}
                title="Copy email address"
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
              >
                {copiedEmail ? 'Copied!' : 'Copy'}
              </button>
              <a
                href="mailto:sales@chatbot.com"
                className="w-8 h-8 rounded-full bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] hover:text-[#111827] transition-colors"
                title="Send email"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Feature Break: Human + AI Support Guarantee */}
      <section className="px-4 sm:px-6 py-4">
        <div className="w-full rounded-2xl bg-[#e2e8f8]/50 p-4 sm:p-5 shadow-xs flex flex-col gap-4 border border-blue-100/60">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0266ff] text-[20px]">handshake</span>
            <span className="text-[11px] font-bold uppercase text-[#0050cc] tracking-wider">
              Human + AI Guarantee
            </span>
          </div>

          {/* Hero Image Container matching prompt */}
          <div className="relative w-full rounded-xl overflow-hidden shadow-sm bg-gray-100">
            <img
              alt="Seamless transfer between AI bot and live human support representatives"
              className="w-full h-44 object-cover object-center"
              src="https://lh3.googleusercontent.com/aida/AEtjO1VkUEi8OzM9g8BEe0TRXwBbxNRDWC9-kw53d_kbRGdiev5wk76XRBEiXmF7ou0ig0-Llboj0xGJ0uMpjL71priLDqpOLrF21tDUZ3RxE3xVMzOXeDoseCVA5lm5SZXYtWrEC14YPbWNyMNm2za62k86Q6VtAntgJ0ct7SjKp71CXBOM0ll2NEou2msx1yBDyE5cX-recNtRNI2h-LT15ajscZKX7yfRMEfJZ88cbSat2VCOwZeWeoIj0G-Q"
              onError={(e) => {
                // Resilient fallback in case hotlink is blocked
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.parentElement) {
                  const fallback = target.parentElement.querySelector('.image-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }
              }}
            />
            {/* Fallback frame */}
            <div className="image-fallback hidden w-full h-44 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4 text-white text-center">
              <div>
                <span className="material-symbols-outlined text-3xl mb-1">support_agent</span>
                <p className="text-xs font-semibold">Autonomous AI with Zero Robot Lock-in</p>
              </div>
            </div>

            <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md rounded-lg p-2.5 shadow-md flex items-center justify-between border border-white/60">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#0266ff] flex items-center justify-center text-white shrink-0">
                  <span className="material-symbols-outlined text-[14px]">support_agent</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] text-[#111827] leading-tight font-bold">
                    Zero Robot Lock-in
                  </span>
                  <span className="text-[11px] text-[#4b5563] leading-none">
                    Instant handoff to sales reps anytime
                  </span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[#10b981] text-[20px]">
                verified_user
              </span>
            </div>
          </div>

          <p className="text-[14px] text-[#4b5563] leading-snug">
            Deploy advanced LLM autonomy on day one, with guaranteed fallback routing directly to your human reps whenever high-value deals are on the table.
          </p>
        </div>
      </section>

      {/* Lead & Inquiry Form Section */}
      <section className="px-4 sm:px-6 py-6" id="inquiry-form">
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="font-headline text-[19px] sm:text-[20px] text-[#111827] font-bold">
                Request a Tailored Demo
              </span>
              <span className="text-[11px] font-bold text-[#ac0008] bg-[#fee2e2] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Priority
              </span>
            </div>
            <p className="text-[13px] text-[#4b5563]">
              Tell us about your operational volume and we will prep an interactive sandbox with your site data pre-loaded.
            </p>
          </div>

          <form className="flex flex-col gap-3.5 mt-1" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#111827] font-semibold flex items-center justify-between">
                <span>Full Name</span>
                <span className="text-[#9ca3af] text-[11px]">Required</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#9ca3af] text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="e.g. Alex Henderson"
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-[#f3f4f6] text-[#111827] text-[14px] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0266ff] transition-all"
                />
              </div>
            </div>

            {/* Work Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#111827] font-semibold flex items-center justify-between">
                <span>Work Email</span>
                <span className="text-[#9ca3af] text-[11px]">Required</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#9ca3af] text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={formData.workEmail}
                  onChange={(e) => setFormData({ ...formData, workEmail: e.target.value })}
                  placeholder="alex@company.com"
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-[#f3f4f6] text-[#111827] text-[14px] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0266ff] transition-all"
                />
              </div>
            </div>

            {/* Company & Website */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#111827] font-semibold flex items-center justify-between">
                <span>Company Website URL</span>
                <span className="text-[#9ca3af] text-[11px]">For instant AI training scan</span>
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#9ca3af] text-[18px]">
                  link
                </span>
                <input
                  type="url"
                  required
                  value={formData.companyWebsite}
                  onChange={(e) => setFormData({ ...formData, companyWebsite: e.target.value })}
                  placeholder="https://yourbrand.com"
                  className="w-full h-11 pl-9 pr-3 rounded-lg bg-[#f3f4f6] text-[#111827] text-[14px] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0266ff] transition-all"
                />
              </div>
            </div>

            {/* Monthly Traffic Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#111827] font-semibold">
                Estimated Monthly Site Visitors
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#9ca3af] text-[18px]">
                  trending_up
                </span>
                <select
                  value={formData.trafficVolume}
                  onChange={(e) => setFormData({ ...formData, trafficVolume: e.target.value })}
                  className="w-full h-11 pl-9 pr-9 rounded-lg bg-[#f3f4f6] text-[#111827] text-[14px] appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0266ff] transition-all cursor-pointer"
                >
                  <option value="under10k">&lt; 10,000 visitors / mo</option>
                  <option value="10k-50k">10,000 - 50,000 visitors / mo</option>
                  <option value="50k-250k">50,000 - 250,000 visitors / mo</option>
                  <option value="250kplus">250,000+ enterprise volume</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-[#9ca3af] pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Primary Goal Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#111827] font-semibold">Primary Goal</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#9ca3af] text-[18px]">
                  target
                </span>
                <select
                  value={formData.primaryGoal}
                  onChange={(e) => setFormData({ ...formData, primaryGoal: e.target.value })}
                  className="w-full h-11 pl-9 pr-9 rounded-lg bg-[#f3f4f6] text-[#111827] text-[14px] appearance-none focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0266ff] transition-all cursor-pointer"
                >
                  <option value="support">Automate Customer Support (24/7)</option>
                  <option value="sales">Increase Sales &amp; Conversions</option>
                  <option value="omnichannel">Multi-channel (WhatsApp, SMS, Web)</option>
                  <option value="custom">Custom AI Integration &amp; API Setup</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 text-[#9ca3af] pointer-events-none text-[18px]">
                  expand_more
                </span>
              </div>
            </div>

            {/* Message Details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] text-[#111827] font-semibold">
                Message &amp; Custom Requirements
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                placeholder="Tell us about your team size, tech stack, or specific AI capabilities required..."
                className="w-full p-3 rounded-lg bg-[#f3f4f6] text-[#111827] text-[14px] placeholder:text-[#9ca3af] focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0266ff] transition-all resize-none"
              />
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-start gap-3 py-1">
              <input
                id="terms-consent"
                type="checkbox"
                required
                checked={formData.agreedToTerms}
                onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded text-[#d61616] focus:ring-0 cursor-pointer accent-[#d61616]"
              />
              <label
                htmlFor="terms-consent"
                className="text-[12px] text-[#4b5563] leading-snug cursor-pointer select-none"
              >
                I agree to the{' '}
                <a
                  href="#terms"
                  onClick={(e) => {
                    e.preventDefault();
                    onShowToast('Legal Terms', 'Our standard enterprise terms guarantee zero data training on customer chats.');
                  }}
                  className="text-[#0050cc] font-semibold hover:underline"
                >
                  Terms of Service
                </a>{' '}
                and acknowledge the{' '}
                <a
                  href="#privacy"
                  onClick={(e) => {
                    e.preventDefault();
                    onShowToast('Privacy Guarantee', 'Strict GDPR and SOC 2 data protection policies apply.');
                  }}
                  className="text-[#0050cc] font-semibold hover:underline"
                >
                  Privacy Policy
                </a>.
              </label>
            </div>

            {/* High-Impact Primary CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full h-12 mt-1 rounded-xl text-white text-[14px] font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer ${
                isSubmitted
                  ? 'bg-[#10b981]'
                  : 'bg-[#d61616] hover:bg-[#bd1313]'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined text-[20px] animate-spin">sync</span>
                  <span>Routing to AI Sales Specialist...</span>
                </>
              ) : isSubmitted ? (
                <>
                  <span className="material-symbols-outlined text-[20px]">check</span>
                  <span>Inquiry Dispatched!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[20px]">send</span>
                  <span>Schedule Consultation / Send Inquiry</span>
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Global Office Locations & Trust Info */}
      <section className="px-4 sm:px-6 pb-8 pt-2 flex flex-col gap-4">
        {/* Response Time Guarantee Banner */}
        <div className="w-full p-4 rounded-xl bg-[#eff6ff] text-[#0050cc] flex items-start gap-3 shadow-xs border border-blue-100">
          <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5 text-[#1e40af]">
            timer
          </span>
          <div className="flex flex-col">
            <span className="text-[12px] font-bold text-[#1e40af]">SLA Response Guarantee</span>
            <p className="text-[13px] text-[#4b5563] mt-0.5">
              We respond to all inquiries within{' '}
              <span className="font-semibold text-[#111827]">2 business hours</span>. Dedicated
              engineering support provided for enterprise rollouts.
            </p>
          </div>
        </div>

        {/* Office Hub Details */}
        <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-[#111827]">
            <span className="material-symbols-outlined text-[#0050cc] text-[22px]">apartment</span>
            <h3 className="font-headline text-[18px] sm:text-[20px] font-bold">Global Presence</h3>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {/* Boston Hub */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f3f4f6]">
              <div className="w-8 h-8 rounded-lg bg-white text-[#111827] flex items-center justify-center shadow-xs shrink-0">
                <span className="material-symbols-outlined text-[18px]">location_on</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-[#111827] font-bold">Boston Headquarters</span>
                <span className="text-[12px] text-[#4b5563]">
                  101 Federal St, Suite 1900, Boston, MA 02110
                </span>
                <span className="text-[11px] text-[#10b981] font-semibold mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                  Open 08:00 - 18:00 EST
                </span>
              </div>
            </div>

            {/* Remote Worldwide Hub */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f3f4f6]">
              <div className="w-8 h-8 rounded-lg bg-white text-[#111827] flex items-center justify-center shadow-xs shrink-0">
                <span className="material-symbols-outlined text-[18px]">public</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] text-[#111827] font-bold">Worldwide Distributed Team</span>
                <span className="text-[12px] text-[#4b5563]">
                  Distributed coverage across US, EMEA, and APAC regions.
                </span>
                <span className="text-[11px] text-[#0050cc] font-semibold mt-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0050cc]" />
                  24/7 Follow-the-Sun Network
                </span>
              </div>
            </div>
          </div>

          {/* Quick Trust Indicators */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-[#9ca3af]">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
              <span className="material-symbols-outlined text-[#10b981] text-[16px]">lock</span>
              <span>SOC 2 Type II</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
              <span className="material-symbols-outlined text-[#10b981] text-[16px]">shield</span>
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-gray-600">
              <span className="material-symbols-outlined text-[#10b981] text-[16px]">cloud_done</span>
              <span>99.99% Uptime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
