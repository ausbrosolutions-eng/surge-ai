"use client";
import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MapPin, Phone, Mail, Globe, DollarSign, Calendar,
  Edit3, Save, X, ArrowRight, FileText,
  BarChart2, Search, Bot, Star, Megaphone, Share2, ShieldCheck, Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressRing from "@/components/dashboard/ProgressRing";
import LeadCard from "@/components/dashboard/LeadCard";
import TaskRow from "@/components/dashboard/TaskRow";
import StatusBadge from "@/components/dashboard/StatusBadge";
import type { Client } from "@/lib/types";

const MODULE_CONFIG = [
  { key: "gbp", label: "GBP", href: "gbp", icon: MapPin, color: "text-amber-400", bg: "bg-amber-500/10", desc: "Google Business Profile" },
  { key: "lsa", label: "LSA", href: "lsa", icon: ShieldCheck, color: "text-emerald-400", bg: "bg-emerald-500/10", desc: "Local Service Ads" },
  { key: "seo", label: "SEO", href: "seo", icon: Search, color: "text-blue-400", bg: "bg-blue-500/10", desc: "Local SEO" },
  { key: "aiSearch", label: "AI Search", href: "ai-search", icon: Bot, color: "text-purple-400", bg: "bg-purple-500/10", desc: "AI Search Optimization" },
  { key: "reputation", label: "Reputation", href: "reputation", icon: Star, color: "text-pink-400", bg: "bg-pink-500/10", desc: "Review Management" },
  { key: "ads", label: "Ads", href: "ads", icon: Megaphone, color: "text-cyan-400", bg: "bg-cyan-500/10", desc: "Google Ads / PPC" },
  { key: "social", label: "Social", href: "social", icon: Share2, color: "text-indigo-400", bg: "bg-indigo-500/10", desc: "Social Media" },
  { key: "reports", label: "Reports", href: "reports", icon: BarChart2, color: "text-gray-400", bg: "bg-gray-500/10", desc: "Monthly Reporting" },
  { key: "content", label: "AI Content", href: "content", icon: Sparkles, color: "text-rose-400", bg: "bg-rose-500/10", desc: "Content Generator" },
] as const;

const PACKAGES: Client["package"][] = ["foundation", "growth", "domination"];
const STATUSES: Client["status"][] = ["active", "onboarding", "paused", "prospect"];
const TRADES: Client["trade"][] = [
  "hvac", "plumbing", "electrical", "roofing", "landscaping",
  "pest_control", "cleaning", "painting", "garage_doors", "gutters",
  "windows", "restoration", "general",
];

