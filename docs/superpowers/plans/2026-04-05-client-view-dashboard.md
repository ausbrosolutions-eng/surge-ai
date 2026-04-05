# Client View Dashboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a clean client-facing report card page at `/dashboard/clients/[id]/client-view` that shows monthly marketing results auto-derived from localStorage, accessible via a "Client View" button in the existing client header.

**Architecture:** Three files change — a new `ClientViewReport` component holds all data derivation and rendering, a new Next.js page at `app/dashboard/clients/[id]/client-view/page.tsx` renders it, and `DashboardHeader` gains an optional `clientViewHref` prop that renders the button. All data comes from `useStore()` with no new store keys or data entry.

**Tech Stack:** Next.js 14 App Router, TypeScript strict, Tailwind CSS 3.4, Lucide React, `useStore()` from `@/lib/store`

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `components/dashboard/ClientViewReport.tsx` | All data derivation + report card UI |
| Create | `app/dashboard/clients/[id]/client-view/page.tsx` | Route shell, client-not-found guard |
| Modify | `components/dashboard/DashboardHeader.tsx` | Add optional `clientViewHref` prop + button |
| Modify | `app/dashboard/clients/[id]/page.tsx` line 155 | Pass `clientViewHref` to DashboardHeader |

---

## Task 1: Create ClientViewReport component

**Files:**
- Create: `components/dashboard/ClientViewReport.tsx`

- [ ] **Step 1: Create the file with complete implementation**

