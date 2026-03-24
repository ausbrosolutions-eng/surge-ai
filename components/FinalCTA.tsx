"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import SnapshotResult, { type SnapshotData } from "./SnapshotResult";

const revenueOptions = [
  "Under $500k/year",
  "$500k – $1M/year",
  "$1M – $3M/year",
  "$3M – $8M/year",
  "$8M – $20M/year",
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

const BENEFIT_LIST = [
  "Your top revenue gap identified",
  "Your market's competitive landscape",
  "Top 3 marketing channels for your trade and city",
  "One action you can take this week",
  "Option to book a free Blueprint review call",
];

export default function FinalCTA() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

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

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }
    if (!form.company.trim()) e.company = "Business name is required";
    if (!form.monthlyRevenue) e.monthlyRevenue = "Please select your revenue range";
    if (!form.biggestChallenge) e.biggestChallenge = "Please select your biggest challenge";
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
    `w-full px-4 py-3 rounded-xl border text-sm bg-white dark:bg-white/5 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/30 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
      errors[field]
        ? "border-red-400 dark:border-red-500/50"
        : "border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
    }`;

  return (
    <section
      id="contact"
      className="py-24 sm:py-32 bg-gray-50 dark:bg-[#0b1120] relative overflow-hidden"
    >
      {/* Orbs */}
      <div
        className="orb w-64 h-64 bg-[#00D4C8] -top-16 -left-16"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="orb w-48 h-48 bg-[#FF6B47] bottom-0 right-0"
        style={{ animationDelay: "4s" }}
      />
      <div className="absolute inset-0 grid-bg opacity-20" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start"
        >
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/5 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6">
              Free Blueprint Snapshot
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-5">
              Ready to know exactly{" "}
              <span className="gradient-text">where you&rsquo;re going?</span>
            </h2>
            <p className="text-gray-500 dark:text-white/50 text-lg leading-relaxed mb-8">
              Fill in the form and we&rsquo;ll build your free Blueprint Snapshot — a
              personalized look at your biggest growth gap and what to do about
              it. 60 seconds. Yours to keep.
            </p>

            {/* What you'll get */}
            <div className="space-y-3.5">
              {BENEFIT_LIST.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  </div>
                  <span className="text-sm text-gray-600 dark:text-white/60">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <p className="mt-8 text-xs text-gray-400 dark:text-white/25">
              Every submission reviewed personally. No automated pitch decks,
              no offshore follow-ups. A real strategist looks at your business
              before reaching out.
            </p>
          </motion.div>

          {/* Right: Form or Snapshot Result */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="p-6 sm:p-8 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.03] shadow-xl shadow-black/5">
              {snapshot ? (
                <SnapshotResult
                  snapshot={snapshot}
                  name={form.name}
                  company={form.company}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Build My Free Blueprint Snapshot
                  </div>
                  <p className="text-sm text-gray-400 dark:text-white/30 mb-5">
                    60 seconds. No credit card. Yours to keep.
                  </p>

                  {/* Name + Email row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 uppercase tracking-wide mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Scott Miller"
                        value={form.name}
                        onChange={(e) =>
                          setForm({ ...form, name: e.target.value })
                        }
                        className={inputClass("name")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 uppercase tracking-wide mb-1.5">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        placeholder="scott@yourbusiness.com"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                        className={inputClass("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Company */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 uppercase tracking-wide mb-1.5">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Rehab Restoration"
                      value={form.company}
                      onChange={(e) =>
                        setForm({ ...form, company: e.target.value })
                      }
                      className={inputClass("company")}
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.company}
                      </p>
                    )}
                  </div>

                  {/* Revenue */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 uppercase tracking-wide mb-1.5">
                      Annual Revenue *
                    </label>
                    <select
                      value={form.monthlyRevenue}
                      onChange={(e) =>
                        setForm({ ...form, monthlyRevenue: e.target.value })
                      }
                      className={inputClass("monthlyRevenue")}
                    >
                      <option value="" disabled>
                        Select a range
                      </option>
                      {revenueOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.monthlyRevenue && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.monthlyRevenue}
                      </p>
                    )}
                  </div>

                  {/* Challenge */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-white/50 uppercase tracking-wide mb-1.5">
                      Biggest Challenge Right Now *
                    </label>
                    <select
                      value={form.biggestChallenge}
                      onChange={(e) =>
                        setForm({ ...form, biggestChallenge: e.target.value })
                      }
                      className={inputClass("biggestChallenge")}
                    >
                      <option value="" disabled>
                        Select your main challenge
                      </option>
                      {challengeOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {errors.biggestChallenge && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.biggestChallenge}
                      </p>
                    )}
                  </div>

                  {/* Submit error */}
                  {submitError && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">
                      {submitError}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6B47]/30 hover:-translate-y-0.5 mt-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Building your snapshot...
                      </>
                    ) : (
                      <>
                        Build My Free Snapshot
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-gray-400 dark:text-white/25 mt-2">
                    No spam. No commitment. Unsubscribe anytime.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
