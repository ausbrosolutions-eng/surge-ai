# Surge Internal Systems — Design Spec
**Date:** 2026-04-25
**Status:** Draft, awaiting Austin approval
**Supersedes:** Parts of `docs/surge/07-surge-internal-flywheel.md` and `docs/surge/08-surge-platform-architecture.md` (those remain valid as strategy; this is the build contract)

---

## The Problem We're Solving

Austin's biggest operational pain right now is information capture latency. Both Scott (Rehab Restoration) and Hayden (Black Wolf Roofing) required 3-5 calls each before Surge had enough context to recommend the right priorities. That cycle is the bottleneck:

1. Slows time-to-revenue (a deal that should close in 14 days closes in 45)
2. Turns warm prospects cold (excitement decays between call 2 and call 4)
3. Burns Austin's calendar on context-gathering instead of advising
4. Creates client drop-off risk (every extra call is another chance to lose them)

Surge's pitch is "we install the operational systems so your business runs without you." If Surge runs on memory and Google Docs, the pitch undercuts itself the moment a prospect asks "show me how *you* run."

This spec defines the system that makes Surge's own operations the demo of what Surge sells.

## Architecture: Hybrid (Buy + Build)

Three custom modules sit on a single Supabase database. SaaS handles commodities (booking, recording, cadences, e-sign, payments). Custom code owns differentiators (AI brief, blueprint deliverable, client portal).

```
┌──────────────────────────────────────────────────────────────┐
│  Surge CRM Core                                              │
│  (Supabase Postgres + Auth + RLS)                            │
│  ingests via webhook: GHL, Fathom, PandaDoc, Stripe, n8n     │
└──────────────────────────────────────────────────────────────┘
              │                            │
              ▼                            ▼
   ┌──────────────────────┐    ┌─────────────────────────┐
   │  AI Layer            │    │  Client Portal          │
   │  (Anthropic SDK)     │    │  (Next.js App Router)   │
   │  • Prep brief        │    │  • Build-out progress   │
   │  • Follow-up draft   │    │  • Loom video feed      │
   │  • Blueprint gen     │    │  • Health dashboard     │
   │  • SOW draft         │    │  • Change request inbox │
   └──────────────────────┘    └─────────────────────────┘
```

## Tool Stack (Final Picks)

| Layer | Tool | Cost | Why |
|---|---|---|---|
| Booking + calendar | GoHighLevel | (already paid) | Already in stack as agency resell tool; calendar included free |
| Intake form | Fillout | $25/mo | Best webhook payload + conditional logic; cleanly themable |
| Call recording + transcript | Fathom | $0 | Unlimited, no token caps, clean transcript export |
| Cadences (SMS + email) | GoHighLevel | (already paid) | Kitchen sink — handles A2P 10DLC compliance for you |
| E-sign | PandaDoc | $35/mo | Variable substitution beats DocuSign for templated SOWs |
| Payments + invoicing | Stripe | transaction fee only | Universal default |
| Workflow glue | n8n self-hosted | ~$5/mo Hetzner | Already in stack per global CLAUDE.md |
| Demo videos | Loom | $0 → $8/mo | Free is fine until volume requires upgrade |
| Transactional email | Resend | included free tier | Already in `package.json` |
| AI | Anthropic SDK (Claude Opus 4.7) | ~$50–200/mo at projected use | Already in `package.json` |
| Hosting | Vercel | $20/mo Pro | Already deployed |
| Database + auth | Supabase | $25/mo Pro | Already in `package.json` |

**All-in monthly:** ~$110–$280 for fixed software, plus usage-based AI/payments.

## Build Modules

### Module 1: CRM Core (single source of truth)

Supabase Postgres holds the canonical record. Webhooks from every SaaS write to it. Custom UI reads from it.

**New tables (added to existing schema):**

