import React, { useState } from 'react';

interface PricingScreenProps {
  onNavigateToContact: () => void;
  onOpenLiveChat: () => void;
  onShowToast: (title: string, message: string) => void;
}

export const PricingScreen: React.FC<PricingScreenProps> = ({
  onNavigateToContact,
  onOpenLiveChat,
  onShowToast,
}) => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const plans = [
    {
      name: 'Starter',
      badge: 'Early Stage',
      monthlyPrice: 49,
      annualPrice: 39,
      description: 'Ideal for small stores and growing startups deploying their first autonomous chatbot.',
      features: [
        '1,000 monthly conversations',
        '1 live AI Chatbot agent',
        'Automated website URL scraper',
        'Standard email support',
        'Basic conversion metrics',
      ],
      ctaText: 'Start 14-Day Free Trial',
      highlighted: false,
    },
    {
      name: 'Growth',
      badge: 'Most Popular',
      monthlyPrice: 149,
      annualPrice: 119,
      description: 'Built for high-traffic brands demanding omni-channel autonomy and human handoff.',
      features: [
        '5,000 monthly conversations',
        '3 tailored AI agents',
        'Zero Robot Lock-in human handoff',
        'Zendesk, Shopify & Slack sync',
        'Custom tone & prompt guardrails',
        'Priority live chat support',
      ],
      ctaText: 'Start Free Trial',
      highlighted: true,
    },
    {
      name: 'Enterprise',
      badge: 'Custom Volume',
      monthlyPrice: 499,
      annualPrice: 399,
      description: 'Dedicated infrastructure, custom model fine-tuning, and contractual SLA guarantees.',
      features: [
        'Unlimited conversations & seats',
        'Custom model grounding & fine-tuning',
        'Dedicated Solutions Architect',
        'SOC 2 Type II & GDPR compliance',
        '2-hour guaranteed SLA support',
        'Custom SSO & audit logs',
      ],
      ctaText: 'Talk with AI Architects',
      highlighted: false,
    },
  ];

  const faqs = [
    {
      q: 'How does the Zero Robot Lock-in guarantee work?',
      a: 'Whenever a visitor asks to speak with a human, or if our sentiment classifier detects hesitation or high deal value, the chat transfers to your designated Slack, Zendesk, or web console without repeating questions.',
    },
    {
      q: 'Can the bot crawl dynamic or password-protected content?',
      a: 'Yes. You can supply public URLs, sitemaps, authenticated Notion workspaces, or upload raw PDFs, markdown, and CSV catalogs.',
    },
    {
      q: 'What happens if we exceed our monthly conversation limit?',
      a: 'Your bot never shuts down. Additional conversations are billed at a predictable flat rate ($0.03/chat), or you can upgrade tiers seamlessly without downtime.',
    },
    {
      q: 'Is our proprietary knowledge used to train third-party models?',
      a: 'Never. Under our enterprise data policy, all document vectors and chats are stored in private, isolated single-tenant partitions with strict zero-training compliance.',
    },
  ];

  const handleSelectPlan = (planName: string) => {
    if (planName === 'Enterprise') {
      onNavigateToContact();
    } else {
      onShowToast('Free Trial Activated', `Your 14-day trial of ${planName} has been initialized.`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-10">
      {/* Header */}
      <section className="px-4 sm:px-6 py-6 flex flex-col items-start gap-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#eff6ff] text-[#1e40af]">
          <span className="w-2 h-2 rounded-full bg-[#0266ff]" />
          <span className="text-[11px] font-bold uppercase tracking-wider">
            Transparent Pricing
          </span>
        </div>

        <h1 className="font-headline text-[26px] sm:text-[34px] text-[#111827] tracking-tight font-extrabold leading-[1.2]">
          Simple, Volume-Aligned Plans
        </h1>

        <p className="text-[14px] sm:text-[15px] text-[#4b5563]">
          All plans include 14 days free trial. No credit card required to deploy your first sandbox bot.
        </p>

        {/* Annual vs Monthly Toggle */}
        <div className="flex items-center gap-3 mt-3 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !isAnnual ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isAnnual ? 'bg-[#d61616] text-white shadow-xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>Annual</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">
              Save 20%
            </span>
          </button>
        </div>
      </section>

      {/* Plan Cards */}
      <section className="px-4 sm:px-6 pb-6 space-y-4">
        {plans.map((plan) => {
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;
          return (
            <div
              key={plan.name}
              className={`rounded-2xl p-5 border transition-all ${
                plan.highlighted
                  ? 'bg-white border-[#d61616] shadow-lg ring-2 ring-[#d61616]/10'
                  : 'bg-white border-gray-200 shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      plan.highlighted
                        ? 'bg-[#fee2e2] text-[#991b1b]'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {plan.badge}
                  </span>
                  <h3 className="font-headline text-xl font-bold text-gray-900 mt-1">
                    {plan.name}
                  </h3>
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-0.5 justify-end">
                    <span className="font-headline text-3xl font-extrabold text-gray-900 tabular-nums">
                      ${price}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">/mo</span>
                  </div>
                  <span className="text-[10px] text-gray-400">
                    {isAnnual ? 'Billed annually' : 'Billed monthly'}
                  </span>
                </div>
              </div>

              <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">{plan.description}</p>

              <div className="my-4 border-t border-gray-100 pt-3">
                <span className="text-[11px] font-bold text-gray-900 block mb-2">
                  What's included:
                </span>
                <ul className="space-y-1.5 text-xs text-gray-700">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[#10b981] text-[16px]">
                        check_circle
                      </span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlan(plan.name)}
                className={`w-full h-11 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer ${
                  plan.highlighted
                    ? 'bg-[#d61616] hover:bg-[#bd1313] text-white shadow-md'
                    : 'bg-gray-900 hover:bg-gray-800 text-white shadow-xs'
                }`}
              >
                <span>{plan.ctaText}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          );
        })}
      </section>

      {/* FAQ Accordion Section */}
      <section className="px-4 sm:px-6 py-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-xs">
          <h3 className="font-headline text-lg font-bold text-gray-900 mb-3">
            Frequently Asked Questions
          </h3>

          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-3">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-2 cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-bold text-gray-900">{faq.q}</span>
                    <span
                      className={`material-symbols-outlined text-gray-400 text-[18px] transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-gray-700' : ''
                      }`}
                    >
                      expand_more
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-xs text-gray-600 mt-2 leading-relaxed animate-in fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500">Still have questions?</span>
            <button
              onClick={onNavigateToContact}
              className="text-xs font-bold text-[#d61616] hover:underline cursor-pointer"
            >
              Contact our sales engineering team &rarr;
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
