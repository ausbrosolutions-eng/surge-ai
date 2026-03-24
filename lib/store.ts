"use client";
import { useCallback, useEffect, useState } from "react";
import type {
  AgencyStore,
  Client,
  Lead,
  AgencyTask,
  ReviewEntry,
  MonthlyReport,
  ChecklistItem,
  GBPPost,
  LSALead,
  CitationEntry,
  BacklinkEntry,
  ContentGap,
  ReviewPlatformStats,
} from "./types";
import {
  seedClient,
  seedLeads,
  seedTasks,
  seedReviews,
  seedGBPPosts,
  seedContentGaps,
  seedCitations,
  seedReviewStats,
} from "./data/seedData";
import { checklistMap, calculateScore, calculateOverallScore } from "./data/checklists";

const KEYS = {
  clients: "blueprint_clients",
  leads: "blueprint_leads",
  tasks: "blueprint_tasks",
  reviews: "blueprint_reviews",
  reports: "blueprint_reports",
  checklists: "blueprint_checklists",
  gbpPosts: "blueprint_gbp_posts",
  lsaLeads: "blueprint_lsa_leads",
  citations: "blueprint_citations",
  backlinks: "blueprint_backlinks",
  contentGaps: "blueprint_content_gaps",
  reviewStats: "blueprint_review_stats",
  initialized: "blueprint_initialized",
};

function ls<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

function lsSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

function initializeStore() {
  const initialized = ls<boolean>(KEYS.initialized, false);
  if (!initialized) {
    // Seed all default checklists for the seed client
    const checklists: Record<string, ChecklistItem[]> = {};
    Object.entries(checklistMap).forEach(([module, items]) => {
      checklists[`${seedClient.id}_${module}`] = items.map((i) => ({ ...i }));
    });

    const citations: Record<string, CitationEntry[]> = {
      [seedClient.id]: seedCitations.map((c) => ({ ...c })),
    };
    const contentGaps: Record<string, ContentGap[]> = {
      [seedClient.id]: seedContentGaps.map((g) => ({ ...g })),
    };
    const reviewStats: Record<string, ReviewPlatformStats[]> = {
      [seedClient.id]: seedReviewStats.map((s) => ({ ...s })),
    };

    lsSet(KEYS.clients, [seedClient]);
    lsSet(KEYS.leads, seedLeads);
    lsSet(KEYS.tasks, seedTasks);
    lsSet(KEYS.reviews, seedReviews);
    lsSet(KEYS.reports, []);
    lsSet(KEYS.checklists, checklists);
    lsSet(KEYS.gbpPosts, seedGBPPosts);
    lsSet(KEYS.lsaLeads, []);
    lsSet(KEYS.citations, citations);
    lsSet(KEYS.backlinks, []);
    lsSet(KEYS.contentGaps, contentGaps);
    lsSet(KEYS.reviewStats, reviewStats);
    lsSet(KEYS.initialized, true);
  }
}

