// ============================================================
// Encircle Integration Stub
// Architecture for pulling Encircle field data into Surge.
// When real Encircle API access is granted, wire fetchFromEncircle().
// ============================================================

import type { EncircleSessionData, ClientJob, IntegrationConnection } from "../types";

// ── Real Encircle API (stub) ────────────────────────────────

// NOTE: Encircle's actual API requires partner agreement with getencircle.com.
// Until that's signed, this module generates realistic mock data based on each
// job's state. When real access is granted, replace `fetchFromEncircle` with
// the actual HTTP client.

interface EncircleApiConfig {
  apiKey: string;
  companyId: string;
  baseUrl?: string;
}

export async function fetchFromEncircle(
  _config: EncircleApiConfig,
  _jobExternalIds: string[]
): Promise<EncircleSessionData[]> {
  // TODO: Real implementation when API credentials are available
  // const response = await fetch(`${config.baseUrl || "https://api.getencircle.com/v1"}/sessions`, {
  //   headers: { Authorization: `Bearer ${config.apiKey}`, "X-Company-ID": config.companyId },
  //   body: JSON.stringify({ jobIds: jobExternalIds })
  // });
  // return await response.json();
  throw new Error("Encircle API credentials required. Mock sync available via mockSyncFromEncircle().");
}

// ── Mock Sync (for dev + demo) ──────────────────────────────

// Generate realistic Encircle session data for a job based on its stage.
// Used until real API is wired up, OR for demo/sandbox mode.

export function mockSyncFromEncircle(jobs: ClientJob[]): EncircleSessionData[] {
  return jobs
    .filter((j) => j.stage !== "closed" && j.stage !== "lost")
    .map((job) => {
      const stageMaturity = {
        lead: 0,
        estimate: 0.3,
        mitigation: 0.7,
        rebuild: 0.9,
        billing: 1.0,
        collections: 1.0,
        closed: 1.0,
        lost: 0,
      }[job.stage];

      const hasGaps = job.flags.some((f) => f.includes("missing_"));
      const completeness = hasGaps
        ? Math.max(40, Math.floor(stageMaturity * 75))
        : Math.floor(80 + stageMaturity * 15);

      return {
        jobId: job.id,
        sessionId: `encircle-${job.externalJobId}`,
        photoCount: Math.floor(15 + stageMaturity * 25 + Math.random() * 10),
        videoCount: Math.floor(1 + stageMaturity * 2),
        hasFloorPlan: stageMaturity >= 0.3,
        hasMoistureReadings: job.jobType === "water" && stageMaturity >= 0.7 && !hasGaps,
        hasDryingLog: job.jobType === "water" && stageMaturity >= 0.9 && !hasGaps,
        hasContentsInventory: stageMaturity >= 0.5,
        hasESignature: stageMaturity >= 0.5,
        scopeGenerated: stageMaturity >= 0.3,
        scopeCompletenessPct: completeness,
        xactimateExported: stageMaturity >= 0.5 && !hasGaps,
        lastUpdated: new Date(
          Date.now() - Math.floor(Math.random() * 5) * 86400000
        ).toISOString(),
      };
    });
}

// ── Connection Helpers ──────────────────────────────────────

export function createConnection(
  clientId: string,
  provider: IntegrationConnection["provider"],
  apiKey: string
): IntegrationConnection {
  return {
    id: `conn-${provider}-${Date.now()}`,
    clientId,
    provider,
    status: "connected",
    lastSyncedAt: new Date().toISOString(),
    lastSyncSummary: "Initial connection established",
    apiKeyMask: apiKey.length > 8 ? `${apiKey.slice(0, 4)}...${apiKey.slice(-4)}` : "••••",
    connectedAt: new Date().toISOString(),
  };
}

// ── Integration Catalog ─────────────────────────────────────

export const INTEGRATION_CATALOG = [
  {
    provider: "encircle" as const,
    name: "Encircle",
    description: "Field documentation, sketching, moisture logs, AI scope generation",
    category: "Field Documentation",
    requirements: "Encircle account + API key (request via account manager)",
    icon: "📸",
    dataSync: ["Photos", "Floor plans", "Moisture readings", "Drying logs", "Contents inventory", "Scope data"],
    docsUrl: "https://www.getencircle.com/",
  },
  {
    provider: "jobnimbus" as const,
    name: "JobNimbus",
    description: "Jobs, contacts, pipeline, documents",
    category: "CRM",
    requirements: "JobNimbus API key from Settings > API",
    icon: "📋",
    dataSync: ["Jobs", "Contacts", "Pipeline stages", "Attachments", "Notes"],
    docsUrl: "https://www.jobnimbus.com/",
  },
  {
    provider: "albi" as const,
    name: "Albi (Albiware)",
    description: "Restoration-specific CRM with native Encircle integration",
    category: "CRM",
    requirements: "Albi account with API access tier",
    icon: "🏗️",
    dataSync: ["Jobs", "Claims", "AR/billing", "Team", "Reports"],
    docsUrl: "https://albiware.com/",
  },
  {
    provider: "xcelerate" as const,
    name: "Xcelerate",
    description: "Restoration CRM with native Encircle integration",
    category: "CRM",
    requirements: "Xcelerate account with API tier",
    icon: "⚡",
    dataSync: ["Jobs", "Claims", "AR/billing", "Team"],
    docsUrl: "https://xcelerate.io/",
  },
  {
    provider: "quickbooks" as const,
    name: "QuickBooks Online",
    description: "Accounting, invoices, payments",
    category: "Accounting",
    requirements: "QBO account + OAuth approval",
    icon: "💰",
    dataSync: ["Invoices", "Payments", "Customers", "Revenue"],
    docsUrl: "https://quickbooks.intuit.com/",
  },
  {
    provider: "xactimate" as const,
    name: "Xactimate",
    description: "Estimating via Verisk",
    category: "Estimating",
    requirements: "Verisk account + Encircle partnership (for sketch auto-generation)",
    icon: "📐",
    dataSync: ["Estimates", "Supplements", "Line items", "Sketches"],
    docsUrl: "https://www.xactware.com/",
  },
];
