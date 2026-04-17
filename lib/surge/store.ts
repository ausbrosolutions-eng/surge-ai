"use client";
import { useCallback, useEffect, useState } from "react";
import type {
  SurgeStore,
  Prospect,
  Signal,
  Audit,
  Activity,
  ActionItem,
  IntegrationConnection,
  EncircleSessionData,
  AutomationRunLog,
  WeeklyReport,
  ProspectAutomationSuggestion,
  ProspectAutomationRunLog,
  EmailDigest,
  ScheduleConfig,
} from "./types";
import {
  seedProspects,
  seedSignals,
  seedAudits,
  seedActivities,
  seedRevenueEvents,
  seedRetainerClients,
  seedClientJobs,
  seedStaff,
  seedActionItems,
  seedClientMetrics,
  seedIntegrations,
  seedEncircleSessions,
  seedAutomationRuns,
  seedWeeklyReports,
  emptyStore,
} from "./seedData";
import { runAutomation } from "./rules";
import { mockSyncFromEncircle, createConnection } from "./integrations/encircle";
import { mockSyncFromJobNimbus, createJobNimbusConnection } from "./integrations/jobnimbus";
import { generateWeeklyReport } from "./reports";
import { runProspectAutomation } from "./prospectRules";
import { buildWeeklyDigest, sendEmail } from "./emails/weeklyDigest";

const STORAGE_KEY = "surge-platform-v1";

function loadStore(): SurgeStore {
  if (typeof window === "undefined") {
    return { ...emptyStore, initialized: false };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seeded: SurgeStore = {
        prospects: seedProspects,
        signals: seedSignals,
        audits: seedAudits,
        activities: seedActivities,
        revenueEvents: seedRevenueEvents,
        retainerClients: seedRetainerClients,
        jobs: seedClientJobs,
        staff: seedStaff,
        actionItems: seedActionItems,
        metrics: seedClientMetrics,
        integrations: seedIntegrations,
        encircleSessions: seedEncircleSessions,
        automationRuns: seedAutomationRuns,
        weeklyReports: seedWeeklyReports,
        prospectAutomationSuggestions: [],
        prospectAutomationRuns: [],
        emailDigests: [],
        schedules: [],
        initialized: true,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
      return seeded;
    }
    const parsed = JSON.parse(raw) as Partial<SurgeStore>;
    // Backfill Phase 3/4 fields for users on older stored state
    return {
      prospects: parsed.prospects || [],
      signals: parsed.signals || [],
      audits: parsed.audits || [],
      activities: parsed.activities || [],
      revenueEvents: parsed.revenueEvents || [],
      retainerClients: parsed.retainerClients || [],
      jobs: parsed.jobs || [],
      staff: parsed.staff || [],
      actionItems: parsed.actionItems || [],
      metrics: parsed.metrics || [],
      integrations: parsed.integrations || seedIntegrations,
      encircleSessions: parsed.encircleSessions || seedEncircleSessions,
      automationRuns: parsed.automationRuns || [],
      weeklyReports: parsed.weeklyReports || [],
      prospectAutomationSuggestions: parsed.prospectAutomationSuggestions || [],
      prospectAutomationRuns: parsed.prospectAutomationRuns || [],
      emailDigests: parsed.emailDigests || [],
      schedules: parsed.schedules || [],
      initialized: true,
    };
  } catch {
    return { ...emptyStore, initialized: false };
  }
}

