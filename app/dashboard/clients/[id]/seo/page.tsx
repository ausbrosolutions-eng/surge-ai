"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
} from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressRing from "@/components/dashboard/ProgressRing";
import ChecklistItemRow from "@/components/dashboard/ChecklistItem";
import type { CitationEntry } from "@/lib/types";

// ── Keyword Rankings seed data ────────────────────────────────
const defaultKeywords = [
  { keyword: "water damage restoration Denver", position: 14, lastWeek: 18, change: 4 },
  { keyword: "emergency water damage Denver", position: 7, lastWeek: 9, change: 2 },
  { keyword: "mold remediation Denver CO", position: 22, lastWeek: 20, change: -2 },
  { keyword: "fire damage restoration Denver", position: 11, lastWeek: 11, change: 0 },
  { keyword: "basement flooding cleanup Denver", position: 19, lastWeek: 24, change: 5 },
  { keyword: "water damage restoration near me", position: 31, lastWeek: 35, change: 4 },
];

// ── City page checklist fields ────────────────────────────────
const cityChecks = [
  "Page Exists",
  "Unique Content",
  "Local Landmarks",
  "Google Map Embedded",
  "500+ Words",
];

// ── Time-to-results label ─────────────────────────────────────
function getTimeLabel(score: number): string {
  if (score < 30) return "6-12 months";
  if (score < 60) return "4-6 months";
  return "2-4 months";
}

// ── Tier label ────────────────────────────────────────────────
function tierLabel(t: 1 | 2 | 3) {
  if (t === 1) return "Tier 1";
  if (t === 2) return "Tier 2";
  return "Tier 3";
}

const statusOptions: CitationEntry["status"][] = [
  "not_started",
  "in_progress",
  "claimed",
  "optimized",
];

const statusLabel: Record<CitationEntry["status"], string> = {
  not_started: "Not Started",
  in_progress: "In Progress",
  claimed: "Claimed",
  optimized: "Optimized",
};

const statusColor: Record<CitationEntry["status"], string> = {
  not_started: "text-gray-500 bg-gray-800",
  in_progress: "text-yellow-400 bg-yellow-500/10",
  claimed: "text-blue-400 bg-blue-500/10",
  optimized: "text-emerald-400 bg-emerald-500/10",
};

type KeywordRow = {
  keyword: string;
  position: number;
  lastWeek: number;
  change: number;
};

