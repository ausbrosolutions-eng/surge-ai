"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { PhoneOff, BarChart2, Map } from "lucide-react";

const problems = [
  {
    icon: PhoneOff,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-400",
    borderColor: "hover:border-orange-500/40",
    glowColor: "hover:shadow-orange-500/10",
    tag: "The Lead Problem",
    title: "You don't know where your next job is coming from",
    description:
      "Referrals are unpredictable. LSA costs keep climbing. Word-of-mouth isn't a growth strategy — it's hope. Without a repeatable lead system, you're one slow month away from real pressure.",
    bullets: [
      "Revenue peaks and valleys with no clear cause",
      "Too dependent on a handful of referral sources",
      "No system turning cold prospects into booked jobs",
    ],
  },
  {
    icon: BarChart2,
    iconBg: "bg-red-500/10",
    iconColor: "text-red-400",
    borderColor: "hover:border-red-500/40",
    glowColor: "hover:shadow-red-500/10",
    tag: "The Agency Problem",
    title: "Your agency reports on impressions, not booked jobs",
    description:
      "Beautiful decks. Lots of screenshots. Zero line between their work and your revenue. You're paying for activity, not outcomes — and every month the numbers look the same.",
    bullets: [
      "Metrics that look good but don't move the business",
      "No attribution from ad spend to closed revenue",
      "Bloated retainers with no accountability to results",
    ],
  },
  {
    icon: Map,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-400",
    borderColor: "hover:border-purple-500/40",
    glowColor: "hover:shadow-purple-500/10",
    tag: "The Clarity Problem",
    title: "You have no clear roadmap from where you are to $20M",
    description:
      "You know the revenue goal. You don't know the exact sequence of moves to get there — which channels to prioritize, which services to push, which hires come first. Nobody's ever drawn it for you.",
    bullets: [
      "No phased plan from current revenue to the goal",
      "Unclear which marketing channels deserve budget now",
      "Decisions made on gut feel instead of data and sequence",
    ],
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 sm:py-32 bg-white dark:bg-[#070d1a] relative overflow-hidden">
      <div className="absolute inset-0 dot-bg opacity-40 dark:opacity-20" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-semibold uppercase tracking-widest mb-4">
            Sound familiar?
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
            Three things holding your
            <br />
            <span className="gradient-text">business back right now</span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-white/50 text-lg">
            Most home service businesses are dealing with all three at once. Here's what we fix.
          </p>
        </motion.div>

        {/* Problem cards */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {problems.map((problem) => (
            <motion.div
              key={problem.tag}
              variants={cardVariants}
              className={`group relative flex flex-col p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] transition-all duration-300 hover:shadow-2xl ${problem.glowColor} ${problem.borderColor} cursor-default`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl ${problem.iconBg} flex items-center justify-center mb-6`}
              >
                <problem.icon className={`w-6 h-6 ${problem.iconColor}`} />
              </div>

              {/* Tag */}
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">
                {problem.tag}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 leading-snug">
                {problem.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed mb-6">
                {problem.description}
              </p>

              {/* Bullets */}
              <ul className="mt-auto space-y-2.5">
                {problem.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 text-sm text-gray-500 dark:text-white/40"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Bridge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-500 dark:text-white/40 text-base">
            We built an AI-powered system that solves all three in one Blueprint.{" "}
            <a
              href="#how-it-works"
              className="text-blue-500 hover:text-blue-400 font-semibold underline-offset-4 hover:underline transition-colors"
            >
              Here's how it works →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