function persist(store: SurgeStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function useSurgeStore() {
  const [store, setStore] = useState<SurgeStore>(() => ({ ...emptyStore, initialized: false }));
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const loaded = loadStore();
    setStore(loaded);
    setHydrated(true);
  }, []);

  const updateStore = useCallback((updater: (s: SurgeStore) => SurgeStore) => {
    setStore((prev) => {
      const next = updater(prev);
      persist(next);
      return next;
    });
  }, []);

  const saveProspect = useCallback((p: Prospect) => {
    updateStore((s) => {
      const exists = s.prospects.find((x) => x.id === p.id);
      const next = exists
        ? s.prospects.map((x) => (x.id === p.id ? { ...p, updatedAt: new Date().toISOString() } : x))
        : [...s.prospects, { ...p, updatedAt: new Date().toISOString() }];
      return { ...s, prospects: next };
    });
  }, [updateStore]);

  const saveSignal = useCallback((sig: Signal) => {
    updateStore((s) => {
      const exists = s.signals.find((x) => x.id === sig.id);
      return {
        ...s,
        signals: exists ? s.signals.map((x) => (x.id === sig.id ? sig : x)) : [...s.signals, sig],
      };
    });
  }, [updateStore]);

  const saveAudit = useCallback((a: Audit) => {
    updateStore((s) => {
      const exists = s.audits.find((x) => x.id === a.id);
      return {
        ...s,
        audits: exists ? s.audits.map((x) => (x.id === a.id ? a : x)) : [...s.audits, a],
      };
    });
  }, [updateStore]);

  const saveActivity = useCallback((a: Activity) => {
    updateStore((s) => ({ ...s, activities: [...s.activities, a] }));
  }, [updateStore]);

  const saveActionItem = useCallback((ai: ActionItem) => {
    updateStore((s) => {
      const exists = s.actionItems.find((x) => x.id === ai.id);
      return {
        ...s,
        actionItems: exists ? s.actionItems.map((x) => (x.id === ai.id ? ai : x)) : [...s.actionItems, ai],
      };
    });
  }, [updateStore]);

  const completeActionItem = useCallback((id: string) => {
    updateStore((s) => ({
      ...s,
      actionItems: s.actionItems.map((ai) =>
        ai.id === id ? { ...ai, completedAt: new Date().toISOString() } : ai
      ),
    }));
  }, [updateStore]);

  const resetStore = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  }, []);

  // ── Phase 3: Automation, Integrations, Reports ─────────────

  const runClientAutomation = useCallback(
    (clientId: string): { created: number; log: AutomationRunLog } => {
      let summary = { created: 0, log: {} as AutomationRunLog };
      updateStore((s) => {
        const ctx = {
          clientId,
          jobs: s.jobs.filter((j) => j.clientId === clientId),
          staff: s.staff.filter((st) => st.clientId === clientId),
          encircleSessions: s.encircleSessions,
          existingActionItems: s.actionItems.filter((a) => a.clientId === clientId),
          metrics: s.metrics.find((m) => m.clientId === clientId) || null,
        };
        const result = runAutomation(ctx);
        const newItems: ActionItem[] = result.generated.map((g, i) => ({
          ...g,
          id: `ai-auto-${Date.now()}-${i}`,
          completedAt: null,
          generatedBy: "surge_automation" as const,
        }));
        const log: AutomationRunLog = {
          ...result.log,
          id: `run-${Date.now()}`,
        };
        summary = { created: newItems.length, log };
        return {
          ...s,
          actionItems: [...s.actionItems, ...newItems],
          automationRuns: [log, ...s.automationRuns].slice(0, 50),
        };
      });
      return summary;
    },
    [updateStore]
  );

  const syncEncircleForClient = useCallback(
    (clientId: string): { sessions: number } => {
      let count = 0;
      updateStore((s) => {
        const clientJobs = s.jobs.filter((j) => j.clientId === clientId);
        const newSessions = mockSyncFromEncircle(clientJobs);
        count = newSessions.length;
        // Replace existing sessions for this client
        const otherClientSessions = s.encircleSessions.filter(
          (sess) => !clientJobs.some((j) => j.id === sess.jobId)
        );
        // Update integration status
        const updatedIntegrations = s.integrations.map((conn) =>
          conn.clientId === clientId && conn.provider === "encircle"
            ? {
                ...conn,
                status: "connected" as const,
                lastSyncedAt: new Date().toISOString(),
                lastSyncSummary: `Synced ${newSessions.length} active sessions from Encircle (mock data)`,
                apiKeyMask: conn.apiKeyMask || "demo...mock",
                connectedAt: conn.connectedAt || new Date().toISOString(),
              }
            : conn
        );
        // Add connection if doesn't exist
        const hasEncircleConn = updatedIntegrations.some(
          (c) => c.clientId === clientId && c.provider === "encircle"
        );
        const finalIntegrations = hasEncircleConn
          ? updatedIntegrations
          : [...updatedIntegrations, createConnection(clientId, "encircle", "demo-key")];
        return {
          ...s,
          encircleSessions: [...otherClientSessions, ...newSessions],
          integrations: finalIntegrations,
        };
      });
      return { sessions: count };
    },
    [updateStore]
  );

  const saveIntegration = useCallback((conn: IntegrationConnection) => {
    updateStore((s) => {
      const exists = s.integrations.find((x) => x.id === conn.id);
      return {
        ...s,
        integrations: exists
          ? s.integrations.map((x) => (x.id === conn.id ? conn : x))
          : [...s.integrations, conn],
      };
    });
  }, [updateStore]);

  const generateReport = useCallback(
    (clientId: string): WeeklyReport | null => {
      let generated: WeeklyReport | null = null;
      updateStore((s) => {
        const client = s.retainerClients.find((c) => c.id === clientId);
        const metrics = s.metrics.find((m) => m.clientId === clientId);
        if (!client || !metrics) return s;
        const previousReport = s.weeklyReports
          .filter((r) => r.clientId === clientId)
          .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))[0];
        const previousMetrics = previousReport
          ? {
              ...metrics,
              collections: {
                ...metrics.collections,
                recoveredThisMonth: metrics.collections.recoveredThisMonth - previousReport.highlights.revenueRecovered / 4,
              },
              pipeline: {
                ...metrics.pipeline,
                activeJobs: metrics.pipeline.activeJobs - 3,
              },
              team: {
                ...metrics.team,
                avgScorecardThisWeek: metrics.team.avgScorecardThisWeek - 2,
              },
            }
          : null;
        const report = generateWeeklyReport({
          clientId,
          client,
          metrics,
          previousMetrics,
          jobs: s.jobs.filter((j) => j.clientId === clientId),
          staff: s.staff.filter((st) => st.clientId === clientId),
          actionItems: s.actionItems.filter((a) => a.clientId === clientId),
        });
        generated = report;
        return { ...s, weeklyReports: [report, ...s.weeklyReports] };
      });
      return generated;
    },
    [updateStore]
  );

  // ── Phase 4: Prospect Automation, Email, JobNimbus ─────────

  const runProspectAutomationForSurge = useCallback((): {
    created: number;
    log: ProspectAutomationRunLog;
  } => {
    let summary = { created: 0, log: {} as ProspectAutomationRunLog };
    updateStore((s) => {
      const ctx = {
        prospects: s.prospects,
        activities: s.activities,
        audits: s.audits,
        signals: s.signals,
        existingSuggestions: s.prospectAutomationSuggestions,
      };
      const result = runProspectAutomation(ctx);
      const newSuggestions: ProspectAutomationSuggestion[] = result.suggestions.map((g, i) => ({
        ...g,
        id: `sug-${Date.now()}-${i}`,
        detectedAt: new Date().toISOString(),
      }));
      const log: ProspectAutomationRunLog = {
        ...result.log,
        id: `prun-${Date.now()}`,
      };
      summary = { created: newSuggestions.length, log };
      return {
        ...s,
        prospectAutomationSuggestions: [...s.prospectAutomationSuggestions, ...newSuggestions],
        prospectAutomationRuns: [log, ...s.prospectAutomationRuns].slice(0, 50),
      };
    });
    return summary;
  }, [updateStore]);

  const dismissSuggestion = useCallback((id: string) => {
    updateStore((s) => ({
      ...s,
      prospectAutomationSuggestions: s.prospectAutomationSuggestions.filter((x) => x.id !== id),
    }));
  }, [updateStore]);

  const syncJobNimbusForClient = useCallback(
    (clientId: string): { jobs: number } => {
      let count = 0;
      updateStore((s) => {
        const clientJobs = s.jobs.filter((j) => j.clientId === clientId);
        const synced = mockSyncFromJobNimbus(clientJobs);
        count = synced.length;
        const otherClientJobs = s.jobs.filter((j) => j.clientId !== clientId);
        // Update or create JN connection
        const hasConn = s.integrations.some(
          (c) => c.clientId === clientId && c.provider === "jobnimbus"
        );
        const updatedConnections = hasConn
          ? s.integrations.map((c) =>
              c.clientId === clientId && c.provider === "jobnimbus"
                ? {
                    ...c,
                    status: "connected" as const,
                    lastSyncedAt: new Date().toISOString(),
                    lastSyncSummary: `Resynced ${synced.length} jobs from JobNimbus`,
                  }
                : c
            )
          : [...s.integrations, createJobNimbusConnection(clientId, "AI Business Analysis")];
        return {
          ...s,
          jobs: [...otherClientJobs, ...synced],
          integrations: updatedConnections,
        };
      });
      return { jobs: count };
    },
    [updateStore]
  );

  const sendReportDigest = useCallback(
    async (reportId: string): Promise<{ success: boolean; error?: string }> => {
      const state = store;
      const report = state.weeklyReports.find((r) => r.id === reportId);
      if (!report) return { success: false, error: "Report not found" };
      const client = state.retainerClients.find((c) => c.id === report.clientId);
      if (!client) return { success: false, error: "Client not found" };
      const digest = buildWeeklyDigest(report, client);
      const digestId = `digest-${Date.now()}`;
      // Save draft first
      updateStore((s) => ({
        ...s,
        emailDigests: [
          ...s.emailDigests,
          {
            id: digestId,
            clientId: report.clientId,
            reportId: report.id,
            toEmail: `${client.contactName.toLowerCase().replace(/\s+/g, ".")}@${client.companyName.toLowerCase().replace(/\s+/g, "")}.com`,
            toName: client.contactName,
            subject: digest.subject,
            htmlBody: digest.htmlBody,
            status: "draft",
            scheduledFor: null,
            sentAt: null,
            createdAt: new Date().toISOString(),
          },
        ],
      }));
      // "Send" (mocked)
      const result = await sendEmail({
        to: `${client.contactName.toLowerCase().replace(/\s+/g, ".")}@${client.companyName.toLowerCase().replace(/\s+/g, "")}.com`,
        toName: client.contactName,
        subject: digest.subject,
        html: digest.htmlBody,
        text: digest.plainText,
      });
      // Update status
      updateStore((s) => ({
        ...s,
        emailDigests: s.emailDigests.map((d) =>
          d.id === digestId
            ? {
                ...d,
                status: result.success ? ("sent" as const) : ("failed" as const),
                sentAt: result.success ? new Date().toISOString() : null,
              }
            : d
        ),
      }));
      return result.success ? { success: true } : { success: false, error: result.error };
    },
    [store, updateStore]
  );

  const previewReportDigest = useCallback(
    (reportId: string): { subject: string; htmlBody: string; plainText: string } | null => {
      const report = store.weeklyReports.find((r) => r.id === reportId);
      if (!report) return null;
      const client = store.retainerClients.find((c) => c.id === report.clientId);
      if (!client) return null;
      return buildWeeklyDigest(report, client);
    },
    [store]
  );

  const saveSchedule = useCallback((schedule: ScheduleConfig) => {
    updateStore((s) => {
      const exists = s.schedules.find((x) => x.id === schedule.id);
      return {
        ...s,
        schedules: exists
          ? s.schedules.map((x) => (x.id === schedule.id ? schedule : x))
          : [...s.schedules, schedule],
      };
    });
  }, [updateStore]);

  return {
    store,
    hydrated,
    saveProspect,
    saveSignal,
    saveAudit,
    saveActivity,
    saveActionItem,
    completeActionItem,
    resetStore,
    // Phase 3
    runClientAutomation,
    syncEncircleForClient,
    saveIntegration,
    generateReport,
    // Phase 4
    runProspectAutomationForSurge,
    dismissSuggestion,
    syncJobNimbusForClient,
    sendReportDigest,
    previewReportDigest,
    saveSchedule,
  };
}
