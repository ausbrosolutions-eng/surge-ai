"use client";
import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users, Target, Star, CheckSquare, AlertTriangle,
  MapPin, MessageSquare, ArrowRight, Clock,
} from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import ClientCard from "@/components/dashboard/ClientCard";
import TaskRow from "@/components/dashboard/TaskRow";

export default function DashboardPage() {
  const { store, saveTask, exportData } = useStore();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const leadsThisMonth = store.leads.filter((l) => l.createdAt >= monthStart).length;
  const activeClients = store.clients.filter((c) => c.status === "active" || c.status === "onboarding");
  const tasksDueToday = store.tasks.filter(
    (t) =>
      t.status !== "done" &&
      t.dueDate <= now.toISOString().split("T")[0]
  );

  const avgScore = useMemo(() => {
    if (!store.clients.length) return 0;
    return Math.round(
      store.clients.reduce((s, c) => s + c.scores.overall, 0) / store.clients.length
    );
  }, [store.clients]);

  // Today's priorities
  const priorities = useMemo(() => {
    const items: { icon: string; message: string; href: string; urgent: boolean }[] = [];

    // Unresponded negative reviews
    store.reviews
      .filter((r) => !r.responded && r.sentiment === "negative")
      .forEach((r) => {
        const client = store.clients.find((c) => c.id === r.clientId);
        if (client) {
          items.push({
            icon: "⭐",
            message: `Negative review from ${r.reviewerName} needs response for ${client.businessName}`,
            href: `/dashboard/clients/${client.id}/reputation`,
            urgent: true,
          });
        }
      });

    // Leads in "new" for 24+ hours
    const overdueLeads = store.leads.filter((l) => {
      if (l.status !== "new") return false;
      const hours = (Date.now() - new Date(l.createdAt).getTime()) / 3600000;
      return hours > 24;
    });
    if (overdueLeads.length > 0) {
      items.push({
        icon: "🎯",
        message: `${overdueLeads.length} lead${overdueLeads.length > 1 ? "s" : ""} in "new" status for 24+ hours`,
        href: "/dashboard/leads",
        urgent: true,
      });
    }

    // GBP posts overdue
    store.clients
      .filter((c) => c.status === "active" || c.status === "onboarding")
      .forEach((client) => {
        const clientPosts = store.gbpPosts
          .filter((p) => p.clientId === client.id)
          .sort((a, b) => b.date.localeCompare(a.date));
        const lastPost = clientPosts[0];
        if (!lastPost) {
          items.push({
            icon: "📍",
            message: `${client.businessName} has no GBP posts — post now to avoid ranking drop`,
            href: `/dashboard/clients/${client.id}/gbp`,
            urgent: false,
          });
        } else {
          const daysSince = Math.floor(
            (Date.now() - new Date(lastPost.date).getTime()) / 86400000
          );
          if (daysSince >= 7) {
            items.push({
              icon: "📍",
              message: `${client.businessName} GBP — ${daysSince} days since last post (ranking drop risk!)`,
              href: `/dashboard/clients/${client.id}/gbp`,
              urgent: daysSince >= 14,
            });
          }
        }
      });

    // Urgent overdue tasks
    tasksDueToday.slice(0, 2).forEach((task) => {
      const client = store.clients.find((c) => c.id === task.clientId);
      items.push({
        icon: "✅",
        message: `Overdue task: "${task.title}"${client ? ` for ${client.businessName}` : ""}`,
        href: "/dashboard/tasks",
        urgent: task.priority === "urgent",
      });
    });

    return items.slice(0, 8);
  }, [store, tasksDueToday]);

  const leadsPerClient = useMemo(() => {
    const map: Record<string, number> = {};
    store.leads
      .filter((l) => l.createdAt >= monthStart)
      .forEach((l) => {
        map[l.clientId] = (map[l.clientId] || 0) + 1;
      });
    return map;
  }, [store.leads, monthStart]);

  const activeTasks = store.tasks.filter((t) => t.status !== "done");

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader
        title="Agency Overview"
        onAddLead={() => (window.location.href = "/dashboard/leads")}
        onAddTask={() => (window.location.href = "/dashboard/tasks")}
        onExport={exportData}
      />

      <main className="flex-1 p-6 space-y-6">
        {/* Metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Clients"
            value={activeClients.length}
            subtitle={`${store.clients.length} total`}
            icon={Users}
            iconColor="text-blue-400"
          />
          <MetricCard
            title="Leads This Month"
            value={leadsThisMonth}
            subtitle={`${store.leads.filter((l) => l.status === "new").length} need follow-up`}
            icon={Target}
            iconColor="text-purple-400"
          />
          <MetricCard
            title="Avg Client Score"
            value={`${avgScore}/100`}
            subtitle="Weighted optimization score"
            icon={Star}
            iconColor="text-amber-400"
          />
          <MetricCard
            title="Tasks Due Today"
            value={tasksDueToday.length}
            subtitle={tasksDueToday.filter((t) => t.priority === "urgent").length + " urgent"}
            icon={CheckSquare}
            iconColor={tasksDueToday.length > 0 ? "text-red-400" : "text-emerald-400"}
          />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Client Health Board */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white">Client Health</h2>
              <Link href="/dashboard/clients" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All clients <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {store.clients.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
                <p className="text-gray-400 text-sm">No clients yet.</p>
                <Link href="/dashboard/onboarding" className="mt-3 inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors">
                  Onboard First Client
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {store.clients.map((client, i) => (
                  <ClientCard
                    key={client.id}
                    client={client}
                    leadsThisMonth={leadsPerClient[client.id] || 0}
                    index={i}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Task Board */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-white">Active Tasks</h2>
              <Link href="/dashboard/tasks" className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1">
                All tasks <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            {activeTasks.length === 0 ? (
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-8 text-center">
                <p className="text-gray-400 text-sm">All tasks complete! 🎉</p>
              </div>
            ) : (
              <div className="space-y-2">
                {activeTasks
                  .sort((a, b) => {
                    const pri = { urgent: 0, high: 1, medium: 2, low: 3 };
                    return (pri[a.priority] ?? 3) - (pri[b.priority] ?? 3);
                  })
                  .slice(0, 8)
                  .map((task) => {
                    const client = store.clients.find((c) => c.id === task.clientId);
                    return (
                      <TaskRow
                        key={task.id}
                        task={task}
                        clientName={client?.businessName}
                        onStatusChange={(t, status) =>
                          saveTask({ ...t, status, completedAt: status === "done" ? new Date().toISOString() : undefined })
                        }
                      />
                    );
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Today's Priorities */}
        {priorities.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-white mb-3">
              Today&apos;s Priorities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {priorities.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors hover:border-gray-600 ${
                      item.urgent
                        ? "bg-red-500/5 border-red-500/30"
                        : "bg-gray-800 border-gray-700"
                    }`}
                  >
                    <span className="text-lg leading-none">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 leading-snug">
                        {item.message}
                      </p>
                    </div>
                    {item.urgent && (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-gray-600 flex-shrink-0 mt-0.5" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
