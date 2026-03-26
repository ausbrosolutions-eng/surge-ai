"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardList, FileText, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    iconBg: "bg-[#00D4C8]/10",
    iconColor: "text-[#00D4C8]",
    title: "Free Blueprint Snapshot",
    subtitle: "Know your biggest gap in 60 seconds",
    description:
      "Fill out a quick 5-question form about your business: trade, location, revenue range, and biggest challenge. We build a personalized snapshot showing your most critical growth gap and your top 3 highest-ROI moves right now.",
    deliverables: [
      "Revenue gap identified instantly",
      "Top 3 channels for your trade and city",
      "Competitive landscape summary",
      "One move you can make this week",
    ],
    timeframe: "Ready in 60 seconds, free",
  },
  {
    number: "02",
    icon: FileText,
    iconBg: "bg-[#FF6B47]/10",
    iconColor: "text-[#FF6B47]",
    title: "Your Custom Revenue Blueprint",
    subtitle: "A real plan built around your exact business",
    description:
      "In 48 hours we build your fully custom Blueprint. Deep research on your trade, your market, and your competitors combined with your specific revenue goal. Phase-by-phase action plan for the next 90 days, 6 months, and 12 months.",
    deliverables: [
      "Full business strength and gap assessment",
      "Market data for your city and trade",
      "Phase-by-phase revenue architecture",
      "9-channel marketing engine ranked by ROI",
    ],
    timeframe: "$499, one time, no subscription",
    price: true,
  },
  {
    number: "03",
    icon: Rocket,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    title: "Execute on Your Terms",
    subtitle: "Your plan, your pace, your business",
    description:
      "We walk through the Blueprint together and you decide how far you want to go. Use it yourself, bring us in for monthly strategy calls, or hand us the execution entirely. Most clients run with it on their own. That's the point.",
    deliverables: [
      "Blueprint review call included",
      "90-day priority sequence laid out",
      "Optional monthly strategy support ($1,500/mo)",
      "Optional full implementation ($3,500+/mo)",
    ],
    timeframe: "Your call. No lock-in, ever",
    note: "Most of our clients get the Blueprint and start executing on their own. That's the point. You shouldn't need us forever.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      className="section-dark py-24 sm:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            The Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            From snapshot to growth plan
            <br />
            in 3 steps.
          </h2>
          <p className="mt-4 text-white/50 text-lg">
            Real deliverables at every step. No retainers before results. You decide how far you want to go.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              className="group flex flex-col lg:flex-row items-start lg:items-center gap-8 p-8 lg:p-10 rounded-2xl border border-white/8 bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300"
            >
              {/* Number + Icon */}
              <div className="flex items-center gap-5 lg:flex-col lg:items-center lg:gap-3 lg:min-w-[100px]">
                <div className="text-5xl lg:text-6xl font-black text-white/5 group-hover:text-white/8 transition-colors leading-none select-none">
                  {step.number}
                </div>
                <div
                  className={`w-14 h-14 rounded-2xl ${step.iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <step.icon className={`w-7 h-7 ${step.iconColor}`} />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${step.price ? "text-[#FF6B47]" : "text-white/30"}`}>
                  {step.timeframe}
                </div>
                <h3 className="text-2xl font-bold text-white mb-1">{step.title}</h3>
                <p className="text-[#00D4C8] font-medium text-sm mb-4">{step.subtitle}</p>
                <p className="text-white/50 text-sm leading-relaxed mb-5 max-w-xl">
                  {step.description}
                </p>

                {/* Deliverables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {step.deliverables.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-[#00D4C8]/10 border border-[#00D4C8]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00D4C8]" />
                      </div>
                      <span className="text-sm text-white/55">{item}</span>
                    </div>
                  ))}
                </div>

                {/* Step 3 note */}
                {step.note && (
                  <p className="text-xs text-white/30 italic mt-2 max-w-lg">
                    {step.note}
                  </p>
                )}
              </div>

              {/* Connector arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-8 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-white/10" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-14 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] text-white font-bold text-base transition-all duration-200 hover:shadow-xl hover:shadow-[#FF6B47]/30 hover:-translate-y-1"
          >
            Get My Free Snapshot
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-sm text-white/30">
            60 seconds. No credit card. Yours to keep regardless.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
