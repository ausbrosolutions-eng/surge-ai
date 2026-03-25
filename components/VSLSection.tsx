"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Play, Star, Clock, ArrowRight, Award } from "lucide-react";

const stats = [
  {
    icon: Award,
    value: "214",
    label: "blueprints delivered",
  },
  {
    icon: Clock,
    value: "48-hour",
    label: "turnaround",
  },
  {
    icon: Star,
    value: "4.8 / 5",
    label: "average rating",
  },
];

export default function VSLSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="watch"
      className="py-24 sm:py-32 bg-[#0A1628] relative overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div ref={ref} className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5 text-white/60 text-xs font-semibold uppercase tracking-widest mb-4">
            See It In Action
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
            Watch How We Got an HVAC Contractor from 8 to 31 Booked Jobs in 90 Days
          </h2>
          <p className="text-white/55 text-lg leading-relaxed">
            This is exactly how we do it &mdash; and what we&rsquo;ll build for you.
          </p>
        </motion.div>

        {/* Video placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 mb-10"
          style={{ aspectRatio: "16 / 9" }}
        >
          {/* TODO: Replace src with actual video URL (e.g. YouTube embed or self-hosted) */}
          {/* <iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID" ... /> */}

          {/* Gradient background for placeholder */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0d1f35] via-[#0A1628] to-[#060e1a]" />

          {/* Subtle noise texture overlay */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              backgroundSize: "200px 200px",
            }}
          />

          {/* Centered play button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-18 h-18 rounded-full bg-[#FF6B47] flex items-center justify-center shadow-xl shadow-[#FF6B47]/40 cursor-pointer"
              style={{ width: 72, height: 72 }}
              aria-label="Play video"
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.button>
          </div>

          {/* Duration badge */}
          <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/70 rounded-md text-white text-xs font-bold tracking-wide">
            3:47
          </div>

          {/* Thumbnail label */}
          <div className="absolute top-4 left-4 px-3 py-1 bg-[#FF6B47]/90 rounded-lg text-white text-xs font-bold uppercase tracking-wide">
            Real Client Results
          </div>
        </motion.div>

        {/* Trust stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-8 sm:gap-16 mb-10"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#00D4C8]/10 border border-[#00D4C8]/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-[#00D4C8]" />
              </div>
              <div>
                <div className="text-lg font-black text-white leading-none">{value}</div>
                <div className="text-xs text-white/40 mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Primary CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex justify-center"
        >
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] text-white font-bold text-base transition-all duration-200 hover:shadow-xl hover:shadow-[#FF6B47]/30 hover:-translate-y-1"
          >
            Get My Free Blueprint Snapshot
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
