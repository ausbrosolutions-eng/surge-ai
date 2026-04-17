"use client";

import { useMemo } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";

export default function RevenuePage() {
  const { store, hydrated } = useSurgeStore();

  const summary = useMemo(() => {
    const events = store.revenueEvents;
    const totalCollected = events
      .filter((e) => e.type !== "expense" && e.type !== "referral_payout")
      .reduce((s, e) => s + e.amount, 0);
    const auditRevenue = events
      .filter((e) => e.type === "audit_payment")
      .reduce((s, e) => s + e.amount, 0);
    const retainerRevenue = events
      .filter((e) => e.type === "retainer_payment")
      .reduce((s, e) => s + e.amount, 0);
    const currentMRR = store.retainerClients.reduce((s, c) => s + c.monthlyRetainer, 0);
    const pipelineValue = store.prospects
      .filter((p) => p.stage !== "lost" && p.stage !== "retainer_signed")
      .reduce((s, p) => s + p.estimatedValue, 0);

    return { totalCollected, auditRevenue, retainerRevenue, currentMRR, pipelineValue };
  }, [store]);

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading revenue...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1">
            Revenue Dashboard
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Revenue
          </h1>
        </div>
      </div>

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <RevenueTile
            label="Total Collected"
            value={`$${summary.totalCollected.toLocaleString()}`}
            icon={DollarSign}
          />
          <RevenueTile
            label="Current MRR"
            value={`$${summary.currentMRR.toLocaleString()}`}
            icon={TrendingUp}
          />
          <RevenueTile
            label="Audit Revenue"
            value={`$${summary.auditRevenue.toLocaleString()}`}
            icon={Calendar}
          />
          <RevenueTile
            label="Retainer Revenue"
            value={`$${summary.retainerRevenue.toLocaleString()}`}
            icon={TrendingUp}
          />
          <RevenueTile
            label="Pipeline Value"
            value={`$${(summary.pipelineValue / 1000).toFixed(0)}K`}
            icon={DollarSign}
          />
        </div>

        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4">
            Revenue Events
          </h2>
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] divide-y divide-[#1A1A1A]">
            {store.revenueEvents.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-sans text-sm text-[#9A9086]">No revenue events yet.</p>
              </div>
            ) : (
              [...store.revenueEvents]
                .sort((a, b) => b.date.localeCompare(a.date))
                .map((e) => (
                  <div key={e.id} className="flex items-center justify-between p-4">
                    <div>
                      <p className="font-sans text-sm font-medium text-[#E8E2D8]">
                        {e.description}
                      </p>
                      <p className="font-sans text-xs text-[#5A5550] mt-0.5">
                        {new Date(e.date).toLocaleDateString()} · {e.type.replace("_", " ")}
                      </p>
                    </div>
                    <p
                      className={`font-display text-lg font-bold ${
                        e.type === "expense" ? "text-[#EF4444]" : "text-[#4ADE80]"
                      }`}
                    >
                      {e.type === "expense" ? "-" : "+"}${e.amount.toLocaleString()}
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function RevenueTile({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086]">
          {label}
        </p>
        <Icon className="w-4 h-4 text-[#B87333]" />
      </div>
      <p className="font-display text-2xl font-bold text-[#E8E2D8] leading-none">{value}</p>
    </div>
  );
}
