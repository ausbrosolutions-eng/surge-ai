"use client";

import { useSurgeStore } from "@/lib/surge/store";

const STAGE_LABELS: Record<string, string> = {
  contract_sent: "Contract Sent",
  paid: "Paid - Awaiting Kickoff",
  kickoff_scheduled: "Kickoff Scheduled",
  kickoff_done: "Kickoff Complete",
  data_pulled: "Data Pulled",
  analysis: "Analysis In Progress",
  report_draft: "Report Draft",
  report_delivered: "Report Delivered",
  review_call_done: "Review Call Complete",
  converted_to_retainer: "Converted to Retainer",
  lost_post_audit: "Lost Post-Audit",
};

const STAGE_PROGRESS: Record<string, number> = {
  contract_sent: 5,
  paid: 10,
  kickoff_scheduled: 20,
  kickoff_done: 35,
  data_pulled: 50,
  analysis: 65,
  report_draft: 80,
  report_delivered: 90,
  review_call_done: 100,
  converted_to_retainer: 100,
  lost_post_audit: 100,
};

export default function AuditsPage() {
  const { store, hydrated } = useSurgeStore();

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading audits...</p>
      </main>
    );
  }

  const activeAudits = store.audits.filter(
    (a) => a.stage !== "converted_to_retainer" && a.stage !== "lost_post_audit"
  );
  const completedAudits = store.audits.filter(
    (a) => a.stage === "converted_to_retainer" || a.stage === "lost_post_audit"
  );

  const totalRevenueFromAudits = store.audits.reduce((sum, a) => sum + a.paymentAmount, 0);
  const conversionRate =
    store.audits.length > 0
      ? (store.audits.filter((a) => a.outcomes.retainerConverted).length / store.audits.length) * 100
      : 0;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1">
            Paid Ops Audit Delivery
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Audits
          </h1>
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Summary stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Active" value={activeAudits.length} detail="In delivery window" />
          <StatBox label="Completed" value={completedAudits.length} detail="All-time delivered" />
          <StatBox
            label="Audit Revenue"
            value={`$${(totalRevenueFromAudits / 1000).toFixed(1)}K`}
            detail="All-time collected"
          />
          <StatBox
            label="Conversion Rate"
            value={`${conversionRate.toFixed(0)}%`}
            detail="Audit to retainer"
          />
        </div>

        {/* Active audits */}
        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4">
            Active Delivery Pipeline
          </h2>
          <div className="space-y-3">
            {activeAudits.length === 0 ? (
              <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-12 text-center">
                <p className="font-sans text-sm text-[#9A9086] mb-1">No active audits.</p>
                <p className="font-sans text-xs text-[#5A5550]">
                  Book your first audit from a qualified pipeline prospect.
                </p>
              </div>
            ) : (
              activeAudits.map((a) => {
                const progress = STAGE_PROGRESS[a.stage];
                const daysSinceStart = Math.floor(
                  (Date.now() - new Date(a.startDate).getTime()) / 86400000
                );
                const daysToDelivery = Math.floor(
                  (new Date(a.targetDeliveryDate).getTime() - Date.now()) / 86400000
                );
                return (
                  <div
                    key={a.id}
                    className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-display text-lg font-bold text-[#E8E2D8]">
                          {a.companyName}
                        </h3>
                        <p className="font-sans text-xs text-[#9A9086] mt-0.5">
                          Started {new Date(a.startDate).toLocaleDateString()} · Day{" "}
                          {daysSinceStart} of 14
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-sm font-bold text-[#B87333]">
                          {STAGE_LABELS[a.stage]}
                        </p>
                        <p className="font-sans text-xs text-[#5A5550] mt-0.5">
                          {daysToDelivery > 0
                            ? `${daysToDelivery} days to delivery`
                            : daysToDelivery === 0
                            ? "Delivery today"
                            : `${Math.abs(daysToDelivery)} days overdue`}
                        </p>
                      </div>
                    </div>
                    <div className="w-full h-1.5 bg-[#1A1A1A] rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-[#B87333] transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-sans text-xs text-[#9A9086]">
                        Payment: <span className="text-[#E8E2D8]">${a.paymentAmount.toLocaleString()}</span>
                      </span>
                      <span className="font-sans text-xs text-[#9A9086]">
                        API Access:{" "}
                        <span className={a.apiAccessGranted ? "text-[#4ADE80]" : "text-[#EF4444]"}>
                          {a.apiAccessGranted ? "Granted" : "Pending"}
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Completed audits */}
        {completedAudits.length > 0 && (
          <div>
            <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4">
              Completed Audits
            </h2>
            <div className="space-y-3">
              {completedAudits.map((a) => (
                <div
                  key={a.id}
                  className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#E8E2D8]">
                        {a.companyName}
                      </h3>
                      <p className="font-sans text-xs text-[#9A9086] mt-0.5">
                        Delivered {new Date(a.targetDeliveryDate).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-[2px] font-sans text-xs font-bold tracking-wider uppercase ${
                        a.outcomes.retainerConverted
                          ? "bg-[#4ADE80]/20 text-[#4ADE80]"
                          : "bg-[#EF4444]/20 text-[#EF4444]"
                      }`}
                    >
                      {a.outcomes.retainerConverted
                        ? `Converted - Phase ${a.outcomes.retainerPhase}`
                        : "Did not convert"}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-4 pt-3 border-t border-[#1A1A1A]">
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550]">
                        Stuck Revenue
                      </p>
                      <p className="font-display text-base font-bold text-[#E8E2D8]">
                        ${(a.findings.stuckRevenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550]">
                        Blocked Jobs
                      </p>
                      <p className="font-display text-base font-bold text-[#E8E2D8]">
                        {a.findings.blockedJobs}
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550]">
                        Data Integrity
                      </p>
                      <p className="font-display text-base font-bold text-[#E8E2D8]">
                        {a.findings.dataIntegrityScore}/100
                      </p>
                    </div>
                    <div>
                      <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550]">
                        Projected ROI
                      </p>
                      <p className="font-display text-base font-bold text-[#B87333]">
                        ${(a.findings.projectedROI / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function StatBox({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5">
      <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086] mb-2">
        {label}
      </p>
      <p className="font-display text-3xl font-bold text-[#E8E2D8] leading-none mb-1">
        {value}
      </p>
      <p className="font-sans text-xs text-[#5A5550] mt-2">{detail}</p>
    </div>
  );
}
