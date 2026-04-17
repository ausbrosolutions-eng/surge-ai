"use client";

import { useMemo, useState } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import {
  STAGE_LABELS,
  STAGE_ORDER,
  TIER_COLORS,
  SIGNAL_ICONS,
  type ProspectStage,
  type Prospect,
} from "@/lib/surge/types";
import { ArrowRight, Phone, Mail, Linkedin, Plus } from "lucide-react";
import { AddProspectForm } from "@/components/surge/forms/AddProspectForm";
import { LogActivityForm } from "@/components/surge/forms/LogActivityForm";
import { Button } from "@/components/surge/ui/FormField";

export default function PipelinePage() {
  const { store, hydrated, saveProspect, saveActivity } = useSurgeStore();
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [tierFilter, setTierFilter] = useState<0 | 1 | 2 | 3>(0);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);

  const groupedProspects = useMemo(() => {
    const groups: Record<ProspectStage, Prospect[]> = {
      unreached: [],
      touched: [],
      responding: [],
      meeting_booked: [],
      discovery_done: [],
      audit_proposed: [],
      audit_booked: [],
      audit_delivered: [],
      retainer_signed: [],
      lost: [],
    };
    store.prospects
      .filter((p) => tierFilter === 0 || p.tier === tierFilter)
      .filter((p) => p.stage !== "lost")
      .forEach((p) => {
        groups[p.stage].push(p);
      });
    return groups;
  }, [store.prospects, tierFilter]);

  const advanceStage = (prospect: Prospect) => {
    const currentIdx = STAGE_ORDER.indexOf(prospect.stage);
    if (currentIdx === -1 || currentIdx === STAGE_ORDER.length - 1) return;
    const nextStage = STAGE_ORDER[currentIdx + 1];
    saveProspect({ ...prospect, stage: nextStage });
    setSelectedProspect(null);
  };

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading pipeline...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-hidden flex flex-col">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1">
              Prospect Pipeline
            </p>
            <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
              Pipeline
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex gap-2 mr-3">
              {[0, 1, 2, 3].map((t) => (
                <button
                  key={t}
                  onClick={() => setTierFilter(t as 0 | 1 | 2 | 3)}
                  className={`px-3 py-1.5 rounded-[2px] font-sans text-xs font-medium tracking-wider uppercase transition-colors ${
                    tierFilter === t
                      ? "bg-[#B87333] text-[#0A0A0A]"
                      : "bg-[#111111] text-[#9A9086] border border-[#2A2520] hover:text-[#E8E2D8]"
                  }`}
                >
                  {t === 0 ? "All" : `Tier ${t}`}
                </button>
              ))}
            </div>
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="w-3 h-3" /> Add Prospect
            </Button>
          </div>
        </div>
      </div>

      <AddProspectForm
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={saveProspect}
      />
      <AddProspectForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSave={(p) => {
          saveProspect(p);
          setSelectedProspect(p);
        }}
        initial={selectedProspect || undefined}
      />
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
        defaultProspectId={selectedProspect?.id}
      />

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 p-6 min-w-max h-full">
          {STAGE_ORDER.map((stage) => {
            const prospects = groupedProspects[stage];
            return (
              <div
                key={stage}
                className="w-72 flex-shrink-0 flex flex-col bg-[#0E0E0E] border border-[#2A2520] rounded-[2px]"
              >
                <div className="px-3 py-3 border-b border-[#2A2520] flex items-center justify-between">
                  <h3 className="font-display text-[11px] font-bold tracking-[0.1em] uppercase text-[#E8E2D8]">
                    {STAGE_LABELS[stage]}
                  </h3>
                  <span className="font-display text-xs font-bold text-[#5A5550]">
                    {prospects.length}
                  </span>
                </div>
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {prospects.length === 0 ? (
                    <p className="font-sans text-xs text-[#3A3530] text-center py-4 italic">
                      Empty
                    </p>
                  ) : (
                    prospects.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProspect(p)}
                        className="w-full text-left bg-[#151515] border border-[#2A2520] rounded-[2px] p-3 hover:border-[#B87333]/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <p className="font-sans text-sm font-semibold text-[#E8E2D8] leading-tight">
                            {p.companyName}
                          </p>
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                            style={{ backgroundColor: TIER_COLORS[p.tier] }}
                            title={`Tier ${p.tier}`}
                          />
                        </div>
                        <p className="font-sans text-[11px] text-[#9A9086] mb-2">
                          {p.contactName}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <span className="text-xs leading-none">
                              {SIGNAL_ICONS[p.triggerEvent]}
                            </span>
                            <span className="font-sans text-[10px] uppercase tracking-wider text-[#5A5550]">
                              {p.triggerEvent}
                            </span>
                          </div>
                          <span className="font-display text-[11px] font-bold text-[#B87333]">
                            ${(p.estimatedValue / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prospect detail drawer */}
      {selectedProspect && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-start justify-end"
          onClick={() => setSelectedProspect(null)}
        >
          <div
            className="w-full max-w-xl h-full bg-[#111111] border-l border-[#2A2520] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-[#2A2520]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="px-2 py-0.5 rounded-[2px] font-sans text-[10px] font-bold tracking-wider uppercase"
                      style={{
                        backgroundColor: `${TIER_COLORS[selectedProspect.tier]}20`,
                        color: TIER_COLORS[selectedProspect.tier],
                      }}
                    >
                      Tier {selectedProspect.tier}
                    </span>
                    <span className="font-sans text-xs text-[#9A9086]">
                      ICP Score: {selectedProspect.icpScore}/30
                    </span>
                  </div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-[#E8E2D8]">
                    {selectedProspect.companyName}
                  </h2>
                  <p className="font-sans text-sm text-[#9A9086] mt-1">
                    {selectedProspect.contactName} · {selectedProspect.title}
                  </p>
                  <p className="font-sans text-xs text-[#5A5550] mt-1">
                    {selectedProspect.city}, {selectedProspect.state} · ${(selectedProspect.annualRevenue / 1000000).toFixed(1)}M rev · {selectedProspect.employeeCount} employees
                  </p>
                </div>
                <button
                  onClick={() => setSelectedProspect(null)}
                  className="text-[#5A5550] hover:text-[#E8E2D8] text-2xl leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Stage + actions */}
            <div className="p-6 border-b border-[#2A2520]">
              <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086] mb-2">
                Current Stage
              </p>
              <div className="flex items-center justify-between mb-3">
                <p className="font-display text-lg font-bold text-[#E8E2D8]">
                  {STAGE_LABELS[selectedProspect.stage]}
                </p>
                <button
                  onClick={() => advanceStage(selectedProspect)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#B87333] hover:bg-[#D4956A] text-[#0A0A0A] font-sans text-xs font-semibold tracking-wider uppercase rounded-[2px] transition-colors"
                >
                  Advance Stage <ArrowRight className="w-3 h-3" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" onClick={() => setLogOpen(true)}>
                  Log Activity
                </Button>
                <Button variant="secondary" onClick={() => setEditOpen(true)}>
                  Edit
                </Button>
              </div>
            </div>

            {/* Trigger event */}
            <div className="p-6 border-b border-[#2A2520]">
              <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086] mb-2">
                Trigger Event
              </p>
              <div className="flex items-start gap-3">
                <span className="text-2xl leading-none">
                  {SIGNAL_ICONS[selectedProspect.triggerEvent]}
                </span>
                <div className="flex-1">
                  <p className="font-sans text-sm font-medium text-[#E8E2D8] capitalize mb-1">
                    {selectedProspect.triggerEvent}
                  </p>
                  <p className="font-sans text-xs text-[#9A9086] leading-relaxed">
                    {selectedProspect.triggerEventSummary}
                  </p>
                  {selectedProspect.referralSource && (
                    <p className="font-sans text-xs text-[#B87333] mt-2">
                      Referred by: {selectedProspect.referralSource}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Touch history */}
            <div className="p-6 border-b border-[#2A2520]">
              <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086] mb-3">
                Touch History
              </p>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="font-display text-2xl font-bold text-[#E8E2D8]">
                    {selectedProspect.touchCount}
                  </p>
                  <p className="font-sans text-xs text-[#5A5550]">Total Touches</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-[#E8E2D8]">
                    {selectedProspect.lastTouch
                      ? new Date(selectedProspect.lastTouch).toLocaleDateString()
                      : "None"}
                  </p>
                  <p className="font-sans text-xs text-[#5A5550]">Last Touch</p>
                </div>
                <div>
                  <p className="font-sans text-xs text-[#B87333]">
                    {selectedProspect.nextTouch
                      ? new Date(selectedProspect.nextTouch).toLocaleDateString()
                      : "Not scheduled"}
                  </p>
                  <p className="font-sans text-xs text-[#5A5550]">Next Touch</p>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="p-6 border-b border-[#2A2520]">
              <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086] mb-2">
                Notes
              </p>
              <p className="font-sans text-sm text-[#E8E2D8] leading-relaxed">
                {selectedProspect.notes || "No notes yet."}
              </p>
            </div>

            {/* Contact */}
            <div className="p-6">
              <p className="font-sans text-[10px] font-medium tracking-[0.12em] uppercase text-[#9A9086] mb-3">
                Contact
              </p>
              <div className="space-y-2">
                {selectedProspect.email && (
                  <a href={`mailto:${selectedProspect.email}`} className="flex items-center gap-2 font-sans text-sm text-[#E8E2D8] hover:text-[#B87333]">
                    <Mail className="w-4 h-4" /> {selectedProspect.email}
                  </a>
                )}
                {selectedProspect.phone && (
                  <a href={`tel:${selectedProspect.phone}`} className="flex items-center gap-2 font-sans text-sm text-[#E8E2D8] hover:text-[#B87333]">
                    <Phone className="w-4 h-4" /> {selectedProspect.phone}
                  </a>
                )}
                {selectedProspect.linkedIn && (
                  <a href={selectedProspect.linkedIn} target="_blank" rel="noopener" className="flex items-center gap-2 font-sans text-sm text-[#E8E2D8] hover:text-[#B87333]">
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
                {!selectedProspect.email && !selectedProspect.phone && !selectedProspect.linkedIn && (
                  <p className="font-sans text-xs text-[#5A5550] italic">No contact info captured yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
