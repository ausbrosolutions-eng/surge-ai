"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck, ArrowLeft, BarChart3, DollarSign,
  TrendingUp, CheckSquare2, AlertTriangle,
} from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressRing from "@/components/dashboard/ProgressRing";
import AlertBanner from "@/components/dashboard/AlertBanner";
import ChecklistItemRow from "@/components/dashboard/ChecklistItem";

// ── LSA Ranking Factors ──────────────────────────────────────
type ServiceAreaFocus = "Tight" | "Medium" | "Broad";

interface RankingFactors {
  reviewScore: string;       // avg rating
  reviewQuantity: string;    // # new reviews last 30 days
  callResponseRate: string;  // % 0-100
  bookingRate: string;       // % 0-100
  serviceAreaFocus: ServiceAreaFocus;
  gbpLinked: boolean;
}

// ── Dummy sparkline data ──────────────────────────────────────
const DUMMY_WEEKS = [8, 12, 7, 15, 10, 18, 14, 20];
const WEEK_LABELS = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

function Sparkline({ data }: { data: number[] }) {
  const max = Math.max(...data, 1);
  const width = 280;
  const height = 60;
  const padX = 10;
  const padY = 8;
  const innerW = width - padX * 2;
  const innerH = height - padY * 2;
  const stepX = innerW / (data.length - 1);

  const points = data
    .map((v, i) => `${padX + i * stepX},${padY + innerH - (v / max) * innerH}`)
    .join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {data.map((v, i) => (
        <g key={i}>
          <circle
            cx={padX + i * stepX}
            cy={padY + innerH - (v / max) * innerH}
            r={3}
            fill="#3b82f6"
          />
          <text
            x={padX + i * stepX}
            y={height - 1}
            textAnchor="middle"
            fontSize={8}
            fill="#6b7280"
          >
            {WEEK_LABELS[i]}
          </text>
          <text
            x={padX + i * stepX}
            y={padY + innerH - (v / max) * innerH - 5}
            textAnchor="middle"
            fontSize={8}
            fill="#93c5fd"
          >
            {v}
          </text>
        </g>
      ))}
    </svg>
  );
}

// ── Verification status options ───────────────────────────────
type VerificationStatus = "Verified" | "Pending" | "Not Started";

const VERIFICATION_STYLES: Record<VerificationStatus, string> = {
  Verified: "bg-emerald-500 text-white",
  Pending: "bg-amber-500 text-white",
  "Not Started": "bg-gray-700 text-gray-300",
};

// ── Lead Performance shape ────────────────────────────────────
interface LeadPerf {
  budget: string;
  leadsReceived: string;
  leadsBooked: string;
}

