"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

const results = [
  {
    trade: "HVAC",
    location: "Dallas, TX",
    owner: "Marcus T.",
    business: "Cool Comfort HVAC",
    problem: "Was spending $3,200/mo on ads with no attribution — no idea what was working.",
    before: { value: "8", label: "booked jobs/mo" },
    after: { value: "31", label: "booked jobs/mo" },
    quote: "I finally know which ad is paying for itself and which one I was just burning money on.",
    timeframe: "Results in 47 days",
    avatarBg: "bg-orange-500",
    avatar: "MT",
  },
  {
    trade: "Plumbing",
    location: "Columbus, OH",
    owner: "Denny R.",
    business: "Riverside Plumbing Co.",
    problem: "Zero Google presence — 100% of jobs came from referrals and word-of-mouth.",
    before: { value: "0", label: "Google leads/week" },
    after: { value: "22", label: "Google leads/week" },
    quote: "First time in 11 years I'm getting calls from people who never heard my name before.",
    timeframe: "Results in 61 days",
    avatarBg: "bg-blue-600",
    avatar: "DR",
  },
  {
    trade: "Roofing",
    location: "Nashville, TN",
    owner: "Craig & Pam F.",
    business: "Summit Roofing",
    problem: "Classic feast-or-famine cycle. Storm season great, winters brutal.",
    before: { value: "4", label: "slow months/year" },
    after: { value: "1", label: "slow month/year" },
    quote: "December used to be dead. Last year we booked $180K in December alone.",
    timeframe: "Results in 90 days",
    avatarBg: "bg-emerald-600",
    avatar: "CF",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ResultsShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section-light py-24 sm:py-32" id="results">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] leading-tight">
            Real results from real contractors.
          </h2>
          <p className="mt-3 text-gray-500 text-lg max-w-xl">
            Not case studies. Actual numbers from owners in your trade.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {results.map((r) => (
            <motion.div
              key={r.owner}
              variants={cardVariants}
              className="card-solid flex flex-col rounded-2xl p-7"
            >
              {/* Trade badge */}
              <div className="flex items-center justify-between mb-5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0A1628]/8 text-[#0A1628] text-xs font-bold uppercase tracking-wide">
                  {r.trade} &middot; {r.location}
                </span>
                <span className="text-xs text-gray-400 font-medium">{r.timeframe}</span>
              </div>

              {/* Owner */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-9 h-9 rounded-full ${r.avatarBg} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {r.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0A1628]">{r.owner}</div>
                  <div className="text-xs text-gray-400">{r.business}</div>
                </div>
              </div>

              {/* Problem */}
              <p className="text-sm text-gray-500 leading-relaxed mb-6 pb-6 border-b border-gray-100">
                {r.problem}
              </p>

              {/* Before → After */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-2xl font-black text-gray-300">{r.before.value}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{r.before.label}</div>
                  <div className="text-xs font-semibold text-gray-400 mt-1">Before</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                <div className="flex-1 text-center p-3 rounded-xl bg-[#00D4C8]/8 border border-[#00D4C8]/20">
                  <div className="text-2xl font-black text-[#00D4C8]">{r.after.value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{r.after.label}</div>
                  <div className="text-xs font-semibold text-[#00D4C8] mt-1">After</div>
                </div>
              </div>

              {/* Quote */}
              <blockquote className="mt-auto text-sm text-gray-600 leading-relaxed italic border-l-2 border-[#00D4C8] pl-4">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer + CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <p className="text-xs text-gray-400 max-w-md leading-relaxed">
            These are from our top-performing clients. Your results will depend on your market,
            budget, and how fast you move.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0A1628] hover:bg-[#0d1f35] text-white font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap"
          >
            See If Your Market Has Availability
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
