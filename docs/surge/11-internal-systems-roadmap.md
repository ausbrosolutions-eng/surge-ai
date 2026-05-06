# Surge Internal Systems — Build Roadmap
**Date:** 2026-04-25
**Companion to:** `docs/superpowers/specs/2026-04-25-surge-internal-systems-design.md`
**Strategy context:** `docs/surge/07-surge-internal-flywheel.md`, `docs/surge/08-surge-platform-architecture.md`

The 6-phase build sequence to take Surge from "runs on memory and Google Docs" to "every client engagement is the demo of what Surge sells."

---

## The Sequencing Logic

Build order targets Austin's biggest pain *first*, not the sexiest deliverable first.

| Pain (today) | Phase that fixes it |
|---|---|
| 3-5 calls to gather context | Phase 1 (intake + prep brief) |
| Manual follow-ups, action items dropped | Phase 2 (post-call automation) |
| Blueprint takes 2 weeks of evening work | Phase 3 (blueprint generator) |
| SOW + invoice = 3 hours of friction | Phase 4 (contracting) |
| Clients wonder "what is Austin actually doing?" | Phase 5 (build-out portal) |
| Maintenance retainers feel like babysitting | Phase 6 (maintenance dashboard) |

Each phase is independently shippable. Each delivers measurable revenue impact before the next starts.

---

## Phase 0 — Foundation (Week 1)

**Goal:** Stand up the data layer + auth so every later phase has a place to write.

**Tasks:**
- [ ] Provision Supabase project (`surge-ops` or similar)
- [ ] Run initial schema migration (all tables in design doc, RLS policies)
- [ ] Set up Supabase Auth with magic link
- [ ] Wire `lib/supabase/{client,server}.ts` helpers
- [ ] Add Supabase env vars to Vercel project
- [ ] Backfill any existing prospect data (from current localStorage if relevant)
- [ ] Set up `webhook_events` raw-payload table for replay safety

**SaaS sign-ups in parallel (Austin):**
- [ ] Confirm GoHighLevel access (calendar + cadences)
- [ ] Sign up for Fillout ($25/mo)
- [ ] Sign up for Fathom (free)
- [ ] Sign up for PandaDoc ($35/mo)
- [ ] Confirm Stripe account active
- [ ] Spin up n8n self-hosted (Hetzner $5 box) OR n8n cloud ($20)
- [ ] Confirm Anthropic API key in env

**Done when:** dashboard loads with Supabase auth working, schema deployed, all SaaS accounts active and credentialed.

---

## Phase 1 — Intake + Prep Brief (Weeks 2-3)

**Goal:** Stop the "3-5 calls to get context" bleed.

**Why first:** Every other phase compounds on the data captured here. The pain is acute *today*. ROI shows up on the very first prospect who fills the form.

**Tasks:**
- [ ] Build Fillout intake form using 10 questions from spec
- [ ] Brand the form (Surge palette per brand system)
- [ ] Embed on `surgeadvisory.co/work-together` (or dedicated subpath)
- [ ] Configure Fillout → GHL handoff so booking only confirms after intake submission
- [ ] Build webhook receiver: `app/api/webhooks/fillout/route.ts`
- [ ] Persist to `prospects` + `intake_responses` tables
- [ ] Build prep brief generator: `app/api/ai/prep-brief/route.ts`
  - Cache system prompt (Surge knowledge base + brief format spec)
  - User prompt = intake responses + any matched signals
  - Output structured JSON + markdown
- [ ] Send prep brief to Austin's inbox via Resend, 30 min before call (cron via Vercel scheduled function)
- [ ] Build prep brief view at `app/dashboard/prep/[prospectId]/page.tsx`
- [ ] Build minimal pipeline view at `app/dashboard/pipeline/page.tsx` (list of prospects by stage)

**Calibration ritual after first 3 briefs:**
- Austin reads each brief, marks "what's missing" or "what's wrong"
- Iterate the prompt until brief consistently saves Austin 30+ minutes of pre-call prep

