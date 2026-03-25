"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Map, Rocket, Check, ShieldCheck } from "lucide-react";

const cards = [
  {
    id: "snapshot",
    icon: Search,
    iconBg: "bg-[#00D4C8]/10",
    iconColor: "text-[#00D4C8]",
    badge: null,
    name: "Blueprint Snapshot",
    price: "Free",
    priceNote: null,
    valueProp: "Find out exactly where you're leaving money on the table.",
    checks: [
      "AI-powered revenue gap analysis",
      "Top 3 channels ranked for your trade",
      "Ready in under 2 minutes",
    ],
    ctaLabel: "Get My Free Snapshot →",
    ctaHref: "#contact",
    ctaStyle: "border-2 border-[#00D4C8] text-[#00D4C8] hover:bg-[#00D4C8]/10",
    featured: false,
  },
  {
    id: "blueprint",
    icon: Map,
    iconBg: "bg-[#FF6B47]/10",
    iconColor: "text-[#FF6B47]",
    badge: { label: "Most Popular", color: "bg-[#FF6B47] text-white" },
    name: "Full Blueprint",
    price: "$499",
    priceNote: "one-time",
    valueProp: "A complete 9-channel growth plan built for your trade and market.",
    checks: [
      "Full strategy for all 9 channels",
      "Your city's competitive landscape",
      "48-hour delivery, guaranteed",
    ],
    ctaLabel: "Get My Full Blueprint →",
    ctaHref: "#contact",
    ctaStyle: "bg-[#FF6B47] hover:bg-[#FF8B6B] text-white hover:shadow-lg hover:shadow-[#FF6B47]/25",
    featured: true,
  },
  {
    id: "done-with-you",
    icon: Rocket,
    iconBg: "bg-[#0A1628]/10",
    iconColor: "text-[#0A1628]",
    badge: { label: "Best Value", color: "bg-[#00D4C8] text-white" },
    name: "Done-With-You Growth",
    price: "$1,500",
    priceNote: "/mo · 12-week program",
    valueProp: "We build the plan AND run your top 2 channels. Guaranteed results.",
    checks: [
      "Blueprint + full implementation",
      "Weekly check-ins with your strategist",
      "Results or we work free until you see them",
    ],
    ctaLabel: "Book a Strategy Call →",
    ctaHref: "#contact",
    ctaStyle: "bg-[#0A1628] hover:bg-[#0d1f35] text-white",
    featured: false,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

export default function OfferLadder() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="pricing"
      className="py-24 sm:py-32 bg-[#F8F7F4] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1628]/8 text-[#0A1628] text-xs font-bold uppercase tracking-widest mb-4">
            Pick Your Starting Point
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] leading-tight">
            Start free and upgrade when you&rsquo;re ready.
          </h2>
          <p className="mt-3 text-gray-500 text-lg">No lock-ins. No surprise retainers. Just results at every level.</p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          {cards.map((card) => (
            <motion.div
              key={card.id}
              variants={cardVariants}
              className={`relative bg-white rounded-2xl p-7 flex flex-col ${
                card.featured
                  ? "border-2 border-[#00D4C8] shadow-xl shadow-[#00D4C8]/10"
                  : "border border-gray-200 shadow-sm"
              }`}
            >
              {/* Badge */}
              {card.badge && (
                <div className="absolute -top-3 right-5">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${card.badge.color}`}
                  >
                    {card.badge.label}
                  </span>
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-11 h-11 rounded-xl ${card.iconBg} flex items-center justify-center mb-4`}
              >
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>

              {/* Name */}
              <h3 className="text-lg font-bold text-[#0A1628] mb-1">{card.name}</h3>

              {/* Price */}
              <div className="mb-3">
                <span className="text-3xl font-black text-[#0A1628]">{card.price}</span>
                {card.priceNote && (
                  <span className="text-sm text-gray-400 ml-1.5">{card.priceNote}</span>
                )}
              </div>

              {/* Value prop */}
              <p className="text-sm text-gray-600 leading-relaxed mb-5">{card.valueProp}</p>

              {/* Checkmarks */}
              <ul className="space-y-2.5 mb-7 flex-1">
                {card.checks.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#00D4C8] flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={card.ctaHref}
                className={`w-full text-center px-5 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 ${card.ctaStyle}`}
              >
                {card.ctaLabel}
              </a>
            </motion.div>
          ))}
        </motion.div>

        {/* Reassurance line */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-[#00D4C8] flex-shrink-0" />
          <p className="text-sm text-gray-500">
            All plans include our{" "}
            <span className="font-semibold text-[#0A1628]">30-day money-back guarantee</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
