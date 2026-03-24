"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, TrendingUp, Users, Award, Phone } from "lucide-react";

const stats = [
  {
    icon: TrendingUp,
    value: "4.1x",
    label: "Average Client ROI",
    sublabel: "measured across all marketing channels",
    color: "text-green-400",
    bg: "bg-green-400/10",
  },
  {
    icon: Phone,
    value: "312%",
    label: "More Inbound Calls",
    sublabel: "average increase after 90 days",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Users,
    value: "91%",
    label: "Client Retention Rate",
    sublabel: "after the first 12 months",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Award,
    value: "48hrs",
    label: "Avg. First Deliverable",
    sublabel: "from signed agreement to live campaigns",
    color: "text-orange-400",
    bg: "bg-orange-400/10",
  },
];

const testimonials = [
  {
    name: "Scott M.",
    title: "Owner",
    company: "Water Damage Restoration",
    avatar: "SM",
    avatarBg: "bg-blue-500",
    rating: 5,
    quote:
      "Before Blueprint, our phone wasn't ringing from Google at all. Within 60 days we were getting 15-20 calls a week just from our GBP and LSAs. The AI search visibility work is something no other agency even offers — we're showing up in ChatGPT results for our area.",
    result: "+18 qualified calls/week in 60 days",
    resultColor: "text-green-400",
  },
  {
    name: "Mike R.",
    title: "Owner & Operator",
    company: "HVAC Service Company",
    avatar: "MR",
    avatarBg: "bg-orange-500",
    rating: 5,
    quote:
      "I was spending $4,000/month on ads with nothing to show for it. Blueprint rebuilt everything — the LSA profile, our Google reviews strategy, our landing pages. We cut ad spend by 30% and our lead volume doubled. The reporting dashboard shows exactly where every dollar goes.",
    result: "2x leads, 30% lower ad spend",
    resultColor: "text-blue-400",
  },
  {
    name: "Dave & Lisa T.",
    title: "Co-Founders",
    company: "Roofing & Exterior Company",
    avatar: "DT",
    avatarBg: "bg-emerald-500",
    rating: 5,
    quote:
      "We went from 18 Google reviews to 94 in three months — all real, all from satisfied customers. That alone moved us into the Map Pack for every major keyword in our city. The review automation system runs on autopilot. Best investment we've made in the business.",
    result: "18 → 94 Google reviews, Map Pack rank #1",
    resultColor: "text-purple-400",
  },
];

export default function SocialProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="results"
      className="py-24 sm:py-32 bg-gray-50 dark:bg-[#0b1120] relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/20 bg-green-500/5 text-green-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Real Results
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Home service businesses
            <br />
            <span className="gradient-text">winning with AI</span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-white/50 text-lg">
            We track leads, calls, and booked jobs — not vanity metrics. Here's
            what our clients actually see.
          </p>
        </motion.div>

        {/* Stats row */}
        <div
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="p-6 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-center hover:border-blue-500/20 transition-all group"
            >
              <div
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-4`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className={`text-3xl sm:text-4xl font-black mb-1 ${stat.color}`}>
                {stat.value}
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-white/70 mb-1">
                {stat.label}
              </div>
              <div className="text-xs text-gray-400 dark:text-white/30">
                {stat.sublabel}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.15, ease: "easeOut" }}
              className="flex flex-col p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-blue-500/20 hover:shadow-xl transition-all duration-300"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              {/* Quote */}
              <blockquote className="flex-1 text-gray-600 dark:text-white/60 text-sm leading-relaxed mb-6 italic">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              {/* Result badge */}
              <div
                className={`text-sm font-bold ${t.resultColor} mb-5 pb-5 border-b border-gray-100 dark:border-white/10`}
              >
                📈 {t.result}
              </div>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {t.name}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-white/40">
                    {t.title}, {t.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-xs text-gray-400 dark:text-white/20"
        >
          Results are representative of top-performing clients. Individual results vary based on market, competition, and starting position.
        </motion.p>
      </div>
    </section>
  );
}
