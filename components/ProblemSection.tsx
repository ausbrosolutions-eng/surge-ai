"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { PhoneOff, BarChart2, Map } from "lucide-react";

const problems = [
  {
    icon: PhoneOff,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
    tag: "The Lead Problem",
    title: "Your phone goes quiet and you don't know why",
    description:
      "Last month was great. This month the calls dried up. You posted on Facebook, asked for referrals, even ran a promotion, but nothing predictable. You're running your business on hope, not a system.",
  },
  {
    icon: BarChart2,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
    tag: "The Agency Problem",
    title: "You're paying an agency and can't explain what you're getting",
    description:
      "They send a report every month with impressions and clicks. Your phone isn't ringing more. You ask questions and get jargon. You're paying $2,500/mo and your gut says it isn't working.",
  },
  {
    icon: Map,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-500",
    tag: "The Clarity Problem",
    title: "You know you need to grow but don't know the next move",
    description:
      "You want to hit $3M. Or $5M. Or just take a week off without the business falling apart. But nobody's ever sat down and built you a roadmap for how to actually get there.",
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
    <section className="section-light py-24 sm:py-32 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mb-16"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0A1628] leading-tight">
            Sound familiar?
          </h2>
          <p className="mt-3 text-gray-500 text-lg">
            If you run a home service business, at least one of these keeps you up at night.
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
              className="card-solid flex flex-col p-8 rounded-2xl"
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl ${problem.iconBg} flex items-center justify-center mb-5`}
              >
                <problem.icon className={`w-6 h-6 ${problem.iconColor}`} />
              </div>

              {/* Tag */}
              <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                {problem.tag}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-[#0A1628] mb-4 leading-snug">
                {problem.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Bridge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-12"
        >
          <p className="text-gray-500 text-base">
            Every contractor we&rsquo;ve worked with had at least two of these.{" "}
            <a
              href="#how-it-works"
              className="text-[#0A1628] font-semibold underline-offset-4 hover:underline transition-colors"
            >
              The Blueprint solves all three. &rarr;
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
