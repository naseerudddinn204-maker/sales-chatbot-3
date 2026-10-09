import React, { useEffect, useState } from 'react';
import { DemoFormData } from '../types';
import { callBackend } from '../lib/backendApi';

interface ContactScreenProps {
  selectedChatbotName?: string;
  selectedPlanName?: string;
  selectedBillingType?: string;
  onOpenLiveChat: () => void;
  onOpenBookDemo: () => void;
  onShowToast: (title: string, message: string) => void;
}

export const ContactScreen: React.FC<ContactScreenProps> = ({
  selectedChatbotName = '',
  selectedPlanName = '',
  selectedBillingType = 'monthly',
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
  const [chatbotName, setChatbotName] = useState(selectedChatbotName);
  const [planName, setPlanName] = useState(selectedPlanName);
  const [billingType, setBillingType] = useState(selectedBillingType);
  const [paymentReference, setPaymentReference] = useState('');
  useEffect(() => { if (selectedChatbotName) setChatbotName(selectedChatbotName); }, [selectedChatbotName]);
  useEffect(() => { if (selectedPlanName) setPlanName(selectedPlanName); }, [selectedPlanName]);
  useEffect(() => { if (selectedBillingType) setBillingType(selectedBillingType); }, [selectedBillingType]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreedToTerms) {
      alert('Please agree to the Terms of Service and Privacy Policy to proceed.');
      return;
    }
    setIsSubmitting(true);
    try {
      await callBackend({
        action: 'lead',
        name: formData.fullName,
        chatbot_name: chatbotName.trim(),
        order_type: !planName.trim() && !chatbotName.trim() ? 'General chatbot inquiry' : billingType === 'one_time' ? 'One-time purchase request' : billingType === 'annual' ? 'Annual subscription request' : 'Monthly subscription request',
        plan_name: planName.trim(),
        billing_type: billingType,
        payment_method: 'bank_transfer',
        payment_status: 'awaiting_instructions',
        payment_reference: paymentReference.trim(),
        email: formData.workEmail,
        company_website: formData.companyWebsite,
        traffic_volume: formData.trafficVolume,
        primary_goal: formData.primaryGoal,
        message: formData.message,
      });
      setIsSubmitted(true);
      onShowToast('Inquiry sent', 'Thanks! We will get back to you shortly.');
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
      }, 3000);
    } catch (error) {
      onShowToast('Submission failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f9f9ff] text-[#151c27]">
      <section className="px-4 sm:px-6 pt-8 pb-7">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#eef2ff] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[#3157c8]">
            <span className="h-2 w-2 rounded-full bg-[#3157c8] animate-pulse" />
            Let’s build with AI
          </div>
          <h1 className="mt-4 max-w-2xl font-headline text-[32px] sm:text-[44px] font-extrabold leading-tight tracking-tight text-[#151c27]">
            Put an AI chatbot on your website.
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] sm:text-[17px] leading-relaxed text-[#596273]">
            Tell us what you need and we’ll help you choose, customize, and launch the right AI assistant.
          </p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button onClick={onOpenLiveChat} className="rounded-2xl bg-white p-4 text-left border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl">💬</div>
              <div className="mt-2 font-bold text-[14px]">Live chat</div>
              <div className="mt-1 text-[12px] text-[#697386]">Talk to us now</div>
            </button>
            <button onClick={onOpenBookDemo} className="rounded-2xl bg-white p-4 text-left border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl">📅</div>
              <div className="mt-2 font-bold text-[14px]">Book a demo</div>
              <div className="mt-1 text-[12px] text-[#697386]">See it in action</div>
            </button>
            <a href="mailto:sales@chatbot.com" className="rounded-2xl bg-white p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="text-2xl">✉️</div>
              <div className="mt-2 font-bold text-[14px]">Email us</div>
              <div className="mt-1 text-[12px] text-[#697386]">sales@chatbot.com</div>
            </a>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-[1fr_0.72fr] gap-5">
          <div className="rounded-3xl bg-white border border-gray-100 shadow-sm p-5 sm:p-7">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#3157c8]">Get started</div>
              <h2 className="mt-1 text-[22px] font-extrabold">Request your AI chatbot</h2>
              <p className="mt-1 text-[13px] text-[#697386]">A few details are enough. We’ll take it from there.</p>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              <div className="grid sm:grid-cols-2 gap-3.5">
                <input required value={formData.fullName} onChange={e => setFormData({...formData, fullName:e.target.value})} placeholder="Full name" className="h-11 rounded-xl bg-[#f5f6fa] px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3157c8]" />
                <input required type="email" value={formData.workEmail} onChange={e => setFormData({...formData, workEmail:e.target.value})} placeholder="Work email" className="h-11 rounded-xl bg-[#f5f6fa] px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3157c8]" />
              </div>
              <input value={chatbotName} onChange={e => setChatbotName(e.target.value)} readOnly={!!selectedChatbotName} placeholder="Chatbot you want to order (auto-filled from Get Started)" className={`w-full h-11 rounded-xl bg-[#f5f6fa] px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3157c8] ${selectedChatbotName ? 'font-semibold text-[#3157c8]' : ''}`} />
              <input value={planName} onChange={e => setPlanName(e.target.value)} readOnly={!!selectedPlanName} placeholder="Pricing plan (optional)" className={`w-full h-11 rounded-xl bg-[#f5f6fa] px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3157c8] ${selectedPlanName ? 'font-semibold text-[#3157c8]' : ''}`} />
              <div className="grid sm:grid-cols-2 gap-3.5">
                <select value={billingType} onChange={e => setBillingType(e.target.value)} className="h-11 rounded-xl bg-[#f5f6fa] px-3.5 text-sm outline-none">
                  <option value="one_time">One-time payment</option><option value="monthly">Monthly subscription</option><option value="annual">Annual subscription</option>
                </select>
                <div className="flex h-11 items-center rounded-xl bg-[#f5f6fa] px-3.5 text-sm text-[#596273]">Payment: Bank transfer</div>
              </div>
              <input value={paymentReference} onChange={e => setPaymentReference(e.target.value)} placeholder="Payment reference (optional, if already paid)" className="w-full h-11 rounded-xl bg-[#f5f6fa] px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3157c8]" />
              <p className="text-xs leading-5 text-[#697386]">We will share bank transfer details after reviewing your request. Your order is not marked as paid until an admin confirms it.</p>
              <input required type="url" value={formData.companyWebsite} onChange={e => setFormData({...formData, companyWebsite:e.target.value})} placeholder="Company website" className="w-full h-11 rounded-xl bg-[#f5f6fa] px-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3157c8]" />
              <div className="grid sm:grid-cols-2 gap-3.5">
                <select value={formData.trafficVolume} onChange={e => setFormData({...formData, trafficVolume:e.target.value})} className="h-11 rounded-xl bg-[#f5f6fa] px-3.5 text-sm outline-none">
                  <option value="under10k">Under 10k visitors</option>
                  <option value="10k-50k">10k–50k visitors</option>
                  <option value="50k-250k">50k–250k visitors</option>
                  <option value="250kplus">250k+ visitors</option>
                </select>
                <select value={formData.primaryGoal} onChange={e => setFormData({...formData, primaryGoal:e.target.value})} className="h-11 rounded-xl bg-[#f5f6fa] px-3.5 text-sm outline-none">
                  <option value="support">Customer support</option>
                  <option value="sales">Increase sales</option>
                  <option value="omnichannel">Multi-channel AI</option>
                  <option value="custom">Custom AI integration</option>
                </select>
              </div>
              <textarea value={formData.message} onChange={e => setFormData({...formData, message:e.target.value})} rows={4} placeholder="What would you like your chatbot to do?" className="w-full rounded-xl bg-[#f5f6fa] p-3.5 text-sm outline-none focus:ring-2 focus:ring-[#3157c8] resize-none" />
              <label className="flex items-start gap-2 text-xs text-[#697386]">
                <input required type="checkbox" checked={formData.agreedToTerms} onChange={e => setFormData({...formData, agreedToTerms:e.target.checked})} className="mt-0.5" />
                <span>I agree to the Terms of Service and Privacy Policy.</span>
              </label>
              <button type="submit" disabled={isSubmitting} className={`w-full h-12 rounded-xl text-white text-sm font-bold transition-all ${isSubmitted ? 'bg-emerald-500' : 'bg-[#151c27] hover:bg-[#2b3442]'}`}>
                {isSubmitting ? 'Sending…' : isSubmitted ? 'Request sent ✓' : 'Send request →'}
              </button>
            </form>
          </div>

          <div className="rounded-3xl bg-[#151c27] text-white p-6 sm:p-7 flex flex-col justify-between min-h-[300px]">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#9fb4ff]">Why choose AI</div>
              <h3 className="mt-2 text-[25px] font-extrabold leading-tight">Automate conversations. Capture leads. Sell 24/7.</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/65">One chatbot can answer questions, guide visitors, and turn conversations into opportunities.</p>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white/10 p-3"><div className="text-lg">24/7</div><div className="text-[11px] text-white/60">Support</div></div>
              <div className="rounded-2xl bg-white/10 p-3"><div className="text-lg">AI</div><div className="text-[11px] text-white/60">Automation</div></div>
              <div className="rounded-2xl bg-white/10 p-3"><div className="text-lg">1-click</div><div className="text-[11px] text-white/60">Launch</div></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