```tsx
"use client";
import { useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/lib/store";
import type { LeadSource } from "@/lib/types";

const SOURCE_LABELS: Record<LeadSource, string> = {
  lsa: "Google LSA",
  google_ads: "Google Ads",
  gbp: "Google Business Profile",
  organic: "Organic Search",
  referral: "Referral",
  social: "Social Media",
  nextdoor: "Nextdoor",
  yelp: "Yelp",
  direct: "Direct",
};

const BAR_COLORS = [
  "bg-[#00D4C8]",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
];

interface Props {
  clientId: string;
}

function MetricRow({
  label,
  value,
  highlight = false,
  trend,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  trend?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-6 py-3.5">
      <span className="text-sm text-gray-400">{label}</span>
      <div className="flex items-center">
        <span
          className={`text-sm font-semibold ${
            highlight ? "text-[#00D4C8]" : "text-white"
          }`}
        >
          {value}
        </span>
        {trend}
      </div>
    </div>
  );
}

export default function ClientViewReport({ clientId }: Props) {
  const { store } = useStore();
  const { clients, leads, reviewStats, gbpPosts, citations, checklists } =
    store;

  const client = clients.find((c) => c.id === clientId);

  const monthLabel = new Date().toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const metrics = useMemo(() => {
    if (!client) return null;

    const now = new Date();
    const yr = now.getFullYear();
    const mo = now.getMonth();
    const priorMo = mo === 0 ? 11 : mo - 1;
    const priorYr = mo === 0 ? yr - 1 : yr;

    function inMonth(dateStr: string, year: number, month: number) {
      const d = new Date(dateStr);
      return d.getFullYear() === year && d.getMonth() === month;
    }

    const clientLeads = leads.filter((l) => l.clientId === clientId);
    const leadsThisMonth = clientLeads.filter((l) =>
      inMonth(l.createdAt, yr, mo)
    );
    const leadsPriorMonth = clientLeads.filter((l) =>
      inMonth(l.createdAt, priorYr, priorMo)
    );
    const leadDelta = leadsThisMonth.length - leadsPriorMonth.length;
    // Only show trend arrow when we have any data to compare against
    const hasPriorData =
      leadsPriorMonth.length > 0 || leadsThisMonth.length > 0;

    const cpl =
      client.adSpend > 0 && leadsThisMonth.length > 0
        ? Math.round(client.adSpend / leadsThisMonth.length)
        : null;

    const clientReviewStats = reviewStats[clientId] ?? [];
    const newReviews = clientReviewStats.reduce(
      (sum, p) => sum + p.newThisMonth,
      0
    );
    const googleStats = clientReviewStats.find((p) => p.platform === "google");

    const gbpPostsThisMonth = gbpPosts.filter(
      (p) => p.clientId === clientId && inMonth(p.date, yr, mo)
    );

    const clientCitations = citations[clientId] ?? [];
    const citationsOptimized = clientCitations.filter(
      (c) => c.status === "optimized"
    ).length;

    const clientChecklistEntries = Object.entries(checklists).filter(([key]) =>
      key.startsWith(clientId)
    );
    const totalTasks = clientChecklistEntries.reduce(
      (sum, [, items]) => sum + items.length,
      0
    );
    const completedTasks = clientChecklistEntries.reduce(
      (sum, [, items]) => sum + items.filter((i) => i.completed).length,
      0
    );

    // Top 4 lead sources by volume
    const sourceGroups = leadsThisMonth.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topSources = Object.entries(sourceGroups)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 4);

    return {
      leadsThisMonth: leadsThisMonth.length,
      leadDelta,
      hasPriorData,
      cpl,
      newReviews: clientReviewStats.length > 0 ? newReviews : null,
      googleRating: googleStats?.rating ?? null,
      gbpPostsCount: gbpPostsThisMonth.length,
      citationsOptimized,
      completedTasks,
      totalTasks,
      topSources,
      score: client.scores.overall,
    };
  }, [client, leads, reviewStats, gbpPosts, citations, checklists, clientId]);

  if (!client || !metrics) return null;

  const { score } = metrics;
  const scoreBadgeClass =
    score >= 75
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : score >= 50
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-red-400 border-red-500/30 bg-red-500/10";

  const maxSourceCount = metrics.topSources[0]?.[1] ?? 1;

  function LeadTrend() {
    if (!metrics!.hasPriorData || metrics!.leadDelta === 0) return null;
    return metrics!.leadDelta > 0 ? (
      <span className="text-emerald-400 text-xs ml-2">
        ↑ +{metrics!.leadDelta} vs last month
      </span>
    ) : (
      <span className="text-red-400 text-xs ml-2">
        ↓ {metrics!.leadDelta} vs last month
      </span>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A1628] py-10 px-4">
      {/* Agency back link — subtle, top-right */}
      <div className="max-w-2xl mx-auto mb-6 flex justify-end">
        <Link
          href={`/dashboard/clients/${clientId}`}
          className="flex items-center gap-1.5 text-xs text-gray-700 hover:text-gray-400 transition-colors"
        >
          <ArrowLeft className="w-3 h-3" />
          Agency View
        </Link>
      </div>

      <div className="max-w-2xl mx-auto bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-lg font-bold text-white">
              {client.businessName}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Marketing Report · {monthLabel}
            </p>
          </div>
          <div
            className={`border rounded-full px-3 py-1 text-sm font-semibold ${scoreBadgeClass}`}
          >
            {score} / 100
          </div>
        </div>

        {/* Metric rows */}
        <div className="divide-y divide-gray-800/60">
          <MetricRow
            label="Total Leads"
            value={String(metrics.leadsThisMonth)}
            highlight
            trend={<LeadTrend />}
          />
          <MetricRow
            label="Cost Per Lead"
            value={metrics.cpl != null ? `$${metrics.cpl}` : "—"}
          />
          <MetricRow
            label="New Reviews"
            value={metrics.newReviews != null ? `+${metrics.newReviews}` : "—"}
          />
          <MetricRow
            label="Google Rating"
            value={
              metrics.googleRating != null ? `${metrics.googleRating}★` : "—"
            }
          />
          <MetricRow
            label="GBP Posts Published"
            value={String(metrics.gbpPostsCount)}
          />
          <MetricRow
            label="Citations Built"
            value={String(metrics.citationsOptimized)}
          />
          <MetricRow
            label="Tasks Completed"
            value={
              metrics.totalTasks > 0
                ? `${metrics.completedTasks} / ${metrics.totalTasks}`
                : "—"
            }
          />
        </div>

        {/* Lead source breakdown */}
        {metrics.topSources.length > 0 && (
          <div className="px-6 py-5 border-t border-gray-800">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
              Where Your Leads Came From
            </p>
            <div className="flex flex-col gap-4">
              {metrics.topSources.map(([source, count], i) => {
                const pct = Math.round((count / maxSourceCount) * 100);
                return (
                  <div key={source}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-400">
                        {SOURCE_LABELS[source as LeadSource] ?? source}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {count}
                      </span>
                    </div>
                    <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${BAR_COLORS[i]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-800/60 text-center">
          <p className="text-xs text-gray-700">
            Powered by Surge Advisory · surgeadvisory.co
          </p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/austin/Marketing Agency"
/Users/austin/.nvm/versions/node/v22.22.1/bin/node node_modules/.bin/tsc --noEmit
```

Expected: no errors. If errors appear, fix types before continuing.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/ClientViewReport.tsx
git commit -m "feat: add ClientViewReport component"
```

---

## Task 2: Create the client-view page route

**Files:**
- Create: `app/dashboard/clients/[id]/client-view/page.tsx`

- [ ] **Step 1: Create the page file**

```tsx
"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import ClientViewReport from "@/components/dashboard/ClientViewReport";