export default function SEOPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const { store, toggleChecklistItem, updateChecklistNotes, updateCitation } = useStore();
  const client = store.clients.find((c) => c.id === clientId);
  const checklists = store.checklists[`${clientId}_seo`] || [];
  const citations: CitationEntry[] = store.citations[clientId] || [];

  // ── Tab state ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(1);

  // ── NAP state ─────────────────────────────────────────────
  const [napName, setNapName] = useState(client?.businessName ?? "");
  const [napAddress, setNapAddress] = useState(client?.address ?? "");
  const [napPhone, setNapPhone] = useState(client?.phone ?? "");
  const [napChecks, setNapChecks] = useState([false, false, false, false, false]);
  const [napSaved, setNapSaved] = useState(false);

  // ── Keywords ─────────────────────────────────────────────
  const [keywords, setKeywords] = useState<KeywordRow[]>(defaultKeywords);
  const [newKw, setNewKw] = useState("");

  // ── City page checks ──────────────────────────────────────
  const [cityChecksState, setCityChecksState] = useState<Record<string, boolean[]>>({});

  // ── Content brief modal ───────────────────────────────────
  const [briefCity, setBriefCity] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  // Load NAP from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(`blueprint_nap_${clientId}`);
      if (saved) {
        const d = JSON.parse(saved);
        setNapName(d.name ?? "");
        setNapAddress(d.address ?? "");
        setNapPhone(d.phone ?? "");
        setNapChecks(d.checks ?? [false, false, false, false, false]);
      }
    } catch {}
  }, [clientId]);

  // Load city checks from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(`blueprint_city_checks_${clientId}`);
      if (saved) setCityChecksState(JSON.parse(saved));
    } catch {}
  }, [clientId]);

  const saveNAP = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      `blueprint_nap_${clientId}`,
      JSON.stringify({ name: napName, address: napAddress, phone: napPhone, checks: napChecks })
    );
    setNapSaved(true);
    setTimeout(() => setNapSaved(false), 2000);
  };

  const toggleCityCheck = (city: string, idx: number) => {
    const current = cityChecksState[city] || [false, false, false, false, false];
    const updated = current.map((v, i) => (i === idx ? !v : v));
    const next = { ...cityChecksState, [city]: updated };
    setCityChecksState(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`blueprint_city_checks_${clientId}`, JSON.stringify(next));
    }
  };

  const addKeyword = () => {
    if (!newKw.trim()) return;
    setKeywords([...keywords, { keyword: newKw.trim(), position: 0, lastWeek: 0, change: 0 }]);
    setNewKw("");
  };

  // ── Citation helpers ──────────────────────────────────────
  const tierCitations = citations.filter((c) => c.tier === activeTab);
  const optimizedCount = citations.filter((c) => c.status === "optimized").length;

  const tierProgress = (tier: 1 | 2 | 3) => {
    const t = citations.filter((c) => c.tier === tier);
    if (!t.length) return 0;
    return Math.round((t.filter((c) => c.status === "optimized").length / t.length) * 100);
  };

  // ── Checklist grouped ─────────────────────────────────────
  const grouped = checklists.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof checklists>);

  // ── Content brief template ────────────────────────────────
  const briefTemplate = (city: string) => `# Content Brief: ${city} ${client?.trade ?? "Service"} Page

**Target URL:** /${client?.trade ?? "service"}-${city.toLowerCase().replace(/\s+/g, "-")}-${client?.state?.toLowerCase() ?? "co"}/

**Primary Keyword:** ${client?.trade ?? "restoration"} ${city}
**Secondary Keywords:** emergency ${client?.trade ?? "restoration"} ${city}, ${client?.trade ?? "restoration"} company ${city} CO

**Word Count Target:** 600-800 words (1,000+ for competitive markets)

**Required Sections:**
1. Hero Section — H1 with primary keyword + CTA
2. Why Choose Us in ${city} — local trust signals
3. Services We Offer in ${city}
4. Local Landmarks & Neighborhoods (e.g., mention well-known areas in ${city})
5. Recent Projects in ${city} (before/after photos)
6. ${city} Service Area Map (embed Google Map)
7. Customer Reviews from ${city} residents
8. FAQPage schema with 3-5 local questions

**Schema Required:** LocalBusiness, Service, FAQPage, AggregateRating

**Internal Links:** Link to homepage, each service page, and nearest city pages
**External Links:** Link to 1-2 authoritative local resources (city official site, local news)

**CTA:** "Call Now for Free Estimate in ${city}: ${client?.phone ?? ''}"`;

  const score = client?.scores.seo ?? 0;
  const serviceArea = client?.serviceArea ?? [];

  if (!client) return <div className="p-6 text-gray-400">Client not found.</div>;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Local SEO" selectedClient={client} />

      <main className="flex-1 p-6 space-y-6">

        {/* Score Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center gap-6">
          <ProgressRing score={score} size={100} strokeWidth={8} />
          <div>
            <h2 className="text-lg font-bold text-white">Local SEO Score</h2>
            <p className="text-sm text-gray-400 mt-1">
              Local SEO drives compounding organic returns — your highest long-term ROI channel.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <span className="text-xs text-gray-500">Estimated time to results:</span>
              <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                {getTimeLabel(score)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Section 1: Citation Building Tracker ─────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-700 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-white">Citation Building Tracker</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Build citations in order: Tier 1 → Tier 2 → Tier 3. Target 40+ authoritative citations.
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white">{optimizedCount}</p>
              <p className="text-xs text-gray-500">/ {citations.length} optimized</p>
            </div>
          </div>

          {/* Tier Progress Bars */}
          <div className="px-5 pt-4 grid grid-cols-3 gap-4">
            {([1, 2, 3] as const).map((tier) => (
              <div key={tier}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">{tierLabel(tier)}</span>
                  <span className="text-xs text-gray-500">{tierProgress(tier)}%</span>
                </div>
                <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${tierProgress(tier)}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-700 mt-4 px-5">
            {([1, 2, 3] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setActiveTab(tier)}
                className={`px-4 py-2 text-xs font-medium border-b-2 transition-colors ${
                  activeTab === tier
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-gray-500 hover:text-gray-300"
                }`}
              >
                {tierLabel(tier)} ({citations.filter((c) => c.tier === tier).length} platforms)
              </button>
            ))}
          </div>

          {/* Citation rows */}
          <div className="divide-y divide-gray-700/50">
            {tierCitations.map((citation) => (
              <div key={citation.platform} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 font-medium truncate">{citation.platform}</p>
                </div>
                <select
                  value={citation.status}
                  onChange={(e) =>
                    updateCitation(clientId, citation.platform, {
                      status: e.target.value as CitationEntry["status"],
                    })
                  }
                  className={`text-xs px-2 py-1 rounded-lg border border-gray-600 bg-gray-900 focus:outline-none focus:border-blue-500 cursor-pointer ${statusColor[citation.status]}`}
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {statusLabel[s]}
                    </option>
                  ))}
                </select>
                <label className="flex items-center gap-1.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={citation.napVerified}
                    onChange={(e) =>
                      updateCitation(clientId, citation.platform, { napVerified: e.target.checked })
                    }
                    className="w-3.5 h-3.5 rounded accent-emerald-500 cursor-pointer"
                  />
                  <span className="text-xs text-gray-500 group-hover:text-gray-300 transition-colors whitespace-nowrap">
                    NAP Verified
                  </span>
                </label>
              </div>
            ))}
            {tierCitations.length === 0 && (
              <div className="px-5 py-8 text-center text-gray-600 text-sm">
                No citations for this tier yet.
              </div>
            )}
          </div>
        </section>

        {/* ── Section 2: NAP Consistency Checker ───────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-1">NAP Consistency Checker</h2>
          <p className="text-xs text-gray-500 mb-4">
            Every listing must use IDENTICAL formatting. Even "Ave" vs "Avenue" creates inconsistency.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Business Name (Master)</label>
              <input
                type="text"
                value={napName}
                onChange={(e) => setNapName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Exact legal business name"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Address (Master)</label>
              <input
                type="text"
                value={napAddress}
                onChange={(e) => setNapAddress(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="123 Commerce Dr, Denver, CO 80201"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phone (Master)</label>
              <input
                type="text"
                value={napPhone}
                onChange={(e) => setNapPhone(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                placeholder="(720) 555-0192"
              />
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {[
              "Phone format is consistent (dashes vs dots vs parentheses)",
              "Street abbreviation consistent (St vs Street, Ave vs Avenue)",
              "Suite/Unit format consistent (#2 vs Suite 2 vs Ste 2)",
              "Business name capitalization matches everywhere",
              "State spelled out or abbreviated consistently (CO vs Colorado)",
            ].map((label, i) => (
              <label key={i} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={napChecks[i]}
                  onChange={(e) => {
                    const next = napChecks.map((v, idx) => (idx === i ? e.target.checked : v));
                    setNapChecks(next);
                  }}
                  className="w-4 h-4 rounded accent-emerald-500"
                />
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
              </label>
            ))}
          </div>
          <button
            onClick={saveNAP}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            {napSaved ? <Check className="w-3.5 h-3.5" /> : null}
            {napSaved ? "Saved!" : "Save NAP"}
          </button>
        </section>

        {/* ── Section 3: On-Page SEO Checklist ─────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-4">On-Page SEO Checklist</h2>
          <div className="space-y-5">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  {category}
                </p>
                <div className="space-y-1.5">
                  {items.map((item) => (
                    <ChecklistItemRow
                      key={item.id}
                      item={item}
                      onToggle={(id) => toggleChecklistItem(clientId, "seo", id)}
                      onNoteChange={(id, notes) => updateChecklistNotes(clientId, "seo", id, notes)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {checklists.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Checklist items will appear after the store initializes.
              </p>
            )}
          </div>
        </section>

        {/* ── Section 4: Service Area Pages ────────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h2 className="text-base font-semibold text-white mb-1">Service Area Pages</h2>
          <p className="text-xs text-gray-500 mb-4">
            Each city needs a unique landing page. Never copy-paste with just the city name swapped — Google penalizes thin pages.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceArea.map((city) => {
              const checks = cityChecksState[city] || [false, false, false, false, false];
              const completedCount = checks.filter(Boolean).length;
              const isIncomplete = completedCount < 5;
              return (
                <div
                  key={city}
                  className={`border rounded-xl p-4 ${
                    isIncomplete
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-emerald-500/30 bg-emerald-500/5"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className={`w-4 h-4 ${isIncomplete ? "text-red-400" : "text-emerald-400"}`} />
                      <span className="text-sm font-semibold text-white">{city}</span>
                      {isIncomplete && (
                        <span className="text-xs text-red-400 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                          Incomplete
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setBriefCity(city)}
                      className="text-xs text-blue-400 hover:text-blue-300 underline"
                    >
                      Content Brief
                    </button>
                  </div>
                  <div className="grid grid-cols-1 gap-1.5">
                    {cityChecks.map((label, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checks[i] ?? false}
                          onChange={() => toggleCityCheck(city, i)}
                          className="w-3.5 h-3.5 rounded accent-emerald-500"
                        />
                        <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isIncomplete ? "bg-red-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${(completedCount / 5) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 5: Keyword Rankings ──────────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Keyword Rankings</h2>
              <p className="text-xs text-gray-500 mt-0.5">Track your target keywords week over week.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Keyword</th>
                  <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Position</th>
                  <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Last Week</th>
                  <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Change</th>
                  <th className="text-left text-xs text-gray-500 font-medium pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {keywords.map((kw, i) => (
                  <tr key={i} className="border-b border-gray-800 hover:bg-gray-800/50">
                    <td className="py-2.5 pr-4 text-gray-200 text-xs font-medium">{kw.keyword}</td>
                    <td className="py-2.5 pr-4">
                      <span className="text-white font-bold text-sm">#{kw.position || "—"}</span>
                    </td>
                    <td className="py-2.5 pr-4 text-gray-400 text-xs">
                      {kw.lastWeek ? `#${kw.lastWeek}` : "—"}
                    </td>
                    <td className="py-2.5 pr-4">
                      {kw.change > 0 ? (
                        <span className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                          <TrendingUp className="w-3 h-3" />+{kw.change}
                        </span>
                      ) : kw.change < 0 ? (
                        <span className="flex items-center gap-1 text-red-400 text-xs font-medium">
                          <TrendingDown className="w-3 h-3" />{kw.change}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 text-xs">
                          <Minus className="w-3 h-3" />0
                        </span>
                      )}
                    </td>
                    <td className="py-2.5">
                      {kw.position > 0 && kw.position <= 10 ? (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Page 1
                        </span>
                      ) : kw.position > 10 && kw.position <= 20 ? (
                        <span className="text-xs text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                          Page 2
                        </span>
                      ) : kw.position > 20 ? (
                        <span className="text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                          Page 3+
                        </span>
                      ) : (
                        <span className="text-xs text-gray-600">Not tracked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Add keyword row */}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              value={newKw}
              onChange={(e) => setNewKw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addKeyword()}
              placeholder="Add keyword (e.g., plumber Denver CO)"
              className="flex-1 bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={addKeyword}
              className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </div>
        </section>
      </main>

      {/* Content Brief Modal */}
      <AnimatePresence>
        {briefCity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setBriefCity(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">
                  Content Brief — {briefCity}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(briefTemplate(briefCity));
                      setCopiedBrief(true);
                      setTimeout(() => setCopiedBrief(false), 2000);
                    }}
                    className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    {copiedBrief ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBrief ? "Copied!" : "Copy Brief"}
                  </button>
                  <button
                    onClick={() => setBriefCity(null)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-mono bg-gray-950 rounded-xl p-4 border border-gray-800">
                {briefTemplate(briefCity)}
              </pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
