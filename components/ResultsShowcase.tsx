"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const stats = [
  { value: "$1.3M", label: "Stuck Revenue Recovered" },
  { value: "10-12x", label: "Projected Year 1 ROI" },
  { value: "15-25%", label: "Of Revenue Typically At Risk" },
  { value: "14 days", label: "Audit Turnaround" },
];

export default function ResultsShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0">
        <Image src="/images/results-bg.jpg" alt="" fill className="object-cover photo-treatment" />
        <div className="absolute inset-0 bg-[#0A0A0A]/60" />
      </div>
      <div className="absolute inset-0 noise-texture" />
      <div ref={ref} className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
          Real Results
        </p>
        <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-16 max-w-xl">
          Numbers from real restoration contractors
        </h2>
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[48px] sm:text-[64px] font-extrabold leading-none tracking-[0.02em] text-[#E8E2D8]">
                {stat.value}
              </div>
              <div className="mt-2 font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
        <p className="mt-12 font-sans text-xs font-normal text-[#5A5550] max-w-md">
          Numbers from Rehab Restoration audit (Colorado, $2M annual revenue). Results vary based on business size, CRM, and current state. Projections made from Year 1 recovery scenario analysis.
        </p>
      </div>
    </section>
  );
}
