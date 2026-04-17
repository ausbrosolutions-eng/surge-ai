"use client";

import { use, useMemo } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import { GraduationCap, Lock, CheckCircle2, PlayCircle } from "lucide-react";

const COURSES = [
  { id: "claim-doc", title: "Claim Documentation Fundamentals", role: "admin", duration: 45, unlocked: true, description: "Master the photos, moisture logs, and sketches every carrier requires." },
  { id: "supplement-win", title: "Supplement Win Rate", role: "estimator", duration: 60, unlocked: true, description: "Turn denied supplements into approvals with defensible documentation." },
  { id: "adjuster-comm", title: "Adjuster Communication Mastery", role: "ops_manager", duration: 90, unlocked: true, description: "When to email, when to call, and how to escalate without burning relationships." },
  { id: "claude-101", title: "Claude 101 for Admin", role: "admin", duration: 30, unlocked: true, description: "Use Claude to handle email triage, summarize notes, and draft responses in half the time." },
  { id: "collection-excellence", title: "Collection Follow-Up Excellence", role: "admin", duration: 40, unlocked: true, description: "The 14-30-45-60-90 rhythm and the scripts that convert." },
  { id: "whatsapp-crm", title: "WhatsApp-to-CRM Workflow Optimization", role: "admin", duration: 25, unlocked: true, description: "Stop being the human integration layer." },
  { id: "ai-estimating", title: "AI-Assisted Estimating", role: "estimator", duration: 75, unlocked: false, description: "Unlock after 90 days on the platform." },
  { id: "field-docs", title: "Field Documentation With Encircle", role: "tech", duration: 50, unlocked: true, description: "Photos, sketches, and drying logs in half the time." },
];

export default function AcademyPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const { store, hydrated } = useSurgeStore();

  const staff = useMemo(() => store.staff.filter((s) => s.clientId === clientId), [store.staff, clientId]);
  const allCertifications = useMemo(() => {
    const set = new Set<string>();
    staff.forEach((s) => s.trainingProgress.certificationsEarned.forEach((c) => set.add(c)));
    return Array.from(set);
  }, [staff]);

  if (!hydrated) return <main className="flex-1 p-8"><p className="font-sans text-sm text-[#9A9086]">Loading...</p></main>;

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333] mb-1">Surge Academy</p>
        <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">Training Library</h1>
        <p className="font-sans text-xs text-[#5A5550] mt-2">
          Role-based playbooks. Short videos. Actual behavior change.
        </p>
      </div>

      <div className="p-8 space-y-8">
        {allCertifications.length > 0 && (
          <div>
            <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-3">
              Team Certifications
            </h2>
            <div className="flex flex-wrap gap-2">
              {allCertifications.map((cert) => (
                <span key={cert} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-[2px] font-sans text-xs font-semibold text-[#4ADE80]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4">
            Available Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COURSES.map((course) => (
              <div
                key={course.id}
                className={`bg-[#111111] border rounded-[2px] p-5 ${
                  course.unlocked ? "border-[#2A2520] hover:border-[#B87333]/40" : "border-[#2A2520]/50 opacity-50"
                } transition-colors`}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded bg-[#B87333]/15 flex items-center justify-center flex-shrink-0">
                    {course.unlocked ? (
                      <GraduationCap className="w-5 h-5 text-[#B87333]" />
                    ) : (
                      <Lock className="w-5 h-5 text-[#5A5550]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-base font-bold text-[#E8E2D8] mb-1">
                      {course.title}
                    </h3>
                    <p className="font-sans text-xs text-[#9A9086] capitalize">
                      {course.role.replace("_", " ")} · {course.duration} min
                    </p>
                  </div>
                </div>
                <p className="font-sans text-sm text-[#9A9086] leading-relaxed mb-4">
                  {course.description}
                </p>
                <button
                  disabled={!course.unlocked}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-[2px] font-sans text-xs font-semibold tracking-wider uppercase transition-colors ${
                    course.unlocked
                      ? "bg-[#B87333] hover:bg-[#D4956A] text-[#0A0A0A]"
                      : "bg-[#2A2520] text-[#5A5550] cursor-not-allowed"
                  }`}
                >
                  {course.unlocked ? (
                    <>
                      <PlayCircle className="w-3 h-3" /> Start Course
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" /> Locked
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
