"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check, X, Minus } from "lucide-react";

const rows = [
  {
    feature: "Monthly cost",
    agency: "$2,000–$8,000/mo",
    surge: "From $499",
    diy: "Your time",
    agencyType: "text",
    surgeType: "highlight",
    diyType: "text",
  },
  {
    feature: "Knows your trade",
    agency: "Rarely",
    surge: "Built specifically for home services",
    diy: "You do",
    agencyType: "bad",
    surgeType: "good",
    diyType: "neutral",
  },
  {
    feature: "Uses AI research",
    agency: "Sometimes",
    surge: "Every blueprint uses Claude AI",
    diy: "Manual search",
    agencyType: "neutral",
    surgeType: "good",
    diyType: "bad",
  },
  {
    feature: "You see the full plan",
    agency: "No — they keep the playbook",
    surge: "You own every document",
    diy: "You build it",
    agencyType: "bad",
    surgeType: "good",
    diyType: "neutral",
  },
  {
    feature: "Time to first deliverable",
    agency: "2–4 weeks",
    surge: "48 hours",
    diy: "Whenever you get to it",
    agencyType: "bad",
    surgeType: "good",
    diyType: "neutral",
  },
  {
    feature: "Lock-in contract",
    agency: "Usually 6–12 months",
    surge: "Month-to-month",
    diy: "None",
    agencyType: "bad",
    surgeType: "good",
    diyType: "good",
  },
  {
    feature: "Handles your CRM/software",
    agency: "Extra cost",
    surge: "Includes setup guidance",
    diy: "You figure it out",
    agencyType: "bad",
    surgeType: "good",
    diyType: "bad",
  },
  {
    feature: "Who benefits long-term",
    agency: "The agency",
    surge: "You keep everything",
    diy: "You (if you have time)",
    agencyType: "bad",
    surgeType: "good",
    diyType: "neutral",
  },
];

type CellType = "text" | "highlight" | "good" | "bad" | "neutral";

function CellIcon({ type }: { type: CellType }) {
  if (type === "good") {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#00D4C8]/15 flex-shrink-0">
        <Check className="w-3 h-3 text-[#00D4C8]" />
      </span>
    );
  }
  if (type === "bad") {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-500/10 flex-shrink-0">
        <X className="w-3 h-3 text-red-400" />
      </span>
    );
  }
  if (type === "neutral") {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/10 flex-shrink-0">
        <Minus className="w-3 h-3 text-white/30" />
      </span>
    );
  }
  return null;
}

export default function ComparisonTable() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-dark py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-14"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Why contractors choose Surge
            <br className="hidden sm:block" /> over the alternatives.
          </h2>
          <p className="mt-3 text-white/50 text-lg max-w-xl">
            We're not the only option. Here's an honest look at all three.
          </p>
        </motion.div>

        {/* Desktop Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="hidden md:block"
        >
          {/* Column headers */}
          <div className="grid grid-cols-[2fr_1.5fr_2fr_1.5fr] gap-0 mb-2">
            <div />
            <div className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white/30">
              Traditional Agency
            </div>
            <div className="px-4 py-3 mx-2 text-center text-xs font-semibold uppercase tracking-widest text-[#00D4C8] bg-[#00D4C8]/8 rounded-t-xl border-t border-x border-[#00D4C8]/20">
              Surge AI
            </div>
            <div className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-widest text-white/30">
              Do It Yourself
            </div>
          </div>

          {/* Rows */}
          <div className="rounded-xl overflow-hidden border border-white/8">
            {rows.map((row, i) => (
              <div
                key={row.feature}
                className={`grid grid-cols-[2fr_1.5fr_2fr_1.5fr] gap-0 ${
                  i % 2 === 0 ? "bg-white/[0.02]" : "bg-transparent"
                } border-b border-white/8 last:border-b-0`}
              >
                {/* Feature label */}
                <div className="px-5 py-4 flex items-center">
                  <span className="text-sm font-semibold text-white/70">{row.feature}</span>
                </div>

                {/* Agency */}
                <div className="px-4 py-4 flex items-center justify-center gap-2 border-x border-white/5">
                  <CellIcon type={row.agencyType as CellType} />
                  <span
                    className={`text-sm text-center leading-snug ${
                      row.agencyType === "bad" ? "text-white/35" : "text-white/45"
                    }`}
                  >
                    {row.agency}
                  </span>
                </div>

                {/* Surge — highlighted column */}
                <div className="mx-2 px-4 py-4 flex items-center justify-center gap-2 bg-[#00D4C8]/5 border-x border-[#00D4C8]/15">
                  <CellIcon type={row.surgeType as CellType} />
                  <span
                    className={`text-sm text-center leading-snug font-medium ${
                      row.surgeType === "highlight" ? "text-[#00D4C8] font-bold" : "text-white/80"
                    }`}
                  >
                    {row.surge}
                  </span>
                </div>

                {/* DIY */}
                <div className="px-4 py-4 flex items-center justify-center gap-2 border-l border-white/5">
                  <CellIcon type={row.diyType as CellType} />
                  <span className="text-sm text-center leading-snug text-white/45">
                    {row.diy}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom cap for surge column */}
          <div className="grid grid-cols-[2fr_1.5fr_2fr_1.5fr] gap-0 mt-0">
            <div />
            <div />
            <div className="mx-2 h-3 bg-[#00D4C8]/8 rounded-b-xl border-b border-x border-[#00D4C8]/20" />
            <div />
          </div>
        </motion.div>

        {/* Mobile Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="md:hidden space-y-4"
        >
          {rows.map((row) => (
            <div
              key={row.feature}
              className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              <div className="px-5 py-3 bg-white/[0.03] border-b border-white/8">
                <span className="text-sm font-semibold text-white/80">{row.feature}</span>
              </div>
              <div className="divide-y divide-white/8">
                <div className="flex items-center justify-between px-5 py-3 gap-3">
                  <span className="text-xs font-semibold text-white/30 uppercase tracking-wide w-28 flex-shrink-0">
                    Agency
                  </span>
                  <div className="flex items-center gap-2 justify-end">
                    <CellIcon type={row.agencyType as CellType} />
                    <span className="text-sm text-white/40 text-right">{row.agency}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-3 gap-3 bg-[#00D4C8]/5">
                  <span className="text-xs font-semibold text-[#00D4C8] uppercase tracking-wide w-28 flex-shrink-0">
                    Surge AI
                  </span>
                  <div className="flex items-center gap-2 justify-end">
                    <CellIcon type={row.surgeType as CellType} />
                    <span className="text-sm text-white/85 text-right font-medium">{row.surge}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-5 py-3 gap-3">
                  <span className="text-xs font-semibold text-white/30 uppercase tracking-wide w-28 flex-shrink-0">
                    DIY
                  </span>
                  <div className="flex items-center gap-2 justify-end">
                    <CellIcon type={row.diyType as CellType} />
                    <span className="text-sm text-white/40 text-right">{row.diy}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
