"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText, Download, Plus, Trash2, ChevronDown, ChevronUp,
  Check, DollarSign, Target, Zap, Copy, Eye, EyeOff,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useStore } from "@/lib/store";

// ── Package definitions ──────────────────────────────────────────────────────
const PACKAGES = {
  foundation: {
    name: "Foundation",
    price: 1250,
    tagline: "Get found. Get reviewed. Get calls.",
    color: "border-blue-500/30 bg-blue-500/5",
    accent: "text-blue-400",
    badge: "bg-blue-500/10 text-blue-400",
    deliverables: [
      "Google Business Profile setup & full optimization",
      "NAP audit + citation cleanup (Tier 1 directories)",
      "Review request system setup (SMS automation)",
      "4 GBP posts per month",
      "Monthly performance report",
      "Dedicated account manager",
    ],
  },
  growth: {
    name: "Growth",
    price: 3250,
    tagline: "Dominate local search. Build the referral engine.",
    color: "border-emerald-500/30 bg-emerald-500/5",
    accent: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400",
    deliverables: [
      "Everything in Foundation",
      "Full local SEO (on-page, citations, schema markup)",
      "2 SEO blog posts per month",
      "Google Ads management (ad spend separate)",
      "Reputation management (monitor + respond to all reviews)",
      "Referral partner program launch",
      "Bi-weekly strategy calls",
      "Real-time KPI dashboard access",
    ],
  },
  domination: {
    name: "Domination",
    price: 5500,
    tagline: "Own the market. Run while you sleep.",
    color: "border-amber-500/30 bg-amber-500/5",
    accent: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400",
    deliverables: [
      "Everything in Growth",
      "Google LSA setup & management",
      "Social media management (3 platforms, 12 posts/month)",
      "1 short-form video per month",
      "Landing page CRO optimization",
      "Call tracking + conversion optimization",
      "AI Search / AEO optimization (ChatGPT, Perplexity, Google AI)",
      "Weekly dashboard access + monthly strategy call",
      "Storm/weather EDDM campaign activation",
    ],
  },
};

const ADDONS = [
  { id: "lsa-setup", label: "Google LSA Setup (one-time)", price: 500 },
  { id: "website", label: "Website build / redesign", price: 3500 },
  { id: "extra-blog", label: "Additional blog post", price: 350 },
  { id: "video", label: "Short-form video (monthly)", price: 400 },
  { id: "eddm", label: "Storm EDDM campaign (per deployment)", price: 1200 },
  { id: "ai-search", label: "AI Search / AEO audit + setup", price: 750 },
  { id: "competitor", label: "Competitor intelligence report", price: 500 },
  { id: "ghl", label: "GoHighLevel CRM setup + training", price: 1500 },
];

interface ProposalData {
  clientName: string;
  businessName: string;
  city: string;
  trade: string;
  currentRevenue: string;
  revenueGoal: string;
  packageKey: keyof typeof PACKAGES;
  addons: string[];
  adSpendBudget: string;
  notes: string;
  agencyName: string;
  preparedBy: string;
  validDays: string;
}

const empty: ProposalData = {
  clientName: "",
  businessName: "",
  city: "",
  trade: "",
  currentRevenue: "",
  revenueGoal: "",
  packageKey: "growth",
  addons: [],
  adSpendBudget: "",
  notes: "",
  agencyName: "Blueprint AI Marketing",
  preparedBy: "Austin",
  validDays: "14",
};