**Done when:** 3 consecutive prospects book through the form, intake captured, brief auto-generated, Austin walks into call without manually preparing.

**Estimated build time:** 12-16 hours of focused work.

---

## Phase 2 — Post-Call Follow-Up (Weeks 4-5)

**Goal:** Every call ends with a sent follow-up email + tracked action items, within 1 hour.

**Tasks:**
- [ ] Configure Fathom to auto-join GHL-booked calls
- [ ] Build webhook receiver: `app/api/webhooks/fathom/route.ts`
- [ ] Persist to `call_recordings` table (recording URL, transcript URL, duration, participants)
- [ ] Build follow-up draft generator: `app/api/ai/follow-up/route.ts`
  - Cache system prompt (Surge voice rules + no em dashes + follow-up format)
  - User prompt = transcript + intake + prep brief
  - Output drafted subject, body, action items, next-step recommendation
- [ ] Build call summary view: `app/dashboard/calls/[callId]/page.tsx`
  - Shows transcript + draft email side-by-side
  - Edit + send via Resend (or copy to Gmail)
  - Action items become tasks in dashboard
- [ ] Update `prospects.stage` on send (e.g., `discovery_done` → `brief_delivered`)

**Done when:** Follow-up draft is in Austin's dashboard within 5 min of call ending; sending is one click.

**Estimated build time:** 8-12 hours.

---

## Phase 3 — Blueprint Generator (Weeks 6-10)

**Goal:** The premium deliverable, generated within 24 hours of discovery, not 2 weeks.

**Why this takes 4-5 weeks:** The blueprint IS the product. Quality matters more than speed. Expect 5-10 iterations on the prompt + format before output is consistently sellable.

**Tasks:**
- [ ] Define blueprint Zod schema (cover, current state, target state, recommendations, 90-day plan, offering fit, investment ranges, next steps)
- [ ] Build blueprint generator: `app/api/ai/blueprint/route.ts`
  - Cache system prompt (Surge knowledge base + blueprint format + brand voice)
  - User prompt = all intake + all call summaries + prospect record
  - Output structured JSON
- [ ] Build PDF generator: `lib/pdf/blueprint.ts`
  - Reuse existing Surge brand system (palette, mobile-first 6×9, letterhead)
  - Reference: `clients/black-wolf-roofing/scripts/build-sow-pdf.py` pattern
- [ ] Build blueprint preview view: `app/dashboard/blueprints/[blueprintId]/page.tsx`
  - Render markdown preview
  - Edit fields inline
  - Regenerate sections
  - "Send to prospect" → email PDF via Resend with tracking pixel
- [ ] Track engagement: did they open it, did they click, time on page
- [ ] Migrate Rehab + Black Wolf existing blueprints into new format as templates

**Calibration loop:**
- Generate blueprint for a real prospect
- Austin edits to "ship-ready"
- Diff edits against original output
- Tune prompt
- Repeat until edit volume drops below 20%

**Done when:** Blueprint can be generated → reviewed → sent in under 90 minutes total.

**Estimated build time:** 30-50 hours (most goes into prompt iteration, not code).

---

## Phase 4 — Contracting + Billing (Weeks 11-12)

**Goal:** Signed agreement + sent invoice in under 30 minutes from prospect saying "yes."

**Tasks:**
- [ ] Build SOW draft generator: `app/api/ai/sow/route.ts`
  - Reuses `surge-build-sow` skill content as prompt input
  - Uses canonical Surge brand system
  - Output: scope markdown + line items + pricing
- [ ] Build SOW review view: `app/dashboard/sows/[sowId]/page.tsx`
- [ ] Integrate PandaDoc API for envelope creation + send
- [ ] Build PandaDoc webhook receiver: `app/api/webhooks/pandadoc/route.ts`
- [ ] On `signed` event: trigger Stripe invoice via API
- [ ] Build Stripe webhook receiver: `app/api/webhooks/stripe/route.ts`
- [ ] On `paid` event: update `prospects.stage` → `signed`, create `client` record, kick off Phase 5 onboarding

