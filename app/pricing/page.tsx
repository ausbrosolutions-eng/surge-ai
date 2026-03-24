import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Check, Zap, ArrowRight } from "lucide-react";

const packages = [
  {
    name: "Foundation",
    price: "$1,250",
    period: "/month",
    tagline: "Get found. Get reviewed. Get calls.",
    description: "The essential setup for home service businesses ready to start generating local leads from Google.",
    color: "border-gray-700",
    cta: "Start with Foundation",
    ctaStyle: "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700",
    popular: false,
    deliverables: [
      "Google Business Profile setup & full optimization",
      "NAP audit + citation cleanup (Tier 1 directories)",
      "Review request system setup (SMS automation)",
      "4 Google Business Profile posts per month",
      "Monthly performance report",
      "Dedicated account manager",
      "Competitor landscape snapshot",
    ],
    results: "Typical result: Map Pack visibility improvements within 60 days, 1–2 new reviews per week",
  },
  {
    name: "Growth",
    price: "$3,250",
    period: "/month",
    tagline: "Dominate local search. Build the referral engine.",
    description: "Full local SEO + paid ads + reputation management for businesses ready to scale to 7-figures.",
    color: "border-blue-500",
    cta: "Start with Growth",
    ctaStyle: "bg-blue-600 hover:bg-blue-700 text-white",
    popular: true,
    deliverables: [
      "Everything in Foundation",
      "Full local SEO (on-page, citations, schema markup)",
      "2 SEO blog posts per month",
      "Google Ads campaign management (ad spend billed separately)",
      "Reputation management — monitor & respond to all reviews",
      "Referral partner program launch (plumbers, HVAC, roofers)",
      "Bi-weekly strategy calls",
      "Real-time KPI dashboard access",
    ],
    results: "Typical result: 40–80 qualified leads per month within 90 days, 30–50% lead-to-booked rate",
  },
  {
    name: "Domination",
    price: "$5,500",
    period: "/month + ad spend",
    tagline: "Own the market. Run while you sleep.",
    description: "The complete AI-powered marketing system for home service companies targeting $5M–$20M+ in revenue.",
    color: "border-amber-500",
    cta: "Apply for Domination",
    ctaStyle: "bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold",
    popular: false,
    deliverables: [
      "Everything in Growth",
      "Google Local Service Ads setup & management",
      "Social media management (3 platforms, 12 posts/month)",
      "1 short-form video produced per month",
      "Landing page conversion rate optimization",
      "Call tracking + full attribution reporting",
      "AI Search / AEO optimization (ChatGPT, Perplexity, Google AI Overviews)",
      "Weekly dashboard access + monthly strategy call",
      "Storm/weather EDDM campaign activation",
      "Quarterly competitive intelligence report",
    ],
    results: "Typical result: Market dominance in primary service area within 6 months, 4:1+ ROAS on paid channels",
  },
];

const addons = [
  { name: "Google LSA Setup", price: "$500", note: "One-time" },
  { name: "Website Build / Redesign", price: "$3,500", note: "One-time" },
  { name: "Extra SEO Blog Post", price: "$350", note: "Per post" },
  { name: "Short-Form Video", price: "$400", note: "Per video" },
  { name: "Storm EDDM Campaign", price: "$1,200", note: "Per deployment" },
  { name: "AI Search / AEO Audit", price: "$750", note: "One-time" },
  { name: "GoHighLevel CRM Setup", price: "$1,500", note: "One-time" },
  { name: "Competitor Intelligence Report", price: "$500", note: "One-time" },
];

const faqs = [
  {
    q: "Do I have to sign a long-term contract?",
    a: "We offer month-to-month agreements after a 90-day initial commitment. Most clients stay 12–24+ months because results compound over time. We don't believe in locking you in — we believe in earning your business every month.",
  },
  {
    q: "Is ad spend included in the monthly price?",
    a: "Ad spend (what you pay Google directly) is billed separately from our management fee. We charge 15% of monthly ad spend as our management fee, with a minimum $1,000 ad spend to apply. This keeps our incentives aligned with your results.",
  },
  {
    q: "How quickly will I see results?",
    a: "LSA and Google Ads can generate leads within the first 2–4 weeks. GBP optimization typically shows measurable improvement in map pack visibility within 60–90 days. SEO compounds over 6–12 months. We deliver quick wins in month 1 and build compounding returns over time.",
  },
  {
    q: "Do you work with businesses outside the home service industry?",
    a: "We exclusively serve home service businesses — HVAC, plumbing, roofing, electrical, restoration, landscaping, pest control, and related trades. This specialization means we know your customer, your seasonality, and your competitive landscape better than any generalist agency.",
  },
  {
    q: "What makes Blueprint AI Marketing different?",
    a: "Three things: (1) We exclusively serve home service businesses — this isn't a side niche, it's everything we do. (2) We are 3–5 years ahead on AI search optimization — getting your business cited in ChatGPT and Google AI Overviews while your competitors don't know it exists. (3) Full transparency — you see every lead, every call, every dollar spent, every result, in real time.",
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 px-4 text-center">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full mb-6">
          <Zap className="w-3.5 h-3.5" />
          Transparent pricing. No surprises.
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white max-w-2xl mx-auto leading-tight mb-4">
          Invest in a System That <span className="text-blue-400">Generates Leads While You Work</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-xl mx-auto mb-8">
          Every package is built specifically for home service businesses. No bloated retainers. No fluff. Just a direct line to more calls and booked jobs.
        </p>
        <p className="text-sm text-gray-500">
          All packages include a dedicated account manager and monthly reporting.
          <span className="text-gray-400 ml-1">Ad spend billed separately.</span>
        </p>
      </section>

      {/* Packages */}
      <section className="pb-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-2xl border bg-gray-900 p-7 flex flex-col ${pkg.color} ${pkg.popular ? "shadow-2xl shadow-blue-500/10 scale-[1.02]" : ""}`}
            >
              {pkg.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{pkg.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-bold text-white">{pkg.price}</span>
                  <span className="text-sm text-gray-500 pb-1">{pkg.period}</span>
                </div>
                <p className="text-sm font-medium text-blue-400 mb-2">{pkg.tagline}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{pkg.description}</p>
              </div>

              <div className="flex-1 space-y-2.5 mb-6">
                {pkg.deliverables.map((d, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-300">{d}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-800/50 rounded-lg p-3 mb-5">
                <p className="text-xs text-emerald-400 leading-relaxed">{pkg.results}</p>
              </div>

              <a
                href="#contact"
                className={`w-full text-center py-3 px-5 rounded-xl text-sm font-semibold transition-colors ${pkg.ctaStyle}`}
              >
                {pkg.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16 px-4 bg-gray-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-2">Add-Ons & One-Time Services</h2>
          <p className="text-gray-400 text-center text-sm mb-10">Available to any active client. Mix and match.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {addons.map((addon) => (
              <div key={addon.name} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
                <p className="text-sm font-medium text-white mb-1">{addon.name}</p>
                <p className="text-xs text-gray-500 mb-3">{addon.note}</p>
                <p className="text-lg font-bold text-blue-400">{addon.price}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <p className="text-sm font-semibold text-white mb-2">{faq.q}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="py-20 px-4 bg-blue-600">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Build a Lead Generation Machine?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Book a free 30-minute strategy call. We&apos;ll audit your current presence and show you exactly where your next $100K in revenue is hiding.
          </p>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold py-4 px-8 rounded-xl text-sm hover:bg-blue-50 transition-colors"
          >
            Book Free Strategy Call
            <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-blue-200 text-xs mt-4">No commitment. No sales pressure. Just a free audit and a clear plan.</p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
