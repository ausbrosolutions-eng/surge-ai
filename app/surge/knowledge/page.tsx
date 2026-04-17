"use client";

import Link from "next/link";
import { BookOpen, Target, Lightbulb, MessageSquare, Compass, FileText, Users, TrendingUp } from "lucide-react";

const docs = [
  {
    title: "30-Day Scaling Roadmap",
    description: "Week-by-week execution plan to hit first $15-25K MRR",
    icon: TrendingUp,
    path: "docs/surge/00-30-day-scaling-roadmap.md",
  },
  {
    title: "Ops Audit Product Spec",
    description: "Full productized offering - scope, pricing, deliverables",
    icon: FileText,
    path: "docs/surge/01-ops-audit-product-spec.md",
  },
  {
    title: "Jared Champion Activation",
    description: "Conversation script, 3 referral options, intro templates",
    icon: Users,
    path: "docs/surge/02-jared-champion-activation.md",
  },
  {
    title: "Signal-Based Prospecting",
    description: "Alert tools, target list, daily routine",
    icon: Compass,
    path: "docs/surge/03-signal-based-prospecting.md",
  },
  {
    title: "Email Cadence Templates",
    description: "5-touch sequence, video prospecting scripts",
    icon: MessageSquare,
    path: "docs/surge/04-email-cadence-templates.md",
  },
  {
    title: "Battle Cards",
    description: "Objection responses + competitive positioning",
    icon: Target,
    path: "docs/surge/05-battle-cards.md",
  },
  {
    title: "Discovery Call Framework",
    description: "SPIN/PACI scripts, call structure, close language",
    icon: Lightbulb,
    path: "docs/surge/06-discovery-call-framework.md",
  },
  {
    title: "Internal Flywheel Setup",
    description: "CRM, recording, practice ritual, execution stack",
    icon: BookOpen,
    path: "docs/surge/07-surge-internal-flywheel.md",
  },
  {
    title: "Platform Architecture",
    description: "This platform's design doc - what we're building and why",
    icon: Compass,
    path: "docs/surge/08-surge-platform-architecture.md",
  },
];

export default function KnowledgePage() {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1">
            The Surge Playbook
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Knowledge Base
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-2">
            Every doc is in the repo at{" "}
            <code className="bg-[#1A1A1A] px-1.5 py-0.5 rounded text-[#B87333]">docs/surge/</code>
          </p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {docs.map((doc) => (
            <div
              key={doc.path}
              className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-5 hover:border-[#B87333]/40 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded bg-[#B87333]/15 flex items-center justify-center flex-shrink-0">
                  <doc.icon className="w-5 h-5 text-[#B87333]" />
                </div>
                <h3 className="font-display text-base font-bold text-[#E8E2D8] leading-tight">
                  {doc.title}
                </h3>
              </div>
              <p className="font-sans text-sm text-[#9A9086] leading-relaxed mb-3">
                {doc.description}
              </p>
              <code className="font-sans text-[11px] text-[#5A5550]">{doc.path}</code>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
