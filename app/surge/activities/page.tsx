"use client";

import { useSurgeStore } from "@/lib/surge/store";
import { Phone, Mail, MessageSquare, Video, FileText, DollarSign } from "lucide-react";

const TYPE_ICONS = {
  call: Phone,
  meeting: Video,
  email_sent: Mail,
  email_received: Mail,
  linkedin_touch: MessageSquare,
  contract_sent: FileText,
  payment_received: DollarSign,
  note: FileText,
};

export default function ActivitiesPage() {
  const { store, hydrated } = useSurgeStore();

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading activities...</p>
      </main>
    );
  }

  const sorted = [...store.activities].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1">
            Interaction Log
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Activities
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-2">
            Every call, email, and touch logged and searchable.
          </p>
        </div>
      </div>

      <div className="p-8 space-y-3">
        {sorted.length === 0 ? (
          <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-12 text-center">
            <p className="font-sans text-sm text-[#9A9086]">No activities logged yet.</p>
          </div>
        ) : (
          sorted.map((a) => {
            const Icon = TYPE_ICONS[a.type] || FileText;
            const prospect = store.prospects.find((p) => p.id === a.prospectId);
            const client = store.retainerClients.find((c) => c.id === a.clientId);
            const company = prospect?.companyName || client?.companyName || "Unknown";
            return (
              <div
                key={a.id}
                className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5 flex items-start gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-[#B87333]/15 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#B87333]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="font-display text-base font-bold text-[#E8E2D8]">
                      {a.subject}
                    </h3>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-[#5A5550] flex-shrink-0">
                      {a.type.replace(/_/g, " ")}
                    </span>
                  </div>
                  <p className="font-sans text-sm text-[#9A9086] leading-relaxed mb-2">
                    {a.summary}
                  </p>
                  {a.nextStepIdentified && (
                    <p className="font-sans text-xs text-[#B87333] mb-2">
                      Next: {a.nextStepIdentified}
                    </p>
                  )}
                  <div className="flex items-center gap-3">
                    <p className="font-sans text-xs text-[#5A5550]">
                      {company} · {new Date(a.createdAt).toLocaleDateString()}
                    </p>
                    {a.spinStageReached !== "none" && (
                      <span className="px-2 py-0.5 rounded-[2px] bg-[#60A5FA]/20 text-[#60A5FA] font-sans text-[10px] font-bold tracking-wider uppercase">
                        SPIN: {a.spinStageReached}
                      </span>
                    )}
                    {a.recordingUrl && (
                      <a
                        href={a.recordingUrl}
                        target="_blank"
                        rel="noopener"
                        className="font-sans text-xs text-[#B87333] hover:text-[#D4956A]"
                      >
                        View recording
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}
