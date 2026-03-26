"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Clock, ArrowRight, Award } from "lucide-react";

// TODO: Replace with your actual YouTube video ID
const YOUTUBE_VIDEO_ID = "dQw4w9WgXcQ";

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
            8 to 31 booked jobs in 90 days.
          </h2>
          <p className="text-white/55 text-lg leading-relaxed">
            Real HVAC contractor. Real results. This is exactly how we do it.
          </p>
        </motion.div>

        {/* Video embed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
          className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 mb-10"
          style={{ aspectRatio: "16 / 9" }}
        >
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
            title="Surge AI — HVAC contractor case study"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
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
