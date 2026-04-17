// ============================================================
// Austin's CRM Automation Rules
// Mirrors the client rules engine but operates on the sales pipeline.
// Generates suggestions (not auto-tasks) so Austin stays in control.
// ============================================================

import type {
  Prospect,
  Activity,
  Audit,
  Signal,
  ProspectAutomationSuggestion,
  ProspectAutomationRunLog,
} from "./types";

interface ProspectRuleContext {
  prospects: Prospect[];
  activities: Activity[];
  audits: Audit[];
  signals: Signal[];
  existingSuggestions: ProspectAutomationSuggestion[];
}

type GeneratedSuggestion = Omit<ProspectAutomationSuggestion, "id" | "detectedAt">;

// Helper: detect duplicates
function alreadySuggested(
  items: ProspectAutomationSuggestion[],
  prospectId: string,
  type: ProspectAutomationSuggestion["type"]
): boolean {
  const weekAgo = Date.now() - 7 * 86400000;
  return items.some(
    (s) =>
      s.prospectId === prospectId &&
      s.type === type &&
      new Date(s.detectedAt).getTime() > weekAgo
  );
}

// ── Rule 1: Stale Tier 1 prospects ──────────────────────────

function ruleStaleTier1(ctx: ProspectRuleContext): GeneratedSuggestion[] {
  const suggestions: GeneratedSuggestion[] = [];
  const now = Date.now();

  ctx.prospects
    .filter(
      (p) =>
        p.tier === 1 &&
        p.stage !== "lost" &&
        p.stage !== "retainer_signed" &&
        p.lastTouch
    )
    .forEach((p) => {
      const daysSince = (now - new Date(p.lastTouch).getTime()) / 86400000;
      if (daysSince < 14) return;
      if (alreadySuggested(ctx.existingSuggestions, p.id, "stale_tier_1")) return;
      suggestions.push({
        prospectId: p.id,
        type: "stale_tier_1",
        priority: "urgent",
        title: `Tier 1 going cold: ${p.companyName}`,
        description: `${Math.floor(daysSince)} days since last touch. Either execute pattern interrupt (Touch 4) or send breakup email (Touch 5) to clarify status.`,
        suggestedAction: `Send pattern interrupt: "No reply usually means 1) Not priority, 2) Already solved it, 3) Emails got buried. Which one?"`,
        dollarImpact: p.estimatedValue,
      });
    });

  return suggestions;
}

// ── Rule 2: Pattern interrupt ready (3+ touches, no response) ─

function rulePatternInterruptReady(ctx: ProspectRuleContext): GeneratedSuggestion[] {
  const suggestions: GeneratedSuggestion[] = [];

  ctx.prospects
    .filter(
      (p) =>
        p.touchCount >= 3 &&
        p.stage === "touched" &&
        p.tier <= 2
    )
    .forEach((p) => {
      const inboundReplies = ctx.activities.filter(
        (a) => a.prospectId === p.id && a.direction === "inbound"
      );
      if (inboundReplies.length > 0) return; // they replied at some point
      if (alreadySuggested(ctx.existingSuggestions, p.id, "pattern_interrupt_ready")) return;
      suggestions.push({
        prospectId: p.id,
        type: "pattern_interrupt_ready",
        priority: "high",
        title: `Ready for pattern interrupt: ${p.companyName}`,
        description: `${p.touchCount} touches sent, no reply. Time to either punt or provoke response with direct, honest email.`,
        suggestedAction: `Send Touch 4 (pattern interrupt) from the email cadence template`,
        dollarImpact: p.estimatedValue,
      });
    });

  return suggestions;
}

// ── Rule 3: Stage stuck ─────────────────────────────────────

function ruleStageStuck(ctx: ProspectRuleContext): GeneratedSuggestion[] {
  const suggestions: GeneratedSuggestion[] = [];
  const now = Date.now();
  const staleStages: Prospect["stage"][] = [
    "meeting_booked",
    "discovery_done",
    "audit_proposed",
  ];

  ctx.prospects
    .filter((p) => staleStages.includes(p.stage))
    .forEach((p) => {
      const daysSinceUpdate =
        (now - new Date(p.updatedAt).getTime()) / 86400000;
      if (daysSinceUpdate < 10) return;
      if (alreadySuggested(ctx.existingSuggestions, p.id, "stage_stuck")) return;
      suggestions.push({
        prospectId: p.id,
        type: "stage_stuck",
        priority: "high",
        title: `Stuck in ${p.stage.replace(/_/g, " ")}: ${p.companyName}`,
        description: `${Math.floor(daysSinceUpdate)} days without stage movement. Deal is losing momentum. Deals past 50 days close at much lower rates.`,
        suggestedAction:
          p.stage === "audit_proposed"
            ? `Follow up directly: "Any questions on the audit proposal?" Offer to shorten scope or adjust pricing.`
            : `Book next-step call or confirm decision timeline in writing.`,
        dollarImpact: p.estimatedValue,
      });
    });

  return suggestions;
}

// ── Rule 4: Audit approaching delivery ──────────────────────

function ruleAuditDay12Plus(ctx: ProspectRuleContext): GeneratedSuggestion[] {
  const suggestions: GeneratedSuggestion[] = [];
  const now = Date.now();

  ctx.audits
    .filter(
      (a) =>
        a.stage !== "converted_to_retainer" &&
        a.stage !== "lost_post_audit" &&
        a.stage !== "review_call_done" &&
        a.stage !== "report_delivered"
    )
    .forEach((a) => {
      const daysSinceStart =
        (now - new Date(a.startDate).getTime()) / 86400000;
      if (daysSinceStart < 12) return;
      if (alreadySuggested(ctx.existingSuggestions, a.prospectId, "audit_day_12_plus")) return;
      const prospect = ctx.prospects.find((p) => p.id === a.prospectId);
      if (!prospect) return;
      suggestions.push({
        prospectId: a.prospectId,
        type: "audit_day_12_plus",
        priority: "urgent",
        title: `Audit delivery due: ${a.companyName}`,
        description: `Day ${Math.floor(daysSinceStart)} of 14. Final report must be delivered within 48 hours to maintain quality promise. Review call should already be scheduled.`,
        suggestedAction: `Finalize report PDF today. Send to client 24hrs before review call. Block 2 hours for review prep.`,
        dollarImpact: a.findings.projectedROI || prospect.estimatedValue,
      });
    });

  return suggestions;
}