```sql
-- People in the funnel before they sign
prospects (
  id, company_name, contact_name, role, email, phone, linkedin_url,
  trade, annual_revenue_range, team_size, city, state,
  source, referral_source,
  tier int (1-3), icp_score int (6-30),
  stage text (unreached | first_touch | replying | call_booked
              | discovery_done | brief_delivered | sow_sent
              | signed | lost),
  trigger_event text, trigger_event_date date,
  created_at, updated_at
)

-- Raw intake form responses (one row per submission)
intake_responses (
  id, prospect_id, calendly_event_id, raw_payload jsonb,
  q_revenue, q_team_size, q_tech_stack,
  q_top_pain, q_biggest_lever, q_decision_makers, q_timing,
  submitted_at
)

-- AI-generated prep brief, regenerated when signals fire
prep_briefs (
  id, prospect_id, generated_at, model_used,
  brief_markdown text,
  brief_json jsonb,  -- structured for re-rendering
  email_sent_at timestamp
)

-- Call recording metadata (mirrored from Fathom webhook)
call_recordings (
  id, prospect_id, fathom_recording_id,
  recording_url, transcript_url, duration_seconds,
  participants text[], started_at
)

-- AI-drafted follow-up email + extracted action items
call_summaries (
  id, call_recording_id, prospect_id,
  draft_subject, draft_body,
  edited_subject, edited_body,
  action_items jsonb,
  next_step text, next_step_date date,
  sent_at timestamp
)

-- Outbound touches mirrored from GHL
cadence_events (
  id, prospect_id, ghl_event_id,
  channel text (sms | email),
  template_name text, sent_at, opened_at, replied_at,
  status text (queued | sent | bounced | replied | unsubscribed)
)

-- Generated blueprint deliverables
blueprints (
  id, prospect_id, version int, generated_at,
  current_state jsonb, target_state jsonb,
  recommendations jsonb, ninety_day_plan jsonb,
  pdf_url text, delivered_at timestamp
)

-- SOW + contracting flow
sows (
  id, prospect_id, blueprint_id, version int,
  scope_markdown text, scope_jsonb jsonb,
  pandadoc_envelope_id text, pandadoc_status text,
  sent_at, signed_at
)

invoices (
  id, prospect_id, stripe_invoice_id,
  amount_cents int, status text, paid_at timestamp
)

-- After signing: client build-out portal data
build_milestones (
  id, client_id, title, description,
  status text (planned | in_progress | shipped),
  loom_url text, screenshot_url text,
  shipped_at timestamp,
  notify_client boolean
)

-- Maintenance phase health
health_metrics (
  id, client_id, metric_name, current_value numeric,
  target_value numeric, trend text, captured_at
)
```

RLS rules:
- `auth.uid() = austin_user_id` → full access (admin)
- `auth.uid() = client.owner_user_id` → can read their own client + build_milestones + health_metrics

### Module 2: AI Layer

Four Claude-powered text generators. Each is a single Next.js API route invoked by webhook or button click.

**2a. Prep brief generator** (`POST /api/ai/prep-brief`)
- Trigger: `intake_responses` row inserted via Fillout webhook
- Input: intake responses + any prior calls + signal feed
- Output: structured brief saved to `prep_briefs`, emailed to Austin via Resend
- Uses prompt caching (system prompt + Surge knowledge base cached, intake responses are the variable input)

**2b. Follow-up draft generator** (`POST /api/ai/follow-up`)
- Trigger: `call_recordings` row inserted via Fathom webhook
- Input: full transcript + intake responses + prep brief
- Output: drafted subject + body + action items saved to `call_summaries`, surfaces in `/dashboard/calls/[id]` for Austin to review/edit/send
- Honors no-em-dashes rule from CLAUDE.md

**2c. Blueprint generator** (`POST /api/ai/blueprint`)
- Trigger: Manual button on prospect page after discovery + (optionally) follow-up call
- Input: all intake + all call summaries + prospect record + Surge knowledge base
- Output: structured blueprint saved to `blueprints`, rendered as Surge-branded PDF (reuses existing brand system + ReportLab pattern from `clients/black-wolf-roofing/scripts/build-sow-pdf.py`), delivered to prospect via tracked email
- Mobile-first 6×9 per existing Surge brand standard

