// ============================================================
// Surge Platform - Type Definitions
// Separate from legacy Agency OS types. localStorage-only.
// ============================================================

// ── Sales Pipeline (Austin's CRM) ───────────────────────────

export type ProspectTier = 1 | 2 | 3;

export type ProspectStage =
  | "unreached"
  | "touched"
  | "responding"
  | "meeting_booked"
  | "discovery_done"
  | "audit_proposed"
  | "audit_booked"
  | "audit_delivered"
  | "retainer_signed"
  | "lost";

export type SpinStage = "situation" | "problem" | "implication" | "payoff" | "none";

export type TriggerEventType =
  | "hiring"
  | "review"
  | "expansion"
  | "leadership"
  | "competitor"
  | "award"
  | "referral"
  | "cold";

export interface Prospect {
  id: string;
  companyName: string;
  contactName: string;
  title: string;
  email: string;
  phone: string;
  linkedIn: string;
  trade: "restoration" | "hvac" | "plumbing" | "roofing" | "other";
  annualRevenue: number;
  employeeCount: number;
  city: string;
  state: string;
  tier: ProspectTier;
  icpScore: number; // 6-30
  stage: ProspectStage;
  spinStage: SpinStage;
  triggerEvent: TriggerEventType;
  triggerEventDate: string;
  triggerEventSummary: string;
  referralSource: string;
  lastTouch: string;
  nextTouch: string;
  touchCount: number;
  estimatedValue: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ── Signals (Trigger Events) ────────────────────────────────

export interface Signal {
  id: string;
  type: TriggerEventType;
  source: "google_alerts" | "linkedin" | "indeed" | "reviews" | "manual" | "referral";
  companyName: string;
  contactName: string;
  summary: string;
  url: string;
  detectedAt: string;
  prospectId: string | null;
  status: "new" | "reviewed" | "actioned" | "dismissed";
  actionTaken: string;
}

// ── Audits (Paid Ops Audits) ────────────────────────────────

export type AuditStage =
  | "contract_sent"
  | "paid"
  | "kickoff_scheduled"
  | "kickoff_done"
  | "data_pulled"
  | "analysis"
  | "report_draft"
  | "report_delivered"
  | "review_call_done"
  | "converted_to_retainer"
  | "lost_post_audit";

export interface Audit {
  id: string;
  prospectId: string;
  clientId: string | null;
  companyName: string;
  startDate: string;
  targetDeliveryDate: string;
  stage: AuditStage;
  paymentAmount: number;
  apiAccessGranted: boolean;
  findings: {
    stuckRevenue: number;
    blockedJobs: number;
    dataIntegrityScore: number;
    recommendedPath: "A" | "B" | "C" | null;
    projectedROI: number;
  };
  outcomes: {
    retainerConverted: boolean;
    retainerPhase: 1 | 2 | 3 | null;
    creditApplied: boolean;
  };
  createdAt: string;
}

// ── Activities (Every Interaction Logged) ───────────────────

export type ActivityType =
  | "email_sent"
  | "email_received"
  | "call"
  | "meeting"
  | "linkedin_touch"
  | "contract_sent"
  | "payment_received"
  | "note";

export interface Activity {
  id: string;
  prospectId: string | null;
  clientId: string | null;
  type: ActivityType;
  direction: "inbound" | "outbound";
  subject: string;
  summary: string;
  recordingUrl: string;
  sentiment: "positive" | "neutral" | "negative";
  spinStageReached: SpinStage;
  nextStepIdentified: string;
  nextStepDate: string;
  createdAt: string;
}

// ── Revenue Events ──────────────────────────────────────────

export interface RevenueEvent {
  id: string;
  type: "audit_payment" | "retainer_payment" | "referral_payout" | "expense";
  amount: number;
  clientId: string | null;
  prospectId: string | null;
  description: string;
  date: string;
}

// ── Retainer Clients (Active Surge Engagements) ─────────────

export interface RetainerClient {
  id: string;
  companyName: string;
  contactName: string;
  phase: 1 | 2 | 3;
  phaseStartDate: string;
  monthlyRetainer: number;
  healthScore: number; // 0-100
  lastCheckIn: string;
  nextCheckIn: string;
  keyChampion: string;
  notes: string;
}

// ── Client Platform Entities (Multi-tenant) ─────────────────

export type JobStage =
  | "lead"
  | "estimate"
  | "mitigation"
  | "rebuild"
  | "billing"
  | "collections"
  | "closed"
  | "lost";

export interface ClientJob {
  id: string;
  clientId: string;
  externalJobId: string;
  customerName: string;
  address: string;
  jobType: "water" | "fire" | "mold" | "other";
  carrier: string;
  adjusterName: string;
  adjusterEmail: string;
  stage: JobStage;
  amount: number;
  daysInCurrentStage: number;
  daysFromFNOL: number;
  flags: string[];
  lastActivity: string;
  assignedTech: string;
  assignedAdmin: string;
  notes: string;
}

export interface StaffMember {
  id: string;
  clientId: string;
  name: string;
  role: "owner" | "ops_manager" | "admin" | "tech" | "estimator";
  email: string;
  kpis: {
    jobsHandled: number;
    docsCompleted: number;
    supplementsApproved: number;
    reviewsGenerated: number;
    collectionsFollowedUp: number;
    avgResponseTimeHours: number;
  };
  trainingProgress: {
    coursesCompleted: string[];
    certificationsEarned: string[];
    currentCourse: string | null;
  };
  scorecardThisWeek: number;
  scorecardTrend: "up" | "down" | "flat";
}

export type ActionItemType =
  | "call_adjuster"
  | "upload_docs"
  | "follow_up_invoice"
  | "supplement_prep"
  | "response_review"
  | "training_assigned";

export interface ActionItem {
  id: string;
  clientId: string;
  assignedToStaffId: string;
  type: ActionItemType;
  priority: "urgent" | "high" | "medium";
  title: string;
  description: string;
  dollarImpact: number;
  dueDate: string;
  completedAt: string | null;
  sourceJobId: string | null;
  generatedBy: "surge_automation" | "manual" | "ai_recommendation";
}

export interface ClientBusinessMetrics {
  clientId: string;
  asOfDate: string;
  collections: {
    totalStuck: number;
    jobsStuck: number;
    avgDaysAged: number;
    recoveredThisMonth: number;
    recoveredYTD: number;
  };
  pipeline: {
    activeJobs: number;
    pipelineValue: number;
    blockedAtBilling: number;
    documentationGapScore: number;
  };
  team: {
    memberCount: number;
    activeToday: number;
    avgScorecardThisWeek: number;
  };
  streaks: {
    daysWithCleanFollowUps: number;
    weeksWith100Compliance: number;
    daysAllFocusItemsDone: number;
  };
}

// ── Encircle Integration ────────────────────────────────────

export type IntegrationStatus = "not_connected" | "syncing" | "connected" | "error";

export interface IntegrationConnection {
  id: string;
  clientId: string;
  provider: "encircle" | "jobnimbus" | "albi" | "xcelerate" | "quickbooks" | "xactimate";
  status: IntegrationStatus;
  lastSyncedAt: string | null;
  lastSyncSummary: string;
  apiKeyMask: string;
  connectedAt: string | null;
}

export interface EncircleSessionData {
  jobId: string;
  sessionId: string;
  photoCount: number;
  videoCount: number;
  hasFloorPlan: boolean;
  hasMoistureReadings: boolean;
  hasDryingLog: boolean;
  hasContentsInventory: boolean;
  hasESignature: boolean;
  scopeGenerated: boolean;
  scopeCompletenessPct: number;
  xactimateExported: boolean;
  lastUpdated: string;
}

// ── Rules Engine ────────────────────────────────────────────

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  category: "documentation" | "collections" | "claims" | "team" | "reviews";
  enabled: boolean;
  triggerCondition: string;
  actionTemplate: string;
}

