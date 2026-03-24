"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, ChevronLeft, Copy, CheckCircle } from "lucide-react";
import { useStore } from "@/lib/store";
import { Client, TradeType } from "@/lib/types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const trades: { value: TradeType; label: string; icon: string }[] = [
  { value: "restoration", label: "Restoration (Water/Fire/Mold)", icon: "🌊" },
  { value: "hvac", label: "HVAC", icon: "❄️" },
  { value: "plumbing", label: "Plumbing", icon: "🔧" },
  { value: "electrical", label: "Electrical", icon: "⚡" },
  { value: "roofing", label: "Roofing", icon: "🏠" },
  { value: "landscaping", label: "Landscaping", icon: "🌿" },
  { value: "pest_control", label: "Pest Control", icon: "🐛" },
  { value: "cleaning", label: "Cleaning", icon: "✨" },
  { value: "painting", label: "Painting", icon: "🎨" },
  { value: "garage_doors", label: "Garage Doors", icon: "🚪" },
  { value: "gutters", label: "Gutters", icon: "🏗️" },
  { value: "windows", label: "Windows", icon: "🪟" },
  { value: "general", label: "Other Home Service", icon: "🔨" },
];

const packages = [
  {
    id: "foundation", label: "Foundation", price: "$1,000–$1,500/mo",
    features: ["GBP setup and optimization", "NAP audit and citation cleanup", "Review request system", "4 GBP posts/month", "Monthly reporting"],
    color: "border-gray-600",
  },
  {
    id: "growth", label: "Growth", price: "$2,500–$4,000/mo",
    features: ["Everything in Foundation", "Full local SEO (citations, schema)", "Blog content (2 posts/month)", "Reputation management", "Google Ads management", "Bi-weekly calls"],
    color: "border-blue-500",
    recommended: true,
  },
  {
    id: "domination", label: "Domination", price: "$4,000–$8,000/mo + ad spend",
    features: ["Everything in Growth", "LSA management", "Social media (3 platforms)", "Short-form video (1/month)", "Landing page CRO", "Call tracking + CRO", "Weekly dashboard"],
    color: "border-purple-500",
  },
];

