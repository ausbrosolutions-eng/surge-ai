"use client";

import { use, useMemo } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import { Shield, AlertCircle, Clock, TrendingUp, Mail, User } from "lucide-react";

// Carrier difficulty ranking (from CLAUDE.md carrier intel)
const CARRIER_DIFFICULTY: Record<string, { rank: number; label: string; notes: string }> = {
  USAA: { rank: 1, label: "Hardest", notes: "XactAnalysis notes + photos required. Must approve BEFORE work." },
  "State Farm": { rank: 2, label: "Hard", notes: "Adjusters resist supplements. Aggressive cost containment." },
  Allstate: { rank: 3, label: "Moderate-Hard", notes: "Photo-based estimates miss damage. Slow review." },
  Farmers: { rank: 4, label: "Moderate-Hard", notes: "Symbility transition creates confusion." },
  Travelers: { rank: 5, label: "Moderate", notes: "Westhill workflow: 68% no-supplement rate." },
  "Liberty Mutual": { rank: 6, label: "Moderate", notes: "Dedicated supplement portal." },
  Progressive: { rank: 7, label: "Moderate", notes: "Direct adjuster negotiation." },
  Nationwide: { rank: 8, label: "Moderate", notes: "Flows through Accuserve TPA." },
  "American Family": { rank: 9, label: "Moderate", notes: "Standard but slow." },
  Erie: { rank: 10, label: "Easiest", notes: "Collaborative, contractor-friendly." },
};

