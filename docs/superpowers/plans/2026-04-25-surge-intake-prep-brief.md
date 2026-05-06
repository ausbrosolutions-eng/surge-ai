# Surge Intake + Prep Brief — Phase 0 + Phase 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the Surge data layer + ship the intake-form-to-AI-prep-brief pipeline so every prospect call has a Claude-generated brief in Austin's inbox before he walks in.

**Architecture:** Fillout-hosted intake form posts a webhook to a Next.js API route that persists to Supabase, then triggers a Claude-powered generator that emails Austin a one-page prep brief and stores it for the dashboard view. SaaS owns booking (GHL) and form hosting (Fillout); custom code owns the data layer, the AI generation, and the dashboard surface.

**Tech Stack:** Next.js 14 App Router, TypeScript, Supabase (Postgres + Auth), Anthropic SDK (Claude with prompt caching), Resend, Zod, Vitest, Tailwind.

**Spec:** `docs/superpowers/specs/2026-04-25-surge-internal-systems-design.md`
**Roadmap:** `docs/surge/11-internal-systems-roadmap.md`

---

## File Structure

**New files:**
```
supabase/
  migrations/
    20260425000000_surge_internal_schema.sql      # prospects, intake_responses, prep_briefs, webhook_events

lib/
  supabase/
    client.ts                                     # browser-side client
    server.ts                                     # server-side client (service role for API routes)
    types.ts                                      # generated Database type from schema
  ai/
    anthropic.ts                                  # Anthropic SDK wrapper with prompt caching
    prompts/
      prep-brief-system.ts                        # cached system prompt
    schemas/
      prep-brief.ts                               # Zod schema for AI output
    generators/
      prep-brief.ts                               # main generator function
  email/
    resend.ts                                     # Resend client wrapper
    templates/
      prep-brief-email.ts                         # HTML email template (string-based, no React Email yet)

types/
  fillout.ts                                      # Fillout webhook payload type
  surge.ts                                        # Domain types (Prospect, IntakeResponse, PrepBrief)

app/
  api/
    webhooks/
      fillout/
        route.ts                                  # ingest intake submission
    ai/
      prep-brief/
        route.ts                                  # manual re-trigger of generator
  dashboard/
    pipeline/
      page.tsx                                    # prospect list by stage
    prep/
      [prospectId]/
        page.tsx                                  # render prep brief

tests/
  api/
    webhooks/
      fillout.test.ts
  ai/
    generators/
      prep-brief.test.ts
  email/
    templates/
      prep-brief-email.test.ts
  fixtures/
    fillout-payload.ts                            # sample webhook payload for tests
    intake-response.ts                            # sample stored intake

vitest.config.ts                                  # vitest setup
```

**Modified files:**
- `package.json` — add `zod`, `vitest`, `@vitejs/plugin-react`
- `app/dashboard/layout.tsx` — add nav link to `/dashboard/pipeline`
- `CLAUDE.md` — document new patterns (Supabase, AI generators)

---

## Section A — Foundation

### Task 1: Manual SaaS account checklist (Austin)

**Files:** none (manual)

- [ ] **Step 1: Confirm or set up these accounts.** All required before later sections work end-to-end.

```
[ ] GoHighLevel — confirmed (Austin already has)
[ ] Fillout — sign up at fillout.com, $25/mo Standard plan (need conditional logic + webhooks)
[ ] Fathom — sign up at fathom.video, free plan
[ ] PandaDoc — defer to Phase 4, skip for now
[ ] Stripe — defer to Phase 4, skip for now
[ ] n8n — defer to Phase 2, skip for now
[ ] Anthropic API key — confirmed (already in .env.local)
[ ] Resend — confirmed (already in .env.local)
[ ] Supabase — confirmed (already in .env.local, project surge-ai)
```

- [ ] **Step 2: Confirm domain DNS access.**

Confirm Austin can edit DNS for `surgeadvisory.co` (for later when we embed the form on `/work-together` and add `portal.surgeadvisory.co` subdomain).

---

### Task 2: Add zod + vitest dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install dependencies**

Run:
```bash
cd /Users/austin/projects/marketing-agency
npm install zod
npm install --save-dev vitest @vitejs/plugin-react @vitest/ui jsdom @testing-library/react @testing-library/jest-dom
```

Expected: `package.json` updated, `package-lock.json` updated, no errors.

- [ ] **Step 2: Verify Next.js still builds**

Run: `npm run build`
Expected: Build succeeds with no new errors.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add zod + vitest for Surge intake module"
```

---

### Task 3: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add scripts)

- [ ] **Step 1: Create vitest config**

Create `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
```

- [ ] **Step 2: Create test setup file**

Create `tests/setup.ts`:

```typescript
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Add scripts to package.json**

In `package.json`, add to `"scripts"`:

```json
"test": "vitest run",
"test:watch": "vitest",
"test:ui": "vitest --ui"
```

- [ ] **Step 4: Verify vitest runs**

Run: `npm test`
Expected: "No test files found" (no tests yet — that's correct).

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts tests/setup.ts package.json
git commit -m "chore: configure vitest for Surge module testing"
```

---

### Task 4: Create Surge-internal schema migration

**Files:**
- Create: `supabase/migrations/20260425000000_surge_internal_schema.sql`

The existing `supabase/schema.sql` has legacy agency tables (clients, leads, tasks, etc.). We add new tables for Surge consulting flow without touching the existing ones.

- [ ] **Step 1: Create the migration file**

Create `supabase/migrations/20260425000000_surge_internal_schema.sql`:

```sql
-- Surge Internal Systems — Phase 0 + 1 schema
-- Adds: prospects, intake_responses, prep_briefs, webhook_events
-- Does NOT modify existing legacy tables

-- People in the funnel before they sign
CREATE TABLE IF NOT EXISTS prospects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  role TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  linkedin_url TEXT,
  trade TEXT,
  annual_revenue_range TEXT,
  team_size_ft INT,
  team_size_pt INT,
  city TEXT,
  state TEXT,
  source TEXT,
  referral_source TEXT,
  tier INT CHECK (tier BETWEEN 1 AND 3),
  icp_score INT CHECK (icp_score BETWEEN 6 AND 30),
  stage TEXT NOT NULL DEFAULT 'new'
    CHECK (stage IN (
      'new', 'intake_complete', 'call_booked', 'discovery_done',
      'brief_delivered', 'sow_sent', 'signed', 'lost'
    )),
  trigger_event TEXT,
  trigger_event_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_prospects_stage ON prospects(stage);
CREATE INDEX idx_prospects_email ON prospects(email);

-- Raw intake form responses (one row per submission)
CREATE TABLE IF NOT EXISTS intake_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  fillout_submission_id TEXT UNIQUE,
  raw_payload JSONB NOT NULL,
  q_business_name TEXT,
  q_website TEXT,
  q_service_area TEXT,
  q_revenue_range TEXT,
  q_team_size_ft INT,
  q_team_size_pt INT,
  q_tech_stack TEXT,
  q_top_pain TEXT,
  q_biggest_lever TEXT[],
  q_decision_makers TEXT,
  q_timing TEXT,
  q_referral_source TEXT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_intake_prospect ON intake_responses(prospect_id);

-- AI-generated prep briefs
CREATE TABLE IF NOT EXISTS prep_briefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prospect_id UUID NOT NULL REFERENCES prospects(id) ON DELETE CASCADE,
  intake_response_id UUID REFERENCES intake_responses(id) ON DELETE SET NULL,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  model_used TEXT NOT NULL,
  brief_markdown TEXT NOT NULL,
  brief_json JSONB NOT NULL,
  tokens_input INT,
  tokens_output INT,
  email_sent_at TIMESTAMPTZ
);

CREATE INDEX idx_prep_briefs_prospect ON prep_briefs(prospect_id);

-- Raw webhook payload log for replay safety
CREATE TABLE IF NOT EXISTS webhook_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  event_type TEXT,
  raw_payload JSONB NOT NULL,
  signature_verified BOOLEAN NOT NULL DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  processing_error TEXT,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhook_events_source ON webhook_events(source);
CREATE INDEX idx_webhook_events_unprocessed ON webhook_events(received_at)
  WHERE processed_at IS NULL;

-- Enable RLS on all new tables (admin-only via service role for v1)
ALTER TABLE prospects ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE prep_briefs ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhook_events ENABLE ROW LEVEL SECURITY;

-- Service role bypasses RLS so API routes work; no policies for authenticated users in v1
-- (v2 will add client-scoped policies when /portal goes live)

-- updated_at trigger for prospects
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prospects_set_updated_at
  BEFORE UPDATE ON prospects
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

- [ ] **Step 2: Commit migration file**

```bash
git add supabase/migrations/20260425000000_surge_internal_schema.sql
git commit -m "feat(db): add Surge prospects + intake + prep_briefs + webhook_events schema"
```

---

### Task 5: Apply migration to Supabase remote

**Files:** none (manual + verification)

- [ ] **Step 1: Apply migration via Supabase Dashboard**

Open https://supabase.com/dashboard/project/<project-ref>/sql/new
Paste the contents of `supabase/migrations/20260425000000_surge_internal_schema.sql` and run.

Expected: 4 tables created, no errors. Verify in Table Editor that `prospects`, `intake_responses`, `prep_briefs`, `webhook_events` exist.

(Alternative: install Supabase CLI and run `supabase db push` — but since the project is already linked manually, the dashboard is faster for this one-time migration.)

- [ ] **Step 2: Quick smoke test from psql or dashboard**

Run in Supabase SQL editor:
```sql
INSERT INTO prospects (company_name, contact_name, email)
VALUES ('Test Co', 'Test Owner', 'test@example.com')
RETURNING id, stage, created_at;

DELETE FROM prospects WHERE email = 'test@example.com';
```

Expected: Insert returns a UUID with `stage = 'new'`, delete removes the row.

---

### Task 6: Wire Supabase client helpers

