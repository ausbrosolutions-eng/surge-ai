"use client";

import { use, useMemo } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import { Trophy, TrendingUp, TrendingDown, Minus, GraduationCap, CheckCircle2 } from "lucide-react";

export default function TeamPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const { store, hydrated } = useSurgeStore();

  const staff = useMemo(
    () => store.staff.filter((s) => s.clientId === clientId),
    [store.staff, clientId]
  );

  const sorted = useMemo(
    () => [...staff].sort((a, b) => b.scorecardThisWeek - a.scorecardThisWeek),
    [staff]
  );

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading team...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333] mb-1">
            Team Leaderboard
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Team
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-2">
            Scorecards updated weekly. Praise high performance. Coach the rest.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-4">
        {sorted.map((member, i) => {
          const trendIcon =
            member.scorecardTrend === "up" ? TrendingUp : member.scorecardTrend === "down" ? TrendingDown : Minus;
          const TrendIcon = trendIcon;
          const trendColor =
            member.scorecardTrend === "up"
              ? "text-[#4ADE80]"
              : member.scorecardTrend === "down"
              ? "text-[#EF4444]"
              : "text-[#9A9086]";
          const scoreColor =
            member.scorecardThisWeek >= 85
              ? "text-[#4ADE80]"
              : member.scorecardThisWeek >= 70
              ? "text-[#FBBF24]"
              : "text-[#EF4444]";

          return (
            <div
              key={member.id}
              className={`bg-[#111111] border rounded-[2px] p-6 ${
                i === 0 ? "border-[#FBBF24]/40" : "border-[#2A2520]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      i === 0 ? "bg-[#FBBF24]/20" : "bg-[#B87333]/15"
                    }`}
                  >
                    {i === 0 ? (
                      <Trophy className="w-6 h-6 text-[#FBBF24]" />
                    ) : (
                      <span className="font-display text-lg font-bold text-[#B87333]">
                        {i + 1}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-bold text-[#E8E2D8]">
                      {member.name}
                    </h3>
                    <p className="font-sans text-xs text-[#9A9086] capitalize">
                      {member.role.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                    <p className={`font-display text-4xl font-bold leading-none ${scoreColor}`}>
                      {member.scorecardThisWeek}
                    </p>
                    <p className="font-sans text-lg text-[#5A5550]">/100</p>
                  </div>
                  <p className="font-sans text-xs text-[#5A5550] mt-1">Weekly scorecard</p>
                </div>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 pt-4 border-t border-[#1A1A1A]">
                <KpiMini label="Jobs" value={member.kpis.jobsHandled} />
                <KpiMini label="Docs" value={member.kpis.docsCompleted} />
                <KpiMini label="Supplements" value={member.kpis.supplementsApproved} />
                <KpiMini label="Reviews" value={member.kpis.reviewsGenerated} />
                <KpiMini label="Follow-ups" value={member.kpis.collectionsFollowedUp} />
                <KpiMini
                  label="Avg response"
                  value={`${member.kpis.avgResponseTimeHours.toFixed(1)}h`}
                />
              </div>

              {/* Training */}
              {(member.trainingProgress.currentCourse ||
                member.trainingProgress.certificationsEarned.length > 0) && (
                <div className="mt-4 pt-4 border-t border-[#1A1A1A]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <GraduationCap className="w-4 h-4 text-[#B87333]" />
                        <p className="font-sans text-xs font-medium tracking-wider uppercase text-[#9A9086]">
                          Training Progress
                        </p>
                      </div>
                      {member.trainingProgress.currentCourse && (
                        <p className="font-sans text-sm text-[#E8E2D8] mb-1">
                          Currently:{" "}
                          <span className="text-[#B87333]">
                            {member.trainingProgress.currentCourse}
                          </span>
                        </p>
                      )}
                      <p className="font-sans text-xs text-[#5A5550]">
                        {member.trainingProgress.coursesCompleted.length} courses completed
                      </p>
                    </div>
                    {member.trainingProgress.certificationsEarned.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {member.trainingProgress.certificationsEarned.map((cert) => (
                          <span
                            key={cert}
                            className="flex items-center gap-1 px-2 py-1 bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-[2px] font-sans text-[11px] font-semibold text-[#4ADE80]"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}

function KpiMini({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550] mb-1">
        {label}
      </p>
      <p className="font-display text-lg font-bold text-[#E8E2D8]">{value}</p>
    </div>
  );
}
