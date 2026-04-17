"use client";

import { use, useMemo } from "react";
import { useSurgeStore } from "@/lib/surge/store";

const STAGE_LABELS: Record<string, string> = {
  lead: "Lead",
  estimate: "Estimate",
  mitigation: "Mitigation",
  rebuild: "Rebuild",
  billing: "Billing",
  collections: "Collections",
  closed: "Closed",
  lost: "Lost",
};

export default function JobsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const { store, hydrated } = useSurgeStore();
  const jobs = useMemo(() => store.jobs.filter((j) => j.clientId === clientId), [store.jobs, clientId]);

  if (!hydrated) return <main className="flex-1 p-8"><p className="font-sans text-sm text-[#9A9086]">Loading...</p></main>;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333] mb-1">Active Jobs</p>
        <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">Jobs</h1>
        <p className="font-sans text-xs text-[#5A5550] mt-2">
          {jobs.length} jobs in your pipeline
        </p>
      </div>
      <div className="p-8 space-y-3">
        {jobs.map((job) => (
          <div key={job.id} className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-display text-base font-bold text-[#E8E2D8]">{job.customerName}</h3>
                <p className="font-sans text-xs text-[#5A5550]">{job.address} · {job.externalJobId}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-bold text-[#B87333]">${job.amount.toLocaleString()}</p>
                <p className="font-sans text-xs text-[#9A9086]">{STAGE_LABELS[job.stage]} · {job.daysInCurrentStage}d</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#9A9086]">
              <span className="capitalize">{job.jobType}</span>
              <span>·</span>
              <span>{job.carrier}</span>
              <span>·</span>
              <span>{job.adjusterName || "No adjuster"}</span>
            </div>
            {job.flags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.flags.map((f) => (
                  <span key={f} className="px-2 py-0.5 rounded-[2px] bg-[#EF4444]/20 text-[#EF4444] font-sans text-[10px] font-bold tracking-wider uppercase">
                    {f.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