// ── Rule 5: Retainer decision overdue ───────────────────────

function ruleRetainerFollowUp(ctx: ProspectRuleContext): GeneratedSuggestion[] {
  const suggestions: GeneratedSuggestion[] = [];
  const now = Date.now();

  ctx.audits
    .filter((a) => a.stage === "review_call_done" || a.stage === "report_delivered")
    .forEach((a) => {
      const daysSince = (now - new Date(a.startDate).getTime()) / 86400000 - 14;
      if (daysSince < 7) return;
      if (alreadySuggested(ctx.existingSuggestions, a.prospectId, "retainer_follow_up")) return;
      const prospect = ctx.prospects.find((p) => p.id === a.prospectId);
      if (!prospect) return;
      suggestions.push({
        prospectId: a.prospectId,
        type: "retainer_follow_up",
        priority: "high",
        title: `Retainer decision overdue: ${a.companyName}`,
        description: `Audit delivered ${Math.floor(daysSince)} days ago. No retainer signed yet. Every week of delay reduces conversion probability.`,
        suggestedAction: `Direct ask: "Does Phase 1 make sense to you? If not, what's the hesitation?" Better to disqualify than stay in limbo.`,
        dollarImpact: prospect.estimatedValue,
      });
    });

  return suggestions;
}

// ── Rule 6: Referral uncontacted ────────────────────────────

function ruleReferralUncontacted(ctx: ProspectRuleContext): GeneratedSuggestion[] {
  const suggestions: GeneratedSuggestion[] = [];
  const now = Date.now();

  ctx.prospects
    .filter(
      (p) =>
        p.triggerEvent === "referral" &&
        p.stage === "unreached" &&
        p.referralSource
    )
    .forEach((p) => {
      const hoursSinceAdded = (now - new Date(p.createdAt).getTime()) / 3600000;
      if (hoursSinceAdded < 48) return;
      if (alreadySuggested(ctx.existingSuggestions, p.id, "referral_uncontacted")) return;
      suggestions.push({
        prospectId: p.id,
        type: "referral_uncontacted",
        priority: "urgent",
        title: `Warm referral going cold: ${p.companyName}`,
        description: `${p.referralSource} made the intro ${Math.floor(hoursSinceAdded / 24)} day(s) ago. Hasn't been contacted yet. Champion's credibility is on the line.`,
        suggestedAction: `Reply-all to the intro email within 2 hours. Reference ${p.referralSource} by name. Ask for 15 minutes.`,
        dollarImpact: p.estimatedValue,
      });
    });

  return suggestions;
}

// ── Rule 7: Tier 1 with no next_touch ───────────────────────

function ruleNoNextTouch(ctx: ProspectRuleContext): GeneratedSuggestion[] {
  const suggestions: GeneratedSuggestion[] = [];

  ctx.prospects
    .filter(
      (p) =>
        p.tier === 1 &&
        !p.nextTouch &&
        p.stage !== "lost" &&
        p.stage !== "retainer_signed" &&
        p.stage !== "unreached"
    )
    .forEach((p) => {
      if (alreadySuggested(ctx.existingSuggestions, p.id, "no_next_touch_scheduled")) return;
      suggestions.push({
        prospectId: p.id,
        type: "no_next_touch_scheduled",
        priority: "medium",
        title: `No next step: ${p.companyName}`,
        description: `Tier 1 prospect in active stage with no scheduled next touch. Every open deal needs a specific next step with a specific date.`,
        suggestedAction: `Schedule next touch on their card. Even a placeholder (+7 days) keeps them in rhythm.`,
        dollarImpact: p.estimatedValue,
      });
    });

  return suggestions;
}

// ── Main evaluator ──────────────────────────────────────────

export function runProspectAutomation(ctx: ProspectRuleContext): {
  suggestions: GeneratedSuggestion[];
  log: Omit<ProspectAutomationRunLog, "id">;
} {
  const allRules = [
    { fn: ruleStaleTier1, name: "Stale Tier 1 prospects" },
    { fn: rulePatternInterruptReady, name: "Pattern interrupt ready" },
    { fn: ruleStageStuck, name: "Stage stuck 10+ days" },
    { fn: ruleAuditDay12Plus, name: "Audit approaching delivery" },
    { fn: ruleRetainerFollowUp, name: "Retainer decision overdue" },
    { fn: ruleReferralUncontacted, name: "Referral uncontacted 48hr+" },
    { fn: ruleNoNextTouch, name: "Tier 1 no next touch" },
  ];

  const suggestions: GeneratedSuggestion[] = [];
  const details: string[] = [];

  allRules.forEach(({ fn, name }) => {
    const results = fn(ctx);
    if (results.length > 0) {
      details.push(`${name}: ${results.length} suggestion${results.length === 1 ? "" : "s"}`);
    }
    suggestions.push(...results);
  });

  return {
    suggestions,
    log: {
      runAt: new Date().toISOString(),
      prospectsEvaluated: ctx.prospects.length,
      suggestionsGenerated: suggestions.length,
      details: details.length > 0 ? details : ["No suggestions. Pipeline is current."],
    },
  };
}