**Files:**
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/types.ts`

- [ ] **Step 1: Create `lib/supabase/types.ts`**

This is the manually-maintained Database type. Future iteration: generate from schema with `supabase gen types`. For now, hand-written matching the migration:

```typescript
// Hand-written Database type matching supabase/migrations/*
// TODO future: replace with `supabase gen types typescript --linked > lib/supabase/types.ts`

export type ProspectStage =
  | "new" | "intake_complete" | "call_booked" | "discovery_done"
  | "brief_delivered" | "sow_sent" | "signed" | "lost";

export interface ProspectRow {
  id: string;
  company_name: string;
  contact_name: string;
  role: string | null;
  email: string;
  phone: string | null;
  linkedin_url: string | null;
  trade: string | null;
  annual_revenue_range: string | null;
  team_size_ft: number | null;
  team_size_pt: number | null;
  city: string | null;
  state: string | null;
  source: string | null;
  referral_source: string | null;
  tier: 1 | 2 | 3 | null;
  icp_score: number | null;
  stage: ProspectStage;
  trigger_event: string | null;
  trigger_event_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntakeResponseRow {
  id: string;
  prospect_id: string;
  fillout_submission_id: string | null;
  raw_payload: Record<string, unknown>;
  q_business_name: string | null;
  q_website: string | null;
  q_service_area: string | null;
  q_revenue_range: string | null;
  q_team_size_ft: number | null;
  q_team_size_pt: number | null;
  q_tech_stack: string | null;
  q_top_pain: string | null;
  q_biggest_lever: string[] | null;
  q_decision_makers: string | null;
  q_timing: string | null;
  q_referral_source: string | null;
  submitted_at: string;
}

export interface PrepBriefRow {
  id: string;
  prospect_id: string;
  intake_response_id: string | null;
  generated_at: string;
  model_used: string;
  brief_markdown: string;
  brief_json: Record<string, unknown>;
  tokens_input: number | null;
  tokens_output: number | null;
  email_sent_at: string | null;
}

export interface WebhookEventRow {
  id: string;
  source: string;
  event_type: string | null;
  raw_payload: Record<string, unknown>;
  signature_verified: boolean;
  processed_at: string | null;
  processing_error: string | null;
  received_at: string;
}

export interface Database {
  public: {
    Tables: {
      prospects: { Row: ProspectRow; Insert: Partial<ProspectRow> & Pick<ProspectRow, "company_name" | "contact_name" | "email">; Update: Partial<ProspectRow> };
      intake_responses: { Row: IntakeResponseRow; Insert: Partial<IntakeResponseRow> & Pick<IntakeResponseRow, "prospect_id" | "raw_payload">; Update: Partial<IntakeResponseRow> };
      prep_briefs: { Row: PrepBriefRow; Insert: Partial<PrepBriefRow> & Pick<PrepBriefRow, "prospect_id" | "model_used" | "brief_markdown" | "brief_json">; Update: Partial<PrepBriefRow> };
      webhook_events: { Row: WebhookEventRow; Insert: Partial<WebhookEventRow> & Pick<WebhookEventRow, "source" | "raw_payload">; Update: Partial<WebhookEventRow> };
    };
  };
}
```

- [ ] **Step 2: Create `lib/supabase/client.ts`**

```typescript
// Browser-side Supabase client. Uses anon key. RLS enforced.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const anonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();

if (!url || !anonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
}

export const supabaseBrowser = createClient<Database>(url, anonKey);
```

- [ ] **Step 3: Create `lib/supabase/server.ts`**

```typescript
// Server-side Supabase client. Uses service role key. Bypasses RLS.
// ONLY import from API routes / server components / server actions. NEVER from client code.
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const url = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

if (!url || !serviceKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
}

export const supabaseServer = createClient<Database>(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
```

- [ ] **Step 4: Verify TypeScript compiles**

Run: `npx tsc --noEmit`
Expected: No errors related to Supabase files.

- [ ] **Step 5: Commit**

```bash
git add lib/supabase/
git commit -m "feat(db): wire Supabase client + server helpers with typed Database"
```

---

## Section B — Domain Types

### Task 7: Define Fillout webhook payload type

**Files:**
- Create: `types/fillout.ts`

Fillout's webhook payload shape: https://www.fillout.com/help/webhook-payload — the canonical reference is their docs. Below is the minimal subset we need.

- [ ] **Step 1: Create `types/fillout.ts`**

```typescript
// Fillout webhook payload — only the fields we read.
// Full schema: https://www.fillout.com/help/webhook-payload

export interface FilloutQuestion {
  id: string;
  name: string;
  type: string;
  value: string | string[] | number | boolean | null;
}

export interface FilloutCalculation {
  id: string;
  name: string;
  type: string;
  value: string | number | null;
}

export interface FilloutSubmission {
  submissionId: string;
  submissionTime: string;
  lastUpdatedAt: string;
  questions: FilloutQuestion[];
  calculations?: FilloutCalculation[];
  urlParameters?: Array<{ name: string; value: string }>;
  documents?: Array<{ id: string; name: string; url: string }>;
  quiz?: { score: number; maxScore: number };
}

export interface FilloutWebhookPayload {
  formId: string;
  formName: string;
  submission: FilloutSubmission;
}
```

- [ ] **Step 2: Commit**

```bash
git add types/fillout.ts
git commit -m "feat(types): add Fillout webhook payload types"
```

---

### Task 8: Define Surge domain types

**Files:**
- Create: `types/surge.ts`

- [ ] **Step 1: Create `types/surge.ts`**

```typescript
// Surge consulting domain types — used in app code, not the raw DB rows.
import type { ProspectStage, ProspectRow, IntakeResponseRow, PrepBriefRow } from "@/lib/supabase/types";

export type { ProspectStage, ProspectRow, IntakeResponseRow, PrepBriefRow };

export type RevenueRange =
  | "under_500k" | "500k_to_1m" | "1m_to_3m" | "3m_to_10m" | "over_10m";

export type BiggestLever =
  | "lead_generation" | "sales_close_rate" | "operations_efficiency"
  | "customer_experience" | "team_performance" | "other";

export type Timing =
  | "yesterday_emergency" | "within_30_days" | "60_to_90_days"
  | "ninety_plus_days" | "just_exploring";

export type SurgeOffering =
  | "business_infrastructure" | "ai_integration" | "ai_lead_gen";

export interface ParsedIntake {
  contactName: string;
  contactRole: string | null;
  email: string;
  phone: string | null;
  businessName: string;
  website: string | null;
  serviceArea: string | null;
  revenueRange: RevenueRange | null;
  teamSizeFt: number | null;
  teamSizePt: number | null;
  techStack: string | null;
  topPain: string | null;
  biggestLever: BiggestLever[];
  decisionMakers: string | null;
  timing: Timing | null;
  referralSource: string | null;
}
```

- [ ] **Step 2: Commit**

```bash
git add types/surge.ts
git commit -m "feat(types): add Surge domain types (ParsedIntake, offerings, ranges)"
```

---

## Section C — Webhook Ingestion

### Task 9: Test fixture for Fillout payload

**Files:**
- Create: `tests/fixtures/fillout-payload.ts`

- [ ] **Step 1: Create the fixture**

```typescript
import type { FilloutWebhookPayload } from "@/types/fillout";

export const sampleFilloutPayload: FilloutWebhookPayload = {
  formId: "form_test_123",
  formName: "Surge Intake Form",
  submission: {
    submissionId: "sub_test_456",
    submissionTime: "2026-04-25T18:00:00Z",
    lastUpdatedAt: "2026-04-25T18:00:00Z",
    questions: [
      { id: "q1", name: "Your name and role", type: "shortAnswer", value: "Hayden — Owner" },
      { id: "q2_email", name: "Email", type: "emailInput", value: "hayden@blackwolf.com" },
      { id: "q2_phone", name: "Phone", type: "phoneNumber", value: "+14805551234" },
      { id: "q3_biz", name: "Business name", type: "shortAnswer", value: "Black Wolf Roofing" },
      { id: "q3_web", name: "Website", type: "websiteInput", value: "https://blackwolf.com" },
      { id: "q3_area", name: "Service area", type: "shortAnswer", value: "Phoenix metro" },
      { id: "q4", name: "How did you hear about Surge?", type: "multipleChoice", value: "referral" },
      { id: "q5_revenue", name: "Annual revenue range", type: "dropdown", value: "1m_to_3m" },
      { id: "q5_ft", name: "Full-time team", type: "numberInput", value: 8 },
      { id: "q5_pt", name: "Part-time / contractor", type: "numberInput", value: 4 },
      { id: "q6_stack", name: "Tech stack", type: "longAnswer", value: "JobNimbus, Gmail, QuickBooks" },
      { id: "q7_pain", name: "#1 thing slowing you down", type: "longAnswer", value: "Estimates take 2 weeks to follow up on, leads going cold" },
      { id: "q8_lever", name: "Biggest 10x lever", type: "multipleChoice", value: ["sales_close_rate", "operations_efficiency"] },
      { id: "q9_dm", name: "Other decision-makers", type: "shortAnswer", value: "My ops manager Sarah" },
      { id: "q10_timing", name: "When do you want changes in place", type: "dropdown", value: "within_30_days" },
    ],
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add tests/fixtures/fillout-payload.ts
git commit -m "test: add Fillout webhook fixture"
```

---

### Task 10: Build the Fillout payload parser

**Files:**
- Create: `lib/fillout/parse.ts`
- Create: `tests/fillout/parse.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/fillout/parse.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { parseFilloutPayload } from "@/lib/fillout/parse";
import { sampleFilloutPayload } from "../fixtures/fillout-payload";

describe("parseFilloutPayload", () => {
  it("extracts contact name and email", () => {
    const parsed = parseFilloutPayload(sampleFilloutPayload);
    expect(parsed.contactName).toContain("Hayden");
    expect(parsed.email).toBe("hayden@blackwolf.com");
  });

  it("extracts business info", () => {
    const parsed = parseFilloutPayload(sampleFilloutPayload);
    expect(parsed.businessName).toBe("Black Wolf Roofing");
    expect(parsed.website).toBe("https://blackwolf.com");
    expect(parsed.serviceArea).toBe("Phoenix metro");
  });

  it("extracts revenue and team size", () => {
    const parsed = parseFilloutPayload(sampleFilloutPayload);
    expect(parsed.revenueRange).toBe("1m_to_3m");
    expect(parsed.teamSizeFt).toBe(8);
    expect(parsed.teamSizePt).toBe(4);
  });

  it("extracts pain and lever", () => {
    const parsed = parseFilloutPayload(sampleFilloutPayload);
    expect(parsed.topPain).toContain("Estimates take 2 weeks");
    expect(parsed.biggestLever).toContain("sales_close_rate");
    expect(parsed.biggestLever).toContain("operations_efficiency");
  });

  it("extracts decision context", () => {
    const parsed = parseFilloutPayload(sampleFilloutPayload);
    expect(parsed.decisionMakers).toBe("My ops manager Sarah");
    expect(parsed.timing).toBe("within_30_days");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/fillout/parse.test.ts`
Expected: FAIL with "Cannot find module '@/lib/fillout/parse'".

- [ ] **Step 3: Implement the parser**

Create `lib/fillout/parse.ts`:

```typescript
import type { FilloutWebhookPayload, FilloutQuestion } from "@/types/fillout";
import type { ParsedIntake, RevenueRange, BiggestLever, Timing } from "@/types/surge";

// Lookup helpers — match by question id substring (resilient to label changes)
function findByIdContains(qs: FilloutQuestion[], idFragment: string): FilloutQuestion | undefined {
  return qs.find((q) => q.id.includes(idFragment));
}

function asString(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;
  if (Array.isArray(v)) return v.join(", ");
  return String(v);
}

function asNumber(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : null;
}

function asArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map(String);
  if (v === null || v === undefined || v === "") return [];
  return [String(v)];
}

const REVENUE_VALUES: RevenueRange[] = ["under_500k", "500k_to_1m", "1m_to_3m", "3m_to_10m", "over_10m"];
const LEVER_VALUES: BiggestLever[] = ["lead_generation", "sales_close_rate", "operations_efficiency", "customer_experience", "team_performance", "other"];
const TIMING_VALUES: Timing[] = ["yesterday_emergency", "within_30_days", "60_to_90_days", "ninety_plus_days", "just_exploring"];

function asEnum<T extends string>(v: unknown, allowed: T[]): T | null {
  const s = asString(v);
  return s && (allowed as string[]).includes(s) ? (s as T) : null;
}

function asEnumArray<T extends string>(v: unknown, allowed: T[]): T[] {
  return asArray(v).filter((s): s is T => (allowed as string[]).includes(s));
}

export function parseFilloutPayload(payload: FilloutWebhookPayload): ParsedIntake {
  const qs = payload.submission.questions;
  const nameRoleRaw = asString(findByIdContains(qs, "q1")?.value) || "";
  const [contactName, contactRole] = nameRoleRaw.includes("—") || nameRoleRaw.includes("-")
    ? nameRoleRaw.split(/[—-]/).map((s) => s.trim())
    : [nameRoleRaw, null];

  return {
    contactName: contactName || "Unknown",
    contactRole: contactRole,
    email: asString(findByIdContains(qs, "email")?.value) || "",
    phone: asString(findByIdContains(qs, "phone")?.value),
    businessName: asString(findByIdContains(qs, "biz")?.value) || "Unknown",
    website: asString(findByIdContains(qs, "web")?.value),
    serviceArea: asString(findByIdContains(qs, "area")?.value),
    revenueRange: asEnum(findByIdContains(qs, "revenue")?.value, REVENUE_VALUES),
    teamSizeFt: asNumber(findByIdContains(qs, "ft")?.value),
    teamSizePt: asNumber(findByIdContains(qs, "pt")?.value),
    techStack: asString(findByIdContains(qs, "stack")?.value),
    topPain: asString(findByIdContains(qs, "pain")?.value),
    biggestLever: asEnumArray(findByIdContains(qs, "lever")?.value, LEVER_VALUES),
    decisionMakers: asString(findByIdContains(qs, "dm")?.value),
    timing: asEnum(findByIdContains(qs, "timing")?.value, TIMING_VALUES),
    referralSource: asString(findByIdContains(qs, "q4")?.value),
  };
}
```

**Note on field IDs:** The fixture uses ids like `q2_email`, `q5_revenue`, etc. When Austin builds the actual Fillout form (Task 22), he must use matching id substrings (`email`, `revenue`, `pain`, etc.) for the parser to find them. Document this in the form-build task.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/fillout/parse.test.ts`
Expected: All 5 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/fillout/parse.ts tests/fillout/parse.test.ts
git commit -m "feat(fillout): parse webhook payload into ParsedIntake"
```

---

### Task 11: Build the Fillout webhook receiver

**Files:**
- Create: `app/api/webhooks/fillout/route.ts`
- Create: `tests/api/webhooks/fillout.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/api/webhooks/fillout.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/webhooks/fillout/route";
import { sampleFilloutPayload } from "../../fixtures/fillout-payload";

// Mock Supabase
const mockInsertProspect = vi.fn();
const mockInsertIntake = vi.fn();
const mockInsertWebhook = vi.fn();
const mockUpdateWebhook = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  supabaseServer: {
    from: (table: string) => ({
      insert: (data: unknown) => ({
        select: () => ({
          single: async () => {
            if (table === "prospects") return mockInsertProspect(data);
            if (table === "intake_responses") return mockInsertIntake(data);
            if (table === "webhook_events") return mockInsertWebhook(data);
            return { data: null, error: null };
          },
        }),
      }),
      update: (data: unknown) => ({
        eq: async (_col: string, _val: string) => mockUpdateWebhook(data),
      }),
    }),
  },
}));

vi.mock("@/lib/ai/generators/prep-brief", () => ({
  generatePrepBriefForProspect: vi.fn(async () => ({ id: "brief_id" })),
}));

beforeEach(() => {
  mockInsertProspect.mockReset();
  mockInsertIntake.mockReset();
  mockInsertWebhook.mockReset();
  mockUpdateWebhook.mockReset();

  mockInsertProspect.mockResolvedValue({ data: { id: "prospect_id_1" }, error: null });
  mockInsertIntake.mockResolvedValue({ data: { id: "intake_id_1" }, error: null });
  mockInsertWebhook.mockResolvedValue({ data: { id: "webhook_id_1" }, error: null });
  mockUpdateWebhook.mockResolvedValue({ data: null, error: null });
});

describe("POST /api/webhooks/fillout", () => {
  it("creates a prospect from intake submission", async () => {
    const req = new Request("http://localhost/api/webhooks/fillout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(sampleFilloutPayload),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
    expect(mockInsertProspect).toHaveBeenCalledOnce();
    const prospectArg = mockInsertProspect.mock.calls[0][0];
    expect(prospectArg.email).toBe("hayden@blackwolf.com");
    expect(prospectArg.company_name).toBe("Black Wolf Roofing");
    expect(prospectArg.stage).toBe("intake_complete");
  });

  it("persists raw payload to webhook_events", async () => {
    const req = new Request("http://localhost/api/webhooks/fillout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(sampleFilloutPayload),
    });
    await POST(req);
    expect(mockInsertWebhook).toHaveBeenCalledOnce();
    const webhookArg = mockInsertWebhook.mock.calls[0][0];
    expect(webhookArg.source).toBe("fillout");
    expect(webhookArg.raw_payload).toEqual(sampleFilloutPayload);
  });

  it("rejects non-JSON body", async () => {
    const req = new Request("http://localhost/api/webhooks/fillout", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "not json",
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/api/webhooks/fillout.test.ts`
Expected: FAIL with "Cannot find module '@/app/api/webhooks/fillout/route'".

- [ ] **Step 3: Implement the route**

Create `app/api/webhooks/fillout/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";
import { parseFilloutPayload } from "@/lib/fillout/parse";
import { generatePrepBriefForProspect } from "@/lib/ai/generators/prep-brief";
import type { FilloutWebhookPayload } from "@/types/fillout";

export const runtime = "nodejs";
export const maxDuration = 60; // allow time for AI generation

export async function POST(req: Request): Promise<Response> {
  // 1. Parse + validate body
  let payload: FilloutWebhookPayload;
  try {
    payload = (await req.json()) as FilloutWebhookPayload;
    if (!payload?.submission?.questions) {
      return NextResponse.json({ error: "Invalid payload shape" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // 2. Log raw payload immediately (replay safety)
  const { data: webhookRow, error: webhookErr } = await supabaseServer
    .from("webhook_events")
    .insert({
      source: "fillout",
      event_type: "submission",
      raw_payload: payload as unknown as Record<string, unknown>,
      signature_verified: false, // TODO Task 12: add signature verification
    })
    .select()
    .single();

  if (webhookErr || !webhookRow) {
    console.error("Failed to log webhook event:", webhookErr);
    return NextResponse.json({ error: "Webhook log failed" }, { status: 500 });
  }

  // 3. Parse + create prospect
  const parsed = parseFilloutPayload(payload);
  const { data: prospectRow, error: prospectErr } = await supabaseServer
    .from("prospects")
    .insert({
      company_name: parsed.businessName,
      contact_name: parsed.contactName,
      role: parsed.contactRole,
      email: parsed.email,
      phone: parsed.phone,
      annual_revenue_range: parsed.revenueRange,
      team_size_ft: parsed.teamSizeFt,
      team_size_pt: parsed.teamSizePt,
      source: "intake_form",
      referral_source: parsed.referralSource,
      stage: "intake_complete",
    })
    .select()
    .single();

  if (prospectErr || !prospectRow) {
    await supabaseServer
      .from("webhook_events")
      .update({ processing_error: `Prospect insert failed: ${prospectErr?.message}` })
      .eq("id", webhookRow.id);
    return NextResponse.json({ error: "Prospect insert failed" }, { status: 500 });
  }

  // 4. Persist intake response
  const { data: intakeRow, error: intakeErr } = await supabaseServer
    .from("intake_responses")
    .insert({
      prospect_id: prospectRow.id,
      fillout_submission_id: payload.submission.submissionId,
      raw_payload: payload as unknown as Record<string, unknown>,
      q_business_name: parsed.businessName,
      q_website: parsed.website,
      q_service_area: parsed.serviceArea,
      q_revenue_range: parsed.revenueRange,
      q_team_size_ft: parsed.teamSizeFt,
      q_team_size_pt: parsed.teamSizePt,
      q_tech_stack: parsed.techStack,
      q_top_pain: parsed.topPain,
      q_biggest_lever: parsed.biggestLever,
      q_decision_makers: parsed.decisionMakers,
      q_timing: parsed.timing,
      q_referral_source: parsed.referralSource,
    })
    .select()
    .single();

  if (intakeErr || !intakeRow) {
    return NextResponse.json({ error: "Intake insert failed" }, { status: 500 });
  }

  // 5. Mark webhook processed
  await supabaseServer
    .from("webhook_events")
    .update({ processed_at: new Date().toISOString() })
    .eq("id", webhookRow.id);

  // 6. Trigger prep brief generation (don't await — fire-and-forget so Fillout gets fast response)
  generatePrepBriefForProspect(prospectRow.id).catch((err) => {
    console.error(`Prep brief generation failed for ${prospectRow.id}:`, err);
  });

  return NextResponse.json({
    ok: true,
    prospect_id: prospectRow.id,
    intake_response_id: intakeRow.id,
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/api/webhooks/fillout.test.ts`
Expected: All 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add app/api/webhooks/fillout/ tests/api/webhooks/
git commit -m "feat(api): Fillout webhook handler creates prospect + intake_response"
```

---

### Task 12: Add Fillout webhook signature verification

**Files:**
- Modify: `app/api/webhooks/fillout/route.ts`

Fillout supports HMAC signature verification on webhooks: docs at https://www.fillout.com/help/webhook. The signing key is set when the webhook is created in Fillout's UI.

- [ ] **Step 1: Add the verification helper**

In `app/api/webhooks/fillout/route.ts`, add at the top (below imports):

```typescript
import crypto from "crypto";

const FILLOUT_WEBHOOK_SECRET = (process.env.FILLOUT_WEBHOOK_SECRET || "").trim();

function verifyFilloutSignature(rawBody: string, signature: string | null): boolean {
  if (!FILLOUT_WEBHOOK_SECRET) {
    // If no secret configured, fall through (dev mode). Log warning.
    console.warn("FILLOUT_WEBHOOK_SECRET not set — skipping signature verification");
    return true;
  }
  if (!signature) return false;
  const expected = crypto
    .createHmac("sha256", FILLOUT_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  // Use timingSafeEqual to prevent timing attacks
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
  } catch {
    return false;
  }
}
```

- [ ] **Step 2: Use it in the handler**

Modify the `POST` function to read the raw body once and verify before parsing:

```typescript
export async function POST(req: Request): Promise<Response> {
  const rawBody = await req.text();
  const signature = req.headers.get("fillout-signature");
  const verified = verifyFilloutSignature(rawBody, signature);

  if (!verified) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: FilloutWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as FilloutWebhookPayload;
    if (!payload?.submission?.questions) {
      return NextResponse.json({ error: "Invalid payload shape" }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // ... rest of handler unchanged, but pass verified to webhook_events insert:
```

In the `webhook_events` insert, change `signature_verified: false` to `signature_verified: verified`.

- [ ] **Step 3: Add env var placeholder**

Update `.env.local` (Austin does manually after creating webhook in Fillout):
```
FILLOUT_WEBHOOK_SECRET=
```

Update `.env.production.example` to document this variable.

- [ ] **Step 4: Re-run tests to verify still pass**

Run: `npm test -- tests/api/webhooks/fillout.test.ts`
Expected: All 3 tests PASS (because no secret is set in test env, verification is skipped).

- [ ] **Step 5: Commit**

```bash
git add app/api/webhooks/fillout/route.ts .env.production.example
git commit -m "feat(api): verify Fillout webhook signature with HMAC SHA-256"
```

---

## Section D — AI Prep Brief Generator

### Task 13: Define Zod schema for prep brief output

**Files:**
- Create: `lib/ai/schemas/prep-brief.ts`

- [ ] **Step 1: Create the schema**

```typescript
import { z } from "zod";

export const PrepBriefSchema = z.object({
  thirty_second_brief: z.string().describe("2-3 sentences: who they are, why they booked, what they want"),

  pain: z.object({
    stated: z.string().describe("Direct quote or paraphrase of what they said is the pain"),
    likely_real: z.string().describe("Claude's inference of the real pain based on industry + signals"),
    lost_revenue_estimate_monthly_usd: z.number().nullable().describe("Estimated $/mo lost; null if not enough data"),
    lost_revenue_reasoning: z.string().describe("Show the math/logic behind the estimate"),
  }),

  decision_dynamics: z.object({
    decision_makers_named: z.array(z.string()).describe("Names from intake Q9"),
    likely_economic_buyer: z.string().describe("Best guess at who actually has budget authority"),
    likely_champion: z.string().describe("Best guess at who will sell internally"),
    timing_pressure: z.enum(["urgent", "moderate", "exploratory"]),
    authority_signal: z.string().describe("What the answers tell us about Austin's path to a yes"),
  }),

  spin_questions_to_ask: z.array(z.string()).length(3).describe("Three SPIN questions tuned to this prospect's stated pain"),

  things_not_to_ask: z.array(z.string()).describe("Items already in intake — don't rehash"),

  trigger_signals: z.array(z.string()).describe("Any flagged events: hiring posts, recent reviews, expansion news"),

  surge_offering_fit: z.object({
    primary: z.enum(["business_infrastructure", "ai_integration", "ai_lead_gen"]),
    why: z.string().describe("Reasoning tied to stated pain + business size"),
    lead_with: z.string().describe("Specific opener Austin can paraphrase"),
  }),

  estimated_engagement: z.object({
    likely_ticket_range_usd: z.string().describe("e.g., '$3,500 audit then $5K-7K/mo retainer'"),
    path_to_retainer_sketch: z.string().describe("Phase 1 → 2 → 3 progression"),
  }),
});

export type PrepBrief = z.infer<typeof PrepBriefSchema>;
```

- [ ] **Step 2: Commit**

```bash
git add lib/ai/schemas/prep-brief.ts
git commit -m "feat(ai): Zod schema for prep brief AI output"
```

---

### Task 14: Write the cached system prompt

**Files:**
- Create: `lib/ai/prompts/prep-brief-system.ts`

The system prompt is what gets cached across calls. It contains the Surge knowledge base, the brand voice rules, the 3 offerings, the SPIN/PACI framework — everything that's stable across prospects. Only the prospect-specific intake data goes in the user message (uncached).

- [ ] **Step 1: Create the prompt file**

```typescript
// Cached system prompt for prep brief generation.
// This content gets cached by Anthropic — keep it stable to maximize cache hit rate.
// Bump CACHE_VERSION when meaningfully changing this prompt.

export const CACHE_VERSION = "1";

export const PREP_BRIEF_SYSTEM_PROMPT = `You are Austin Brooks's research analyst at Surge Advisory LLC, a consulting firm that builds business infrastructure, AI integration, and AI lead gen systems for home service businesses (HVAC, plumbing, electrical, roofing, restoration, landscaping, etc.).

A prospect just filled out the Surge intake form. Your job: produce a one-page prep brief Austin reads 30 minutes before the discovery call. The brief makes Austin walk into the call already knowing who this person is, what their real pain is, what to ask, and which Surge offering is the most likely fit.

# CONTEXT: SURGE'S 3 OFFERINGS

1. **Business Infrastructure** — operational backbone (CRM setup, sales process, follow-up systems, reporting). Best fit for businesses with leaks in the pipeline (low close rate, slow estimate follow-up, AR aging, unclear job profitability).

2. **AI Integration** — Claude in the workflow (intake automation, document generation, summary generation, copilot setup). Best fit for businesses already operationally clean but admin-heavy (owner doing too much paperwork, repetitive tasks across roles).

3. **AI Lead Gen** — outbound sequences, signal monitoring, AEO/GEO, content generation. Best fit for businesses with capacity to absorb more leads (operationally solid but lead flow is the constraint).

Each offering has Phase 1 (build) → Phase 2 (optimize) → Phase 3 (maintenance retainer) progression. Typical pricing: $3,500 audit, then $5K-7K/mo Phase 1 retainer for 90 days, declining to $3,500/mo maintenance.

# CONTEXT: SPIN SELLING FRAMEWORK

Discovery calls follow Situation → Problem → Implication → Need-Payoff. Austin already has Situation answers from the intake form, so the call should focus on Problem + Implication. Implication questions are the highest-leverage: they move the prospect from "yeah, that's annoying" to "we're losing $X/month and we have to fix it." Always provide three Implication-flavored questions Austin can ask.

# CONTEXT: BRAND VOICE RULES

When you write any text in this brief:
- No em dashes (—). Use commas, periods, or parentheses instead. This is non-negotiable.
- Direct, specific language. Numbers over adjectives.
- Active voice.
- No hedging ("might," "could potentially," "it's possible that").
- Trade jargon is fine (LSA, GBP, CPL, AR, close rate, ticket size).

# CONTEXT: HOME SERVICE INDUSTRY ECONOMICS

| Revenue band | Typical close rate | Typical CPL | Typical AR days |
|---|---|---|---|
| <$500K | 20-30% | $200+ | 60+ |
| $500K-1M | 25-35% | $150-200 | 50 |
| $1M-3M | 30-40% | $100-150 | 35-45 |
| $3M-10M | 40-50% | $75-100 | 28-35 |
| $10M+ | 45-55% | $50-75 | <28 |

When estimating lost revenue, show the work: number of leads × close rate gap × average ticket × 12 months.

# OUTPUT FORMAT

You MUST respond with a JSON object matching this schema EXACTLY (no extra fields, no markdown wrapper):

{
  "thirty_second_brief": "string (2-3 sentences)",
  "pain": {
    "stated": "string",
    "likely_real": "string",
    "lost_revenue_estimate_monthly_usd": number or null,
    "lost_revenue_reasoning": "string"
  },
  "decision_dynamics": {
    "decision_makers_named": ["string"],
    "likely_economic_buyer": "string",
    "likely_champion": "string",
    "timing_pressure": "urgent" | "moderate" | "exploratory",
    "authority_signal": "string"
  },
  "spin_questions_to_ask": ["string", "string", "string"],
  "things_not_to_ask": ["string"],
  "trigger_signals": ["string"],
  "surge_offering_fit": {
    "primary": "business_infrastructure" | "ai_integration" | "ai_lead_gen",
    "why": "string",
    "lead_with": "string"
  },
  "estimated_engagement": {
    "likely_ticket_range_usd": "string",
    "path_to_retainer_sketch": "string"
  }
}

Return ONLY the JSON object. No prose before or after.`;
```

- [ ] **Step 2: Commit**

```bash
git add lib/ai/prompts/prep-brief-system.ts
git commit -m "feat(ai): cached system prompt for prep brief generator"
```

---

### Task 15: Build Anthropic client wrapper with prompt caching

**Files:**
- Create: `lib/ai/anthropic.ts`

- [ ] **Step 1: Create the client wrapper**

```typescript
import Anthropic from "@anthropic-ai/sdk";

const apiKey = (process.env.ANTHROPIC_API_KEY || "").trim();
if (!apiKey) {
  throw new Error("Missing ANTHROPIC_API_KEY");
}

export const anthropic = new Anthropic({ apiKey });

// Model ID — verify against current Anthropic API docs before merging.
// Use Opus tier for prep brief quality (the brief is high-leverage, low-volume).
// To swap to Sonnet/Haiku later for cost, change here only.
export const CLAUDE_MODEL = "claude-opus-4-5-20250929";

/**
 * Generate structured JSON output using Claude with prompt caching.
 *
 * @param systemPrompt - The cached system prompt (cacheable across calls)
 * @param userPrompt - The variable user message (not cached)
 * @returns Parsed JSON output + usage metadata
 */
export async function generateStructuredJson<T>(args: {
  systemPrompt: string;
  userPrompt: string;
  maxTokens?: number;
}): Promise<{ json: T; rawText: string; tokensIn: number; tokensOut: number }> {
  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: args.maxTokens ?? 4096,
    system: [
      {
        type: "text",
        text: args.systemPrompt,
        cache_control: { type: "ephemeral" }, // marks for caching
      },
    ],
    messages: [
      { role: "user", content: args.userPrompt },
    ],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const rawText = textBlock && textBlock.type === "text" ? textBlock.text : "";

  let json: T;
  try {
    json = JSON.parse(rawText) as T;
  } catch (err) {
    throw new Error(`Failed to parse JSON from Claude response. Raw: ${rawText.slice(0, 500)}`);
  }

  return {
    json,
    rawText,
    tokensIn: response.usage.input_tokens,
    tokensOut: response.usage.output_tokens,
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/ai/anthropic.ts
git commit -m "feat(ai): Anthropic client wrapper with prompt caching support"
```

---

### Task 16: Build prep brief generator

**Files:**
- Create: `lib/ai/generators/prep-brief.ts`
- Create: `tests/ai/generators/prep-brief.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/ai/generators/prep-brief.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from "vitest";

const mockAnthropicCall = vi.fn();
vi.mock("@/lib/ai/anthropic", () => ({
  CLAUDE_MODEL: "claude-opus-4-5-20250929",
  generateStructuredJson: (args: unknown) => mockAnthropicCall(args),
}));

const mockProspectFetch = vi.fn();
const mockIntakeFetch = vi.fn();
const mockBriefInsert = vi.fn();
const mockProspectUpdate = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  supabaseServer: {
    from: (table: string) => ({
      select: (_cols: string) => ({
        eq: (_col: string, _val: string) => ({
          order: (_o: string, _opts: unknown) => ({
            limit: (_n: number) => ({
              single: async () => {
                if (table === "prospects") return mockProspectFetch();
                if (table === "intake_responses") return mockIntakeFetch();
                return { data: null, error: null };
              },
            }),
          }),
          single: async () => {
            if (table === "prospects") return mockProspectFetch();
            return { data: null, error: null };
          },
        }),
      }),
      insert: (data: unknown) => ({
        select: () => ({
          single: async () => mockBriefInsert(data),
        }),
      }),
      update: (data: unknown) => ({
        eq: async (_col: string, _val: string) => mockProspectUpdate(data),
      }),
    }),
  },
}));

import { generatePrepBriefForProspect } from "@/lib/ai/generators/prep-brief";

beforeEach(() => {
  mockAnthropicCall.mockReset();
  mockProspectFetch.mockReset();
  mockIntakeFetch.mockReset();
  mockBriefInsert.mockReset();
  mockProspectUpdate.mockReset();

  mockProspectFetch.mockResolvedValue({
    data: {
      id: "p1",
      company_name: "Black Wolf Roofing",
      contact_name: "Hayden",
      email: "hayden@blackwolf.com",
      annual_revenue_range: "1m_to_3m",
      team_size_ft: 8,
      stage: "intake_complete",
    },
    error: null,
  });
  mockIntakeFetch.mockResolvedValue({
    data: {
      id: "i1",
      prospect_id: "p1",
      q_top_pain: "Estimates take 2 weeks to follow up on",
      q_biggest_lever: ["sales_close_rate"],
      q_decision_makers: "Ops manager Sarah",
      q_timing: "within_30_days",
    },
    error: null,
  });
  mockBriefInsert.mockResolvedValue({ data: { id: "b1" }, error: null });
  mockProspectUpdate.mockResolvedValue({ data: null, error: null });

  mockAnthropicCall.mockResolvedValue({
    json: {
      thirty_second_brief: "Hayden runs Black Wolf Roofing in Phoenix...",
      pain: {
        stated: "Estimates take 2 weeks",
        likely_real: "No follow-up cadence",
        lost_revenue_estimate_monthly_usd: 32000,
        lost_revenue_reasoning: "12 estimates/wk × 30% close gap × $9K avg",
      },
      decision_dynamics: {
        decision_makers_named: ["Hayden", "Sarah"],
        likely_economic_buyer: "Hayden",
        likely_champion: "Sarah",
        timing_pressure: "moderate",
        authority_signal: "Owner is decision-maker, ops manager will own daily use",
      },
      spin_questions_to_ask: [
        "When an estimate goes 5+ days without follow-up, what's the close rate vs same-day follow-up?",
        "How many of those stale estimates do you think would have closed with a 24hr text?",
        "If we got that recovered close rate to 50%, what does that mean for next quarter?",
      ],
      things_not_to_ask: ["Annual revenue (already $1-3M)", "Team size (8FT, 4PT)"],
      trigger_signals: [],
      surge_offering_fit: {
        primary: "business_infrastructure",
        why: "Pipeline leak at follow-up stage; lead flow is fine, conversion is the constraint",
        lead_with: "Walk through where estimates die in the current process",
      },
      estimated_engagement: {
        likely_ticket_range_usd: "$3,500 audit then $6,500/mo Phase 1",
        path_to_retainer_sketch: "Phase 1: build follow-up cadence + reporting. Phase 2: optimize close rate + AR. Phase 3: maintenance.",
      },
    },
    rawText: "{}",
    tokensIn: 1500,
    tokensOut: 800,
  });
});

describe("generatePrepBriefForProspect", () => {
  it("fetches prospect + intake and calls Claude", async () => {
    await generatePrepBriefForProspect("p1");
    expect(mockProspectFetch).toHaveBeenCalled();
    expect(mockIntakeFetch).toHaveBeenCalled();
    expect(mockAnthropicCall).toHaveBeenCalledOnce();
  });

  it("inserts the brief into prep_briefs", async () => {
    await generatePrepBriefForProspect("p1");
    expect(mockBriefInsert).toHaveBeenCalledOnce();
    const briefArg = mockBriefInsert.mock.calls[0][0];
    expect(briefArg.prospect_id).toBe("p1");
    expect(briefArg.brief_markdown).toContain("Hayden");
    expect(briefArg.brief_json).toBeDefined();
    expect(briefArg.tokens_input).toBe(1500);
  });

  it("returns the inserted brief id", async () => {
    const result = await generatePrepBriefForProspect("p1");
    expect(result.id).toBe("b1");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/ai/generators/prep-brief.test.ts`
Expected: FAIL with "Cannot find module '@/lib/ai/generators/prep-brief'".

- [ ] **Step 3: Implement the generator**

Create `lib/ai/generators/prep-brief.ts`:

```typescript
import { supabaseServer } from "@/lib/supabase/server";
import { generateStructuredJson, CLAUDE_MODEL } from "@/lib/ai/anthropic";
import { PREP_BRIEF_SYSTEM_PROMPT } from "@/lib/ai/prompts/prep-brief-system";
import { PrepBriefSchema, type PrepBrief } from "@/lib/ai/schemas/prep-brief";
import type { ProspectRow, IntakeResponseRow } from "@/lib/supabase/types";

function buildUserPrompt(prospect: ProspectRow, intake: IntakeResponseRow): string {
  return `# Prospect Intake

## Business basics
- Business: ${prospect.company_name}
- Owner / contact: ${prospect.contact_name}${prospect.role ? ` (${prospect.role})` : ""}
- Email: ${prospect.email}
- Phone: ${prospect.phone || "not provided"}
- Service area: ${intake.q_service_area || "not provided"}
- Website: ${intake.q_website || "not provided"}

## Scale
- Annual revenue range: ${prospect.annual_revenue_range || "not disclosed"}
- Team size: ${prospect.team_size_ft || 0} full-time, ${prospect.team_size_pt || 0} part-time/contractor
- Tech stack (their words): ${intake.q_tech_stack || "not provided"}

## Pain (their words)
${intake.q_top_pain || "not provided"}

## Their stated 10x lever
${(intake.q_biggest_lever || []).join(", ") || "not provided"}

## Decision context
- Other decision-makers: ${intake.q_decision_makers || "not provided"}
- Timing: ${intake.q_timing || "not provided"}

## Source
- How they found us: ${intake.q_referral_source || prospect.referral_source || "not provided"}

---

Generate the prep brief JSON now.`;
}

function renderMarkdown(prospect: ProspectRow, brief: PrepBrief): string {
  const offering = {
    business_infrastructure: "Business Infrastructure",
    ai_integration: "AI Integration",
    ai_lead_gen: "AI Lead Gen",
  }[brief.surge_offering_fit.primary];

  const lostRev = brief.pain.lost_revenue_estimate_monthly_usd;
  const lostRevStr = lostRev ? `$${lostRev.toLocaleString()}/mo` : "Not enough data to estimate";

  return `# Surge Prep Brief
**${prospect.company_name}** · ${prospect.contact_name} · ${prospect.email}

## The 30-Second Brief
${brief.thirty_second_brief}

## Pain Hypothesis
**Stated:** ${brief.pain.stated}

**Likely real:** ${brief.pain.likely_real}

**Lost revenue estimate:** ${lostRevStr}
${brief.pain.lost_revenue_reasoning}

## Decision Dynamics
- **Named decision-makers:** ${brief.decision_dynamics.decision_makers_named.join(", ") || "Just the contact"}
- **Likely economic buyer:** ${brief.decision_dynamics.likely_economic_buyer}
- **Likely champion:** ${brief.decision_dynamics.likely_champion}
- **Timing pressure:** ${brief.decision_dynamics.timing_pressure}
- **Authority signal:** ${brief.decision_dynamics.authority_signal}

## 3 SPIN Questions to Ask
${brief.spin_questions_to_ask.map((q, i) => `${i + 1}. ${q}`).join("\n")}

## Things NOT to Ask (already in intake)
${brief.things_not_to_ask.map((t) => `- ${t}`).join("\n")}

## Trigger Signals
${brief.trigger_signals.length ? brief.trigger_signals.map((s) => `- ${s}`).join("\n") : "None detected"}

## Surge Offering Fit
**Primary:** ${offering}

**Why:** ${brief.surge_offering_fit.why}

**Lead with:** ${brief.surge_offering_fit.lead_with}

## Estimated Engagement
- **Likely ticket:** ${brief.estimated_engagement.likely_ticket_range_usd}
- **Path:** ${brief.estimated_engagement.path_to_retainer_sketch}
`;
}

export async function generatePrepBriefForProspect(prospectId: string): Promise<{ id: string }> {
  // 1. Fetch prospect + latest intake
  const { data: prospect, error: pErr } = await supabaseServer
    .from("prospects")
    .select("*")
    .eq("id", prospectId)
    .single();
  if (pErr || !prospect) throw new Error(`Prospect ${prospectId} not found: ${pErr?.message}`);

  const { data: intake, error: iErr } = await supabaseServer
    .from("intake_responses")
    .select("*")
    .eq("prospect_id", prospectId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .single();
  if (iErr || !intake) throw new Error(`No intake for prospect ${prospectId}: ${iErr?.message}`);

  // 2. Generate via Claude
  const userPrompt = buildUserPrompt(prospect, intake);
  const result = await generateStructuredJson<unknown>({
    systemPrompt: PREP_BRIEF_SYSTEM_PROMPT,
    userPrompt,
    maxTokens: 4096,
  });

  // 3. Validate output shape
  const parsed = PrepBriefSchema.safeParse(result.json);
  if (!parsed.success) {
    throw new Error(`Prep brief failed validation: ${parsed.error.message}`);
  }

  // 4. Render markdown for human reading
  const markdown = renderMarkdown(prospect, parsed.data);

  // 5. Persist
  const { data: row, error: bErr } = await supabaseServer
    .from("prep_briefs")
    .insert({
      prospect_id: prospectId,
      intake_response_id: intake.id,
      model_used: CLAUDE_MODEL,
      brief_markdown: markdown,
      brief_json: parsed.data as unknown as Record<string, unknown>,
      tokens_input: result.tokensIn,
      tokens_output: result.tokensOut,
    })
    .select()
    .single();
  if (bErr || !row) throw new Error(`Failed to insert prep brief: ${bErr?.message}`);

  return { id: row.id };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/ai/generators/prep-brief.test.ts`
Expected: All 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/ai/generators/ tests/ai/generators/
git commit -m "feat(ai): prep brief generator with Claude + Zod validation + markdown render"
```

---

## Section E — Email Delivery

### Task 17: Build Resend wrapper

**Files:**
- Create: `lib/email/resend.ts`

- [ ] **Step 1: Create the wrapper**

```typescript
import { Resend } from "resend";

const apiKey = (process.env.RESEND_API_KEY || "").trim();
if (!apiKey) {
  throw new Error("Missing RESEND_API_KEY");
}

export const resend = new Resend(apiKey);

// Sender — must be a verified domain in Resend
export const FROM_AUSTIN = "Austin Brooks <austin@surgeadvisory.co>";
export const FROM_NOTIFICATIONS = "Surge Notifications <notifications@surgeadvisory.co>";

export async function sendEmail(args: {
  from: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<{ id: string }> {
  const { data, error } = await resend.emails.send({
    from: args.from,
    to: args.to,
    subject: args.subject,
    html: args.html,
    text: args.text,
  });

  if (error || !data) {
    throw new Error(`Resend send failed: ${error?.message || "unknown"}`);
  }
  return { id: data.id };
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/email/resend.ts
git commit -m "feat(email): Resend client wrapper"
```

---

### Task 18: Build prep brief email template

**Files:**
- Create: `lib/email/templates/prep-brief-email.ts`

- [ ] **Step 1: Create the template**

```typescript
import type { ProspectRow, PrepBriefRow } from "@/lib/supabase/types";

// Plain HTML template — no React Email yet, keep it dependency-free for v1.
// Follows Surge brand: Navy headings (#0A1628), Copper accents (#B87333), system fonts.

export function renderPrepBriefEmail(args: {
  prospect: ProspectRow;
  brief: PrepBriefRow;
  dashboardUrl: string;
}): { subject: string; html: string; text: string } {
  const subject = `Prep brief — ${args.prospect.company_name} (${args.prospect.contact_name})`;

  const text = `Surge Prep Brief\n${args.prospect.company_name} · ${args.prospect.contact_name}\n\nFull brief: ${args.dashboardUrl}\n\n${args.brief.brief_markdown}`;

  const html = `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f7f7f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1F2937;line-height:1.5;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;padding:32px;border-radius:8px;border-top:3px solid #B87333;">
    <div style="font-size:11px;letter-spacing:1px;color:#B87333;font-weight:bold;margin-bottom:4px;">SURGE ADVISORY · PREP BRIEF</div>
    <h1 style="color:#0A1628;font-size:22px;margin:8px 0 4px 0;">${escapeHtml(args.prospect.company_name)}</h1>
    <div style="color:#9A9086;font-size:14px;margin-bottom:24px;">${escapeHtml(args.prospect.contact_name)}${args.prospect.role ? " · " + escapeHtml(args.prospect.role) : ""} · ${escapeHtml(args.prospect.email)}</div>

    <div style="background:#FFF8F0;border-left:3px solid #B87333;padding:16px;margin-bottom:24px;font-size:14px;">
      ${markdownToBasicHtml(args.brief.brief_markdown)}
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="${escapeHtml(args.dashboardUrl)}" style="display:inline-block;background:#0A1628;color:#ffffff;padding:12px 24px;text-decoration:none;border-radius:4px;font-size:14px;font-weight:bold;">Open in dashboard</a>
    </div>

    <div style="margin-top:32px;padding-top:16px;border-top:1px solid #E5E7EB;font-size:11px;color:#9A9086;text-align:center;">
      Generated by Surge AI for Austin Brooks · ${new Date(args.brief.generated_at).toLocaleString()}
    </div>
  </div>
</body>
</html>`;

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Minimal markdown → HTML: headings, bold, lists, paragraphs.
// Sufficient for AI-generated brief output. NOT a general-purpose markdown parser.
function markdownToBasicHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("# ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h2 style="color:#0A1628;font-size:18px;margin:16px 0 8px 0;">${escapeHtml(line.slice(2))}</h2>`);
    } else if (line.startsWith("## ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h3 style="color:#0A1628;font-size:15px;margin:14px 0 6px 0;">${escapeHtml(line.slice(3))}</h3>`);
    } else if (line.startsWith("- ")) {
      if (!inList) { out.push("<ul style='margin:4px 0 8px 18px;padding:0;'>"); inList = true; }
      out.push(`<li>${inlineFormat(line.slice(2))}</li>`);
    } else if (/^\d+\. /.test(line)) {
      if (!inList) { out.push("<ol style='margin:4px 0 8px 18px;padding:0;'>"); inList = true; }
      out.push(`<li>${inlineFormat(line.replace(/^\d+\. /, ""))}</li>`);
    } else if (line === "") {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push("");
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<p style="margin:6px 0;">${inlineFormat(line)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function inlineFormat(s: string): string {
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, '<strong style="color:#0A1628;">$1</strong>');
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/email/templates/prep-brief-email.ts
git commit -m "feat(email): prep brief HTML email template (Surge brand)"
```

---

### Task 19: Wire generator to send email after generation

**Files:**
- Modify: `lib/ai/generators/prep-brief.ts`

- [ ] **Step 1: Add email send to the generator**

Modify `lib/ai/generators/prep-brief.ts`. After the `prep_briefs` insert (step 5 in the existing function), add steps 6 and 7:

```typescript
  // 6. Send email to Austin
  const dashboardUrl = `${(process.env.NEXT_PUBLIC_APP_URL || "https://surgeadvisory.co").replace(/\/$/, "")}/dashboard/prep/${prospectId}`;
  const emailContent = renderPrepBriefEmail({ prospect, brief: row, dashboardUrl });

  try {
    await sendEmail({
      from: FROM_NOTIFICATIONS,
      to: AUSTIN_EMAIL,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    });
    // 7. Mark email sent
    await supabaseServer
      .from("prep_briefs")
      .update({ email_sent_at: new Date().toISOString() })
      .eq("id", row.id);
  } catch (err) {
    console.error(`Failed to send prep brief email for ${prospectId}:`, err);
    // Don't throw — brief is saved, email failure is non-fatal
  }

  return { id: row.id };
}
```

Add the imports at the top:

```typescript
import { renderPrepBriefEmail } from "@/lib/email/templates/prep-brief-email";
import { sendEmail, FROM_NOTIFICATIONS } from "@/lib/email/resend";

const AUSTIN_EMAIL = (process.env.AUSTIN_EMAIL || "austin@surgeadvisory.co").trim();
```

- [ ] **Step 2: Update the test to mock the email send**

In `tests/ai/generators/prep-brief.test.ts`, add at the top with the other mocks:

```typescript
const mockSendEmail = vi.fn();
vi.mock("@/lib/email/resend", () => ({
  sendEmail: (args: unknown) => mockSendEmail(args),
  FROM_NOTIFICATIONS: "Surge <test@test.com>",
}));

vi.mock("@/lib/email/templates/prep-brief-email", () => ({
  renderPrepBriefEmail: () => ({ subject: "test", html: "<p>test</p>", text: "test" }),
}));
```

In `beforeEach`, add:
```typescript
mockSendEmail.mockReset();
mockSendEmail.mockResolvedValue({ id: "email_id_1" });
```

Add a new test:
```typescript
it("sends an email after generating the brief", async () => {
  await generatePrepBriefForProspect("p1");
  expect(mockSendEmail).toHaveBeenCalledOnce();
  const emailArg = mockSendEmail.mock.calls[0][0];
  expect(emailArg.subject).toBe("test");
});
```

- [ ] **Step 3: Run tests**

Run: `npm test -- tests/ai/generators/prep-brief.test.ts`
Expected: All 4 tests PASS.

- [ ] **Step 4: Commit**

```bash
git add lib/ai/generators/prep-brief.ts tests/ai/generators/prep-brief.test.ts
git commit -m "feat(ai): send prep brief email after generation"
```

---

## Section F — Dashboard View

### Task 20: Build prep brief view page

**Files:**
- Create: `app/dashboard/prep/[prospectId]/page.tsx`

- [ ] **Step 1: Create the server component**

```typescript
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function PrepBriefPage({ params }: { params: { prospectId: string } }) {
  const prospectId = params.prospectId;

  const { data: prospect } = await supabaseServer
    .from("prospects")
    .select("*")
    .eq("id", prospectId)
    .single();

  if (!prospect) notFound();

  const { data: brief } = await supabaseServer
    .from("prep_briefs")
    .select("*")
    .eq("prospect_id", prospectId)
    .order("generated_at", { ascending: false })
    .limit(1)
    .single();

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <Link href="/dashboard/pipeline" className="text-sm text-[#B87333] hover:underline">← Pipeline</Link>

      <div className="mt-4 mb-8 pb-4 border-b border-gray-200">
        <div className="text-xs tracking-widest text-[#B87333] font-bold mb-1">SURGE PREP BRIEF</div>
        <h1 className="text-3xl font-bold text-[#0A1628]">{prospect.company_name}</h1>
        <div className="text-gray-500 mt-1">
          {prospect.contact_name}
          {prospect.role ? ` · ${prospect.role}` : ""}
          {" · "}
          <a href={`mailto:${prospect.email}`} className="hover:underline">{prospect.email}</a>
          {prospect.phone ? ` · ${prospect.phone}` : ""}
        </div>
      </div>

      {!brief ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <div className="font-semibold text-yellow-900">No brief yet</div>
          <div className="text-sm text-yellow-800 mt-1">
            The intake form has been received but the brief has not been generated.
            This usually takes 30-60 seconds. Refresh the page in a moment.
          </div>
        </div>
      ) : (
        <article className="prose prose-slate max-w-none prep-brief">
          <BriefMarkdown markdown={brief.brief_markdown} />
          <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400">
            Generated {new Date(brief.generated_at).toLocaleString()} · {brief.model_used}
            {brief.tokens_input ? ` · ${brief.tokens_input}→${brief.tokens_output} tokens` : ""}
          </div>
        </article>
      )}
    </div>
  );
}

// Render markdown directly (the brief is already plain markdown from our renderer).
function BriefMarkdown({ markdown }: { markdown: string }) {
  // Safe: brief_markdown is generated server-side from validated AI JSON, not user input.
  // Use a lightweight inline renderer matching the email template's approach.
  const html = renderBasicMarkdown(markdown);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function renderBasicMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (line.startsWith("# ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h1 class="text-2xl font-bold text-[#0A1628] mt-6 mb-2">${escape(line.slice(2))}</h1>`);
    } else if (line.startsWith("## ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h2 class="text-lg font-bold text-[#0A1628] mt-5 mb-2">${escape(line.slice(3))}</h2>`);
    } else if (line.startsWith("- ")) {
      if (!inList) { out.push("<ul class='list-disc ml-6 my-2'>"); inList = true; }
      out.push(`<li>${inline(line.slice(2))}</li>`);
    } else if (/^\d+\. /.test(line)) {
      if (!inList) { out.push("<ol class='list-decimal ml-6 my-2'>"); inList = true; }
      out.push(`<li>${inline(line.replace(/^\d+\. /, ""))}</li>`);
    } else if (line === "") {
      if (inList) { out.push("</ul>"); inList = false; }
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<p class="my-2 text-gray-800">${inline(line)}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function inline(s: string): string {
  return escape(s).replace(/\*\*(.+?)\*\*/g, '<strong class="text-[#0A1628]">$1</strong>');
}
```

- [ ] **Step 2: Verify the page builds**

Run: `npm run build`
Expected: Build succeeds. (Page is server-rendered, no client component issues.)

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/prep/
git commit -m "feat(dashboard): prep brief view at /dashboard/prep/[prospectId]"
```

---

### Task 21: Build pipeline view (prospect list)

**Files:**
- Create: `app/dashboard/pipeline/page.tsx`

- [ ] **Step 1: Create the page**

```typescript
import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import type { ProspectStage } from "@/lib/supabase/types";

export const dynamic = "force-dynamic";

const STAGE_ORDER: ProspectStage[] = [
  "new", "intake_complete", "call_booked", "discovery_done",
  "brief_delivered", "sow_sent", "signed", "lost",
];

const STAGE_LABEL: Record<ProspectStage, string> = {
  new: "New",
  intake_complete: "Intake Complete",
  call_booked: "Call Booked",
  discovery_done: "Discovery Done",
  brief_delivered: "Brief Delivered",
  sow_sent: "SOW Sent",
  signed: "Signed",
  lost: "Lost",
};

export default async function PipelinePage() {
  const { data: prospects } = await supabaseServer
    .from("prospects")
    .select("*")
    .order("created_at", { ascending: false });

  const list = prospects || [];
  const byStage = new Map<ProspectStage, typeof list>();
  for (const stage of STAGE_ORDER) byStage.set(stage, []);
  for (const p of list) {
    const stage = p.stage as ProspectStage;
    if (byStage.has(stage)) byStage.get(stage)!.push(p);
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <div className="text-xs tracking-widest text-[#B87333] font-bold mb-1">SURGE</div>
        <h1 className="text-3xl font-bold text-[#0A1628]">Pipeline</h1>
        <div className="text-gray-500 mt-1">{list.length} prospects across {STAGE_ORDER.length} stages</div>
      </div>

      <div className="space-y-6">
        {STAGE_ORDER.map((stage) => {
          const items = byStage.get(stage) || [];
          if (items.length === 0) return null;
          return (
            <section key={stage}>
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-2">
                {STAGE_LABEL[stage]} <span className="text-gray-400 font-normal">({items.length})</span>
              </h2>
              <div className="grid gap-2">
                {items.map((p) => (
                  <Link
                    key={p.id}
                    href={`/dashboard/prep/${p.id}`}
                    className="block bg-white border border-gray-200 rounded p-3 hover:border-[#B87333] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-semibold text-[#0A1628]">{p.company_name}</div>
                        <div className="text-sm text-gray-600">
                          {p.contact_name}
                          {p.role ? ` · ${p.role}` : ""}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(p.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    {p.annual_revenue_range && (
                      <div className="text-xs text-gray-500 mt-1">{p.annual_revenue_range.replace(/_/g, " ")}</div>
                    )}
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        {list.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center text-gray-500">
            No prospects yet. Once the intake form is live and someone submits, they will show up here.
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add app/dashboard/pipeline/
git commit -m "feat(dashboard): pipeline view listing prospects by stage"
```

---

### Task 22: Add navigation link to pipeline

**Files:**
- Modify: `app/dashboard/layout.tsx` (or wherever the dashboard sidebar lives)

- [ ] **Step 1: Identify the navigation file**

Run:
```bash
grep -l "dashboard/clients" /Users/austin/projects/marketing-agency/components/dashboard/*.tsx | head -3
```

Likely `Sidebar.tsx`. Open it.

- [ ] **Step 2: Add a link to /dashboard/pipeline**

In the sidebar nav array, add after the Dashboard/home link:

```typescript
{ href: "/dashboard/pipeline", label: "Pipeline", icon: Target },
```

(Use the lucide-react icon import that's already in scope. If `Target` isn't imported, add it: `import { ..., Target } from "lucide-react"`.)

- [ ] **Step 3: Verify visually**

Run: `npm run dev` and open http://localhost:3000/dashboard
Expected: Pipeline link appears in sidebar; clicking it loads the pipeline view.

- [ ] **Step 4: Commit**

```bash
git add components/dashboard/Sidebar.tsx
git commit -m "feat(dashboard): add Pipeline link to sidebar nav"
```

---

## Section G — SaaS Manual Setup (Austin)

### Task 23: Build the Fillout intake form

**Files:** none (manual in Fillout dashboard)

- [ ] **Step 1: Create new form in Fillout**

Sign in to Fillout, create a new form. Title: "Surge Advisory Intake".

- [ ] **Step 2: Build the 10 questions**

Use these exact question IDs (substring-match-friendly so the parser in `lib/fillout/parse.ts` finds them):

| ID | Type | Label | Required | Notes |
|---|---|---|---|---|
| `q1_name_role` | Short answer | Your name and your role at the business | yes | Format hint: "Hayden — Owner" |
| `q2_email` | Email | Email address | yes | |
| `q2_phone` | Phone | Best phone number | yes | |
| `q3_biz_name` | Short answer | Business name | yes | |
| `q3_website` | Website | Website URL | no | |
| `q3_service_area` | Short answer | Main service area (city or region) | yes | |
| `q4_referral` | Multiple choice | How did you hear about Surge? | yes | Options: referral, podcast, social, search, other |
| `q5_revenue` | Dropdown | Annual revenue range | yes | Values: under_500k, 500k_to_1m, 1m_to_3m, 3m_to_10m, over_10m |
| `q5_team_ft` | Number | Full-time team size | yes | |
| `q5_team_pt` | Number | Part-time / contractor team size | no | |
| `q6_tech_stack` | Long answer | Quick rundown of your current tech stack (CRM, comms, accounting) | yes | 2-3 sentences |
| `q7_pain` | Long answer | What is the #1 thing slowing your business down right now? | yes | 2-3 sentences |
| `q8_lever` | Multi-select | If we could 10x one part of your business in the next 90 days, what would have the biggest impact? | yes | Values: lead_generation, sales_close_rate, operations_efficiency, customer_experience, team_performance, other |
| `q9_dm` | Short answer | Beyond you, who else needs to be involved in deciding to work with us? | no | |
| `q10_timing` | Dropdown | When do you realistically want changes in place? | yes | Values: yesterday_emergency, within_30_days, 60_to_90_days, ninety_plus_days, just_exploring |

**Critical:** the dropdown / multi-select `value` fields must be the underscored values (`under_500k` etc.), not display labels. Set "value" separately from "label" in Fillout for each option.

- [ ] **Step 3: Style with Surge brand**

Use Copper accent (`#B87333`), Navy headings (`#0A1628`), Helvetica/system font.

- [ ] **Step 4: Add thank-you redirect**

After submission, redirect to GHL booking page (Austin's calendar link).

---

### Task 24: Configure Fillout webhook

**Files:** none (manual in Fillout)

- [ ] **Step 1: Add webhook integration**

In Fillout form settings → Integrations → Webhooks:
- URL: `https://<your-vercel-domain>/api/webhooks/fillout`
- Method: POST
- Trigger: On submission

- [ ] **Step 2: Generate signing secret**

Fillout will provide a signing secret. Copy it.

- [ ] **Step 3: Add secret to Vercel env**

In Vercel project settings → Environment Variables, add:
```
FILLOUT_WEBHOOK_SECRET=<paste secret here>
```

Also add to `.env.local` so local dev doesn't error.

- [ ] **Step 4: Test the webhook**

Use Fillout's "Test webhook" button (if available) or submit a test form. Check Vercel logs for the receiver firing.

---

### Task 25: Configure GHL booking flow

**Files:** none (manual in GHL)

- [ ] **Step 1: Set up calendar in GHL**

Create a new calendar named "Surge Discovery Call". 30-minute slots, Austin's availability.

- [ ] **Step 2: Set landing page redirect**

Configure GHL calendar to be embedded or linked from a Surge page. The Fillout form's thank-you redirect (Task 23 step 4) sends people here.

- [ ] **Step 3: Auto-confirm SMS + email**

Configure GHL workflows to send:
- Immediate SMS confirmation upon booking
- Immediate email confirmation with calendar invite + meeting link
- 24-hour reminder SMS
- 1-hour reminder SMS

- [ ] **Step 4: Document the funnel**

Update `docs/surge/11-internal-systems-roadmap.md` with confirmed configuration:
- Intake form URL
- GHL calendar URL
- Webhook endpoint URL

---

### Task 26: Embed form on website

**Files:** Likely `app/page.tsx` or new `app/work-together/page.tsx`

- [ ] **Step 1: Create the embed page**

Create `app/work-together/page.tsx`:

```typescript
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work With Surge — Intake",
  description: "Tell us about your business so we can come prepared to help.",
};

export default function WorkTogetherPage() {
  const filloutFormId = process.env.NEXT_PUBLIC_FILLOUT_FORM_ID || "";
  const filloutSrc = `https://forms.fillout.com/t/${filloutFormId}`;

  return (
    <main className="min-h-screen bg-[#f7f7f5]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="text-xs tracking-widest text-[#B87333] font-bold mb-2">SURGE ADVISORY</div>
        <h1 className="text-4xl font-bold text-[#0A1628] mb-2">Tell us about your business</h1>
        <p className="text-gray-600 mb-8">
          Five minutes here saves us 30 on the call. We come prepared with real recommendations, not discovery.
        </p>

        <div className="bg-white rounded shadow border border-gray-200">
          <iframe
            src={filloutSrc}
            width="100%"
            height="900"
            frameBorder="0"
            title="Surge Advisory Intake"
          />
        </div>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Add env var**

Add to `.env.local` and Vercel:
```
NEXT_PUBLIC_FILLOUT_FORM_ID=<form id from Fillout URL>
```

- [ ] **Step 3: Commit**

```bash
git add app/work-together/
git commit -m "feat(public): /work-together page embedding Fillout intake form"
```

---

## Section H — End-to-End Verification + Wrap

### Task 27: Run end-to-end smoke test

**Files:** none (manual verification)

- [ ] **Step 1: Deploy to production**

```bash
git push origin main
```

Wait for Vercel deploy to complete.

- [ ] **Step 2: Submit a test intake**

Open https://surgeadvisory.co/work-together and submit a real intake (Austin fills it out as a test prospect).

- [ ] **Step 3: Verify each link in the chain**

```
[ ] Webhook fires (Vercel function logs show 200 response)
[ ] webhook_events row inserted (check Supabase Table Editor)
[ ] prospects row inserted with stage = 'intake_complete'
[ ] intake_responses row inserted with all q_* fields populated
[ ] prep_briefs row inserted within 60 seconds
[ ] Email arrives in austin@surgeadvisory.co inbox
[ ] /dashboard/pipeline shows the test prospect
[ ] /dashboard/prep/<id> renders the full brief
```

- [ ] **Step 4: Calibration note**

Read the brief. Note specifically:
- Did Claude correctly identify the pain?
- Are the 3 SPIN questions actually useful?
- Is the offering recommendation correct?
- Is the lost revenue math reasonable?

If any answer is "no," capture the gaps in `docs/surge/11-internal-systems-roadmap.md` for the next prompt iteration.

- [ ] **Step 5: Delete test data**

In Supabase SQL editor:
```sql
DELETE FROM prospects WHERE email = '<test email>';
-- Cascading deletes handle intake_responses + prep_briefs.
```

---

### Task 28: Update CLAUDE.md with new patterns

**Files:**
- Modify: `CLAUDE.md` (root project file)

- [ ] **Step 1: Add a "Surge Internal Systems" section to project CLAUDE.md**

Add near the bottom, before the "Code & Copy Voice" section:

```markdown
---

## Surge Internal Systems

When working on Surge consulting flow code (intake, prep brief, follow-up, blueprint, SOW, portal):

**Database:** Supabase tables (`prospects`, `intake_responses`, `prep_briefs`, `webhook_events`) — see `supabase/migrations/`. New tables go in new dated migration files, never modify existing.

**Server Supabase access:** `import { supabaseServer } from "@/lib/supabase/server"` — service role key, bypasses RLS. ONLY from API routes / server components.

**AI generators:** Live in `lib/ai/generators/`. Each follows the pattern:
1. Fetch input data from Supabase
2. Call `generateStructuredJson` with cached system prompt + variable user prompt
3. Validate output with Zod schema (in `lib/ai/schemas/`)
4. Persist result + render markdown for human consumption
5. Trigger downstream side effects (email send, etc.)

**Cached system prompts:** Live in `lib/ai/prompts/*.ts`. Bump `CACHE_VERSION` constant when meaningfully changing prompt content (invalidates cache).

**Email templates:** Live in `lib/email/templates/`. Plain HTML strings (no React Email yet). Always include both `html` and `text` versions. Always use Surge brand colors.

**Webhooks:** Live in `app/api/webhooks/<source>/route.ts`. Each webhook MUST:
1. Read raw body once (for signature verification)
2. Verify signature (skip with warning if env secret missing — dev mode only)
3. Insert raw payload to `webhook_events` table BEFORE processing
4. Process and update `webhook_events.processed_at` on success or `processing_error` on failure
5. Return 200 fast (fire-and-forget any AI generation downstream)
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: add Surge internal systems patterns to project CLAUDE.md"
```

---

## Done Criteria

The plan is complete when:

- [x] Supabase has 4 new tables (prospects, intake_responses, prep_briefs, webhook_events)
- [x] Fillout form is live at `surgeadvisory.co/work-together`
- [x] Webhook receiver creates a prospect + intake_response per submission
- [x] Claude generates a prep brief within 60 seconds of intake
- [x] Email arrives in Austin's inbox with the brief
- [x] `/dashboard/pipeline` lists prospects by stage
- [x] `/dashboard/prep/<id>` renders the full brief
- [x] Real test prospect submitted and full chain verified
- [x] No tasks left with `TODO` or `TBD` markers in the codebase

---

## Next Plan (Phase 2 — Post-Call Follow-Up)

After this plan ships and 3+ real prospects flow through, the next implementation plan covers:

- Fathom webhook receiver
- `call_recordings` + `call_summaries` tables
- Follow-up draft generator (transcript → email + action items)
- `/dashboard/calls/[id]` view with edit + send

Estimated 8-12 hours of work. To be written after this plan completes.