export default function ClaimsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const { store, hydrated } = useSurgeStore();

  const claims = useMemo(
    () =>
      store.jobs
        .filter((j) => j.clientId === clientId && j.stage !== "closed" && j.stage !== "lost")
        .sort((a, b) => b.amount - a.amount),
    [store.jobs, clientId]
  );

  // Group by adjuster to see who's holding up the most
  const adjusterMap = useMemo(() => {
    const map = new Map<
      string,
      { name: string; carrier: string; email: string; jobs: typeof claims; totalAmount: number; ghostFlag: boolean }
    >();
    claims.forEach((job) => {
      const key = `${job.adjusterName}|${job.carrier}`;
      if (!job.adjusterName) return;
      const existing = map.get(key);
      if (existing) {
        existing.jobs.push(job);
        existing.totalAmount += job.amount;
        if (job.flags.some((f) => f.includes("adjuster_nonresponsive"))) existing.ghostFlag = true;
      } else {
        map.set(key, {
          name: job.adjusterName,
          carrier: job.carrier,
          email: job.adjusterEmail,
          jobs: [job],
          totalAmount: job.amount,
          ghostFlag: job.flags.some((f) => f.includes("adjuster_nonresponsive")),
        });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.totalAmount - a.totalAmount);
  }, [claims]);

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading claims...</p>
      </main>
    );
  }

  const totalClaimValue = claims.reduce((s, j) => s + j.amount, 0);
  const supplementReadyCount = claims.filter((j) =>
    j.flags.some((f) => f.includes("missing") || f.includes("supplement"))
  ).length;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333] mb-1">
            Claims Workflow
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Active Claims
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-2">
            Every claim tracked. Every adjuster visible. Every supplement gap flagged before billing.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryTile
            label="Active Claims"
            value={claims.length}
            detail="Open mitigation + rebuild + billing"
            icon={Shield}
          />
          <SummaryTile
            label="Total Claim Value"
            value={`$${(totalClaimValue / 1000).toFixed(0)}K`}
            detail="In-progress pipeline"
            icon={TrendingUp}
          />
          <SummaryTile
            label="Documentation Gaps"
            value={supplementReadyCount}
            detail="Claims flagged for review"
            icon={AlertCircle}
          />
          <SummaryTile
            label="Unique Adjusters"
            value={adjusterMap.length}
            detail="Across all open claims"
            icon={User}
          />
        </div>

        {/* Adjuster tracking */}
        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4">
            Adjuster Tracking
          </h2>
          <p className="font-sans text-xs text-[#5A5550] mb-4">
            Ranked by total claim exposure. Ghosted adjusters (no response 14+ days) are flagged in red.
          </p>
          <div className="space-y-3">
            {adjusterMap.length === 0 ? (
              <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-8 text-center">
                <p className="font-sans text-sm text-[#9A9086]">No active adjusters.</p>
              </div>
            ) : (
              adjusterMap.map((adj) => {
                const difficulty = CARRIER_DIFFICULTY[adj.carrier];
                return (
                  <div
                    key={`${adj.name}-${adj.carrier}`}
                    className={`bg-[#111111] border rounded-[2px] p-5 ${
                      adj.ghostFlag ? "border-[#EF4444]/40" : "border-[#2A2520]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            adj.ghostFlag ? "bg-[#EF4444]/15" : "bg-[#B87333]/15"
                          }`}
                        >
                          <User
                            className={`w-5 h-5 ${adj.ghostFlag ? "text-[#EF4444]" : "text-[#B87333]"}`}
                          />
                        </div>
                        <div>
                          <h3 className="font-display text-base font-bold text-[#E8E2D8]">
                            {adj.name}
                          </h3>
                          <p className="font-sans text-xs text-[#9A9086]">
                            {adj.carrier}
                            {difficulty && (
                              <span className="ml-2 text-[#5A5550]">
                                · #{difficulty.rank} {difficulty.label}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg font-bold text-[#B87333]">
                          ${adj.totalAmount.toLocaleString()}
                        </p>
                        <p className="font-sans text-xs text-[#5A5550]">
                          {adj.jobs.length} {adj.jobs.length === 1 ? "claim" : "claims"}
                        </p>
                      </div>
                    </div>
                    {adj.ghostFlag && (
                      <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-[2px] p-3 mb-3">
                        <p className="font-sans text-xs text-[#EF4444] font-semibold">
                          ⚠ Non-responsive. Escalate or call directly.
                        </p>
                      </div>
                    )}
                    {difficulty && (
                      <p className="font-sans text-xs text-[#9A9086] mb-3 italic">
                        {difficulty.notes}
                      </p>
                    )}
                    {adj.email && (
                      <a
                        href={`mailto:${adj.email}`}
                        className="flex items-center gap-1.5 font-sans text-xs text-[#B87333] hover:text-[#D4956A]"
                      >
                        <Mail className="w-3 h-3" /> {adj.email}
                      </a>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* All active claims */}
        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4">
            All Active Claims
          </h2>
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#2A2520] bg-[#0A0A0A]">
              <div className="col-span-3 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Customer
              </div>
              <div className="col-span-2 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Type
              </div>
              <div className="col-span-2 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Carrier
              </div>
              <div className="col-span-2 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Stage / Days
              </div>
              <div className="col-span-1 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Amount
              </div>
              <div className="col-span-2 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Flags
              </div>
            </div>
            {claims.map((job) => (
              <div
                key={job.id}
                className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-[#1A1A1A] last:border-0 hover:bg-[#151515] transition-colors"
              >
                <div className="col-span-3">
                  <p className="font-sans text-sm font-medium text-[#E8E2D8]">{job.customerName}</p>
                  <p className="font-sans text-xs text-[#5A5550]">{job.externalJobId}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-sans text-sm text-[#E8E2D8] capitalize">{job.jobType}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-sans text-sm text-[#E8E2D8]">{job.carrier}</p>
                  <p className="font-sans text-xs text-[#5A5550]">{job.adjusterName || "No adjuster"}</p>
                </div>
                <div className="col-span-2">
                  <p className="font-sans text-sm text-[#E8E2D8] capitalize">{job.stage}</p>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#9A9086]" />
                    <p className="font-sans text-xs text-[#9A9086]">{job.daysInCurrentStage}d</p>
                  </div>
                </div>
                <div className="col-span-1">
                  <p className="font-display text-sm font-bold text-[#B87333]">
                    ${(job.amount / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="col-span-2 flex flex-wrap gap-1">
                  {job.flags.length === 0 ? (
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#4ADE80]/15 text-[#4ADE80] font-sans text-[10px] font-bold tracking-wider uppercase">
                      Clean
                    </span>
                  ) : (
                    job.flags.map((f) => (
                      <span
                        key={f}
                        className="px-2 py-0.5 rounded-[2px] bg-[#EF4444]/15 text-[#EF4444] font-sans text-[10px] font-bold tracking-wider uppercase"
                      >
                        {f.replace(/_/g, " ")}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function SummaryTile({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  detail: string;
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
      <p className="font-display text-3xl font-bold text-[#E8E2D8] leading-none mb-1">{value}</p>
      <p className="font-sans text-xs text-[#5A5550] mt-2">{detail}</p>
    </div>
  );
}
