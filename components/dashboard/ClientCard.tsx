"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Target } from "lucide-react";
import { Client } from "@/lib/types";
import ProgressRing from "./ProgressRing";
import StatusBadge from "./StatusBadge";
import { cn } from "@/lib/utils";

const tradeIcon: Record<string, string> = {
  restoration: "🌊", hvac: "❄️", plumbing: "🔧", electrical: "⚡",
  roofing: "🏠", landscaping: "🌿", pest_control: "🐛", cleaning: "✨",
  painting: "🎨", garage_doors: "🚪", gutters: "🏗️", windows: "🪟", general: "🔨",
};

const modules = ["gbp", "lsa", "seo", "aiSearch", "reputation", "ads"] as const;
const moduleLabels: Record<string, string> = {
  gbp: "GBP", lsa: "LSA", seo: "SEO", aiSearch: "AI", reputation: "Rep", ads: "Ads",
};

interface Props {
  client: Client;
  leadsThisMonth: number;
  index?: number;
}

function scoreColor(score: number) {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export default function ClientCard({ client, leadsThisMonth, index = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-gray-800 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{tradeIcon[client.trade]}</span>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">{client.businessName}</h3>
              <StatusBadge variant={client.package} size="sm" />
            </div>
            <p className="text-xs text-gray-500 mt-0.5">{client.name} · {client.city}, {client.state}</p>
            <div className="flex items-center gap-3 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Target className="w-3 h-3" />
                {leadsThisMonth} leads
              </span>
              <StatusBadge variant={client.status} size="sm" />
            </div>
          </div>
        </div>
        <ProgressRing score={client.scores.overall} size={52} strokeWidth={5} />
      </div>

      {/* Module score bars */}
      <div className="mt-3 grid grid-cols-6 gap-1">
        {modules.map((mod) => {
          const score = (client.scores as unknown as Record<string, number>)[mod] ?? 0;
          return (
            <div key={mod} className="flex flex-col items-center gap-1">
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", scoreColor(score))}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">{moduleLabels[mod]}</span>
            </div>
          );
        })}
      </div>

      <Link
        href={`/dashboard/clients/${client.id}`}
        className="mt-3 flex items-center justify-center gap-1.5 w-full bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs font-medium py-2 rounded-lg transition-colors"
      >
        Go to Client <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </motion.div>
  );
}
