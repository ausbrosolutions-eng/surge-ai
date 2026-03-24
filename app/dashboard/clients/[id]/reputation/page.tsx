"use client";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, Plus, X, Star, TrendingUp, TrendingDown, Minus, AlertTriangle, MessageSquare } from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressRing from "@/components/dashboard/ProgressRing";
import type { ReviewEntry, ReviewPlatformStats } from "@/lib/types";

// ── Platform config ───────────────────────────────────────────
const PLATFORMS: { key: ReviewPlatformStats["platform"]; label: string; icon: string; color: string }[] = [
  { key: "google", label: "Google", icon: "🔵", color: "text-blue-400" },
  { key: "yelp", label: "Yelp", icon: "🔴", color: "text-red-400" },
  { key: "angi", label: "Angi", icon: "🟠", color: "text-orange-400" },
  { key: "facebook", label: "Facebook", icon: "📘", color: "text-blue-500" },
  { key: "bbb", label: "BBB", icon: "🔵", color: "text-sky-400" },
];

// ── Review generation steps ───────────────────────────────────
const STEPS = [
  {
    num: 1,
    title: "Job Completed",
    subtitle: "Trigger Point",
    description: "Technician completes the job. Customer expresses satisfaction.",
    tool: "Field trigger — verbal cue from tech",
    type: "trigger" as const,
    content: null,
  },
  {
    num: 2,
    title: "Verbal Ask",
    subtitle: "At the Job Site",
    description: "Tech delivers the verbal ask script directly to the customer.",
    tool: "Script card in truck / mobile device",
    type: "script" as const,
    content: `"[First Name], before I head out — if you're happy with the work today, would you mind leaving us a quick Google review? It really helps our small business and only takes about 60 seconds. I'll send you the link right now."`,
  },
  {
    num: 3,
    title: "SMS — Within 2 Hours",
    subtitle: "High-Conversion Window",
    description: "Send the SMS within 2 hours of job completion. This window has dramatically higher conversion than next-day sends.",
    tool: "Podium / Birdeye / NiceJob — set up automation trigger",
    type: "template" as const,
    content: `Hi [Name]! It was great working at your home today. If you're happy with the service, we'd really appreciate a quick Google review — it means the world to a local business like ours. Takes less than 60 seconds: [GOOGLE_REVIEW_LINK]\n\nThank you! — [Tech Name] @ [Business Name]`,
  },
  {
    num: 4,
    title: "Email Follow-Up — 48 Hours",
    subtitle: "If No Review Yet",
    description: "Send a follow-up email if no review within 48 hours.",
    tool: "GoHighLevel / Zapier automation",
    type: "template" as const,
    content: `Subject: Did we earn a 5-star review, [Name]?\n\nHi [Name],\n\nWe recently completed [service type] at your home and hope everything is working perfectly. If you were happy with our team's work, we'd love a quick Google review. It helps other homeowners in [city] find a company they can trust.\n\n→ Leave a review: [GOOGLE_REVIEW_LINK]\n\nTakes under 60 seconds. Thank you!\n\n[Business Name]\n[Phone]`,
  },
  {
    num: 5,
    title: "Final SMS — 5 Days",
    subtitle: "Last Follow-Up",
    description: "One final reminder at day 5. After this, do not follow up again — multiple asks feel pushy.",
    tool: "GoHighLevel automation / manual send",
    type: "template" as const,
    content: `Hi [Name] — last thing! If you found our service valuable, a Google review would go a long way. We truly appreciate it: [GOOGLE_REVIEW_LINK]\n\nEither way, thanks for choosing [Business Name]! 🙏`,
  },
];

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-3.5 h-3.5 ${s <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`}
        />
      ))}
    </div>
  );
}

export default function ReputationPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const { store, saveReview, updateReviewStats } = useStore();
  const client = store.clients.find((c) => c.id === clientId);
  const reviews = store.reviews.filter((r) => r.clientId === clientId);
  const reviewStats: ReviewPlatformStats[] = store.reviewStats[clientId] || [];

  // ── Review generation system active ──────────────────────
  const [systemActive, setSystemActive] = useState(() => {
    if (typeof window === "undefined") return true;
    try {
      const v = window.localStorage.getItem(`blueprint_review_system_${clientId}`);
      return v !== null ? JSON.parse(v) : true;
    } catch { return true; }
  });

  const toggleSystem = () => {
    const next = !systemActive;
    setSystemActive(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`blueprint_review_system_${clientId}`, JSON.stringify(next));
    }
  };

  // ── Copy state ────────────────────────────────────────────
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  // ── Review log filters ────────────────────────────────────
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [filterStars, setFilterStars] = useState<string>("all");
  const [filterResponded, setFilterResponded] = useState<string>("all");

  // ── Add review modal ──────────────────────────────────────
  const [showAddReview, setShowAddReview] = useState(false);
  const [newReview, setNewReview] = useState<Partial<ReviewEntry>>({
    platform: "google",
    rating: 5,
    reviewerName: "",
    reviewText: "",
    datePosted: new Date().toISOString().split("T")[0],
    responded: false,
    sentiment: "positive",
  });

  // ── Respond modal ─────────────────────────────────────────
  const [respondingTo, setRespondingTo] = useState<ReviewEntry | null>(null);
  const [responseText, setResponseText] = useState("");

  // ── Inline stat editing ───────────────────────────────────
  const [editingStats, setEditingStats] = useState<Record<string, Partial<ReviewPlatformStats>>>({});

  const saveStatEdit = (platform: string) => {
    const edits = editingStats[platform];
    if (!edits) return;
    updateReviewStats(clientId, platform, edits);
    setEditingStats((prev) => {
      const next = { ...prev };
      delete next[platform];
      return next;
    });
  };

  // ── Computed metrics ──────────────────────────────────────
  const avgGoogleRating = useMemo(() => {
    const g = reviewStats.find((s) => s.platform === "google");
    return g?.rating ?? 0;
  }, [reviewStats]);

  const totalReviews = useMemo(() => {
    return reviewStats.reduce((sum, s) => sum + s.totalReviews, 0);
  }, [reviewStats]);

  const respondedCount = reviews.filter((r) => r.responded).length;
  const responseRate = reviews.length ? Math.round((respondedCount / reviews.length) * 100) : 0;

  const score = client?.scores.reputation ?? 0;

  // ── Review log filtering ──────────────────────────────────
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (filterPlatform !== "all" && r.platform !== filterPlatform) return false;
      if (filterStars !== "all" && r.rating !== parseInt(filterStars)) return false;
      if (filterResponded === "responded" && !r.responded) return false;
      if (filterResponded === "not_responded" && r.responded) return false;
      return true;
    });
  }, [reviews, filterPlatform, filterStars, filterResponded]);

  // ── Velocity data (last 8 weeks) ──────────────────────────
  const weeklyVelocity = useMemo(() => {
    const weeks: number[] = Array(8).fill(0);
    const now = new Date();
    reviews.forEach((r) => {
      const posted = new Date(r.datePosted);
      const diffMs = now.getTime() - posted.getTime();
      const diffWeeks = Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
      if (diffWeeks >= 0 && diffWeeks < 8) {
        weeks[7 - diffWeeks]++;
      }
    });
    return weeks;
  }, [reviews]);

  const latestReview = reviews.length
    ? reviews.sort((a, b) => new Date(b.datePosted).getTime() - new Date(a.datePosted).getTime())[0]
    : null;
  const daysSinceLastReview = latestReview
    ? Math.floor((Date.now() - new Date(latestReview.datePosted).getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  const saveReviewEntry = () => {
    const entry: ReviewEntry = {
      id: `rev-${Date.now()}`,
      clientId,
      platform: (newReview.platform as ReviewEntry["platform"]) || "google",
      rating: newReview.rating ?? 5,
      reviewerName: newReview.reviewerName || "Anonymous",
      reviewText: newReview.reviewText || "",
      datePosted: newReview.datePosted || new Date().toISOString(),
      responded: false,
      sentiment:
        (newReview.rating ?? 5) >= 4 ? "positive" : (newReview.rating ?? 5) === 3 ? "neutral" : "negative",
    };
    saveReview(entry);
    setShowAddReview(false);
    setNewReview({ platform: "google", rating: 5, reviewerName: "", reviewText: "", datePosted: new Date().toISOString().split("T")[0], responded: false, sentiment: "positive" });
  };

  const submitResponse = () => {
    if (!respondingTo) return;
    saveReview({
      ...respondingTo,
      responded: true,
      responseText,
      responseDate: new Date().toISOString(),
    });
    setRespondingTo(null);
    setResponseText("");
  };

  const negativeTemplate = (name: string) =>
    `Thank you for sharing your experience, ${name}. We're sorry to hear this didn't meet your expectations. We take all feedback seriously and would like to make this right. Please reach out at ${client?.phone ?? "[phone]"} so we can address this personally.`;

  const positiveTemplate = (name: string) =>
    `Thank you so much, ${name}! We're thrilled to hear you had a great experience with our team. It means the world to a local business like ours when customers take the time to share their feedback. We look forward to serving you again!`;

  const maxBar = Math.max(...weeklyVelocity, 1);

  if (!client) return <div className="p-6 text-gray-400">Client not found.</div>;

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Reputation Management" selectedClient={client} />

      <main className="flex-1 p-6 space-y-6">

        {/* ── Score Header ──────────────────────────────────────── */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center gap-6">
          <ProgressRing score={score} size={100} strokeWidth={8} />
          <div className="flex-1">
            <h2 className="text-lg font-bold text-white">Reputation Score</h2>
            <p className="text-sm text-gray-400 mt-1">
              88% of consumers read reviews before contacting a business. A 1-star Yelp increase = 5-9% revenue increase.
            </p>
            <div className="flex items-center gap-4 mt-3">
              <div className="text-center">
                <p className="text-xl font-bold text-yellow-400">{avgGoogleRating.toFixed(1)}</p>
                <p className="text-xs text-gray-500">Google Rating</p>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div className="text-center">
                <p className="text-xl font-bold text-white">{totalReviews}</p>
                <p className="text-xs text-gray-500">Total Reviews</p>
              </div>
              <div className="w-px h-8 bg-gray-700" />
              <div className="text-center">
                <p className={`text-xl font-bold ${responseRate >= 90 ? "text-emerald-400" : responseRate >= 70 ? "text-amber-400" : "text-red-400"}`}>
                  {responseRate}%
                </p>
                <p className="text-xs text-gray-500">Response Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section 1: Review Platform Stats ─────────────────── */}
        <section>
          <h2 className="text-base font-semibold text-white mb-3">Review Platform Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
            {PLATFORMS.map((p) => {
              const stat = reviewStats.find((s) => s.platform === p.key);
              const editing = editingStats[p.key] || {};
              const trend =
                (stat?.newThisMonth ?? 0) >= 2
                  ? "up"
                  : (stat?.newThisMonth ?? 0) === 1
                  ? "flat"
                  : "down";
              return (
                <div key={p.key} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">{p.icon}</span>
                    <p className="text-sm font-semibold text-white">{p.label}</p>
                    {trend === "up" && <TrendingUp className="w-3 h-3 text-emerald-400 ml-auto" />}
                    {trend === "flat" && <Minus className="w-3 h-3 text-amber-400 ml-auto" />}
                    {trend === "down" && <TrendingDown className="w-3 h-3 text-red-400 ml-auto" />}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-600">Rating</label>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        step="0.1"
                        value={editing.rating ?? stat?.rating ?? 0}
                        onChange={(e) =>
                          setEditingStats((prev) => ({
                            ...prev,
                            [p.key]: { ...prev[p.key], rating: parseFloat(e.target.value) },
                          }))
                        }
                        onBlur={() => saveStatEdit(p.key)}
                        className="w-full bg-gray-900 border border-gray-700 rounded text-xs text-gray-200 px-2 py-1 focus:outline-none focus:border-blue-500 mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">Total Reviews</label>
                      <input
                        type="number"
                        min="0"
                        value={editing.totalReviews ?? stat?.totalReviews ?? 0}
                        onChange={(e) =>
                          setEditingStats((prev) => ({
                            ...prev,
                            [p.key]: { ...prev[p.key], totalReviews: parseInt(e.target.value) },
                          }))
                        }
                        onBlur={() => saveStatEdit(p.key)}
                        className="w-full bg-gray-900 border border-gray-700 rounded text-xs text-gray-200 px-2 py-1 focus:outline-none focus:border-blue-500 mt-0.5"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-600">New This Month</label>
                      <input
                        type="number"
                        min="0"
                        value={editing.newThisMonth ?? stat?.newThisMonth ?? 0}
                        onChange={(e) =>
                          setEditingStats((prev) => ({
                            ...prev,
                            [p.key]: { ...prev[p.key], newThisMonth: parseInt(e.target.value) },
                          }))
                        }
                        onBlur={() => saveStatEdit(p.key)}
                        className="w-full bg-gray-900 border border-gray-700 rounded text-xs text-gray-200 px-2 py-1 focus:outline-none focus:border-blue-500 mt-0.5"
                      />
                    </div>
                  </div>
                  <StarDisplay rating={editing.rating ?? stat?.rating ?? 0} />
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Section 2: Review Generation System ──────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-white">Review Generation System</h2>
              <p className="text-xs text-gray-500 mt-0.5">5-step automated review funnel</p>
            </div>
            <button
              onClick={toggleSystem}
              className={`flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-lg border transition-all ${
                systemActive
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-gray-700 border-gray-600 text-gray-400"
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${systemActive ? "bg-emerald-400" : "bg-gray-500"}`}
              />
              {systemActive ? "Active" : "Inactive"}
            </button>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="absolute left-5 top-10 bottom-10 w-px bg-gray-700 z-0" />

            <div className="space-y-4 relative z-10">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex gap-4"
                >
                  {/* Step number */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                      step.type === "trigger"
                        ? "bg-gray-900 border-gray-600 text-gray-400"
                        : "bg-blue-500/10 border-blue-500/30 text-blue-400"
                    }`}
                  >
                    {step.num}
                  </div>

                  <div className="flex-1 bg-gray-900/60 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-semibold text-white">{step.title}</p>
                        <p className="text-xs text-blue-400">{step.subtitle}</p>
                        <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          Tool: <span className="text-gray-500">{step.tool}</span>
                        </p>
                      </div>
                      {step.content && (
                        <button
                          onClick={() => copy(step.content!, i)}
                          className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 px-2.5 py-1.5 rounded-lg transition-colors flex-shrink-0 ml-2"
                        >
                          {copiedIdx === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {copiedIdx === i ? "Copied!" : "Copy"}
                        </button>
                      )}
                    </div>
                    {step.content && (
                      <pre className="mt-3 text-xs text-gray-400 whitespace-pre-wrap leading-relaxed font-sans bg-gray-950 rounded-lg p-3 border border-gray-800">
                        {step.content}
                      </pre>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Section 3: Review Log ─────────────────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Review Log</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {reviews.filter((r) => !r.responded).length} reviews need a response
              </p>
            </div>
            <button
              onClick={() => setShowAddReview(true)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Review
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-300 px-2 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Platforms</option>
              {PLATFORMS.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
            <select
              value={filterStars}
              onChange={(e) => setFilterStars(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-300 px-2 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Ratings</option>
              {[5, 4, 3, 2, 1].map((s) => (
                <option key={s} value={s}>{s} Stars</option>
              ))}
            </select>
            <select
              value={filterResponded}
              onChange={(e) => setFilterResponded(e.target.value)}
              className="bg-gray-900 border border-gray-600 rounded-lg text-xs text-gray-300 px-2 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="responded">Responded</option>
              <option value="not_responded">Needs Response</option>
            </select>
          </div>

          <div className="space-y-2">
            {filteredReviews.map((review) => (
              <div
                key={review.id}
                className={`bg-gray-900/60 border rounded-xl p-4 ${
                  !review.responded ? "border-red-500/20" : "border-gray-700/50"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-sm text-white font-medium">{review.reviewerName}</span>
                      <span className="text-xs text-gray-500 capitalize">{review.platform}</span>
                      <StarDisplay rating={review.rating} />
                      <span className="text-xs text-gray-600">
                        {new Date(review.datePosted).toLocaleDateString()}
                      </span>
                      {!review.responded && (
                        <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Needs Response
                        </span>
                      )}
                      {review.responded && (
                        <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          Responded
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{review.reviewText}</p>
                    {review.responded && review.responseText && (
                      <div className="mt-2 pl-3 border-l border-gray-700">
                        <p className="text-xs text-gray-500 italic">{review.responseText}</p>
                      </div>
                    )}
                  </div>
                  {!review.responded && (
                    <button
                      onClick={() => {
                        setRespondingTo(review);
                        setResponseText(
                          review.rating <= 2
                            ? negativeTemplate(review.reviewerName)
                            : positiveTemplate(review.reviewerName)
                        );
                      }}
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                    >
                      <MessageSquare className="w-3 h-3" />
                      Respond
                    </button>
                  )}
                </div>
              </div>
            ))}
            {filteredReviews.length === 0 && (
              <p className="text-sm text-gray-600 text-center py-8">No reviews match the current filters.</p>
            )}
          </div>
        </section>

        {/* ── Section 4: Velocity Tracker ───────────────────────── */}
        <section className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-white">Review Velocity Tracker</h2>
              <p className="text-xs text-gray-500 mt-0.5">Goal: 1–2 new Google reviews per week</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-bold text-white">{weeklyVelocity[7]}</p>
                <p className="text-xs text-gray-500">This Week</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">
                  {weeklyVelocity.slice(4).reduce((a, b) => a + b, 0)}
                </p>
                <p className="text-xs text-gray-500">This Month</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-white">{reviews.length}</p>
                <p className="text-xs text-gray-500">All Time</p>
              </div>
            </div>
          </div>

          {daysSinceLastReview >= 14 && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-300">
                No new reviews in {daysSinceLastReview} days — review velocity impacts LSA rankings. Activate your review generation system.
              </p>
            </div>
          )}

          {/* Bar chart */}
          <div className="flex items-end gap-2 h-28">
            {weeklyVelocity.map((count, i) => {
              const weekLabel = i === 7 ? "This wk" : `${7 - i}w ago`;
              const barHeight = maxBar > 0 ? Math.max((count / maxBar) * 80, count > 0 ? 8 : 0) : 0;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-gray-400 font-medium">{count || ""}</span>
                  <div className="w-full flex items-end justify-center" style={{ height: 80 }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: barHeight }}
                      transition={{ duration: 0.6, delay: i * 0.05 }}
                      className={`w-full rounded-t ${
                        i === 7 ? "bg-blue-500" : count >= 2 ? "bg-emerald-500" : count === 1 ? "bg-amber-500/70" : "bg-gray-700"
                      }`}
                      style={{ minHeight: count > 0 ? 4 : 0 }}
                    />
                  </div>
                  <span className="text-xs text-gray-600 whitespace-nowrap" style={{ fontSize: "9px" }}>
                    {weekLabel}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span className="text-xs text-gray-500">On target (2+)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-500/70" />
              <span className="text-xs text-gray-500">Below target (1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-gray-700" />
              <span className="text-xs text-gray-500">No reviews</span>
            </div>
          </div>
        </section>
      </main>

      {/* ── Add Review Modal ──────────────────────────────────────── */}
      <AnimatePresence>
        {showAddReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setShowAddReview(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Add Review</h3>
                <button onClick={() => setShowAddReview(false)} className="text-gray-500 hover:text-gray-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Platform</label>
                    <select
                      value={newReview.platform}
                      onChange={(e) => setNewReview({ ...newReview, platform: e.target.value as ReviewEntry["platform"] })}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                    >
                      {PLATFORMS.map((p) => <option key={p.key} value={p.key}>{p.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Rating</label>
                    <select
                      value={newReview.rating}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                      className="w-full bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                    >
                      {[5, 4, 3, 2, 1].map((s) => <option key={s} value={s}>{s} Stars</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Reviewer Name</label>
                  <input
                    type="text"
                    value={newReview.reviewerName}
                    onChange={(e) => setNewReview({ ...newReview, reviewerName: e.target.value })}
                    placeholder="Jane D."
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Review Text</label>
                  <textarea
                    value={newReview.reviewText}
                    onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                    rows={3}
                    placeholder="What did the customer say?"
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 px-3 py-2 resize-none focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Date Posted</label>
                  <input
                    type="date"
                    value={newReview.datePosted?.split("T")[0]}
                    onChange={(e) => setNewReview({ ...newReview, datePosted: e.target.value })}
                    className="w-full bg-gray-800 border border-gray-600 rounded-lg text-sm text-gray-200 px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <button
                  onClick={saveReviewEntry}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
                >
                  Save Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Respond Modal ─────────────────────────────────────────── */}
      <AnimatePresence>
        {respondingTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setRespondingTo(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-lg w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-white">Respond to Review</h3>
                <button onClick={() => setRespondingTo(null)} className="text-gray-500 hover:text-gray-300">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-gray-800 rounded-xl p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{respondingTo.reviewerName}</span>
                  <StarDisplay rating={respondingTo.rating} />
                </div>
                <p className="text-xs text-gray-400">{respondingTo.reviewText}</p>
              </div>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setResponseText(positiveTemplate(respondingTo.reviewerName))}
                  className="text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors"
                >
                  Positive Template
                </button>
                <button
                  onClick={() => setResponseText(negativeTemplate(respondingTo.reviewerName))}
                  className="text-xs text-red-400 bg-red-500/10 px-3 py-1.5 rounded-lg hover:bg-red-500/20 transition-colors"
                >
                  Negative Template
                </button>
              </div>
              <textarea
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                rows={5}
                className="w-full bg-gray-800 border border-gray-600 rounded-xl text-sm text-gray-200 px-3 py-2 resize-none focus:outline-none focus:border-blue-500 mb-3"
              />
              <p className="text-xs text-gray-600 mb-3">
                {responseText.split(" ").length} words — aim for under 100 words.
              </p>
              <button
                onClick={submitResponse}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
              >
                Save Response
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
