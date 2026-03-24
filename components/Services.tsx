"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, ArrowRight, FileText, TrendingUp, Zap } from "lucide-react";

const tiers = [
  {
    icon: FileText,
    name: "The Blueprint",
    price: "$499",
    period: " one-time",
    description:
      "Your fully custom AI-generated revenue roadmap. Built in 48 hours around your trade, market, and growth goal. Yours to keep — no retainer required.",
    badge: null,
    features: [
      "15-minute intake survey",
      "Full business strength and gap assessment",
      "Market data for your city and trade",
      "Competitor positioning breakdown",
      "Phase-by-phase revenue architecture",
      "9 marketing channels ranked by ROI",
      "90-day priority action plan",
      "One 60-minute Blueprint review call",
    ],
    cta: "Get Your Blueprint",
    ctaStyle:
      "border border-blue-500 bg-blue-500/10 text-blue-500 dark:text-blue-400 hover:bg-blue-500 hover:text-white",
    cardStyle: "border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]",
    ideal: "Best for: Owners who want clarity before committing to more",
  },
  {
    icon: TrendingUp,
    name: "The Surge Plan",
    price: "$1,500",
    period: "/month",
    description:
      "The Blueprint, plus someone to hold the map with you. Monthly strategy calls, unlimited async support, and AI-assisted content — you implement, we guide.",
    badge: "Most Popular",
    features: [
      "Everything in The Blueprint (refreshed quarterly)",
      "Monthly 60-min strategy call",
      "Unlimited async Slack/email support",
      "Monthly performance review",
      "AI-generated copy and content on demand",
      "Review request script and email templates",
      "Referral partner outreach guidance",
      "Month-to-month, 30-day cancellation",
    ],
    cta: "Start the Surge Plan",
    ctaStyle:
      "bg-[#FF6B47] hover:bg-[#FF8B6B] text-white hover:shadow-xl hover:shadow-[#FF6B47]/30",
    cardStyle:
      "border-[#FF6B47]/40 bg-[#FF6B47]/5 dark:bg-[#FF6B47]/5 ring-1 ring-[#FF6B47]/20",
    ideal: "Best for: Owners ready to execute and want a strategic partner",
  },
  {
    icon: Zap,
    name: "The Full Surge",
    price: "From $3,500",
    period: "/month",
    description:
      "Full-service implementation — we run the marketing engine while you run the business. Every channel, fully managed, fully attributed to revenue.",
    badge: null,
    features: [
      "Everything in The Surge Plan",
      "Google LSA setup and management",
      "Google Ads / PPC campaign management",
      "GBP optimization and weekly posting",
      "Referral partner network buildout",
      "Reputation management and review automation",
      "Call tracking and lead attribution",
      "Bi-weekly strategy calls",
      "Full revenue-linked reporting dashboard",
    ],
    cta: "Let's Talk Full Surge",
    ctaStyle:
      "border border-gray-300 dark:border-white/20 bg-transparent text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10",
    cardStyle: "border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02]",
    ideal: "Best for: Owners ready to hand off marketing and focus on operations",
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      className="py-24 sm:py-32 bg-white dark:bg-[#070d1a] relative overflow-hidden"
    >
      <div className="absolute inset-0 dot-bg opacity-30 dark:opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Start with a Blueprint.
            <br />
            <span className="gradient-text">Scale at your pace.</span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-white/50 text-lg">
            No retainer before results. No lock-ins. No fluff.
            The Blueprint is yours regardless of what comes next.
          </p>
        </motion.div>

        {/* Tier cards */}
        <div
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-start"
        >
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-300 ${tier.cardStyle} ${index === 1 ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Popular badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-[#FF6B47] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF6B47]/30">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Icon + name */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <tier.icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {tier.name}
                </h3>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-gray-900 dark:text-white">
                    {tier.price}
                  </span>
                  <span className="text-gray-400 dark:text-white/40 font-medium">
                    {tier.period}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-6 min-h-[4rem]">
                {tier.description}
              </p>

              {/* CTA */}
              <a
                href="#contact"
                className={`w-full text-center py-3.5 px-6 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 flex items-center justify-center gap-2 group mb-8 ${tier.ctaStyle}`}
              >
                {tier.cta}
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </a>

              {/* Divider */}
              <div className="border-t border-gray-100 dark:border-white/10 mb-6" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-blue-500" />
                    </div>
                    <span className="text-sm text-gray-600 dark:text-white/60">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Ideal for */}
              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-white/10">
                <p className="text-xs text-gray-400 dark:text-white/30 font-medium">
                  {tier.ideal}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add-on note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-12 text-center p-6 rounded-2xl border border-dashed border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.01]"
        >
          <p className="text-gray-500 dark:text-white/40 text-sm">
            <span className="font-semibold text-gray-700 dark:text-white/70">
              Need AI integration into your CRM?
            </span>{" "}
            We offer a one-time AI Integration Setup — connect your Job Nimbus, ServiceTitan, or Jobber API to Claude for automated lead analysis, upsell identification, and customer re-engagement lists. $500 setup.
            <a
              href="#contact"
              className="ml-1.5 text-blue-500 hover:text-blue-400 font-semibold underline-offset-4 hover:underline"
            >
              Ask about it →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
