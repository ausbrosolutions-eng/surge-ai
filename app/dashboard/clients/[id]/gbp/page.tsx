"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle, CalendarDays, PlusCircle, X,
  Lightbulb, MessageSquare, BarChart3, CheckSquare2, ArrowLeft,
} from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressRing from "@/components/dashboard/ProgressRing";
import AlertBanner from "@/components/dashboard/AlertBanner";
import ChecklistItemRow from "@/components/dashboard/ChecklistItem";
import type { GBPPost } from "@/lib/types";

// ── Q&A pre-seeded items ─────────────────────────────────────
const SEEDED_QAS = [
  { id: "qa-1", q: "Do you offer emergency service?", a: "Yes, we offer 24/7 emergency response. Call us anytime." },
  { id: "qa-2", q: "Are you licensed and insured?", a: "Yes, we are fully licensed, bonded, and insured." },
  { id: "qa-3", q: "What areas do you serve?", a: "We serve [city/region]. Contact us to confirm your area." },
  { id: "qa-4", q: "Do you offer financing?", a: "Yes, we offer flexible financing options. Ask us for details." },
  { id: "qa-5", q: "Do you offer free estimates?", a: "Yes, we provide free estimates on all new projects." },
  { id: "qa-6", q: "How quickly can you respond?", a: "We typically respond within 1 hour during business hours." },
  { id: "qa-7", q: "Are your technicians background-checked?", a: "Yes, all our technicians pass background checks and drug screening." },
  { id: "qa-8", q: "What payment methods do you accept?", a: "We accept cash, check, and all major credit cards." },
];

// ── Seasonal post ideas by month ─────────────────────────────
function getSeasonalIdeas(month: number) {
  const ideas = [
    // Jan
    ["Heating system checks before the coldest stretch", "Carbon monoxide detector reminders", "Pipe freeze prevention tips"],
    // Feb
    ["Valentine's Day home comfort promo", "HVAC filter change reminder", "Plumbing inspection discount"],
    // Mar
    ["Spring tune-up special", "Check outdoor faucets after winter", "HVAC pre-season service deal"],
    // Apr
    ["Spring storm roof inspection", "AC pre-season checkup", "Spring cleaning tips for home systems"],
    // May
    ["AC start-up season is here", "Sump pump inspection post-spring rain", "Pre-summer maintenance bundles"],
    // Jun
    ["Keep cool — AC service deals", "Pest control seasonal alert", "Summer landscaping start-up"],
    // Jul
    ["Peak AC season — book early", "Energy savings tips for summer", "Storm prep for peak season"],
    // Aug
    ["Back-to-school HVAC filter sale", "Late summer roof check", "AC maintenance before fall"],
    // Sep
    ["Fall furnace tune-up season", "Gutter cleaning before leaves fall", "Pre-winter plumbing inspection"],
    // Oct
    ["Furnace service — don't wait", "Weatherization checklist post", "Carbon monoxide awareness month"],
    // Nov
    ["Holiday season pipe protection", "Black Friday service special", "Pre-winter HVAC checkup urgency"],
    // Dec
    ["Year-end service discount", "Holiday home safety tips", "New Year — upgrade your HVAC"],
  ];
  return ideas[month] ?? ideas[0];
}

// ── Mini calendar helpers ────────────────────────────────────
function getLast30Days() {
  const days: { date: string; label: number }[] = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    days.push({
      date: d.toISOString().split("T")[0],
      label: d.getDate(),
    });
  }
  return days;
}

function daysSinceLastPost(posts: GBPPost[]) {
  if (!posts.length) return null;
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const last = new Date(sorted[0].date);
  return Math.floor((Date.now() - last.getTime()) / 86400000);
}

// ── GBP Stats state shape ───────────────────────────────────
interface GBPStats {
  profileViews: string;
  websiteClicks: string;
  phoneCalls: string;
  directionRequests: string;
  photoViews: string;
}

