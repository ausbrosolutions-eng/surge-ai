"use client";

import { useState } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import { SIGNAL_ICONS } from "@/lib/surge/types";
import { ExternalLink, Check, X, Eye, Plus } from "lucide-react";
import { AddSignalForm } from "@/components/surge/forms/AddSignalForm";
import { Button } from "@/components/surge/ui/FormField";

export default function SignalsPage() {
  const { store, hydrated, saveSignal } = useSurgeStore();
  const [filter, setFilter] = useState<"all" | "new" | "reviewed" | "actioned" | "dismissed">("new");
  const [addOpen, setAddOpen] = useState(false);

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading signals...</p>
      </main>
    );
  }

  const filtered = store.signals.filter((s) => filter === "all" || s.status === filter);

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1">
              Trigger Event Feed
            </p>
            <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
              Signals
            </h1>
            <p className="font-sans text-xs text-[#5A5550] mt-2">
              Act within 48 hours. Speed multiplies conversion.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-2 mr-3">
              {(["all", "new", "reviewed", "actioned", "dismissed"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-[2px] font-sans text-xs font-medium tracking-wider uppercase transition-colors ${
                    filter === f
                      ? "bg-[#B87333] text-[#0A0A0A]"
                      : "bg-[#111111] text-[#9A9086] border border-[#2A2520] hover:text-[#E8E2D8]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="w-3 h-3" /> Add Signal
            </Button>
          </div>
        </div>
      </div>

      <AddSignalForm open={addOpen} onClose={() => setAddOpen(false)} onSave={saveSignal} />

      <div className="p-8 space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-12 text-center">
            <p className="font-sans text-sm text-[#9A9086]">No signals in this view.</p>
          </div>
        ) : (
          filtered.map((sig) => (
            <div
              key={sig.id}
              className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5 flex items-start gap-4"
            >
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <span className="text-2xl leading-none">{SIGNAL_ICONS[sig.type]}</span>
                <span className="font-sans text-[9px] uppercase tracking-widest text-[#5A5550]">
                  {sig.type}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-1">
                  <h3 className="font-display text-base font-bold text-[#E8E2D8]">
                    {sig.companyName}
                    {sig.contactName && (
                      <span className="font-sans font-normal text-[#9A9086] ml-2">
                        · {sig.contactName}
                      </span>
                    )}
                  </h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550]">
                      {sig.source.replace("_", " ")}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-[2px] font-sans text-[10px] font-bold tracking-wider uppercase ${
                        sig.status === "new"
                          ? "bg-[#B87333]/20 text-[#B87333]"
                          : sig.status === "actioned"
                          ? "bg-[#4ADE80]/20 text-[#4ADE80]"
                          : sig.status === "dismissed"
                          ? "bg-[#EF4444]/20 text-[#EF4444]"
                          : "bg-[#60A5FA]/20 text-[#60A5FA]"
                      }`}
                    >
                      {sig.status}
                    </span>
                  </div>
                </div>
                <p className="font-sans text-sm text-[#9A9086] leading-relaxed mb-2">
                  {sig.summary}
                </p>
                {sig.actionTaken && (
                  <p className="font-sans text-xs text-[#4ADE80] mb-2 italic">
                    Action: {sig.actionTaken}
                  </p>
                )}
                <div className="flex items-center justify-between">
                  <p className="font-sans text-xs text-[#5A5550]">
                    Detected {new Date(sig.detectedAt).toLocaleDateString()}
                  </p>
                  <div className="flex items-center gap-2">
                    {sig.url && (
                      <a
                        href={sig.url}
                        target="_blank"
                        rel="noopener"
                        className="flex items-center gap-1 font-sans text-xs text-[#9A9086] hover:text-[#B87333]"
                      >
                        Source <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                    {sig.status === "new" && (
                      <>
                        <button
                          onClick={() =>
                            saveSignal({
                              ...sig,
                              status: "reviewed",
                              actionTaken: "Marked for review",
                            })
                          }
                          className="flex items-center gap-1 px-2 py-1 bg-[#60A5FA]/10 hover:bg-[#60A5FA]/20 text-[#60A5FA] font-sans text-xs font-medium rounded-[2px]"
                        >
                          <Eye className="w-3 h-3" /> Review
                        </button>
                        <button
                          onClick={() =>
                            saveSignal({
                              ...sig,
                              status: "actioned",
                              actionTaken: "Manually marked as actioned",
                            })
                          }
                          className="flex items-center gap-1 px-2 py-1 bg-[#4ADE80]/10 hover:bg-[#4ADE80]/20 text-[#4ADE80] font-sans text-xs font-medium rounded-[2px]"
                        >
                          <Check className="w-3 h-3" /> Actioned
                        </button>
                        <button
                          onClick={() =>
                            saveSignal({
                              ...sig,
                              status: "dismissed",
                              actionTaken: "Dismissed - not a fit",
                            })
                          }
                          className="flex items-center gap-1 px-2 py-1 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] font-sans text-xs font-medium rounded-[2px]"
                        >
                          <X className="w-3 h-3" /> Dismiss
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
