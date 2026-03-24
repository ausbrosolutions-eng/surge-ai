"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FileSignature, Download, Copy, Check, ChevronDown, ChevronUp } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const TEMPLATES = [
  {
    id: "msa",
    label: "Master Service Agreement (MSA)",
    description: "Core contract covering services, payment terms, IP, and termination. Send this to every new client before work begins.",
    badge: "Required",
    badgeColor: "bg-red-500/10 text-red-400",
    sections: ["Services Rendered", "Payment Terms", "Intellectual Property", "Confidentiality", "Termination Clause", "Limitation of Liability"],
    body: (agencyName: string, clientName: string) => `MASTER SERVICE AGREEMENT

This Master Service Agreement ("Agreement") is entered into as of [DATE] between:

Agency: ${agencyName || "Blueprint AI Marketing"} ("Agency")
Client: ${clientName || "[CLIENT BUSINESS NAME]"} ("Client")

1. SERVICES
Agency agrees to provide digital marketing services as outlined in the accompanying Statement of Work (SOW). Specific deliverables, timelines, and fees are defined in the SOW, which is incorporated herein by reference.

2. PAYMENT TERMS
Client agrees to pay the monthly retainer fee on the 1st of each month via ACH, credit card, or wire transfer. A 5-day grace period applies. Accounts more than 10 days past due may be paused without notice. Ad spend budgets are billed separately by the respective platforms (Google, Meta).

3. INTELLECTUAL PROPERTY
All original content, campaigns, and creative assets produced by Agency on Client's behalf are owned by Client upon payment in full for the month in which they were created. Agency retains the right to use anonymized campaign data and performance metrics for case studies and benchmarking.

4. CONFIDENTIALITY
Both parties agree to hold all business information, strategies, and data shared under this Agreement in strict confidence. This obligation survives termination.

5. INITIAL TERM & TERMINATION
This Agreement begins upon execution and carries an initial 90-day commitment period. After 90 days, either party may terminate with 30 days written notice. Termination does not relieve Client of outstanding payment obligations for services rendered.

6. LIMITATION OF LIABILITY
Agency's liability is limited to the fees paid in the 30 days preceding any claim. Agency does not guarantee specific results (leads, revenue, rankings), as digital marketing outcomes depend on market conditions, competition, client responsiveness, and platform changes outside Agency's control.

7. GOVERNING LAW
This Agreement is governed by the laws of [YOUR STATE].

SIGNATURES
Agency: _________________________ Date: _________
${agencyName || "Blueprint AI Marketing"}

Client: _________________________ Date: _________
${clientName || "[CLIENT NAME]"}, ${clientName ? "Authorized Representative" : "[TITLE]"}
`,
  },
  {
    id: "sow-growth",
    label: "Statement of Work — Growth Package",
    description: "Detailed SOW outlining all deliverables, timelines, and KPIs for the Growth package ($3,250/mo).",
    badge: "SOW",
    badgeColor: "bg-blue-500/10 text-blue-400",
    sections: ["Monthly Deliverables", "KPIs & Benchmarks", "Client Responsibilities", "Reporting Cadence"],
    body: (agencyName: string, clientName: string) => `STATEMENT OF WORK — GROWTH PACKAGE

Agency: ${agencyName || "Blueprint AI Marketing"}
Client: ${clientName || "[CLIENT BUSINESS NAME]"}
Package: Growth — $3,250/month
Effective Date: [DATE]

1. MONTHLY DELIVERABLES

Google Business Profile Optimization:
  • Weekly GBP posts (4–5 per month) with seasonal/promotional content
  • Monitor and respond to all new reviews within 24 hours
  • Monthly profile audit and updates (hours, services, photos)

Local SEO:
  • 2 SEO-optimized blog posts per month targeting local keywords
  • Ongoing citation building and NAP consistency audit
  • Schema markup implementation and monitoring
  • Google Search Console monitoring and issue resolution

Google Ads Management:
  • Campaign setup, ad copy, keyword targeting, and bid management
  • Monthly performance review and optimization
  • Negative keyword list maintenance
  • Conversion tracking and call tracking integration

Reputation Management:
  • Review generation system management (automated SMS after job completion)
  • Respond to all reviews on Google, Yelp, and Facebook
  • Monthly reputation score report

Referral Partner Program:
  • Partner outreach and relationship management
  • Referral tracking and payment coordination

2. KEY PERFORMANCE INDICATORS (KPIs)
  • Monthly leads generated (target: 40–80 per month by Month 3)
  • Cost per lead (target: <$100)
  • Google review rating (maintain 4.5+)
  • New reviews per month (target: 4+)
  • GBP profile impressions (track month-over-month growth)

3. CLIENT RESPONSIBILITIES
Client agrees to:
  • Provide access to Google Business Profile, Google Ads, and website within 5 business days of signing
  • Install call tracking code on website within 5 business days
  • Respond to agency requests and approvals within 48 business hours
  • Provide job completion data for review automation triggers
  • Not make changes to campaigns, GBP, or website without coordinating with Agency

4. REPORTING CADENCE
  • Weekly: Email summary of leads, calls, and reviews
  • Monthly: Full KPI report with channel attribution and recommendations
  • Bi-weekly: 30-minute strategy call

5. AD SPEND
Ad spend is billed directly by Google to Client's card on file. Agency fee for management is 15% of monthly spend. Minimum recommended spend: $2,000/month.

AGREED AND ACCEPTED:
Agency: _________________________ Date: _________
Client: _________________________ Date: _________
`,
  },
  {
    id: "sow-domination",
    label: "Statement of Work — Domination Package",
    description: "Full SOW for the Domination package including LSA, social, AI search, and video ($5,500+/mo).",
    badge: "SOW",
    badgeColor: "bg-amber-500/10 text-amber-400",
    sections: ["Full Deliverables List", "AI Search Optimization", "Social Management", "LSA Management", "Video Production"],
    body: (agencyName: string, clientName: string) => `STATEMENT OF WORK — DOMINATION PACKAGE

Agency: ${agencyName || "Blueprint AI Marketing"}
Client: ${clientName || "[CLIENT BUSINESS NAME]"}
Package: Domination — $5,500/month + ad spend
Effective Date: [DATE]

1. MONTHLY DELIVERABLES (includes all Growth deliverables, plus):

Google Local Service Ads (LSA):
  • LSA account setup and Google Screened verification support
  • Weekly bid and budget optimization
  • Lead dispute management (dispute invalid leads)
  • Monthly LSA performance report
  • LSA and GBP integration and review syncing

Social Media Management (3 platforms):
  • Facebook, Instagram, and Nextdoor
  • 12 posts per month (4 per platform)
  • Seasonal and weather-triggered content
  • Comment and message monitoring and response
  • Monthly engagement report

Short-Form Video (1 per month):
  • 60–90 second Reels/TikTok-format video
  • Subject: before/after, educational tip, or team spotlight
  • Captions, hashtags, and platform-optimized export
  • Client provides footage; Agency edits and publishes

AI Search / AEO Optimization:
  • Monthly AI citation audit (ChatGPT, Perplexity, Google AI Overviews)
  • FAQ content optimized for AI Overview inclusion
  • Structured data (schema) for AI readability
  • Bing Places optimization (feeds ChatGPT and Copilot)
  • Monthly AI visibility report

Landing Page CRO:
  • Monthly A/B test on primary landing page
  • CTA optimization and form/call button testing
  • Core Web Vitals monitoring and flagging

Call Tracking & Attribution:
  • CallRail dynamic number insertion (DNI) by traffic source
  • Monthly call quality review
  • Conversion import to Google Ads for smart bidding

Storm/Weather EDDM Campaigns:
  • Deploy within 72 hours of qualifying weather events
  • Design, targeting, and USPS submission handled by Agency
  • Materials cost (~$1,000–$3,000) billed separately as needed

2. CLIENT RESPONSIBILITIES
All responsibilities from Growth SOW apply, plus:
  • Client provides mobile phone footage for monthly video
  • Client approves social media content calendar by the 25th of each month
  • Client installs CallRail tracking code on website

3. REPORTING
  • Weekly: Dashboard access with live lead, call, and review data
  • Monthly: Comprehensive report with all KPIs, channel breakdown, AI visibility, and recommendations
  • Monthly: 45–60 minute strategy call

AGREED AND ACCEPTED:
Agency: _________________________ Date: _________
Client: _________________________ Date: _________
`,
  },
  {
    id: "referral",
    label: "Referral Partner Agreement",
    description: "Simple one-page agreement for plumbers, roofers, HVAC techs, and other trade referral partners.",
    badge: "Partner",
    badgeColor: "bg-emerald-500/10 text-emerald-400",
    sections: ["Referral Terms", "Payment Schedule", "Exclusivity", "Termination"],
    body: (agencyName: string, _: string) => `REFERRAL PARTNER AGREEMENT

This agreement is between ${agencyName || "Blueprint AI Marketing"} ("Agency") and [PARTNER BUSINESS NAME] ("Partner").

PURPOSE
Partner agrees to refer customers in need of home restoration or related services to Agency's clients. In exchange, Agency's client will compensate Partner for qualified referrals as outlined below.

QUALIFIED REFERRAL DEFINITION
A "qualified referral" is a lead that:
  • Is referred directly by Partner (by phone, text, or in person)
  • Results in a signed service agreement with the client
  • Results in at least one completed and paid service

COMPENSATION
  • Standard referral: $150–$300 per qualified referral (amount set by individual client)
  • Emergency/large job referral (>$5,000 project): $300 flat rate
  • Payment is made within 7 business days of the referred customer's first payment

HOW TO REFER
  1. Call or text the client's dedicated referral line: [CLIENT PHONE]
  2. Identify yourself as a referral partner
  3. Provide customer name, contact info, and brief description of the situation
  4. Agency's client will handle everything from there

TRACKING
All referrals will be tracked by date, referring partner, and job outcome. Partner will receive a monthly summary of their referrals and any pending payments.

TERM & TERMINATION
This agreement is month-to-month and may be terminated by either party with 7 days written notice. Earned referral fees for completed jobs before termination will be paid per normal schedule.

SIGNATURES
Agency/Client Representative: _________________________ Date: _________

Partner Representative: _________________________ Date: _________
[Partner Business Name]
`,
  },
];

