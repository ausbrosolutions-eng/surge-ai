# CLAUDE CODE BUILD PROMPT
## Blueprint AI Marketing — Agency Operating System

> Copy everything below this line and paste it into Claude Code as your build prompt.

---

# BUILD PROMPT — START

You are building a complete **Marketing Agency Operating System** for Blueprint AI Marketing — a home service digital marketing agency. This is an internal agency dashboard that runs alongside the existing public-facing marketing website already built in this Next.js 14 project.

## CONTEXT

**Agency:** Blueprint AI Marketing
**Niche:** Home service businesses (HVAC, plumbing, roofing, electrical, pest control, landscaping, etc.)
**First client to pre-load:** Scott — Owner of Rehab Restoration (water/fire/mold damage restoration)
**Goal:** Build the complete internal agency operating system so the agency is fully operational before spending a dollar on paid software.
**Constraint:** Zero paid tools or APIs required — use localStorage for data persistence, free public APIs only, and build everything as self-contained components.

## TECH STACK (already installed — do NOT change package.json)

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Radix UI components
- Framer Motion
- Lucide React icons
- next-themes (dark mode already configured)

The existing public site lives at `/` — do NOT modify any existing components or pages. Build the entire agency OS at `/dashboard` and its sub-routes.

## DATA PERSISTENCE STRATEGY

Use a custom `useLocalStorage` hook + a centralized data store pattern. All data should be stored in localStorage under namespaced keys (`blueprint_clients`, `blueprint_tasks`, `blueprint_leads`, etc.). Pre-seed with Scott / Rehab Restoration as a sample client on first load.

---

## COMPLETE FILE STRUCTURE TO BUILD

```
app/
  dashboard/
    layout.tsx                    ← Dashboard shell with sidebar navigation
    page.tsx                      ← Main dashboard overview
    clients/
      page.tsx                    ← All clients list
      [id]/
        page.tsx                  ← Client overview hub
        gbp/page.tsx              ← GBP optimization module
        lsa/page.tsx              ← LSA management module
        seo/page.tsx              ← Local SEO module
        ai-search/page.tsx        ← AI Search / AEO module
        reputation/page.tsx       ← Reputation management module
        ads/page.tsx              ← Google Ads / PPC module
        social/page.tsx           ← Social media module
        reports/page.tsx          ← Client reporting module
    leads/
      page.tsx                    ← Lead qualification + pipeline
    tasks/
      page.tsx                    ← Agency-wide task manager
    onboarding/
      page.tsx                    ← New client onboarding wizard
    knowledge/
      page.tsx                    ← Expert knowledge base viewer

components/
  dashboard/
    Sidebar.tsx                   ← Navigation sidebar
    DashboardHeader.tsx           ← Top header with client switcher
    ClientCard.tsx                ← Client summary card
    MetricCard.tsx                ← KPI display card
    ChecklistItem.tsx             ← Animated checklist row
    ProgressRing.tsx              ← Circular progress indicator
    LeadCard.tsx                  ← Lead pipeline card
    TaskRow.tsx                   ← Task list row
    StatusBadge.tsx               ← Status badge component
    ScoreGauge.tsx                ← Score visualization (0-100)
    AlertBanner.tsx               ← Warning/tip banners

lib/
  store.ts                        ← Central localStorage data store
  types.ts                        ← All TypeScript interfaces
  hooks/
    useLocalStorage.ts            ← localStorage hook
    useClient.ts                  ← Current client context hook
    useChecklist.ts               ← Checklist state management
  data/
    seedData.ts                   ← Pre-seeded Scott/Rehab Restoration data
    checklists.ts                 ← All service checklists with scoring
    knowledgeBase.ts              ← Expert knowledge content
```

---

## DATA MODELS (lib/types.ts)

```typescript
// Core client type
interface Client {
  id: string;
  name: string;                    // "Scott - Rehab Restoration"
  businessName: string;            // "Rehab Restoration"
  trade: TradeType;                // "restoration" | "hvac" | "plumbing" etc.
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  serviceArea: string[];           // ["Denver", "Lakewood", "Arvada", ...]
  package: "foundation" | "growth" | "domination";
  monthlyRetainer: number;
  adSpend: number;
  startDate: string;
  status: "active" | "onboarding" | "paused" | "prospect";
  gbpUrl: string;
  googleAdsId: string;
  lsaEnabled: boolean;
  notes: string;
  scores: ClientScores;            // Module completion scores
  createdAt: string;
  updatedAt: string;
}

interface ClientScores {
  gbp: number;           // 0-100
  lsa: number;
  seo: number;
  aiSearch: number;
  reputation: number;
  ads: number;
  social: number;
  overall: number;       // weighted average
}

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  completed: boolean;
  completedAt?: string;
  notes?: string;
  scoreWeight: number;   // contribution to module score
  learnMoreUrl?: string;
}

interface Lead {
  id: string;
  clientId: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;    // "lsa" | "google_ads" | "organic" | "gbp" | "referral" | "social"
  serviceRequested: string;
  zipCode: string;
  status: "new" | "contacted" | "qualified" | "booked" | "lost" | "completed";
  urgency: "emergency" | "planned" | "maintenance";
  estimatedValue: number;
  bantScore: BANTScore;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface BANTScore {
  budget: 0 | 1 | 2;    // 0=unknown, 1=tight, 2=confirmed
  authority: 0 | 1 | 2; // 0=unknown, 1=influencer, 2=decision-maker
  need: 0 | 1 | 2;      // 0=unclear, 1=general, 2=specific
  timeline: 0 | 1 | 2;  // 0=unknown, 1=flexible, 2=urgent
  total: number;         // 0-8, display as percentage
}

interface AgencyTask {
  id: string;
  clientId?: string;
  title: string;
  description: string;
  category: "gbp" | "lsa" | "seo" | "ads" | "content" | "reputation" | "reporting" | "admin";
  priority: "urgent" | "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  dueDate: string;
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
}

interface ReviewEntry {
  id: string;
  clientId: string;
  platform: "google" | "yelp" | "angi" | "facebook" | "bbb";
  rating: number;
  reviewerName: string;
  reviewText: string;
  datePosted: string;
  responded: boolean;
  responseText?: string;
  responseDate?: string;
  sentiment: "positive" | "neutral" | "negative";
}

interface MonthlyReport {
  id: string;
  clientId: string;
  month: string;           // "2026-03"
  metrics: ReportMetrics;
  createdAt: string;
}

interface ReportMetrics {
  totalLeads: number;
  leadsPerChannel: Record<string, number>;
  costPerLead: number;
  phoneCallsTracked: number;
  gbpImpressions: number;
  gbpCalls: number;
  gbpDirections: number;
  newReviews: number;
  avgRating: number;
  websiteTraffic: number;
  conversionRate: number;
  adSpend: number;
  roas: number;
  keywordRankings: KeywordRanking[];
}

interface KeywordRanking {
  keyword: string;
  position: number;
  change: number;
  url: string;
}
```

