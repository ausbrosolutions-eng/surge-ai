"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Users, MapPin, Clock } from "lucide-react";

const trades = ["HVAC", "Roofing", "Plumbing", "Restoration", "Electrical", "Landscaping"];

const floatingStats = [
  { icon: Users, label: "Contractors Served", value: "214", color: "text-[#00D4C8]" },
  { icon: MapPin, label: "States", value: "43", color: "text-[#FF6B47]" },
  { icon: Clock, label: "Delivery", value: "48hr", color: "text-green-400" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden gradient-hero grid-bg">
      {/* Animated orbs */}
      <div
        className="orb w-96 h-96 bg-[#00D4C8] top-1/4 -left-32"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="orb w-72 h-72 bg-[#FF6B47] bottom-1/4 -right-16"
        style={{ animationDelay: "3s" }}
      />
      <div
        className="orb w-48 h-48 bg-[#00B5AA] top-1/3 right-1/3"
        style={{ animationDelay: "6s" }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-white/5 text-white/70 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[#FF6B47] animate-pulse flex-shrink-0" />
              Built for Home Service Contractors &middot; No Fluff, No Lock-ins
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight text-balance"
          >
            Find out what's killing
            <br />
            your <span className="text-[#00D4C8]">revenue.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            We build a free, personalized marketing plan for your trade and your market — in 60 seconds.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a
              href="#contact"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] text-white font-bold text-base transition-all duration-200 hover:shadow-xl hover:shadow-[#FF6B47]/40 hover:-translate-y-1"
            >
              Get My Free Growth Plan
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all duration-200 hover:border-white/40 hover:-translate-y-0.5"
            >
              <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
                <ChevronDown className="w-3.5 h-3.5 text-white" />
              </div>
              See How It Works
            </a>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            variants={itemVariants}
            className="mt-16 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            {floatingStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/[0.05] border border-white/10 px-6 py-4 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-left">
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="text-xs text-white/50">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Trade Trust Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-20 text-center"
        >
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-6">
            Every trade. Every market.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {trades.map((trade) => (
              <div
                key={trade}
                className="text-white/20 text-base font-bold tracking-wider hover:text-white/40 transition-colors cursor-default select-none"
              >
                {trade}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0A1628] to-transparent pointer-events-none" />
    </section>
  );
}
