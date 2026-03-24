"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Zap,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressRing from "@/components/dashboard/ProgressRing";
import ChecklistItemRow from "@/components/dashboard/ChecklistItem";

// ── Campaign definitions ──────────────────────────────────────
const CAMPAIGN_DEFS = [
  {
    key: "lsa",
    name: "LSA Campaign",
    description: "Google Local Service Ads — pay-per-lead, highest intent. Managed in LSA dashboard, not Google Ads.",
    priority: "#1 Priority",
    estCpc: "Pay-per-lead",
    color: "border-emerald-500/30 bg-emerald-500/5",
    badge: "text-emerald-400 bg-emerald-500/10",
  },
  {
    key: "branded",
    name: "Branded Search",
    description: "Protect your brand name from competitors bidding on it. Very low CPC with high CTR.",
    priority: "#2",
    estCpc: "$0.50–$2",
    color: "border-blue-500/30 bg-blue-500/5",
    badge: "text-blue-400 bg-blue-500/10",
  },
  {
    key: "service",
    name: "Service-Specific Campaigns",
    description: "One campaign per major service line with separate keywords, messaging, and landing pages.",
    priority: "#3",
    estCpc: "$8–$15",
    color: "border-purple-500/30 bg-purple-500/5",
    badge: "text-purple-400 bg-purple-500/10",
  },
  {
    key: "emergency",
    name: "Emergency / Urgent Campaign",
    description: "High-bid campaign targeting 'emergency [service] near me' queries. Converts 3-5x higher than standard campaigns.",
    priority: "#4 — High ROI",
    estCpc: "$12–$25",
    color: "border-red-500/30 bg-red-500/5",
    badge: "text-red-400 bg-red-500/10",
  },
  {
    key: "remarketing",
    name: "Remarketing Display",
    description: "Retarget website visitors with display ads for 30 days. Builds credibility and keeps you top of mind.",
    priority: "#5",
    estCpc: "$0.50–$2 CPM",
    color: "border-amber-500/30 bg-amber-500/5",
    badge: "text-amber-400 bg-amber-500/10",
  },
];

// ── Keyword sets for restoration ─────────────────────────────
const EMERGENCY_KEYWORDS_DEFAULT = [
  "emergency water damage near me",
  "emergency flood cleanup",
  "24 hour water damage restoration",
  "burst pipe emergency",
  "basement flooding emergency",
  "emergency mold removal",
  "water damage emergency response",
  "fire damage emergency cleanup",
  "sewage backup emergency",
  "storm damage emergency",
];

const PLANNED_KEYWORDS_DEFAULT = [
  "water damage restoration Denver",
  "mold remediation Denver CO",
  "fire damage restoration Denver",
  "water damage company near me",
  "mold removal service",
  "flood cleanup service",
  "basement water damage repair",
  "smoke damage restoration",
  "sewage cleanup service",
  "structural drying service",
];

const NEGATIVE_KEYWORDS_DEFAULT = [
  "DIY",
  "jobs",
  "careers",
  "training",
  "free",
  "how to",
  "YouTube",
  "Reddit",
  "school",
  "certification",
  "parts",
  "supply",
  "wholesale",
  "warranty claim",
  "home depot",
  "lowes",
  "contractor license",
  "apprenticeship",
  "salary",
  "resume",
];

// ── Market size config ────────────────────────────────────────
const MARKET_SIZES = [
  { key: "small", label: "Small (<100K population)", range: "$800–$2,000/mo" },
  { key: "mid", label: "Mid-size Market", range: "$2,000–$6,000/mo" },
  { key: "metro", label: "Major Metro", range: "$5,000–$20,000+/mo" },
];

type CampaignState = {
  status: "active" | "paused" | "not_created";
  monthlyBudget: string;
};

type MetricsState = {
  totalSpend: string;
  clicks: string;
  conversions: string;
  roas: string;
};

function BenchmarkStatus({ value, low, high, higherIsBetter = true }: { value: number; low: number; high: number; higherIsBetter?: boolean }) {
  const onTarget = higherIsBetter ? value >= low : value <= high;
  if (onTarget)
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" />On Target
      </span>
    );
  return (
    <span className="flex items-center gap-1 text-xs text-amber-400">
      <AlertCircle className="w-3.5 h-3.5" />Needs Work
    </span>
  );
}

