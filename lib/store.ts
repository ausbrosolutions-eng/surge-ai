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
  OutreachProspect,
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
import { supabase } from "./supabase";

// ── DB row → TypeScript type helpers ─────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToClient(r: any): Client {
  return {
    id: r.id,
    name: r.name,
    businessName: r.business_name,
    trade: r.trade,
    phone: r.phone ?? "",
    email: r.email ?? "",
    website: r.website ?? "",
    address: r.address ?? "",
    city: r.city ?? "",
    state: r.state ?? "",
    serviceArea: r.service_area ?? [],
    package: r.package,
    monthlyRetainer: Number(r.monthly_retainer ?? 0),
    adSpend: Number(r.ad_spend ?? 0),
    startDate: r.start_date ?? "",
    status: r.status,
    gbpUrl: r.gbp_url ?? "",
    googleAdsId: r.google_ads_id ?? "",
    lsaEnabled: r.lsa_enabled ?? false,
    notes: r.notes ?? "",
    scores: r.scores ?? { gbp: 0, lsa: 0, seo: 0, aiSearch: 0, reputation: 0, ads: 0, social: 0, overall: 0 },
    createdAt: r.created_at ?? "",
    updatedAt: r.updated_at ?? "",
  };
}

function clientToRow(c: Client) {
  return {
    id: c.id,
    name: c.name,
    business_name: c.businessName,
    trade: c.trade,
    phone: c.phone,
    email: c.email,
    website: c.website,
    address: c.address,
    city: c.city,
    state: c.state,
    service_area: c.serviceArea,
    package: c.package,
    monthly_retainer: c.monthlyRetainer,
    ad_spend: c.adSpend,
    start_date: c.startDate,
    status: c.status,
    gbp_url: c.gbpUrl,
    google_ads_id: c.googleAdsId,
    lsa_enabled: c.lsaEnabled,
    notes: c.notes,
    scores: c.scores,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToLead(r: any): Lead {
  return {
    id: r.id,
    clientId: r.client_id,
    name: r.name ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    source: r.source,
    serviceRequested: r.service_requested ?? "",
    zipCode: r.zip_code ?? "",
    status: r.status,
    urgency: r.urgency,
    estimatedValue: Number(r.estimated_value ?? 0),
    bantScore: r.bant_score ?? { budget: 0, authority: 0, need: 0, timeline: 0, total: 0 },
    notes: r.notes ?? "",
    createdAt: r.created_at ?? "",
    updatedAt: r.updated_at ?? "",
  };
}

function leadToRow(l: Lead) {
  return {
    id: l.id,
    client_id: l.clientId,
    name: l.name,
    phone: l.phone,
    email: l.email ?? "",
    source: l.source,
    service_requested: l.serviceRequested,
    zip_code: l.zipCode,
    status: l.status,
    urgency: l.urgency,
    estimated_value: l.estimatedValue,
    bant_score: l.bantScore,
    notes: l.notes,
    created_at: l.createdAt,
    updated_at: l.updatedAt,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTask(r: any): AgencyTask {
  return {
    id: r.id,
    clientId: r.client_id ?? undefined,
    title: r.title ?? "",
    description: r.description ?? "",
    category: r.category,
    priority: r.priority,
    status: r.status,
    dueDate: r.due_date ?? "",
    assignedTo: r.assigned_to ?? "",
    createdAt: r.created_at ?? "",
    completedAt: r.completed_at ?? undefined,
  };
}

function taskToRow(t: AgencyTask) {
  return {
    id: t.id,
    client_id: t.clientId ?? null,
    title: t.title,
    description: t.description,
    category: t.category,
    priority: t.priority,
    status: t.status,
    due_date: t.dueDate,
    assigned_to: t.assignedTo,
    created_at: t.createdAt,
    completed_at: t.completedAt ?? null,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReview(r: any): ReviewEntry {
  return {
    id: r.id,
    clientId: r.client_id,
    platform: r.platform,
    rating: Number(r.rating ?? 5),
    reviewerName: r.reviewer_name ?? "",
    reviewText: r.review_text ?? "",
    datePosted: r.date_posted ?? "",
    responded: r.responded ?? false,
    responseText: r.response_text ?? undefined,
    responseDate: r.response_date ?? undefined,
    sentiment: r.sentiment,
  };
}

function reviewToRow(r: ReviewEntry) {
  return {
    id: r.id,
    client_id: r.clientId,
    platform: r.platform,
    rating: r.rating,
    reviewer_name: r.reviewerName,
    review_text: r.reviewText,
    date_posted: r.datePosted,
    responded: r.responded,
    response_text: r.responseText ?? "",
    response_date: r.responseDate ?? "",
    sentiment: r.sentiment,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReport(r: any): MonthlyReport {
  return {
    id: r.id,
    clientId: r.client_id,
    month: r.month ?? "",
    metrics: r.metrics ?? {},
    createdAt: r.created_at ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToGBPPost(r: any): GBPPost {
  return {
    id: r.id,
    clientId: r.client_id,
    date: r.date ?? "",
    type: r.type,
    hasCTA: r.has_cta ?? false,
    hasPhoto: r.has_photo ?? false,
    title: r.title ?? undefined,
    notes: r.notes ?? undefined,
  };
}

function gbpPostToRow(p: GBPPost) {
  return {
    id: p.id,
    client_id: p.clientId,
    date: p.date,
    type: p.type,
    has_cta: p.hasCTA,
    has_photo: p.hasPhoto,
    title: p.title ?? "",
    notes: p.notes ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToCitation(r: any): CitationEntry {
  return {
    platform: r.platform,
    tier: r.tier as 1 | 2 | 3,
    status: r.status,
    napVerified: r.nap_verified ?? false,
    url: r.url ?? undefined,
    notes: r.notes ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToContentGap(r: any): ContentGap {
  return {
    id: r.id,
    title: r.title ?? "",
    targetQuery: r.target_query ?? "",
    aiPlatform: r.ai_platform ?? "",
    status: r.status,
    publishedUrl: r.published_url ?? undefined,
    notes: r.notes ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToReviewStat(r: any): ReviewPlatformStats {
  return {
    platform: r.platform,
    rating: Number(r.rating ?? 0),
    totalReviews: Number(r.total_reviews ?? 0),
    newThisMonth: Number(r.new_this_month ?? 0),
    lastUpdated: r.last_updated ?? "",
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToOutreach(r: any): OutreachProspect {
  return {
    id: r.id,
    name: r.name ?? "",
    company: r.company ?? "",
    trade: r.trade ?? "",
    city: r.city ?? "",
    phone: r.phone ?? "",
    source: r.source,
    status: r.status,
    notes: r.notes ?? "",
    nextFollowUp: r.next_follow_up ?? "",
    createdAt: r.created_at ?? "",
  };
}

function outreachToRow(p: OutreachProspect) {
  return {
    id: p.id,
    name: p.name,
    company: p.company,
    trade: p.trade,
    city: p.city,
    phone: p.phone,
    source: p.source,
    status: p.status,
    notes: p.notes,
    next_follow_up: p.nextFollowUp,
    created_at: p.createdAt,
  };
}

// ── Seed data insertion ───────────────────────────────────────

async function seedDatabase() {
  // Insert seed client
  await supabase.from("clients").upsert(clientToRow(seedClient));

  // Insert seed leads
  if (seedLeads.length > 0) {
    await supabase.from("leads").upsert(seedLeads.map(leadToRow));
  }

  // Insert seed tasks
  if (seedTasks.length > 0) {
    await supabase.from("tasks").upsert(seedTasks.map(taskToRow));
  }

  // Insert seed reviews
  if (seedReviews.length > 0) {
    await supabase.from("reviews").upsert(seedReviews.map(reviewToRow));
  }

  // Insert seed GBP posts
  if (seedGBPPosts.length > 0) {
    await supabase.from("gbp_posts").upsert(seedGBPPosts.map(gbpPostToRow));
  }

  // Insert seed citations
  if (seedCitations.length > 0) {
    await supabase.from("citations").upsert(
      seedCitations.map((c) => ({
        client_id: seedClient.id,
        platform: c.platform,
        tier: c.tier,
        status: c.status,
        nap_verified: c.napVerified,
        url: c.url ?? "",
        notes: c.notes ?? "",
      }))
    );
  }

  // Insert seed content gaps
  if (seedContentGaps.length > 0) {
    await supabase.from("content_gaps").upsert(
      seedContentGaps.map((g) => ({
        id: g.id,
        client_id: seedClient.id,
        title: g.title,
        target_query: g.targetQuery,
        ai_platform: g.aiPlatform,
        status: g.status,
        published_url: g.publishedUrl ?? "",
        notes: g.notes ?? "",
      }))
    );
  }

  // Insert seed review stats
  if (seedReviewStats.length > 0) {
    await supabase.from("review_stats").upsert(
      seedReviewStats.map((s) => ({
        client_id: seedClient.id,
        platform: s.platform,
        rating: s.rating,
        total_reviews: s.totalReviews,
        new_this_month: s.newThisMonth,
        last_updated: s.lastUpdated,
      }))
    );
  }

  // Insert seed checklists
  const checklistRows = Object.entries(checklistMap).map(([module, items]) => ({
    client_id: seedClient.id,
    module,
    items: items.map((i) => ({ ...i })),
  }));
  if (checklistRows.length > 0) {
    await supabase.from("checklists").upsert(checklistRows);
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
    outreach: [],
    initialized: false,
  });

  const loadStore = useCallback(async () => {
    // Fetch everything in parallel
    const [
      clientsRes,
      leadsRes,
      tasksRes,
      reviewsRes,
      reportsRes,
      checklistsRes,
      gbpPostsRes,
      lsaLeadsRes,
      citationsRes,
      backlinksRes,
      contentGapsRes,
      reviewStatsRes,
      outreachRes,
    ] = await Promise.all([
      supabase.from("clients").select("*"),
      supabase.from("leads").select("*"),
      supabase.from("tasks").select("*"),
      supabase.from("reviews").select("*"),
      supabase.from("reports").select("*"),
      supabase.from("checklists").select("*"),
      supabase.from("gbp_posts").select("*"),
      supabase.from("lsa_leads").select("*"),
      supabase.from("citations").select("*"),
      supabase.from("backlinks").select("*"),
      supabase.from("content_gaps").select("*"),
      supabase.from("review_stats").select("*"),
      supabase.from("outreach").select("*"),
    ]);

    const clients = (clientsRes.data ?? []).map(rowToClient);

    // Seed on first run (no clients yet)
    if (clients.length === 0) {
      await seedDatabase();
      // Reload after seeding
      loadStore();
      return;
    }

    // Build checklists Record<string, ChecklistItem[]>
    const checklists: Record<string, ChecklistItem[]> = {};
    for (const row of checklistsRes.data ?? []) {
      const key = `${row.client_id}_${row.module}`;
      checklists[key] = row.items as ChecklistItem[];
    }

    // Build citations Record<string, CitationEntry[]>
    const citations: Record<string, CitationEntry[]> = {};
    for (const row of citationsRes.data ?? []) {
      if (!citations[row.client_id]) citations[row.client_id] = [];
      citations[row.client_id].push(rowToCitation(row));
    }

    // Build contentGaps Record<string, ContentGap[]>
    const contentGaps: Record<string, ContentGap[]> = {};
    for (const row of contentGapsRes.data ?? []) {
      if (!contentGaps[row.client_id]) contentGaps[row.client_id] = [];
      contentGaps[row.client_id].push(rowToContentGap(row));
    }

    // Build reviewStats Record<string, ReviewPlatformStats[]>
    const reviewStats: Record<string, ReviewPlatformStats[]> = {};
    for (const row of reviewStatsRes.data ?? []) {
      if (!reviewStats[row.client_id]) reviewStats[row.client_id] = [];
      reviewStats[row.client_id].push(rowToReviewStat(row));
    }

    setStore({
      clients,
      leads: (leadsRes.data ?? []).map(rowToLead),
      tasks: (tasksRes.data ?? []).map(rowToTask),
      reviews: (reviewsRes.data ?? []).map(rowToReview),
      reports: (reportsRes.data ?? []).map(rowToReport),
      checklists,
      gbpPosts: (gbpPostsRes.data ?? []).map(rowToGBPPost),
      lsaLeads: (lsaLeadsRes.data ?? []).map((r) => ({
        id: r.id,
        clientId: r.client_id,
        date: r.date ?? "",
        serviceType: r.service_type ?? "",
        leadType: r.lead_type,
        status: r.status,
        disputed: r.disputed ?? false,
        disputeReason: r.dispute_reason ?? undefined,
        cost: Number(r.cost ?? 0),
      })),
      citations,
      backlinks: (backlinksRes.data ?? []).map((r) => ({
        id: r.id,
        clientId: r.client_id,
        source: r.source ?? "",
        url: r.url ?? "",
        authority: Number(r.authority ?? 0),
        dateEarned: r.date_earned ?? "",
        type: r.type,
        notes: r.notes ?? undefined,
      })),
      contentGaps,
      reviewStats,
      outreach: (outreachRes.data ?? []).map(rowToOutreach),
      initialized: true,
    });
  }, []);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  // ── Clients ────────────────────────────────────────────────
  const saveClient = useCallback(
    async (client: Client) => {
      // Auto-create checklists for new clients
      const existing = store.clients.find((c) => c.id === client.id);
      if (!existing) {
        const checklistRows = Object.entries(checklistMap).map(([module, items]) => ({
          client_id: client.id,
          module,
          items: items.map((i) => ({ ...i })),
        }));
        await supabase.from("checklists").upsert(checklistRows);
      }
      await supabase.from("clients").upsert(clientToRow(client));
      loadStore();
    },
    [loadStore, store.clients]
  );

  const deleteClient = useCallback(
    async (id: string) => {
      await supabase.from("clients").delete().eq("id", id);
      loadStore();
    },
    [loadStore]
  );

  // ── Checklists ─────────────────────────────────────────────
  const toggleChecklistItem = useCallback(
    async (clientId: string, module: string, itemId: string) => {
      const key = `${clientId}_${module}`;
      const items: ChecklistItem[] = store.checklists[key] ?? [];
      const updated = items.map((item) =>
        item.id === itemId
          ? {
              ...item,
              completed: !item.completed,
              completedAt: !item.completed ? new Date().toISOString() : undefined,
            }
          : item
      );

      // Persist updated items
      await supabase
        .from("checklists")
        .upsert({ client_id: clientId, module, items: updated });

      // Recalculate score and update client
      const newScore = calculateScore(updated);
      const client = store.clients.find((c) => c.id === clientId);
      if (client) {
        const updatedScores = {
          ...client.scores,
          [module]: newScore,
        };
        updatedScores.overall = calculateOverallScore(updatedScores);
        await supabase
          .from("clients")
          .update({ scores: updatedScores, updated_at: new Date().toISOString() })
          .eq("id", clientId);
      }

      loadStore();
    },
    [loadStore, store.checklists, store.clients]
  );

  const updateChecklistNotes = useCallback(
    async (clientId: string, module: string, itemId: string, notes: string) => {
      const key = `${clientId}_${module}`;
      const items: ChecklistItem[] = store.checklists[key] ?? [];
      const updated = items.map((i) =>
        i.id === itemId ? { ...i, notes } : i
      );
      await supabase
        .from("checklists")
        .upsert({ client_id: clientId, module, items: updated });
      loadStore();
    },
    [loadStore, store.checklists]
  );

  // ── Leads ──────────────────────────────────────────────────
  const saveLead = useCallback(
    async (lead: Lead) => {
      await supabase.from("leads").upsert(leadToRow(lead));
      loadStore();
    },
    [loadStore]
  );

  const deleteLead = useCallback(
    async (id: string) => {
      await supabase.from("leads").delete().eq("id", id);
      loadStore();
    },
    [loadStore]
  );

  // ── Tasks ──────────────────────────────────────────────────
  const saveTask = useCallback(
    async (task: AgencyTask) => {
      await supabase.from("tasks").upsert(taskToRow(task));
      loadStore();
    },
    [loadStore]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      await supabase.from("tasks").delete().eq("id", id);
      loadStore();
    },
    [loadStore]
  );

  // ── Reviews ────────────────────────────────────────────────
  const saveReview = useCallback(
    async (review: ReviewEntry) => {
      await supabase.from("reviews").upsert(reviewToRow(review));
      loadStore();
    },
    [loadStore]
  );

  // ── GBP Posts ──────────────────────────────────────────────
  const saveGBPPost = useCallback(
    async (post: GBPPost) => {
      await supabase.from("gbp_posts").upsert(gbpPostToRow(post));
      loadStore();
    },
    [loadStore]
  );

  // ── Citations ──────────────────────────────────────────────
  const updateCitation = useCallback(
    async (clientId: string, platformName: string, updates: Partial<CitationEntry>) => {
      const existing = store.citations[clientId]?.find((c) => c.platform === platformName);
      const merged = { ...(existing ?? { platform: platformName, tier: 1, status: "not_started", napVerified: false }), ...updates };
      await supabase.from("citations").upsert({
        client_id: clientId,
        platform: merged.platform,
        tier: merged.tier,
        status: merged.status,
        nap_verified: merged.napVerified,
        url: merged.url ?? "",
        notes: merged.notes ?? "",
      });
      loadStore();
    },
    [loadStore, store.citations]
  );

  // ── Content Gaps ───────────────────────────────────────────
  const updateContentGap = useCallback(
    async (clientId: string, gapId: string, updates: Partial<ContentGap>) => {
      const existing = store.contentGaps[clientId]?.find((g) => g.id === gapId);
      if (!existing) return;
      const merged = { ...existing, ...updates };
      await supabase.from("content_gaps").upsert({
        id: merged.id,
        client_id: clientId,
        title: merged.title,
        target_query: merged.targetQuery,
        ai_platform: merged.aiPlatform,
        status: merged.status,
        published_url: merged.publishedUrl ?? "",
        notes: merged.notes ?? "",
      });
      loadStore();
    },
    [loadStore, store.contentGaps]
  );

  // ── Review Stats ───────────────────────────────────────────
  const updateReviewStats = useCallback(
    async (clientId: string, platform: string, updates: Partial<ReviewPlatformStats>) => {
      const existing = store.reviewStats[clientId]?.find((s) => s.platform === platform);
      const merged = { ...(existing ?? { platform, rating: 0, totalReviews: 0, newThisMonth: 0, lastUpdated: "" }), ...updates };
      await supabase.from("review_stats").upsert({
        client_id: clientId,
        platform: merged.platform,
        rating: merged.rating,
        total_reviews: merged.totalReviews,
        new_this_month: merged.newThisMonth,
        last_updated: merged.lastUpdated,
      });
      loadStore();
    },
    [loadStore, store.reviewStats]
  );

  // ── Outreach ───────────────────────────────────────────────
  const saveOutreachProspect = useCallback(
    async (prospect: OutreachProspect) => {
      await supabase.from("outreach").upsert(outreachToRow(prospect));
      loadStore();
    },
    [loadStore]
  );

  const deleteOutreachProspect = useCallback(
    async (id: string) => {
      await supabase.from("outreach").delete().eq("id", id);
      loadStore();
    },
    [loadStore]
  );

  // ── Export ─────────────────────────────────────────────────
  const exportData = useCallback(() => {
    const data = {
      exportDate: new Date().toISOString(),
      clients: store.clients,
      leads: store.leads,
      tasks: store.tasks,
      reviews: store.reviews,
      reports: store.reports,
      checklists: store.checklists,
      gbpPosts: store.gbpPosts,
      citations: store.citations,
      contentGaps: store.contentGaps,
      reviewStats: store.reviewStats,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blueprint-ai-backup-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [store]);

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
    saveOutreachProspect,
    deleteOutreachProspect,
    exportData,
    refresh: loadStore,
  };
}