**2d. SOW draft generator** (`POST /api/ai/sow`)
- Trigger: Manual button after prospect picks one of the 3 offerings
- Input: blueprint + selected offering + standard pricing matrix
- Output: scope markdown + pricing → PandaDoc template via API → envelope sent for signing
- On signed webhook from PandaDoc, triggers Stripe invoice generation

**Prompt strategy:** All four generators follow the same pattern:
1. System prompt (cached): Surge knowledge base + brand voice rules + no-em-dashes rule + the relevant skill (e.g., `surge-build-sow` for SOW)
2. User prompt (not cached): the specific prospect's data
3. Output: structured JSON for storage + markdown for human-readable rendering

### Module 3: Client Portal

What Austin's signed clients see. The retention engine.

**Routes:**
- `/portal/[clientId]` — Live build-out dashboard (post-sign, pre-maintenance)
- `/portal/[clientId]/maintenance` — Once build-out is done

**Build-out portal features:**
- Project ticker: "Day 14 of 90. 8 of 22 milestones shipped."
- Milestone feed (newest first), each card has: title, description, optional Loom embed, optional before/after screenshot, "shipped" timestamp
- Time saved estimate: "You've saved an estimated 47 admin hours this month thanks to the new lead routing"
- Upcoming milestones (next 5)
- Comment thread per milestone (client can ask questions, Austin responds)
- Weekly digest email (Mondays 8am) — auto-summarizes shipped milestones from prior week

