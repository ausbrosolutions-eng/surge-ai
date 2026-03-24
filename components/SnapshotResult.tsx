"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Zap,
  Target,
  Lock,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export interface SnapshotChannel {
  rank: number;
  name: string;
  reason: string;
  expectedResult: string;
}

export interface SnapshotData {
  revenueGap: { title: string; description: string };
  topChannels: SnapshotChannel[];
  weekAction: { title: string; description: string };
  blindSpot: string;
  fullBlueprintHint: string;
}

interface SnapshotResultProps {
  snapshot: SnapshotData;
  name: string;
  company: string;
}

const RANK_COLORS = ["#00D4C8", "#FF6B47", "#a78bfa"] as const;

const FULL_BLUEPRINT_ITEMS = [
  "Full 9-channel strategy ranked by ROI for your trade",
  "Your city's competitive landscape analysis",
  "Phased revenue roadmap to your goal",
  "Your CAC benchmark vs. industry average",
  "One 30-min review call with a real strategist",
];

export default function SnapshotResult({
  snapshot,
  name,
  company,
}: SnapshotResultProps) {
  const firstName = name.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center pb-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-3">
          Blueprint Snapshot — {company}
        </div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-snug">
          {firstName}, here&rsquo;s what we found
        </h3>
        <p className="text-sm text-gray-400 dark:text-white/30 mt-1">
          Personalized for your business. Not a template.
        </p>
      </div>

      {/* Revenue Gap */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Your #1 Revenue Gap
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
              {snapshot.revenueGap.title}
            </div>
            <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">
              {snapshot.revenueGap.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Top Channels */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="text-xs font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wider mb-2">
          Top 3 Channels — Ranked by ROI for You
        </div>
        <div className="space-y-2">
          {snapshot.topChannels.map((channel) => (
            <div
              key={channel.rank}
              className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 dark:border-white/[0.06] bg-white dark:bg-white/[0.02]"
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-0.5"
                style={{
                  backgroundColor: RANK_COLORS[channel.rank - 1] ?? "#666",
                }}
              >
                {channel.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {channel.name}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap"
                    style={{
                      color: RANK_COLORS[channel.rank - 1] ?? "#666",
                      backgroundColor: `${RANK_COLORS[channel.rank - 1] ?? "#666"}18`,
                    }}
                  >
                    {channel.expectedResult}
                  </span>
                </div>
                <p className="text-xs text-gray-400 dark:text-white/40 mt-0.5 leading-relaxed">
                  {channel.reason}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* This Week's Action */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="p-4 rounded-xl bg-[#FF6B47]/5 border border-[#FF6B47]/20"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF6B47]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-[#FF6B47]" />
          </div>
          <div>
            <div className="text-xs font-semibold text-[#FF6B47] uppercase tracking-wider mb-1">
              Do This This Week
            </div>
            <div className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">
              {snapshot.weekAction.title}
            </div>
            <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">
              {snapshot.weekAction.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Locked: Competitive Blind Spot */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="relative rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-gray-300 dark:text-white/20" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-gray-300 dark:text-white/20 uppercase tracking-wider mb-1">
                Your Competitive Blind Spot
              </div>
              <p className="text-sm text-gray-400 dark:text-white/20 blur-sm select-none leading-relaxed">
                {snapshot.blindSpot}
              </p>
            </div>
          </div>
        </div>
        {/* Frosted overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/70 to-white/95 dark:via-[#0b1120]/70 dark:to-[#0b1120]/98 flex items-end justify-center pb-3.5">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/30 font-medium">
            <Lock className="w-3 h-3" />
            <span>Unlocked in your full Blueprint</span>
          </div>
        </div>
      </motion.div>

      {/* Full Blueprint CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="p-4 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/[0.02] space-y-3"
      >
        <div>
          <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
            This is just the surface.
          </div>
          <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">
            {snapshot.fullBlueprintHint}
          </p>
        </div>

        <div className="space-y-1.5">
          {FULL_BLUEPRINT_ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 dark:text-white/40">
                {item}
              </span>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] text-white font-bold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6B47]/25 hover:-translate-y-0.5 mt-1"
        >
          Get My Full Blueprint — $499
          <ArrowRight className="w-4 h-4" />
        </a>

        <a
          href="#"
          className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-gray-500 dark:text-white/50 text-sm font-semibold hover:border-blue-500/30 hover:text-blue-400 dark:hover:text-blue-400 transition-all duration-200"
        >
          Book a Free 15-min Strategy Call
        </a>
      </motion.div>
    </motion.div>
  );
}
