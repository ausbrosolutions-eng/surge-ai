"use client";

import { use, useMemo } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import { AlertTriangle, Clock, DollarSign, Phone, Mail } from "lucide-react";

export default function CollectionsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const { store, hydrated } = useSurgeStore();

  const metrics = store.metrics.find((m) => m.clientId === clientId);
  const stuckJobs = useMemo(
    () =>
      store.jobs
        .filter((j) => j.clientId === clientId && j.stage === "collections")
        .sort((a, b) => b.amount - a.amount),
    [store.jobs, clientId]
  );

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading collections...</p>
      </main>
    );
  }

  if (!metrics) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#EF4444]">No metrics found.</p>
      </main>
    );
  }

  const totalExposure = stuckJobs.reduce((s, j) => s + j.amount, 0);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333] mb-1">
            Collections Recovery Dashboard
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Stuck Revenue
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-2">
            Every stuck invoice visible. Every follow-up automated. Every dollar tracked.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Recovery summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-[#4ADE80]/15 to-transparent border border-[#4ADE80]/30 rounded-[2px] p-5">
            <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#4ADE80] mb-2">
              Recovered This Month
            </p>
            <p className="font-display text-3xl font-bold text-[#E8E2D8] leading-none">
              ${metrics.collections.recoveredThisMonth.toLocaleString()}
            </p>
            <p className="font-sans text-xs text-[#9A9086] mt-2">
              Since Surge automation kicked in
            </p>
          </div>
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5">
            <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086] mb-2">
              Still Stuck
            </p>
            <p className="font-display text-3xl font-bold text-[#E8E2D8] leading-none">
              ${(totalExposure / 1000).toFixed(0)}K
            </p>
            <p className="font-sans text-xs text-[#5A5550] mt-2">
              {stuckJobs.length} open invoices
            </p>
          </div>
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5">
            <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086] mb-2">
              Avg Days Aged
            </p>
            <p className="font-display text-3xl font-bold text-[#E8E2D8] leading-none">
              {metrics.collections.avgDaysAged}
            </p>
            <p className="font-sans text-xs text-[#5A5550] mt-2">Down from 199</p>
          </div>
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5">
            <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086] mb-2">
              Recovered YTD
            </p>
            <p className="font-display text-3xl font-bold text-[#B87333] leading-none">
              ${metrics.collections.recoveredYTD.toLocaleString()}
            </p>
            <p className="font-sans text-xs text-[#5A5550] mt-2">
              On pace for ${(metrics.collections.recoveredYTD * 12).toLocaleString()} annualized
            </p>
          </div>
        </div>

        {/* Stuck jobs table */}
        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4">
            Every Stuck Invoice
          </h2>
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] overflow-hidden">
            <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-[#2A2520] bg-[#0A0A0A]">
              <div className="col-span-3 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Customer / Address
              </div>
              <div className="col-span-2 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Carrier
              </div>
              <div className="col-span-2 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Amount
              </div>
              <div className="col-span-2 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Days Aged
              </div>
              <div className="col-span-3 font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086]">
                Status
              </div>
            </div>
            {stuckJobs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-sans text-sm text-[#9A9086]">No stuck invoices.</p>
              </div>
            ) : (
              stuckJobs.map((job) => {
                const isWorst = job.daysInCurrentStage > 365;
                const isHot = job.daysInCurrentStage < 30 && job.amount > 50000;
                return (
                  <div
                    key={job.id}
                    className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-[#1A1A1A] last:border-0 hover:bg-[#151515] transition-colors"
                  >
                    <div className="col-span-3">
                      <p className="font-sans text-sm font-medium text-[#E8E2D8]">
                        {job.customerName}
                      </p>
                      <p className="font-sans text-xs text-[#5A5550]">{job.address}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-sans text-sm text-[#E8E2D8]">{job.carrier}</p>
                      <p className="font-sans text-xs text-[#5A5550]">
                        {job.adjusterName || "No adjuster"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-display text-base font-bold text-[#B87333]">
                        ${job.amount.toLocaleString()}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <div className="flex items-center gap-1.5">
                        <Clock
                          className={`w-3.5 h-3.5 ${
                            isWorst ? "text-[#EF4444]" : isHot ? "text-[#FBBF24]" : "text-[#9A9086]"
                          }`}
                        />
                        <p
                          className={`font-display text-sm font-bold ${
                            isWorst ? "text-[#EF4444]" : "text-[#E8E2D8]"
                          }`}
                        >
                          {job.daysInCurrentStage}d
                        </p>
                      </div>
                    </div>
                    <div className="col-span-3 flex items-center gap-2 flex-wrap">
                      {isHot && (
                        <span className="px-2 py-0.5 rounded-[2px] bg-[#FBBF24]/20 text-[#FBBF24] font-sans text-[10px] font-bold tracking-wider uppercase">
                          Hot · Priority
                        </span>
                      )}
                      {isWorst && (
                        <span className="px-2 py-0.5 rounded-[2px] bg-[#EF4444]/20 text-[#EF4444] font-sans text-[10px] font-bold tracking-wider uppercase">
                          Extreme age
                        </span>
                      )}
                      {job.flags.includes("adjuster_nonresponsive_120d") && (
                        <span className="px-2 py-0.5 rounded-[2px] bg-[#EF4444]/20 text-[#EF4444] font-sans text-[10px] font-bold tracking-wider uppercase">
                          Adjuster ghost
                        </span>
                      )}
                      {job.flags.includes("large_exposure") && (
                        <span className="px-2 py-0.5 rounded-[2px] bg-[#B87333]/20 text-[#B87333] font-sans text-[10px] font-bold tracking-wider uppercase">
                          High $
                        </span>
                      )}
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
