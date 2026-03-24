"use client";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Star,
  TrendingUp,
  MessageSquare,
  DollarSign,
  MapPin,
  Bot,
  Shield,
  Phone,
  Calendar,
  ExternalLink,
  Zap,
  Target,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatusBadge from "@/components/dashboard/StatusBadge";

// ── Types ─────────────────────────────────────────────────────
interface Article {
  id: string;
  category: string;
  title: string;
  tags: string[];
  content: React.ReactNode;
}

// ── Copy Button ───────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded-md transition-colors ml-2"
    >
      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

// ── Data Table ────────────────────────────────────────────────
function DataTable({ headers, rows }: { headers: string[]; rows: (string | React.ReactNode)[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700 mt-3">
      <table className="w-full text-xs">
        <thead className="bg-gray-800/80">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="text-left text-gray-400 font-semibold px-3 py-2.5 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700/50">
          {rows.map((row, i) => (
            <tr key={i} className="bg-gray-900/30 hover:bg-gray-800/40 transition-colors">
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-gray-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Template Block ────────────────────────────────────────────
function TemplateBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-gray-900 border border-gray-600 rounded-xl p-4 mt-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{title}</span>
        <CopyButton text={text} />
      </div>
      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{text}</p>
    </div>
  );
}

// ── Tip Block ─────────────────────────────────────────────────
function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 bg-blue-500/5 border border-blue-500/20 rounded-lg p-3 mt-3">
      <Zap className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-blue-300 leading-relaxed">{children}</p>
    </div>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 bg-amber-500/5 border border-amber-500/20 rounded-lg p-3 mt-3">
      <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-amber-300 leading-relaxed">{children}</p>
    </div>
  );
}

// ── Articles ──────────────────────────────────────────────────
const articles: Article[] = [
  // ── GBP & LSA Quick Reference
  {
    id: "gbp-ranking",
    category: "GBP & LSA",
    title: "GBP Optimization Quick Reference",
    tags: ["gbp", "google", "maps", "optimization"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Google Business Profile is the highest-ROI free asset for home service businesses. 68% of local consumers contact a
          business directly from GBP without visiting the website.
        </p>
        <DataTable
          headers={["Element", "Requirement", "Priority"]}
          rows={[
            ["Business Name", "Exact legal name — NO keyword stuffing", <StatusBadge key="r1" variant="critical" />],
            ["Primary Category", "Highest-revenue service (e.g., 'Plumber')", <StatusBadge key="r2" variant="critical" />],
            ["Description", "750 chars with natural keywords", <StatusBadge key="r3" variant="high" />],
            ["Photos", "10+ at launch, add 1–2/month", <StatusBadge key="r4" variant="critical" />],
            ["Posts", "1–2/week — 30+ day gap = ranking drop", <StatusBadge key="r5" variant="critical" />],
            ["Q&A", "Pre-seed with 10+ FAQs", <StatusBadge key="r6" variant="high" />],
            ["Hours", "Keep current including holiday hours", <StatusBadge key="r7" variant="high" />],
            ["Services", "All services listed with descriptions", <StatusBadge key="r8" variant="medium" />],
          ]}
        />
        <Tip>
          Photos generate 45% more direction requests and 31% more website clicks. Team photos and before/after shots outperform
          generic stock images every time.
        </Tip>
        <Warning>
          2025 Alert: No posts or photos for 30+ days causes significant ranking drops. Set up a weekly posting schedule on day one.
        </Warning>
      </div>
    ),
  },
  {
    id: "lsa-ranking",
    category: "GBP & LSA",
    title: "LSA Ranking Factors & Optimization",
    tags: ["lsa", "local service ads", "pay per lead", "google"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          LSAs appear above ALL Google Ads and organic results. Pay-per-lead model at $20–$150+ per lead. Google Verified badge
          requires background check, license verification, and insurance.
        </p>
        <DataTable
          headers={["Rank Factor", "Target", "Notes"]}
          rows={[
            ["Review Score", "4.8+ stars", "Single most important factor"],
            ["Review Recency", "New reviews weekly", "Consistency matters more than volume spikes"],
            ["Response Rate", "Answer all calls within 1 min", "Google tracks response time"],
            ["Profile Completeness", "100%", "All categories, services, photos, hours"],
            ["Booking Rate", "80%+", "Mark every lead as booked/not booked"],
            ["Service Area", "Tight geo focus", "Start tight, expand as budget grows"],
            ["GBP Integration", "Fully linked", "Sync reviews between GBP and LSA"],
          ]}
        />
        <div className="mt-3 space-y-2">
          <p className="text-xs font-semibold text-gray-300">Bidding Strategy</p>
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 text-xs text-gray-400 space-y-1">
            <p>✅ Use <span className="text-white font-medium">Maximize Leads</span> bidding (NOT Max Per Lead)</p>
            <p>✅ Enable all lead types: calls, messages, direct booking</p>
            <p>✅ Dispute invalid leads promptly (wrong number, out of area, duplicates)</p>
            <p>✅ Add seasonal budget increases proactively (30 days before peak)</p>
          </div>
        </div>
        <Tip>
          2025 Policy: Google updated TOS to claim ownership of advertiser content in LSAs, including the right to record and
          analyze phone calls. Inform clients of this change.
        </Tip>
      </div>
    ),
  },

  // ── Local SEO Playbook
  {
    id: "citation-tiers",
    category: "Local SEO",
    title: "Citation Building — 3-Tier Strategy",
    tags: ["citations", "nap", "directories", "local seo"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Target 40+ authoritative citations minimum. Top performers have 80–100+. Every listing must use IDENTICAL NAP formatting —
          "Ave" vs "Avenue" can split your entity signal.
        </p>
        <DataTable
          headers={["Tier", "Platforms", "Build Order"]}
          rows={[
            [
              "Tier 1 — Core",
              "Google Business Profile, Bing Places, Apple Maps, Yelp, BBB, Yellow Pages, Facebook, Foursquare, Nextdoor",
              "Week 1",
            ],
            [
              "Tier 2 — Home Service",
              "Angi, HomeAdvisor, Houzz, Thumbtack, Porch, BuildZoom, Networx",
              "Week 2–3",
            ],
            [
              "Tier 3 — Trade-Specific",
              "PHCC, NRCA, NALP, NECA, manufacturer dealer pages, Chamber of Commerce",
              "Month 2+",
            ],
            [
              "Data Aggregators",
              "Data Axle, Neustar Localeze, Foursquare, Factual — distribute to hundreds automatically",
              "Week 1 (submit first)",
            ],
          ]}
        />
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 mt-3">
          <p className="text-xs font-semibold text-gray-300 mb-2">Tools for Citation Management</p>
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
            <div>
              <p className="text-white font-medium">BrightLocal</p>
              <p>Best all-in-one for agencies</p>
            </div>
            <div>
              <p className="text-white font-medium">Whitespark</p>
              <p>Citation finder + tracker</p>
            </div>
            <div>
              <p className="text-white font-medium">Moz Local</p>
              <p>Citation management</p>
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "service-area-pages",
    category: "Local SEO",
    title: "Service Area Pages — Complete Guide",
    tags: ["service area pages", "local seo", "content", "ranking"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          One unique page per major city/service area. Must have genuinely unique content — NOT copy-paste with city name swapped.
          Target: 500–800+ words for standard markets, 1,000+ for competitive metros.
        </p>
        <DataTable
          headers={["Element", "Requirement"]}
          rows={[
            ["URL Structure", "/plumber-dallas-tx/ or /hvac-repair-fort-worth/"],
            ["Content", "Unique per page — local landmarks, neighborhoods, local reviews"],
            ["Embedded Map", "Google Map of service area"],
            ["Schema", "LocalBusiness + Service schema on every page"],
            ["Internal Links", "Link to individual service pages"],
            ["CTA", "Phone number + booking CTA above the fold"],
          ]}
        />
        <Tip>
          AI Overviews favor pages with clear "direct answer capsules" — 40–60 word summaries at the top of each section that
          directly answer a specific question.
        </Tip>
      </div>
    ),
  },
  {
    id: "schema-markup",
    category: "Local SEO",
    title: "Schema Markup Cheat Sheet",
    tags: ["schema", "structured data", "json-ld", "rich results"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Schema markup helps Google and AI search engines understand your business entity. Use JSON-LD format. Validate with
          Google&apos;s Rich Results Test monthly.
        </p>
        <DataTable
          headers={["Schema Type", "Where to Use", "Impact"]}
          rows={[
            ["LocalBusiness", "Homepage, all pages", "Core entity signal"],
            ["Service", "Individual service pages", "Rich results in search"],
            ["FAQPage", "FAQ sections", "AI Overview citations, rich results"],
            ["HowTo", "Educational content", "Featured snippets"],
            ["AggregateRating", "Pages with review data", "Star ratings in SERPs"],
            ["BreadcrumbList", "All pages", "Navigation in search results"],
          ]}
        />
        <TemplateBlock
          title="LocalBusiness Schema Example"
          text={`{
  "@context": "https://schema.org",
  "@type": "Plumber",
  "name": "ABC Plumbing",
  "telephone": "+1-555-123-4567",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main St",
    "addressLocality": "Denver",
    "addressRegion": "CO",
    "postalCode": "80201"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 39.7392,
    "longitude": -104.9903
  },
  "openingHours": "Mo-Su 00:00-23:59",
  "areaServed": ["Denver", "Aurora", "Lakewood"],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "127"
  }
}`}
        />
      </div>
    ),
  },

  // ── AI Search Guide
  {
    id: "ai-search-overview",
    category: "AI Search (AEO)",
    title: "AI Search — The 2025–2026 Landscape",
    tags: ["ai search", "chatgpt", "perplexity", "google ai overviews", "aeo", "geo"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          AI referral traffic grew 357% year-over-year, reaching 1.13B visits in June 2025. AI Overview traffic converts at 14.2%
          — 5x traditional organic&apos;s 2.8%.
        </p>
        <DataTable
          headers={["Platform", "Traffic Share", "Data Sources", "Key Action"]}
          rows={[
            ["ChatGPT", "87.4% of AI referrals", "Bing index, Yelp, BBB, Angi", "Optimize Bing Places"],
            ["Google AI Overviews", "50–60% of US searches", "Google index, GBP", "FAQPage schema + direct answer capsules"],
            ["Perplexity", "6–10x higher CTR", "Web, Bing, direct sources", "Build citations on authority sites"],
            ["Microsoft Copilot", "1.4B MS ecosystem users", "Bing + Bing Places amenities", "Fill all Bing Places fields"],
            ["Claude (Anthropic)", "Growing enterprise", "Yelp, BBB, Angi, local press", "NAP consistency + authority directories"],
          ]}
        />
        <Tip>
          Submit to Bing Places for Business (bing.com/forbusiness) — redesigned Oct 2025. It&apos;s less saturated than Google
          and feeds ChatGPT, Copilot, and Perplexity simultaneously.
        </Tip>
      </div>
    ),
  },
  {
    id: "eeat-guide",
    category: "AI Search (AEO)",
    title: "E-E-A-T Implementation Guide",
    tags: ["eeat", "experience", "expertise", "authority", "trust", "ai search"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is how Google and AI search engines evaluate content
          quality. Critical for ranking in both traditional and AI search.
        </p>
        <DataTable
          headers={["Pillar", "Signals", "Home Service Examples"]}
          rows={[
            [
              "Experience",
              "First-hand content, before/after photos, case studies",
              "Owner blog posts, job photos, video of work being performed",
            ],
            [
              "Expertise",
              "Trade certifications, author bios, technical content",
              "NATE, EPA 608, licensed electrician displayed prominently",
            ],
            [
              "Authoritativeness",
              "Backlinks from news/trade pubs, directory presence",
              "Local news coverage, Chamber of Commerce, PHCC listing",
            ],
            [
              "Trustworthiness",
              "Consistent NAP, reviews, SSL, physical address",
              "BBB accreditation, 100% review responses, license numbers visible",
            ],
          ]}
        />
      </div>
    ),
  },

  // ── PPC Benchmarks & Strategy
  {
    id: "ppc-benchmarks",
    category: "PPC & Ads",
    title: "Google Ads Benchmarks — Home Services 2025",
    tags: ["google ads", "ppc", "benchmarks", "cpc", "ctr", "roas"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          2025 industry benchmarks for home service Google Ads campaigns. Use these to set client expectations and identify
          underperforming campaigns.
        </p>
        <DataTable
          headers={["Metric", "Industry Average", "Top Performer", "Your Target"]}
          rows={[
            ["CTR", "6.37%", "8%+", "6%+"],
            ["Average CPC", "$7.85", "< $6", "< $10"],
            ["Electrician CPC", "$12.18", "< $10", "< $15"],
            ["Painter CPC", "$13.74", "< $11", "< $16"],
            ["Roofer CPC", "$10.70", "< $8", "< $13"],
            ["Cost Per Lead", "$75–$200", "< $75", "< $150"],
            ["ROAS", "2:1", "4:1+", "3:1 minimum"],
            ["Lead-to-Booked", "30–50%", "60–80%", "50%+"],
          ]}
        />
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 mt-3">
          <p className="text-xs font-semibold text-gray-300 mb-2">Smart Bidding Progression</p>
          <div className="space-y-1 text-xs text-gray-400">
            <p>📅 Days 1–30: <span className="text-white">Maximize Conversions</span> — let Google learn</p>
            <p>📅 30+ conversions/month: Switch to <span className="text-white">Target CPA</span> at 150% of desired CPL</p>
            <p>📅 Ongoing: Tighten Target CPA quarterly as data improves</p>
          </div>
        </div>
        <DataTable
          headers={["Budget Level", "Market Size", "Monthly Budget"]}
          rows={[
            ["Starter", "< 100K population", "$800–$2,000/month"],
            ["Mid-size", "100K–500K population", "$2,000–$6,000/month"],
            ["Metro", "500K+ population", "$5,000–$20,000+/month"],
          ]}
        />
        <Tip>
          Emergency keywords ("emergency plumber near me", "24 hour electrician") convert 3–5x higher than planned service
          keywords. Allocate 30–40% of budget to emergency terms.
        </Tip>
      </div>
    ),
  },
  {
    id: "negative-keywords",
    category: "PPC & Ads",
    title: "Negative Keyword Master List",
    tags: ["google ads", "ppc", "negative keywords", "optimization"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Add these immediately on campaign launch to prevent wasted spend on irrelevant searches.
        </p>
        <TemplateBlock
          title="Negative Keywords — Add Immediately"
          text="DIY, jobs, careers, training, free, how to, YouTube, Reddit, school, certification, parts, supply, wholesale, warranty claim, license course, home depot, lowes, amazon, kit, manual, tutorial, instructions, diagram, cost to become, apprentice, apprenticeship, exam, test prep"
        />
        <DataTable
          headers={["Category", "Keywords to Add"]}
          rows={[
            ["Job Seekers", "jobs, careers, hiring, employment, apply, resume"],
            ["DIY / No Intent", "DIY, how to, tutorial, instructions, manual, diagram"],
            ["Parts / Supply", "parts, supply, wholesale, materials, tools, equipment"],
            ["Education", "school, certification, training, license course, exam"],
            ["Competitors (if budget limited)", "Individual competitor brand names"],
          ]}
        />
      </div>
    ),
  },

  // ── Reputation Scripts & Templates
  {
    id: "review-templates",
    category: "Reputation",
    title: "Review Request Scripts & Templates",
    tags: ["reviews", "reputation", "templates", "scripts", "sms"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          88% of consumers read Google reviews before contacting a local business. Send review requests within 2 hours of job
          completion for highest conversion. Target: 1–2 new reviews per week per location.
        </p>
        <TemplateBlock
          title="Technician Verbal Script"
          text="Before I leave, I just wanted to ask — would you mind leaving us a quick Google review? It really helps our small business and only takes 30 seconds. I can send you the direct link right now."
        />
        <TemplateBlock
          title="SMS Template (Send Within 2 Hours)"
          text="Hi [Name]! Thanks for trusting [Business Name] today. If you were happy with [Technician]'s work, would you mind leaving us a quick Google review? It only takes 30 seconds and means the world to us. Here's the direct link: [GOOGLE_REVIEW_LINK]

Reply STOP to opt out."
        />
        <TemplateBlock
          title="Email Follow-Up (48 Hours If No Review)"
          text="Subject: How did we do, [Name]?

Hi [Name],

Thank you for choosing [Business Name] for your [Service] needs. We hope everything is working perfectly!

We'd love to hear about your experience. A quick Google review helps other homeowners in [City] find reliable service — and it takes less than a minute.

Leave a review here: [GOOGLE_REVIEW_LINK]

Thank you,
[Owner Name]
[Business Name] | [Phone]"
        />
        <Tip>
          Automate review requests with Podium, Birdeye, or NiceJob. Connect to your field service CRM (Jobber, HouseCall Pro,
          ServiceTitan) to trigger automatically on job completion.
        </Tip>
      </div>
    ),
  },
  {
    id: "negative-review-response",
    category: "Reputation",
    title: "Negative Review Response Framework",
    tags: ["reviews", "reputation", "negative reviews", "response templates"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          88% of consumers prefer businesses that respond to ALL reviews. Never argue or be defensive. The goal is to show future
          customers you care, not to win the argument.
        </p>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3">
          <p className="text-xs font-semibold text-gray-300 mb-2">5-Step Response Framework</p>
          <div className="space-y-1.5 text-xs text-gray-400">
            <p>1. <span className="text-white">Acknowledge</span> the issue without admitting fault</p>
            <p>2. <span className="text-white">Apologize</span> for the experience</p>
            <p>3. <span className="text-white">Take offline:</span> "Please call our manager at [phone]"</p>
            <p>4. <span className="text-white">Keep it short:</span> under 100 words</p>
            <p>5. <span className="text-white">Never</span> argue or be defensive in public</p>
          </div>
        </div>
        <TemplateBlock
          title="Universal Negative Review Response"
          text="Thank you for sharing your experience, [Name]. We're sorry to hear this didn't meet your expectations — this isn't the standard we hold ourselves to. We take all feedback seriously and would very much like to make this right. Please reach out to our customer service manager directly at [phone] so we can address this personally."
        />
        <TemplateBlock
          title="For Service Quality Complaints"
          text="[Name], thank you for taking the time to share this feedback. We're genuinely sorry the work didn't meet your expectations. Our team strives to deliver [X-star] service on every visit. Please call us at [phone] — we'd like to send a technician back out at no charge to make this right."
        />
        <Warning>
          Do NOT offer discounts or refunds publicly in review responses — this can encourage future bad-faith reviews. Handle all
          compensation conversations offline.
        </Warning>
      </div>
    ),
  },

  // ── Client Communication Templates
  {
    id: "monthly-report-email",
    category: "Client Communication",
    title: "Monthly Report Email Template",
    tags: ["reporting", "client communication", "templates", "monthly report"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Send a brief monthly email summarizing results before the full report call. Keep it scannable with bullet points and
          highlight wins prominently.
        </p>
        <TemplateBlock
          title="Monthly Results Email"
          text={`Subject: [Client Name] — [Month] Marketing Results 🎯

Hi [Name],

Here's your [Month] marketing summary for [Business Name]:

📞 LEADS & CALLS
• Total tracked calls: [X] (+X% vs last month)
• New leads generated: [X]
• Booked jobs from leads: [X] ([X]% booking rate)

⭐ REVIEWS & REPUTATION
• New Google reviews: [X] (now [total] reviews, [rating]★)
• Average rating: [X.X] stars

📍 GOOGLE VISIBILITY
• GBP: [X] profile views, [X] direction requests, [X] calls
• Map Pack ranking: [position] for "[keyword]" in [city]

📈 WEBSITE & ADS
• Website visitors: [X]
• Ad spend: $[X] | Leads: [X] | Cost per lead: $[X]

🏆 WINS THIS MONTH
• [Achievement 1]
• [Achievement 2]

📋 NEXT MONTH PRIORITIES
• [Priority 1]
• [Priority 2]

Full report + video walkthrough: [LINK]

Talk soon,
[Your Name]`}
        />
      </div>
    ),
  },
  {
    id: "kickoff-email",
    category: "Client Communication",
    title: "Client Kickoff Email & Access Request",
    tags: ["onboarding", "kickoff", "access", "client communication"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Send within 24 hours of contract signing. Clear access requests prevent onboarding delays — be specific about exactly
          what you need and why.
        </p>
        <TemplateBlock
          title="Welcome & Access Request Email"
          text={`Subject: Welcome to [Agency Name]! Here's what we need to get started 🚀

Hi [Name],

Welcome aboard! We're excited to start growing [Business Name].

To hit the ground running, we need access to a few tools. Can you set these up in the next 24–48 hours?

REQUIRED ACCESS:
1. Google Business Profile — Add [email@youragency.com] as Manager at business.google.com/manage
2. Google Ads — Share account access (Customer ID: [we'll provide])
3. Google Analytics 4 — Add as Editor in Admin > Account Access
4. Website — Either login credentials or create a user for [email]
5. CallRail (if you have it) — We'll set up call tracking

OPTIONAL BUT HELPFUL:
• Facebook Business Manager access
• Yelp Business account login
• Any review platform logins

I'll send you a Loom video showing exactly how to do each one if helpful.

Our kickoff call is scheduled for [DATE] at [TIME]. We'll cover:
• Your ideal customer profile
• Seasonal patterns in your business
• Top competitors you're watching
• 30/60/90 day goals

See you then!

[Your Name]`}
        />
      </div>
    ),
  },

  // ── Pricing & Objection Handling
  {
    id: "pricing-guide",
    category: "Pricing & Sales",
    title: "Pricing Tiers & Value Justification",
    tags: ["pricing", "sales", "packages", "retainer", "value"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Monthly retainers generate 30–50% higher agency margins than project work. Price on value delivered, not hours worked.
        </p>
        <DataTable
          headers={["Package", "Price", "Key Deliverables", "Best For"]}
          rows={[
            [
              "Foundation",
              "$1,000–$1,500/mo",
              "GBP optimization, citation audit, review system, 4 GBP posts/mo, monthly report",
              "New clients, owner-operators 1–3 trucks",
            ],
            [
              "Growth",
              "$2,500–$4,000/mo",
              "Everything + full local SEO, 2 blog posts/mo, reputation management, Google Ads management (ad spend extra), bi-weekly calls",
              "Established businesses, 5–15 techs",
            ],
            [
              "Domination",
              "$4,000–$8,000+/mo",
              "Everything + LSA management, social media (3 platforms, 12 posts/mo), video content, landing page CRO, call tracking, weekly dashboard",
              "Market leaders, 15+ techs",
            ],
          ]}
        />
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 mt-3">
          <p className="text-xs font-semibold text-gray-300 mb-2">Value Justification Framework</p>
          <div className="space-y-1 text-xs text-gray-400">
            <p>• Average HVAC job: $400–$800. If we generate 10 extra jobs/month = $4,000–$8,000 extra revenue</p>
            <p>• Average plumbing job: $300–$600. 15 extra calls = $4,500–$9,000 extra revenue</p>
            <p>• Roofing: Average job $8,000–$15,000. Even 1–2 extra jobs/month = massive ROI</p>
            <p>• At a 3:1 ROAS, a $2,500/month client should see $7,500+ in new revenue</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "objection-handling",
    category: "Pricing & Sales",
    title: "Common Objections & Responses",
    tags: ["sales", "objections", "pricing", "closing"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Home service business owners are skeptical of marketing agencies — they&apos;ve often been burned before. Address these objections head-on.
        </p>
        {[
          {
            objection: '"We tried SEO before and it didn\'t work"',
            response:
              "I hear that a lot — and usually it's because the previous agency did generic SEO instead of local SEO optimized specifically for your service area. The strategies that rank a plumber in Denver are completely different from ranking a software company. Can I show you where you currently rank on Google Maps vs. your top 3 competitors? It'll take 2 minutes and you'll immediately see the opportunity.",
          },
          {
            objection: '"I get most of my business from referrals"',
            response:
              "That's actually a huge advantage — it tells me your service quality is excellent, which is the hardest part. Referrals are great, but they're unpredictable. What we do is build a digital presence that generates leads while you sleep, so you're not dependent on word-of-mouth alone. Referral clients who Google you before calling expect to see great reviews and a strong presence — we make sure that's what they find.",
          },
          {
            objection: '"That\'s too expensive"',
            response:
              "I understand — it's a real investment. Let me flip it: if we generate just [X] extra jobs per month, what would that be worth to you? [Listen]. So at $2,500/month, we need to generate about [do the math] in new revenue to break even. Our average client at this package generates [X] in the first 90 days. Would it make sense to start with our Foundation package at $1,500 and upgrade once you see the results?",
          },
          {
            objection: '"I need to think about it"',
            response:
              "Of course — this is an important decision. Can I ask what specifically you need to think through? [Listen]. Often when I hear 'I need to think about it', there's a specific concern that I haven't addressed well enough. What would make this feel like a no-brainer for you?",
          },
          {
            objection: '"We already have someone doing our marketing"',
            response:
              "That's great! I'm not looking to replace them if they're getting you results. Can I ask — how are you measuring what they're doing? Do you know what your cost per lead is from digital marketing right now? I'd love to do a free audit and either validate that your current setup is working well, or show you where there might be gaps. Either way you'll have better data.",
          },
        ].map((item, i) => (
          <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-semibold text-amber-400 mb-2">{item.objection}</p>
            <p className="text-sm text-gray-300 leading-relaxed">{item.response}</p>
          </div>
        ))}
      </div>
    ),
  },

  // ── Seasonal Calendar
  {
    id: "seasonal-calendar",
    category: "Seasonal Strategy",
    title: "Home Service Seasonal Marketing Calendar",
    tags: ["seasonal", "calendar", "content", "timing", "campaigns"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Seasonal patterns are massive in home services. Plan campaigns 30 days before peak season. Budget increases should be in
          Google Ads 2 weeks before peak demand.
        </p>
        <DataTable
          headers={["Month", "Hot Services", "Key Campaign Themes"]}
          rows={[
            ["January", "Furnace repair, plumbing (frozen pipes)", "Emergency heating, winter pipe protection"],
            ["February", "HVAC tune-ups, insulation", "Prepare for spring, energy savings"],
            ["March", "AC tune-ups, roofing inspection", "Spring prep, storm damage from winter"],
            ["April", "AC installation, gutters, landscaping", "Spring cleaning, AC readiness, post-storm roofing"],
            ["May", "AC, landscaping, pest control", "Cooling season kickoff, outdoor projects"],
            ["June–August", "AC emergency, electrical, pest control", "Emergency cooling, summer projects, peak demand"],
            ["September", "Furnace tune-ups, roofing", "Fall prep — furnace service before winter"],
            ["October", "Furnace service, insulation, weatherization", "Winter readiness — highest urgency messaging"],
            ["November", "Emergency heating, plumbing winterization", "Pre-holiday urgent service, pipe insulation"],
            ["December", "Emergency services, electrical", "Holiday lighting, emergency only (slow for non-emergency)"],
          ]}
        />
        <Tip>
          GBP posts and Google Ads campaigns should align with seasonal themes. A furnace tune-up post in October gets 3–5x more
          engagement than the same post in July. Set calendar reminders 6 weeks before each seasonal shift.
        </Tip>
      </div>
    ),
  },
  {
    id: "kpi-benchmarks",
    category: "Reporting",
    title: "KPI Benchmarks Master Reference",
    tags: ["kpi", "benchmarks", "reporting", "metrics", "performance"],
    content: (
      <div className="space-y-4">
        <p className="text-sm text-gray-400">
          Use these benchmarks to evaluate client performance and set realistic expectations. Contextualize all numbers to the
          client&apos;s specific trade and market size.
        </p>
        <DataTable
          headers={["KPI", "Industry Average", "Top Performer", "Action Threshold"]}
          rows={[
            ["Cost Per Lead", "$75–$200", "< $75", "Alert if > $200"],
            ["Lead-to-Booked Rate", "30–50%", "60–80%", "Investigate if < 30%"],
            ["CLV:CAC Ratio", "3:1", "5:1+", "Pause spend if < 2:1"],
            ["Website Conversion Rate", "2–5%", "8–12%", "CRO audit if < 2%"],
            ["Google Review Rating", "4.5 stars", "4.8+ stars", "Reputation crisis if < 4.0"],
            ["Call Answer Rate", "75%", "90%+", "Operations issue if < 70%"],
            ["Google Ads CTR", "4%", "6–8%", "Ad copy refresh if < 3%"],
            ["LSA Booking Rate", "60%", "80%+", "Profile audit if < 50%"],
            ["ROAS", "2:1", "4:1+", "Pause ads if < 1.5:1"],
            ["GBP Views (Monthly)", "Varies", "1,000+", "Optimization needed if declining"],
          ]}
        />
      </div>
    ),
  },
];

// ── Category config ───────────────────────────────────────────
const categories = [
  { id: "all", label: "All Articles", icon: BookOpen },
  { id: "GBP & LSA", label: "GBP & LSA", icon: MapPin },
  { id: "Local SEO", label: "Local SEO", icon: Search },
  { id: "AI Search (AEO)", label: "AI Search", icon: Bot },
  { id: "PPC & Ads", label: "PPC & Ads", icon: Target },
  { id: "Reputation", label: "Reputation", icon: Star },
  { id: "Client Communication", label: "Client Comms", icon: MessageSquare },
  { id: "Pricing & Sales", label: "Pricing & Sales", icon: DollarSign },
  { id: "Seasonal Strategy", label: "Seasonal", icon: Calendar },
  { id: "Reporting", label: "Reporting", icon: BarChart3 },
];

// ── Article Card ──────────────────────────────────────────────
function ArticleCard({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{article.title}</p>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {article.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-block text-xs text-gray-500 bg-gray-700/50 px-1.5 py-0.5 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-shrink-0 mt-0.5">
          {open ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 border-t border-gray-700/50 pt-4">{article.content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function KnowledgePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    let list = articles;
    if (activeCategory !== "all") {
      list = list.filter((a) => a.category === activeCategory);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCategory, query]);

  const grouped = useMemo(() => {
    if (activeCategory !== "all" || query.trim()) return null;
    return categories.slice(1).reduce((acc, cat) => {
      const items = articles.filter((a) => a.category === cat.id);
      if (items.length) acc[cat.id] = items;
      return acc;
    }, {} as Record<string, Article[]>);
  }, [activeCategory, query]);

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Knowledge Base" />

      <main className="flex-1 p-6 space-y-6 max-w-4xl w-full mx-auto">
        {/* Header Banner */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-gray-900 border border-indigo-500/20 rounded-2xl p-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Expert Knowledge Base</h1>
              <p className="text-sm text-gray-400 mt-1">
                30+ years of home service marketing expertise — LSA, GBP, Local SEO, AI Search, PPC benchmarks, review
                scripts, pricing frameworks, seasonal calendars, and client communication templates.
              </p>
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1">
                  {articles.length} articles
                </span>
                <span className="text-xs text-purple-300 bg-purple-500/10 border border-purple-500/20 rounded-full px-3 py-1">
                  Ready-to-use templates
                </span>
                <span className="text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1">
                  Updated March 2026
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search articles, templates, scripts, benchmarks..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => { setActiveCategory(cat.id); setQuery(""); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  activeCategory === cat.id
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 border border-gray-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Results */}
        {query.trim() || activeCategory !== "all" ? (
          <div className="space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                No articles found for &quot;{query}&quot;
              </div>
            ) : (
              filtered.map((article) => <ArticleCard key={article.id} article={article} />)
            )}
          </div>
        ) : (
          // Grouped by category
          <div className="space-y-8">
            {grouped && Object.entries(grouped).map(([catId, catArticles]) => {
              const catConfig = categories.find((c) => c.id === catId);
              const Icon = catConfig?.icon || BookOpen;
              return (
                <section key={catId}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-indigo-400" />
                    <h2 className="text-sm font-semibold text-gray-300">{catId}</h2>
                    <span className="text-xs text-gray-600">({catArticles.length})</span>
                  </div>
                  <div className="space-y-2">
                    {catArticles.map((article) => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
