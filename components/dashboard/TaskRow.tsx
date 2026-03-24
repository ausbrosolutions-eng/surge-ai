"use client";
import { CheckSquare, Square, Clock, Trash2 } from "lucide-react";
import { AgencyTask } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  gbp: "text-blue-400 bg-blue-500/10",
  lsa: "text-emerald-400 bg-emerald-500/10",
  seo: "text-purple-400 bg-purple-500/10",
  ads: "text-amber-400 bg-amber-500/10",
  content: "text-pink-400 bg-pink-500/10",
  reputation: "text-orange-400 bg-orange-500/10",
  reporting: "text-cyan-400 bg-cyan-500/10",
  admin: "text-gray-400 bg-gray-500/10",
};

interface Props {
  task: AgencyTask;
  clientName?: string;
  onStatusChange: (task: AgencyTask, status: AgencyTask["status"]) => void;
  onDelete?: (id: string) => void;
}

function isOverdue(dueDate: string) {
  return new Date(dueDate) < new Date(new Date().toDateString());
}

export default function TaskRow({ task, clientName, onStatusChange, onDelete }: Props) {
  const overdue = task.status !== "done" && isOverdue(task.dueDate);
  const nextStatus =
    task.status === "todo"
      ? "in_progress"
      : task.status === "in_progress"
      ? "done"
      : "todo";

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-3 rounded-lg border transition-colors",
        task.status === "done"
          ? "bg-gray-800/40 border-gray-700/50 opacity-60"
          : "bg-gray-800 border-gray-700 hover:border-gray-600"
      )}
    >
      <button
        onClick={() => onStatusChange(task, nextStatus)}
        className="flex-shrink-0 mt-0.5 text-gray-500 hover:text-blue-400 transition-colors"
      >
        {task.status === "done" ? (
          <CheckSquare className="w-4 h-4 text-emerald-400" />
        ) : (
          <Square className="w-4 h-4" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start flex-wrap gap-1.5">
          <p
            className={cn(
              "text-sm leading-snug",
              task.status === "done"
                ? "line-through text-gray-500"
                : "text-gray-200 font-medium"
            )}
          >
            {task.title}
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          {clientName && (
            <span className="text-xs text-gray-500">{clientName}</span>
          )}
          <span
            className={cn(
              "text-xs px-1.5 py-0.5 rounded font-medium",
              categoryColors[task.category] || "text-gray-400 bg-gray-500/10"
            )}
          >
            {task.category.toUpperCase()}
          </span>
          <StatusBadge variant={task.priority} size="sm" />
          <StatusBadge variant={task.status} size="sm" />
          <div className={cn("flex items-center gap-1 text-xs", overdue ? "text-red-400" : "text-gray-500")}>
            <Clock className="w-3 h-3" />
            {overdue ? "Overdue · " : ""}
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </div>
        </div>

        {task.description && (
          <p className="text-xs text-gray-500 mt-1 leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {onDelete && (
        <button
          onClick={() => onDelete(task.id)}
          className="flex-shrink-0 text-gray-600 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
