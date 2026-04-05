"use client";
import { Plus, Download, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Client } from "@/lib/types";
import StatusBadge from "./StatusBadge";

interface Props {
  title: string;
  selectedClient?: Client;
  onAddLead?: () => void;
  onAddTask?: () => void;
  onExport?: () => void;
  clientViewHref?: string;
}

export default function DashboardHeader({
  title,
  selectedClient,
  onAddLead,
  onAddTask,
  onExport,
  clientViewHref,
}: Props) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between xl:pl-6 pl-16">
      <div>
        <h1 className="text-lg font-bold text-white">{title}</h1>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-gray-500">{today}</p>
          {selectedClient && (
            <>
              <span className="text-gray-700">·</span>
              <span className="text-xs text-gray-400">{selectedClient.businessName}</span>
              <StatusBadge variant={selectedClient.status} size="sm" />
            </>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {clientViewHref && (
          <Link
            href={clientViewHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 border border-[#00D4C8]/30 hover:border-[#00D4C8]/60 text-[#00D4C8] text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Client View
          </Link>
        )}
        {onAddLead && (
          <button
            onClick={onAddLead}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Lead
          </button>
        )}
        {onAddTask && (
          <button
            onClick={onAddTask}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-medium px-3 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Task
          </button>
        )}
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 text-gray-400 text-xs px-3 py-2 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
        )}
      </div>
    </header>
  );
}
