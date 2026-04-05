"use client";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import type { LeadSource } from "@/lib/types";

const SOURCE_LABELS: Record<LeadSource, string> = {
  lsa: "Google LSA",
  google_ads: "Google Ads",
  gbp: "Google Business Profile",
  organic: "Organic Search",
  referral: "Referral",
  social: "Social Media",
  nextdoor: "Nextdoor",
  yelp: "Yelp",
  direct: "Direct",
};

const BAR_COLORS = [
  "bg-[#00D4C8]",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
];

interface Props {
  clientId: string;
}

function MetricRow({
  label,
  value,
  highlight = false,
  trend,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  trend?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center">
        <span
          className={`text-sm font-semibold ${
            highlight ? "text-[#00D4C8]" : "text-white"
          }`}
        >
          {value}
        </span>
        {trend}
      </div>
    </div>
  );
}

export default function ClientViewReport({ clientId }: Props) {
  const { store } = useStore();
  const { clients, leads, reviewStats, gbpPosts, citations, checklists } =
    store;

  const client = clients.find((c) => c.id === clientId);

  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const metrics = useMemo(() => {
    if (!client) return null;

    const now = new Date();
    const yr = now.getFullYear();
    const mo = now.getMonth();
    const priorMo = mo === 0 ? 11 : mo - 1;
    const priorYr = mo === 0 ? yr - 1 : yr;

    function inMonth(dateStr: string, year: number, month: number) {
      const d = new Date(dateStr);
      return d.getFullYear() === year && d.getMonth() === month;
    }

    const clientLeads = leads.filter((l) => l.clientId === clientId);
    const leadsThisMonth = clientLeads.filter((l) =>
      inMonth(l.createdAt, yr, mo)
    );
    const leadsPriorMonth = clientLeads.filter((l) =>
      inMonth(l.createdAt, priorYr, priorMo)
    );
    const leadDelta = leadsThisMonth.length - leadsPriorMonth.length;
    // Only show trend arrow when we have a prior month baseline to compare against
    const hasPriorData = leadsPriorMonth.length > 0;

    const cpl =
      client.adSpend > 0 && leadsThisMonth.length > 0
        ? Math.round(client.adSpend / leadsThisMonth.length)
        : null;

    const clientReviewStats = reviewStats[clientId] ?? [];
    const newReviews = clientReviewStats.reduce(
      (sum, p) => sum + p.newThisMonth,
      0
    );
    const googleStats = clientReviewStats.find((p) => p.platform === "google");

    const gbpPostsThisMonth = gbpPosts.filter(
      (p) => p.clientId === clientId && inMonth(p.date, yr, mo)
    );

    const clientCitations = citations[clientId] ?? [];
    const citationsOptimized = clientCitations.filter(
      (c) => c.status === "optimized"
    ).length;
    const hasCitationsData = clientCitations.length > 0;

    const clientChecklistEntries = Object.entries(checklists).filter(([key]) =>
      key.startsWith(clientId)
    );
    const totalTasks = clientChecklistEntries.reduce(
      (sum, [, items]) => sum + items.length,
      0
    );
    const completedTasks = clientChecklistEntries.reduce(
      (sum, [, items]) => sum + items.filter((i) => i.completed).length,
      0
    );

    // Top 4 lead sources by volume
    const sourceGroups = leadsThisMonth.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topSources = Object.entries(sourceGroups)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);

    return {
      leadsThisMonth: leadsThisMonth.length,
      leadDelta,
      hasPriorData,
      cpl,
      newReviews: clientReviewStats.length > 0 ? newReviews : null,
      googleRating: googleStats?.rating ?? null,
      gbpPostsCount: gbpPostsThisMonth.length,
      citationsOptimized,
      hasCitationsData,
      completedTasks,
      totalTasks,
      topSources,
      score: client.scores.overall,
    };
  }, [client, leads, reviewStats, gbpPosts, citations, checklists, clientId]);

  if (!client || !metrics) return null;

  const maxSourceCount = metrics.topSources[0]?.[1] ?? 1;
  const { score } = metrics;
  const scoreBadgeClass =
    score >= 75
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : score >= 50
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-red-400 border-red-500/30 bg-red-500/10";

  return (
    <div className="min-h-screen bg-[#0A1628] py-10 px-4">
      {/* Agency back link — subtle, top-right */}
      <div className="max-w-2xl mx-auto mb-6 flex justify-end">
        <Link
          href={`/dashboard/clients/${clientId}`}
          className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Agency View
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-lg font-bold text-white">
              {client.businessName}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Marketing Report · {monthLabel}
            </p>
          </div>
          <div
            className={`border rounded-full px-3 py-1 text-sm font-semibold ${scoreBadgeClass}`}
          >
            {score} / 100
          </div>
        </div>

        {/* Metric rows */}
        <div className="divide-y divide-gray-800/60">
          <MetricRow
            label="Total Leads"
            value={String(metrics.leadsThisMonth)}
            highlight
            trend={
              metrics.hasPriorData && metrics.leadDelta !== 0 ? (
                <span className={`text-xs ml-2 ${metrics.leadDelta > 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {metrics.leadDelta > 0 ? "↑" : "↓"} {metrics.leadDelta > 0 ? `+${metrics.leadDelta}` : metrics.leadDelta} vs last month
                </span>
              ) : undefined
            }
          />
          <MetricRow
            label="Cost Per Lead"
            value={metrics.cpl != null ? `$${metrics.cpl}` : "—"}
          />
          <MetricRow
            label="New Reviews"
            value={metrics.newReviews != null ? `+${metrics.newReviews}` : "—"}
          />
          <MetricRow
            label="Google Rating"
            value={
              metrics.googleRating != null ? `${metrics.googleRating}★` : "—"
            }
          />
          <MetricRow
            label="GBP Posts Published"
            value={String(metrics.gbpPostsCount)}
          />
          <MetricRow
            label="Citations Optimized"
            value={metrics.hasCitationsData ? String(metrics.citationsOptimized) : "—"}
          />
          <MetricRow
            label="Tasks Completed"
            value={
              metrics.totalTasks > 0
                ? `${metrics.completedTasks} / ${metrics.totalTasks}`
                : "—"
            }
          />
        </div>

        {/* Lead source breakdown */}
        {metrics.topSources.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
              Where Your Leads Came From
            </p>
            <div className="flex flex-col gap-4">
              {metrics.topSources.map(([source, count], i) => {
                const pct = Math.round((count / maxSourceCount) * 100);
                return (
                  <div key={source}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400">
                        {SOURCE_LABELS[source as LeadSource] ?? source}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${BAR_COLORS[i]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800/60 text-center">
          <p className="text-xs text-gray-700">
            Powered by Surge Advisory · surgeadvisory.co
          </p>
        </div>
      </div>
    </div>
  );
}
