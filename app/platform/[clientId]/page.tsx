"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  AlertCircle,
  Flame,
  Target,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  Trophy,
} from "lucide-react";
import { useSurgeStore } from "@/lib/surge/store";

export default function ClientCockpit({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const { store, hydrated, completeActionItem } = useSurgeStore();

  const client = store.retainerClients.find((c) => c.id === clientId);
  const metrics = store.metrics.find((m) => m.clientId === clientId);
  const staff = useMemo(() => store.staff.filter((s) => s.clientId === clientId), [store.staff, clientId]);
  const actionItems = useMemo(
    () =>
      store.actionItems
        .filter((a) => a.clientId === clientId && !a.completedAt)
        .sort((a, b) => {
          const pri = { urgent: 0, high: 1, medium: 2 };
          return pri[a.priority] - pri[b.priority];
        }),
    [store.actionItems, clientId]
  );
  const focusItems = actionItems.slice(0, 3);

  const topPerformer = useMemo(() => {
    return [...staff].sort((a, b) => b.scorecardThisWeek - a.scorecardThisWeek)[0];
  }, [staff]);

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading your cockpit...</p>
      </main>
    );
  }

  if (!client || !metrics) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#EF4444]">Client not found.</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-[#2A2520] bg-gradient-to-r from-[#0A0A0A] via-[#151515] to-[#0A0A0A] px-8 py-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333] mb-1">
              {client.companyName} · Phase {client.phase} Active
            </p>
            <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
              Today at {client.companyName.split(" ")[0]}
            </h1>
          </div>
          <div className="text-right">
            <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086]">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex items-center gap-2 mt-1 justify-end">
              <Flame className="w-4 h-4 text-[#B87333]" />
              <span className="font-display text-sm font-bold text-[#B87333]">
                {metrics.streaks.daysWithCleanFollowUps}-day streak
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* The Revenue Recovery Ticker - The Hero */}
        <div className="relative overflow-hidden rounded-[2px] bg-gradient-to-r from-[#B87333]/10 via-[#B87333]/5 to-transparent border border-[#B87333]/30 p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-sans text-xs font-medium tracking-[0.12em] uppercase text-[#B87333] mb-2">
                ⚡ Live Recovery Ticker
              </p>
              <p className="font-display text-6xl font-bold tracking-tight text-[#E8E2D8] leading-none mb-2">
                ${metrics.collections.recoveredThisMonth.toLocaleString()}
              </p>
              <p className="font-sans text-sm text-[#9A9086]">
                Recovered this month thanks to automated collections.{" "}
                <span className="text-[#B87333] font-semibold">
                  ${metrics.collections.recoveredYTD.toLocaleString()}
                </span>{" "}
                year-to-date.
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1">
                Still Stuck
              </p>
              <p className="font-display text-2xl font-bold text-[#E8E2D8]">
                ${(metrics.collections.totalStuck / 1000).toFixed(0)}K
              </p>
              <p className="font-sans text-xs text-[#5A5550] mt-1">
                {metrics.collections.jobsStuck} jobs · avg {metrics.collections.avgDaysAged} days aged
              </p>
            </div>
          </div>
        </div>

        {/* Daily Focus Ring - Behavior Change Core */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-[#B87333]" />
              <h2 className="font-display text-lg font-bold tracking-[0.04em] uppercase text-[#E8E2D8]">
                Your Focus Today
              </h2>
            </div>
            <span className="font-sans text-xs text-[#5A5550] italic">
              Do these 3 things. Everything else can wait.
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {focusItems.length === 0 ? (
              <div className="md:col-span-3 bg-[#111111] border border-[#2A2520] rounded-[2px] p-12 text-center">
                <CheckCircle2 className="w-10 h-10 text-[#4ADE80] mx-auto mb-3" />
                <p className="font-display text-lg font-bold text-[#E8E2D8] mb-1">
                  Focus items complete.
                </p>
                <p className="font-sans text-sm text-[#9A9086]">
                  You&rsquo;re ahead of schedule. Take a breath.
                </p>
              </div>
            ) : (
              focusItems.map((item) => {
                const assignedStaff = staff.find((s) => s.id === item.assignedToStaffId);
                return (
                  <div
                    key={item.id}
                    className={`rounded-[2px] border p-5 ${
                      item.priority === "urgent"
                        ? "bg-[#EF4444]/5 border-[#EF4444]/30"
                        : item.priority === "high"
                        ? "bg-[#FBBF24]/5 border-[#FBBF24]/30"
                        : "bg-[#111111] border-[#2A2520]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded-[2px] font-sans text-[9px] font-bold tracking-widest uppercase ${
                          item.priority === "urgent"
                            ? "bg-[#EF4444]/20 text-[#EF4444]"
                            : item.priority === "high"
                            ? "bg-[#FBBF24]/20 text-[#FBBF24]"
                            : "bg-[#9A9086]/20 text-[#9A9086]"
                        }`}
                      >
                        {item.priority}
                      </span>
                      {item.dollarImpact > 0 && (
                        <span className="font-display text-sm font-bold text-[#B87333]">
                          ${item.dollarImpact.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-base font-bold text-[#E8E2D8] mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="font-sans text-xs text-[#9A9086] leading-relaxed mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between pt-3 border-t border-[#1A1A1A]">
                      <p className="font-sans text-xs text-[#5A5550]">
                        {assignedStaff ? `→ ${assignedStaff.name}` : "Unassigned"}
                      </p>
                      <button
                        onClick={() => completeActionItem(item.id)}
                        className="flex items-center gap-1 px-2 py-1 bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 text-[#4ADE80] font-sans text-xs font-semibold rounded-[2px] transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3" /> Done
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KPITile
            label="Active Jobs"
            value={metrics.pipeline.activeJobs}
            detail={`$${(metrics.pipeline.pipelineValue / 1000).toFixed(0)}K pipeline`}
            icon={TrendingUp}
          />
          <KPITile
            label="Blocked at Billing"
            value={metrics.pipeline.blockedAtBilling}
            detail="Down from 393 at start"
            icon={AlertCircle}
            tone="good"
          />
          <KPITile
            label="Data Integrity"
            value={`${metrics.pipeline.documentationGapScore}/100`}
            detail="Up from 12 at start"
            icon={TrendingUp}
            tone="good"
          />
          <KPITile
            label="Team Scorecard"
            value={`${metrics.team.avgScorecardThisWeek}/100`}
            detail={`${metrics.team.activeToday} of ${metrics.team.memberCount} active today`}
            icon={Trophy}
          />
        </div>

        {/* Two-column: Team Leaderboard + Remaining Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team Leaderboard */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#FBBF24]" />
                <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8]">
                  Team Leaderboard
                </h2>
              </div>
              <Link
                href={`/platform/${clientId}/team`}
                className="font-sans text-xs text-[#B87333] hover:text-[#D4956A] flex items-center gap-1"
              >
                Full team <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {topPerformer && (
              <div className="bg-gradient-to-r from-[#FBBF24]/10 to-transparent border border-[#FBBF24]/30 rounded-[2px] p-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FBBF24]/20 flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-[#FBBF24]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm font-bold text-[#E8E2D8]">
                      {topPerformer.name} is leading the week
                    </p>
                    <p className="font-sans text-xs text-[#9A9086]">
                      Scorecard: {topPerformer.scorecardThisWeek}/100 · {topPerformer.role.replace("_", " ")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] divide-y divide-[#1A1A1A]">
              {[...staff]
                .sort((a, b) => b.scorecardThisWeek - a.scorecardThisWeek)
                .map((member, i) => (
                  <div key={member.id} className="flex items-center gap-3 p-3">
                    <span className="font-display text-sm font-bold text-[#5A5550] w-5">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-[#E8E2D8]">
                        {member.name}
                      </p>
                      <p className="font-sans text-xs text-[#9A9086] capitalize">
                        {member.role.replace("_", " ")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`font-sans text-xs ${
                          member.scorecardTrend === "up"
                            ? "text-[#4ADE80]"
                            : member.scorecardTrend === "down"
                            ? "text-[#EF4444]"
                            : "text-[#9A9086]"
                        }`}
                      >
                        {member.scorecardTrend === "up"
                          ? "↑"
                          : member.scorecardTrend === "down"
                          ? "↓"
                          : "→"}
                      </span>
                      <span
                        className={`font-display text-sm font-bold ${
                          member.scorecardThisWeek >= 85
                            ? "text-[#4ADE80]"
                            : member.scorecardThisWeek >= 70
                            ? "text-[#FBBF24]"
                            : "text-[#EF4444]"
                        }`}
                      >
                        {member.scorecardThisWeek}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Remaining action items */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[#B87333]" />
                <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8]">
                  Remaining Queue
                </h2>
              </div>
              <Link
                href={`/platform/${clientId}/actions`}
                className="font-sans text-xs text-[#B87333] hover:text-[#D4956A] flex items-center gap-1"
              >
                Full queue <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] divide-y divide-[#1A1A1A]">
              {actionItems.length <= 3 ? (
                <div className="p-6 text-center">
                  <p className="font-sans text-sm text-[#9A9086]">
                    Queue is clean. Great work.
                  </p>
                </div>
              ) : (
                actionItems.slice(3).map((item) => {
                  const assignedStaff = staff.find((s) => s.id === item.assignedToStaffId);
                  return (
                    <div key={item.id} className="p-3 flex items-start gap-3">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                          item.priority === "urgent"
                            ? "bg-[#EF4444]"
                            : item.priority === "high"
                            ? "bg-[#FBBF24]"
                            : "bg-[#9A9086]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-sm text-[#E8E2D8] leading-tight mb-0.5">
                          {item.title}
                        </p>
                        <p className="font-sans text-xs text-[#5A5550]">
                          {assignedStaff?.name || "Unassigned"}
                          {item.dollarImpact > 0 &&
                            ` · $${item.dollarImpact.toLocaleString()} at stake`}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Streaks + Social Proof */}
        <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-6">
          <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4">
            Streaks
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <StreakTile
              count={metrics.streaks.daysWithCleanFollowUps}
              label="Days with clean follow-ups"
              unit="days"
            />
            <StreakTile
              count={metrics.streaks.daysAllFocusItemsDone}
              label="Days all focus items done"
              unit="days"
            />
            <StreakTile
              count={metrics.streaks.weeksWith100Compliance}
              label="Weeks 100% documentation"
              unit="weeks"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

function KPITile({
  label,
  value,
  detail,
  icon: Icon,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  detail: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone?: "neutral" | "good" | "warn" | "bad";
}) {
  const toneColor =
    tone === "good" ? "text-[#4ADE80]" : tone === "warn" ? "text-[#FBBF24]" : tone === "bad" ? "text-[#EF4444]" : "text-[#B87333]";
  return (
    <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086]">
          {label}
        </p>
        <Icon className={`w-4 h-4 ${toneColor}`} />
      </div>
      <p className="font-display text-3xl font-bold text-[#E8E2D8] leading-none mb-1">
        {value}
      </p>
      <p className="font-sans text-xs text-[#5A5550] mt-2">{detail}</p>
    </div>
  );
}

function StreakTile({ count, label, unit }: { count: number; label: string; unit: string }) {
  const active = count > 0;
  return (
    <div className="text-center">
      <div className="flex items-center justify-center gap-2 mb-1">
        <Flame
          className={`w-6 h-6 ${active ? "text-[#B87333]" : "text-[#3A3530]"}`}
        />
        <p
          className={`font-display text-4xl font-bold ${
            active ? "text-[#E8E2D8]" : "text-[#5A5550]"
          }`}
        >
          {count}
        </p>
        <span className="font-sans text-xs text-[#9A9086] self-end pb-1">{unit}</span>
      </div>
      <p className="font-sans text-xs text-[#9A9086]">{label}</p>
    </div>
  );
}