---

## MODULE 1: DASHBOARD LAYOUT (app/dashboard/layout.tsx)

Build a full-screen dashboard layout with:
- **Left sidebar** (240px wide, dark bg-gray-900) containing:
  - Blueprint AI Marketing logo + tagline at top
  - Client quick-switcher dropdown (shows all clients, selected client highlighted)
  - Navigation links with icons:
    - 🏠 Overview (`/dashboard`)
    - 👥 Clients (`/dashboard/clients`)
    - 🎯 Leads (`/dashboard/leads`)
    - ✅ Tasks (`/dashboard/tasks`)
    - 🚀 New Client (`/dashboard/onboarding`)
    - 📚 Knowledge Base (`/dashboard/knowledge`)
  - Client-specific section (appears when client selected):
    - 📍 GBP Optimization
    - ⭐ LSA Management
    - 🔍 Local SEO
    - 🤖 AI Search / AEO
    - ⭐ Reputation
    - 💰 Google Ads
    - 📱 Social Media
    - 📊 Reports
  - At bottom: Agency health score (animated ring showing % of tasks complete across all clients)
- **Main content area** with top header showing:
  - Current page title
  - Selected client name + status badge
  - Quick action buttons (+ Add Lead, + Add Task)
  - Current date

---

## MODULE 2: MAIN DASHBOARD (app/dashboard/page.tsx)

Agency-wide overview showing:

**Top row — 4 metric cards:**
- Total Active Clients (count + trend)
- Total Leads This Month (sum across all clients)
- Avg Client Score (weighted avg of all client module scores)
- Tasks Due Today (count with urgent flagging)

**Middle section — two columns:**

Left column: "Client Health Board"
- List all clients with:
  - Client name + trade icon
  - Package badge (Foundation / Growth / Domination)
  - Overall score ring (0-100)
  - Mini bar showing scores per module (GBP, LSA, SEO, AI, Rep, Ads)
  - # of leads this month
  - Days since last report
  - Quick "Go to client" button
- Color code: green (80+), yellow (60-79), red (<60)

Right column: "Agency Task Board"
- Kanban-style view: Todo | In Progress | Done
- Filter by client or category
- Add task button
- Tasks show client name, priority badge, due date
- Drag to change status (or click to toggle)

**Bottom section — "Today's Priorities"**
- Auto-generated list of most important actions across all clients:
  - Clients with no GBP posts in 7+ days → "Post to [Client] GBP"
  - Clients with new reviews needing response → "Respond to [N] reviews for [Client]"
  - Clients with critical checklist items incomplete → "Complete [Item] for [Client]"
  - Leads in "new" status for 24+ hours → "[N] leads need follow-up"

---

## MODULE 3: GBP OPTIMIZATION (app/dashboard/clients/[id]/gbp/page.tsx)

The most important module. Build a comprehensive GBP management tool.

**Header:** GBP Health Score (large ring, 0-100), animated on load. Shows what % of checklist is complete.

**Section 1: Profile Completeness Checklist**
Group items visually. Each item has: checkbox, title, description tooltip, priority badge, score weight indicator.

Critical items (shown first, red badge):
- [ ] Business name matches legal name exactly (no keyword stuffing)
- [ ] Primary category set to highest-revenue service
- [ ] All secondary categories added
- [ ] Business description uses full 750 characters with natural keywords
- [ ] Phone number matches website and all directories EXACTLY
- [ ] Website URL verified and working
- [ ] Complete service area added (all cities + zip codes)
- [ ] All hours set including holiday hours

High priority items:
- [ ] All services listed with individual descriptions
- [ ] Pricing added where applicable
- [ ] All business attributes filled (24/7, emergency services, veteran-led, women-led, etc.)
- [ ] "From the business" description section completed
- [ ] Q&A pre-populated with 8+ questions and detailed answers
- [ ] GBP linked to LSA account

