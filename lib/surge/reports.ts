// ============================================================
// Weekly Report Generator
// Takes client metrics + jobs + staff + action items → structured report
// ============================================================

import type {
  ClientBusinessMetrics,
  ClientJob,
  StaffMember,
  ActionItem,
  WeeklyReport,
  RetainerClient,
} from "./types";

interface ReportContext {
  clientId: string;
  client: RetainerClient;
  metrics: ClientBusinessMetrics;
  previousMetrics: ClientBusinessMetrics | null;
  jobs: ClientJob[];
  staff: StaffMember[];
  actionItems: ActionItem[];
}

export function generateWeeklyReport(ctx: ReportContext): WeeklyReport {
  const now = new Date();
  const weekEnding = now.toISOString();
  const weekStarting = new Date(now.getTime() - 7 * 86400000).toISOString();

  // Calculate period metrics
  const weekAgoTimestamp = now.getTime() - 7 * 86400000;
  const completedThisWeek = ctx.actionItems.filter(
    (a) => a.completedAt && new Date(a.completedAt).getTime() >= weekAgoTimestamp
  );

  const jobsClosedThisWeek = ctx.jobs.filter(
    (j) => j.stage === "closed" && new Date(j.lastActivity).getTime() >= weekAgoTimestamp
  );

  const supplementsThisWeek = ctx.staff.reduce((sum, s) => sum + (s.kpis.supplementsApproved || 0), 0);

  // Top performers this week
  const topPerformers = [...ctx.staff]
    .sort((a, b) => b.scorecardThisWeek - a.scorecardThisWeek)
    .slice(0, 3)
    .map((s) => ({ staffId: s.id, name: s.name, score: s.scorecardThisWeek }));

  // Week-over-week changes
  const weekOverWeek = {
    recoveryChange: ctx.previousMetrics
      ? ctx.metrics.collections.recoveredThisMonth - ctx.previousMetrics.collections.recoveredThisMonth
      : ctx.metrics.collections.recoveredThisMonth,
    activeJobsChange: ctx.previousMetrics
      ? ctx.metrics.pipeline.activeJobs - ctx.previousMetrics.pipeline.activeJobs
      : 0,
    avgScorecardChange: ctx.previousMetrics
      ? ctx.metrics.team.avgScorecardThisWeek - ctx.previousMetrics.team.avgScorecardThisWeek
      : 0,
  };

  // Concerns (auto-detected)
  const concerns: string[] = [];
  const oldestStuck = [...ctx.jobs]
    .filter((j) => j.stage === "collections")
    .sort((a, b) => b.daysInCurrentStage - a.daysInCurrentStage)[0];
  if (oldestStuck && oldestStuck.daysInCurrentStage > 365) {
    concerns.push(
      `${oldestStuck.customerName} invoice is ${oldestStuck.daysInCurrentStage} days aged ($${oldestStuck.amount.toLocaleString()}). Recovery likelihood drops sharply past 1 year - consider write-off decision.`
    );
  }

  const blockedCount = ctx.jobs.filter((j) =>
    j.flags.some((f) => f.includes("missing_"))
  ).length;
  if (blockedCount > 3) {
    concerns.push(
      `${blockedCount} jobs have documentation gaps that will block billing when they reach 3.3. Prioritize upload automation this week.`
    );
  }

  const decliningStaff = ctx.staff.filter(
    (s) => s.scorecardTrend === "down" && s.scorecardThisWeek < 75
  );
  if (decliningStaff.length > 0) {
    concerns.push(
      `${decliningStaff.map((s) => s.name).join(", ")} ${decliningStaff.length === 1 ? "is" : "are"} trending down. Coaching conversation recommended.`
    );
  }

  const highValueStuck = ctx.jobs
    .filter((j) => j.stage === "collections" && j.amount >= 50000)
    .reduce((sum, j) => sum + j.amount, 0);
  if (highValueStuck > 0) {
    concerns.push(
      `$${highValueStuck.toLocaleString()} of collections exposure sits in jobs over $50K. These deserve direct adjuster calls, not just SMS automation.`
    );
  }

  // Next week priorities (auto-suggested)
  const openUrgent = ctx.actionItems.filter(
    (a) => !a.completedAt && a.priority === "urgent"
  );
  const nextWeekPriorities: string[] = [];
  if (openUrgent.length > 0) {
    nextWeekPriorities.push(
      `Close out ${openUrgent.length} urgent action item${openUrgent.length === 1 ? "" : "s"} before Friday`
    );
  }
  const totalExposure = ctx.jobs
    .filter((j) => j.stage === "collections")
    .reduce((sum, j) => sum + j.amount, 0);
  if (totalExposure > 500000) {
    nextWeekPriorities.push(
      `Prioritize the 3 largest stuck invoices for direct adjuster calls ($${(totalExposure / 1000).toFixed(0)}K total collections exposure)`
    );
  }
  if (ctx.metrics.pipeline.documentationGapScore < 85) {
    nextWeekPriorities.push(
      `Push documentation score from ${ctx.metrics.pipeline.documentationGapScore} to 85+ (run Encircle compliance review on active jobs)`
    );
  }
  if (ctx.metrics.streaks.weeksWith100Compliance === 0) {
    nextWeekPriorities.push(
      `Target first week at 100% documentation compliance - unlock additional platform features`
    );
  }

  // Summary (natural language)
  const recoveryTrend =
    weekOverWeek.recoveryChange > 0
      ? `Recovery pace is accelerating, up $${weekOverWeek.recoveryChange.toLocaleString()} vs. last period.`
      : weekOverWeek.recoveryChange < 0
      ? `Recovery pace slowed this week.`
      : `Recovery pace held steady.`;

  const streakContext =
    ctx.metrics.streaks.daysWithCleanFollowUps > 7
      ? ` ${ctx.metrics.streaks.daysWithCleanFollowUps}-day clean follow-up streak is the longest this quarter.`
      : "";

  const summary = `Week of ${new Date(weekStarting).toLocaleDateString()} closed with $${ctx.metrics.collections.recoveredThisMonth.toLocaleString()} recovered month-to-date. ${recoveryTrend}${streakContext} Team average scorecard at ${ctx.metrics.team.avgScorecardThisWeek}/100${
    weekOverWeek.avgScorecardChange !== 0
      ? ` (${weekOverWeek.avgScorecardChange > 0 ? "+" : ""}${weekOverWeek.avgScorecardChange.toFixed(1)} vs. last period)`
      : ""
  }. ${completedThisWeek.length} action items completed. ${concerns.length > 0 ? `${concerns.length} concern${concerns.length === 1 ? "" : "s"} flagged for leadership review.` : "No major concerns flagged."}`;

  return {
    id: `report-${ctx.clientId}-${Date.now()}`,
    clientId: ctx.clientId,
    weekStarting,
    weekEnding,
    generatedAt: new Date().toISOString(),
    highlights: {
      revenueRecovered: ctx.metrics.collections.recoveredThisMonth,
      jobsClosed: jobsClosedThisWeek.length,
      supplementsApproved: supplementsThisWeek,
      actionItemsCompleted: completedThisWeek.length,
      documentationGapScore: ctx.metrics.pipeline.documentationGapScore,
    },
    weekOverWeek,
    topPerformers,
    concerns,
    nextWeekPriorities: nextWeekPriorities.length > 0
      ? nextWeekPriorities
      : ["Maintain current pace - no new priorities flagged by the platform."],
    summary,
  };
}