// ── Main store hook ───────────────────────────────────────────
export function useStore() {
  const [store, setStore] = useState<AgencyStore>({
    clients: [],
    leads: [],
    tasks: [],
    reviews: [],
    reports: [],
    checklists: {},
    gbpPosts: [],
    lsaLeads: [],
    citations: {},
    backlinks: [],
    contentGaps: {},
    reviewStats: {},
    initialized: false,
  });

  const loadStore = useCallback(() => {
    initializeStore();
    setStore({
      clients: ls<Client[]>(KEYS.clients, []),
      leads: ls<Lead[]>(KEYS.leads, []),
      tasks: ls<AgencyTask[]>(KEYS.tasks, []),
      reviews: ls<ReviewEntry[]>(KEYS.reviews, []),
      reports: ls<MonthlyReport[]>(KEYS.reports, []),
      checklists: ls<Record<string, ChecklistItem[]>>(KEYS.checklists, {}),
      gbpPosts: ls<GBPPost[]>(KEYS.gbpPosts, []),
      lsaLeads: ls<LSALead[]>(KEYS.lsaLeads, []),
      citations: ls<Record<string, CitationEntry[]>>(KEYS.citations, {}),
      backlinks: ls<BacklinkEntry[]>(KEYS.backlinks, []),
      contentGaps: ls<Record<string, ContentGap[]>>(KEYS.contentGaps, {}),
      reviewStats: ls<Record<string, ReviewPlatformStats[]>>(KEYS.reviewStats, {}),
      initialized: true,
    });
  }, []);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  // ── Clients ────────────────────────────────────────────────
  const saveClient = useCallback(
    (client: Client) => {
      const clients = ls<Client[]>(KEYS.clients, []);
      const idx = clients.findIndex((c) => c.id === client.id);
      const next =
        idx >= 0
          ? clients.map((c) => (c.id === client.id ? client : c))
          : [...clients, client];
      lsSet(KEYS.clients, next);

      // Auto-create checklists if new client
      if (idx < 0) {
        const checklists = ls<Record<string, ChecklistItem[]>>(KEYS.checklists, {});
        Object.entries(checklistMap).forEach(([module, items]) => {
          const key = `${client.id}_${module}`;
          if (!checklists[key]) {
            checklists[key] = items.map((i) => ({ ...i }));
          }
        });
        lsSet(KEYS.checklists, checklists);
      }

      loadStore();
    },
    [loadStore]
  );

  const deleteClient = useCallback(
    (id: string) => {
      const clients = ls<Client[]>(KEYS.clients, []).filter((c) => c.id !== id);
      lsSet(KEYS.clients, clients);
      loadStore();
    },
    [loadStore]
  );

  // ── Checklists ─────────────────────────────────────────────
  const toggleChecklistItem = useCallback(
    (clientId: string, module: string, itemId: string) => {
      const checklists = ls<Record<string, ChecklistItem[]>>(KEYS.checklists, {});
      const key = `${clientId}_${module}`;
      const items = checklists[key] || [];
      const updated = items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? new Date().toISOString() : undefined,
            }
          : item
      );
      checklists[key] = updated;
      lsSet(KEYS.checklists, checklists);

      // Recalculate module score and update client
      const newScore = calculateScore(updated);
      const clients = ls<Client[]>(KEYS.clients, []);
      const clientIdx = clients.findIndex((c) => c.id === clientId);
      if (clientIdx >= 0) {
        const client = { ...clients[clientIdx] };
        client.scores = { ...client.scores, [module]: newScore };
        client.scores.overall = calculateOverallScore(client.scores);
        client.updatedAt = new Date().toISOString();
        clients[clientIdx] = client;
        lsSet(KEYS.clients, clients);
      }

      loadStore();
    },
    [loadStore]
  );

  const updateChecklistNotes = useCallback(
    (clientId: string, module: string, itemId: string, notes: string) => {
      const checklists = ls<Record<string, ChecklistItem[]>>(KEYS.checklists, {});
      const key = `${clientId}_${module}`;
      const items = checklists[key] || [];
      checklists[key] = items.map((i) =>
        i.id === itemId ? { ...i, notes } : i
      );
      lsSet(KEYS.checklists, checklists);
      loadStore();
    },
    [loadStore]
  );

  // ── Leads ──────────────────────────────────────────────────
  const saveLead = useCallback(
    (lead: Lead) => {
      const leads = ls<Lead[]>(KEYS.leads, []);
      const idx = leads.findIndex((l) => l.id === lead.id);
      const next =
        idx >= 0
          ? leads.map((l) => (l.id === lead.id ? lead : l))
          : [...leads, lead];
      lsSet(KEYS.leads, next);
      loadStore();
    },
    [loadStore]
  );

  const deleteLead = useCallback(
    (id: string) => {
      lsSet(KEYS.leads, ls<Lead[]>(KEYS.leads, []).filter((l) => l.id !== id));
      loadStore();
    },
    [loadStore]
  );

  // ── Tasks ──────────────────────────────────────────────────
  const saveTask = useCallback(
    (task: AgencyTask) => {
      const tasks = ls<AgencyTask[]>(KEYS.tasks, []);
      const idx = tasks.findIndex((t) => t.id === task.id);
      const next =
        idx >= 0
          ? tasks.map((t) => (t.id === task.id ? task : t))
          : [...tasks, task];
      lsSet(KEYS.tasks, next);
      loadStore();
    },
    [loadStore]
  );

  const deleteTask = useCallback(
    (id: string) => {
      lsSet(KEYS.tasks, ls<AgencyTask[]>(KEYS.tasks, []).filter((t) => t.id !== id));
      loadStore();
    },
    [loadStore]
  );

  // ── Reviews ────────────────────────────────────────────────
  const saveReview = useCallback(
    (review: ReviewEntry) => {
      const reviews = ls<ReviewEntry[]>(KEYS.reviews, []);
      const idx = reviews.findIndex((r) => r.id === review.id);
      const next =
        idx >= 0
          ? reviews.map((r) => (r.id === review.id ? review : r))
          : [...reviews, review];
      lsSet(KEYS.reviews, next);
      loadStore();
    },
    [loadStore]
  );

  // ── GBP Posts ──────────────────────────────────────────────
  const saveGBPPost = useCallback(
    (post: GBPPost) => {
      const posts = ls<GBPPost[]>(KEYS.gbpPosts, []);
      lsSet(KEYS.gbpPosts, [...posts, post]);
      loadStore();
    },
    [loadStore]
  );

  // ── Citations ──────────────────────────────────────────────
  const updateCitation = useCallback(
    (clientId: string, platformName: string, updates: Partial<CitationEntry>) => {
      const citations = ls<Record<string, CitationEntry[]>>(KEYS.citations, {});
      const clientCitations = citations[clientId] || [];
      citations[clientId] = clientCitations.map((c) =>
        c.platform === platformName ? { ...c, ...updates } : c
      );
      lsSet(KEYS.citations, citations);
      loadStore();
    },
    [loadStore]
  );

  // ── Content Gaps ───────────────────────────────────────────
  const updateContentGap = useCallback(
    (clientId: string, gapId: string, updates: Partial<ContentGap>) => {
      const gaps = ls<Record<string, ContentGap[]>>(KEYS.contentGaps, {});
      const clientGaps = gaps[clientId] || [];
      gaps[clientId] = clientGaps.map((g) =>
        g.id === gapId ? { ...g, ...updates } : g
      );
      lsSet(KEYS.contentGaps, gaps);
      loadStore();
    },
    [loadStore]
  );

  // ── Review Stats ───────────────────────────────────────────
  const updateReviewStats = useCallback(
    (clientId: string, platform: string, updates: Partial<ReviewPlatformStats>) => {
      const stats = ls<Record<string, ReviewPlatformStats[]>>(KEYS.reviewStats, {});
      const clientStats = stats[clientId] || [];
      stats[clientId] = clientStats.map((s) =>
        s.platform === platform ? { ...s, ...updates } : s
      );
      lsSet(KEYS.reviewStats, stats);
      loadStore();
    },
    [loadStore]
  );

  // ── Export ─────────────────────────────────────────────────
  const exportData = useCallback(() => {
    const data = {
      exportDate: new Date().toISOString(),
      clients: ls(KEYS.clients, []),
      leads: ls(KEYS.leads, []),
      tasks: ls(KEYS.tasks, []),
      reviews: ls(KEYS.reviews, []),
      reports: ls(KEYS.reports, []),
      checklists: ls(KEYS.checklists, {}),
      gbpPosts: ls(KEYS.gbpPosts, []),
      citations: ls(KEYS.citations, {}),
      contentGaps: ls(KEYS.contentGaps, {}),
      reviewStats: ls(KEYS.reviewStats, {}),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blueprint-ai-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  return {
    store,
    saveClient,
    deleteClient,
    toggleChecklistItem,
    updateChecklistNotes,
    saveLead,
    deleteLead,
    saveTask,
    deleteTask,
    saveReview,
    saveGBPPost,
    updateCitation,
    updateContentGap,
    updateReviewStats,
    exportData,
    refresh: loadStore,
  };
}
