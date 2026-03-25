"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

const eligibility = [
  "You're a licensed contractor",
  "You serve a local service area",
  "You can handle 5+ new jobs/mo",
];

const SPOTS_CLAIMED = 2;
const SPOTS_TOTAL = 3;

export default function FreeTrialOffer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="free-spot"
      className="py-24 sm:py-32 bg-[#0A1628] relative overflow-hidden"
    >
      {/* Subtle grid */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      {/* Coral glow accent */}
      <div
        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-5"
        style={{ background: "#FF6B47" }}
      />

      <div ref={ref} className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        {/* Top badge with pulsing dot */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 mb-8"
        >
          {/* Pulsing coral dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6B47] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6B47]" />
          </span>
          <span className="text-white/70 text-xs font-semibold uppercase tracking-widest">
            Limited Monthly Availability
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-5"
        >
          3 Free Implementation Spots &mdash; Every Month
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="text-white/55 text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
        >
          We pick 3 contractors each month and run their top marketing channel for 30 days, on us. No contracts, no catch.
        </motion.p>

        {/* Progress widget */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.24 }}
          className="mb-10 max-w-sm mx-auto"
        >
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-sm text-white/50">
              {SPOTS_CLAIMED} of {SPOTS_TOTAL} spots claimed this month
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-4 rounded-full bg-white/10 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${(SPOTS_CLAIMED / SPOTS_TOTAL) * 100}%` } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="h-full rounded-full bg-[#FF6B47]"
            />
          </div>
          <p className="mt-2 text-sm font-bold text-[#FF6B47]">
            {SPOTS_TOTAL - SPOTS_CLAIMED} spot remaining
          </p>
        </motion.div>

        {/* Eligibility conditions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.32 }}
          className="flex flex-wrap justify-center gap-5 sm:gap-8 mb-10"
        >
          {eligibility.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#00D4C8] flex-shrink-0" />
              <span className="text-sm text-white/70">{item}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-5 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] text-white font-black text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-[#FF6B47]/30 hover:-translate-y-1"
          >
            Apply for a Free Spot
            <ArrowRight className="w-5 h-5" />
          </a>
          <p className="text-xs text-white/30 italic max-w-sm">
            We only pitch a retainer if you see real results. If not, we part as friends &mdash; no invoice.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
