"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardList, FileText, Rocket, ArrowRight } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    title: "Free Blueprint Snapshot",
    subtitle: "Know your biggest gap in 60 seconds",
    description:
      "Fill out a quick 5-question survey about your business — trade, location, annual revenue, top marketing channel, and biggest challenge. AI instantly generates a personalized snapshot showing your most critical growth gap and your top 3 highest-ROI moves right now.",
    deliverables: [
      "Revenue gap identified instantly",
      "Market competitive landscape summary",
      "Top 3 channels for your trade and city",
      "One immediate action you can take this week",
    ],
    timeframe: "Ready in 60 seconds — free",
  },
  {
    number: "02",
    icon: FileText,
    iconBg: "bg-[#FF6B47]/10",
    iconColor: "text-[#FF6B47]",
    title: "Your Custom Revenue Blueprint",
    subtitle: "A roadmap built around your exact business",
    description:
      "In 48 hours we build your fully custom Blueprint — deep research on your industry, your market, and your competitors, combined with your specific revenue goal. You get a phased action plan that tells you exactly what to do in the next 90 days, 6 months, and 12 months to scale.",
    deliverables: [
      "Full business strength and gap assessment",
      "Market data for your city and trade",
      "Phase-by-phase revenue architecture",
      "9-channel marketing engine ranked by ROI",
    ],
    timeframe: "Delivered in 48 hours — $499",
  },
  {
    number: "03",
    icon: Rocket,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-400",
    title: "Execute. You're in the Driver's Seat.",
    subtitle: "Your plan, your pace, your business",
    description:
      "We review the Blueprint together, align on priorities, and you choose how deep you want to go. Use the Blueprint yourself, bring us in for monthly strategy calls, or hand us the implementation entirely. You stay in control at every level.",
    deliverables: [
      "Blueprint review call included",
      "90-day priority sequence laid out",
      "Optional monthly strategy retainer ($1,500/mo)",
      "Optional full implementation ($3,500+/mo)",
    ],
    timeframe: "Your call — no lock-in",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="how-it-works"
      className="py-24 sm:py-32 bg-gray-50 dark:bg-[#0b1120] relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-4">
            The Process
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            From snapshot to scale
            <br />
            <span className="gradient-text">in 3 steps</span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-white/50 text-lg">
            Real deliverables at every step. No retainers before results.
            You decide how far you want to go.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="space-y-8 lg:space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2, ease: "easeOut" }}
              className="group flex flex-col lg:flex-row items-start lg:items-center gap-8 p-8 lg:p-10 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-blue-500/30 hover:bg-blue-500/[0.02] transition-all duration-300"
            >
              {/* Number + Icon */}
              <div className="flex items-center gap-5 lg:flex-col lg:items-center lg:gap-3 lg:min-w-[100px]">
                <div className="text-5xl lg:text-6xl font-black text-gray-100 dark:text-white/5 group-hover:text-blue-500/10 transition-colors leading-none select-none">
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
                <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-2">
                  {step.timeframe}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-blue-500 dark:text-blue-400 font-medium text-sm mb-4">
                  {step.subtitle}
                </p>
                <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-6 max-w-xl">
                  {step.description}
                </p>

                {/* Deliverables */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {step.deliverables.map((item) => (
                    <div key={item} className="flex items-start gap-2.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-white/60">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connector arrow */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-8 flex-shrink-0">
                  <ArrowRight className="w-5 h-5 text-gray-300 dark:text-white/10" />
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
          className="mt-16 text-center"
        >
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] text-white font-bold text-base transition-all duration-200 hover:shadow-xl hover:shadow-[#FF6B47]/30 hover:-translate-y-1"
          >
            Get Your Free Blueprint Snapshot
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="mt-3 text-sm text-gray-400 dark:text-white/30">
            60 seconds. No credit card. Yours to keep regardless.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
