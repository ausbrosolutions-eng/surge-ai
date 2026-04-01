"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  Zap,
  Target,
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

const RANK_COLORS = ["#B87333", "#D4956A", "#8B5E3C"] as const;

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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B87333]/10 border border-[#B87333]/25 text-[#B87333] text-xs font-semibold uppercase tracking-widest mb-3">
          Blueprint Snapshot: {company}
        </div>
        <h3 className="text-lg font-bold text-[#E8E2D8] leading-snug">
          {firstName}, here&rsquo;s what we found
        </h3>
        <p className="text-sm text-[#9A9086] mt-1">
          Personalized for your business. Not a template.
        </p>
      </div>

      {/* Revenue Gap */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="p-4 rounded-xl bg-[#B87333]/10 border border-[#B87333]/25"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#B87333]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <TrendingUp className="w-4 h-4 text-[#B87333]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#B87333] uppercase tracking-wider mb-1">
              Your #1 Revenue Gap
            </div>
            <div className="text-sm font-bold text-[#E8E2D8] mb-1.5">
              {snapshot.revenueGap.title}
            </div>
            <p className="text-sm text-[#9A9086] leading-relaxed">
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
        <div className="text-xs font-semibold text-[#9A9086] uppercase tracking-wider mb-2">
          Top 3 Channels: Ranked by ROI for You
        </div>
        <div className="space-y-2">
          {snapshot.topChannels.map((channel) => (
            <div
              key={channel.rank}
              className="flex items-start gap-3 p-3 rounded-xl border border-[#2A2520] bg-[#111111]"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white mt-0.5"
                style={{
                  backgroundColor: RANK_COLORS[channel.rank - 1] ?? "#666",
                }}
              >
                {channel.rank}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-[#E8E2D8] leading-tight">
                    {channel.name}
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full self-start"
                    style={{
                      color: RANK_COLORS[channel.rank - 1] ?? "#666",
                      backgroundColor: `${RANK_COLORS[channel.rank - 1] ?? "#666"}18`,
                    }}
                  >
                    {channel.expectedResult}
                  </span>
                </div>
                <p className="text-sm text-[#9A9086] mt-1.5 leading-relaxed">
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
        className="p-4 rounded-xl bg-[#D4956A]/10 border border-[#D4956A]/25"
      >
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4956A]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap className="w-4 h-4 text-[#D4956A]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#D4956A] uppercase tracking-wider mb-1">
              Do This This Week
            </div>
            <div className="text-sm font-bold text-[#E8E2D8] mb-1.5">
              {snapshot.weekAction.title}
            </div>
            <p className="text-sm text-[#9A9086] leading-relaxed">
              {snapshot.weekAction.description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Competitive Blind Spot */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="rounded-xl border border-[#2A2520] bg-[#111111]"
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#B87333]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Target className="w-4 h-4 text-[#B87333]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#B87333] uppercase tracking-wider mb-1">
                Your Competitive Blind Spot
              </div>
              <p className="text-sm text-[#9A9086] leading-relaxed">
                {snapshot.blindSpot}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full Blueprint CTA */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="p-4 rounded-xl border border-[#2A2520] bg-[#111111] space-y-3"
      >
        <div>
          <div className="text-sm font-bold text-[#E8E2D8] mb-1">
            This is just the surface.
          </div>
          <p className="text-sm text-[#9A9086] leading-relaxed">
            {snapshot.fullBlueprintHint}
          </p>
        </div>

        <div className="space-y-1.5">
          {FULL_BLUEPRINT_ITEMS.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-[#B87333] flex-shrink-0" />
              <span className="text-sm text-[#E8E2D8]">
                {item}
              </span>
            </div>
          ))}
        </div>

        <a
          href="#"
          className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#B87333] hover:bg-[#D4956A] text-[#0A0A0A] font-bold text-sm transition-all duration-200 mt-1"
        >
          Book a Free 15-min Strategy Call
          <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </motion.div>
  );
}
