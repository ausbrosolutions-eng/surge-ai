"use client";
import { cn } from "@/lib/utils";

type Variant =
  | "active"
  | "onboarding"
  | "paused"
  | "prospect"
  | "critical"
  | "high"
  | "medium"
  | "low"
  | "urgent"
  | "done"
  | "in_progress"
  | "todo"
  | "new"
  | "booked"
  | "lost"
  | "emergency"
  | "planned"
  | "maintenance"
  | "foundation"
  | "growth"
  | "domination"
  | "lsa"
  | "google_ads"
  | "organic"
  | "gbp"
  | "referral"
  | "social"
  | "verified"
  | "pending"
  | "not_started";

const styles: Record<Variant, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  onboarding: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  paused: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  prospect: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  critical: "bg-red-500/20 text-red-400 border-red-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  low: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  urgent: "bg-red-500/20 text-red-400 border-red-500/30",
  done: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  in_progress: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  todo: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  new: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  booked: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  lost: "bg-red-500/20 text-red-400 border-red-500/30",
  emergency: "bg-red-500/20 text-red-400 border-red-500/30",
  planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  maintenance: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  foundation: "bg-gray-500/20 text-gray-300 border-gray-500/30",
  growth: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  domination: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  lsa: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  google_ads: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  organic: "bg-green-500/20 text-green-400 border-green-500/30",
  gbp: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  referral: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  social: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  verified: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  not_started: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const labels: Record<string, string> = {
  active: "Active",
  onboarding: "Onboarding",
  paused: "Paused",
  prospect: "Prospect",
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  urgent: "Urgent",
  done: "Done",
  in_progress: "In Progress",
  todo: "To Do",
  new: "New",
  booked: "Booked",
  lost: "Lost",
  emergency: "🚨 Emergency",
  planned: "Planned",
  maintenance: "Maintenance",
  foundation: "Foundation",
  growth: "Growth",
  domination: "Domination",
  lsa: "LSA",
  google_ads: "Google Ads",
  organic: "Organic",
  gbp: "GBP",
  referral: "Referral",
  social: "Social",
  verified: "Verified",
  pending: "Pending",
  not_started: "Not Started",
};

interface Props {
  variant: Variant | string;
  label?: string;
  className?: string;
  size?: "sm" | "md";
}

export default function StatusBadge({ variant, label, className, size = "md" }: Props) {
  const style = styles[variant as Variant] || "bg-gray-500/20 text-gray-400 border-gray-500/30";
  const text = label ?? labels[variant] ?? variant;
  return (
    <span
      className={cn(
        "inline-flex items-center border rounded-full font-medium",
        size === "sm" ? "px-2 py-0.5 text-xs" : "px-2.5 py-1 text-xs",
        style,
        className
      )}
    >
      {text}
    </span>
  );
}
