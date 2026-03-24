"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Check,
  ExternalLink,
  Zap,
  Bot,
  Search,
  Mic,
  Globe,
} from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressRing from "@/components/dashboard/ProgressRing";
import ChecklistItemRow from "@/components/dashboard/ChecklistItem";
import type { ContentGap } from "@/lib/types";

// ── AI Platform definitions ───────────────────────────────────
const aiPlatforms = [
  {
    key: "chatgpt",
    name: "ChatGPT / OpenAI",
    icon: "🤖",
    color: "from-green-500/20 to-emerald-500/5",
    borderColor: "border-green-500/30",
    accentColor: "text-green-400",
    checklistCategory: "Bing / ChatGPT",
    keyFact: "ChatGPT sources from Bing — Bing SEO is critical. Also cites Yelp heavily for local businesses.",
    trafficShare: "87.4% of AI referral traffic",
  },
  {
    key: "google_ai",
    name: "Google AI Overviews",
    icon: "🔵",
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/30",
    accentColor: "text-blue-400",
    checklistCategory: "AI Content Strategy",
    keyFact: "Appears in 50-60% of U.S. searches. FAQPage schema is the #1 factor for inclusion.",
    trafficShare: "Converts at 14.2% vs 2.8% organic",
  },
  {
    key: "perplexity",
    name: "Perplexity AI",
    icon: "🔍",
    color: "from-purple-500/20 to-purple-500/5",
    borderColor: "border-purple-500/30",
    accentColor: "text-purple-400",
    checklistCategory: "Entity Optimization",
    keyFact: "6-10x higher CTR than ChatGPT. 20-30% conversion rates on high-intent queries.",
    trafficShare: "Fastest growing AI search engine",
  },
  {
    key: "copilot",
    name: "Microsoft Copilot",
    icon: "🪟",
    color: "from-sky-500/20 to-sky-500/5",
    borderColor: "border-sky-500/30",
    accentColor: "text-sky-400",
    checklistCategory: "Bing / ChatGPT",
    keyFact: "Reaches 1.4B users across Bing, Edge, Outlook, LinkedIn. Checks Bing Places amenities.",
    trafficShare: "Microsoft owns ~49% of OpenAI",
  },
  {
    key: "claude",
    name: "Claude (Anthropic)",
    icon: "🧠",
    color: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/30",
    accentColor: "text-orange-400",
    checklistCategory: "Entity Optimization",
    keyFact: "Sources from authoritative directories: Yelp, BBB, Angi, local press. NAP consistency is critical.",
    trafficShare: "Growing enterprise adoption",
  },
];

// ── E-E-A-T pillars ───────────────────────────────────────────
const eeatPillars = [
  {
    key: "experience",
    label: "Experience",
    icon: "🏗️",
    category: "E-E-A-T: Experience",
    description: "Demonstrated first-hand expertise in the trade",
  },
  {
    key: "expertise",
    label: "Expertise",
    icon: "🎓",
    category: "E-E-A-T: Expertise",
    description: "Certifications, credentials, technical knowledge",
  },
  {
    key: "authoritativeness",
    label: "Authoritativeness",
    icon: "🏆",
    category: "E-E-A-T: Authoritativeness",
    description: "Backlinks, mentions, industry recognition — coming soon",
  },
  {
    key: "trustworthiness",
    label: "Trustworthiness",
    icon: "🔒",
    category: "E-E-A-T: Trustworthiness",
    description: "SSL, BBB, reviews, NAP consistency",
  },
];

const statusOptions: ContentGap["status"][] = ["not_written", "in_progress", "published"];
const statusLabel: Record<ContentGap["status"], string> = {
  not_written: "Not Written",
  in_progress: "In Progress",
  published: "Published",
};
const statusColor: Record<ContentGap["status"], string> = {
  not_written: "text-red-400 bg-red-500/10",
  in_progress: "text-yellow-400 bg-yellow-500/10",
  published: "text-emerald-400 bg-emerald-500/10",
};

function PlatformStatus({ pct }: { pct: number }) {
  if (pct >= 70)
    return (
      <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
        Likely Cited
      </span>
    );
  if (pct >= 35)
    return (
      <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full font-medium">
        Needs Work
      </span>
    );
  return (
    <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full font-medium">
      Not Optimized
    </span>
  );
}

