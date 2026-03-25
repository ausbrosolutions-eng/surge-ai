"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  X,
  Mail,
  Users,
  Instagram,
  MoreHorizontal,
  Calendar,
  Trash2,
  AlertCircle,
  Phone,
  Building2,
  MapPin,
} from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import type { OutreachProspect } from "@/lib/types";

// ── Constants ─────────────────────────────────────────────────

const KANBAN_COLUMNS: OutreachProspect["status"][] = [
  "New",
  "Contacted",
  "Replied",
  "Call Booked",
  "Closed",
];

const COLUMN_COLORS: Record<OutreachProspect["status"], string> = {
  New: "bg-gray-400",
  Contacted: "bg-blue-400",
  Replied: "bg-amber-400",
  "Call Booked": "bg-[#00D4C8]",
  Closed: "bg-emerald-500",
  "Not Interested": "bg-red-400",
};

const TRADE_COLORS: Record<string, string> = {
  HVAC: "bg-[#00D4C8]/15 text-[#00D4C8] border-[#00D4C8]/30",
  Plumbing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Roofing: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  Electrical: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  Landscaping: "bg-green-500/15 text-green-400 border-green-500/30",
};

const SOURCE_ICONS: Record<OutreachProspect["source"], React.ComponentType<{ className?: string }>> = {
  Instagram,
  "Cold Email": Mail,
  Referral: Users,
  Other: MoreHorizontal,
};

const SOURCES: OutreachProspect["source"][] = [
  "Instagram",
  "Cold Email",
  "Referral",
  "Other",
];

const STATUSES: OutreachProspect["status"][] = [
  "New",
  "Contacted",
  "Replied",
  "Call Booked",
  "Closed",
  "Not Interested",
];

// ── Helpers ───────────────────────────────────────────────────

function tradeBadgeClass(trade: string): string {
  return TRADE_COLORS[trade] || "bg-gray-700/50 text-gray-400 border-gray-600/30";
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
}

function generateId(): string {
  return `prospect_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ── Sub-components ────────────────────────────────────────────

interface ProspectCardProps {
  prospect: OutreachProspect;
  onClick: () => void;
}

function ProspectCard({ prospect, onClick }: ProspectCardProps) {
  const SourceIcon = SOURCE_ICONS[prospect.source];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      onClick={onClick}
      className="bg-gray-800 border border-gray-700 hover:border-gray-600 rounded-xl p-4 cursor-pointer transition-colors group"
    >
      {/* Company */}
      <p className="text-sm font-bold text-white group-hover:text-blue-300 transition-colors mb-1 truncate">
        {prospect.company}
      </p>

      {/* Trade badge */}
      <span
        className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border mb-2 ${tradeBadgeClass(prospect.trade)}`}
      >
        {prospect.trade}
      </span>

      {/* City + source */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          {prospect.city}
        </div>
        <div className="flex items-center gap-1 text-gray-500" title={prospect.source}>
          <SourceIcon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Follow-up date */}
      {prospect.nextFollowUp && (
        <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
          <Calendar className="w-3 h-3" />
          Follow up {formatDate(prospect.nextFollowUp)}
        </div>
      )}
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────