Photo checklist:
- [ ] 10+ photos uploaded total
- [ ] Team/technician photos (humanizes business)
- [ ] Branded vehicle/truck photos
- [ ] Before/after project photos (minimum 3 sets)
- [ ] Work-in-progress shots
- [ ] License/certification plaques
- [ ] Interior office/shop photos (if applicable)
- [ ] Cover photo optimized for mobile view

**Section 2: Posts Tracker**
- Calendar view showing last 30 days of posts
- Color-coded: green = posted, red = missed, gray = future
- "Days since last post" counter (turns red at 7 days, critical at 14 days)
- Warning banner if no post in 7+ days: "⚠️ RANKING DROP RISK: No GBP post in X days. Post now!"
- Post ideas generator: trade-specific seasonal content suggestions based on client's trade and current month
- Log a post button: records date, type (What's New / Offer / Event), has CTA (yes/no), has photo (yes/no)

**Section 3: Q&A / Ask Maps Tracker**
- List of pre-seeded Q&As to add:
  "Do you offer emergency service?"
  "Are you licensed and insured?"
  "What areas do you serve?"
  "Do you offer financing?"
  "How quickly can you respond?"
  "Do you offer free estimates?"
  "Are you Google Verified?"
  "What certifications do you have?"
- Status: Added / Not Added
- Consistency warning: "Answers must match website and review content exactly for AI accuracy"

**Section 4: Key Stats Entry**
Form to manually enter monthly GBP stats:
- Profile Views
- Website Clicks
- Phone Calls
- Direction Requests
- Photo Views
- Trend arrows showing month-over-month change

**Section 5: Action Items Panel**
Auto-generated list of next actions based on checklist completion state. Show top 3 most impactful incomplete items. Each shows: what to do, why it matters, estimated time to complete.

---

## MODULE 4: LSA MANAGEMENT (app/dashboard/clients/[id]/lsa/page.tsx)

**Header:** LSA Score with ranking factor breakdown

**Section 1: Google Verified Status**
- Verification status badge: Verified / Pending / Not Started
- Checklist for verification:
  - [ ] Background check submitted
  - [ ] License documentation uploaded
  - [ ] Insurance documentation uploaded
  - [ ] Business registration verified
  - [ ] GBP account connected to LSA

**Section 2: LSA Ranking Factors Tracker**
Show each ranking factor as a progress bar the user can rate 1-10:
1. Review Score (current avg rating entry field)
2. Review Quantity & Recency (# of reviews in last 30 days)
3. Response Rate (% of calls answered — entry field)
4. Profile Completeness (auto-pulled from GBP module score)
5. Booking Rate (% marked as booked — entry field)
6. Service Area Focus (Tight/Medium/Broad selector)
7. GBP Integration (linked/not linked toggle)

**Section 3: LSA Settings Checklist**
- [ ] Bidding set to "Maximize Leads" (NOT Max Per Lead)
- [ ] Service area focused and tight
- [ ] All lead types enabled: calls, messages, direct booking
- [ ] Lead dispute process documented
- [ ] Every lead marked as booked or not booked (process in place)
- [ ] Seasonal budget increases scheduled
- [ ] Separate account if multiple locations
- [ ] GBP and LSA accounts connected and synced

**Section 4: Lead Tracking**
- Table of LSA leads this month: date, service type, lead type, status (booked/not booked), disputed (yes/no)
- Booking rate percentage (big number)
- Invalid lead log with dispute status

**Section 5: Budget & Performance**
- Monthly budget input
- Avg cost per lead this month
- Total leads this month
- Lead trend chart (7-day sparkline using CSS/SVG — no external charting library)

**2025 Policy Alert Banner:**
Static amber banner: "⚠️ 2025 Policy: Google claims ownership of LSA advertiser content and records/analyzes all calls. Clients should be informed. [Mark as Disclosed]"

---

## MODULE 5: LOCAL SEO (app/dashboard/clients/[id]/seo/page.tsx)

**Header:** SEO Score ring + "Estimated Time to Results: X months" based on completion

**Section 1: Citation Building Tracker**
Three-tier citation system with progress tracking:

Tier 1 — Core Citations (10 platforms):
Show each as a card: Platform name | Status dropdown (Not Started / In Progress / Claimed / Optimized) | NAP Verified checkbox | Score
- Google Business Profile
- Bing Places for Business
- Apple Maps
- Yelp
- Better Business Bureau (BBB)
- Yellow Pages
- Facebook Business
- Foursquare
- Nextdoor Business
- Data Axle (aggregator)

Tier 2 — Home Service Specific (8 platforms):
- Angi / HomeAdvisor
- Houzz
- Thumbtack
- Porch
- BuildZoom
- Contractor.com
- Networx
- Neustar Localeze (aggregator)

Tier 3 — Trade Specific (dynamic by client trade):
For restoration: IICRC directory, RIA directory
For HVAC: PHCC, ACCA, manufacturer dealer pages
For roofing: NRCA, GAF, Owens Corning contractor page
For plumbing: PHCC, local utilities contractor list
Also: Local Chamber of Commerce, local BBB chapter

**NAP Consistency Checker:**
Input fields for the "master NAP":
- Business Name: [input]
- Address: [input]
- Phone: [input]

Then a checklist of common NAP consistency issues:
- [ ] "Ave" vs "Avenue" standardized
- [ ] Suite number formatting consistent
- [ ] Phone format consistent (all dash, or all dot, or all parentheses)
- [ ] No trailing punctuation differences
- [ ] Company suffix consistent (Inc. vs Inc)

Citation score: # optimized / total available × 100

**Section 2: On-Page SEO Checklist**
Homepage:
- [ ] Primary keyword in H1
- [ ] Phone number in header, clickable on mobile
- [ ] Service area in first 100 words
- [ ] Trust signals above fold
- [ ] Meta title includes city + service
- [ ] Meta description has CTA

Service Area Pages:
- Show list of service area pages needed (from client's serviceArea array)
- For each: [ ] Page exists, [ ] Unique content (not copy-paste), [ ] Local landmarks referenced, [ ] Google Map embedded, [ ] 500+ words
- "Missing pages" flagged in red
- Add page button that generates a content brief template

Schema Markup:
- [ ] LocalBusiness schema implemented
- [ ] Service schema on service pages
- [ ] FAQPage schema on FAQ section
- [ ] AggregateRating schema pulling review data
- [ ] HowTo schema on educational content
- [ ] Schema validated with Rich Results Test (checkbox)
- [ ] No schema errors in Search Console (checkbox)

**Section 3: Link Building Log**
Table to track earned links: Source | URL | DA/Authority | Date Earned | Type (press/directory/supplier/community)
Progress bar: Current links / Goal (show 20 as starter goal)

High-value link opportunity checklist:
- [ ] Local Chamber of Commerce (high DA, Google trusts)
- [ ] Industry association (PHCC/NRCA/etc.)
- [ ] Supplier "find a pro" page (Carrier, GAF, etc.)
- [ ] Local news coverage (sponsor or outreach)
- [ ] Neighborhood association website
- [ ] Home builder referral page
- [ ] Local "best of" list or award

**Section 4: Keyword Rankings**
Simple table: Keyword | Target URL | Current Position | Last Week | Change | Notes
Pre-seeded with trade-appropriate keywords for Rehab Restoration:
- "water damage restoration [city]"
- "fire damage cleanup [city]"
- "mold remediation [city]"
- "emergency restoration [city]"
- "flood damage repair [city]"

---

## MODULE 6: AI SEARCH / AEO (app/dashboard/clients/[id]/ai-search/page.tsx)

This is the cutting-edge, high-value differentiator module. Make it visually impressive.

**Header:** "AI Search Visibility Score" with a futuristic design showing which AI platforms the client appears in.

**Section 1: AI Platform Presence Tracker**
Show each AI platform as a visual card with status:

ChatGPT/OpenAI:
- Status: ✅ Likely Cited / ⚠️ Needs Work / ❌ Not Optimized
- Requirements checklist:
  - [ ] Bing Places fully claimed and optimized
  - [ ] Yelp profile complete with 4.5+ star rating
  - [ ] BBB listing active
  - [ ] Angi/HomeAdvisor profile complete
  - [ ] Website ranking in Bing for primary keywords
  - [ ] Content answers "best [trade] in [city]" queries
- ChatGPT sources from Bing index — Bing SEO is critical

Google AI Overviews:
- Requirements checklist:
  - [ ] FAQ sections with FAQPage schema implemented
  - [ ] Content has "direct answer capsules" (40-60 word summaries at section starts)
  - [ ] H1/H2/H3 hierarchy clear and keyword-rich
  - [ ] Statistics cited with source links
  - [ ] Content updated within last 90 days
  - [ ] Listicle content on key topics

Perplexity AI:
- Requirements checklist:
  - [ ] Ranking in Google for primary service keywords
  - [ ] High-authority backlinks present
  - [ ] Reddit/Quora mentions (community presence)
  - [ ] YouTube channel with optimized videos

Microsoft Copilot:
- Requirements checklist:
  - [ ] Bing Places claimed at bing.com/forbusiness (Oct 2025 redesign)
  - [ ] All amenities fields filled in Bing Places (hasWiFi, parking, etc.)
  - [ ] IndexNow enabled on website
  - [ ] Bing Webmaster Tools set up
  - [ ] AI Performance report checked in Bing Webmaster Tools

Claude (Anthropic):
- Requirements checklist:
  - [ ] Present on Yelp, BBB, Angi, local news
  - [ ] 4.5+ star rating on all platforms
  - [ ] Website clearly states: service area, services, credentials
  - [ ] NAP 100% consistent across web
  - [ ] Mentioned in at least 2 local press/industry publications

**Section 2: Entity Optimization Checklist**
Explain: "AI search is powered by entity recognition. The more sources agree on who you are, the more confidently AI will recommend you."

- [ ] Business name IDENTICAL on website, GBP, Yelp, BBB, Facebook (no abbreviations)
- [ ] GBP linked to and from website
- [ ] Social profiles link to website
- [ ] Wikipedia / Wikidata entry (for larger businesses)
- [ ] Google Knowledge Panel claimed (if available)
- [ ] Schema markup references recognized entities
- [ ] Consistent NAP across all 40+ citations
- [ ] "About" page clearly states: business history, owner name, credentials, service area

**Section 3: E-E-A-T Score Tracker**
Four pillars, each scored 0-25 for a total of 0-100:

Experience (0-25):
- [ ] "About Us" page with real owner/tech photos (+5)
- [ ] First-person content with experience statements (+5)
- [ ] Before/after photos and case studies (+5)
- [ ] Video of work being performed (+5)
- [ ] Years in business prominently displayed (+5)

Expertise (0-25):
- [ ] Trade certifications displayed prominently (+5)
- [ ] Author bios with credentials on blog posts (+5)
- [ ] Technical, specific FAQ content (+5)
- [ ] Trade-specific service descriptions (+5)
- [ ] Content references real local conditions/challenges (+5)

Authoritativeness (0-25):
- [ ] Backlinks from local news (+5)
- [ ] Industry association membership/listing (+5)
- [ ] Supplier certification page listed (+5)
- [ ] Local media coverage (+5)
- [ ] Consistent presence across 40+ directories (+5)

Trustworthiness (0-25):
- [ ] SSL/HTTPS active (+5)
- [ ] Privacy policy + Terms of Service pages (+5)
- [ ] Physical address on every page (+5)
- [ ] BBB accreditation (+5)
- [ ] Responding to 100% of reviews (+5)

**Section 4: Voice Search Optimization**
- [ ] FAQ pages in natural Q&A format
- [ ] Content written conversationally
- [ ] GBP hours and contact info complete
- [ ] Schema answers who/what/where/when/why questions
- [ ] Local knowledge base ("What's the average cost of [service] in [city]?")

**Section 5: Content Gap Analysis**
Pre-populated with AI search content opportunities for restoration:
- "What does water damage restoration cost in [city]?" — Status: [Not Written / In Progress / Published]
- "How long does mold remediation take?" — Status
- "Emergency water damage: what to do in the first hour" — Status
- "Does insurance cover water damage restoration?" — Status
- "Best water damage company in [city]" — Status (this one ranks in ChatGPT)
Add custom opportunity button.

---

## MODULE 7: REPUTATION MANAGEMENT (app/dashboard/clients/[id]/reputation/page.tsx)

**Header:** Reputation Score (composite of avg rating, review velocity, response rate)

**Section 1: Review Dashboard**
Platform cards showing:
- Google: ⭐ [rating] | [count] reviews | [new this month]
- Yelp: ⭐ [rating] | [count] reviews
- Angi: ⭐ [rating] | [count] reviews
- Facebook: ⭐ [rating] | [count] reviews
- BBB: Rating letter grade

Update these manually via entry fields. Show trend arrows.

**Section 2: Review Generation System**
System status: Active / Inactive toggle

The 5-step automated process (visual flowchart style):
Step 1 → Job Completed (trigger)
Step 2 → Verbal Ask (script provided)
Step 3 → SMS within 2 hours (template shown)
Step 4 → Email follow-up at 48hrs (template shown)
Step 5 → Final SMS at 5 days (template shown)

Each step shows:
- Status: Set Up / Not Set Up
- Script/template text
- Copy button
- Tool recommendation (Podium / NiceJob / GoHighLevel)

Verbal ask script for techs:
"[Client Name] really appreciates your business. If you're happy with the work today, would you mind leaving us a quick Google review? It only takes about a minute and really helps our small business show up for neighbors who need help."

SMS template (copy-paste):
"Hi [Name]! Thanks for choosing [Business Name] today. If you're satisfied with our service, we'd really appreciate a Google review — it helps neighbors find us when they need help most. Here's your direct link: [LINK] Takes less than 60 seconds! - [Tech Name]"

Negative review response template:
"Thank you for sharing your experience, [Name]. We're genuinely sorry this didn't meet your expectations. We take every piece of feedback seriously and would like the opportunity to make this right. Please reach out to our customer service manager directly at [phone] — we want to resolve this for you personally."

**Section 3: Review Log**
Table of recent reviews (manually entered or pasted):
- Platform | Stars | Reviewer | Date | Summary | Responded? | Response
- Filter by: platform, rating, responded/not
- "Needs Response" badge on reviews not yet responded to
- Response time tracker: flag any negative review not responded to within 24hrs

**Section 4: Review Velocity Tracker**
- New reviews this week: [#]
- New reviews this month: [#]
- Target: 1-2/week per location
- 8-week rolling chart (SVG/CSS sparkline)
- Alert if no new reviews in 14 days

---

## MODULE 8: GOOGLE ADS / PPC (app/dashboard/clients/[id]/ads/page.tsx)

**Header:** Ads Performance Score + Current Month Spend vs Budget

**Section 1: Campaign Structure Checklist**
Visual campaign hierarchy showing the recommended structure:
1. [ ] LSA Campaign (managed in LSA dashboard)
2. [ ] Branded Search Campaign
3. [ ] Service-Specific Campaigns (one per major service)
4. [ ] Emergency/Urgent Campaign (high-intent keywords, higher bids)
5. [ ] Remarketing Display Campaign

For each: Status (Active/Paused/Not Created), Monthly Budget, Est. CPC

**Section 2: Keyword Strategy**
Emergency Keywords (allocate 30-40% of budget):
Show a table pre-populated with restoration-specific emergency keywords:
- "emergency water damage restoration [city]"
- "24 hour flood cleanup near me"
- "burst pipe water damage emergency"
- "sewage backup cleanup emergency"
- "fire damage emergency restoration"
Status column for each: Active / Not Using

Planned Keywords:
- "water damage restoration [city]"
- "mold remediation [city]"
- "fire damage cleanup cost"
- "water damage repair near me"

Negative Keywords (add-immediately list):
Pre-populated: DIY, jobs, careers, free, how to, YouTube, school, certification, parts, supply, wholesale, warranty claim, reddit

**Section 3: Bidding Strategy Tracker**
Current phase selector:
- Phase 1: Maximize Conversions (first 30-60 days, <30 conversions/month)
- Phase 2: Target CPA (after 30+ conversions/month per campaign)
Note: "Set Target CPA at 150% of desired CPL initially, then tighten over 30 days"

**Section 4: Ad Copy & Extensions Checklist**
- [ ] Responsive Search Ads (12 headlines, 4 descriptions minimum)
- [ ] Primary headline pinned: includes city or service
- [ ] "Available 24/7" or availability hook in headline
- [ ] Number/social proof in headline ("5,000+ Jobs Completed")
- [ ] Call extensions added (with CallRail tracking number)
- [ ] Location extensions linked to GBP
- [ ] Sitelink extensions (4+ links to specific service pages)
- [ ] Callout extensions ("Licensed & Insured," "Free Estimates," "24/7 Emergency")
- [ ] Structured snippets (Services list)
- [ ] Lead form extension active

**Section 5: Performance Metrics Entry**
Monthly data entry (manual, since no API connection yet):
- Total Spend: $[input]
- Total Clicks: [input]
- Total Conversions (calls + forms): [input]
- Avg CPC: [calculated]
- Conversion Rate: [calculated]
- Cost Per Lead: [calculated]
- ROAS: [input]

Benchmark comparison:
- Your CPL: $X | Industry avg: $75–$150 | Status: [Above/Below/At benchmark]
- Your CTR: X% | Benchmark: 6.37% | Status
- Your ROAS: X:1 | Target: 3:1 minimum | Status

**Section 6: Budget Planning**
Market size selector: Small (<100K) / Mid-size / Major Metro
Recommended budget range auto-populated
Season multiplier: Peak season toggle (+20-30%)

---

## MODULE 9: LEAD MANAGEMENT (app/dashboard/leads/page.tsx)

**Full lead pipeline across all clients.**

**Header row:** 6 pipeline stage counts: New | Contacted | Qualified | Booked | Completed | Lost

**Kanban Board:**
Six columns matching pipeline stages. Each lead card shows:
- Lead name + phone
- Client (whose lead it is)
- Source badge (LSA / Google Ads / Organic / GBP / Referral)
- Service requested
- Urgency badge (Emergency / Planned / Maintenance)
- BANT score (0-8, shown as dots or small bar)
- Estimated job value: $XXX
- Time in current stage (turns red if >24hrs in "New")
- Quick action buttons: Move Stage | Add Note | Mark Booked

**Add Lead Modal:**
Form fields:
- Client (select from active clients)
- Lead name
- Phone
- Email (optional)
- Source (dropdown)
- Service requested
- Zip code
- Urgency level
- Estimated job value
- Initial notes
- BANT Quick Score:
  - Budget: Unknown / Tight / Confirmed
  - Authority: Unknown / Influencer / Decision Maker
  - Need: Unclear / General / Specific Pain Point
  - Timeline: Unknown / Flexible / Urgent / Emergency

**BANT Scoring Panel:**
Below the board, show a BANT breakdown table:
- Leads with BANT score 7-8: "Hot — Close Today"
- Leads with BANT score 5-6: "Warm — Qualify Further"
- Leads with BANT score 3-4: "Cool — Nurture"
- Leads with BANT score 0-2: "Cold — Consider Disqualifying"

**Disqualification Signals Panel:**
"Watch for these red flags:"
- ⚠️ Cannot articulate specific pain points
- ⚠️ Outside service area
- ⚠️ Consistently ignores follow-ups (2+ attempts, no response)
- ⚠️ No decision-making authority
- ⚠️ Budget clearly mismatched to service cost

**Lead Source Attribution:**
Pie-ish bar chart showing % of leads by source this month across all clients.

---

## MODULE 10: TASK MANAGER (app/dashboard/tasks/page.tsx)

**Agency-wide task board for all client work.**

**Filters:** All Clients | Specific Client | Category | Priority | Due Date

**Priority View (default):**
- 🔴 Urgent (due today or overdue)
- 🟠 High (due this week)
- 🟡 Medium (due this month)
- 🟢 Low (backlog)

**Task Card shows:**
- Title
- Client name + trade icon
- Category badge: GBP | LSA | SEO | Ads | Content | Reputation | Reporting | Admin
- Priority badge
- Due date (red if overdue)
- Status: Todo / In Progress / Done
- One-click status toggle

**Add Task:**
- Title
- Client (optional — "agency-wide" if no client)
- Category
- Priority
- Due date
- Description/notes
- Estimated time

**Auto-Generated Tasks:**
When you navigate to Tasks, auto-generate recurring task suggestions:
- "Monthly GBP report for [Client]" — generated on 1st of month
- "Respond to new [Client] reviews" — when unresponded reviews exist
- "Post to [Client] GBP — 7 days since last post" — triggered by post tracker
- "Dispute invalid LSA leads for [Client]" — monthly reminder

---

## MODULE 11: CLIENT ONBOARDING WIZARD (app/dashboard/onboarding/page.tsx)

**Multi-step wizard for onboarding new clients.**

Step 1 — Basic Info:
- Business name, owner name, phone, email
- Website URL
- Physical address
- Trade / service type (dropdown with all home service trades)
- Service area cities (comma-separated input that creates tags)

Step 2 — Package Selection:
Three cards with all features listed:
- Foundation: $1,000–$1,500/month (GBP + citations + reviews + 4 posts/month)
- Growth: $2,500–$4,000/month (adds local SEO, blog, ads management, reputation)
- Domination: $4,000–$8,000/month + ad spend (adds LSA, social, video, CRO)
Monthly retainer field + ad spend field

Step 3 — Access Checklist:
"Request access to these accounts before kickoff call:"
- [ ] Google Business Profile (Manager access)
- [ ] Google Ads (Standard access)
- [ ] Google Analytics 4 (Editor access)
- [ ] Google Search Console (Full access)
- [ ] Website / CMS login
- [ ] CallRail account (or create new)
- [ ] Facebook Business Manager
- [ ] Existing LSA account (if applicable)

Step 4 — Kickoff Call Agenda:
Pre-built agenda that populates with client name:
"Kickoff Call Agenda for [Client Name] — [Date]
1. Business overview (15 min): What makes [Business] different? Who is the ideal customer?
2. Current marketing: What have you tried? What's working/not working?
3. Competitive landscape: Who are your top 3 competitors?
4. Seasonal patterns: What are your busiest and slowest months?
5. Goals: What does success look like in 90 days? 12 months?
6. Next steps: Timeline, access requests, first deliverables"

"Copy to Clipboard" button

Step 5 — First 30 Days Plan:
Auto-generated based on package selected:
Week 1 tasks auto-created:
- Day 1: Set up CallRail tracking numbers (DNI)
- Day 1: Verify all access received
- Day 2-3: Run baseline audit (GBP, citations, reviews, website)
- Day 4-5: Set up GA4 goals + Google Ads conversion tracking

Week 2 tasks auto-created:
- Day 8-9: Present 30/60/90 day strategy
- Day 10: Launch first Google Ads campaign
- Day 10: Complete GBP optimization
- Day 12-14: Activate review request system

Confirm + Create Client button → creates client in system, pre-populates all checklists, routes to client dashboard.

---

## MODULE 12: KNOWLEDGE BASE (app/dashboard/knowledge/page.tsx)

**Searchable expert knowledge base for reference during client calls.**

Categories (tabbed navigation):
1. GBP & LSA Quick Reference
2. Local SEO Playbook
3. AI Search (AEO/GEO) Guide
4. PPC Benchmarks & Strategy
5. Reputation Scripts & Templates
6. Client Communication Templates
7. Pricing & Objection Handling

Each article should be well-formatted with:
- TL;DR summary at top (40-60 words — optimized for quick reference)
- Numbered/bulleted key points
- Benchmark tables
- Copy-paste templates where applicable

**Key articles to include:**

**GBP Ranking Factors Quick Reference:**
Show the 7 ranking factors with one-line explanations and "how to improve" notes.

**LSA Lead Dispute Guide:**
When to dispute: wrong number, outside area, duplicate, wrong service. How to dispute: step-by-step in LSA dashboard. Track disputes separately from valid leads.

**Review Response Templates:**
5-star positive: "Thank you, [Name]! We're so glad [Tech Name] could take care of you today. It was a pleasure working with you — we'll be here whenever you need us!"
4-star (use to find out what would have made it 5): "Thank you for the kind review, [Name]! We're always looking to improve — if there's anything we could have done differently to earn that 5th star, we'd love to hear it. Feel free to reach out directly at [phone]."
1-3 star negative: [The template from knowledge base]

**2025 Industry Benchmarks Table:**
| Metric | Average | Strong | Elite |
|--------|---------|--------|-------|
| CPL | $75-200 | $50-75 | <$50 |
| Lead-to-Booked | 30-50% | 50-65% | 65-80% |
| GBP Call Rate | varies | — | — |
| CTR (Google Ads) | 4% | 6% | 8%+ |
| Avg Rating (Google) | 4.5 | 4.7 | 4.8+ |
| LSA Booking Rate | 50-60% | 70% | 80%+ |
| ROAS | 2:1 | 3:1 | 4:1+ |

**Seasonal Calendar:**
Month-by-month content and campaign recommendations for each trade type. Show for restoration:
- Jan-Feb: Frozen pipe burst content, ice dam content
- Mar-Apr: Spring flood prep, post-winter inspection
- May-Jun: Storm season awareness content
- Jul-Aug: Humidity/mold awareness content
- Sep-Oct: Pre-winter inspection push
- Nov-Dec: Holiday preparedness, pipe freeze prevention

**Objection Handling Guide:**
"Your prices are too high" → "I understand budget is always a consideration. Let me share what your competitors are spending vs. what our clients generate in return. [ROI example]. What's one new job per month worth to your business? At your average ticket of $X, our fee pays for itself with just Y jobs."
"We tried marketing before and it didn't work" → "Tell me what you tried — I want to understand specifically what was done and what metrics were tracked. Most campaigns fail because of attribution problems or wrong channel mix, not because marketing itself doesn't work for [trade]."
"I need to think about it" → "Absolutely — this is a real commitment. Can I ask what specifically you're weighing? Is it the budget, the right timing, or needing to see a case study first? I want to make sure I give you exactly what you need to feel confident."

---

## PRE-SEEDED DATA (lib/data/seedData.ts)

Create Scott / Rehab Restoration as the first client with realistic data:

```typescript
export const seedClient: Client = {
  id: "scott-rehab-restoration",
  name: "Scott",
  businessName: "Rehab Restoration",
  trade: "restoration",
  phone: "(720) 555-0192",
  email: "scott@rehabrestoration.com",
  website: "https://rehabrestoration.com",
  address: "123 Commerce Dr",
  city: "Denver",
  state: "CO",
  serviceArea: ["Denver", "Lakewood", "Arvada", "Westminster", "Thornton", "Englewood", "Littleton", "Aurora"],
  package: "growth",
  monthlyRetainer: 3000,
  adSpend: 2500,
  startDate: "2026-03-01",
  status: "onboarding",
  gbpUrl: "",
  googleAdsId: "",
  lsaEnabled: false,
  notes: "Referral from network. Owner Scott is highly motivated, has been in business 8 years. Primary services: water damage, fire damage, mold remediation. Peak season is spring (flooding) and winter (frozen pipes). Competitors: SERVPRO franchise, local independents.",
  scores: {
    gbp: 0,
    lsa: 0,
    seo: 0,
    aiSearch: 0,
    reputation: 0,
    ads: 0,
    social: 0,
    overall: 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

Pre-seed 3 sample leads for Rehab Restoration:
1. Emergency water damage call from Lakewood — BANT 7/8 — $8,500 estimated value
2. Mold inspection inquiry from Denver — BANT 4/8 — $2,200 estimated value
3. Fire damage assessment from Aurora — BANT 6/8 — $15,000 estimated value

Pre-seed 5 tasks (one per category) for immediate work:
1. [GBP] Claim and verify Rehab Restoration Google Business Profile
2. [SEO] Submit to 4 data aggregators (Data Axle, Neustar, Foursquare, Factual)
3. [Reputation] Set up manual review request text template
4. [Ads] Research and compile competitor ad strategy
5. [Onboarding] Schedule kickoff call with Scott

---

## UI DESIGN GUIDELINES

**Color Palette (extend existing dark theme):**
- Background: gray-950 / gray-900
- Card backgrounds: gray-800 / gray-850
- Primary accent: blue-500 / blue-600 (actions, links)
- Success: emerald-500 (completed items, good scores)
- Warning: amber-500 (needs attention, moderate scores)
- Danger: red-500 (critical items, poor scores, overdue)
- Score ring colors: emerald (80-100), amber (60-79), red (0-59)

**Typography:**
- Use existing Inter font
- Page titles: text-2xl font-bold text-white
- Section headers: text-lg font-semibold text-gray-100
- Body: text-sm text-gray-300
- Muted/labels: text-xs text-gray-500

**Component Patterns:**
- Cards: bg-gray-800 rounded-xl p-6 border border-gray-700
- Badges: rounded-full px-3 py-1 text-xs font-medium
- Inputs: bg-gray-900 border border-gray-600 rounded-lg text-white
- Buttons: Primary = bg-blue-600 hover:bg-blue-700, Secondary = bg-gray-700 hover:bg-gray-600
- Checklists: Each row has subtle hover:bg-gray-750 and a smooth checkbox animation
- Progress bars: rounded-full with color-coded fill based on value
- Score rings: SVG circle with stroke-dasharray animation on mount

**Framer Motion animations:**
- Cards: fade in + slight translateY on mount (staggered)
- Score rings: animate stroke from 0 to value on mount
- Checklist items: checkbox gets checkmark animation on complete
- Progress bars: animate width from 0 on mount
- Sidebar: smooth active state highlight transition

---

## IMPLEMENTATION NOTES

1. **No external API calls required.** All data is stored in localStorage. No backend needed.

2. **Score calculation:** Each module's score is calculated automatically from checklist completion. Unchecked = 0 points, checked = scoreWeight points. Total = (earned/possible) × 100.

3. **Client overall score:** Weighted average: GBP (25%) + LSA (15%) + SEO (20%) + AI Search (15%) + Reputation (15%) + Ads (10%)

4. **"Today's Priorities" logic:** Run this on every dashboard load. Check: last post date for all clients, reviews with responded=false, leads in "new" status >24hrs, critical checklist items incomplete, tasks overdue.

5. **Responsive design:** Dashboard sidebar collapses to icons-only on screens <1280px. Mobile view shows hamburger menu. Main content scrolls independently.

6. **localStorage keys used:**
   - `blueprint_clients` — array of Client objects
   - `blueprint_checklists` — object keyed by `clientId_module`
   - `blueprint_leads` — array of Lead objects
   - `blueprint_tasks` — array of AgencyTask objects
   - `blueprint_reviews` — array of ReviewEntry objects
   - `blueprint_reports` — array of MonthlyReport objects
   - `blueprint_initialized` — boolean, false until seed data written

7. **On first load:** Check `blueprint_initialized`. If false, write seed data and set to true.

8. **Export/backup:** Add a simple "Export All Data" button in dashboard settings that downloads a JSON file of all localStorage data. This is the backup system.

9. **The `/dashboard` route is SEPARATE from the public site.** No shared navigation. Dashboard has its own layout.tsx that does NOT render the public Navbar or Footer.

---

## FINAL CHECKLIST — BUILD COMPLETE WHEN:

- [ ] Dashboard layout renders with sidebar and header
- [ ] All 8+ client-specific module pages exist and are navigable
- [ ] GBP module has full checklist with scoring, post tracker, and score ring
- [ ] LSA module has ranking factors, settings checklist, and 2025 policy alert
- [ ] SEO module has 3-tier citation tracker and service area page tracker
- [ ] AI Search module has all 5 AI platform trackers and E-E-A-T scorer
- [ ] Reputation module has review log, generation scripts, and velocity tracker
- [ ] Ads module has campaign checklist, keyword lists, and benchmark comparisons
- [ ] Leads page has kanban board with BANT scoring
- [ ] Tasks page has prioritized task board with auto-generated suggestions
- [ ] Onboarding wizard creates new clients end-to-end
- [ ] Knowledge base has searchable articles and templates
- [ ] Scott / Rehab Restoration is pre-seeded with sample data
- [ ] All scores calculate dynamically from checklist state
- [ ] All data persists in localStorage across page refreshes
- [ ] Dark theme consistent throughout
- [ ] Framer Motion animations on all score indicators and checklists
- [ ] Mobile-responsive sidebar

# BUILD PROMPT — END
