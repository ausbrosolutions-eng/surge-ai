"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const stats = [
  { value: "312%", label: "More Inbound Calls" },
  { value: "4.1x", label: "Average Client ROI" },
  { value: "91%", label: "Client Retention Rate" },
  { value: "48hrs", label: "First Deliverable" },
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
          Numbers from real contractors in your trade
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
          Results are from top-performing clients. Individual results vary based on market, competition, and starting position.
        </p>
      </div>
    </section>
  );
}
