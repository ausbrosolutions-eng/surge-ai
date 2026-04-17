"use client";

import { use, useMemo, useState } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import { CheckCircle2, AlertCircle, Clock, Plus, Zap } from "lucide-react";
import { AddActionItemForm } from "@/components/surge/forms/AddActionItemForm";
import { Button } from "@/components/surge/ui/FormField";

export default function ActionsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const { store, hydrated, completeActionItem, saveActionItem, runClientAutomation } = useSurgeStore();
  const [addOpen, setAddOpen] = useState(false);
  const [automationBanner, setAutomationBanner] = useState<string | null>(null);

  const handleRunAutomation = () => {
    const result = runClientAutomation(clientId);
    setAutomationBanner(
      result.created > 0
        ? `Surge automation ran ${result.log.rulesEvaluated} rules and created ${result.created} new action item${result.created === 1 ? "" : "s"}.`
        : `Surge automation ran ${result.log.rulesEvaluated} rules. No new action items needed - your queue is already current.`
    );
    setTimeout(() => setAutomationBanner(null), 8000);
  };

  const staff = useMemo(
    () => store.staff.filter((s) => s.clientId === clientId),
    [store.staff, clientId]
  );
  const clientJobs = useMemo(
    () => store.jobs.filter((j) => j.clientId === clientId),
    [store.jobs, clientId]
  );

  const actions = useMemo(
    () =>
      store.actionItems
        .filter((a) => a.clientId === clientId)
        .sort((a, b) => {
          if (a.completedAt && !b.completedAt) return 1;
          if (!a.completedAt && b.completedAt) return -1;
          const pri = { urgent: 0, high: 1, medium: 2 };
          return pri[a.priority] - pri[b.priority];
        }),
    [store.actionItems, clientId]
  );

  const open = actions.filter((a) => !a.completedAt);
  const done = actions.filter((a) => a.completedAt);

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6 flex items-end justify-between">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333] mb-1">
            Today&rsquo;s Queue
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Action Queue
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-2">
            {open.length} open · {done.length} completed today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={handleRunAutomation}>
            <Zap className="w-3 h-3" /> Run Automation
          </Button>
          <Button onClick={() => setAddOpen(true)}>
            <Plus className="w-3 h-3" /> Add Action Item
          </Button>
        </div>
      </div>

      {automationBanner && (
        <div className="mx-8 mt-4 bg-[#B87333]/10 border border-[#B87333]/30 rounded-[2px] p-4 flex items-center gap-3">
          <Zap className="w-4 h-4 text-[#B87333] flex-shrink-0" />
          <p className="font-sans text-sm text-[#E8E2D8]">{automationBanner}</p>
        </div>
      )}

      <AddActionItemForm
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={saveActionItem}
        clientId={clientId}
        staff={staff.map((s) => ({ id: s.id, name: s.name, role: s.role }))}
        jobs={clientJobs.map((j) => ({
          id: j.id,
          customerName: j.customerName,
          externalJobId: j.externalJobId,
        }))}
      />

      <div className="p-8 space-y-3">
        {open.map((item) => {
          const staff = store.staff.find((s) => s.id === item.assignedToStaffId);
          return (
            <div key={item.id} className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5 flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {item.priority === "urgent" ? (
                  <AlertCircle className="w-5 h-5 text-[#EF4444]" />
                ) : item.priority === "high" ? (
                  <Clock className="w-5 h-5 text-[#FBBF24]" />
                ) : (
                  <Clock className="w-5 h-5 text-[#9A9086]" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="font-display text-base font-bold text-[#E8E2D8]">
                    {item.title}
                  </h3>
                  {item.dollarImpact > 0 && (
                    <span className="font-display text-lg font-bold text-[#B87333]">
                      ${item.dollarImpact.toLocaleString()}
                    </span>
                  )}
                </div>
                <p className="font-sans text-sm text-[#9A9086] leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="font-sans text-xs text-[#5A5550]">
                    Assigned to {staff?.name || "Unassigned"} · Due{" "}
                    {new Date(item.dueDate).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => completeActionItem(item.id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 text-[#4ADE80] font-sans text-xs font-semibold rounded-[2px] transition-colors"
                  >
                    <CheckCircle2 className="w-3 h-3" /> Mark Done
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {done.length > 0 && (
          <>
            <h3 className="font-display text-sm font-bold tracking-wider uppercase text-[#5A5550] mt-8 mb-3">
              Completed
            </h3>
            {done.map((item) => (
              <div
                key={item.id}
                className="bg-[#111111]/50 border border-[#1A1A1A] rounded-[2px] p-4 flex items-center gap-3 opacity-60"
              >
                <CheckCircle2 className="w-4 h-4 text-[#4ADE80] flex-shrink-0" />
                <p className="font-sans text-sm text-[#9A9086] line-through flex-1">
                  {item.title}
                </p>
                {item.completedAt && (
                  <p className="font-sans text-xs text-[#5A5550]">
                    {new Date(item.completedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
