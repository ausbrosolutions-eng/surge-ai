"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Filter } from "lucide-react";
import { useStore } from "@/lib/store";
import { AgencyTask } from "@/lib/types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TaskRow from "@/components/dashboard/TaskRow";

const priorities = ["urgent", "high", "medium", "low"] as const;
const priorityConfig = {
  urgent: { label: "🔴 Urgent", desc: "Due today or overdue" },
  high: { label: "🟠 High", desc: "Due this week" },
  medium: { label: "🟡 Medium", desc: "Due this month" },
  low: { label: "🟢 Low", desc: "Backlog" },
};

export default function TasksPage() {
  const { store, saveTask, deleteTask } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [filterClient, setFilterClient] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState({
    title: "", description: "", clientId: "",
    category: "gbp" as AgencyTask["category"],
    priority: "medium" as AgencyTask["priority"],
    dueDate: new Date().toISOString().split("T")[0],
    assignedTo: "Austin",
  });

  const activeTasks = useMemo(() =>
    store.tasks
      .filter((t) => t.status !== "done")
      .filter((t) => filterClient === "all" || t.clientId === filterClient)
      .filter((t) => filterCategory === "all" || t.category === filterCategory),
    [store.tasks, filterClient, filterCategory]
  );

  const grouped = useMemo(() =>
    priorities.reduce((acc, p) => {
      acc[p] = activeTasks.filter((t) => t.priority === p);
      return acc;
    }, {} as Record<string, AgencyTask[]>),
    [activeTasks]
  );

  const doneTasks = store.tasks.filter((t) => t.status === "done").slice(0, 10);

  const handleAdd = () => {
    const task: AgencyTask = {
      id: `task-${Date.now()}`,
      title: form.title,
      description: form.description,
      clientId: form.clientId || undefined,
      category: form.category,
      priority: form.priority,
      status: "todo",
      dueDate: form.dueDate,
      assignedTo: form.assignedTo,
      createdAt: new Date().toISOString(),
    };
    saveTask(task);
    setShowAdd(false);
    setForm({ title: "", description: "", clientId: "", category: "gbp", priority: "medium", dueDate: new Date().toISOString().split("T")[0], assignedTo: "Austin" });
  };

  const handleStatus = (task: AgencyTask, status: AgencyTask["status"]) => {
    saveTask({ ...task, status, completedAt: status === "done" ? new Date().toISOString() : undefined });
  };

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Task Manager" onAddTask={() => setShowAdd(true)} />
      <main className="flex-1 p-6 space-y-6 overflow-auto">

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <Filter className="w-4 h-4 text-gray-500" />
          <select value={filterClient} onChange={(e) => setFilterClient(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500">
            <option value="all">All Clients</option>
            {store.clients.map((c) => <option key={c.id} value={c.id}>{c.businessName}</option>)}
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-300 focus:outline-none focus:border-blue-500">
            <option value="all">All Categories</option>
            {["gbp","lsa","seo","ads","content","reputation","reporting","admin"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
          <span className="text-sm text-gray-500">{activeTasks.length} active tasks</span>
        </div>

        {/* Priority groups */}
        {priorities.map((p) => {
          const tasks = grouped[p] || [];
          if (tasks.length === 0) return null;
          return (
            <motion.div
              key={p}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-sm font-semibold text-white">{priorityConfig[p].label}</h2>
                <span className="text-xs text-gray-500">— {priorityConfig[p].desc}</span>
                <span className="text-xs bg-gray-800 text-gray-400 rounded-full px-2 py-0.5 ml-auto">{tasks.length}</span>
              </div>
              <div className="space-y-2">
                {tasks.map((task) => {
                  const client = store.clients.find((c) => c.id === task.clientId);
                  return (
                    <TaskRow
                      key={task.id}
                      task={task}
                      clientName={client?.businessName}
                      onStatusChange={handleStatus}
                      onDelete={deleteTask}
                    />
                  );
                })}
              </div>
            </motion.div>
          );
        })}

        {activeTasks.length === 0 && (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🎉</p>
            <p className="text-white font-semibold">All caught up!</p>
            <p className="text-gray-400 text-sm mt-1">No active tasks. Add a new task to get started.</p>
            <button onClick={() => setShowAdd(true)} className="mt-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Add Task
            </button>
          </div>
        )}

        {/* Completed */}
        {doneTasks.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-500 mb-2">Recently Completed ({doneTasks.length})</h2>
            <div className="space-y-2 opacity-60">
              {doneTasks.map((task) => {
                const client = store.clients.find((c) => c.id === task.clientId);
                return (
                  <TaskRow key={task.id} task={task} clientName={client?.businessName} onStatusChange={handleStatus} onDelete={deleteTask} />
                );
              })}
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        <AnimatePresence>
          {showAdd && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={(e) => e.target === e.currentTarget && setShowAdd(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-base font-bold text-white">Add Task</h3>
                  <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-gray-300"><X className="w-4 h-4" /></button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Title *</label>
                    <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" placeholder="Task title..." />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Description</label>
                    <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white resize-none focus:outline-none focus:border-blue-500" placeholder="What needs to be done and why..." />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Client</label>
                      <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        <option value="">Agency-wide</option>
                        {store.clients.map((c) => <option key={c.id} value={c.id}>{c.businessName}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Category</label>
                      <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as AgencyTask["category"] })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        {["gbp","lsa","seo","ads","content","reputation","reporting","admin"].map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Priority</label>
                      <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as AgencyTask["priority"] })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500">
                        <option value="urgent">🔴 Urgent</option>
                        <option value="high">🟠 High</option>
                        <option value="medium">🟡 Medium</option>
                        <option value="low">🟢 Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Due Date</label>
                      <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500" />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={handleAdd} disabled={!form.title} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium py-2.5 rounded-lg transition-colors">Add Task</button>
                    <button onClick={() => setShowAdd(false)} className="flex-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium py-2.5 rounded-lg transition-colors">Cancel</button>
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
