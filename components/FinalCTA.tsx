"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import SnapshotResult, { type SnapshotData } from "./SnapshotResult";

const revenueOptions = [
  "Under $500k/year",
  "$500k - $1M/year",
  "$1M - $3M/year",
  "$3M - $8M/year",
  "$8M - $20M/year",
  "Over $20M/year",
];

const challengeOptions = [
  "Not enough leads coming in",
  "Leads aren't converting to booked jobs",
  "Don't know where marketing spend is going",
  "No clear roadmap to my revenue goal",
  "Need to scale faster without adding chaos",
  "Other",
];

const LOADING_MESSAGES = [
  "Analyzing your market...",
  "Identifying your biggest revenue gap...",
  "Ranking your top 3 channels...",
  "Customizing your growth plan...",
  "Almost ready...",
];

interface FormData {
  name: string;
  email: string;
  company: string;
  monthlyRevenue: string;
  biggestChallenge: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  monthlyRevenue?: string;
  biggestChallenge?: string;
}

export default function FinalCTA() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    monthlyRevenue: "",
    biggestChallenge: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      setLoadingMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }
    if (!form.company.trim()) e.company = "Business name is required";
    if (!form.monthlyRevenue) e.monthlyRevenue = "Select your revenue range";
    if (!form.biggestChallenge) e.biggestChallenge = "Select your biggest challenge";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSnapshot(data.snapshot as SnapshotData);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 bg-[#111111] border text-sm text-[#E8E2D8] placeholder-[#5A5550] rounded-[2px] transition-colors duration-200 focus:outline-none focus:border-[#B87333] ${
      errors[field] ? "border-red-500/60" : "border-[#2A2520]"
    }`;

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-[#0A0A0A]/90 z-50 flex items-center justify-center px-4">
          <div className="max-w-sm w-full text-center">
            <Loader2 className="w-8 h-8 text-[#B87333] animate-spin mx-auto mb-6" />
            <p className="font-sans text-base font-normal text-[#E8E2D8] min-h-[1.5rem]">
              {LOADING_MESSAGES[loadingMsgIndex]}
            </p>
          </div>
        </div>
      )}

      <section id="contact" className="relative min-h-screen flex items-center py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/cta-bg.jpg" alt="" fill className="object-cover photo-treatment" />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to left, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.45) 100%)" }}
          />
        </div>
        <div className="absolute inset-0 noise-texture" />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
                Free Blueprint Snapshot
              </p>
              <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-6">
                Find out what&rsquo;s costing you jobs
              </h2>
              <div className="space-y-3 mb-8">
                {["Your #1 revenue gap, named", "Top 3 channels for your trade", "One action to take this week", "Your market's competitive blind spot"].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B87333] flex-shrink-0" />
                    <span className="font-sans text-sm font-light text-[#9A9086]">{item}</span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-xs font-normal text-[#5A5550] border-l border-[#2A2520] pl-4">
                Reviewed by a real person within 24 hours. No automated pitch.
              </p>
            </div>

            <div className="bg-[#1A1A1A] border border-[#2A2520] rounded-[2px] p-7 sm:p-8">
              {snapshot ? (
                <SnapshotResult snapshot={snapshot} name={form.name} company={form.company} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <div className="font-display text-lg font-bold tracking-[0.03em] uppercase text-[#E8E2D8] mb-0.5">
                      Build My Free Snapshot
                    </div>
                    <p className="font-sans text-sm font-light text-[#5A5550] mb-5">
                      60 seconds. No credit card. Yours to keep.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">Your Name *</label>
                      <input type="text" placeholder="Scott Miller" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass("name")} />
                      {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">Business Email *</label>
                      <input type="email" placeholder="scott@yourbusiness.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass("email")} />
                      {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">Business Name *</label>
                    <input type="text" placeholder="Miller Plumbing & Drain" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className={inputClass("company")} />
                    {errors.company && <p className="mt-1 text-xs text-red-400">{errors.company}</p>}
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">Annual Revenue *</label>
                    <select value={form.monthlyRevenue} onChange={(e) => setForm({ ...form, monthlyRevenue: e.target.value })} className={inputClass("monthlyRevenue")}>
                      <option value="" disabled>Select a range</option>
                      {revenueOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                    </select>
                    {errors.monthlyRevenue && <p className="mt-1 text-xs text-red-400">{errors.monthlyRevenue}</p>}
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">Biggest Challenge *</label>
                    <select value={form.biggestChallenge} onChange={(e) => setForm({ ...form, biggestChallenge: e.target.value })} className={inputClass("biggestChallenge")}>
                      <option value="" disabled>Select your main challenge</option>
                      {challengeOptions.map((opt) => (<option key={opt} value={opt}>{opt}</option>))}
                    </select>
                    {errors.biggestChallenge && <p className="mt-1 text-xs text-red-400">{errors.biggestChallenge}</p>}
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-[2px] bg-red-500/10 border border-red-500/30 text-sm text-red-400">{submitError}</div>
                  )}

                  <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-[#B87333] hover:bg-[#D4956A] disabled:opacity-60 disabled:cursor-not-allowed text-[#0A0A0A] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-all duration-200 mt-2">
                    Build My Free Snapshot
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center font-sans text-xs font-normal text-[#5A5550] mt-2">
                    No spam. No commitment.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