export default function ProposalsPage() {
  const { store } = useStore();
  const [form, setForm] = useState<ProposalData>({ ...empty });
  const [preview, setPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [fillFromClient, setFillFromClient] = useState("");

  const pkg = PACKAGES[form.packageKey];
  const addonTotal = ADDONS.filter((a) => form.addons.includes(a.id)).reduce((s, a) => s + a.price, 0);
  const adSpend = parseFloat(form.adSpendBudget) || 0;
  const mgmtFee = adSpend >= 2000 ? Math.round(adSpend * 0.15) : 0;
  const monthlyTotal = pkg.price + mgmtFee;
  const oneTimeTotal = addonTotal;

  function toggleAddon(id: string) {
    setForm((f) => ({
      ...f,
      addons: f.addons.includes(id) ? f.addons.filter((a) => a !== id) : [...f.addons, id],
    }));
  }

  function fillFromExistingClient(clientId: string) {
    const c = store.clients.find((cl) => cl.id === clientId);
    if (!c) return;
    setForm((f) => ({
      ...f,
      businessName: c.businessName,
      city: c.city,
      trade: c.trade,
      packageKey: (c.package as keyof typeof PACKAGES) || "growth",
    }));
    setFillFromClient(clientId);
  }

  const proposalText = `
=====================================
PARTNERSHIP PROPOSAL
=====================================
Prepared by: ${form.agencyName}
Prepared for: ${form.clientName} — ${form.businessName}
Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
Valid for: ${form.validDays} days
=====================================

ABOUT THIS PROPOSAL
-------------------
This proposal outlines a custom digital marketing partnership designed specifically for ${form.businessName} in ${form.city}. Our goal is to help you${form.revenueGoal ? ` reach ${form.revenueGoal}` : " grow your revenue"} through a systematic approach to local search, reputation, and lead generation.

SELECTED PACKAGE: ${pkg.name.toUpperCase()} — $${pkg.price.toLocaleString()}/month
${pkg.tagline}

WHAT'S INCLUDED:
${pkg.deliverables.map((d) => `  • ${d}`).join("\n")}
${form.adSpendBudget ? `\nAD SPEND: $${parseFloat(form.adSpendBudget).toLocaleString()}/month (managed separately)\nAd Management Fee: $${mgmtFee.toLocaleString()}/month (15% of spend)` : ""}
${form.addons.length > 0 ? `\nADD-ONS (One-Time):\n${ADDONS.filter((a) => form.addons.includes(a.id)).map((a) => `  • ${a.label} — $${a.price.toLocaleString()}`).join("\n")}` : ""}

INVESTMENT SUMMARY
------------------
Monthly Retainer: $${pkg.price.toLocaleString()}/month${mgmtFee > 0 ? `\nAd Management Fee: $${mgmtFee.toLocaleString()}/month` : ""}
TOTAL MONTHLY: $${monthlyTotal.toLocaleString()}/month${oneTimeTotal > 0 ? `\nOne-Time Setup: $${oneTimeTotal.toLocaleString()}` : ""}

WHY BLUEPRINT AI MARKETING
--------------------------
• Exclusively serve home service businesses — we speak your language
• AI-powered strategy: your competitors don't know this exists yet
• Full transparency — you see every lead, every call, every dollar
• 30-day quick wins guaranteed or we refund your first month

${form.notes ? `NOTES\n-----\n${form.notes}\n` : ""}
NEXT STEPS
----------
1. Review this proposal and ask any questions
2. Sign the service agreement (sent separately)
3. Complete the onboarding intake form
4. Kickoff call within 48 hours of signing

Ready to get started? Reply to this proposal or call directly.

${form.agencyName} | ${form.preparedBy}
`;

  function copyProposal() {
    navigator.clipboard.writeText(proposalText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function downloadProposal() {
    const blob = new Blob([proposalText.trim()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const fname = form.businessName
      ? `${form.businessName.replace(/\s+/g, "-")}-Proposal-${new Date().toISOString().split("T")[0]}.txt`
      : `Blueprint-Proposal-${new Date().toISOString().split("T")[0]}.txt`;
    a.download = fname;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Proposal Generator" />
      <main className="flex-1 p-6 space-y-6 max-w-5xl mx-auto w-full">

        {/* Header bar */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">Build a custom proposal in under 3 minutes.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPreview(!preview)}
              className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              {preview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {preview ? "Edit" : "Preview"}
            </button>
            <button
              onClick={copyProposal}
              className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-600 px-3 py-1.5 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy Text"}
            </button>
            <button
              onClick={downloadProposal}
              className="flex items-center gap-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="bg-gray-900 border border-gray-700 rounded-xl p-6"
            >
              {/* Styled proposal preview */}
              <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="border-b border-gray-700 pb-6 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                          <Zap className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm font-bold text-white">{form.agencyName}</span>
                      </div>
                      <p className="text-xs text-gray-500">Digital Marketing Partnership Proposal</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                      <p className="text-xs text-gray-600">Valid {form.validDays} days</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Prepared for</p>
                    <p className="text-lg font-bold text-white mt-0.5">
                      {form.businessName || "Client Business Name"}
                    </p>
                    <p className="text-sm text-gray-400">{form.clientName}{form.city ? ` · ${form.city}` : ""}</p>
                  </div>
                </div>

                {/* Package */}
                <div className={`rounded-xl border p-5 mb-5 ${pkg.color}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${pkg.badge}`}>
                        {pkg.name} Package
                      </span>
                      <p className={`text-sm mt-2 ${pkg.accent}`}>{pkg.tagline}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">${pkg.price.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">/ month</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {pkg.deliverables.map((d, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${pkg.accent}`} />
                        <span className="text-xs text-gray-300">{d}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Add-ons */}
                {form.addons.length > 0 && (
                  <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-5">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Add-ons</p>
                    {ADDONS.filter((a) => form.addons.includes(a.id)).map((a) => (
                      <div key={a.id} className="flex items-center justify-between py-1.5 border-b border-gray-700/50 last:border-0">
                        <span className="text-sm text-gray-300">{a.label}</span>
                        <span className="text-sm font-medium text-white">${a.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Investment summary */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-5 mb-5">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Investment Summary</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">{pkg.name} Monthly Retainer</span>
                      <span className="text-white">${pkg.price.toLocaleString()}/mo</span>
                    </div>
                    {mgmtFee > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Ad Management Fee (15%)</span>
                        <span className="text-white">${mgmtFee.toLocaleString()}/mo</span>
                      </div>
                    )}
                    {adSpend > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Ad Spend Budget (separate)</span>
                        <span className="text-gray-400">${adSpend.toLocaleString()}/mo</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm font-bold border-t border-gray-700 pt-2 mt-1">
                      <span className="text-white">Monthly Total (agency fees)</span>
                      <span className="text-emerald-400">${monthlyTotal.toLocaleString()}/mo</span>
                    </div>
                    {oneTimeTotal > 0 && (
                      <div className="flex justify-between text-sm font-bold">
                        <span className="text-white">One-Time Setup</span>
                        <span className="text-amber-400">${oneTimeTotal.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {form.notes && (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-5">
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-2">Notes</p>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{form.notes}</p>
                  </div>
                )}

                {/* Next steps */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Next Steps</p>
                  {["Review this proposal and ask any questions", "Sign the service agreement", "Complete the onboarding intake form", "Kickoff call within 48 hours of signing"].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 py-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs text-blue-400 font-bold">{i + 1}</span>
                      </div>
                      <span className="text-sm text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-gray-600 text-center mt-5">
                  Prepared by {form.preparedBy} · {form.agencyName}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="space-y-6"
            >
              {/* Fill from existing client */}
              {store.clients.length > 0 && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick Fill from Existing Client</p>
                  <div className="flex items-center gap-3">
                    <select
                      value={fillFromClient}
                      onChange={(e) => fillFromExistingClient(e.target.value)}
                      className="flex-1 bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select a client to auto-fill...</option>
                      {store.clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.businessName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Client info */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <p className="text-sm font-semibold text-white mb-4">Client Information</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: "Contact Name", key: "clientName", placeholder: "Scott Mitchell" },
                    { label: "Business Name", key: "businessName", placeholder: "Rehab Restoration" },
                    { label: "City / Market", key: "city", placeholder: "Greenville, SC" },
                    { label: "Trade / Service Type", key: "trade", placeholder: "Water & Fire Restoration" },
                    { label: "Current Annual Revenue", key: "currentRevenue", placeholder: "$4M" },
                    { label: "Revenue Goal (12–36 months)", key: "revenueGoal", placeholder: "$20M in 36 months" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-400 block mb-1">{label}</label>
                      <input
                        value={(form as unknown as Record<string, string>)[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Package selection */}
              <div>
                <p className="text-sm font-semibold text-white mb-3">Select Package</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(Object.entries(PACKAGES) as [keyof typeof PACKAGES, typeof PACKAGES.growth][]).map(([key, p]) => (
                    <button
                      key={key}
                      onClick={() => setForm((f) => ({ ...f, packageKey: key }))}
                      className={`text-left rounded-xl border p-4 transition-all ${
                        form.packageKey === key
                          ? p.color + " ring-2 ring-offset-2 ring-offset-gray-950 " + (key === "foundation" ? "ring-blue-500" : key === "growth" ? "ring-emerald-500" : "ring-amber-500")
                          : "border-gray-700 bg-gray-800 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className={`text-sm font-bold ${form.packageKey === key ? p.accent : "text-white"}`}>{p.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{p.tagline}</p>
                        </div>
                        {form.packageKey === key && (
                          <Check className={`w-4 h-4 flex-shrink-0 ${p.accent}`} />
                        )}
                      </div>
                      <p className="text-xl font-bold text-white mt-2">${p.price.toLocaleString()}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ad spend */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <p className="text-sm font-semibold text-white mb-1">Ad Spend Budget (optional)</p>
                <p className="text-xs text-gray-500 mb-3">If client will run Google Ads, enter monthly spend. We charge 15% as management fee (min $1,000 spend to apply).</p>
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input
                      type="number"
                      value={form.adSpendBudget}
                      onChange={(e) => setForm((f) => ({ ...f, adSpendBudget: e.target.value }))}
                      placeholder="3000"
                      className="w-full bg-gray-900 border border-gray-600 rounded-lg pl-7 pr-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  {mgmtFee > 0 && (
                    <p className="text-sm text-emerald-400">+ ${mgmtFee.toLocaleString()}/mo management fee</p>
                  )}
                </div>
              </div>

              {/* Add-ons */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <p className="text-sm font-semibold text-white mb-3">Add-Ons (One-Time or Recurring)</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ADDONS.map((addon) => (
                    <label
                      key={addon.id}
                      className={`flex items-center justify-between gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        form.addons.includes(addon.id)
                          ? "border-blue-500/50 bg-blue-500/10"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={form.addons.includes(addon.id)}
                          onChange={() => toggleAddon(addon.id)}
                          className="w-4 h-4 accent-blue-500"
                        />
                        <span className="text-sm text-gray-300">{addon.label}</span>
                      </div>
                      <span className="text-sm font-medium text-white flex-shrink-0">${addon.price.toLocaleString()}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Proposal meta */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <p className="text-sm font-semibold text-white mb-4">Proposal Settings</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Your Name", key: "preparedBy", placeholder: "Austin" },
                    { label: "Agency Name", key: "agencyName", placeholder: "Blueprint AI Marketing" },
                    { label: "Valid for (days)", key: "validDays", placeholder: "14" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-400 block mb-1">{label}</label>
                      <input
                        value={(form as unknown as Record<string, string>)[key]}
                        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-xs text-gray-400 block mb-1">Custom Notes / Personalization</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    placeholder="e.g., Based on our analysis of your Google Business Profile and competitive landscape in Greenville..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 resize-none"
                  />
                </div>
              </div>

              {/* Total summary */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Proposal Summary</p>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">{pkg.name} Package</span>
                  <span className="text-sm font-medium text-white">${pkg.price.toLocaleString()}/mo</span>
                </div>
                {mgmtFee > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">Ad Management Fee</span>
                    <span className="text-sm font-medium text-white">${mgmtFee.toLocaleString()}/mo</span>
                  </div>
                )}
                {oneTimeTotal > 0 && (
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400">One-Time Add-ons</span>
                    <span className="text-sm font-medium text-white">${oneTimeTotal.toLocaleString()}</span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3 mt-1 flex items-center justify-between">
                  <span className="text-base font-bold text-white">Monthly Agency Total</span>
                  <span className="text-xl font-bold text-emerald-400">${monthlyTotal.toLocaleString()}/mo</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