const accessItems = [
  { label: "Google Business Profile", detail: "Manager access" },
  { label: "Google Ads", detail: "Standard access" },
  { label: "Google Analytics 4", detail: "Editor access" },
  { label: "Google Search Console", detail: "Full access" },
  { label: "Website / CMS", detail: "Admin or editor login" },
  { label: "CallRail account", detail: "Or create new — $45/mo" },
  { label: "Facebook Business Manager", detail: "Admin access" },
  { label: "Existing LSA account", detail: "If applicable" },
];

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const router = useRouter();
  const { saveClient } = useStore();
  const [step, setStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const [form, setForm] = useState({
    businessName: "", ownerName: "", phone: "", email: "", website: "",
    address: "", city: "", state: "", trade: "restoration" as TradeType,
    serviceAreaInput: "", serviceArea: [] as string[],
    package: "growth" as Client["package"], monthlyRetainer: 3000, adSpend: 0,
  });
  const [accessChecked, setAccessChecked] = useState<Record<string, boolean>>({});

  const addServiceArea = () => {
    const cities = form.serviceAreaInput.split(",").map((c) => c.trim()).filter(Boolean);
    const merged = Array.from(new Set([...form.serviceArea, ...cities]));
    setForm({ ...form, serviceArea: merged, serviceAreaInput: "" });
  };
  const removeCity = (city: string) =>
    setForm({ ...form, serviceArea: form.serviceArea.filter((c) => c !== city) });

  const kickoffAgenda = `Kickoff Call Agenda — ${form.businessName}
Date: ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}

1. Business Overview (15 min)
   - What makes ${form.businessName} different from competitors?
   - Who is the ideal customer? (homeowner profile, job type, avg ticket)
   - What services generate the most revenue?

2. Current Marketing (15 min)
   - What marketing have you tried? What worked / didn't work?
   - Current GBP status — claimed? Optimized?
   - Current Google review count and average rating?
   - Any existing Google Ads or LSA?

3. Competitive Landscape (10 min)
   - Who are your top 3 local competitors?
   - What are they doing in marketing that you're not?

4. Seasonal Patterns (10 min)
   - Busiest months? (${form.trade === "restoration" ? "Spring flooding, winter pipe bursts" : "varies by trade"})
   - Slowest months? Strategy to fill pipeline?
   - Emergency % vs planned job %?

5. Goals (10 min)
   - 90-day goal: What does success look like?
   - 12-month revenue target?
   - How many new jobs per month is the goal?

6. Next Steps (10 min)
   - Access requests list (GBP, Google Ads, Analytics, website)
   - First 30-day action plan review
   - Communication preferences (email, text, call frequency)`;

  const week1Tasks = [
    { day: "Day 1", task: "Set up CallRail tracking numbers (Dynamic Number Insertion)", category: "admin" },
    { day: "Day 1", task: "Verify all account access received (GBP, Ads, Analytics, website)", category: "admin" },
    { day: "Day 2-3", task: "Run baseline audit: GBP score, citation audit, website CRO, review profile", category: "seo" },
    { day: "Day 4-5", task: "Set up GA4 goals + Google Ads conversion tracking", category: "ads" },
  ];
  const week2Tasks = [
    { day: "Day 8-9", task: "Present 30/60/90 day strategy to client", category: "admin" },
    { day: "Day 10", task: "Launch first Google Ads campaign (emergency keywords)", category: "ads" },
    { day: "Day 10", task: "Complete GBP optimization (all checklist items)", category: "gbp" },
    { day: "Day 12-14", task: "Activate review request SMS system", category: "reputation" },
  ];

  const handleFinish = () => {
    const client: Client = {
      id: `${form.businessName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}`,
      name: form.ownerName,
      businessName: form.businessName,
      trade: form.trade,
      phone: form.phone,
      email: form.email,
      website: form.website,
      address: form.address,
      city: form.city,
      state: form.state,
      serviceArea: form.serviceArea,
      package: form.package,
      monthlyRetainer: form.monthlyRetainer,
      adSpend: form.adSpend,
      startDate: new Date().toISOString().split("T")[0],
      status: "onboarding",
      gbpUrl: "",
      googleAdsId: "",
      lsaEnabled: false,
      notes: "",
      scores: { gbp: 0, lsa: 0, seo: 0, aiSearch: 0, reputation: 0, ads: 0, social: 0, overall: 0 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveClient(client);
    router.push(`/dashboard/clients/${client.id}`);
  };

  const inp = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500";

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="New Client Onboarding" />
      <main className="flex-1 p-6 max-w-2xl mx-auto w-full">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                i + 1 < step ? "bg-emerald-500 text-white" : i + 1 === step ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-500"
              }`}>
                {i + 1 < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              {i < TOTAL_STEPS - 1 && <div className={`flex-1 h-0.5 ${i + 1 < step ? "bg-emerald-500" : "bg-gray-700"}`} />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-white mb-1">Business Information</h2>
              <p className="text-sm text-gray-400 mb-6">Basic info about the new client.</p>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Business Name *</label><input value={form.businessName} onChange={(e) => setForm({ ...form, businessName: e.target.value })} className={inp} placeholder="Rehab Restoration" /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Owner Name *</label><input value={form.ownerName} onChange={(e) => setForm({ ...form, ownerName: e.target.value })} className={inp} placeholder="Scott" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">Phone *</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inp} placeholder="(720) 555-0192" /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">Email *</label><input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inp} placeholder="scott@business.com" /></div>
                </div>
                <div><label className="text-xs text-gray-500 mb-1 block">Website</label><input value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} className={inp} placeholder="https://rehabrestoration.com" /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Address</label><input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className={inp} placeholder="123 Commerce Dr" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div><label className="text-xs text-gray-500 mb-1 block">City *</label><input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inp} placeholder="Denver" /></div>
                  <div><label className="text-xs text-gray-500 mb-1 block">State *</label><input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inp} placeholder="CO" maxLength={2} /></div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Trade / Service Type *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {trades.map((t) => (
                      <button key={t.value} onClick={() => setForm({ ...form, trade: t.value })} className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm text-left transition-colors ${form.trade === t.value ? "border-blue-500 bg-blue-500/10 text-blue-300" : "border-gray-700 bg-gray-800 text-gray-400 hover:border-gray-600"}`}>
                        <span>{t.icon}</span> {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Service Area Cities</label>
                  <div className="flex gap-2">
                    <input value={form.serviceAreaInput} onChange={(e) => setForm({ ...form, serviceAreaInput: e.target.value })} onKeyDown={(e) => e.key === "Enter" && addServiceArea()} className={`${inp} flex-1`} placeholder="Denver, Lakewood, Arvada (comma-separated)" />
                    <button onClick={addServiceArea} className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 rounded-lg">Add</button>
                  </div>
                  {form.serviceArea.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {form.serviceArea.map((city) => (
                        <span key={city} className="flex items-center gap-1 bg-blue-500/20 text-blue-300 text-xs rounded-full px-2.5 py-1">
                          {city} <button onClick={() => removeCity(city)} className="ml-1 hover:text-white">×</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-white mb-1">Package Selection</h2>
              <p className="text-sm text-gray-400 mb-6">Choose the right package for {form.businessName || "this client"}.</p>
              <div className="space-y-3 mb-6">
                {packages.map((pkg) => (
                  <button key={pkg.id} onClick={() => setForm({ ...form, package: pkg.id as Client["package"] })} className={`w-full text-left p-4 rounded-xl border-2 transition-all ${form.package === pkg.id ? pkg.color + " bg-blue-500/5" : "border-gray-700 hover:border-gray-600"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-white">{pkg.label}</p>
                        {pkg.recommended && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Recommended</span>}
                      </div>
                      <p className="text-sm font-bold text-blue-400">{pkg.price}</p>
                    </div>
                    <ul className="mt-2 space-y-1">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="text-xs text-gray-400 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400 flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs text-gray-500 mb-1 block">Monthly Retainer ($)</label><input type="number" value={form.monthlyRetainer} onChange={(e) => setForm({ ...form, monthlyRetainer: parseInt(e.target.value) || 0 })} className={inp} /></div>
                <div><label className="text-xs text-gray-500 mb-1 block">Monthly Ad Spend ($)</label><input type="number" value={form.adSpend} onChange={(e) => setForm({ ...form, adSpend: parseInt(e.target.value) || 0 })} className={inp} /></div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-white mb-1">Access Checklist</h2>
              <p className="text-sm text-gray-400 mb-6">Request these accounts before the kickoff call.</p>
              <div className="space-y-2">
                {accessItems.map((item, i) => (
                  <button key={i} onClick={() => setAccessChecked((prev) => ({ ...prev, [item.label]: !prev[item.label] }))} className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${accessChecked[item.label] ? "border-emerald-500/50 bg-emerald-500/5" : "border-gray-700 bg-gray-800 hover:border-gray-600"}`}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${accessChecked[item.label] ? "bg-emerald-500 border-emerald-500" : "border-gray-500"}`}>
                      {accessChecked[item.label] && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-gray-200">{item.label}</p>
                      <p className="text-xs text-gray-500">{item.detail}</p>
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                ✅ {Object.values(accessChecked).filter(Boolean).length}/{accessItems.length} access items confirmed
              </p>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-white mb-1">Kickoff Call Agenda</h2>
              <p className="text-sm text-gray-400 mb-4">Pre-built 60-90 minute agenda for {form.businessName || "client"}.</p>
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 mb-4">
                <pre className="text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">{kickoffAgenda}</pre>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(kickoffAgenda); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
              >
                {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied to Clipboard!" : "Copy Agenda"}
              </button>
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h2 className="text-xl font-bold text-white mb-1">First 30 Days Plan</h2>
              <p className="text-sm text-gray-400 mb-6">Auto-generated action plan based on {form.package} package.</p>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Week 1</h3>
                  <div className="space-y-2">
                    {week1Tasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-800 border border-gray-700 rounded-lg p-3">
                        <span className="text-xs text-blue-400 font-medium flex-shrink-0 mt-0.5 w-16">{task.day}</span>
                        <p className="text-xs text-gray-300">{task.task}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white mb-2">Week 2</h3>
                  <div className="space-y-2">
                    {week2Tasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-3 bg-gray-800 border border-gray-700 rounded-lg p-3">
                        <span className="text-xs text-blue-400 font-medium flex-shrink-0 mt-0.5 w-16">{task.day}</span>
                        <p className="text-xs text-gray-300">{task.task}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <p className="text-sm font-semibold text-blue-300 mb-1">✅ Ready to create {form.businessName}?</p>
                <p className="text-xs text-gray-400">This will create the client in your dashboard, pre-populate all optimization checklists, and generate 5 starter tasks.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <button onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1} className="flex items-center gap-1.5 bg-gray-700 hover:bg-gray-600 disabled:opacity-30 text-gray-300 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
          {step < TOTAL_STEPS ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && (!form.businessName || !form.ownerName || !form.city)}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button onClick={handleFinish} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors">
              <CheckCircle className="w-4 h-4" /> Create Client
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