export default function GBPPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { store, toggleChecklistItem, updateChecklistNotes, saveGBPPost, saveClient } = useStore();

  const client = store.clients.find((c) => c.id === clientId);
  const checklists = store.checklists[`${clientId}_gbp`] || [];
  const gbpPosts = store.gbpPosts.filter((p) => p.clientId === clientId);

  // Q&A added state (persisted per key in localStorage implicitly via store concept — here useState)
  const [qaAdded, setQaAdded] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(`${clientId}_gbp_qa`) || "{}");
    } catch { return {}; }
  });

  function toggleQA(id: string) {
    const next = { ...qaAdded, [id]: !qaAdded[id] };
    setQaAdded(next);
    if (typeof window !== "undefined") {
      localStorage.setItem(`${clientId}_gbp_qa`, JSON.stringify(next));
    }
  }

  // GBP Stats
  const [stats, setStats] = useState<GBPStats>(() => {
    if (typeof window === "undefined") return { profileViews: "", websiteClicks: "", phoneCalls: "", directionRequests: "", photoViews: "" };
    try {
      return JSON.parse(localStorage.getItem(`${clientId}_gbp_stats`) || "null") || { profileViews: "", websiteClicks: "", phoneCalls: "", directionRequests: "", photoViews: "" };
    } catch { return { profileViews: "", websiteClicks: "", phoneCalls: "", directionRequests: "", photoViews: "" }; }
  });
  const [statsSaved, setStatsSaved] = useState(false);

  function saveStats() {
    if (typeof window !== "undefined") {
      localStorage.setItem(`${clientId}_gbp_stats`, JSON.stringify(stats));
    }
    setStatsSaved(true);
    setTimeout(() => setStatsSaved(false), 1500);
  }

  // Post modal
  const [showPostModal, setShowPostModal] = useState(false);
  const [postForm, setPostForm] = useState({
    date: new Date().toISOString().split("T")[0],
    type: "whats_new" as GBPPost["type"],
    hasCTA: true,
    hasPhoto: true,
    title: "",
    notes: "",
  });

  function submitPost() {
    const newPost: GBPPost = {
      id: `gbp-${Date.now()}`,
      clientId,
      date: postForm.date,
      type: postForm.type,
      hasCTA: postForm.hasCTA,
      hasPhoto: postForm.hasPhoto,
      title: postForm.title,
      notes: postForm.notes,
    };
    saveGBPPost(newPost);
    setShowPostModal(false);
    setPostForm({ date: new Date().toISOString().split("T")[0], type: "whats_new", hasCTA: true, hasPhoto: true, title: "", notes: "" });
  }

  // Checklist groupings
  const groupedChecklists = useMemo(() => {
    const map: Record<string, typeof checklists> = {};
    checklists.forEach((item) => {
      if (!map[item.category]) map[item.category] = [];
      map[item.category].push(item);
    });
    return map;
  }, [checklists]);

  // Category progress
  function categoryProgress(items: typeof checklists) {
    if (!items.length) return 0;
    return Math.round((items.filter((i) => i.completed).length / items.length) * 100);
  }

  // Action items: top 3 incomplete critical/high priority
  const actionItems = useMemo(() => {
    return checklists
      .filter((i) => !i.completed && (i.priority === "critical" || i.priority === "high"))
      .slice(0, 3);
  }, [checklists]);

  // Calendar
  const last30Days = getLast30Days();
  const postedDates = new Set(gbpPosts.map((p) => p.date));
  const daysSince = daysSinceLastPost(gbpPosts);
  const currentMonth = new Date().getMonth();
  const seasonalIdeas = getSeasonalIdeas(currentMonth);

  const inputClass = "bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full";

  if (!client) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Client not found.</p>
      </div>
    );
  }

  const gbpScore = client.scores.gbp;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="GBP Optimization" selectedClient={client} />

      <main className="flex-1 p-6 space-y-6">
        {/* Back link */}
        <Link
          href={`/dashboard/clients/${clientId}`}
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to {client.businessName}
        </Link>

        {/* 2025 Alert banner */}
        <AlertBanner
          variant="warning"
          title="2025 Alert"
          message="No posts or photos in 30+ days = significant ranking drop. GBP freshness is now a direct AI ranking signal."
          dismissible
        />

        {/* Score + header */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex flex-wrap items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <ProgressRing score={gbpScore} size={100} strokeWidth={8} label="GBP" />
            <p className="text-xs text-gray-500">GBP Score</p>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h2 className="text-lg font-bold text-white">Google Business Profile</h2>
            <p className="text-sm text-gray-400 mt-1">
              Complete the checklist below to improve your GBP score and rank higher in Google Maps and AI search.
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
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                {checklists.filter((i) => !i.completed && i.priority === "critical").length} critical items
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Profile Completeness Checklist */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckSquare2 className="w-4 h-4 text-blue-400" />
            Profile Completeness Checklist
          </h3>

          {Object.entries(groupedChecklists).map(([category, items]) => {
            const pct = categoryProgress(items);
            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{category}</p>
                  <span className="text-xs text-gray-500">{pct}%</span>
                </div>
                {/* Category progress bar */}
                <div className="h-1 bg-gray-800 rounded-full overflow-hidden mb-2">
                  <motion.div
                    className={`h-full rounded-full ${pct >= 80 ? "bg-emerald-500" : pct >= 60 ? "bg-amber-500" : "bg-red-500"}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="space-y-2">
                  {items.map((item) => (
                    <ChecklistItemRow
                      key={item.id}
                      item={item}
                      onToggle={(id) => toggleChecklistItem(clientId, "gbp", id)}
                      onNoteChange={(id, notes) => updateChecklistNotes(clientId, "gbp", id, notes)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Section 2: Posts Tracker */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-emerald-400" />
              Posts Tracker
            </h3>
            <button
              onClick={() => setShowPostModal(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Log a Post
            </button>
          </div>

          {/* Days since last post */}
          {daysSince !== null ? (
            <div className="flex items-center gap-3">
              <div
                className={`text-3xl font-bold ${
                  daysSince > 7 ? "text-red-400" : daysSince > 3 ? "text-amber-400" : "text-emerald-400"
                }`}
              >
                {daysSince}
              </div>
              <div>
                <p className="text-sm text-gray-200">days since last post</p>
                <p className="text-xs text-gray-500">
                  {daysSince === 0 ? "Posted today — great!" : daysSince <= 3 ? "On track" : daysSince <= 7 ? "Post soon to maintain ranking" : "Overdue — post now!"}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500">No posts logged yet. Log your first post to start tracking.</p>
          )}

          {daysSince !== null && daysSince > 7 && (
            <AlertBanner
              variant="error"
              message={`It has been ${daysSince} days since the last GBP post. Google may reduce ranking visibility. Post today.`}
            />
          )}

          {/* 30-day calendar grid */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Last 30 Days</p>
            <div className="grid grid-cols-10 gap-1">
              {last30Days.map(({ date, label }) => {
                const posted = postedDates.has(date);
                const isToday = date === new Date().toISOString().split("T")[0];
                return (
                  <div
                    key={date}
                    title={`${date}${posted ? " — posted" : ""}`}
                    className={`aspect-square rounded flex items-center justify-center text-xs font-medium cursor-default transition-colors ${
                      isToday
                        ? "ring-2 ring-blue-500"
                        : ""
                    } ${
                      posted
                        ? "bg-emerald-500 text-white"
                        : "bg-gray-800 text-gray-600"
                    }`}
                  >
                    {label}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mt-2 text-xs text-gray-600">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-emerald-500 inline-block" /> Posted</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-800 inline-block" /> No post</span>
            </div>
          </div>

          {/* Post ideas */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              Seasonal Post Ideas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {seasonalIdeas.map((idea, i) => (
                <div key={i} className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-xs text-gray-300">
                  {idea}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Q&A / Ask Maps */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            Q&A / Ask Maps Tracker
          </h3>

          <AlertBanner
            variant="info"
            message="Google is replacing Q&A with 'Ask Maps' (Gemini AI). All answers must be consistent across your GBP, website, and reviews. Check consistency monthly."
          />

          <div className="space-y-2">
            {SEEDED_QAS.map((qa) => {
              const added = !!qaAdded[qa.id];
              return (
                <div
                  key={qa.id}
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    added ? "bg-emerald-500/5 border-emerald-500/20" : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <button
                    onClick={() => toggleQA(qa.id)}
                    className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all mt-0.5 ${
                      added ? "bg-emerald-500 border-emerald-500" : "border-gray-500 hover:border-emerald-500"
                    }`}
                  >
                    {added && <span className="text-white text-xs font-bold">✓</span>}
                  </button>
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${added ? "text-gray-500 line-through" : "text-gray-200"}`}>{qa.q}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{qa.a}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${added ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-gray-700 text-gray-500 border-gray-600"}`}>
                    {added ? "Added" : "Not Added"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Key Stats */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Key Stats (Monthly)
            </h3>
            {statsSaved && <span className="text-xs text-emerald-400">Saved!</span>}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { key: "profileViews" as const, label: "Profile Views" },
              { key: "websiteClicks" as const, label: "Website Clicks" },
              { key: "phoneCalls" as const, label: "Phone Calls" },
              { key: "directionRequests" as const, label: "Direction Requests" },
              { key: "photoViews" as const, label: "Photo Views" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs text-gray-500 mb-1">{label}</label>
                <input
                  type="number"
                  className={inputClass}
                  value={stats[key]}
                  placeholder="0"
                  onChange={(e) => setStats((s) => ({ ...s, [key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <button
            onClick={saveStats}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Save Stats
          </button>
        </div>

        {/* Section 5: Action Items */}
        {actionItems.length > 0 && (
          <div className="bg-gray-900 border border-amber-500/20 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Top Action Items
            </h3>
            <div className="space-y-3">
              {actionItems.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-gray-800 border border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <p className="text-sm font-semibold text-gray-200">{item.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border flex-shrink-0 ${
                      item.priority === "critical"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-orange-500/20 text-orange-400 border-orange-500/30"
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{item.description}</p>
                  <p className="text-xs text-gray-600 mt-2">+{item.scoreWeight} pts when complete</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Log Post Modal */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={(e) => { if (e.target === e.currentTarget) setShowPostModal(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white">Log a GBP Post</h3>
                <button onClick={() => setShowPostModal(false)} className="text-gray-500 hover:text-gray-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Post Date</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={postForm.date}
                    onChange={(e) => setPostForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Post Type</label>
                  <select
                    className={inputClass}
                    value={postForm.type}
                    onChange={(e) => setPostForm((f) => ({ ...f, type: e.target.value as GBPPost["type"] }))}
                  >
                    <option value="whats_new">What&apos;s New</option>
                    <option value="offer">Offer</option>
                    <option value="event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Post Title (optional)</label>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder="e.g. Fall Furnace Tune-Up Special"
                    value={postForm.title}
                    onChange={(e) => setPostForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postForm.hasCTA}
                      onChange={(e) => setPostForm((f) => ({ ...f, hasCTA: e.target.checked }))}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    <span className="text-sm text-gray-300">Has CTA</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={postForm.hasPhoto}
                      onChange={(e) => setPostForm((f) => ({ ...f, hasPhoto: e.target.checked }))}
                      className="w-4 h-4 rounded accent-blue-600"
                    />
                    <span className="text-sm text-gray-300">Has Photo</span>
                  </label>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Notes (optional)</label>
                  <textarea
                    className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 w-full resize-none"
                    rows={2}
                    value={postForm.notes}
                    onChange={(e) => setPostForm((f) => ({ ...f, notes: e.target.value }))}
                    placeholder="Any notes about this post..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-5">
                <button
                  onClick={submitPost}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  Save Post
                </button>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
