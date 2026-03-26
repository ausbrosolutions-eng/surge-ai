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
    color: "text-[#00D4C8]",
    bg: "bg-[#00D4C8]/10",
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
    color: "text-[#FF6B47]",
    bg: "bg-[#FF6B47]/10",
  },
];

const testimonials = [
  {
    name: "Scott M.",
    title: "Owner",
    company: "Water Damage Restoration",
    trade: "Restoration · Phoenix, AZ",
    avatar: "SM",
    avatarBg: "bg-blue-600",
    rating: 5,
    quote:
      "Before this, our phone wasn't ringing from Google at all. Within 60 days we were getting 15–20 calls a week just from our GBP and LSAs. I didn't know how invisible we actually were until I saw the numbers.",
    result: "+18 qualified calls/week in 60 days",
    resultColor: "text-green-600",
  },
  {
    name: "Mike R.",
    title: "Owner & Operator",
    company: "HVAC Service Company",
    trade: "HVAC · Houston, TX",
    avatar: "MR",
    avatarBg: "bg-orange-500",
    rating: 5,
    quote:
      "I was spending $4,000/month on ads and couldn't tell you where a single job came from. They rebuilt everything. We cut ad spend by 30% and lead volume doubled. First time I've actually understood my own marketing.",
    result: "2x leads, 30% lower ad spend",
    resultColor: "text-blue-600",
  },
  {
    name: "Dave & Lisa T.",
    title: "Co-Founders",
    company: "Summit Roofing",
    trade: "Roofing · Nashville, TN",
    avatar: "DT",
    avatarBg: "bg-emerald-600",
    rating: 5,
    quote:
      "Went from 18 Google reviews to 94 in three months. All real, all from real customers. That alone put us in the Map Pack for every keyword in our city. The review system runs while we sleep.",
    result: "18 → 94 Google reviews, Map Pack #1",
    resultColor: "text-purple-600",
  },
];

export default function SocialProof() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 sm:py-32 relative overflow-hidden">
      {/* Dark stats bar */}
      <div className="section-dark py-12 mb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            ref={ref}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
                className="text-center"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mx-auto mb-3`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div className={`text-3xl sm:text-4xl font-black mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-sm font-semibold text-white/70 mb-0.5">{stat.label}</div>
                <div className="text-xs text-white/30">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials on light */}
      <div className="section-light py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1628]">
              What contractors are saying
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.15, ease: "easeOut" }}
                className="card-solid flex flex-col p-7 rounded-2xl"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="flex-1 text-gray-600 text-sm leading-relaxed mb-5">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>

                {/* Result badge */}
                <div
                  className={`text-sm font-bold ${t.resultColor} mb-5 pb-5 border-b border-gray-100`}
                >
                  {t.result}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${t.avatarBg} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0A1628]">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.company}</div>
                    <div className="text-xs text-gray-400 font-medium">{t.trade}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-xs text-gray-400"
          >
            Results are representative of top-performing clients. Individual results vary based on market, competition, and starting position.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
