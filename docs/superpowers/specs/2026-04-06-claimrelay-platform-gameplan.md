# ClaimRelay Platform Game Plan
## From Single-Player Dashboard to "Stedi for Property Insurance"

Design spec created 2026-04-06. This document defines the full strategic and technical evolution of ClaimRelay from a contractor-side claims dashboard into a two-sided platform where restoration contractors and insurance adjusters resolve claims together.

**Inspiration model:** Stedi ($142M raised, ~40 people, $7.2M revenue in 2024) built "Stripe for healthcare transactions" by wrapping legacy EDI/X12 in modern APIs. ClaimRelay applies the same playbook to property insurance claims -- wrapping Xactimate/XactAnalysis, carrier-specific portals, and email/fax workflows in a modern shared workspace with AI intelligence.

---

## Table of Contents

1. [Product Vision & Two-Sided Value](#1-product-vision--two-sided-value)
2. [Platform Architecture -- The Three Layers](#2-platform-architecture----the-three-layers)
3. [Go-To-Market Phases](#3-go-to-market-phases)
4. [The Idiot-Proof Communication System](#4-the-idiot-proof-communication-system)
5. [Revenue Model & Unit Economics](#5-revenue-model--unit-economics)
6. [Competitive Landscape & Defensibility](#6-competitive-landscape--defensibility)
7. [Technical Evolution Plan](#7-technical-evolution-plan)

---

## 1. Product Vision & Two-Sided Value

ClaimRelay is the shared workspace where restoration contractors and insurance adjusters resolve claims together.

Contractor uploads photos, documents, and estimates once. The adjuster sees them instantly -- no email, no downloading from JobNimbus, no re-uploading to a carrier portal. Every action is timestamped. Every view is logged. Non-responsiveness becomes visible.

### The Two-Sided Value Loop

**For Contractors (Rehab Restoration, etc.):**
- Upload once, deliver everywhere. Photos/docs go to the adjuster instantly, regardless of which carrier or portal they normally use
- AI flags missing line items before you submit (catch the $2K antimicrobial line the adjuster would have denied anyway)
- See exactly where every claim stands. No more "did the adjuster even look at this?"
- Carrier-specific estimate guidelines surfaced inline: "State Farm requires moisture readings for water loss claims" / "Allstate wants photos tagged by room"
- Communication trail with timestamps creates accountability when an adjuster goes dark

**For Independent Adjusters:**
- Get complete documentation upfront -- photos, moisture readings, Xactimate estimates, all organized by room/area. No more chasing contractors for missing docs
- Fewer supplement cycles because the AI already caught gaps before submission
- One inbox for claims across all the contractors they work with (instead of hunting through email)
- Faster claim resolution = more claims closed per month = more money (IAs are typically paid per claim)

**For the 25-Year Adjuster Who Won't Move:**
- Read receipts. The contractor sees "Adjuster viewed documents on April 3" or "No activity in 14 days"
- Escalation triggers. If no response in X days, ClaimRelay suggests escalation to the adjuster's supervisor with a pre-built summary of the timeline
- The contractor's documentation is so clean and complete that even a slow adjuster has fewer reasons to delay

### How Adjusters Get On The Platform

No enterprise sale required. The contractor shares a claim link (like a Google Doc share link). The adjuster clicks it, sees all docs/photos/estimates for that claim, and can respond inline. First time is anonymous/guest. After they see 3-5 claims through ClaimRelay, they create a free account to manage their incoming claims in one place. This is the viral loop.

---

## 2. Platform Architecture -- The Three Layers

### Layer 1: Claim Workspace (What Users See)

Two portals, same data:

**Contractor View:**
- Claims dashboard (pipeline, aging, cash flow)
- Claim detail with tabs: Photos/Docs, Estimate, Supplements, Payments, Timeline, Messages
- Bulk photo upload with AI auto-tagging (room, damage type, before/after)
- Carrier guideline checklists: "Before submitting to State Farm water loss, confirm you have: moisture readings, affected area photos, equipment placement photos, drying logs"
- "Share with Adjuster" button generates a secure claim link

**Adjuster View:**
- Incoming claims feed (all claims shared with them across all contractors)
- Claim detail: same data as contractor sees, but adjuster-specific actions (approve line items, request more info, mark as reviewed)
- Document viewer optimized for speed -- adjuster can flip through 50 photos with keyboard arrows, not click-wait-click
- Response tools: approve, request supplement, flag items, leave notes -- all without leaving ClaimRelay
- No cost to the adjuster. Ever. Free forever. (Contractors pay.)

**Shared Between Both:**
- Real-time activity timeline: "Contractor uploaded 12 photos" / "Adjuster viewed estimate" / "Adjuster requested additional moisture readings"
- Message thread per claim (replaces email chains)
- Read receipts on every document and message
- Status changes visible to both sides with timestamps

### Layer 2: Intelligence Engine (What Makes It Smart)

This is the "brain" that sits on top of Verisk/Xactimate, not competing with it:

- **ESX Parser:** Upload Xactimate file, extract all line items into structured data
- **AI Supplement Gap Detection:** Compare estimate against IICRC standards + loss type + carrier-specific patterns. "This water loss estimate is missing containment barriers -- State Farm approves these 89% of the time"
- **Carrier Guideline Profiles:** Crowdsourced over time from claims data. What does each carrier actually want? What do they approve vs. deny? What are their documentation requirements?
- **Adjuster Response Prediction:** After enough data, predict how long this carrier/adjuster typically takes and what they're likely to push back on
- **Aging Alerts:** Automated nudges when claims stall. Escalation templates when adjusters go dark

### Layer 3: API (What Software Companies Consume Later)

Your own UI consumes these APIs. When you're ready to sell to Jobber/ServiceTitan/Encircle, the APIs already exist:

- `POST /api/claims` -- create a claim with structured data
- `POST /api/claims/{id}/documents` -- upload photos/docs
- `POST /api/claims/{id}/estimate` -- upload ESX, get parsed line items back
- `POST /api/claims/{id}/analyze` -- run AI supplement gap detection
- `GET /api/carriers/{id}/profile` -- carrier guidelines, avg days to pay, approval patterns
- `GET /api/claims/{id}/timeline` -- full activity log
- `POST /api/claims/{id}/share` -- generate adjuster share link

You don't market the API yet. You just build your app on it. The API becomes a product when you have enough traction and data to make it valuable to partners.

---

## 3. Go-To-Market Phases

### Phase 1: Single-Player Tool (Month 1-3)

**Goal:** Get 5-10 restoration companies using ClaimRelay daily for their own claim tracking.

**What you build:**
- The existing MVP spec (claims dashboard, ESX parsing, AI supplement detection, payment tracking, carrier analytics)
- Bulk photo upload with drag-and-drop and basic auto-organization
- Carrier guideline profiles for the top 10 carriers (manually curated from real-world knowledge initially)
- JobNimbus import -- pull claim data in so contractors aren't double-entering

**What you charge:**
- Free tier: 5 active claims
- Pro: $99/month -- unlimited claims, AI supplement detection, carrier profiles

**How you get customers:**
- Rehab Restoration is customer #1 (built-in design partner)
- Scott and Jared introduce 3-5 other restoration companies they know
- Post in restoration industry Facebook groups and forums (R&R, C&R Magazine communities)
- Surge Advisory recommends ClaimRelay to agency clients

**Key metric:** Claims tracked per company per week, time-to-payment improvement.

### Phase 2: Two-Sided Workspace (Month 3-6)

**Goal:** Get 50+ independent adjusters receiving claims through ClaimRelay.

**What you build:**
- Adjuster share link (secure, no login required for first view)
- Adjuster portal (free account, incoming claims feed, document viewer, response tools)
- Read receipts and activity timeline
- Message threads per claim (replacing email)
- Aging alerts with escalation templates
- Push notifications (email + optional SMS) when the other side takes action

**Pricing changes:**
- Contractor Pro increases to $149/month (adjuster collaboration features justify it)
- Add per-analysis fee for AI supplement detection: $15/analysis on free tier, unlimited on Pro

**How adjusters adopt:**
- Contractors share claim links. That's it. No sales process.
- After an IA sees 3-5 claims, they get an email: "You've viewed 5 claims on ClaimRelay. Create a free account to manage all your incoming claims in one place."
- Target 40,000 independent adjusters first -- they pick their own tools, no IT department

**Key metric:** Adjuster accounts created organically, adjuster response time on ClaimRelay claims vs. email claims.

### Phase 3: Data Moat (Month 6-9)

**Goal:** Aggregated carrier intelligence that no one else has.

**What you build:**
- Anonymized cross-customer carrier analytics: "State Farm in Arizona averages 38 days to first payment on water losses. National average is 44."
- Line-item approval patterns: "Allstate denies antimicrobial application 73% of the time unless you cite IICRC S520 Section 12.2"
- Adjuster response benchmarks: "Your adjuster is in the bottom 20% for response time compared to other adjusters at this carrier"
- Carrier estimate guideline database -- crowdsourced from contractor submissions
- Pre-submission checklist generated per carrier + loss type

**Pricing changes:**
- Add Growth tier at $249/month -- includes carrier intelligence benchmarks, pre-submission checklists, adjuster scoring
- Or sell carrier intelligence reports a la carte: $49/report

**Key metric:** Carrier profile accuracy (validated by actual outcomes), supplement approval rate for ClaimRelay users vs. industry average.

### Phase 4: Platform & API (Month 9-18)

**Goal:** Other software companies embed ClaimRelay's intelligence into their products.

**What you build:**
- Public API documentation
- Developer portal with free tier (100 API calls/month)
- SDKs (JavaScript, Python)
- Webhook system for real-time claim status updates
- White-label adjuster portal that partners can embed

**Who you sell to:**
- Field service CRMs: Jobber, Encircle, DASH
- TPA firms: Crawford, Sedgwick, regional TPAs
- Xactimate ecosystem: become a Verisk Third-Party Integration partner

**Pricing:**
- Per-transaction: $1-3/claim created, $5-10/AI analysis, $0.50/document processed
- Enterprise: volume discounts, custom SLAs

---

## 4. The Idiot-Proof Communication System

### Claim Link Experience (The Adjuster's First Touch)

When a contractor clicks "Share with Adjuster":

1. ClaimRelay generates a unique secure URL: `claimrelay.com/c/abc123`
2. Contractor shares via email (branded template from ClaimRelay) or copies the link to paste wherever
3. Adjuster clicks the link. No login. No signup. No app download. They see:
   - Property address and loss type at the top
   - All photos in a grid with room/area labels -- click to expand
   - Xactimate estimate summary (line items, totals)
   - Supporting documents (moisture readings, drying logs, invoices)
   - A response bar at the bottom: "Looks good" / "Need more info" / "Leave a note"
4. Every action the adjuster takes is logged: "Adjuster opened link at 2:14 PM" / "Viewed 12 of 34 photos" / "Spent 8 minutes on estimate tab"

The bar is: if you can click a link and scroll, you can use ClaimRelay.

### The Accountability Engine

**Visibility Layer:**
- Activity timeline visible to both sides
- "Last activity: 14 days ago" displayed prominently on stale claims
- Weekly digest email to contractor: "3 claims have had no adjuster activity in 7+ days"

**Nudge System (Automated):**
- Day 3 with no adjuster activity: reminder email to adjuster
- Day 7: second reminder with summary of what's pending
- Day 14: contractor gets escalation prompt with pre-written template for adjuster's supervisor, including timeline, submitted documents, and comparison to carrier's average response time

**Communication Threads:**
- Per-claim message thread replaces email chains
- Adjuster can request specific items: "Need moisture readings for the master bedroom" -- creates a checklist item on the contractor's side
- Contractor responds with uploads attached directly to the request
- Every message has a read receipt
- Nothing disappears into an email inbox

**Documentation Defense:**
- Complete timestamped record of every document sent, every message exchanged, every adjuster view
- Export as PDF: "Claim Communication Report" -- a court-ready timeline for disputes or appraisals
- This alone is worth the subscription for any contractor who's dealt with disputed claims

### Carrier Submission Profiles

Each carrier entry includes:
- Preferred submission method (email, portal, XactAnalysis)
- Portal URL and login notes
- Required documentation by loss type
- Estimate guidelines (accepted/denied line items, markup percentages)
- Photo requirements (tagging conventions, naming formats)
- Contact information (claims department phone, email, fax)
- Average response time (populated from ClaimRelay data over time)

**Pre-Submission Checklist:**
Before a contractor shares a claim, ClaimRelay checks the carrier profile:
- "State Farm water loss requires: moisture map, equipment placement photos, drying logs, category/class documentation. You're missing: drying logs."
- "Allstate requires photos named by room. 8 of your 24 photos don't have room labels. Tag them now?"

Initially hand-curated from real contractor knowledge. Over time, crowdsourced from all ClaimRelay users.

---

## 5. Revenue Model & Unit Economics

### Pricing Structure

| Plan | Price | What You Get |
|------|-------|-------------|
| Free | $0/month | 5 active claims, basic dashboard, 1 user, 2 AI analyses/month |
| Pro | $99/month (Phase 1), $149/month (Phase 2+) | Unlimited claims, 3 users, unlimited AI supplement detection, adjuster share links, read receipts, carrier profiles, payment tracking |
| Growth | $249/month | Everything in Pro + 10 users, carrier intelligence benchmarks, pre-submission checklists, aging alerts with escalation templates, priority support |
| Enterprise | Custom | Multi-location, API access, white-label adjuster portal, dedicated account manager |

Adjuster: Free. Always. The adjuster is the network effect, not the revenue source.

### Revenue Targets by Phase

| Phase | Timeline | Target MRR | How |
|-------|----------|-----------|-----|
| 1 | Month 3 | $500-$1,000 | 5-10 contractors on Pro |
| 2 | Month 6 | $3,000-$5,000 | 25-30 contractors, mix of Pro and Growth |
| 3 | Month 9 | $8,000-$12,000 | 50+ contractors, carrier intelligence upsell |
| 4 | Month 18 | $25,000-$50,000 | 150+ contractors + first API/partner revenue |

### Unit Economics Target

- **CAC:** <$200 (word-of-mouth, Surge Advisory referrals, contractor-to-contractor spread)
- **LTV:** $2,400+ (24-month average retention at $99/month, longer at higher tiers)
- **LTV:CAC ratio:** 12:1+
- **Gross margin:** 80%+

### Cost Structure (Monthly at 50 Customers)

| Cost | Estimate |
|------|---------|
| Supabase (Pro) | $25 |
| Vercel (Pro) | $20 |
| Claude API (AI analyses) | $100-$300 |
| Resend (transactional email) | $20 |
| Domain + misc | $20 |
| **Total** | **~$200-$400/month** |

### The Decision Point

At $10K MRR with 75+ paying contractors and 200+ adjusters on the platform, evaluate whether to raise an angel round ($250K-$500K) to accelerate to Phase 4, or continue bootstrapping.

---

## 6. Competitive Landscape & Defensibility

### Who Exists Today

| Player | What They Do | Why They're Not ClaimRelay |
|--------|-------------|---------------------------|
| **Xactimate/XactAnalysis (Verisk)** | Estimating + claims routing | The pipes, not the brain. No AI supplement detection, no contractor-side workflow, no adjuster accountability |
| **JobNimbus** | CRM for restoration/roofing | Job management, not claims intelligence. No adjuster portal, no AI analysis, no carrier benchmarks |
| **Encircle** | Field documentation app | Documentation capture only. No claims tracking, no adjuster collaboration, no supplement detection |
| **DASH** | Restoration project management | Operations focused. Not claims intelligence |
| **Restoration Manager / PSA** | Legacy restoration management | No AI, no adjuster portal, no modern UX |
| **CoreLogic Claims Workspace** | Carrier-side claims platform | Built for carriers, not contractors |
| **One Claim Solution** | Claims management for restoration | No AI supplement detection, no adjuster share links, no carrier intelligence aggregation |

### Three Moats

**1. Data moat.** Every claim processed adds to carrier intelligence: what line items each carrier approves/denies by loss type and region, how long each carrier/adjuster takes to respond, what documentation each carrier actually requires. A competitor launching 12 months later needs thousands of claims across hundreds of carriers to replicate.

**2. Two-sided network.** Once 500 adjusters receive claims through ClaimRelay, contractors need to be on ClaimRelay to reach them. Once contractors are on it, adjusters get used to clean, complete documentation. Switching costs grow on both sides.

**3. Compounding AI.** Supplement detection trained on 100 claims is okay. Trained on 10,000 claims with outcome data (was the supplement approved? for how much?) is something no one can buy.

### Verisk Positioning

ClaimRelay is "Xactimate's best friend." Every claim still uses Xactimate for estimating and XactAnalysis for routing. ClaimRelay adds the intelligence layer. Verisk should love this, not fear it. Best-case outcome at Phase 4: Verisk acquires ClaimRelay to add the contractor intelligence layer they've never built.

### Potential Acquirers (18-36 Month Horizon)

Verisk/Xactware, CoreLogic, ServiceTitan, Jobber, or PE roll-ups consolidating the restoration industry.

---

## 7. Technical Evolution Plan

### What Exists Today

The `~/ClaimRelay/` scaffold: Next.js 14 App Router, Supabase (auth + DB + storage), shadcn/ui, Tailwind, full database schema (companies, users, carriers, claims, claim_documents, claim_line_items, supplements, payments, claim_communications), middleware auth.

### Phase 1: Complete MVP + API-First Refactor

**Keep everything in the existing 30-day build spec.** Two architectural shifts:

**Shift 1: API Routes as source of truth.**
All data flows through Next.js API routes. Dashboard pages call API routes, not Supabase directly. This means the internal API already exists when you need to expose it externally.

```
Dashboard Page -> /api/claims -> Supabase
```

Route structure:
- `app/api/claims/` -- CRUD, filtering, search
- `app/api/claims/[id]/documents/` -- upload, list, delete
- `app/api/claims/[id]/estimate/` -- ESX upload + parse
- `app/api/claims/[id]/analyze/` -- AI supplement gap detection
- `app/api/claims/[id]/timeline/` -- activity log
- `app/api/claims/[id]/share/` -- generate adjuster link
- `app/api/carriers/` -- CRUD + profiles
- `app/api/carriers/[id]/guidelines/` -- carrier-specific requirements

**Shift 2: Activity logging from day one.**

```sql
claim_activity
  id uuid PK
  claim_id uuid FK -> claims
  actor_type text ('contractor', 'adjuster', 'system')
  actor_id uuid (nullable -- guest adjusters won't have one initially)
  action text ('viewed_claim', 'viewed_document', 'uploaded_photo',
               'sent_message', 'updated_status', 'ran_ai_analysis',
               'adjuster_opened_link', 'adjuster_viewed_photos',
               'adjuster_responded', 'adjuster_requested_info')
  metadata jsonb (flexible -- document IDs viewed, time spent, etc.)
  created_at timestamptz
```

### Phase 2: Adjuster Portal

**New database tables:**

```sql
adjuster_profiles
  id uuid PK
  email text UNIQUE NOT NULL
  full_name text
  company_name text
  phone text
  adjuster_type text ('independent', 'staff', 'desk', 'tpa')
  is_registered boolean DEFAULT false
  created_at timestamptz

claim_shares
  id uuid PK
  claim_id uuid FK -> claims
  shared_by uuid FK -> users
  adjuster_email text NOT NULL
  adjuster_id uuid FK -> adjuster_profiles (nullable)
  share_token text UNIQUE NOT NULL
  permissions text ('view', 'view_respond', 'full')
  status text ('pending', 'viewed', 'active', 'expired')
  first_viewed_at timestamptz
  last_viewed_at timestamptz
  view_count integer DEFAULT 0
  created_at timestamptz
  expires_at timestamptz

claim_messages
  id uuid PK
  claim_id uuid FK -> claims
  sender_type text ('contractor', 'adjuster')
  sender_id uuid
  message text NOT NULL
  attachments jsonb
  read_at timestamptz
  created_at timestamptz

info_requests
  id uuid PK
  claim_id uuid FK -> claims
  requested_by uuid FK -> adjuster_profiles
  description text NOT NULL
  status text ('open', 'fulfilled', 'cancelled')
  fulfilled_at timestamptz
  fulfilled_with uuid FK -> claim_documents (nullable)
  created_at timestamptz
```

**New routes:**
- `app/c/[token]/` -- public adjuster claim view (no auth required)
- `app/adjuster/` -- registered adjuster dashboard
- `app/adjuster/claims/` -- incoming claims feed
- `app/adjuster/claim/[id]/` -- adjuster's claim view
- `app/api/share/` -- create/manage share links
- `app/api/messages/` -- claim message threads
- `app/api/adjuster/` -- adjuster registration, profile

**Notification system:**
- Supabase Realtime for in-app notifications
- Resend for email notifications (nudges, digests, escalation alerts)
- Notification preferences table

### Phase 3: Intelligence Engine

**New tables:**

```sql
carrier_guidelines
  id uuid PK
  carrier_id uuid FK -> carriers
  loss_type text
  state text
  required_documents jsonb
  common_denials jsonb
  markup_allowances jsonb
  estimate_tips text
  source text ('manual', 'crowdsourced', 'ai_derived')
  confidence_score decimal
  updated_at timestamptz

carrier_benchmarks
  id uuid PK
  carrier_id uuid FK -> carriers
  region text
  loss_type text
  metric_type text ('avg_days_to_first_payment', 'avg_days_to_close',
                     'supplement_approval_rate', 'avg_payment_vs_estimate_ratio',
                     'avg_response_time_days')
  value decimal
  sample_size integer
  period text
  updated_at timestamptz

ai_analysis_results
  id uuid PK
  claim_id uuid FK -> claims
  analysis_type text ('supplement_gap', 'pre_submission_check', 'estimate_review')
  input_summary jsonb
  findings jsonb
  accepted_findings integer
  outcome jsonb
  created_at timestamptz
```

**Aggregation pipeline:** Nightly Supabase Edge Function recalculates carrier_benchmarks from anonymized claim data. Companies opt in to data sharing. Benchmarks only published when sample_size >= 20.

### Phase 4: External API

- API key management table
- Rate limiting middleware
- API versioning (`/api/v1/`)
- Webhook delivery system
- OpenAPI/Swagger auto-generated docs
- Developer portal at `claimrelay.com/developers`

### Infrastructure Scaling Path

| Stage | Users | Infrastructure |
|-------|-------|---------------|
| Launch | 1-10 companies | Supabase free/Pro, Vercel free/Pro |
| Traction | 10-50 companies | Supabase Pro, Vercel Pro, Edge Functions for background jobs |
| Growth | 50-200 companies | Supabase Team, consider dedicated Postgres, Redis for caching |
| Scale | 200+ companies | Evaluate self-hosted Postgres + custom auth if cost demands |

---

## Strategic Decisions Locked In

- **Complement Verisk** -- own the intelligence layer, not the pipes
- **Revenue-first** -- bootstrap to $10K MRR, then evaluate funding
- **Independent adjusters as beachhead** -- 40K IAs, tool-agnostic, incentivized to close fast
- **Adjuster value props layered:** faster resolution first, then supplement reduction, then shared workspace
- **API-first architecture** -- own UI consumes own API from day one
- **Adjusters free forever** -- they're the network effect, contractors are the revenue

## Key Risks

1. **Verisk blocks API access** -- Mitigated by positioning as complementary. ClaimRelay drives more claims through Xactimate, not fewer.
2. **Adjusters won't click links** -- Mitigated by zero-friction design (no login, no signup). If an adjuster can open email, they can use ClaimRelay.
3. **Carrier data takes too long to aggregate** -- Mitigated by manual curation from Rehab Restoration's real knowledge for the first 10 carriers. Crowdsourcing kicks in at 50+ customers.
4. **Big player copies it** -- Mitigated by data moat. The intelligence layer is only valuable with claim outcome data, which requires time and adoption.

## Field Intelligence

From Jared (works with Scott at Rehab Restoration), 2026-04-06:
- The sooner an adjuster sees photos and documentation, the faster the claim closes
- Currently they email photos or download from JobNimbus and re-send -- manual and slow
- One adjuster with 25 years at the company won't communicate and knows he can't get fired
- Every carrier has different estimate guidelines with no standardized process
- Some carriers have their own portals, others accept email -- contractors juggle all of them

These pain points directly shaped the "idiot-proof" communication system, carrier submission profiles, and the share-link viral mechanic.