export default function AdsPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const { store, toggleChecklistItem, updateChecklistNotes } = useStore();
  const client = store.clients.find((c) => c.id === clientId);
  const checklists = store.checklists[`${clientId}_ads`] || [];

  const score = client?.scores.ads ?? 0;
  const currentMonthSpend = client?.adSpend ?? 0;

  // ── Campaign state ────────────────────────────────────────
  const [campaigns, setCampaigns] = useState<Record<string, CampaignState>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = window.localStorage.getItem(`blueprint_campaigns_${clientId}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return CAMPAIGN_DEFS.reduce((acc, c) => {
      acc[c.key] = { status: "not_created", monthlyBudget: "" };
      return acc;
    }, {} as Record<string, CampaignState>);
  });

  const saveCampaigns = (next: Record<string, CampaignState>) => {
    setCampaigns(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`blueprint_campaigns_${clientId}`, JSON.stringify(next));
    }
  };

  // ── Keyword toggles ───────────────────────────────────────
  const [emergencyKws, setEmergencyKws] = useState<Record<string, boolean>>(() =>
    EMERGENCY_KEYWORDS_DEFAULT.reduce((acc, kw) => ({ ...acc, [kw]: true }), {})
  );
  const [plannedKws, setPlannedKws] = useState<Record<string, boolean>>(() =>
    PLANNED_KEYWORDS_DEFAULT.reduce((acc, kw) => ({ ...acc, [kw]: false }), {})
  );

  // ── Negative keywords ─────────────────────────────────────
  const [negativeKws, setNegativeKws] = useState<string[]>(NEGATIVE_KEYWORDS_DEFAULT);
  const [newNegKw, setNewNegKw] = useState("");

  const addNegKw = () => {
    if (!newNegKw.trim() || negativeKws.includes(newNegKw.trim())) return;
    setNegativeKws([...negativeKws, newNegKw.trim()]);
    setNewNegKw("");
  };

  // ── Bidding phase ─────────────────────────────────────────
  const [biddingPhase, setBiddingPhase] = useState<1 | 2>(1);
  const [targetCPA, setTargetCPA] = useState("");

  // ── Performance metrics ───────────────────────────────────
  const [metrics, setMetrics] = useState<MetricsState>(() => {
    if (typeof window === "undefined") return { totalSpend: "", clicks: "", conversions: "", roas: "" };
    try {
      const saved = window.localStorage.getItem(`blueprint_ads_metrics_${clientId}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return { totalSpend: "", clicks: "", conversions: "", roas: "" };
  });
  const [metricsSaved, setMetricsSaved] = useState(false);

  const saveMetrics = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`blueprint_ads_metrics_${clientId}`, JSON.stringify(metrics));
    }
    setMetricsSaved(true);
    setTimeout(() => setMetricsSaved(false), 2000);
  };

  // ── Budget planner ────────────────────────────────────────
  const [marketSize, setMarketSize] = useState("mid");
  const [peakSeason, setPeakSeason] = useState(false);

  // ── Computed metrics ──────────────────────────────────────
  const computed = useMemo(() => {
    const spend = parseFloat(metrics.totalSpend) || 0;
    const clicks = parseInt(metrics.clicks) || 0;
    const conversions = parseInt(metrics.conversions) || 0;
    const avgCPC = clicks > 0 ? spend / clicks : 0;
    const convRate = clicks > 0 ? (conversions / clicks) * 100 : 0;
    const cpl = conversions > 0 ? spend / conversions : 0;
    return { avgCPC, convRate, cpl };
  }, [metrics]);

  const budgetRange = useMemo(() => {
    const base = MARKET_SIZES.find((m) => m.key === marketSize)?.range ?? "$2,000–$6,000/mo";
    if (!peakSeason) return base;
    return `${base} (+20-30% peak season adjustment)`;
  }, [marketSize, peakSeason]);

  // ── Checklist grouped ─────────────────────────────────────
  const grouped = checklists.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof checklists>);

  if (!client) return <div className="p-6 text-gray-400">Client not found.</div>;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Google Ads / PPC" selectedClient={client} />

      <main className="flex-1 p-6 space-y-6">

        {/* ── Score Header ──────────────────────────────────────── */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center gap-6">
          <ProgressRing score={score} size={100} strokeWidth={8} />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Google Ads / PPC Score</h2>
            <p className="text-sm text-gray-400 mt-1">
              Paid search is immediately scalable. Start with Maximize Conversions for 30-60 days before switching to Target CPA.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div>
                <p className="text-lg font-bold text-white">${currentMonthSpend.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Monthly Budget</p>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div>
                <p className="text-lg font-bold text-amber-400">
                  {score >= 60 ? "Phase 2" : "Phase 1"}
                </p>
                <p className="text-xs text-gray-500">Bidding Phase</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 1: Campaign Structure ────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-white mb-3">Campaign Structure</h2>
          <div className="space-y-3">
            {CAMPAIGN_DEFS.map((def, i) => {
              const state = campaigns[def.key] || { status: "not_created", monthlyBudget: "" };
              return (
                <motion.div
                  key={def.key}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`border rounded-xl p-4 ${def.color}`}
                >
                  <div className="flex items-start gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="text-sm font-semibold text-white">{def.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${def.badge}`}>
                          {def.priority}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">{def.description}</p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Status</label>
                        <select
                          value={state.status}
                          onChange={(e) =>
                            saveCampaigns({
                              ...campaigns,
                              [def.key]: { ...state, status: e.target.value as CampaignState["status"] },
                            })
                          }
                          className={`text-xs px-2 py-1.5 rounded-lg border border-gray-600 bg-gray-900 focus:outline-none cursor-pointer ${
                            state.status === "active"
                              ? "text-emerald-400"
                              : state.status === "paused"
                              ? "text-amber-400"
                              : "text-gray-500"
                          }`}
                        >
                          <option value="active">Active</option>
                          <option value="paused">Paused</option>
                          <option value="not_created">Not Created</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Monthly Budget</label>
                        <input
                          type="text"
                          value={state.monthlyBudget}
                          onChange={(e) =>
                            saveCampaigns({
                              ...campaigns,
                              [def.key]: { ...state, monthlyBudget: e.target.value },
                            })
                          }
                          placeholder="e.g. $1,200"
                          className="w-28 bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-200 px-2 py-1.5 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600 block mb-1">Est. CPC</label>
                        <span className="text-xs text-gray-400">{def.estCpc}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Keyword Strategy ──────────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-white mb-3">Keyword Strategy</h2>
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl px-4 py-3 mb-3 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <p className="text-xs text-amber-300">
              Allocate <strong>30-40% of budget to emergency terms</strong> — they convert 3-5x higher than planned service keywords.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Emergency keywords */}
            <div className="bg-gray-800 border border-red-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <h3 className="text-sm font-semibold text-white">Emergency Keywords</h3>
                <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">High Priority</span>
              </div>
              <div className="space-y-1.5">
                {EMERGENCY_KEYWORDS_DEFAULT.map((kw) => (
                  <label key={kw} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={emergencyKws[kw] ?? true}
                      onChange={(e) => setEmergencyKws({ ...emergencyKws, [kw]: e.target.checked })}
                      className="w-3.5 h-3.5 rounded accent-red-500"
                    />
                    <span
                      className={`text-xs transition-colors ${
                        emergencyKws[kw] ?? true ? "text-gray-200" : "text-gray-600 line-through"
                      }`}
                    >
                      {kw}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Planned keywords */}
            <div className="bg-gray-800 border border-blue-500/20 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <h3 className="text-sm font-semibold text-white">Planned Keywords</h3>
                <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">Standard</span>
              </div>
              <div className="space-y-1.5">
                {PLANNED_KEYWORDS_DEFAULT.map((kw) => (
                  <label key={kw} className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={plannedKws[kw] ?? false}
                      onChange={(e) => setPlannedKws({ ...plannedKws, [kw]: e.target.checked })}
                      className="w-3.5 h-3.5 rounded accent-blue-500"
                    />
                    <span
                      className={`text-xs transition-colors ${
                        plannedKws[kw] ? "text-gray-200" : "text-gray-500"
                      }`}
                    >
                      {kw}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 3: Negative Keywords ─────────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-1">Negative Keywords</h2>
          <p className="text-xs text-gray-500 mb-4">
            Add these to all campaigns immediately. Prevent wasted spend on DIY searches, job seekers, and unrelated queries.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {negativeKws.map((kw) => (
              <span
                key={kw}
                className="flex items-center gap-1.5 bg-gray-700 border border-gray-600 text-gray-300 text-xs px-2.5 py-1 rounded-full"
              >
                {kw}
                <button
                  onClick={() => setNegativeKws(negativeKws.filter((k) => k !== kw))}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newNegKw}
              onChange={(e) => setNewNegKw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addNegKw()}
              placeholder="Add negative keyword..."
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={addNegKw}
              className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </section>

        {/* ── Section 4: Ad Copy Checklist ──────────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Ad Copy Checklist</h2>
          <div className="space-y-4">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{category}</p>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <ChecklistItemRow
                      key={item.id}
                      item={item}
                      onToggle={(id) => toggleChecklistItem(clientId, "ads", id)}
                      onNoteChange={(id, notes) => updateChecklistNotes(clientId, "ads", id, notes)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {checklists.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-4">Checklist items will appear after store initialization.</p>
            )}
          </div>
        </section>

        {/* ── Section 5: Bidding Phase ──────────────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Bidding Phase</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setBiddingPhase(1)}
              className={`p-4 rounded-xl border text-left transition-all ${
                biddingPhase === 1
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${biddingPhase === 1 ? "bg-blue-400" : "bg-gray-600"}`} />
                <p className="text-sm font-semibold text-white">Phase 1: Maximize Conversions</p>
              </div>
              <p className="text-xs text-gray-400">First 30-60 days. Let Google's algorithm learn your conversion patterns before constraining it with CPA targets.</p>
              <p className="text-xs text-blue-400 mt-2 font-medium">Use when: Under 30 conversions/month per campaign</p>
            </button>
            <button
              onClick={() => setBiddingPhase(2)}
              className={`p-4 rounded-xl border text-left transition-all ${
                biddingPhase === 2
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-gray-700 bg-gray-900/50 hover:border-gray-600"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${biddingPhase === 2 ? "bg-emerald-400" : "bg-gray-600"}`} />
                <p className="text-sm font-semibold text-white">Phase 2: Target CPA</p>
              </div>
              <p className="text-xs text-gray-400">After 30+ conversions per campaign per month. Set Target CPA at 150% of desired CPL initially, then tighten over time.</p>
              <p className="text-xs text-emerald-400 mt-2 font-medium">Use when: 30+ conversions/month established</p>
            </button>
          </div>
          {biddingPhase === 2 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-3 mt-2">
                <label className="text-sm text-gray-400">Target CPA:</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    value={targetCPA}
                    onChange={(e) => setTargetCPA(e.target.value)}
                    placeholder="150"
                    className="pl-7 w-32 bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                {targetCPA && (
                  <p className="text-xs text-gray-500">
                    Start here, then reduce by $10-15 every 2-3 weeks as data accumulates.
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </section>

        {/* ── Section 6: Performance Metrics ───────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
            {[
              { label: "Total Spend", key: "totalSpend", prefix: "$", placeholder: "2500" },
              { label: "Clicks", key: "clicks", prefix: "", placeholder: "318" },
              { label: "Conversions", key: "conversions", prefix: "", placeholder: "42" },
              { label: "ROAS", key: "roas", prefix: "", placeholder: "3.5" },
            ].map(({ label, key, prefix, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                <div className="relative">
                  {prefix && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">{prefix}</span>
                  )}
                  <input
                    type="number"
                    value={metrics[key as keyof MetricsState]}
                    onChange={(e) => setMetrics({ ...metrics, [key]: e.target.value })}
                    placeholder={placeholder}
                    className={`w-full bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-200 py-2 focus:outline-none focus:border-blue-500 ${prefix ? "pl-7 pr-3" : "px-3"}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Calculated fields */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white">
                ${computed.avgCPC.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500">Avg CPC</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white">
                {computed.convRate.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-500">Conversion Rate</p>
            </div>
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-white">
                ${computed.cpl.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500">Cost Per Lead</p>
            </div>
          </div>

          {/* Benchmark comparison */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Metric</th>
                  <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Your Metric</th>
                  <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Benchmark</th>
                  <th className="text-left text-xs text-gray-500 font-medium pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800">
                  <td className="py-2.5 pr-4 text-gray-300 text-xs font-medium">Cost Per Lead</td>
                  <td className="py-2.5 pr-4 text-white text-xs font-bold">
                    {computed.cpl > 0 ? `$${computed.cpl.toFixed(0)}` : "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 text-xs">$75–$150</td>
                  <td className="py-2.5">
                    {computed.cpl > 0 ? (
                      <BenchmarkStatus value={computed.cpl} low={0} high={150} higherIsBetter={false} />
                    ) : <span className="text-xs text-gray-600">—</span>}
                  </td>
                </tr>
                <tr className="border-b border-gray-800">
                  <td className="py-2.5 pr-4 text-gray-300 text-xs font-medium">CTR</td>
                  <td className="py-2.5 pr-4 text-white text-xs font-bold">
                    {metrics.clicks && metrics.totalSpend ? `${computed.convRate.toFixed(1)}%` : "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 text-xs">6.37% avg</td>
                  <td className="py-2.5">
                    {computed.convRate > 0 ? (
                      <BenchmarkStatus value={computed.convRate} low={6.37} high={100} />
                    ) : <span className="text-xs text-gray-600">—</span>}
                  </td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 text-gray-300 text-xs font-medium">ROAS</td>
                  <td className="py-2.5 pr-4 text-white text-xs font-bold">
                    {metrics.roas ? `${parseFloat(metrics.roas).toFixed(1)}x` : "—"}
                  </td>
                  <td className="py-2.5 pr-4 text-gray-500 text-xs">3:1 minimum</td>
                  <td className="py-2.5">
                    {metrics.roas ? (
                      <BenchmarkStatus value={parseFloat(metrics.roas)} low={3} high={100} />
                    ) : <span className="text-xs text-gray-600">—</span>}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <button
            onClick={saveMetrics}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {metricsSaved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <DollarSign className="w-3.5 h-3.5" />}
            {metricsSaved ? "Saved!" : "Save Metrics"}
          </button>
        </section>

        {/* ── Section 7: Budget Planning ────────────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">Budget Planning</h2>
          <div className="space-y-3 mb-4">
            {MARKET_SIZES.map((m) => (
              <button
                key={m.key}
                onClick={() => setMarketSize(m.key)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  marketSize === m.key
                    ? "border-blue-500 bg-blue-500/10"
                    : "border-gray-700 hover:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full border-2 flex items-center justify-center ${
                      marketSize === m.key ? "border-blue-400" : "border-gray-600"
                    }`}
                  >
                    {marketSize === m.key && <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                  </div>
                  <span className="text-sm text-gray-200">{m.label}</span>
                </div>
                <span className="text-sm font-semibold text-white">{m.range}</span>
              </button>
            ))}
          </div>

          <label className="flex items-center gap-3 cursor-pointer group mb-4">
            <input
              type="checkbox"
              checked={peakSeason}
              onChange={(e) => setPeakSeason(e.target.checked)}
              className="w-4 h-4 rounded accent-amber-500"
            />
            <div>
              <span className="text-sm text-gray-200 group-hover:text-white transition-colors">
                Peak Season Adjustment
              </span>
              <span className="text-xs text-amber-400 ml-2">(+20-30%)</span>
            </div>
          </label>

          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-400" />
              <p className="text-sm font-semibold text-white">Recommended Budget</p>
            </div>
            <p className="text-xl font-bold text-blue-400">{budgetRange}</p>
            <p className="text-xs text-gray-500 mt-2">
              Add 20-30% during peak season proactively — don't wait until demand spikes. For restoration: peak = spring (flooding) and winter (frozen pipes).
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