export default function ClientViewPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { store } = useStore();
  const router = useRouter();

  const client = store.clients.find((c) => c.id === clientId);

  // Redirect after store hydrates if client doesn't exist
  useEffect(() => {
    if (store.initialized && !client) {
      router.replace("/dashboard");
    }
  }, [store.initialized, client, router]);

  // Don't render until store is ready and client is confirmed
  if (!store.initialized || !client) return null;

  return <ClientViewReport clientId={clientId} />;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/austin/Marketing Agency"
/Users/austin/.nvm/versions/node/v22.22.1/bin/node node_modules/.bin/tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/dashboard/clients/[id]/client-view/page.tsx"
git commit -m "feat: add client-view route"
```

---

## Task 3: Add Client View button to DashboardHeader

**Files:**
- Modify: `components/dashboard/DashboardHeader.tsx`

Current file for reference — the full current content is:

```tsx
"use client";
import { Plus, Download } from "lucide-react";
import { Client } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface Props {
  title: string;
  selectedClient?: Client;
  onAddLead?: () => void;
  onAddTask?: () => void;
  onExport?: () => void;
}

export default function DashboardHeader({
  title,
  selectedClient,
  onAddLead,
  onAddTask,
  onExport,
}: Props) {
  ...
}
```

- [ ] **Step 1: Add `clientViewHref` prop and button**

Replace the entire file content with:

```tsx
"use client";
import { Plus, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Client } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface Props {
  title: string;
  selectedClient?: Client;
  onAddLead?: () => void;
  onAddTask?: () => void;
  onExport?: () => void;
  clientViewHref?: string;
}

export default function DashboardHeader({
  title,
  selectedClient,
  onAddLead,
  onAddTask,
  onExport,
  clientViewHref,
}: Props) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between xl:pl-6 pl-16">
      <div>
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-gray-500">{today}</p>
          {selectedClient && (
            <>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-400">{selectedClient.businessName}</span>
              <StatusBadge variant={selectedClient.status} size="sm" />
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {clientViewHref && (
          <Link
            href={clientViewHref}
            target="_blank"
            className="flex items-center gap-1.5 border border-[#00D4C8]/30 hover:border-[#00D4C8]/60 text-[#00D4C8] text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Client View
          </Link>
        )}
        {onAddLead && (
          <button
            onClick={onAddLead}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Lead
          </button>
        )}
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-400 text-xs px-3 py-2 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        )}
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/austin/Marketing Agency"
/Users/austin/.nvm/versions/node/v22.22.1/bin/node node_modules/.bin/tsc --noEmit
```

Expected: no errors. All existing callers of `DashboardHeader` that don't pass `clientViewHref` are unaffected — the prop is optional.

- [ ] **Step 3: Commit**

```bash
git add components/dashboard/DashboardHeader.tsx
git commit -m "feat: add clientViewHref prop to DashboardHeader"
```

---

## Task 4: Wire up the Client View button on the client overview page

**Files:**
- Modify: `app/dashboard/clients/[id]/page.tsx` — line 155

The existing line is:
```tsx
<DashboardHeader title={client.businessName} selectedClient={client} />
```

`clientId` is already available in scope on line 43: `const clientId = params.id as string;`

- [ ] **Step 1: Add `clientViewHref` to the DashboardHeader call**

Find the line:
```tsx
<DashboardHeader title={client.businessName} selectedClient={client} />
```

Replace it with:
```tsx
<DashboardHeader
  title={client.businessName}
  selectedClient={client}
  clientViewHref={`/dashboard/clients/${clientId}/client-view`}
/>
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/austin/Marketing Agency"
/Users/austin/.nvm/versions/node/v22.22.1/bin/node node_modules/.bin/tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Verify in the browser**

With the dev server running on port 3001:
1. Open `http://localhost:3001/dashboard/clients/rehab-restoration` (or whichever client)
2. Confirm "Client View" button appears in the header — teal border, ExternalLink icon
3. Click it — new tab opens at `/dashboard/clients/[id]/client-view`
4. Confirm the report card renders:
   - Business name + score badge in header
   - 7 metric rows with values (not blank)
   - Lead sources section (if leads exist)
   - "Powered by Surge Advisory" footer
   - "← Agency View" link in top-right
5. Confirm "← Agency View" link returns to the client overview

- [ ] **Step 4: Commit**

```bash
git add "app/dashboard/clients/[id]/page.tsx"
git commit -m "feat: wire Client View button to client overview page"
```