**Done when:** Single dashboard button takes a prospect from "blueprint approved" through SOW → e-sign → invoice → client created.

**Estimated build time:** 20-30 hours.

---

## Phase 5 — Client Build-Out Portal (Months 4-5)

**Goal:** Signed clients have a single URL where they can see what Surge is shipping in their business in real time.

**Why this matters:** The portal IS the retention engine. Clients who can see weekly progress don't churn.

**Tasks:**
- [ ] Build `app/portal/[clientId]/page.tsx` with separate auth (magic link, scoped via RLS)
- [ ] Build milestone management UI for Austin: `app/dashboard/clients/[id]/build/page.tsx`
- [ ] Build milestone feed component (cards with title, description, Loom embed, screenshot, shipped timestamp)
- [ ] Build project ticker (X of Y milestones shipped, days elapsed, on-track indicator)
- [ ] Build time-saved estimator (Austin enters "this milestone saves N hours/week" → portal shows running total)
- [ ] Build weekly digest email cron (Mondays 8am): "This week we shipped X, Y, Z"
- [ ] Wire Loom video paste → embed extraction
- [ ] Wire screenshot upload → Supabase storage

**Done when:** First 2 signed clients log into portal at least once per week, unprompted.

**Estimated build time:** 40-60 hours.

---

## Phase 6 — Maintenance Dashboard (Month 6+)

**Goal:** Maintenance retainers feel like Surge is actively monitoring, not reactively babysitting.

**Tasks:**
- [ ] Build `app/portal/[clientId]/maintenance/page.tsx`
- [ ] Define 5-8 health KPIs per client (defined per engagement, stored in `health_metrics`)
- [ ] Wire data sources for KPIs (most via n8n: pulls from client's CRM, GHL, etc.)
- [ ] Build alerting: Austin gets notified when a metric trends red
- [ ] Build change request inbox (client submits → routed to Austin's CRM as task)
- [ ] Build monthly auto-generated maintenance report (Surge-branded PDF)
- [ ] Build renewal trigger 30 days before contract end → drafts renewal proposal automatically

**Done when:** Maintenance retainers renew at >80% rate without Austin manually pitching renewal.

**Estimated build time:** 40-60 hours.

---

## Total Effort Estimate

| Phase | Weeks | Hours |
|---|---|---|
| 0 — Foundation | 1 | 8-12 |
| 1 — Intake + Prep Brief | 2-3 | 12-16 |
| 2 — Post-Call Follow-Up | 4-5 | 8-12 |
| 3 — Blueprint Generator | 6-10 | 30-50 |
| 4 — Contracting + Billing | 11-12 | 20-30 |
| 5 — Client Build-Out Portal | 13-20 | 40-60 |
| 6 — Maintenance Dashboard | 21-26 | 40-60 |
| **Total to "fully built"** | **6 months** | **160-240 hours** |

That's ~7-10 hours/week if built solo while running the consulting business. Or 2-3 weeks of focused work if Austin clears calendar and hires a contractor for execution after the spec is locked.

**Revenue inflection:** Phases 1-2 ship in month 1 → discovery cycle drops from 30+ days to <14 days → conversion rate compounds. Even if Phases 3-6 slip, the first 2 phases pay for the entire build several times over.

---

## What This Roadmap Does NOT Cover (deferred)

- Multi-user accounts inside Austin's CRM (he's the only operator)
- Client-side comments / chat in build-out portal (read-only v1)
- Direct CRM integrations (ServiceTitan, JobNimbus) for client portal data — built per-client when they sign
- White-label sub-domains (per-client portal branding)
- Mobile native app
- Public marketing site redesign (separate effort if needed)

---

## How to Use This Roadmap

1. Austin reviews + approves design spec (`docs/superpowers/specs/2026-04-25-surge-internal-systems-design.md`)
2. After approval: invoke `superpowers:writing-plans` skill to convert this roadmap into per-phase implementation plans
3. Each phase becomes its own git branch, gets executed via `superpowers:executing-plans`
4. Each phase ships to production before the next begins
5. Update this roadmap whenever scope or sequencing changes
