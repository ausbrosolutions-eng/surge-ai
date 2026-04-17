// ============================================================
// Surge Automation Rules Engine
// Analyzes client data and auto-generates action items
// ============================================================

import type {
  ActionItem,
  ClientJob,
  StaffMember,
  EncircleSessionData,
  ClientBusinessMetrics,
  AutomationRule,
  AutomationRunLog,
} from "./types";

// ── Rule Definitions (Surge's Best Practices) ───────────────

export const RULES: AutomationRule[] = [
  {
    id: "rule-doc-gap-33",
    name: "Documentation gap at 3.3 approach",
    description: "Job in mitigation/rebuild without required docs → urgent upload task",
    category: "documentation",
    enabled: true,
    triggerCondition: "Stage is mitigation or rebuild AND has missing_* flag",
    actionTemplate: "Upload [missing doc] for [customer] - $[amount] at stake",
  },
  {
    id: "rule-invoice-aging",
    name: "Invoice aging escalation",
    description: "Stuck invoice crossing 14/30/45/60/90 day threshold → collection action",
    category: "collections",
    enabled: true,
    triggerCondition: "Stage is collections AND days aged crosses threshold",
    actionTemplate: "Follow up on [customer] invoice - aged [days]d, $[amount]",
  },
  {
    id: "rule-adjuster-ghost",
    name: "Adjuster non-responsive",
    description: "Adjuster not responding 14+ days → direct call required",
    category: "claims",
    enabled: true,
    triggerCondition: "Claim with no adjuster response 14+ days",
    actionTemplate: "Call [adjuster] at [carrier] directly - $[amount] in limbo",
  },
  {
    id: "rule-high-value-new",
    name: "High-value job priority flag",
    description: "New collections job >$50K → immediate priority",
    category: "collections",
    enabled: true,
    triggerCondition: "Stage is collections AND amount >= $50,000 AND days < 30",
    actionTemplate: "Priority call to adjuster on high-$ job - [customer]",
  },
  {
    id: "rule-scorecard-slip",
    name: "Staff scorecard declining",
    description: "Staff scorecard trending down → training assignment",
    category: "team",
    enabled: true,
    triggerCondition: "Staff scorecard trend is down",
    actionTemplate: "Assign training to [staff] - scorecard slipping",
  },
  {
    id: "rule-encircle-scope-incomplete",
    name: "Encircle scope under 80% complete",
    description: "Field documentation gap detected via Encircle sync",
    category: "documentation",
    enabled: true,
    triggerCondition: "Encircle session exists AND scope completeness < 80%",
    actionTemplate: "Complete field documentation in Encircle - [customer]",
  },
];

// ── Rule Evaluator ──────────────────────────────────────────

interface RuleContext {
  clientId: string;
  jobs: ClientJob[];
  staff: StaffMember[];
  encircleSessions: EncircleSessionData[];
  existingActionItems: ActionItem[];
  metrics: ClientBusinessMetrics | null;
}

interface GeneratedAction extends Omit<ActionItem, "id" | "completedAt" | "generatedBy"> {}

// Helper: find a default staff member for auto-assignment
function findAssignee(staff: StaffMember[], preferredRole: StaffMember["role"]): string {
  const preferred = staff.find((s) => s.role === preferredRole);
  if (preferred) return preferred.id;
  const admin = staff.find((s) => s.role === "admin");
  if (admin) return admin.id;
  const ops = staff.find((s) => s.role === "ops_manager");
  if (ops) return ops.id;
  return staff[0]?.id || "";
}

// Helper: detect if an action item already exists for a given source
function alreadyExists(
  items: ActionItem[],
  sourceJobId: string | null,
  type: ActionItem["type"]
): boolean {
  return items.some(
    (a) =>
      !a.completedAt &&
      a.sourceJobId === sourceJobId &&
      a.type === type &&
      a.generatedBy === "surge_automation"
  );
}

