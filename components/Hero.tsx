"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play, TrendingUp, Phone, Clock } from "lucide-react";

const trades = ["HVAC", "Roofing", "Plumbing", "Restoration", "Electrical", "Landscaping"];

const floatingStats = [
  { icon: TrendingUp, label: "Avg. Client ROI", value: "4.1x", color: "text-blue-400" },
  { icon: Phone, label: "More Inbound Calls", value: "+312%", color: "text-[#FF6B47]" },
  { icon: Clock, label: "Days to First Lead", value: "<30", color: "text-green-400" },
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
      {/* Animated orbs — teal + coral color wave */}
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-[#FF6B47] animate-pulse" />
              AI Revenue Consulting · Built for Home Services
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight text-balance"
          >
            We Build the Roadmap.
            <br />
            <span className="gradient-text">You Drive the Revenue.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed text-balance"
          >
            AI-powered growth blueprints for home service businesses ready to scale.
            A custom plan built around your trade, your market, and your revenue goal —
            <span className="text-white/90 font-medium"> no fluff, no vanity metrics, no giving up the wheel.</span>
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
              Get Your Free Blueprint Snapshot
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#how-it-works"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white font-semibold text-base transition-all duration-200 hover:border-white/40 hover:-translate-y-0.5"
            >
              <div className="w-7 h-7 rounded-full bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                <Play className="w-3 h-3 text-blue-400 fill-blue-400 ml-0.5" />
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
                className="glass rounded-2xl px-6 py-4 flex items-center gap-3 hover:border-white/20 transition-all group"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center">
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div className="text-left">
                  <div className={`text-xl font-bold ${stat.color}`}>
                    {stat.value}
                  </div>
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
          <p className="text-white/30 text-sm font-medium uppercase tracking-widest mb-8">
            Built for home service businesses across every trade
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {trades.map((trade) => (
              <div
                key={trade}
                className="text-white/20 text-base font-bold tracking-wider hover:text-blue-400/60 transition-colors cursor-default select-none"
              >
                {trade}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#070d1a] to-transparent pointer-events-none" />
    </section>
  );
}