**Maintenance portal features:**
- Health dashboard (5–8 KPIs Austin defines per client)
- Change request inbox (client submits → routed to n8n → ticket in Austin's CRM)
- Monthly auto-generated maintenance report
- Renewal trigger 30 days before contract end

## The Intake Form (Fillout, 10 questions)

Front-loads SPIN's Situation layer + BANT so the discovery call jumps straight to Problem + Implication.

**Section 1 — About you (3 Q):**
1. Your name + role at the business
2. Business name + website + main service area
3. How did you hear about Surge? (referral, podcast, social, search, other)

**Section 2 — The business as it is (3 Q):**
4. Annual revenue range (dropdown: <$500K, $500K–1M, $1–3M, $3–10M, $10M+)
5. Team size (full-time + contractor, two number fields)
6. Quick rundown of your current tech stack — CRM, comms tools, accounting (free text, 2–3 sentences)

**Section 3 — The pain (2 Q):**
7. What's the #1 thing slowing your business down right now? (free text, 2–3 sentences)
8. If we could 10× one part of your business in the next 90 days, what would have the biggest impact? (multi-select: Lead generation, Sales close rate, Operations efficiency, Customer experience, Team performance, Other)

**Section 4 — The decision (2 Q):**
9. Beyond you, who else needs to be involved in deciding to work with us? (free text)
10. Realistically, when do you want changes in place? (dropdown: Yesterday — emergency, Within 30 days, 60–90 days, 90+ days, Just exploring)

~5 minutes to complete. Form is embedded on `surgeadvisory.co/work-together` and required before booking confirms.

## The Prep Brief (1-page Austin reads before each call)

Generated by Claude when `intake_responses` lands. Emailed to Austin 30 min before call. Also viewable at `/dashboard/prep/[prospectId]`.

**Format:**

```
SURGE PREP BRIEF
[Business] — [Owner Name] — [Date/Time]

THE 30-SECOND BRIEF
[2-3 sentences: who they are, why they booked, what they want]

PAIN HYPOTHESIS
Stated pain (what they wrote): [from Q7]
Likely real pain (Claude inference): [based on industry + signals]
Lost revenue math: $[X]/mo lost to [Y]
  Reasoning: [show the work]

DECISION DYNAMICS
Decision-makers identified: [from Q9]
Likely champion vs economic buyer: [Claude inference]
Timing pressure: [from Q10]
Authority signal: [Q9 answer interpreted]

3 SPIN QUESTIONS TO ASK
1. [Implication question tailored to their pain]
2. [Implication question on cost of inaction]
3. [Need-payoff question]

3 THINGS NOT TO ASK (already in intake)
[Auto-listed from filled fields — saves Austin from rehashing]

TRIGGER SIGNALS
[Any flagged events: hiring posts, recent reviews, expansion news]

SURGE OFFERING FIT
Most likely fit: [Business Infrastructure / AI Integration / AI Lead Gen]
Why: [reasoning tied to their stated pain + business size]
Lead with: [specific opener Austin can paraphrase]

ESTIMATED TICKET
Likely engagement size: $[range]
Path to retainer: [Phase 1 → 2 → 3 progression sketch]
```

## The Post-Call Follow-Up (drafted in `/dashboard/calls/[id]`)

Auto-generated when Fathom webhook delivers transcript. Austin reviews, edits, sends from his Gmail (Resend handles delivery).

**Format:**

```
Subject: [Their first name] — quick recap + next step

[Personalized opener referencing one specific moment from the call]

What you said you're trying to solve:
- [3 bullets pulled from transcript, in their words]

What I heard between the lines:
- [1-2 insights showing Austin listened deeply, ties to a Surge angle]

Recommended next step:
[Concrete: "I'll have your blueprint to you by [date]" OR
 "Let's get [stakeholder] on a 30-minute call by [date]" OR
 "I'd start with the audit — here's what we cover"]

Action items I have:
- [What Austin will do, with date]

Action items on your side:
- [What they need to provide / confirm, with date]

Thanks,
Austin
```

No em dashes (per CLAUDE.md). Plain signature, no `— Austin` sign-off.

## The Blueprint (the deliverable that justifies the engagement)

Surge-branded PDF, mobile-first 6×9, generated using existing brand system. Generated by Module 2c.

**Sections:**
1. Cover page — Surge wordmark, "Business Blueprint for [Business Name]", date, prepared by Austin
2. Where you are now — current state diagnosis (3-5 paragraphs synthesized from intake + call notes)
3. Where you're trying to go — restated in their own language from the call
4. The 3 highest-leverage shifts — prioritized by ROI × ease × time-to-value
5. The 90-day path — week-by-week, owner-by-owner action plan
6. How Surge can help — maps each recommendation to one of the 3 offerings (Business Infrastructure, AI Integration, AI Lead Gen)
7. Investment ranges — engagement sizes, no hard quote (frames the SOW)
8. Next steps — book the SOW conversation

Format: PDF generated via existing ReportLab pipeline (see `clients/black-wolf-roofing/scripts/build-sow-pdf.py`).

## The 3 Productized Offerings

1. **Business Infrastructure** — operational backbone (CRM setup, sales process, follow-up systems, reporting). Best fit for businesses with leaks in the pipeline.
2. **AI Integration** — Claude in the workflow (intake automation, document generation, summary generation, copilot setup). Best fit for businesses already operationally clean but admin-heavy.
3. **AI Lead Gen** — outbound sequences, signal monitoring, AEO/GEO, content generation. Best fit for businesses with capacity to absorb more leads.

Each has Phase 1 / Phase 2 / Phase 3 progression mirroring existing Rehab playbook (Phase 1 = build, Phase 2 = optimize, Phase 3 = maintenance retainer).

## Codebase Structure

Extends existing `app/dashboard` routes. Legacy 9-module client view stays put; new Surge consulting flow layers in:

```
app/
  dashboard/
    page.tsx                    # Cockpit (extend existing)
    pipeline/page.tsx           # NEW: prospect pipeline
    prep/[prospectId]/page.tsx  # NEW: prep brief view
    calls/[callId]/page.tsx     # NEW: call summary + follow-up draft
    blueprints/[blueprintId]/page.tsx  # NEW: blueprint preview + send
    sows/[sowId]/page.tsx       # NEW: SOW draft + PandaDoc trigger
    clients/[id]/
      page.tsx                  # Existing 9-module view (kept)
      build/page.tsx            # NEW: Austin's view of client build progress
      maintenance/page.tsx      # NEW: maintenance retainer dashboard
  portal/                       # NEW: client-facing routes (separate auth)
    [clientId]/
      page.tsx                  # Build-out portal
      maintenance/page.tsx      # Maintenance portal
  api/
    webhooks/
      fillout/route.ts          # NEW: intake form ingestion
      fathom/route.ts           # NEW: call recording + transcript
      pandadoc/route.ts         # NEW: e-sign status updates
      stripe/route.ts           # NEW: payment events
      ghl/route.ts              # NEW: cadence event sync
    ai/
      prep-brief/route.ts       # NEW: prep brief generator
      follow-up/route.ts        # NEW: follow-up draft generator
      blueprint/route.ts        # NEW: blueprint generator
      sow/route.ts              # NEW: SOW draft generator

lib/
  supabase/                     # NEW: Supabase client + server helpers
  ai/
    prompts/                    # NEW: cached system prompts
    schemas/                    # NEW: Zod schemas for AI outputs
  pdf/
    blueprint.ts                # NEW: blueprint PDF generation
```

Migration approach: build new routes alongside existing. No deletion of legacy 9-module client view until the new system is proven.

## Failure Modes + Mitigations

- **Webhook delivery failures** — every webhook receiver writes raw payload to `webhook_events` table before processing. Reprocess from raw on failure.
- **AI generation failures** — every API route catches Anthropic errors, surfaces to Austin via dashboard banner with retry button. Never silently fails.
- **PandaDoc rate limits** — n8n queue with retry/backoff between Surge CRM and PandaDoc API.
- **Fathom transcript delays** — UI shows "transcript pending" state for up to 30 min before alerting Austin.
- **Email deliverability** — use Resend for transactional, GoHighLevel for cadences (which handles warmup + reputation), never blend.

## Out of Scope (explicitly)

- Client-facing portal v1 ships read-only. Comments, change requests, and chat come in v2.
- Blueprint generator v1 produces a strong first draft Austin edits. Fully autonomous blueprint generation comes after 5+ blueprints have been hand-tuned.
- Multi-user / team accounts inside the dashboard. Austin is the only operator until volume justifies hires.
- White-label client portal (sub-domains per client). Defer to v3.
- Mobile app. Web responsive only.
- Direct ServiceTitan/JobNimbus integration for clients. Defer until first client requests it.

## Success Criteria

The system works if, 90 days after launch:

1. New prospects fill intake before booking, and Austin walks into the call with a one-page brief he didn't write
2. Post-call follow-up email is drafted within 5 minutes of call end, sent within 1 hour
3. Blueprints are generated within 24 hours of the discovery call, not 5 calls and 3 weeks later
4. Average discovery-to-signed cycle drops from 30+ days (current) to under 14 days
5. Three signed clients view their build-out portal at least once per week without prompting
6. Austin can answer "how many active prospects, by stage?" in under 10 seconds

---

## Open Questions for Austin (review before implementation plan)

1. **Tool swaps:** Already paying for any of these? Want to swap any pick? (GHL is the most likely "I already have a different tool")
2. **Domain decisions:** Use existing `surgeadvisory.co` for the portal subdomain (`portal.surgeadvisory.co`), or a separate domain?
3. **Cold-email infra:** Existing `docs/surge/07-surge-internal-flywheel.md` mentions `getsurgeadvisory.co` as a secondary domain for cold outreach. Confirm we still want that, or use GHL's domain warm-up?
4. **Blueprint pricing tiers:** Are the 3 offerings priced as Foundation/Growth/Domination (existing tiers from `agency-operations.md`), or a new pricing model?
5. **Legacy /dashboard pages:** Keep the 9-module marketing-focused client view alongside the new Surge consulting flow, or sunset?
6. **Auth:** Supabase Auth (magic link) for clients. OK?