// Rule 1: Documentation gap at 3.3 approach
function ruleDocGap33(ctx: RuleContext): GeneratedAction[] {
  const actions: GeneratedAction[] = [];
  const assignee = findAssignee(ctx.staff, "admin");
  const dueDate = new Date(Date.now() + 2 * 86400000).toISOString();

  ctx.jobs
    .filter(
      (j) =>
        (j.stage === "mitigation" || j.stage === "rebuild") &&
        j.flags.some((f) => f.includes("missing_"))
    )
    .forEach((job) => {
      if (alreadyExists(ctx.existingActionItems, job.id, "upload_docs")) return;
      const missing = job.flags.filter((f) => f.includes("missing_"));
      actions.push({
        clientId: ctx.clientId,
        assignedToStaffId: assignee,
        type: "upload_docs",
        priority: "urgent",
        title: `Upload missing documentation for ${job.customerName}`,
        description: `Job approaching 3.3 with gaps: ${missing.map((f) => f.replace(/_/g, " ")).join(", ")}. Upload within 48 hours to avoid billing delay.`,
        dollarImpact: job.amount,
        dueDate,
        sourceJobId: job.id,
      });
    });
  return actions;
}

// Rule 2: Invoice aging escalation
function ruleInvoiceAging(ctx: RuleContext): GeneratedAction[] {
  const actions: GeneratedAction[] = [];
  const assignee = findAssignee(ctx.staff, "admin");
  const dueDate = new Date(Date.now() + 1 * 86400000).toISOString();
  const thresholds = [14, 30, 45, 60, 90];

  ctx.jobs
    .filter((j) => j.stage === "collections")
    .forEach((job) => {
      const crossedThreshold = thresholds.find(
        (t) => job.daysInCurrentStage >= t && job.daysInCurrentStage < t + 3
      );
      if (!crossedThreshold) return;
      if (alreadyExists(ctx.existingActionItems, job.id, "follow_up_invoice")) return;
      actions.push({
        clientId: ctx.clientId,
        assignedToStaffId: assignee,
        type: "follow_up_invoice",
        priority: crossedThreshold >= 60 ? "urgent" : crossedThreshold >= 30 ? "high" : "medium",
        title: `${crossedThreshold}-day follow-up: ${job.customerName}`,
        description: `Invoice aged ${job.daysInCurrentStage} days at ${job.carrier}. Automated sequence sent. Manual review and escalation if no response.`,
        dollarImpact: job.amount,
        dueDate,
        sourceJobId: job.id,
      });
    });
  return actions;
}

// Rule 3: Ghost adjuster
function ruleAdjusterGhost(ctx: RuleContext): GeneratedAction[] {
  const actions: GeneratedAction[] = [];
  const assignee = findAssignee(ctx.staff, "ops_manager");
  const dueDate = new Date(Date.now() + 1 * 86400000).toISOString();

  ctx.jobs
    .filter((j) => j.flags.some((f) => f.includes("adjuster_nonresponsive")))
    .forEach((job) => {
      if (alreadyExists(ctx.existingActionItems, job.id, "call_adjuster")) return;
      actions.push({
        clientId: ctx.clientId,
        assignedToStaffId: assignee,
        type: "call_adjuster",
        priority: "urgent",
        title: `Call ${job.adjusterName || "adjuster"} at ${job.carrier} directly`,
        description: `Non-responsive 14+ days on ${job.customerName} job. Direct phone call required. Escalate to supervisor if no answer within 48 hours.`,
        dollarImpact: job.amount,
        dueDate,
        sourceJobId: job.id,
      });
    });
  return actions;
}

// Rule 4: High-value priority
function ruleHighValuePriority(ctx: RuleContext): GeneratedAction[] {
  const actions: GeneratedAction[] = [];
  const assignee = findAssignee(ctx.staff, "ops_manager");
  const dueDate = new Date(Date.now() + 0 * 86400000).toISOString();

  ctx.jobs
    .filter(
      (j) =>
        j.stage === "collections" &&
        j.amount >= 50000 &&
        j.daysInCurrentStage < 30 &&
        !j.flags.includes("adjuster_nonresponsive_120d")
    )
    .forEach((job) => {
      if (alreadyExists(ctx.existingActionItems, job.id, "call_adjuster")) return;
      actions.push({
        clientId: ctx.clientId,
        assignedToStaffId: assignee,
        type: "call_adjuster",
        priority: "urgent",
        title: `Priority: Call ${job.adjusterName || "adjuster"} on ${job.customerName}`,
        description: `High-value job ($${job.amount.toLocaleString()}) recently entered collections. Direct call within 24 hours to establish relationship and timeline before it ages.`,
        dollarImpact: job.amount,
        dueDate,
        sourceJobId: job.id,
      });
    });
  return actions;
}

