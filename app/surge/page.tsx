"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  TrendingUp,
  Target,
  DollarSign,
  CheckCircle2,
  Plus,
  Zap,
  X,
} from "lucide-react";
import { useSurgeStore } from "@/lib/surge/store";
import { STAGE_LABELS, SIGNAL_ICONS } from "@/lib/surge/types";
import { LogActivityForm } from "@/components/surge/forms/LogActivityForm";
import { AddProspectForm } from "@/components/surge/forms/AddProspectForm";
import { Button } from "@/components/surge/ui/FormField";

export default function SurgeCockpit() {
  const { store, hydrated, saveActivity, saveProspect, runProspectAutomationForSurge, dismissSuggestion } = useSurgeStore();
  const [logOpen, setLogOpen] = useState(false);
  const [addProspectOpen, setAddProspectOpen] = useState(false);
  const [autoBanner, setAutoBanner] = useState<string | null>(null);

  const handleRunAutomation = () => {
    const result = runProspectAutomationForSurge();
    setAutoBanner(
      result.created > 0
        ? `Surge automation evaluated ${result.log.prospectsEvaluated} prospects and created ${result.created} new suggestion${result.created === 1 ? "" : "s"}.`
        : `Automation ran. Pipeline is current - no new suggestions needed.`
    );
    setTimeout(() => setAutoBanner(null), 8000);
  };

  const metrics = useMemo(() => {
    const now = Date.now();
    const monthStart = new Date(now);
    monthStart.setDate(1);

    const activeProspects = store.prospects.filter(
      (p) => p.stage !== "lost" && p.stage !== "retainer_signed"
    );
    const tier1Active = activeProspects.filter((p) => p.tier === 1);
    const activeRetainers = store.retainerClients.length;
    const mrr = store.retainerClients.reduce((s, r) => s + r.monthlyRetainer, 0);

    const auditsInProgress = store.audits.filter(
      (a) => a.stage !== "converted_to_retainer" && a.stage !== "lost_post_audit"
    );

    const revenueThisMonth = store.revenueEvents
      .filter((e) => new Date(e.date).getTime() >= monthStart.getTime())
      .reduce((s, e) => s + e.amount, 0);

    const newSignals = store.signals.filter((s) => s.status === "new").length;

    const pipelineValue = activeProspects.reduce((s, p) => s + p.estimatedValue, 0);

    const staleProspects = tier1Active.filter((p) => {
      if (!p.lastTouch) return false;
      const daysSince = (now - new Date(p.lastTouch).getTime()) / 86400000;
      return daysSince >= 14;
    });

    return {
      activeProspects: activeProspects.length,
      tier1Active: tier1Active.length,
      activeRetainers,
      mrr,
      auditsInProgress: auditsInProgress.length,
      revenueThisMonth,
      newSignals,
      pipelineValue,
      staleProspects: staleProspects.length,
    };
  }, [store]);

  const priorities = useMemo(() => {
    const items: { icon: string; title: string; detail: string; href: string; urgent: boolean }[] = [];
    const now = Date.now();

    // Today's scheduled touches
    const touchesDueToday = store.prospects.filter((p) => {
      if (!p.nextTouch) return false;
      const d = new Date(p.nextTouch);
      return d.toDateString() === new Date().toDateString();
    });
    touchesDueToday.forEach((p) => {
      items.push({
        icon: "📨",
        title: `Next touch due: ${p.companyName}`,
        detail: `${p.contactName} - ${STAGE_LABELS[p.stage]}, ${p.touchCount} touches so far`,
        href: `/surge/pipeline`,
        urgent: p.tier === 1,
      });
    });

    // New signals needing review
    const newSignals = store.signals.filter((s) => s.status === "new");
    newSignals.slice(0, 3).forEach((s) => {
      items.push({
        icon: SIGNAL_ICONS[s.type],
        title: `New ${s.type} signal: ${s.companyName}`,
        detail: s.summary,
        href: `/surge/signals`,
        urgent: s.type === "referral" || s.type === "hiring",
      });
    });

    // Stale Tier 1 prospects
    store.prospects.forEach((p) => {
      if (p.tier !== 1 || !p.lastTouch) return;
      if (p.stage === "lost" || p.stage === "retainer_signed") return;
      const daysSince = (now - new Date(p.lastTouch).getTime()) / 86400000;
      if (daysSince >= 14) {
        items.push({
          icon: "⏰",
          title: `Stale Tier 1: ${p.companyName}`,
          detail: `${Math.floor(daysSince)} days since last touch - pattern interrupt or breakup`,
          href: `/surge/pipeline`,
          urgent: true,
        });
      }
    });

    return items.slice(0, 8);
  }, [store]);

  const pipelineByStage = useMemo(() => {
    const stages: Record<string, number> = {};
    store.prospects.forEach((p) => {
      if (p.stage === "lost") return;
      stages[p.stage] = (stages[p.stage] || 0) + 1;
    });
    return stages;
  }, [store]);

  const recentActivity = useMemo(() => {
    return [...store.activities]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5);
  }, [store.activities]);

  if (!hydrated) {
    return (
      <div className="p-8">
        <div className="font-sans text-sm text-[#9A9086]">Loading cockpit...</div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1">
              Surge Operator Cockpit
            </p>
            <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
              Good morning, Austin
            </h1>
          </div>
          <div className="flex items-end gap-4">
            <div className="text-right">
              <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086]">
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
              <p className="font-display text-sm font-semibold text-[#B87333] mt-1">
                {metrics.newSignals} new signals · {priorities.length} priorities
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={handleRunAutomation}>
                <Zap className="w-3 h-3" /> Automate
              </Button>
              <Button variant="secondary" onClick={() => setLogOpen(true)}>
                <Plus className="w-3 h-3" /> Log
              </Button>
              <Button onClick={() => setAddProspectOpen(true)}>
                <Plus className="w-3 h-3" /> Prospect
              </Button>
            </div>
          </div>
        </div>
      </div>

      <LogActivityForm
        open={logOpen}
        onClose={() => setLogOpen(false)}
        onSave={saveActivity}
        prospects={store.prospects.map((p) => ({
          id: p.id,
          companyName: p.companyName,
          contactName: p.contactName,
        }))}
        clients={store.retainerClients.map((c) => ({
          id: c.id,
          companyName: c.companyName,
        }))}
      />
      <AddProspectForm
        open={addProspectOpen}
        onClose={() => setAddProspectOpen(false)}
        onSave={saveProspect}
      />

      {autoBanner && (
        <div className="mx-8 mt-4 bg-[#B87333]/10 border border-[#B87333]/30 rounded-[2px] p-4 flex items-center gap-3">
          <Zap className="w-4 h-4 text-[#B87333] flex-shrink-0" />
          <p className="font-sans text-sm text-[#E8E2D8]">{autoBanner}</p>
        </div>
      )}

      <div className="p-8 space-y-8">
        {/* Automation Suggestions */}
        {store.prospectAutomationSuggestions.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#B87333]" />
                <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8]">
                  Automation Suggestions
                </h2>
                <span className="font-sans text-xs text-[#5A5550]">
                  ({store.prospectAutomationSuggestions.length})
                </span>
              </div>
              <span className="font-sans text-xs text-[#5A5550] italic">
                AI-flagged actions to keep pipeline moving
              </span>
            </div>
            <div className="space-y-2">
              {store.prospectAutomationSuggestions
                .sort((a, b) => {
                  const pri = { urgent: 0, high: 1, medium: 2 };
                  return pri[a.priority] - pri[b.priority];
                })
                .slice(0, 8)
                .map((s) => {
                  const prospect = store.prospects.find((p) => p.id === s.prospectId);
                  return (
                    <div
                      key={s.id}
                      className={`flex items-start gap-3 p-4 rounded-[2px] border ${
                        s.priority === "urgent"
                          ? "bg-[#EF4444]/5 border-[#EF4444]/30"
                          : s.priority === "high"
                          ? "bg-[#FBBF24]/5 border-[#FBBF24]/30"
                          : "bg-[#111111] border-[#2A2520]"
                      }`}
                    >
                      <Zap
                        className={`w-4 h-4 flex-shrink-0 mt-1 ${
                          s.priority === "urgent"
                            ? "text-[#EF4444]"
                            : s.priority === "high"
                            ? "text-[#FBBF24]"
                            : "text-[#B87333]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-1">
                          <p className="font-sans text-sm font-semibold text-[#E8E2D8]">
                            {s.title}
                          </p>
                          {s.dollarImpact > 0 && (
                            <span className="font-display text-sm font-bold text-[#B87333] flex-shrink-0">
                              ${(s.dollarImpact / 1000).toFixed(0)}K
                            </span>
                          )}
                        </div>
                        <p className="font-sans text-xs text-[#9A9086] leading-relaxed mb-2">
                          {s.description}
                        </p>
                        <p className="font-sans text-xs text-[#B87333] leading-relaxed">
                          → {s.suggestedAction}
                        </p>
                      </div>
                      <button
                        onClick={() => dismissSuggestion(s.id)}
                        className="text-[#5A5550] hover:text-[#E8E2D8] flex-shrink-0 mt-1"
                        aria-label="Dismiss suggestion"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Hero Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricTile
            label="Active Pipeline"
            value={`$${(metrics.pipelineValue / 1000).toFixed(0)}K`}
            detail={`${metrics.activeProspects} prospects · ${metrics.tier1Active} Tier 1`}
            icon={Target}
            tone="copper"
          />
          <MetricTile
            label="Monthly Recurring"
            value={`$${metrics.mrr.toLocaleString()}`}
            detail={`${metrics.activeRetainers} active retainer${metrics.activeRetainers !== 1 ? "s" : ""}`}
            icon={DollarSign}
            tone="green"
          />
          <MetricTile
            label="Audits In Flight"
            value={metrics.auditsInProgress}
            detail="Paid audits in delivery window"
            icon={FileCheckIcon}
            tone="blue"
          />
          <MetricTile
            label="Revenue MTD"
            value={`$${metrics.revenueThisMonth.toLocaleString()}`}
            detail="Audits + retainers this month"
            icon={TrendingUp}
            tone="amber"
          />
        </div>

        {/* Two-column: Priorities + Pipeline Snapshot */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Today's Priorities */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8]">
                Today&rsquo;s Priorities
              </h2>
              <span className="font-sans text-xs text-[#5A5550]">
                Do these first. Everything else can wait.
              </span>
            </div>
            <div className="space-y-2">
              {priorities.length === 0 ? (
                <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-6 text-center">
                  <CheckCircle2 className="w-8 h-8 text-[#4ADE80] mx-auto mb-2" />
                  <p className="font-sans text-sm text-[#9A9086]">
                    No urgent priorities. Time to prospect.
                  </p>
                </div>
              ) : (
                priorities.map((item, i) => (
                  <Link
                    key={i}
                    href={item.href}
                    className={`flex items-start gap-3 p-4 rounded-[2px] border transition-colors hover:border-[#B87333]/40 ${
                      item.urgent
                        ? "bg-[#B87333]/5 border-[#B87333]/30"
                        : "bg-[#111111] border-[#2A2520]"
                    }`}
                  >
                    <span className="text-lg leading-none flex-shrink-0 mt-0.5">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-[#E8E2D8] mb-0.5">
                        {item.title}
                      </p>
                      <p className="font-sans text-xs text-[#9A9086] leading-relaxed">
                        {item.detail}
                      </p>
                    </div>
                    {item.urgent && (
                      <AlertCircle className="w-4 h-4 text-[#B87333] flex-shrink-0 mt-0.5" />
                    )}
                    <ArrowRight className="w-4 h-4 text-[#5A5550] flex-shrink-0 mt-0.5" />
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Pipeline Snapshot */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8]">
                Pipeline
              </h2>
              <Link
                href="/surge/pipeline"
                className="font-sans text-xs text-[#B87333] hover:text-[#D4956A] flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-4 space-y-2">
              {Object.entries(STAGE_LABELS)
                .filter(([stage]) => stage !== "lost")
                .map(([stage, label]) => {
                  const count = pipelineByStage[stage] || 0;
                  return (
                    <div
                      key={stage}
                      className="flex items-center justify-between py-1.5 border-b border-[#1A1A1A] last:border-0"
                    >
                      <span className="font-sans text-xs text-[#9A9086]">{label}</span>
                      <span
                        className={`font-display text-sm font-bold ${
                          count > 0 ? "text-[#E8E2D8]" : "text-[#5A5550]"
                        }`}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8]">
              Recent Activity
            </h2>
            <Link
              href="/surge/activities"
              className="font-sans text-xs text-[#B87333] hover:text-[#D4956A] flex items-center gap-1"
            >
              All activity <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] divide-y divide-[#1A1A1A]">
            {recentActivity.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-sans text-sm text-[#9A9086]">No activity logged yet.</p>
              </div>
            ) : (
              recentActivity.map((a) => {
                const prospect = store.prospects.find((p) => p.id === a.prospectId);
                const client = store.retainerClients.find((c) => c.id === a.clientId);
                const company = prospect?.companyName || client?.companyName || "Unknown";
                return (
                  <div key={a.id} className="p-4 hover:bg-[#1A1A1A]/30 transition-colors">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                          a.sentiment === "positive"
                            ? "bg-[#4ADE80]"
                            : a.sentiment === "negative"
                            ? "bg-[#EF4444]"
                            : "bg-[#9A9086]"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-0.5">
                          <p className="font-sans text-sm font-medium text-[#E8E2D8]">
                            {a.subject}
                          </p>
                          <span className="font-sans text-[10px] uppercase tracking-wider text-[#5A5550] flex-shrink-0">
                            {a.type.replace(/_/g, " ")}
                          </span>
                        </div>
                        <p className="font-sans text-xs text-[#9A9086] leading-relaxed mb-1">
                          {a.summary}
                        </p>
                        <p className="font-sans text-[11px] text-[#5A5550]">
                          {company} · {new Date(a.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Subcomponents ─────────────────────────────────────────

function FileCheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <path d="m9 15 2 2 4-4"/>
    </svg>
  );
}

interface MetricTileProps {
  label: string;
  value: string | number;
  detail: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  tone: "copper" | "green" | "blue" | "amber";
}

function MetricTile({ label, value, detail, icon: Icon, tone }: MetricTileProps) {
  const toneColors = {
    copper: "text-[#B87333]",
    green: "text-[#4ADE80]",
    blue: "text-[#60A5FA]",
    amber: "text-[#FBBF24]",
  };
  return (
    <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086]">
          {label}
        </p>
        <Icon className={`w-4 h-4 ${toneColors[tone]}`} />
      </div>
      <p className="font-display text-3xl font-bold tracking-tight text-[#E8E2D8] leading-none mb-1">
        {value}
      </p>
      <p className="font-sans text-xs text-[#5A5550] mt-2">{detail}</p>
    </div>
  );
}