export interface AutomationRunLog {
  id: string;
  clientId: string;
  runAt: string;
  rulesEvaluated: number;
  actionItemsCreated: number;
  details: string[];
}

// ── Prospect Automation (Austin's CRM) ──────────────────────

export interface ProspectAutomationSuggestion {
  id: string;
  prospectId: string;
  type:
    | "stale_tier_1"
    | "pattern_interrupt_ready"
    | "stage_stuck"
    | "audit_day_12_plus"
    | "retainer_follow_up"
    | "referral_uncontacted"
    | "no_next_touch_scheduled";
  priority: "urgent" | "high" | "medium";
  title: string;
  description: string;
  suggestedAction: string;
  dollarImpact: number;
  detectedAt: string;
}

export interface ProspectAutomationRunLog {
  id: string;
  runAt: string;
  prospectsEvaluated: number;
  suggestionsGenerated: number;
  details: string[];
}

// ── Email Digests ───────────────────────────────────────────

export interface EmailDigest {
  id: string;
  clientId: string;
  reportId: string;
  toEmail: string;
  toName: string;
  subject: string;
  htmlBody: string;
  status: "draft" | "sent" | "failed";
  scheduledFor: string | null;
  sentAt: string | null;
  createdAt: string;
}

// ── Schedule Config ─────────────────────────────────────────

