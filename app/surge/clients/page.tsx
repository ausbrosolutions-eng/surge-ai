"use client";

import Link from "next/link";
import { useSurgeStore } from "@/lib/surge/store";
import { ArrowRight, ExternalLink } from "lucide-react";

export default function ClientsPage() {
  const { store, hydrated } = useSurgeStore();

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading clients...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1">
            Active Retainer Engagements
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Clients
          </h1>
        </div>
      </div>

      <div className="p-8 space-y-3">
        {store.retainerClients.length === 0 ? (
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-12 text-center">
            <p className="font-sans text-sm text-[#9A9086]">No active retainer clients yet.</p>
          </div>
        ) : (
          store.retainerClients.map((c) => (
            <div key={c.id} className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-display text-lg font-bold text-[#E8E2D8]">
                      {c.companyName}
                    </h3>
                    <span className="px-2 py-0.5 rounded-[2px] bg-[#B87333]/20 text-[#B87333] font-sans text-[10px] font-bold tracking-wider uppercase">
                      Phase {c.phase}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[#9A9086]">
                    {c.contactName} · Champion: {c.keyChampion}
                  </p>
                </div>
                <Link
                  href={`/platform/${c.id}`}
                  target="_blank"
                  className="flex items-center gap-1.5 px-3 py-2 bg-[#B87333] hover:bg-[#D4956A] text-[#0A0A0A] font-sans text-xs font-semibold tracking-wider uppercase rounded-[2px] transition-colors"
                >
                  Client Platform <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
              <div className="grid grid-cols-4 gap-4 pt-4 border-t border-[#1A1A1A]">
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550]">
                    Monthly Retainer
                  </p>
                  <p className="font-display text-lg font-bold text-[#E8E2D8]">
                    ${c.monthlyRetainer.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550]">
                    Health Score
                  </p>
                  <p
                    className={`font-display text-lg font-bold ${
                      c.healthScore >= 80
                        ? "text-[#4ADE80]"
                        : c.healthScore >= 60
                        ? "text-[#FBBF24]"
                        : "text-[#EF4444]"
                    }`}
                  >
                    {c.healthScore}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550]">
                    Last Check-In
                  </p>
                  <p className="font-sans text-sm text-[#E8E2D8]">
                    {new Date(c.lastCheckIn).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550]">
                    Next Check-In
                  </p>
                  <p className="font-sans text-sm text-[#B87333]">
                    {new Date(c.nextCheckIn).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {c.notes && (
                <p className="font-sans text-xs text-[#9A9086] leading-relaxed mt-4 pt-4 border-t border-[#1A1A1A]">
                  {c.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </main>
  );
}
