// ============================================================
// JobNimbus Integration
// Rehab Restoration uses JN. API key: "AI Business Analysis"
// Mock mode active. Real API swap requires: JN_API_KEY env var.
// ============================================================

import type { ClientJob, JobStage, IntegrationConnection } from "../types";

interface JobNimbusApiConfig {
  apiKey: string;
  baseUrl?: string;
}

// ── Real API (stub) ────────────────────────────────────────

// JN status name → platform JobStage mapping (from rehab-restoration/config/constants.js)
const JN_STATUS_TO_STAGE: Record<string, JobStage> = {
  "1.0 New Lead": "lead",
  "1.1 Follow Up Needed": "lead",
  "1.1 Appointment Scheduled.": "lead",
  "1.1 b Waiting on Adjuster": "lead",
  "1.2 Estimate Needed": "estimate",
  "1.3 Estimate Sent / Needs Approval": "estimate",
  "2.0 Contract Signed & Uploaded/Needs Demo": "estimate",
  "3.0 Needs More Demo": "mitigation",
  "3.1 Demo Complete/Needs Monitor": "mitigation",
  "3.3": "mitigation",
  "4.0 File Turned In/Needs invoiced": "rebuild",
  "5.0 Invoice Built/Sent to Collections": "collections",
  "5.1 Final Payments Collected/Job Closed": "closed",
  "5.2 Settled & Fully Collected": "closed",
  "6.0 Job Lost": "lost",
  "6.1 Collect Final Payment": "collections",
};

export async function fetchJobsFromJobNimbus(
  config: JobNimbusApiConfig
): Promise<ClientJob[]> {
  // TODO: Real JN API implementation when we wire this up for live sync
  //
  // const response = await fetch(
  //   `${config.baseUrl || "https://app.jobnimbus.com/api1"}/jobs`,
  //   { headers: { Authorization: `bearer ${config.apiKey}`, "Content-Type": "application/json" } }
  // );
  // const data = await response.json();
  // return data.results.map(mapJobNimbusJobToPlatform);
  //
  // For live wiring: the api key "AI Business Analysis" is already created
  // for Rehab Restoration. Next step: set JN_API_KEY in environment variables
  // and change this file to call the real endpoint.

  throw new Error(
    "JobNimbus live sync requires JN_API_KEY env var. Use mockSyncFromJobNimbus() for dev."
  );
}

// Map raw JN response → ClientJob (for reference when real API is wired)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapJobNimbusJobToPlatform(jn: any, clientId: string): ClientJob {
  const stage: JobStage = JN_STATUS_TO_STAGE[jn.status_name] || "lead";
  const now = Date.now();
  const dateUpdated = new Date(jn.date_updated * 1000);
  const dateCreated = new Date(jn.date_created * 1000);

  return {
    id: `jn-${jn.jnid || jn.recid}`,
    clientId,
    externalJobId: jn.number || `JN-${jn.recid}`,
    customerName: jn.display_name || jn.primary?.name || "Unknown",
    address: jn.address_line1 ? `${jn.address_line1}, ${jn.city}, ${jn.state_text}` : "",
    jobType: classifyJobType(jn.description || jn.tags?.join(" ") || ""),
    carrier: jn.insurance_company || "",
    adjusterName: jn.adjuster_name || "",
    adjusterEmail: jn.adjuster_email || "",
    stage,
    amount: Number(jn.approved_amount) || Number(jn.total) || 0,
    daysInCurrentStage: Math.max(
      0,
      Math.floor((now - dateUpdated.getTime()) / 86400000)
    ),
    daysFromFNOL: Math.max(
      0,
      Math.floor((now - dateCreated.getTime()) / 86400000)
    ),
    flags: detectJobFlags(jn),
    lastActivity: dateUpdated.toISOString(),
    assignedTech: jn.assigned_to?.name || "",
    assignedAdmin: "",
    notes: jn.description || "",
  };
}

function classifyJobType(text: string): ClientJob["jobType"] {
  const lower = text.toLowerCase();
  if (lower.includes("water") || lower.includes("flood") || lower.includes("leak"))
    return "water";
  if (lower.includes("fire") || lower.includes("smoke") || lower.includes("soot"))
    return "fire";
  if (lower.includes("mold") || lower.includes("remediation")) return "mold";
  return "other";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function detectJobFlags(jn: any): string[] {
  const flags: string[] = [];
  const description = (jn.description || "").toLowerCase();
  const daysAgo = (Date.now() - (jn.date_updated || 0) * 1000) / 86400000;

  if (jn.status_name?.startsWith("5.0") && daysAgo > 90) {
    flags.push("extreme_age");
  }
  if (jn.status_name?.startsWith("5.0") && Number(jn.approved_amount) >= 50000) {
    flags.push("large_exposure");
  }
  if (
    jn.status_name?.startsWith("3.") &&
    (!description.includes("moisture") || !description.includes("photo"))
  ) {
    flags.push("missing_documentation");
  }
  return flags;
}

// ── Mock Sync (for dev + demo) ─────────────────────────────

// For Phase 4 mock: derive new "synced" jobs from existing seed. In real-world
// wiring this function will be replaced with fetchJobsFromJobNimbus().

export function mockSyncFromJobNimbus(existingJobs: ClientJob[]): ClientJob[] {
  // In real sync, we'd pull fresh data. In mock, we update daysInCurrentStage
  // and last activity to simulate a "refresh."
  return existingJobs.map((j) => ({
    ...j,
    daysInCurrentStage: j.daysInCurrentStage + 1, // one more day since last sync
    lastActivity: new Date().toISOString(),
  }));
}

// ── Connection helpers ─────────────────────────────────────

export function createJobNimbusConnection(
  clientId: string,
  apiKeyName: string
): IntegrationConnection {
  return {
    id: `conn-jobnimbus-${clientId}-${Date.now()}`,
    clientId,
    provider: "jobnimbus",
    status: "connected",
    lastSyncedAt: new Date().toISOString(),
    lastSyncSummary: `API key "${apiKeyName}" validated`,
    apiKeyMask: apiKeyName.length > 8
      ? `${apiKeyName.slice(0, 4)}...${apiKeyName.slice(-4)}`
      : "••••",
    connectedAt: new Date().toISOString(),
  };
}