export default function OutreachPage() {
  const { store, saveOutreachProspect, deleteOutreachProspect } = useStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProspect, setSelectedProspect] = useState<OutreachProspect | null>(null);
  const [panelDraft, setPanelDraft] = useState<OutreachProspect | null>(null);
  const [panelDirty, setPanelDirty] = useState(false);

  // New prospect form state
  const [newForm, setNewForm] = useState<Omit<OutreachProspect, "id" | "createdAt">>({
    name: "",
    company: "",
    trade: "",
    city: "",
    phone: "",
    source: "Cold Email",
    status: "New",
    notes: "",
    nextFollowUp: "",
  });
  const [addError, setAddError] = useState("");

  // ── Computed stats ───────────────────────────────────────────

  const allProspects = store.outreach;
  const activeProspects = allProspects.filter((p) => p.status !== "Not Interested");

  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const contactedThisWeek = allProspects.filter(
    (p) =>
      (p.status === "Contacted" || p.status === "Replied" || p.status === "Call Booked" || p.status === "Closed") &&
      new Date(p.createdAt) >= startOfWeek
  ).length;

  const callsThisMonth = allProspects.filter(
    (p) =>
      (p.status === "Call Booked" || p.status === "Closed") &&
      new Date(p.createdAt) >= startOfMonth
  ).length;

  const closeRate =
    allProspects.length > 0
      ? Math.round((allProspects.filter((p) => p.status === "Closed").length / allProspects.length) * 100)
      : 0;

  // ── Kanban columns ───────────────────────────────────────────

  const columnProspects = useMemo(() => {
    const map: Record<string, OutreachProspect[]> = {};
    for (const col of KANBAN_COLUMNS) {
      map[col] = activeProspects.filter((p) => p.status === col);
    }
    return map;
  }, [activeProspects]);

  // ── Handlers ─────────────────────────────────────────────────

  function openPanel(prospect: OutreachProspect) {
    setSelectedProspect(prospect);
    setPanelDraft({ ...prospect });
    setPanelDirty(false);
  }

  function closePanel() {
    setSelectedProspect(null);
    setPanelDraft(null);
    setPanelDirty(false);
  }

  function handlePanelChange<K extends keyof OutreachProspect>(field: K, value: OutreachProspect[K]) {
    if (!panelDraft) return;
    setPanelDraft({ ...panelDraft, [field]: value });
    setPanelDirty(true);
  }

  function savePanel() {
    if (panelDraft) {
      saveOutreachProspect(panelDraft);
      setSelectedProspect(panelDraft);
      setPanelDirty(false);
    }
  }

  function markNotInterested() {
    if (panelDraft) {
      const updated = { ...panelDraft, status: "Not Interested" as const };
      saveOutreachProspect(updated);
      closePanel();
    }
  }

  function deleteProspect() {
    if (panelDraft) {
      deleteOutreachProspect(panelDraft.id);
      closePanel();
    }
  }

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newForm.company.trim()) {
      setAddError("Company name is required.");
      return;
    }
    if (!newForm.trade.trim()) {
      setAddError("Trade is required.");
      return;
    }
    setAddError("");
    const prospect: OutreachProspect = {
      ...newForm,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    saveOutreachProspect(prospect);
    setShowAddModal(false);
    setNewForm({
      name: "",
      company: "",
      trade: "",
      city: "",
      phone: "",
      source: "Cold Email",
      status: "New",
      notes: "",
      nextFollowUp: "",
    });
  }

  const inputClass =
    "w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 placeholder:text-gray-600";
  const labelClass = "block text-xs text-gray-500 mb-1";

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Cold Outreach" />

      <main className="flex-1 p-6 space-y-5">
        {/* Page header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">Cold Outreach</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-gray-800 border border-gray-700 text-xs font-bold text-gray-300">
              {allProspects.length}
            </span>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] text-white text-sm font-bold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Prospect
          </button>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Prospects", value: allProspects.length },
            { label: "Contacted This Week", value: contactedThisWeek },
            { label: "Calls Booked This Month", value: callsThisMonth },
            { label: "Close Rate", value: `${closeRate}%` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Kanban board — horizontally scrollable on mobile */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-4 min-w-max">
            {KANBAN_COLUMNS.map((col) => {
              const colProspects = columnProspects[col] || [];
              return (
                <div key={col} className="w-64 flex-shrink-0 flex flex-col gap-3">
                  {/* Column header */}
                  <div className="flex items-center gap-2 px-1">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${COLUMN_COLORS[col]}`} />
                    <span className="text-xs font-bold text-gray-300 uppercase tracking-wide">{col}</span>
                    <span className="ml-auto text-xs font-bold text-gray-600 bg-gray-800 px-2 py-0.5 rounded-full">
                      {colProspects.length}
                    </span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2.5 min-h-[120px]">
                    <AnimatePresence>
                      {colProspects.map((p) => (
                        <ProspectCard key={p.id} prospect={p} onClick={() => openPanel(p)} />
                      ))}
                    </AnimatePresence>
                    {colProspects.length === 0 && (
                      <div className="border border-dashed border-gray-800 rounded-xl h-20 flex items-center justify-center">
                        <p className="text-xs text-gray-700">Empty</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* ── Side Panel (slide-over) ──────────────────────────────── */}
      <AnimatePresence>
        {panelDraft && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closePanel}
            />

            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 h-full w-full sm:w-96 bg-gray-900 border-l border-gray-800 z-50 overflow-y-auto flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-800">
                <h2 className="text-sm font-bold text-white truncate pr-4">{panelDraft.company}</h2>
                <button onClick={closePanel} className="text-gray-400 hover:text-white flex-shrink-0">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Panel fields */}
              <div className="flex-1 p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>
                      <Building2 className="w-3 h-3 inline mr-1" />
                      Company
                    </label>
                    <input
                      className={inputClass}
                      value={panelDraft.company}
                      onChange={(e) => handlePanelChange("company", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Name</label>
                    <input
                      className={inputClass}
                      value={panelDraft.name}
                      onChange={(e) => handlePanelChange("name", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Trade</label>
                    <input
                      className={inputClass}
                      value={panelDraft.trade}
                      onChange={(e) => handlePanelChange("trade", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <MapPin className="w-3 h-3 inline mr-1" />
                      City
                    </label>
                    <input
                      className={inputClass}
                      value={panelDraft.city}
                      onChange={(e) => handlePanelChange("city", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>
                      <Phone className="w-3 h-3 inline mr-1" />
                      Phone
                    </label>
                    <input
                      className={inputClass}
                      value={panelDraft.phone}
                      onChange={(e) => handlePanelChange("phone", e.target.value)}
                      placeholder="(555) 000-0000"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Source</label>
                    <select
                      className={inputClass}
                      value={panelDraft.source}
                      onChange={(e) => handlePanelChange("source", e.target.value as OutreachProspect["source"])}
                    >
                      {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={panelDraft.status}
                    onChange={(e) => handlePanelChange("status", e.target.value as OutreachProspect["status"])}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    <Calendar className="w-3 h-3 inline mr-1" />
                    Next Follow-Up
                  </label>
                  <input
                    type="date"
                    className={inputClass}
                    value={panelDraft.nextFollowUp ? panelDraft.nextFollowUp.split("T")[0] : ""}
                    onChange={(e) => handlePanelChange("nextFollowUp", e.target.value ? new Date(e.target.value).toISOString() : "")}
                  />
                </div>

                <div>
                  <label className={labelClass}>Notes</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={4}
                    value={panelDraft.notes}
                    onChange={(e) => handlePanelChange("notes", e.target.value)}
                    placeholder="Last conversation, objections, context..."
                  />
                </div>
              </div>

              {/* Panel footer */}
              <div className="p-5 border-t border-gray-800 space-y-3">
                {panelDirty && (
                  <button
                    onClick={savePanel}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors"
                  >
                    Save Changes
                  </button>
                )}
                <button
                  onClick={markNotInterested}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 text-sm font-semibold transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  Mark Not Interested
                </button>
                <button
                  onClick={deleteProspect}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Prospect
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Add Prospect Modal ───────────────────────────────────── */}
      <AnimatePresence>
        {showAddModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setShowAddModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 24 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-[480px] bg-gray-900 border border-gray-700 rounded-2xl z-50 overflow-y-auto max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-5 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[#FF6B47]" />
                  <h3 className="text-sm font-bold text-white">Add Prospect</h3>
                </div>
                <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Company *</label>
                    <input
                      className={inputClass}
                      placeholder="Miller HVAC"
                      value={newForm.company}
                      onChange={(e) => setNewForm({ ...newForm, company: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Contact Name</label>
                    <input
                      className={inputClass}
                      placeholder="Scott Miller"
                      value={newForm.name}
                      onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Trade *</label>
                    <input
                      className={inputClass}
                      placeholder="HVAC, Plumbing..."
                      value={newForm.trade}
                      onChange={(e) => setNewForm({ ...newForm, trade: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>City</label>
                    <input
                      className={inputClass}
                      placeholder="Dallas, TX"
                      value={newForm.city}
                      onChange={(e) => setNewForm({ ...newForm, city: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Phone</label>
                    <input
                      className={inputClass}
                      placeholder="(555) 000-0000"
                      value={newForm.phone}
                      onChange={(e) => setNewForm({ ...newForm, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Source</label>
                    <select
                      className={inputClass}
                      value={newForm.source}
                      onChange={(e) => setNewForm({ ...newForm, source: e.target.value as OutreachProspect["source"] })}
                    >
                      {SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Status</label>
                  <select
                    className={inputClass}
                    value={newForm.status}
                    onChange={(e) => setNewForm({ ...newForm, status: e.target.value as OutreachProspect["status"] })}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Next Follow-Up</label>
                  <input
                    type="date"
                    className={inputClass}
                    value={newForm.nextFollowUp ? newForm.nextFollowUp.split("T")[0] : ""}
                    onChange={(e) =>
                      setNewForm({ ...newForm, nextFollowUp: e.target.value ? new Date(e.target.value).toISOString() : "" })
                    }
                  />
                </div>

                <div>
                  <label className={labelClass}>Notes</label>
                  <textarea
                    className={`${inputClass} resize-none`}
                    rows={3}
                    placeholder="Context, how you found them, opening angle..."
                    value={newForm.notes}
                    onChange={(e) => setNewForm({ ...newForm, notes: e.target.value })}
                  />
                </div>

                {addError && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {addError}
                  </p>
                )}

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white text-sm font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] text-white text-sm font-bold transition-colors"
                  >
                    Add Prospect
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