// Rule 5: Scorecard declining
function ruleScorecardSlip(ctx: RuleContext): GeneratedAction[] {
  const actions: GeneratedAction[] = [];
  const assignee = findAssignee(ctx.staff, "ops_manager");
  const dueDate = new Date(Date.now() + 3 * 86400000).toISOString();

  ctx.staff
    .filter((s) => s.scorecardTrend === "down" && s.scorecardThisWeek < 80)
    .forEach((member) => {
      const existingForThisStaff = ctx.existingActionItems.find(
        (a) =>
          !a.completedAt &&
          a.type === "training_assigned" &&
          a.assignedToStaffId === member.id &&
          a.generatedBy === "surge_automation"
      );
      if (existingForThisStaff) return;
      actions.push({
        clientId: ctx.clientId,
        assignedToStaffId: member.id,
        type: "training_assigned",
        priority: "medium",
        title: `Training check-in: ${member.name}`,
        description: `Scorecard at ${member.scorecardThisWeek}/100 and trending down. Platform recommends assigning ${member.trainingProgress.currentCourse || "a relevant training module"} and a 1:1 coaching conversation this week.`,
        dollarImpact: 0,
        dueDate,
        sourceJobId: null,
      });
    });
  return actions;
}

// Rule 6: Encircle scope incomplete
function ruleEncircleScopeIncomplete(ctx: RuleContext): GeneratedAction[] {
  const actions: GeneratedAction[] = [];
  const assignee = findAssignee(ctx.staff, "tech");
  const dueDate = new Date(Date.now() + 2 * 86400000).toISOString();

  ctx.encircleSessions
    .filter((s) => s.scopeCompletenessPct < 80 && s.scopeGenerated)
    .forEach((session) => {
      const job = ctx.jobs.find((j) => j.id === session.jobId);
      if (!job) return;
      if (alreadyExists(ctx.existingActionItems, job.id, "upload_docs")) return;
      actions.push({
        clientId: ctx.clientId,
        assignedToStaffId: job.assignedTech ? ctx.staff.find((s) => s.name === job.assignedTech)?.id || assignee : assignee,
        type: "upload_docs",
        priority: "high",
        title: `Encircle scope ${session.scopeCompletenessPct}% complete: ${job.customerName}`,
        description: `Encircle flagged incomplete field documentation. Scope is ${session.scopeCompletenessPct}% complete. Adjuster review likely to request supplements. Return to site or upload missing photos/readings.`,
        dollarImpact: job.amount * 0.15,
        dueDate,
        sourceJobId: job.id,
      });
    });
  return actions;
}

// ── Main evaluator ──────────────────────────────────────────

export function runAutomation(ctx: RuleContext): {
  generated: GeneratedAction[];
  log: Omit<AutomationRunLog, "id">;
} {
  const allRules = [
    ruleDocGap33,
    ruleInvoiceAging,
    ruleAdjusterGhost,
    ruleHighValuePriority,
    ruleScorecardSlip,
    ruleEncircleScopeIncomplete,
  ];
  const generated: GeneratedAction[] = [];
  const details: string[] = [];
  allRules.forEach((rule, i) => {
    const results = rule(ctx);
    if (results.length > 0) {
      details.push(`Rule ${RULES[i]?.name || i + 1}: ${results.length} action item${results.length === 1 ? "" : "s"}`);
    }
    generated.push(...results);
  });
  return {
    generated,
    log: {
      clientId: ctx.clientId,
      runAt: new Date().toISOString(),
      rulesEvaluated: allRules.length,
      actionItemsCreated: generated.length,
      details: details.length > 0 ? details : ["No new action items needed. Nothing flagged."],
    },
  };
}