export default function ContractsPage() {
  const [agencyName, setAgencyName] = useState("Blueprint AI Marketing");
  const [clientName, setClientName] = useState("");
  const [expanded, setExpanded] = useState<string | null>("msa");
  const [copied, setCopied] = useState<string | null>(null);

  function copyTemplate(id: string, body: string) {
    navigator.clipboard.writeText(body);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  }

  function downloadTemplate(id: string, label: string, body: string) {
    const blob = new Blob([body], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${label.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Contracts & SOW Templates" />
      <main className="flex-1 p-6 space-y-6 max-w-4xl mx-auto w-full">

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-300 font-medium mb-1">⚡ How to use these templates</p>
          <p className="text-sm text-gray-400">
            Fill in your agency name and client name below, then copy or download any template. These are plain-text drafts — paste into Google Docs for final formatting, then use DocuSign, HelloSign, or PandaDoc for e-signatures.
          </p>
        </div>

        {/* Global fill-ins */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-3">Auto-fill Variables</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 block mb-1">Your Agency Name</label>
              <input
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 block mb-1">Client Business Name</label>
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Rehab Restoration"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-3">
          {TEMPLATES.map((tmpl, i) => {
            const body = tmpl.body(agencyName, clientName);
            const isOpen = expanded === tmpl.id;
            return (
              <motion.div
                key={tmpl.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
              >
                <div
                  onClick={() => setExpanded(isOpen ? null : tmpl.id)}
                  className="w-full flex items-center gap-4 p-5 text-left cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <FileSignature className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-white">{tmpl.label}</p>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${tmpl.badgeColor}`}>
                        {tmpl.badge}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{tmpl.description}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => copyTemplate(tmpl.id, body)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white border border-gray-700 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      {copied === tmpl.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      {copied === tmpl.id ? "Copied!" : "Copy"}
                    </button>
                    <button
                      onClick={() => downloadTemplate(tmpl.id, tmpl.label, body)}
                      className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 border border-blue-500/30 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                  {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />}
                </div>

                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tmpl.sections.map((s) => (
                        <span key={s} className="text-xs text-gray-400 bg-gray-900 border border-gray-700 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <pre className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed font-mono overflow-auto max-h-96">
                      {body}
                    </pre>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Recommended e-signature tools */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <p className="text-sm font-semibold text-white mb-3">Recommended E-Signature Tools</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { name: "DocuSign", price: "~$15/mo", note: "Industry standard. Most clients recognize it." },
              { name: "HelloSign (Dropbox Sign)", price: "~$15/mo", note: "Clean UI. Easy to use for non-technical clients." },
              { name: "PandaDoc", price: "~$35/mo", note: "Best for proposals + contracts in one. Highly recommended." },
            ].map((tool) => (
              <div key={tool.name} className="bg-gray-900 rounded-lg border border-gray-700 p-3">
                <p className="text-sm font-medium text-white mb-0.5">{tool.name}</p>
                <p className="text-xs text-blue-400 mb-1">{tool.price}</p>
                <p className="text-xs text-gray-500">{tool.note}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
