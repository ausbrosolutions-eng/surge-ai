"use client";
import { Phone, Clock, DollarSign, ChevronRight } from "lucide-react";
import { Lead } from "@/lib/types";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

interface Props {
  lead: Lead;
  clientName?: string;
  onMove?: (lead: Lead, status: Lead["status"]) => void;
  compact?: boolean;
}

const statusFlow: Lead["status"][] = [
  "new", "contacted", "qualified", "booked", "completed",
];

function bantColor(total: number) {
  if (total >= 7) return "text-emerald-400";
  if (total >= 5) return "text-amber-400";
  if (total >= 3) return "text-orange-400";
  return "text-red-400";
}

function hoursAgo(isoDate: string) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function LeadCard({ lead, clientName, onMove, compact = false }: Props) {
  const isNew = lead.status === "new";
  const createdHours =
    (Date.now() - new Date(lead.createdAt).getTime()) / 3600000;
  const needsAttention = isNew && createdHours > 24;

  const nextStatus =
    statusFlow[statusFlow.indexOf(lead.status) + 1] ?? "completed";

  return (
    <div
      className={cn(
        "bg-gray-800 border rounded-xl p-3 space-y-2.5",
        needsAttention ? "border-red-500/50" : "border-gray-700"
      )}
    >
      {needsAttention && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-500/10 rounded px-2 py-1">
          <Clock className="w-3 h-3" />
          Needs follow-up — {Math.floor(createdHours)}h in &quot;new&quot;
        </div>
      )}

      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">{lead.name}</p>
          {clientName && (
            <p className="text-xs text-gray-500">{clientName}</p>
          )}
        </div>
        <StatusBadge variant={lead.urgency} size="sm" />
      </div>

      <p className="text-xs text-gray-400 leading-snug">{lead.serviceRequested}</p>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <Phone className="w-3 h-3" />
          {lead.phone}
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <DollarSign className="w-3 h-3" />
          {lead.estimatedValue.toLocaleString()}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusBadge variant={lead.source} size="sm" />
          <span className={cn("text-xs font-bold", bantColor(lead.bantScore.total))}>
            BANT {lead.bantScore.total}/8
          </span>
        </div>
        <span className="text-xs text-gray-600">{hoursAgo(lead.createdAt)}</span>
      </div>

      {!compact && onMove && lead.status !== "completed" && lead.status !== "lost" && (
        <button
          onClick={() => onMove(lead, nextStatus)}
          className="w-full flex items-center justify-center gap-1 bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium py-1.5 rounded-lg transition-colors"
        >
          Move to {nextStatus.replace("_", " ")} <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