export default function AISearchPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const { store, toggleChecklistItem, updateChecklistNotes, updateContentGap } = useStore();
  const client = store.clients.find((c) => c.id === clientId);
  const checklists = store.checklists[`${clientId}_aiSearch`] || [];
  const contentGaps: ContentGap[] = store.contentGaps[clientId] || [];

  const [expandedPlatform, setExpandedPlatform] = useState<string | null>(null);
  const [newGapTitle, setNewGapTitle] = useState("");
  const [newGapQuery, setNewGapQuery] = useState("");
  const [newGapPlatform, setNewGapPlatform] = useState("");
  const [showAddGap, setShowAddGap] = useState(false);

  const score = client?.scores.aiSearch ?? 0;

  // Group checklists by category
  const grouped = checklists.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof checklists>);

  // Calculate score per category
  const categoryScore = (category: string) => {
    const items = grouped[category] || [];
    if (!items.length) return 0;
    const total = items.reduce((s, i) => s + i.scoreWeight, 0);
    const earned = items.reduce((s, i) => s + (i.completed ? i.scoreWeight : 0), 0);
    return Math.round((earned / total) * 100);
  };

  // E-E-A-T sub-score per pillar (out of 25)
  const eeatSubScore = (category: string) => {
    const items = grouped[category] || [];
    if (!items.length) return 0;
    const completed = items.filter((i) => i.completed).length;
    return Math.round((completed / Math.max(items.length, 1)) * 25);
  };

  const eeatColor = (score: number) => {
    if (score >= 20) return "text-emerald-400";
    if (score >= 12) return "text-amber-400";
    return "text-red-400";
  };

  const eeatBarColor = (score: number) => {
    if (score >= 20) return "bg-emerald-500";
    if (score >= 12) return "bg-amber-500";
    return "bg-red-500";
  };

  const addGap = () => {
    if (!newGapTitle.trim()) return;
    const newGapObj: ContentGap = {
      id: `cg-${Date.now()}`,
      title: newGapTitle.trim(),
      targetQuery: newGapQuery.trim(),
      aiPlatform: newGapPlatform.trim() || "All AI Platforms",
      status: "not_written",
    };
    // Add via updateContentGap — but we need to add to array directly
    const gaps = [...contentGaps, newGapObj];
    // Use localStorage directly since store has no addContentGap
    if (typeof window !== "undefined") {
      try {
        const all = JSON.parse(window.localStorage.getItem("blueprint_content_gaps") || "{}");
        all[clientId] = gaps;
        window.localStorage.setItem("blueprint_content_gaps", JSON.stringify(all));
        window.location.reload();
      } catch {}
    }
    setNewGapTitle("");
    setNewGapQuery("");
    setNewGapPlatform("");
    setShowAddGap(false);
  };

  if (!client) return <div className="p-6 text-gray-400">Client not found.</div>;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="AI Search / AEO" selectedClient={client} />

      <main className="flex-1 p-6 space-y-6">

        {/* ── Futuristic Score Header ───────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gray-950 border border-gray-700 rounded-2xl overflow-hidden"
        >
          {/* Animated background grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                "linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          {/* Glow effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-indigo-500/10 blur-3xl rounded-full" />

          <div className="relative p-6 flex items-center gap-8">
            <div className="relative">
              <ProgressRing score={score} size={120} strokeWidth={10} />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">
                AI Search Visibility
              </p>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                AI Search Visibility Score
              </h2>
              <p className="text-sm text-gray-400 mt-2 max-w-xl">
                AI referral traffic grew <span className="text-indigo-300 font-semibold">357% year-over-year</span> reaching 1.13B visits in June 2025. AI Overview traffic converts at{" "}
                <span className="text-indigo-300 font-semibold">14.2%</span> — 5x traditional organic.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex items-center gap-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-3 py-1.5">
                  <Bot className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs text-indigo-300 font-medium">AEO Optimized</span>
                </div>
                <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg px-3 py-1.5">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-xs text-purple-300 font-medium">Entity Strength</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Section 1: AI Platform Status ────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-white mb-3">AI Platform Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {aiPlatforms.map((platform, i) => {
              const pct = categoryScore(platform.checklistCategory);
              const categoryItems = grouped[platform.checklistCategory] || [];
              const isExpanded = expandedPlatform === platform.key;
              return (
                <motion.div
                  key={platform.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`bg-gradient-to-br ${platform.color} border ${platform.borderColor} rounded-xl overflow-hidden`}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{platform.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{platform.name}</p>
                          <p className={`text-xs ${platform.accentColor}`}>{platform.trafficShare}</p>
                        </div>
                      </div>
                      <PlatformStatus pct={pct} />
                    </div>

                    {/* Progress bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">Optimization progress</span>
                        <span className={`text-xs font-medium ${platform.accentColor}`}>{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full bg-gradient-to-r ${platform.color.replace("from-", "from-").replace("/20", "").replace("/5", "")}`}
                          style={{
                            background: `linear-gradient(90deg, currentColor, currentColor)`,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              background:
                                platform.key === "chatgpt"
                                  ? "linear-gradient(90deg, #10b981, #059669)"
                                  : platform.key === "google_ai"
                                  ? "linear-gradient(90deg, #3b82f6, #2563eb)"
                                  : platform.key === "perplexity"
                                  ? "linear-gradient(90deg, #a855f7, #7c3aed)"
                                  : platform.key === "copilot"
                                  ? "linear-gradient(90deg, #0ea5e9, #0284c7)"
                                  : "linear-gradient(90deg, #f97316, #ea580c)",
                            }}
                          />
                        </motion.div>
                      </div>
                    </div>

                    {/* Key fact */}
                    <p className="text-xs text-gray-400 mt-2 leading-relaxed">{platform.keyFact}</p>

                    {/* Expand toggle */}
                    {categoryItems.length > 0 && (
                      <button
                        onClick={() => setExpandedPlatform(isExpanded ? null : platform.key)}
                        className={`flex items-center gap-1.5 mt-3 text-xs font-medium ${platform.accentColor} hover:opacity-80 transition-opacity`}
                      >
                        {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        {isExpanded ? "Hide" : "Show"} requirements ({categoryItems.length})
                      </button>
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && categoryItems.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-gray-700/50"
                      >
                        <div className="p-3 space-y-1.5">
                          {categoryItems.map((item) => (
                            <ChecklistItemRow
                              key={item.id}
                              item={item}
                              onToggle={(id) => toggleChecklistItem(clientId, "aiSearch", id)}
                              onNoteChange={(id, notes) =>
                                updateChecklistNotes(clientId, "aiSearch", id, notes)
                              }
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Entity Optimization ───────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-1">Entity Optimization</h2>
          <p className="text-xs text-gray-500 mb-4">
            AI search relies on entity understanding — recognizing your business as a distinct, trustworthy entity. Consistent NAP across all sources is the foundation.
          </p>
          <div className="space-y-1.5">
            {(grouped["Entity Optimization"] || []).map((item) => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                onToggle={(id) => toggleChecklistItem(clientId, "aiSearch", id)}
                onNoteChange={(id, notes) => updateChecklistNotes(clientId, "aiSearch", id, notes)}
              />
            ))}
            {!(grouped["Entity Optimization"] || []).length && (
              <p className="text-sm text-gray-600 text-center py-4">
                Entity checklist items will appear after store initialization.
              </p>
            )}
          </div>
        </section>

        {/* ── Section 3: E-E-A-T Scorecard ─────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-white mb-3">E-E-A-T Scorecard</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eeatPillars.map((pillar, i) => {
              const subScore = eeatSubScore(pillar.category);
              const pillarItems = grouped[pillar.category] || [];
              const [expanded, setExpanded] = useState(false);
              return (
                <motion.div
                  key={pillar.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{pillar.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-white">{pillar.label}</p>
                          <p className="text-xs text-gray-500">{pillar.description}</p>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${eeatColor(subScore)}`}>
                        {subScore}
                        <span className="text-xs text-gray-600">/25</span>
                      </div>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className={`h-full rounded-full ${eeatBarColor(subScore)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${(subScore / 25) * 100}%` }}
                        transition={{ duration: 0.8, delay: i * 0.1 }}
                      />
                    </div>
                    {pillarItems.length > 0 && (
                      <button
                        onClick={() => setExpanded(!expanded)}
                        className="flex items-center gap-1 mt-3 text-xs text-gray-500 hover:text-gray-300 transition-colors"
                      >
                        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                        {pillarItems.length} checklist items
                      </button>
                    )}
                  </div>
                  <AnimatePresence>
                    {expanded && pillarItems.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden border-t border-gray-700/50"
                      >
                        <div className="p-3 space-y-1.5">
                          {pillarItems.map((item) => (
                            <ChecklistItemRow
                              key={item.id}
                              item={item}
                              onToggle={(id) => toggleChecklistItem(clientId, "aiSearch", id)}
                              onNoteChange={(id, notes) =>
                                updateChecklistNotes(clientId, "aiSearch", id, notes)
                              }
                            />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Section 4: Voice Search ───────────────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Mic className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-semibold text-white">Voice Search Optimization</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            88.8M Americans use voice assistants. 76% of voice queries have local intent. Queries are conversational: "Who is the best plumber in Denver for an emergency?"
          </p>
          <div className="space-y-1.5">
            {(grouped["Voice Search"] || []).map((item) => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                onToggle={(id) => toggleChecklistItem(clientId, "aiSearch", id)}
                onNoteChange={(id, notes) => updateChecklistNotes(clientId, "aiSearch", id, notes)}
              />
            ))}
            {!(grouped["Voice Search"] || []).length && (
              <p className="text-sm text-gray-600 text-center py-4">
                Voice search checklist items will appear after store initialization.
              </p>
            )}
          </div>
        </section>

        {/* ── Section 5: AI Content Gap Analysis ───────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">AI Content Gap Analysis</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Content that directly answers AI platform queries. Target: one piece per gap.
              </p>
            </div>
            <button
              onClick={() => setShowAddGap(!showAddGap)}
              className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Gap
            </button>
          </div>

          {/* Add gap form */}
          <AnimatePresence>
            {showAddGap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-4"
              >
                <div className="bg-gray-900 border border-gray-600 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Content Title</label>
                      <input
                        type="text"
                        value={newGapTitle}
                        onChange={(e) => setNewGapTitle(e.target.value)}
                        placeholder="What does water damage cost in Denver?"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-200 px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Target Query</label>
                      <input
                        type="text"
                        value={newGapQuery}
                        onChange={(e) => setNewGapQuery(e.target.value)}
                        placeholder="water damage cost Denver"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-200 px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">AI Platform</label>
                      <input
                        type="text"
                        value={newGapPlatform}
                        onChange={(e) => setNewGapPlatform(e.target.value)}
                        placeholder="ChatGPT, Google AI Overview"
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg text-xs text-gray-200 px-3 py-2 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={addGap}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2 rounded-lg transition-colors"
                    >
                      Add Content Gap
                    </button>
                    <button
                      onClick={() => setShowAddGap(false)}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-4 py-2 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            {contentGaps.map((gap) => (
              <motion.div
                key={gap.id}
                layout
                className="flex items-center gap-3 bg-gray-900/50 border border-gray-700 rounded-xl p-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 font-medium truncate">{gap.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Search className="w-3 h-3 text-gray-600" />
                    <p className="text-xs text-gray-500 truncate">{gap.targetQuery}</p>
                    <span className="text-gray-700">·</span>
                    <span className="text-xs text-indigo-400 truncate">{gap.aiPlatform}</span>
                  </div>
                </div>
                <select
                  value={gap.status}
                  onChange={(e) =>
                    updateContentGap(clientId, gap.id, { status: e.target.value as ContentGap["status"] })
                  }
                  className={`text-xs px-2 py-1 rounded-lg border border-gray-600 bg-gray-900 focus:outline-none focus:border-indigo-500 cursor-pointer ${statusColor[gap.status]}`}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </select>
                {gap.status === "published" ? (
                  <input
                    type="text"
                    value={gap.publishedUrl || ""}
                    onChange={(e) => updateContentGap(clientId, gap.id, { publishedUrl: e.target.value })}
                    placeholder="Published URL"
                    className="w-36 bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-300 px-2 py-1 focus:outline-none focus:border-indigo-500"
                  />
                ) : (
                  <div className="w-36" />
                )}
              </motion.div>
            ))}
            {contentGaps.length === 0 && (
              <div className="text-center py-8 text-gray-600 text-sm">
                No content gaps added yet. Click "Add Gap" to get started.
              </div>
            )}
          </div>
        </section>

      </main>
    </div>
  );
}
