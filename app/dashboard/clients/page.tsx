"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Users, UserCheck, Loader2, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ClientCard from "@/components/dashboard/ClientCard";
import type { Client } from "@/lib/types";

const TRADES = [
  "all", "hvac", "plumbing", "electrical", "roofing", "landscaping",
  "pest_control", "cleaning", "painting", "garage_doors", "gutters",
  "windows", "restoration", "general",
] as const;

const STATUSES = ["all", "active", "onboarding", "paused", "prospect"] as const;
const PACKAGES = ["all", "foundation", "growth", "domination"] as const;

export default function ClientsPage() {
  const { store } = useStore();

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPackage, setFilterPackage] = useState<string>("all");
  const [filterTrade, setFilterTrade] = useState<string>("all");

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const leadsPerClient = useMemo(() => {
    const map: Record<string, number> = {};
    store.leads
      .filter((l) => l.createdAt >= monthStart)
      .forEach((l) => {
        map[l.clientId] = (map[l.clientId] || 0) + 1;
      });
    return map;
  }, [store.leads, monthStart]);

  const filtered = useMemo(() => {
    return store.clients.filter((c: Client) => {
      const matchSearch =
        !search ||
        c.businessName.toLowerCase().includes(search.toLowerCase()) ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.city.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || c.status === filterStatus;
      const matchPackage = filterPackage === "all" || c.package === filterPackage;
      const matchTrade = filterTrade === "all" || c.trade === filterTrade;
      return matchSearch && matchStatus && matchPackage && matchTrade;
    });
  }, [store.clients, search, filterStatus, filterPackage, filterTrade]);

  const stats = useMemo(() => {
    const total = store.clients.length;
    const active = store.clients.filter((c) => c.status === "active").length;
    const onboarding = store.clients.filter((c) => c.status === "onboarding").length;
    const avgScore = total
      ? Math.round(store.clients.reduce((s, c) => s + c.scores.overall, 0) / total)
      : 0;
    return { total, active, onboarding, avgScore };
  }, [store.clients]);

  const selectClass =
    "bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500";

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader
        title="Clients"
        onAddLead={() => (window.location.href = "/dashboard/onboarding")}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            {
              label: "Total Clients",
              value: stats.total,
              icon: Users,
              color: "text-blue-400",
              bg: "bg-blue-500/10",
            },
            {
              label: "Active",
              value: stats.active,
              icon: UserCheck,
              color: "text-emerald-400",
              bg: "bg-emerald-500/10",
            },
            {
              label: "Onboarding",
              value: stats.onboarding,
              icon: Loader2,
              color: "text-amber-400",
              bg: "bg-amber-500/10",
            },
            {
              label: "Avg Score",
              value: `${stats.avgScore}/100`,
              icon: Star,
              color: "text-purple-400",
              bg: "bg-purple-500/10",
            },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex items-center gap-3"
            >
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-4.5 h-4.5 ${s.color}`} size={18} />
              </div>
              <div>
                <p className="text-lg font-bold text-white leading-none">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[180px] bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-4 py-2 placeholder:text-gray-600 focus:outline-none focus:border-blue-500"
          />

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>

          <select value={filterPackage} onChange={(e) => setFilterPackage(e.target.value)} className={selectClass}>
            {PACKAGES.map((p) => (
              <option key={p} value={p}>
                {p === "all" ? "All Packages" : p.charAt(0).toUpperCase() + p.slice(1)}
              </option>
            ))}
          </select>

          <select value={filterTrade} onChange={(e) => setFilterTrade(e.target.value)} className={selectClass}>
            {TRADES.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All Trades" : t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </select>

          <Link
            href="/dashboard/onboarding"
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Client
          </Link>
        </div>

        {/* Client grid */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center"
          >
            <Users className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-400 text-sm font-medium">
              {store.clients.length === 0 ? "No clients yet" : "No clients match your filters"}
            </p>
            <p className="text-gray-600 text-xs mt-1 mb-4">
              {store.clients.length === 0
                ? "Get started by onboarding your first client."
                : "Try adjusting the filters above."}
            </p>
            {store.clients.length === 0 && (
              <Link
                href="/dashboard/onboarding"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Onboard First Client
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((client, i) => (
              <ClientCard
                key={client.id}
                client={client}
                leadsThisMonth={leadsPerClient[client.id] || 0}
                index={i}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
