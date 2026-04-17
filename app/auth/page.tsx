"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, ArrowRight } from "lucide-react";

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/surge";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Incorrect password");
      }
      router.push(from);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E2D8] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded bg-[#B87333] items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-[#0A0A0A]" />
          </div>
          <p className="font-sans text-xs font-medium tracking-[0.12em] uppercase text-[#B87333] mb-2">
            Surge Advisory
          </p>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[#E8E2D8]">
            Private Access
          </h1>
          <p className="font-sans text-sm text-[#9A9086] mt-3 leading-relaxed">
            This area contains internal pipeline, client data, and performance
            metrics. Enter your access code to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-6 space-y-4">
          <div>
            <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">
              Access Code
            </label>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0A0A0A] border border-[#2A2520] text-sm text-[#E8E2D8] placeholder-[#5A5550] rounded-[2px] focus:outline-none focus:border-[#B87333]"
              placeholder="••••••••"
              disabled={submitting}
            />
            {error && (
              <p className="font-sans text-xs text-[#EF4444] mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || !password.trim()}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#B87333] hover:bg-[#D4956A] disabled:opacity-50 disabled:cursor-not-allowed text-[#0A0A0A] font-display text-xs font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-colors"
          >
            {submitting ? "Verifying..." : "Continue"}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center font-sans text-xs text-[#5A5550] mt-6">
          Public site:{" "}
          <a href="/" className="text-[#9A9086] hover:text-[#B87333] transition-colors">
            surgeadvisory.co
          </a>
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0A0A]" />}>
      <AuthForm />
    </Suspense>
  );
}
