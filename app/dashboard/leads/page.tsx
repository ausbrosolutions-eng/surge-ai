"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Filter, AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";
import { Lead, BANTScore } from "@/lib/types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import LeadCard from "@/components/dashboard/LeadCard";
import StatusBadge from "@/components/dashboard/StatusBadge";

const STAGES: Lead["status"][] = ["new", "contacted", "qualified", "booked", "completed"];
const stageLabels: Record<string, string> = {
  new: "New", contacted: "Contacted", qualified: "Qualified",
  booked: "Booked", completed: "Completed",
};

function bantLabel(total: number) {
  if (total >= 7) return { label: "🔥 Hot — Close Today", color: "text-emerald-400" };
  if (total >= 5) return { label: "🌡️ Warm — Qualify Further", color: "text-amber-400" };
  if (total >= 3) return { label: "❄️ Cool — Nurture", color: "text-orange-400" };
  return { label: "🧊 Cold — Consider Disqualifying", color: "text-red-400" };
}

const emptyBant: BANTScore = { budget: 0, authority: 0, need: 0, timeline: 0, total: 0 };

export default function LeadsPage() {
  const { store, saveLead, deleteLead } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [filterClient, setFilterClient] = useState("all");
  const [form, setForm] = useState({
    name: "", phone: "", email: "", clientId: "", source: "organic" as Lead["source"],
    serviceRequested: "", zipCode: "", urgency: "planned" as Lead["urgency"],
    estimatedValue: 0, notes: "",
    budget: 0 as 0 | 1 | 2, authority: 0 as 0 | 1 | 2,
    need: 0 as 0 | 1 | 2, timeline: 0 as 0 | 1 | 2,
  });

  const filteredLeads = useMemo(() =>
    store.leads.filter((l) => filterClient === "all" || l.clientId === filterClient),
    [store.leads, filterClient]
  );

  const byStage = useMemo(() =>
    STAGES.reduce((acc, stage) => {
      acc[stage] = filteredLeads.filter((l) => l.status === stage);
      return acc;
    }, {} as Record<string, Lead[]>),
    [filteredLeads]
  );

  const handleMoveLead = (lead: Lead, status: Lead["status"]) => {
    saveLead({ ...lead, status, updatedAt: new Date().toISOString() });
  };

  const handleAdd = () => {
    const bantTotal = form.budget + form.authority + form.need + form.timeline;
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      clientId: form.clientId || store.clients[0]?.id || "",
      name: form.name,
      phone: form.phone,
      email: form.email || undefined,
      source: form.source,
      serviceRequested: form.serviceRequested,
      zipCode: form.zipCode,
      status: "new",
      urgency: form.urgency,
      estimatedValue: form.estimatedValue,
      bantScore: { budget: form.budget, authority: form.authority, need: form.need, timeline: form.timeline, total: bantTotal },
      notes: form.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveLead(lead);
    setShowAdd(false);
    setForm({ name: "", phone: "", email: "", clientId: "", source: "organic", serviceRequested: "", zipCode: "", urgency: "planned", estimatedValue: 0, notes: "", budget: 0, authority: 0, need: 0, timeline: 0 });
  };

  const bantSummary = useMemo(() => {
    const counts = { hot: 0, warm: 0, cool: 0, cold: 0 };
    filteredLeads.forEach((l) => {
      const t = l.bantScore.total;
      if (t >= 7) counts.hot++;
      else if (t >= 5) counts.warm++;
      else if (t >= 3) counts.cool++;
      else counts.cold++;
    });
    return counts;
  }, [filteredLeads]);

  const lostLeads = filteredLeads.filter((l) => l.status === "lost");

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Lead Pipeline" onAddLead={() => setShowAdd(true)} />
      <main className="flex-1 p-6 space-y-6 overflow-auto">

        {/* Stage counts */}
        <div className="flex items-center gap-3 flex-wrap">
          {STAGES.map((stage) => (
            <div key={stage} className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
              <StatusBadge variant={stage} size="sm" />
              <span className="text-sm font-bold text-white">{byStage[stage]?.length ?? 0}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2">
            <StatusBadge variant="lost" size="sm" />
            <span className="text-sm font-bold text-white">{lostLeads.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterClient}
            onChange={(e) => setFilterClient(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
          >
            <option value="all">All Clients</option>
            {store.clients.map((c) => (
              <option key={c.id} value={c.id}>{c.businessName}</option>
            ))}
          </select>
        </div>

        {/* Kanban */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 min-h-64">
          {STAGES.map((stage) => (
            <div key={stage} className="bg-gray-900 rounded-xl p-3 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{stageLabels[stage]}</p>
                <span className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5">{byStage[stage]?.length ?? 0}</span>
              </div>
              <div className="space-y-2">
                {(byStage[stage] || []).map((lead) => {
                  const client = store.clients.find((c) => c.id === lead.clientId);
                  return (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      clientName={client?.businessName}
                      onMove={handleMoveLead}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* BANT Summary */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">BANT Lead Quality Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: "🔥 Hot (7-8)", count: bantSummary.hot, color: "text-emerald-400", action: "Close Today" },
              { label: "🌡️ Warm (5-6)", count: bantSummary.warm, color: "text-amber-400", action: "Qualify Further" },
              { label: "❄️ Cool (3-4)", count: bantSummary.cool, color: "text-orange-400", action: "Nurture" },
              { label: "🧊 Cold (0-2)", count: bantSummary.cold, color: "text-red-400", action: "Consider Disqualifying" },
            ].map((item) => (
              <div key={item.label} className="bg-gray-900 rounded-lg p-3 text-center">
                <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
                <p className="text-xs text-gray-400 mt-1">{item.label}</p>
                <p className="text-xs text-gray-600 mt-0.5">{item.action}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-700 pt-4">
            <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> Disqualification Signals — Watch for These Red Flags
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
              {[
                "Cannot articulate specific pain points",
                "Outside your service area",
                "Consistently ignores follow-ups (2+ attempts, no response)",
                "No decision-making authority — can't reach the actual buyer",
                "Budget clearly mismatched to actual service cost",
              ].map((signal, i) => (
                <p key={i} className="text-xs text-gray-400 flex items-center gap-2">
                  <span className="text-amber-400">⚠️</span> {signal}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Add Lead Modal */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-white">Add New Lead</h3>
                  <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-300">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Lead Name *</label>
                      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Jane Smith" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Phone *</label>
                      <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="(303) 555-1234" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Email</label>
                      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="email@example.com" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Zip Code</label>
                      <input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="80202" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Client</label>
                    <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                      <option value="">Select client...</option>
                      {store.clients.map((c) => <option key={c.id} value={c.id}>{c.businessName}</option>)}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Lead Source</label>
                      <select value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value as Lead["source"] })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        {["lsa","google_ads","organic","gbp","referral","social","nextdoor","yelp","direct"].map(s => <option key={s} value={s}>{s.replace("_"," ").toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Urgency</label>
                      <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value as Lead["urgency"] })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        <option value="emergency">🚨 Emergency</option>
                        <option value="planned">Planned</option>
                        <option value="maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Service Requested</label>
                    <input value={form.serviceRequested} onChange={(e) => setForm({ ...form, serviceRequested: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Water damage restoration — basement flooding" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Estimated Job Value ($)</label>
                    <input type="number" value={form.estimatedValue || ""} onChange={(e) => setForm({ ...form, estimatedValue: parseInt(e.target.value) || 0 })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="5000" />
                  </div>

                  {/* BANT Scoring */}
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                    <p className="text-xs font-semibold text-gray-300 mb-3">BANT Quick Score (Total: {form.budget + form.authority + form.need + form.timeline}/8)</p>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        { key: "budget", label: "Budget", opts: ["Unknown", "Tight/Limited", "Confirmed Budget"] },
                        { key: "authority", label: "Authority", opts: ["Unknown", "Influencer Only", "Decision Maker"] },
                        { key: "need", label: "Need", opts: ["Unclear", "General Interest", "Specific Pain Point"] },
                        { key: "timeline", label: "Timeline", opts: ["Unknown", "Flexible", "Urgent/Emergency"] },
                      ] as const).map(({ key, label, opts }) => (
                        <div key={key}>
                          <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                          <select value={form[key]} onChange={(e) => setForm({ ...form, [key]: parseInt(e.target.value) as 0|1|2 })} className="w-full bg-gray-900 border border-gray-600 rounded px-2 py-1.5 text-xs text-white focus:outline-none focus:border-blue-500">
                            {opts.map((o, i) => <option key={i} value={i}>{o}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                    <div className={`mt-2 text-xs font-medium ${bantLabel(form.budget + form.authority + form.need + form.timeline).color}`}>
                      {bantLabel(form.budget + form.authority + form.need + form.timeline).label}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Notes</label>
                    <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" placeholder="Initial conversation notes, next steps..." />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleAdd} disabled={!form.name || !form.phone} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors">
                      Add Lead
                    </button>
                    <button onClick={() => setShowAdd(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium py-2.5 rounded-lg transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