export default function ClientOverviewPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { store, saveClient, saveLead, saveTask } = useStore();

  const client = store.clients.find((c) => c.id === clientId);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Client | null>(null);
  const [notes, setNotes] = useState(client?.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);

  const clientLeads = useMemo(
    () => store.leads.filter((l) => l.clientId === clientId).slice(-5).reverse(),
    [store.leads, clientId]
  );
  const clientTasks = useMemo(
    () => store.tasks.filter((t) => t.clientId === clientId && t.status !== "done").slice(0, 5),
    [store.tasks, clientId]
  );
  const clientReviews = useMemo(
    () => store.reviews.filter((r) => r.clientId === clientId).slice(-3).reverse(),
    [store.reviews, clientId]
  );

  if (!client) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Client not found.</p>
          <Link href="/dashboard/clients" className="mt-3 text-blue-400 text-xs hover:underline">
            Back to Clients
          </Link>
        </div>
      </div>
    );
  }

  function startEdit() {
    setDraft({ ...client! });
    setEditing(true);
  }

  function cancelEdit() {
    setDraft(null);
    setEditing(false);
  }

  function saveEdit() {
    if (draft) {
      saveClient({ ...draft, updatedAt: new Date().toISOString() });
      setEditing(false);
      setDraft(null);
    }
  }

  function handleNotesBlur() {
    if (notes !== client!.notes) {
      setSavingNotes(true);
      saveClient({ ...client!, notes, updatedAt: new Date().toISOString() });
      setTimeout(() => setSavingNotes(false), 800);
    }
  }

  const inputClass =
    "w-full bg-gray-900 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500";
  const labelClass = "block text-xs text-gray-500 mb-1";

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title={client.businessName} selectedClient={client} />

      <main className="flex-1 p-6 space-y-6">
        {/* Score cards row */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex flex-wrap items-center gap-6">
            {/* Overall score */}
            <div className="flex flex-col items-center gap-2">
              <ProgressRing score={client.scores.overall} size={100} strokeWidth={8} label="Overall" />
              <p className="text-xs text-gray-500 font-medium">Overall Score</p>
            </div>

            <div className="flex-1 grid grid-cols-3 sm:grid-cols-6 gap-4">
              {MODULE_CONFIG.filter((m) => m.key !== "reports" && m.key !== "social").map((mod) => (
                <Link key={mod.key} href={`/dashboard/clients/${clientId}/${mod.href}`}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <ProgressRing
                      score={(client.scores as unknown as Record<string, number>)[mod.key] ?? 0}
                      size={56}
                      strokeWidth={5}
                      label={mod.label}
                    />
                    <p className="text-xs text-gray-600 group-hover:text-gray-400 transition-colors">
                      {mod.label}
                    </p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Client info + edit */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Client Information</h2>
            {!editing ? (
              <button
                onClick={startEdit}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={saveEdit}
                  className="flex items-center gap-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!editing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3">
              {[
                { icon: Globe, label: "Business Name", value: client.businessName },
                { icon: MapPin, label: "Owner", value: client.name },
                { icon: Phone, label: "Phone", value: client.phone },
                { icon: Mail, label: "Email", value: client.email },
                { icon: Globe, label: "Website", value: client.website },
                { icon: Calendar, label: "Start Date", value: new Date(client.startDate).toLocaleDateString() },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-2">
                  <Icon className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{label}</p>
                    <p className="text-sm text-gray-200 truncate">{value || "—"}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-start gap-2">
                <DollarSign className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Monthly Retainer</p>
                  <p className="text-sm text-gray-200">${client.monthlyRetainer.toLocaleString()}/mo</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Ad Spend</p>
                  <p className="text-sm text-gray-200">${client.adSpend.toLocaleString()}/mo</p>
                </div>
              </div>
              <div className="flex items-start gap-2 sm:col-span-2 lg:col-span-1">
                <MapPin className="w-3.5 h-3.5 text-gray-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Package</p>
                  <StatusBadge variant={client.package} />
                </div>
              </div>

              {/* Service area tags */}
              <div className="sm:col-span-2 lg:col-span-3">
                <p className="text-xs text-gray-500 mb-1.5">Service Area</p>
                <div className="flex flex-wrap gap-1.5">
                  {client.serviceArea.map((area) => (
                    <span
                      key={area}
                      className="bg-gray-800 border border-gray-700 text-gray-400 text-xs px-2 py-0.5 rounded-full"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : draft ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Business Name</label>
                <input className={inputClass} value={draft.businessName} onChange={(e) => setDraft({ ...draft, businessName: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Owner Name</label>
                <input className={inputClass} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Phone</label>
                <input className={inputClass} value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Website</label>
                <input className={inputClass} value={draft.website} onChange={(e) => setDraft({ ...draft, website: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Monthly Retainer ($)</label>
                <input type="number" className={inputClass} value={draft.monthlyRetainer} onChange={(e) => setDraft({ ...draft, monthlyRetainer: Number(e.target.value) })} />
              </div>
              <div>
                <label className={labelClass}>Ad Spend ($)</label>
                <input type="number" className={inputClass} value={draft.adSpend} onChange={(e) => setDraft({ ...draft, adSpend: Number(e.target.value) })} />
              </div>
              <div>
                <label className={labelClass}>Package</label>
                <select className={inputClass} value={draft.package} onChange={(e) => setDraft({ ...draft, package: e.target.value as Client["package"] })}>
                  {PACKAGES.map((p) => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Status</label>
                <select className={inputClass} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Client["status"] })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Trade</label>
                <select className={inputClass} value={draft.trade} onChange={(e) => setDraft({ ...draft, trade: e.target.value as Client["trade"] })}>
                  {TRADES.map((t) => <option key={t} value={t}>{t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>GBP URL</label>
                <input className={inputClass} value={draft.gbpUrl} onChange={(e) => setDraft({ ...draft, gbpUrl: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Google Ads ID</label>
                <input className={inputClass} value={draft.googleAdsId} onChange={(e) => setDraft({ ...draft, googleAdsId: e.target.value })} />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className={labelClass}>Service Area (comma-separated)</label>
                <input
                  className={inputClass}
                  value={draft.serviceArea.join(", ")}
                  onChange={(e) =>
                    setDraft({ ...draft, serviceArea: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                  }
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Module quick links */}
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Optimization Modules</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {MODULE_CONFIG.map((mod, i) => (
              <motion.div
                key={mod.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link
                  href={`/dashboard/clients/${clientId}/${mod.href}`}
                  className="flex flex-col gap-2 bg-gray-900 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg ${mod.bg} flex items-center justify-center`}>
                    <mod.icon className={`w-4 h-4 ${mod.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {mod.label}
                    </p>
                    <p className="text-xs text-gray-600">{mod.desc}</p>
                  </div>
                  {mod.key !== "reports" && mod.key !== "social" && (
                    <p className="text-xs font-bold" style={{
                      color: (client.scores as unknown as Record<string, number>)[mod.key] >= 80
                        ? "#10b981"
                        : (client.scores as unknown as Record<string, number>)[mod.key] >= 60
                        ? "#f59e0b"
                        : "#ef4444"
                    }}>
                      {(client.scores as unknown as Record<string, number>)[mod.key] ?? 0}/100
                    </p>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-gray-700 group-hover:text-blue-400 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Recent Leads */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Recent Leads</h3>
              <Link href={`/dashboard/leads?client=${clientId}`} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {clientLeads.length === 0 ? (
              <p className="text-xs text-gray-600 py-4 text-center">No leads yet</p>
            ) : (
              <div className="space-y-2">
                {clientLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    compact
                    onMove={(l, status) => saveLead({ ...l, status })}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Tasks */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Open Tasks</h3>
              <Link href={`/dashboard/tasks?client=${clientId}`} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {clientTasks.length === 0 ? (
              <p className="text-xs text-gray-600 py-4 text-center">No open tasks</p>
            ) : (
              <div className="space-y-2">
                {clientTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onStatusChange={(t, status) =>
                      saveTask({ ...t, status, completedAt: status === "done" ? new Date().toISOString() : undefined })
                    }
                  />
                ))}
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Recent Reviews</h3>
              <Link href={`/dashboard/clients/${clientId}/reputation`} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {clientReviews.length === 0 ? (
              <p className="text-xs text-gray-600 py-4 text-center">No reviews logged</p>
            ) : (
              <div className="space-y-3">
                {clientReviews.map((review) => (
                  <div key={review.id} className="border border-gray-800 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-semibold text-gray-200">{review.reviewerName}</p>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, j) => (
                          <Star
                            key={j}
                            className={`w-3 h-3 ${j < review.rating ? "text-amber-400 fill-amber-400" : "text-gray-700"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{review.reviewText}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <StatusBadge variant={review.platform} size="sm" label={review.platform.charAt(0).toUpperCase() + review.platform.slice(1)} />
                      {!review.responded && (
                        <span className="text-xs text-red-400">Needs response</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-gray-500" />
              <h3 className="text-sm font-semibold text-white">Client Notes</h3>
            </div>
            {savingNotes && <p className="text-xs text-emerald-400">Saved</p>}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            placeholder="Add internal notes about this client..."
            rows={5}
            className="w-full bg-gray-950 border border-gray-800 text-gray-300 text-sm rounded-lg p-3 resize-none focus:outline-none focus:border-blue-500 placeholder:text-gray-700"
          />
        </div>
      </main>
    </div>
  );
}