export default function LSAPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { store, toggleChecklistItem, updateChecklistNotes } = useStore();

  const client = store.clients.find((c) => c.id === clientId);
  const checklists = store.checklists[`${clientId}_lsa`] || [];

  // Policy alert dismissed state
  const [policyDismissed, setPolicyDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(`${clientId}_lsa_policy_dismissed`) === "true";
  });

  function dismissPolicy() {
    setPolicyDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(`${clientId}_lsa_policy_dismissed`, "true");
    }
  }

  function markDisclosed() {
    setPolicyDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem(`${clientId}_lsa_policy_dismissed`, "true");
      localStorage.setItem(`${clientId}_lsa_policy_disclosed`, "true");
    }
  }

  // Verification status
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(() => {
    if (typeof window === "undefined") return "Not Started";
    return (localStorage.getItem(`${clientId}_lsa_verification`) as VerificationStatus) || "Not Started";
  });

  function updateVerification(v: VerificationStatus) {
    setVerificationStatus(v);
    if (typeof window !== "undefined") {
      localStorage.setItem(`${clientId}_lsa_verification`, v);
    }
  }

  // Ranking factors
  const [factors, setFactors] = useState<RankingFactors>(() => {
    if (typeof window === "undefined")
      return { reviewScore: "", reviewQuantity: "", callResponseRate: "", bookingRate: "", serviceAreaFocus: "Tight", gbpLinked: false };
    try {
      return JSON.parse(localStorage.getItem(`${clientId}_lsa_factors`) || "null") ||
        { reviewScore: "", reviewQuantity: "", callResponseRate: "", bookingRate: "", serviceAreaFocus: "Tight", gbpLinked: false };
    } catch {
      return { reviewScore: "", reviewQuantity: "", callResponseRate: "", bookingRate: "", serviceAreaFocus: "Tight", gbpLinked: false };
    }
  });

  function saveFactors(next: RankingFactors) {
    setFactors(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(`${clientId}_lsa_factors`, JSON.stringify(next));
    }
  }

  // Lead performance
  const [leadPerf, setLeadPerf] = useState<LeadPerf>(() => {
    if (typeof window === "undefined") return { budget: "", leadsReceived: "", leadsBooked: "" };
    try {
      return JSON.parse(localStorage.getItem(`${clientId}_lsa_lead_perf`) || "null") ||
        { budget: "", leadsReceived: "", leadsBooked: "" };
    } catch { return { budget: "", leadsReceived: "", leadsBooked: "" }; }
  });
  const [perfSaved, setPerfSaved] = useState(false);

  function saveLeadPerf() {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${clientId}_lsa_lead_perf`, JSON.stringify(leadPerf));
    }
    setPerfSaved(true);
    setTimeout(() => setPerfSaved(false), 1500);
  }

  // Monthly budget
  const [monthlyBudget, setMonthlyBudget] = useState(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem(`${clientId}_lsa_budget`) || "";
  });

  function saveMonthlyBudget(v: string) {
    setMonthlyBudget(v);
    if (typeof window !== "undefined") localStorage.setItem(`${clientId}_lsa_budget`, v);
  }

  // Computed
  const receivedNum = parseInt(leadPerf.leadsReceived) || 0;
  const bookedNum = parseInt(leadPerf.leadsBooked) || 0;
  const budgetNum = parseFloat(leadPerf.budget) || 0;

  const cpl = receivedNum > 0 ? (budgetNum / receivedNum).toFixed(2) : "—";
  const bookingRatePct = receivedNum > 0 ? Math.round((bookedNum / receivedNum) * 100) : null;

  function bookingRateColor(pct: number | null) {
    if (pct === null) return "text-gray-400";
    if (pct >= 70) return "text-emerald-400";
    if (pct >= 50) return "text-amber-400";
    return "text-red-400";
  }

  // Checklist groupings
  const verificationItems = useMemo(() =>
    checklists.filter((i) => i.category === "Verification"),
    [checklists]
  );
  const settingsItems = useMemo(() =>
    checklists.filter((i) => i.category === "Settings"),
    [checklists]
  );

  // Rating bar (0-10 scale)
  function RatingBar({ value, max = 10, color = "bg-blue-500" }: { value: number; max?: number; color?: string }) {
    const pct = Math.min(100, (value / max) * 100);
    return (
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        />
      </div>
    );
  }

  const inputClass = "bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full";

  if (!client) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Client not found.</p>
      </div>
    );
  }

  const lsaScore = client.scores.lsa;
  const gbpScore = client.scores.gbp;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="LSA Management" selectedClient={client} />

      <main className="flex-1 p-6 space-y-6">
        {/* Back */}
        <Link
          href={`/dashboard/clients/${clientId}`}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {client.businessName}
        </Link>

        {/* 2025 Policy Alert */}
        {!policyDismissed && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-300">2025 Policy Update</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                As of April 2025, Google updated their Terms of Service to claim ownership of advertiser content in LSAs, including the right to record and analyze all phone calls.
                You must disclose this to clients.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={markDisclosed}
                  className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Mark as Disclosed to Client
                </button>
                <button
                  onClick={dismissPolicy}
                  className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* LSA Score */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <ProgressRing score={lsaScore} size={100} strokeWidth={8} label="LSA" />
            <p className="text-xs text-gray-500">LSA Score</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-lg font-bold text-white">Local Service Ads</h2>
            <p className="text-sm text-gray-400 mt-1">
              LSA places your business above all Google Ads and organic results on a pay-per-lead model.
              Ranking is driven by reviews, response rate, and profile completeness.
            </p>
            <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                {checklists.filter((i) => i.completed).length} complete
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                {checklists.filter((i) => !i.completed).length} remaining
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Verification Status */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Verification Status
          </h3>

          {/* Status selector */}
          <div className="flex items-center gap-3">
            {(["Verified", "Pending", "Not Started"] as VerificationStatus[]).map((v) => (
              <button
                key={v}
                onClick={() => updateVerification(v)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                  verificationStatus === v
                    ? `${VERIFICATION_STYLES[v]} border-transparent scale-105`
                    : "bg-gray-800 text-gray-500 border-gray-700 hover:border-gray-600"
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          {verificationStatus === "Verified" && (
            <AlertBanner variant="success" message="Google Verified badge earned. This displays the Google guarantee to customers and boosts click-through rate." />
          )}
          {verificationStatus === "Pending" && (
            <AlertBanner variant="warning" message="Verification in progress. Ensure all documentation is submitted and background check is complete." />
          )}
          {verificationStatus === "Not Started" && (
            <AlertBanner variant="error" message="LSA verification not started. Without verification, your ads cannot run. Start the process in the LSA dashboard." />
          )}

          {/* Verification checklist */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Verification Checklist</p>
            {verificationItems.map((item) => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                onToggle={(id) => toggleChecklistItem(clientId, "lsa", id)}
                onNoteChange={(id, notes) => updateChecklistNotes(clientId, "lsa", id, notes)}
              />
            ))}
          </div>
        </div>

        {/* Section 2: LSA Ranking Factors */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            LSA Ranking Factors
          </h3>
          <p className="text-xs text-gray-500">Update these values monthly to track ranking health. These are the 7 core factors Google uses to rank your LSA.</p>

          <div className="space-y-5">
            {/* 1. Review Score */}
            <div className="flex items-center gap-4">
              <div className="w-48 flex-shrink-0">
                <p className="text-sm font-medium text-gray-200">Review Score</p>
                <p className="text-xs text-gray-500">Average star rating (target: 4.8+)</p>
              </div>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                className="w-24 bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
                placeholder="4.8"
                value={factors.reviewScore}
                onChange={(e) => saveFactors({ ...factors, reviewScore: e.target.value })}
              />
              <RatingBar
                value={parseFloat(factors.reviewScore) || 0}
                max={5}
                color={parseFloat(factors.reviewScore) >= 4.5 ? "bg-emerald-500" : parseFloat(factors.reviewScore) >= 4.0 ? "bg-amber-500" : "bg-red-500"}
              />
              <span className="text-xs text-gray-600 w-8 text-right">/5</span>
            </div>

            {/* 2. Review Quantity */}
            <div className="flex items-center gap-4">
              <div className="w-48 flex-shrink-0">
                <p className="text-sm font-medium text-gray-200">New Reviews (30 days)</p>
                <p className="text-xs text-gray-500">Target: 4+ per month</p>
              </div>
              <input
                type="number"
                min="0"
                className="w-24 bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
                placeholder="0"
                value={factors.reviewQuantity}
                onChange={(e) => saveFactors({ ...factors, reviewQuantity: e.target.value })}
              />
              <RatingBar
                value={Math.min(parseInt(factors.reviewQuantity) || 0, 10)}
                max={10}
                color={(parseInt(factors.reviewQuantity) || 0) >= 4 ? "bg-emerald-500" : "bg-amber-500"}
              />
              <span className="text-xs text-gray-600 w-8 text-right">qty</span>
            </div>

            {/* 3. Call Response Rate */}
            <div className="flex items-center gap-4">
              <div className="w-48 flex-shrink-0">
                <p className="text-sm font-medium text-gray-200">Call Response Rate</p>
                <p className="text-xs text-gray-500">Target: 90%+ (answer fast!)</p>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                className="w-24 bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
                placeholder="90"
                value={factors.callResponseRate}
                onChange={(e) => saveFactors({ ...factors, callResponseRate: e.target.value })}
              />
              <RatingBar
                value={parseFloat(factors.callResponseRate) || 0}
                max={100}
                color={(parseFloat(factors.callResponseRate) || 0) >= 90 ? "bg-emerald-500" : (parseFloat(factors.callResponseRate) || 0) >= 75 ? "bg-amber-500" : "bg-red-500"}
              />
              <span className="text-xs text-gray-600 w-8 text-right">%</span>
            </div>

            {/* 4. Profile Completeness (auto from GBP score) */}
            <div className="flex items-center gap-4">
              <div className="w-48 flex-shrink-0">
                <p className="text-sm font-medium text-gray-200">Profile Completeness</p>
                <p className="text-xs text-gray-500">Auto-pulled from GBP score</p>
              </div>
              <div className="w-24 text-center">
                <span className="text-2xl font-bold" style={{ color: gbpScore >= 80 ? "#10b981" : gbpScore >= 60 ? "#f59e0b" : "#ef4444" }}>
                  {gbpScore}
                </span>
              </div>
              <RatingBar
                value={gbpScore}
                max={100}
                color={gbpScore >= 80 ? "bg-emerald-500" : gbpScore >= 60 ? "bg-amber-500" : "bg-red-500"}
              />
              <span className="text-xs text-gray-600 w-8 text-right">/100</span>
            </div>

            {/* 5. Booking Rate */}
            <div className="flex items-center gap-4">
              <div className="w-48 flex-shrink-0">
                <p className="text-sm font-medium text-gray-200">Booking Rate</p>
                <p className="text-xs text-gray-500">Target: 80%+ (mark all leads)</p>
              </div>
              <input
                type="number"
                min="0"
                max="100"
                className="w-24 bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
                placeholder="80"
                value={factors.bookingRate}
                onChange={(e) => saveFactors({ ...factors, bookingRate: e.target.value })}
              />
              <RatingBar
                value={parseFloat(factors.bookingRate) || 0}
                max={100}
                color={(parseFloat(factors.bookingRate) || 0) >= 80 ? "bg-emerald-500" : (parseFloat(factors.bookingRate) || 0) >= 60 ? "bg-amber-500" : "bg-red-500"}
              />
              <span className="text-xs text-gray-600 w-8 text-right">%</span>
            </div>

            {/* 6. Service Area Focus */}
            <div className="flex items-center gap-4">
              <div className="w-48 flex-shrink-0">
                <p className="text-sm font-medium text-gray-200">Service Area Focus</p>
                <p className="text-xs text-gray-500">Tighter = better ranking</p>
              </div>
              <div className="flex gap-2">
                {(["Tight", "Medium", "Broad"] as ServiceAreaFocus[]).map((v) => (
                  <button
                    key={v}
                    onClick={() => saveFactors({ ...factors, serviceAreaFocus: v })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                      factors.serviceAreaFocus === v
                        ? "bg-blue-600 border-blue-500 text-white"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
              <RatingBar
                value={factors.serviceAreaFocus === "Tight" ? 10 : factors.serviceAreaFocus === "Medium" ? 6 : 3}
                max={10}
                color={factors.serviceAreaFocus === "Tight" ? "bg-emerald-500" : factors.serviceAreaFocus === "Medium" ? "bg-amber-500" : "bg-red-500"}
              />
            </div>

            {/* 7. GBP Integration */}
            <div className="flex items-center gap-4">
              <div className="w-48 flex-shrink-0">
                <p className="text-sm font-medium text-gray-200">GBP Integration</p>
                <p className="text-xs text-gray-500">Link GBP to sync reviews</p>
              </div>
              <button
                onClick={() => saveFactors({ ...factors, gbpLinked: !factors.gbpLinked })}
                className={`relative w-12 h-6 rounded-full transition-colors flex-shrink-0 ${factors.gbpLinked ? "bg-emerald-500" : "bg-gray-700"}`}
              >
                <motion.div
                  animate={{ x: factors.gbpLinked ? 24 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  className="absolute top-1 w-4 h-4 bg-white rounded-full shadow"
                />
              </button>
              <span className="text-sm text-gray-300">{factors.gbpLinked ? "Linked" : "Not Linked"}</span>
              <RatingBar
                value={factors.gbpLinked ? 10 : 0}
                max={10}
                color="bg-emerald-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: LSA Settings Checklist */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckSquare2 className="w-4 h-4 text-amber-400" />
            LSA Settings Checklist
          </h3>
          <div className="space-y-2">
            {settingsItems.map((item) => (
              <ChecklistItemRow
                key={item.id}
                item={item}
                onToggle={(id) => toggleChecklistItem(clientId, "lsa", id)}
                onNoteChange={(id, notes) => updateChecklistNotes(clientId, "lsa", id, notes)}
              />
            ))}
          </div>
        </div>

        {/* Section 4: Lead Performance */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Lead Performance (This Month)
            </h3>
            {perfSaved && <span className="text-xs text-emerald-400">Saved!</span>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Budget ($)</label>
              <input
                type="number"
                className={inputClass}
                placeholder="0"
                value={leadPerf.budget}
                onChange={(e) => setLeadPerf((p) => ({ ...p, budget: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Leads Received</label>
              <input
                type="number"
                className={inputClass}
                placeholder="0"
                value={leadPerf.leadsReceived}
                onChange={(e) => setLeadPerf((p) => ({ ...p, leadsReceived: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Leads Booked</label>
              <input
                type="number"
                className={inputClass}
                placeholder="0"
                value={leadPerf.leadsBooked}
                onChange={(e) => setLeadPerf((p) => ({ ...p, leadsBooked: e.target.value }))}
              />
            </div>
          </div>

          {/* Calculated metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <p className="text-xs text-gray-500">Cost Per Lead</p>
              </div>
              <p className="text-2xl font-bold text-white">
                {cpl === "—" ? "—" : `$${cpl}`}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">Target: &lt;$100</p>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">Booking Rate</p>
              <p className={`text-4xl font-bold leading-none ${bookingRateColor(bookingRatePct)}`}>
                {bookingRatePct !== null ? `${bookingRatePct}%` : "—"}
              </p>
              <p className="text-xs text-gray-600 mt-1">Target: 80%+</p>
              {bookingRatePct !== null && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Current</span>
                    <span>Target 80%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${bookingRateColor(bookingRatePct).replace("text-", "bg-")}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(bookingRatePct, 100)}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  {bookingRatePct < 80 && (
                    <p className="text-xs text-amber-400 mt-1.5">
                      {80 - bookingRatePct}% below target — mark all leads as booked/not booked
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={saveLeadPerf}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Save Performance Data
          </button>
        </div>

        {/* Section 5: Budget & Trends */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            Budget &amp; Trends
          </h3>

          <div className="flex items-center gap-4">
            <div className="w-48 flex-shrink-0">
              <label className="block text-xs text-gray-500 mb-1">Monthly Budget ($)</label>
              <input
                type="number"
                className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full"
                placeholder="0"
                value={monthlyBudget}
                onChange={(e) => saveMonthlyBudget(e.target.value)}
              />
            </div>
            {monthlyBudget && (
              <div className="text-xs text-gray-500">
                <p>Daily avg: <span className="text-gray-300 font-medium">${(parseFloat(monthlyBudget) / 30).toFixed(0)}/day</span></p>
                <p className="mt-0.5">Peak season: consider +20–30%</p>
              </div>
            )}
          </div>

          {/* Sparkline */}
          <div>
            <p className="text-xs text-gray-500 mb-3">Leads Last 8 Weeks (sample data)</p>
            <div className="overflow-x-auto">
              <Sparkline data={DUMMY_WEEKS} />
            </div>
          </div>

          <AlertBanner
            variant="info"
            message="Add 20–30% budget increase 2–3 weeks before peak season. Don't wait until demand spikes — algorithm needs ramp-up time."
          />
        </div>
      </main>
    </div>
  );
}
