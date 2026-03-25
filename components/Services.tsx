"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, ArrowRight, FileText, TrendingUp, Zap } from "lucide-react";

const tiers = [
  {
    icon: FileText,
    name: "The Blueprint",
    tagline: "Start here. Most owners never need more.",
    price: "$499",
    period: " one-time",
    description:
      "Your fully custom growth roadmap. Built in 48 hours around your trade, market, and revenue goal. No retainer required — yours to keep and use however you want.",
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
      "border border-[#0A1628] bg-transparent text-[#0A1628] hover:bg-[#0A1628] hover:text-white",
    cardStyle: "border-gray-200 bg-white",
    ideal: "Best for: Owners who want clarity before committing to anything else",
  },
  {
    icon: TrendingUp,
    name: "Done With You",
    tagline: "You execute. We guide.",
    price: "$1,500",
    period: "/month",
    description:
      "The Blueprint plus a strategic partner who stays in the fight with you. Monthly calls, unlimited async support, and content on demand. You're in the driver's seat — we ride shotgun.",
    badge: "Most Popular",
    features: [
      "Everything in The Blueprint (refreshed quarterly)",
      "Monthly 60-min strategy call",
      "Unlimited async support",
      "Monthly performance review",
      "AI-generated copy and content on demand",
      "Review request templates and email scripts",
      "Referral partner outreach guidance",
      "Month-to-month, 30-day cancellation",
    ],
    cta: "Start Done With You",
    ctaStyle:
      "bg-[#FF6B47] hover:bg-[#FF8B6B] text-white hover:shadow-xl hover:shadow-[#FF6B47]/30",
    cardStyle:
      "border-[#FF6B47]/30 bg-white ring-1 ring-[#FF6B47]/15",
    ideal: "Best for: Owners ready to execute and want a strategic partner",
  },
  {
    icon: Zap,
    name: "Done For You",
    tagline: "We run it. You run the business.",
    price: "From $3,500",
    period: "/month",
    description:
      "Full-service implementation. We manage the marketing engine while you focus on operations. Every channel, fully managed, fully tied back to revenue.",
    badge: null,
    features: [
      "Everything is done with you",
      "Google LSA setup and management",
      "Google Ads / PPC campaign management",
      "GBP optimization and weekly posting",
      "Reputation management and review automation",
      "Call tracking and lead attribution",
      "Bi-weekly strategy calls",
      "Full revenue-linked reporting dashboard",
    ],
    cta: "Let's Talk",
    ctaStyle:
      "border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 hover:border-gray-400",
    cardStyle: "border-gray-200 bg-white",
    ideal: "Best for: Owners ready to hand off marketing entirely",
  },
];

export default function Services() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="services"
      className="section-light py-24 sm:py-32 relative overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] leading-tight">
            Start with the Blueprint.
            <br />
            <span className="text-gray-400 font-medium text-2xl sm:text-3xl">
              Upgrade only if you want to.
            </span>
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-xl">
            No retainer before results. No lock-ins. The Blueprint is yours regardless of what comes next.
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
              className={`relative flex flex-col rounded-2xl border p-8 shadow-sm transition-all duration-300 ${tier.cardStyle} ${index === 1 ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {/* Popular badge */}
              {tier.badge && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-[#FF6B47] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF6B47]/20">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Icon + name */}
              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-[#0A1628]/8 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <tier.icon className="w-5 h-5 text-[#0A1628]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A1628]">{tier.name}</h3>
                  <p className="text-xs text-gray-400 mt-0.5">{tier.tagline}</p>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#0A1628]">{tier.price}</span>
                  <span className="text-gray-400 font-medium">{tier.period}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-6 min-h-[4rem]">
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
              <div className="border-t border-gray-100 mb-6" />

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#00D4C8]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[#00D4C8]" />
                    </div>
                    <span className="text-sm text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Ideal for */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 font-medium">{tier.ideal}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add-on note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10 text-center p-6 rounded-2xl border border-dashed border-gray-300 bg-gray-50/80"
        >
          <p className="text-gray-500 text-sm">
            <span className="font-semibold text-[#0A1628]">
              Using ServiceTitan, Jobber, or HouseCall Pro?
            </span>{" "}
            We include CRM setup guidance in every plan — no extra charge. Need a deeper API integration? Ask about our one-time setup.{" "}
            <a
              href="#contact"
              className="text-[#0A1628] font-semibold underline-offset-4 hover:underline"
            >
              Ask about it &rarr;
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