export interface ScheduleConfig {
  id: string;
  clientId: string;
  type: "client_automation" | "prospect_automation" | "weekly_report";
  cadence: "daily" | "weekly" | "hourly" | "manual";
  dayOfWeek?: number; // 0-6, 1 = Monday
  hourOfDay?: number; // 0-23
  enabled: boolean;
  lastRun: string | null;
  nextRun: string | null;
  notes: string;
}

// ── Weekly Reports ──────────────────────────────────────────

export interface WeeklyReport {
  id: string;
  clientId: string;
  weekStarting: string;
  weekEnding: string;
  generatedAt: string;
  highlights: {
    revenueRecovered: number;
    jobsClosed: number;
    supplementsApproved: number;
    actionItemsCompleted: number;
    documentationGapScore: number;
  };
  weekOverWeek: {
    recoveryChange: number;
    activeJobsChange: number;
    avgScorecardChange: number;
  };
  topPerformers: { staffId: string; name: string; score: number }[];
  concerns: string[];
  nextWeekPriorities: string[];
  summary: string;
}

// ── Store Shape ─────────────────────────────────────────────

export interface SurgeStore {
  // Austin's CRM
  prospects: Prospect[];
  signals: Signal[];
  audits: Audit[];
  activities: Activity[];
  revenueEvents: RevenueEvent[];
  retainerClients: RetainerClient[];

  // Client Platform (multi-tenant via clientId)
  jobs: ClientJob[];
  staff: StaffMember[];
  actionItems: ActionItem[];
  metrics: ClientBusinessMetrics[];

  // Phase 3 additions
  integrations: IntegrationConnection[];
  encircleSessions: EncircleSessionData[];
  automationRuns: AutomationRunLog[];
  weeklyReports: WeeklyReport[];

  // Phase 4 additions
  prospectAutomationSuggestions: ProspectAutomationSuggestion[];
  prospectAutomationRuns: ProspectAutomationRunLog[];
  emailDigests: EmailDigest[];
  schedules: ScheduleConfig[];

  initialized: boolean;
}

// ── Constants ───────────────────────────────────────────────

export const STAGE_LABELS: Record<ProspectStage, string> = {
  unreached: "Unreached",
  touched: "Touched",
  responding: "Responding",
  meeting_booked: "Meeting Booked",
  discovery_done: "Discovery Done",
  audit_proposed: "Audit Proposed",
  audit_booked: "Audit Booked",
  audit_delivered: "Audit Delivered",
  retainer_signed: "Retainer Signed",
  lost: "Lost",
};

export const STAGE_ORDER: ProspectStage[] = [
  "unreached",
  "touched",
  "responding",
  "meeting_booked",
  "discovery_done",
  "audit_proposed",
  "audit_booked",
  "audit_delivered",
  "retainer_signed",
];

export const TIER_COLORS: Record<ProspectTier, string> = {
  1: "#EF4444", // red - highest priority
  2: "#F59E0B", // amber
  3: "#6B7280", // gray
};

export const SIGNAL_ICONS: Record<TriggerEventType, string> = {
  hiring: "💼",
  review: "⭐",
  expansion: "📈",
  leadership: "👤",
  competitor: "⚔️",
  award: "🏆",
  referral: "🤝",
  cold: "❄️",
};
