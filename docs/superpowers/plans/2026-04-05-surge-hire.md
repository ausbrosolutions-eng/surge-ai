# Surge Hire Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a pre-hire intelligence module inside the Agency OS dashboard that scores candidates against world-class role standards before the first interview.

**Architecture:** All Supabase access runs server-side through Next.js API routes using a service role key — the browser never touches Supabase directly. The public candidate form is a client component that calls API routes via fetch(). The dashboard hiring module follows the exact same pattern as existing client modules (GBP, LSA, SEO).

**Tech Stack:** Next.js 14 App Router, Supabase (Postgres), @anthropic-ai/sdk (already installed), @supabase/supabase-js (new), Tailwind CSS, Lucide React, TypeScript.

---

## File Map

### New Files
- `lib/supabase-admin.ts` — Supabase client (service role, server-side only)
- `lib/hiring-types.ts` — All TypeScript interfaces for the hiring system
- `lib/hiring-templates.ts` — Role templates (dimensions, questions, skills per role)
- `lib/scoring-prompt.ts` — Builds the Claude scoring prompt from template + responses
- `supabase/schema.sql` — Database schema (run once in Supabase SQL editor)
- `app/api/hiring/roles/route.ts` — GET (list roles for client) + POST (create role)
- `app/api/hiring/assessments/route.ts` — POST (generate unique assessment link)
- `app/api/hiring/assessments/[slug]/route.ts` — GET (load assessment for public form)
- `app/api/hiring/submit/route.ts` — POST (store responses + score with Claude)
- `app/api/hiring/reports/[assessmentId]/route.ts` — GET (fetch score report)
- `app/api/hiring/candidates/[assessmentId]/route.ts` — PATCH (advance/pass candidate)
- `app/assess/[slug]/page.tsx` — Public candidate assessment form (mobile-optimized)
- `app/assess/[slug]/submitted/page.tsx` — Thank-you page after submission
- `app/dashboard/clients/[id]/hiring/page.tsx` — Client hiring dashboard module
- `components/hiring/FitBadge.tsx` — Green/Yellow/Red fit badge
- `components/hiring/DimensionScoreGrid.tsx` — Dimension scores with supporting quotes
- `components/hiring/CandidateCard.tsx` — Candidate summary card with fit badge
- `components/hiring/CandidateReport.tsx` — Full candidate report view
- `components/hiring/RolePipelineView.tsx` — Role list with candidate counts
- `components/hiring/AddRoleModal.tsx` — Modal to create a new role opening

### Modified Files
- `components/dashboard/Sidebar.tsx` — Add Hiring to clientModules array

---

## Task 1: Install Supabase and Configure Environment

**Files:**
- Modify: `package.json` (via npm install)
- Create: `.env.local` (add new keys)
- Create: `lib/supabase-admin.ts`

- [ ] **Step 1: Install Supabase client**

```bash
cd "/Users/austin/Marketing Agency" && npm install @supabase/supabase-js
```

Expected output: `added 1 package` (or similar, no errors)

- [ ] **Step 2: Add environment variables to .env.local**

Open `.env.local` in the project root (create it if it doesn't exist) and add:

```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Get these from: Supabase dashboard > Settings > API. Use the `service_role` key (not `anon`). This file is gitignored — never commit it.

- [ ] **Step 3: Create the Supabase admin client**

Create `lib/supabase-admin.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL) throw new Error("Missing SUPABASE_URL");
if (!process.env.SUPABASE_SERVICE_ROLE_KEY)
  throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
);
```

- [ ] **Step 4: Verify the server starts without errors**

```bash
cd "/Users/austin/Marketing Agency" && npm run dev
```

Expected: server starts on localhost:3000 with no errors. Kill with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add lib/supabase-admin.ts package.json package-lock.json && git commit -m "feat: add Supabase client for Surge Hire backend"
```

---

## Task 2: Create Database Schema in Supabase

**Files:**
- Create: `supabase/schema.sql`

- [ ] **Step 1: Create the schema file**

Create `supabase/schema.sql`:

```sql
-- Surge Hire Database Schema
-- Run this in Supabase SQL Editor: Dashboard > SQL Editor > New Query

-- Clients table (seeded manually to match existing localStorage client slugs)
create table if not exists hiring_clients (
  id text primary key,        -- matches client slug e.g. 'rehab-restoration'
  name text not null,
  created_at timestamptz default now()
);

-- Seed Rehab Restoration as the first client
insert into hiring_clients (id, name) values
  ('rehab-restoration', 'Rehab Restoration')
on conflict (id) do nothing;

-- Roles table
create table if not exists hiring_roles (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references hiring_clients(id),
  title text not null,
  role_type text not null,  -- 'water_mitigation_tech' | 'reconstruction_pm' | 'estimator' | 'ops_manager' | 'front_office'
  status text not null default 'open',  -- 'open' | 'closed'
  created_at timestamptz default now()
);

-- Assessments table (one per candidate per role)
create table if not exists hiring_assessments (
  id uuid primary key default gen_random_uuid(),
  role_id uuid not null references hiring_roles(id),
  unique_slug text not null unique,   -- used in public URL: /assess/[slug]
  candidate_name text,
  candidate_email text,
  candidate_phone text,
  submitted_at timestamptz,
  status text not null default 'pending',  -- 'pending' | 'scored' | 'advancing' | 'passed'
  created_at timestamptz default now()
);

-- Assessment responses (one row per question)
create table if not exists hiring_responses (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null references hiring_assessments(id),
  section text not null,        -- 'basic_fit' | 'situational' | 'skills' | 'references'
  question_key text not null,   -- e.g. 'years_experience', 'situational_1', 'ref1_name'
  response_text text not null
);

-- Score reports (one per assessment, generated by Claude)
create table if not exists hiring_score_reports (
  id uuid primary key default gen_random_uuid(),
  assessment_id uuid not null unique references hiring_assessments(id),
  overall_fit text not null,        -- 'green' | 'yellow' | 'red'
  overall_score numeric(3,1) not null,   -- 1.0-5.0
  dimension_scores jsonb not null,  -- [{dimension, score, confidence, supporting_quote}]
  interview_probes jsonb not null,  -- [{dimension, questions: [string]}]
  reference_guide jsonb not null,   -- [{question, purpose}]
  red_flags jsonb not null,         -- [string]
  iicrc_claimed jsonb,              -- [string] certifications candidate claimed
  generated_at timestamptz default now()
);

-- Disable RLS for v1 (internal agency tool, not multi-tenant public SaaS)
alter table hiring_clients disable row level security;
alter table hiring_roles disable row level security;
alter table hiring_assessments disable row level security;
alter table hiring_responses disable row level security;
alter table hiring_score_reports disable row level security;
```

- [ ] **Step 2: Run the schema in Supabase**

1. Go to your Supabase project dashboard
2. Click "SQL Editor" in the left sidebar
3. Click "New query"
4. Paste the entire contents of `supabase/schema.sql`
5. Click "Run"

Expected: All statements execute without errors. Tables appear in the Table Editor.

- [ ] **Step 3: Verify tables exist**

In Supabase Table Editor, confirm these 5 tables exist:
- `hiring_clients` (with one row: rehab-restoration)
- `hiring_roles`
- `hiring_assessments`
- `hiring_responses`
- `hiring_score_reports`

- [ ] **Step 4: Commit the schema file**

```bash
cd "/Users/austin/Marketing Agency" && git add supabase/schema.sql && git commit -m "feat: add Surge Hire database schema"
```

---

## Task 3: TypeScript Types

**Files:**
- Create: `lib/hiring-types.ts`

- [ ] **Step 1: Create hiring types**

Create `lib/hiring-types.ts`:

```typescript
export type RoleType =
  | "water_mitigation_tech"
  | "reconstruction_pm"
  | "estimator"
  | "ops_manager"
  | "front_office";

export type FitRating = "green" | "yellow" | "red";
export type CandidateStatus = "pending" | "scored" | "advancing" | "passed";
export type RoleStatus = "open" | "closed";

export interface HiringClient {
  id: string;
  name: string;
  created_at: string;
}

export interface HiringRole {
  id: string;
  client_id: string;
  title: string;
  role_type: RoleType;
  status: RoleStatus;
  created_at: string;
}

export interface HiringAssessment {
  id: string;
  role_id: string;
  unique_slug: string;
  candidate_name: string | null;
  candidate_email: string | null;
  candidate_phone: string | null;
  submitted_at: string | null;
  status: CandidateStatus;
  created_at: string;
}

export interface HiringResponse {
  id: string;
  assessment_id: string;
  section: "basic_fit" | "situational" | "skills" | "references";
  question_key: string;
  response_text: string;
}

export interface DimensionScore {
  dimension: string;
  score: number; // 1-5
  confidence: "low" | "medium" | "high";
  supporting_quote: string;
}

export interface InterviewProbe {
  dimension: string;
  questions: string[];
}

export interface ReferenceGuideItem {
  question: string;
  purpose: string;
}

export interface ScoreReport {
  id: string;
  assessment_id: string;
  overall_fit: FitRating;
  overall_score: number; // 1.0-5.0
  dimension_scores: DimensionScore[];
  interview_probes: InterviewProbe[];
  reference_guide: ReferenceGuideItem[];
  red_flags: string[];
  iicrc_claimed: string[];
  generated_at: string;
}

// Shape of all responses collected in the assessment form, keyed by question_key
export type ResponseMap = Record<string, string>;

// Combined view used in the dashboard candidate list
export interface CandidateWithReport {
  assessment: HiringAssessment;
  report: ScoreReport | null;
  role: HiringRole;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/austin/Marketing Agency" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add lib/hiring-types.ts && git commit -m "feat: add Surge Hire TypeScript types"
```

---

## Task 4: Role Templates

**Files:**
- Create: `lib/hiring-templates.ts`

- [ ] **Step 1: Create role templates**

Create `lib/hiring-templates.ts`:

```typescript
import { RoleType } from "./hiring-types";

export interface Dimension {
  name: string;
  description: string;
}

export interface BasicFitQuestion {
  key: string;
  label: string;
  type: "text" | "select" | "boolean";
  options?: string[]; // for select type
}

export interface SituationalQuestion {
  key: string;
  question: string;
}

export interface SkillQuestion {
  key: string;
  label: string;
}

export interface RoleTemplate {
  type: RoleType;
  title: string;
  dimensions: Dimension[];
  basicFitQuestions: BasicFitQuestion[];
  situationalQuestions: SituationalQuestion[];
  skillsQuestions: SkillQuestion[];
}

export const ROLE_TEMPLATES: Record<RoleType, RoleTemplate> = {
  water_mitigation_tech: {
    type: "water_mitigation_tech",
    title: "Water Mitigation Technician",
    dimensions: [
      {
        name: "Customer communication under stress",
        description:
          "Ability to calm, communicate clearly, and build trust with homeowners in crisis — at any hour, in any condition.",
      },
      {
        name: "Technical protocol knowledge",
        description:
          "Understanding of IICRC drying standards, moisture mapping, equipment placement, and documentation requirements.",
      },
      {
        name: "Urgency and emergency response mindset",
        description:
          "Treats every job as time-sensitive. Responds to on-call dispatches without hesitation. Understands that delay causes additional damage.",
      },
      {
        name: "Team coordination",
        description:
          "Communicates job status, escalates problems early, and works efficiently alongside other techs and the office.",
      },
      {
        name: "Documentation discipline",
        description:
          "Takes photos, logs moisture readings, and completes JobNimbus job notes consistently — not when reminded.",
      },
    ],
    basicFitQuestions: [
      {
        key: "iicrc_certs",
        label: "Which IICRC certifications do you currently hold?",
        type: "text",
      },
      {
        key: "years_experience",
        label: "Years of water mitigation or restoration experience",
        type: "select",
        options: ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"],
      },
      {
        key: "on_call_available",
        label: "Are you available for on-call and after-hours emergency response?",
        type: "select",
        options: ["Yes, fully available", "Yes, with some limitations", "No"],
      },
      {
        key: "max_commute",
        label: "Maximum commute you are willing to travel to job sites",
        type: "select",
        options: ["Under 30 min", "30-60 min", "60-90 min", "No limit"],
      },
      {
        key: "compensation_expectation",
        label: "Desired hourly rate or annual salary",
        type: "text",
      },
    ],
    situationalQuestions: [
      {
        key: "situational_1",
        question:
          "A homeowner calls at 11pm with a burst pipe. You arrive and they are panicked and aggressive. Walk me through exactly how you handle the first 10 minutes on site.",
      },
      {
        key: "situational_2",
        question:
          "You are mid-job and your moisture readings are higher than the initial assessment showed. The crew lead is unavailable. What do you do?",
      },
      {
        key: "situational_3",
        question:
          "Describe the most difficult restoration job you have worked on. What made it hard, and specifically what did you do to get through it?",
      },
    ],
    skillsQuestions: [
      {
        key: "skill_equipment",
        label: "Comfort operating dehumidifiers, air movers, and moisture meters (1=never used, 5=expert)",
      },
      {
        key: "skill_jobnimbus",
        label: "Comfort with JobNimbus or similar job management software (1=never used, 5=daily user)",
      },
      {
        key: "skill_documentation",
        label: "Consistency in completing job photos and notes without being reminded (1=need reminders, 5=always self-directed)",
      },
      {
        key: "skill_physical",
        label: "Ability to lift 50+ lbs repeatedly and work in confined or damaged spaces (1=limited, 5=no issue)",
      },
    ],
  },

  reconstruction_pm: {
    type: "reconstruction_pm",
    title: "Reconstruction Project Manager",
    dimensions: [
      {
        name: "Scope and budget management",
        description:
          "Accurately scopes jobs, writes Xactimate estimates, and tracks costs against budget throughout the project.",
      },
      {
        name: "Subcontractor coordination",
        description:
          "Sources, schedules, and holds subs accountable. Gets the right people on site at the right time.",
      },
      {
        name: "Homeowner communication",
        description:
          "Sets clear expectations, provides proactive updates, and handles scope changes professionally.",
      },
      {
        name: "Insurance claim navigation",
        description:
          "Understands the supplement process, communicates with adjusters, and maximizes legitimate reimbursement.",
      },
      {
        name: "Quality and closeout discipline",
        description:
          "Inspects work before homeowner walkthrough, collects final documentation, and closes jobs completely.",
      },
    ],
    basicFitQuestions: [
      {
        key: "xactimate_experience",
        label: "Xactimate proficiency level",
        type: "select",
        options: ["Never used", "Basic user", "Intermediate", "Advanced"],
      },
      {
        key: "years_experience",
        label: "Years managing reconstruction or general contracting projects",
        type: "select",
        options: ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"],
      },
      {
        key: "concurrent_jobs",
        label: "Most projects you have managed simultaneously",
        type: "select",
        options: ["1-3", "4-7", "8-15", "15+"],
      },
      {
        key: "compensation_expectation",
        label: "Desired annual salary or compensation structure",
        type: "text",
      },
    ],
    situationalQuestions: [
      {
        key: "situational_1",
        question:
          "A homeowner calls you upset because the drywall finish does not match what they were expecting. The sub says it is within spec. How do you handle this?",
      },
      {
        key: "situational_2",
        question:
          "You are 3 weeks into a 4-week job and realize the budget is tracking 20% over estimate. The insurance adjuster has already approved the amount. What do you do?",
      },
      {
        key: "situational_3",
        question:
          "Walk me through how you manage a job from initial scope to final payment. What does your week-to-week process look like?",
      },
    ],
    skillsQuestions: [
      {
        key: "skill_xactimate",
        label: "Xactimate estimation ability (1=never used, 5=daily advanced user)",
      },
      {
        key: "skill_adjuster",
        label: "Experience working with insurance adjusters on supplements (1=no experience, 5=done it hundreds of times)",
      },
      {
        key: "skill_subs",
        label: "Ability to recruit and manage subcontractors independently (1=no experience, 5=full network, managed dozens)",
      },
      {
        key: "skill_jobnimbus",
        label: "JobNimbus or similar project management software (1=never used, 5=power user)",
      },
    ],
  },

  estimator: {
    type: "estimator",
    title: "Estimator",
    dimensions: [
      {
        name: "Xactimate proficiency",
        description:
          "Writes complete, accurate, defensible estimates that capture all legitimate line items the first time.",
      },
      {
        name: "Scope accuracy",
        description:
          "Identifies hidden damage and scope items during inspection that others would miss — protecting gross margin.",
      },
      {
        name: "Adjuster negotiation",
        description:
          "Effectively supplements claims, pushes back on underpayment, and communicates with adjusters professionally.",
      },
      {
        name: "Turnaround speed",
        description:
          "Delivers estimates fast enough to keep jobs moving and not delay the production schedule.",
      },
      {
        name: "Documentation and compliance",
        description:
          "Estimates are complete, properly formatted, and tied to photos and inspection notes.",
      },
    ],
    basicFitQuestions: [
      {
        key: "xactimate_level",
        label: "Xactimate certification level",
        type: "select",
        options: ["None", "Level 1", "Level 2", "Level 3"],
      },
      {
        key: "years_estimating",
        label: "Years writing restoration estimates",
        type: "select",
        options: ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"],
      },
      {
        key: "monthly_estimate_volume",
        label: "Most estimates you have written in a single month",
        type: "select",
        options: ["1-5", "6-15", "16-30", "30+"],
      },
      {
        key: "compensation_expectation",
        label: "Desired compensation (hourly, salary, or per-estimate)",
        type: "text",
      },
    ],
    situationalQuestions: [
      {
        key: "situational_1",
        question:
          "An adjuster approves $28,000 for a job you estimated at $41,000. Walk me through your supplement process — what specifically do you do?",
      },
      {
        key: "situational_2",
        question:
          "You are on a water damage inspection and the visible damage looks straightforward. What additional items do you check for that a less experienced estimator would miss?",
      },
      {
        key: "situational_3",
        question:
          "Describe the largest or most complex estimate you have written. What was the total amount, what made it complex, and what was the outcome?",
      },
    ],
    skillsQuestions: [
      {
        key: "skill_xactimate",
        label: "Xactimate proficiency (1=basic, 5=advanced with macro/assembly knowledge)",
      },
      {
        key: "skill_moisture",
        label: "Ability to read and interpret moisture reports when writing scope (1=no experience, 5=fully proficient)",
      },
      {
        key: "skill_adjuster",
        label: "Direct adjuster negotiation experience (1=no experience, 5=done it hundreds of times)",
      },
    ],
  },

  ops_manager: {
    type: "ops_manager",
    title: "Operations Manager / Team Lead",
    dimensions: [
      {
        name: "Systems thinking",
        description:
          "Builds repeatable processes that work without constant supervision. Sees operational bottlenecks and fixes root causes.",
      },
      {
        name: "Team accountability",
        description:
          "Holds techs and PMs to standards without micromanaging. Addresses performance issues directly and early.",
      },
      {
        name: "Owner communication",
        description:
          "Keeps ownership informed with the right information at the right time. Flags problems before they become crises.",
      },
      {
        name: "Scheduling and dispatch efficiency",
        description:
          "Maximizes tech utilization, minimizes drive time, and keeps the production schedule moving.",
      },
      {
        name: "Data and reporting discipline",
        description:
          "Tracks key metrics, identifies trends, and uses data to make operational decisions rather than gut feel.",
      },
    ],
    basicFitQuestions: [
      {
        key: "team_size_managed",
        label: "Largest team you have directly managed",
        type: "select",
        options: ["1-3 people", "4-8 people", "9-20 people", "20+ people"],
      },
      {
        key: "years_ops",
        label: "Years in an operations leadership role",
        type: "select",
        options: ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"],
      },
      {
        key: "industry_background",
        label: "Industry background",
        type: "text",
      },
      {
        key: "compensation_expectation",
        label: "Desired annual compensation",
        type: "text",
      },
    ],
    situationalQuestions: [
      {
        key: "situational_1",
        question:
          "You inherit a team where documentation compliance is 40% — most techs are not completing job notes. Ownership wants 90% within 60 days. What specifically do you do?",
      },
      {
        key: "situational_2",
        question:
          "Two of your top techs are having ongoing conflict that is affecting job quality and team morale. How do you handle this?",
      },
      {
        key: "situational_3",
        question:
          "Walk me through a specific operational process you built or improved at a previous job. What was broken, what did you build, and what were the results?",
      },
    ],
    skillsQuestions: [
      {
        key: "skill_systems",
        label: "Experience building SOPs and operational workflows (1=never done it, 5=built dozens of systems from scratch)",
      },
      {
        key: "skill_performance",
        label: "Comfort having direct performance conversations with underperforming staff (1=avoid it, 5=do it confidently and regularly)",
      },
      {
        key: "skill_scheduling",
        label: "Experience managing field tech scheduling and dispatch (1=no experience, 5=ran dispatch for 10+ techs)",
      },
      {
        key: "skill_data",
        label: "Comfort analyzing operational metrics and KPIs (1=not my thing, 5=data-driven decision maker)",
      },
    ],
  },

  front_office: {
    type: "front_office",
    title: "Front Office / Job Coordinator",
    dimensions: [
      {
        name: "Phone presence and first impression",
        description:
          "Answers calls professionally, creates immediate trust, and converts inbound inquiries into booked jobs.",
      },
      {
        name: "Customer follow-through",
        description:
          "Follows up on pending jobs, unanswered calls, and outstanding documentation without being told.",
      },
      {
        name: "JobNimbus and data accuracy",
        description:
          "Enters job data completely and correctly the first time. Errors in the system create billing and collection problems downstream.",
      },
      {
        name: "Stress tolerance and prioritization",
        description:
          "Handles multiple open jobs, urgent calls, and competing priorities without dropping the ball.",
      },
      {
        name: "Insurance process knowledge",
        description:
          "Understands the basics of how claims work, can answer homeowner questions, and knows when to escalate.",
      },
    ],
    basicFitQuestions: [
      {
        key: "years_admin",
        label: "Years in a customer-facing office or coordinator role",
        type: "select",
        options: ["Less than 1 year", "1-2 years", "3-5 years", "5+ years"],
      },
      {
        key: "jobnimbus_experience",
        label: "JobNimbus experience",
        type: "select",
        options: ["Never used", "Basic user", "Daily user", "Power user / trainer"],
      },
      {
        key: "restoration_experience",
        label: "Prior restoration or insurance industry experience",
        type: "select",
        options: ["None", "Some exposure", "1-2 years", "3+ years"],
      },
      {
        key: "compensation_expectation",
        label: "Desired hourly rate or annual salary",
        type: "text",
      },
    ],
    situationalQuestions: [
      {
        key: "situational_1",
        question:
          "It is 8am Monday and you have 6 active jobs in progress, 3 missed calls from the weekend, and an upset homeowner on hold asking where their project manager is. Walk me through how you start this day.",
      },
      {
        key: "situational_2",
        question:
          "A homeowner calls angry because they received a bill they did not expect and their insurance company says there is a discrepancy in the claim paperwork. How do you handle this call?",
      },
      {
        key: "situational_3",
        question:
          "You notice that job notes for the past week are incomplete for several active jobs — techs are not logging their updates. You are not those techs' direct supervisor. What do you do?",
      },
    ],
    skillsQuestions: [
      {
        key: "skill_phones",
        label: "Comfort handling high call volume and difficult customer calls (1=get anxious, 5=thrive in it)",
      },
      {
        key: "skill_jobnimbus",
        label: "JobNimbus data entry accuracy and completeness (1=never used, 5=power user, zero errors)",
      },
      {
        key: "skill_multitask",
        label: "Ability to track multiple open jobs simultaneously without dropping details (1=need a quiet environment, 5=handle chaos well)",
      },
      {
        key: "skill_insurance",
        label: "Understanding of insurance claims process (1=no knowledge, 5=can answer most homeowner questions)",
      },
    ],
  },
};

export const ROLE_TYPE_LABELS: Record<RoleType, string> = {
  water_mitigation_tech: "Water Mitigation Technician",
  reconstruction_pm: "Reconstruction Project Manager",
  estimator: "Estimator",
  ops_manager: "Operations Manager / Team Lead",
  front_office: "Front Office / Job Coordinator",
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/austin/Marketing Agency" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add lib/hiring-templates.ts && git commit -m "feat: add role templates for all 5 restoration positions"
```

---

## Task 5: AI Scoring Prompt Builder

**Files:**
- Create: `lib/scoring-prompt.ts`

- [ ] **Step 1: Create the prompt builder**

Create `lib/scoring-prompt.ts`:

```typescript
import { RoleTemplate } from "./hiring-templates";
import { ResponseMap } from "./hiring-types";

export function buildScoringPrompt(
  template: RoleTemplate,
  responses: ResponseMap
): string {
  const basicFitSection = template.basicFitQuestions
    .map((q) => `${q.label}: ${responses[q.key] || "Not answered"}`)
    .join("\n");

  const situationalSection = template.situationalQuestions
    .map(
      (q) =>
        `Question: ${q.question}\nAnswer: ${responses[q.key] || "Not answered"}`
    )
    .join("\n\n");

  const skillsSection = template.skillsQuestions
    .map((q) => `${q.label}: ${responses[q.key] || "Not answered"} out of 5`)
    .join("\n");

  const referencesSection = [
    `Reference 1: ${responses["ref1_name"] || "Not provided"} | Relationship: ${responses["ref1_relationship"] || ""} | Phone: ${responses["ref1_phone"] || ""} | Known how long: ${responses["ref1_duration"] || ""}`,
    `Reference 2: ${responses["ref2_name"] || "Not provided"} | Relationship: ${responses["ref2_relationship"] || ""} | Phone: ${responses["ref2_phone"] || ""} | Known how long: ${responses["ref2_duration"] || ""}`,
  ].join("\n");

  const dimensionList = template.dimensions
    .map((d) => `- ${d.name}: ${d.description}`)
    .join("\n");

  return `You are a hiring assessment expert for restoration and home service companies. Score this candidate for the role of ${template.title}.

WORLD-CLASS PERFORMANCE DIMENSIONS for ${template.title}:
${dimensionList}

CANDIDATE RESPONSES:

SECTION 1 - BASIC FIT:
${basicFitSection}

SECTION 2 - SITUATIONAL QUESTIONS:
${situationalSection}

SECTION 3 - SKILLS SELF-ASSESSMENT:
${skillsSection}

SECTION 4 - REFERENCES:
${referencesSection}

SCORING INSTRUCTIONS:
Score each dimension 1-5:
- 5: Response clearly exceeds the world-class standard for this dimension
- 4: Response meets the world-class standard
- 3: Response approaches the standard — coachable gap exists
- 2: Response falls below the standard — significant gap
- 1: Response does not meet minimum threshold

Overall fit:
- green: overall_score 3.8 or higher — strong hire, advance to interview
- yellow: overall_score 2.5 to 3.7 — potential with coaching, probe key dimensions
- red: overall_score below 2.5 — pass on this candidate

Include interview_probes ONLY for dimensions that scored 3 or below.
Generate 4 reference_guide questions based on where the candidate showed weakness.
Flag red_flags for: inconsistencies between skill self-ratings and situational answers, availability mismatches, compensation outside expected range, blame-shifting language, or vague non-answers to situational questions.
List all IICRC certifications the candidate claimed in iicrc_claimed (empty array if none claimed).

Return ONLY a valid JSON object with exactly this structure — no markdown, no explanation, no text outside the JSON:
{
  "overall_fit": "green" | "yellow" | "red",
  "overall_score": number (1.0-5.0, one decimal place, average of all dimension scores),
  "dimension_scores": [
    {
      "dimension": "exact dimension name from the list above",
      "score": number (1-5),
      "confidence": "low" | "medium" | "high",
      "supporting_quote": "direct quote from candidate response, max 120 characters"
    }
  ],
  "interview_probes": [
    {
      "dimension": "dimension name",
      "questions": ["question 1", "question 2"]
    }
  ],
  "reference_guide": [
    {
      "question": "specific question to ask the reference",
      "purpose": "what this question is designed to reveal"
    }
  ],
  "red_flags": ["specific concern as a complete sentence"],
  "iicrc_claimed": ["certification name"]
}`;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd "/Users/austin/Marketing Agency" && npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add lib/scoring-prompt.ts && git commit -m "feat: add Claude scoring prompt builder"
```

---

## Task 6: API Route — Roles (Create and List)

**Files:**
- Create: `app/api/hiring/roles/route.ts`

- [ ] **Step 1: Create the roles API route**

Create `app/api/hiring/roles/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ROLE_TEMPLATES } from "@/lib/hiring-templates";
import { RoleType } from "@/lib/hiring-types";

// GET /api/hiring/roles?clientId=rehab-restoration
export async function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get("clientId");
  if (!clientId) {
    return NextResponse.json({ error: "clientId is required" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("hiring_roles")
    .select("*")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to fetch roles:", error);
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }

  return NextResponse.json({ roles: data });
}

// POST /api/hiring/roles
// Body: { clientId: string, title: string, roleType: RoleType }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clientId, title, roleType } = body as {
    clientId: string;
    title: string;
    roleType: RoleType;
  };

  if (!clientId || !title || !roleType) {
    return NextResponse.json(
      { error: "clientId, title, and roleType are required" },
      { status: 400 }
    );
  }

  if (!ROLE_TEMPLATES[roleType]) {
    return NextResponse.json({ error: "Invalid roleType" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("hiring_roles")
    .insert({ client_id: clientId, title, role_type: roleType, status: "open" })
    .select()
    .single();

  if (error) {
    console.error("Failed to create role:", error);
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }

  return NextResponse.json({ role: data }, { status: 201 });
}
```

- [ ] **Step 2: Test the POST route with curl**

Start the dev server in one terminal:
```bash
cd "/Users/austin/Marketing Agency" && npm run dev
```

In another terminal:
```bash
curl -X POST http://localhost:3000/api/hiring/roles \
  -H "Content-Type: application/json" \
  -d '{"clientId":"rehab-restoration","title":"Water Mitigation Tech","roleType":"water_mitigation_tech"}'
```

Expected response: `{"role":{"id":"<uuid>","client_id":"rehab-restoration","title":"Water Mitigation Tech","role_type":"water_mitigation_tech","status":"open","created_at":"<timestamp>"}}`

- [ ] **Step 3: Test the GET route with curl**

```bash
curl "http://localhost:3000/api/hiring/roles?clientId=rehab-restoration"
```

Expected response: `{"roles":[{"id":"<uuid>",...}]}`

- [ ] **Step 4: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add app/api/hiring/roles/route.ts && git commit -m "feat: add hiring roles API route (GET + POST)"
```

---

## Task 7: API Route — Generate Assessment Link

**Files:**
- Create: `app/api/hiring/assessments/route.ts`

- [ ] **Step 1: Create the assessments API route**

Create `app/api/hiring/assessments/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// POST /api/hiring/assessments
// Body: { roleId: string }
// Returns: { assessment: { id, unique_slug, assessmentUrl } }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { roleId } = body as { roleId: string };

  if (!roleId) {
    return NextResponse.json({ error: "roleId is required" }, { status: 400 });
  }

  // Verify the role exists
  const { data: role, error: roleError } = await supabaseAdmin
    .from("hiring_roles")
    .select("id, status")
    .eq("id", roleId)
    .single();

  if (roleError || !role) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  if (role.status === "closed") {
    return NextResponse.json({ error: "Role is closed" }, { status: 400 });
  }

  // Generate a unique slug from a UUID (8 hex chars — collision-safe at this scale)
  const uniqueSlug = crypto.randomUUID().split("-")[0];

  const { data, error } = await supabaseAdmin
    .from("hiring_assessments")
    .insert({ role_id: roleId, unique_slug: uniqueSlug })
    .select()
    .single();

  if (error) {
    console.error("Failed to create assessment:", error);
    return NextResponse.json(
      { error: "Failed to create assessment link" },
      { status: 500 }
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const assessmentUrl = `${baseUrl}/assess/${uniqueSlug}`;

  return NextResponse.json({ assessment: data, assessmentUrl }, { status: 201 });
}
```

- [ ] **Step 2: Add NEXT_PUBLIC_BASE_URL to .env.local**

Add this line to `.env.local`:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

When deploying to Vercel, set this to `https://surgeadvisory.co`.

- [ ] **Step 3: Test with curl**

```bash
# First get a role ID from the roles you created in Task 6
ROLE_ID=$(curl -s "http://localhost:3000/api/hiring/roles?clientId=rehab-restoration" | python3 -c "import sys,json; print(json.load(sys.stdin)['roles'][0]['id'])")

curl -X POST http://localhost:3000/api/hiring/assessments \
  -H "Content-Type: application/json" \
  -d "{\"roleId\":\"$ROLE_ID\"}"
```

Expected response includes `assessmentUrl: "http://localhost:3000/assess/<slug>"`

- [ ] **Step 4: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add app/api/hiring/assessments/route.ts && git commit -m "feat: add assessment link generation API route"
```

---

## Task 8: API Route — Load Assessment for Public Form

**Files:**
- Create: `app/api/hiring/assessments/[slug]/route.ts`

- [ ] **Step 1: Create the assessment fetch route**

Create `app/api/hiring/assessments/[slug]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ROLE_TEMPLATES } from "@/lib/hiring-templates";
import { RoleType } from "@/lib/hiring-types";

// GET /api/hiring/assessments/[slug]
// Used by the public candidate form to load role info
export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const { data: assessment, error } = await supabaseAdmin
    .from("hiring_assessments")
    .select("*, hiring_roles(*)")
    .eq("unique_slug", params.slug)
    .single();

  if (error || !assessment) {
    return NextResponse.json(
      { error: "Assessment not found" },
      { status: 404 }
    );
  }

  if (assessment.submitted_at) {
    return NextResponse.json(
      { error: "Assessment already submitted" },
      { status: 410 }
    );
  }

  const role = assessment.hiring_roles as {
    id: string;
    role_type: RoleType;
    title: string;
    status: string;
  };

  if (role.status === "closed") {
    return NextResponse.json(
      { error: "This position is no longer accepting applications" },
      { status: 410 }
    );
  }

  const template = ROLE_TEMPLATES[role.role_type];

  return NextResponse.json({
    assessmentId: assessment.id,
    roleTitle: role.title,
    roleType: role.role_type,
    template,
  });
}
```

- [ ] **Step 2: Test with curl (using the slug from Task 7)**

```bash
# Use the slug from the assessmentUrl returned in Task 7
curl "http://localhost:3000/api/hiring/assessments/<your-slug>"
```

Expected: returns `assessmentId`, `roleTitle`, `roleType`, and `template` with all questions.

- [ ] **Step 3: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add "app/api/hiring/assessments/[slug]/route.ts" && git commit -m "feat: add assessment fetch route for public form"
```

---

## Task 9: API Route — Submit Assessment and Score with Claude

**Files:**
- Create: `app/api/hiring/submit/route.ts`

- [ ] **Step 1: Create the submit route**

Create `app/api/hiring/submit/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ROLE_TEMPLATES } from "@/lib/hiring-templates";
import { buildScoringPrompt } from "@/lib/scoring-prompt";
import { RoleType, ResponseMap } from "@/lib/hiring-types";

const anthropic = new Anthropic();

// POST /api/hiring/submit
// Body: {
//   assessmentId: string,
//   candidateName: string,
//   candidateEmail: string,
//   candidatePhone: string,
//   responses: ResponseMap  -- all question answers keyed by question_key
// }
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { assessmentId, candidateName, candidateEmail, candidatePhone, responses } =
    body as {
      assessmentId: string;
      candidateName: string;
      candidateEmail: string;
      candidatePhone: string;
      responses: ResponseMap;
    };

  if (!assessmentId || !candidateName || !responses) {
    return NextResponse.json(
      { error: "assessmentId, candidateName, and responses are required" },
      { status: 400 }
    );
  }

  // Load the assessment and its role
  const { data: assessment, error: assessmentError } = await supabaseAdmin
    .from("hiring_assessments")
    .select("*, hiring_roles(*)")
    .eq("id", assessmentId)
    .single();

  if (assessmentError || !assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  if (assessment.submitted_at) {
    return NextResponse.json(
      { error: "Assessment already submitted" },
      { status: 410 }
    );
  }

  const role = assessment.hiring_roles as { role_type: RoleType };
  const template = ROLE_TEMPLATES[role.role_type];

  // Store candidate info and mark as submitted
  const { error: updateError } = await supabaseAdmin
    .from("hiring_assessments")
    .update({
      candidate_name: candidateName,
      candidate_email: candidateEmail || null,
      candidate_phone: candidatePhone || null,
      submitted_at: new Date().toISOString(),
      status: "scored",
    })
    .eq("id", assessmentId);

  if (updateError) {
    console.error("Failed to update assessment:", updateError);
    return NextResponse.json(
      { error: "Failed to save assessment" },
      { status: 500 }
    );
  }

  // Store individual responses
  const responseRows = Object.entries(responses).map(([questionKey, responseText]) => ({
    assessment_id: assessmentId,
    section: getSectionForKey(questionKey, template),
    question_key: questionKey,
    response_text: String(responseText),
  }));

  const { error: responsesError } = await supabaseAdmin
    .from("hiring_responses")
    .insert(responseRows);

  if (responsesError) {
    console.error("Failed to store responses:", responsesError);
    // Don't fail the request — scoring can still proceed
  }

  // Score with Claude
  const prompt = buildScoringPrompt(template, responses);

  let scoreReport;
  try {
    const claudeResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const content = claudeResponse.content[0];
    if (content.type !== "text") throw new Error("Unexpected Claude response type");

    scoreReport = JSON.parse(content.text);
  } catch (err) {
    console.error("Claude scoring failed:", err);
    return NextResponse.json(
      { error: "Scoring failed — please contact support" },
      { status: 500 }
    );
  }

  // Store the score report
  const { error: reportError } = await supabaseAdmin
    .from("hiring_score_reports")
    .insert({
      assessment_id: assessmentId,
      overall_fit: scoreReport.overall_fit,
      overall_score: scoreReport.overall_score,
      dimension_scores: scoreReport.dimension_scores,
      interview_probes: scoreReport.interview_probes,
      reference_guide: scoreReport.reference_guide,
      red_flags: scoreReport.red_flags,
      iicrc_claimed: scoreReport.iicrc_claimed,
    });

  if (reportError) {
    console.error("Failed to store score report:", reportError);
    return NextResponse.json(
      { error: "Failed to save score report" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

function getSectionForKey(
  key: string,
  template: ReturnType<typeof Object.values>[0]
): "basic_fit" | "situational" | "skills" | "references" {
  if (key.startsWith("ref")) return "references";
  if (key.startsWith("situational")) return "situational";
  if (key.startsWith("skill_")) return "skills";
  return "basic_fit";
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add app/api/hiring/submit/route.ts && git commit -m "feat: add assessment submit and Claude scoring route"
```

---

## Task 10: API Routes — Fetch Report and Update Candidate Status

**Files:**
- Create: `app/api/hiring/reports/[assessmentId]/route.ts`
- Create: `app/api/hiring/candidates/[assessmentId]/route.ts`

- [ ] **Step 1: Create the report fetch route**

Create `app/api/hiring/reports/[assessmentId]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/hiring/reports/[assessmentId]
export async function GET(
  _request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  const { data, error } = await supabaseAdmin
    .from("hiring_score_reports")
    .select("*")
    .eq("assessment_id", params.assessmentId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  return NextResponse.json({ report: data });
}
```

- [ ] **Step 2: Create the candidate status update route**

Create `app/api/hiring/candidates/[assessmentId]/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { CandidateStatus } from "@/lib/hiring-types";

// PATCH /api/hiring/candidates/[assessmentId]
// Body: { status: CandidateStatus }
export async function PATCH(
  request: NextRequest,
  { params }: { params: { assessmentId: string } }
) {
  const body = await request.json();
  const { status } = body as { status: CandidateStatus };

  const validStatuses: CandidateStatus[] = ["pending", "scored", "advancing", "passed"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("hiring_assessments")
    .update({ status })
    .eq("id", params.assessmentId);

  if (error) {
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add "app/api/hiring/reports/[assessmentId]/route.ts" "app/api/hiring/candidates/[assessmentId]/route.ts" && git commit -m "feat: add report fetch and candidate status update routes"
```

---

## Task 11: Shared UI Components

**Files:**
- Create: `components/hiring/FitBadge.tsx`
- Create: `components/hiring/DimensionScoreGrid.tsx`
- Create: `components/hiring/CandidateCard.tsx`

- [ ] **Step 1: Create FitBadge**

Create `components/hiring/FitBadge.tsx`:

```typescript
"use client";

import { FitRating } from "@/lib/hiring-types";

interface FitBadgeProps {
  rating: FitRating;
  size?: "sm" | "md";
}

const CONFIG = {
  green: {
    label: "Strong Hire",
    className: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  },
  yellow: {
    label: "Probe Further",
    className: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  },
  red: {
    label: "Pass",
    className: "bg-red-500/15 text-red-400 border border-red-500/30",
  },
};

export function FitBadge({ rating, size = "md" }: FitBadgeProps) {
  const { label, className } = CONFIG[rating];
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1";
  return (
    <span className={`rounded-full font-medium ${sizeClass} ${className}`}>
      {label}
    </span>
  );
}
```

- [ ] **Step 2: Create DimensionScoreGrid**

Create `components/hiring/DimensionScoreGrid.tsx`:

```typescript
"use client";

import { DimensionScore } from "@/lib/hiring-types";

interface DimensionScoreGridProps {
  scores: DimensionScore[];
}

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((dot) => (
        <div
          key={dot}
          className={`w-2 h-2 rounded-full ${
            dot <= score
              ? score >= 4
                ? "bg-emerald-400"
                : score >= 3
                ? "bg-amber-400"
                : "bg-red-400"
              : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

export function DimensionScoreGrid({ scores }: DimensionScoreGridProps) {
  return (
    <div className="space-y-4">
      {scores.map((item) => (
        <div key={item.dimension} className="space-y-1.5">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm font-medium text-warm-white">
              {item.dimension}
            </span>
            <div className="flex items-center gap-2 shrink-0">
              <ScoreDots score={item.score} />
              <span className="text-xs text-warm-gray w-4 text-right">
                {item.score}/5
              </span>
            </div>
          </div>
          {item.supporting_quote && (
            <p className="text-xs text-warm-gray italic border-l-2 border-white/10 pl-3">
              "{item.supporting_quote}"
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Create CandidateCard**

Create `components/hiring/CandidateCard.tsx`:

```typescript
"use client";

import { HiringAssessment, ScoreReport } from "@/lib/hiring-types";
import { FitBadge } from "./FitBadge";
import { ChevronRight } from "lucide-react";

interface CandidateCardProps {
  assessment: HiringAssessment;
  report: ScoreReport | null;
  onClick: () => void;
}

export function CandidateCard({ assessment, report, onClick }: CandidateCardProps) {
  const submittedDate = assessment.submitted_at
    ? new Date(assessment.submitted_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-dark-card border border-dark-border rounded-lg p-4 hover:border-white/20 transition-colors"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium text-warm-white truncate">
            {assessment.candidate_name || "Unnamed Candidate"}
          </p>
          {submittedDate && (
            <p className="text-xs text-warm-gray mt-0.5">Submitted {submittedDate}</p>
          )}
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {report ? (
            <>
              <FitBadge rating={report.overall_fit} size="sm" />
              <span className="text-sm text-warm-gray">
                {report.overall_score.toFixed(1)}/5
              </span>
            </>
          ) : (
            <span className="text-xs text-warm-gray">Scoring...</span>
          )}
          <ChevronRight className="w-4 h-4 text-warm-gray" />
        </div>
      </div>
    </button>
  );
}
```

- [ ] **Step 4: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add components/hiring/ && git commit -m "feat: add FitBadge, DimensionScoreGrid, and CandidateCard components"
```

---

## Task 12: Public Candidate Assessment Form

**Files:**
- Create: `app/assess/[slug]/page.tsx`
- Create: `app/assess/[slug]/submitted/page.tsx`

- [ ] **Step 1: Create the public assessment form page**

Create `app/assess/[slug]/page.tsx`:

```typescript
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RoleTemplate } from "@/lib/hiring-templates";
import { ResponseMap } from "@/lib/hiring-types";

interface AssessmentData {
  assessmentId: string;
  roleTitle: string;
  template: RoleTemplate;
}

export default function AssessmentPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [data, setData] = useState<AssessmentData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0); // 0=intro, 1=basic, 2=situational, 3=skills, 4=references
  const [responses, setResponses] = useState<ResponseMap>({});
  const [candidateName, setCandidateName] = useState("");
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidatePhone, setCandidatePhone] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/hiring/assessments/${params.slug}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError("Could not load assessment. Check your connection and try again."));
  }, [params.slug]);

  function updateResponse(key: string, value: string) {
    setResponses((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    if (!data) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/hiring/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId: data.assessmentId,
          candidateName,
          candidateEmail,
          candidatePhone,
          responses,
        }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      router.push(`/assess/${params.slug}/submitted`);
    } catch (err) {
      setSubmitting(false);
      alert("Submission failed — please try again or contact us.");
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <p className="text-warm-white text-lg font-medium">This link is unavailable</p>
          <p className="text-warm-gray mt-2 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  const { template } = data;
  const totalSteps = 4;
  const progress = step === 0 ? 0 : Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <div className="border-b border-dark-border bg-dark-surface px-6 py-4">
        <p className="text-xs text-warm-gray uppercase tracking-wider">Surge Hire Assessment</p>
        <p className="text-warm-white font-medium mt-0.5">{data.roleTitle}</p>
        {step > 0 && (
          <div className="mt-3">
            <div className="h-1 bg-white/10 rounded-full">
              <div
                className="h-1 bg-white rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-warm-gray mt-1">Section {step} of {totalSteps}</p>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8">
        {/* Intro */}
        {step === 0 && (
          <div>
            <h1 className="text-2xl font-bold text-warm-white">
              Hi, we are glad you applied.
            </h1>
            <p className="text-warm-gray mt-3 leading-relaxed">
              This assessment takes about 15-20 minutes and helps us understand your experience and approach to the work.
              There are no trick questions — we want to know how you actually think and operate on the job.
            </p>
            <p className="text-warm-gray mt-3 leading-relaxed">
              Answer honestly. Vague answers score lower than specific ones.
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-warm-white mb-1.5">
                  Your full name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-warm-white placeholder-warm-muted focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-white mb-1.5">
                  Phone number <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={candidatePhone}
                  onChange={(e) => setCandidatePhone(e.target.value)}
                  placeholder="(602) 555-0100"
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-warm-white placeholder-warm-muted focus:outline-none focus:border-white/40"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-warm-white mb-1.5">
                  Email address <span className="text-warm-gray text-xs font-normal">(optional)</span>
                </label>
                <input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="jane@email.com"
                  className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-warm-white placeholder-warm-muted focus:outline-none focus:border-white/40"
                />
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              disabled={!candidateName.trim() || !candidatePhone.trim()}
              className="mt-8 w-full bg-white text-dark font-semibold py-3.5 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-warm-white transition-colors"
            >
              Start Assessment
            </button>
          </div>
        )}

        {/* Section 1: Basic Fit */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-warm-white">Basic Fit</h2>
            <p className="text-warm-gray text-sm mt-1">Quick background questions</p>

            <div className="mt-6 space-y-6">
              {template.basicFitQuestions.map((q) => (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-warm-white mb-2">
                    {q.label}
                  </label>
                  {q.type === "select" && q.options ? (
                    <div className="space-y-2">
                      {q.options.map((opt) => (
                        <label
                          key={opt}
                          className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            responses[q.key] === opt
                              ? "border-white/40 bg-white/5"
                              : "border-dark-border hover:border-white/20"
                          }`}
                        >
                          <input
                            type="radio"
                            name={q.key}
                            value={opt}
                            checked={responses[q.key] === opt}
                            onChange={() => updateResponse(q.key, opt)}
                            className="sr-only"
                          />
                          <span
                            className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${
                              responses[q.key] === opt
                                ? "border-white bg-white"
                                : "border-white/30"
                            }`}
                          >
                            {responses[q.key] === opt && (
                              <span className="w-2 h-2 rounded-full bg-dark" />
                            )}
                          </span>
                          <span className="text-sm text-warm-white">{opt}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={responses[q.key] || ""}
                      onChange={(e) => updateResponse(q.key, e.target.value)}
                      className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-warm-white placeholder-warm-muted focus:outline-none focus:border-white/40"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(0)}
                className="px-6 py-3 border border-dark-border text-warm-gray rounded-lg hover:border-white/30 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-white text-dark font-semibold py-3 rounded-lg hover:bg-warm-white transition-colors"
              >
                Next Section
              </button>
            </div>
          </div>
        )}

        {/* Section 2: Situational Questions */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-warm-white">Situational Questions</h2>
            <p className="text-warm-gray text-sm mt-1">
              Describe specifically what you would do — not what you might do in general.
            </p>

            <div className="mt-6 space-y-8">
              {template.situationalQuestions.map((q, i) => (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-warm-white mb-2">
                    <span className="text-warm-gray mr-2">{i + 1}.</span>
                    {q.question}
                  </label>
                  <textarea
                    value={responses[q.key] || ""}
                    onChange={(e) => updateResponse(q.key, e.target.value)}
                    rows={5}
                    placeholder="Be specific — what exactly did you do or would you do?"
                    className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-warm-white placeholder-warm-muted focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 border border-dark-border text-warm-gray rounded-lg hover:border-white/30 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(3)}
                className="flex-1 bg-white text-dark font-semibold py-3 rounded-lg hover:bg-warm-white transition-colors"
              >
                Next Section
              </button>
            </div>
          </div>
        )}

        {/* Section 3: Skills Self-Assessment */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-bold text-warm-white">Skills Self-Assessment</h2>
            <p className="text-warm-gray text-sm mt-1">
              Rate yourself 1 (lowest) to 5 (highest). Be honest — we verify these.
            </p>

            <div className="mt-6 space-y-6">
              {template.skillsQuestions.map((q) => (
                <div key={q.key}>
                  <label className="block text-sm font-medium text-warm-white mb-3">
                    {q.label}
                  </label>
                  <div className="flex gap-3">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => updateResponse(q.key, String(val))}
                        className={`w-12 h-12 rounded-lg border text-sm font-semibold transition-colors ${
                          responses[q.key] === String(val)
                            ? "border-white bg-white text-dark"
                            : "border-dark-border text-warm-gray hover:border-white/30"
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-3 border border-dark-border text-warm-gray rounded-lg hover:border-white/30 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => setStep(4)}
                className="flex-1 bg-white text-dark font-semibold py-3 rounded-lg hover:bg-warm-white transition-colors"
              >
                Next Section
              </button>
            </div>
          </div>
        )}

        {/* Section 4: References */}
        {step === 4 && (
          <div>
            <h2 className="text-xl font-bold text-warm-white">References</h2>
            <p className="text-warm-gray text-sm mt-1">
              Two professional references who can speak to your work directly.
            </p>

            <div className="mt-6 space-y-8">
              {[1, 2].map((num) => (
                <div key={num} className="space-y-4">
                  <p className="text-sm font-semibold text-warm-white">Reference {num}</p>
                  {[
                    { key: `ref${num}_name`, label: "Full name", type: "text" },
                    { key: `ref${num}_relationship`, label: "Relationship to you", type: "text" },
                    { key: `ref${num}_phone`, label: "Phone number", type: "tel" },
                    { key: `ref${num}_duration`, label: "How long have they known you?", type: "text" },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs text-warm-gray mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        value={responses[field.key] || ""}
                        onChange={(e) => updateResponse(field.key, e.target.value)}
                        className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-warm-white placeholder-warm-muted focus:outline-none focus:border-white/40"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-3 border border-dark-border text-warm-gray rounded-lg hover:border-white/30 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 bg-white text-dark font-semibold py-3 rounded-lg disabled:opacity-50 hover:bg-warm-white transition-colors"
              >
                {submitting ? "Submitting..." : "Submit Assessment"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create the thank-you page**

Create `app/assess/[slug]/submitted/page.tsx`:

```typescript
export default function SubmittedPage() {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-warm-white mt-4">Assessment submitted</h1>
        <p className="text-warm-gray mt-3 leading-relaxed">
          Thank you for taking the time to complete this. Our team will be in touch if your background is a strong match for the role.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Test the public form in browser**

Navigate to `http://localhost:3000/assess/<slug>` (use the slug from Task 7).

Verify:
- Intro step loads with the role title
- Can enter name and phone, click Start Assessment
- Step 1 (Basic Fit) shows the role's questions with radio buttons and text inputs
- Steps 2, 3, 4 navigate correctly
- Back button works on each step

- [ ] **Step 4: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add "app/assess/" && git commit -m "feat: add public candidate assessment form and thank-you page"
```

---

## Task 13: CandidateReport Component

**Files:**
- Create: `components/hiring/CandidateReport.tsx`

- [ ] **Step 1: Create the full report component**

Create `components/hiring/CandidateReport.tsx`:

```typescript
"use client";

import { HiringAssessment, ScoreReport, CandidateStatus } from "@/lib/hiring-types";
import { FitBadge } from "./FitBadge";
import { DimensionScoreGrid } from "./DimensionScoreGrid";
import { ArrowLeft, AlertTriangle, MessageSquare, Phone, ExternalLink } from "lucide-react";

interface CandidateReportProps {
  assessment: HiringAssessment;
  report: ScoreReport;
  onBack: () => void;
  onStatusChange: (status: CandidateStatus) => void;
}

export function CandidateReport({
  assessment,
  report,
  onBack,
  onStatusChange,
}: CandidateReportProps) {
  const iicrcLookupUrl = assessment.candidate_name
    ? `https://iicrc.org/find-a-professional/?search=${encodeURIComponent(assessment.candidate_name)}`
    : "https://iicrc.org/find-a-professional/";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-warm-gray hover:text-warm-white transition-colors text-sm mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to candidates
        </button>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-warm-white">
              {assessment.candidate_name}
            </h2>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              {assessment.candidate_phone && (
                <a
                  href={`tel:${assessment.candidate_phone}`}
                  className="flex items-center gap-1.5 text-sm text-warm-gray hover:text-warm-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  {assessment.candidate_phone}
                </a>
              )}
              {assessment.candidate_email && (
                <span className="text-sm text-warm-gray">{assessment.candidate_email}</span>
              )}
            </div>
          </div>
          <FitBadge rating={report.overall_fit} />
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-2xl font-bold text-warm-white">
            {report.overall_score.toFixed(1)}
          </span>
          <span className="text-warm-gray">/5.0 overall score</span>
        </div>
      </div>

      {/* Status actions */}
      {assessment.status === "scored" && (
        <div className="flex gap-3">
          <button
            onClick={() => onStatusChange("advancing")}
            className="flex-1 bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-medium py-2.5 rounded-lg hover:bg-emerald-500/25 transition-colors text-sm"
          >
            Advance to Interview
          </button>
          <button
            onClick={() => onStatusChange("passed")}
            className="flex-1 bg-dark-card border border-dark-border text-warm-gray font-medium py-2.5 rounded-lg hover:border-white/20 transition-colors text-sm"
          >
            Pass
          </button>
        </div>
      )}

      {assessment.status === "advancing" && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-emerald-400 font-medium">Advancing to interview</span>
          <button
            onClick={() => onStatusChange("passed")}
            className="text-xs text-warm-gray hover:text-warm-white transition-colors"
          >
            Mark as passed
          </button>
        </div>
      )}

      {/* Red flags */}
      {report.red_flags.length > 0 && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <p className="text-sm font-medium text-red-400">Red Flags</p>
          </div>
          <ul className="space-y-1.5">
            {report.red_flags.map((flag, i) => (
              <li key={i} className="text-sm text-warm-gray flex gap-2">
                <span className="text-red-400 shrink-0">•</span>
                {flag}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Dimension scores */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-5">
        <h3 className="text-sm font-semibold text-warm-white mb-4">Performance Dimensions</h3>
        <DimensionScoreGrid scores={report.dimension_scores} />
      </div>

      {/* Interview probes */}
      {report.interview_probes.length > 0 && (
        <div className="bg-dark-card border border-dark-border rounded-lg p-5">
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-warm-white">Interview Probe Questions</h3>
          </div>
          <p className="text-xs text-warm-gray mb-4">
            Ask these for dimensions that need more verification.
          </p>
          <div className="space-y-5">
            {report.interview_probes.map((probe) => (
              <div key={probe.dimension}>
                <p className="text-xs font-medium text-amber-400 mb-2">{probe.dimension}</p>
                <ul className="space-y-2">
                  {probe.questions.map((q, i) => (
                    <li key={i} className="text-sm text-warm-gray flex gap-2">
                      <span className="text-warm-muted shrink-0">{i + 1}.</span>
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reference guide */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Phone className="w-4 h-4 text-warm-gray" />
          <h3 className="text-sm font-semibold text-warm-white">Reference Call Guide</h3>
        </div>
        <div className="space-y-4">
          {report.reference_guide.map((item, i) => (
            <div key={i}>
              <p className="text-sm text-warm-white">{item.question}</p>
              <p className="text-xs text-warm-gray mt-1 italic">{item.purpose}</p>
            </div>
          ))}
        </div>
      </div>

      {/* IICRC verification */}
      <div className="bg-dark-card border border-dark-border rounded-lg p-5">
        <h3 className="text-sm font-semibold text-warm-white mb-3">IICRC Certification Check</h3>
        {report.iicrc_claimed.length > 0 ? (
          <div>
            <p className="text-xs text-warm-gray mb-2">Candidate claimed:</p>
            <p className="text-sm text-warm-white mb-3">{report.iicrc_claimed.join(", ")}</p>
            <a
              href={iicrcLookupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Verify on IICRC.org
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <p className="text-sm text-warm-gray">No IICRC certifications claimed.</p>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add components/hiring/CandidateReport.tsx && git commit -m "feat: add full CandidateReport component"
```

---

## Task 14: AddRoleModal and RolePipelineView Components

**Files:**
- Create: `components/hiring/AddRoleModal.tsx`
- Create: `components/hiring/RolePipelineView.tsx`

- [ ] **Step 1: Create AddRoleModal**

Create `components/hiring/AddRoleModal.tsx`:

```typescript
"use client";

import { useState } from "react";
import { RoleType } from "@/lib/hiring-types";
import { ROLE_TYPE_LABELS } from "@/lib/hiring-templates";
import { X } from "lucide-react";

interface AddRoleModalProps {
  clientId: string;
  onClose: () => void;
  onCreated: (roleId: string, assessmentUrl: string) => void;
}

export function AddRoleModal({ clientId, onClose, onCreated }: AddRoleModalProps) {
  const [roleType, setRoleType] = useState<RoleType | "">("");
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate() {
    if (!roleType || !title.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // Create the role
      const roleRes = await fetch("/api/hiring/roles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, title: title.trim(), roleType }),
      });
      const roleData = await roleRes.json();
      if (roleData.error) throw new Error(roleData.error);

      // Generate assessment link
      const linkRes = await fetch("/api/hiring/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId: roleData.role.id }),
      });
      const linkData = await linkRes.json();
      if (linkData.error) throw new Error(linkData.error);

      onCreated(roleData.role.id, linkData.assessmentUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-surface border border-dark-border rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-dark-border">
          <h3 className="font-semibold text-warm-white">Open a New Role</h3>
          <button onClick={onClose} className="text-warm-gray hover:text-warm-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-warm-white mb-1.5">
              Role type
            </label>
            <select
              value={roleType}
              onChange={(e) => {
                const val = e.target.value as RoleType;
                setRoleType(val);
                if (val) setTitle(ROLE_TYPE_LABELS[val]);
              }}
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-warm-white focus:outline-none focus:border-white/40"
            >
              <option value="">Select a role...</option>
              {(Object.keys(ROLE_TYPE_LABELS) as RoleType[]).map((type) => (
                <option key={type} value={type}>
                  {ROLE_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-warm-white mb-1.5">
              Job title <span className="text-warm-gray text-xs font-normal">(customize if needed)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Water Mitigation Tech"
              className="w-full bg-dark-card border border-dark-border rounded-lg px-4 py-3 text-warm-white placeholder-warm-muted focus:outline-none focus:border-white/40"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="p-5 border-t border-dark-border flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-dark-border text-warm-gray py-2.5 rounded-lg hover:border-white/30 transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!roleType || !title.trim() || loading}
            className="flex-1 bg-white text-dark font-semibold py-2.5 rounded-lg disabled:opacity-40 hover:bg-warm-white transition-colors text-sm"
          >
            {loading ? "Creating..." : "Create Role"}
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create RolePipelineView**

Create `components/hiring/RolePipelineView.tsx`:

```typescript
"use client";

import { HiringRole, HiringAssessment, ScoreReport } from "@/lib/hiring-types";
import { FitBadge } from "./FitBadge";
import { CandidateCard } from "./CandidateCard";
import { CandidateReport } from "./CandidateReport";
import { ChevronRight, ChevronDown, Copy, Check } from "lucide-react";
import { useState } from "react";

interface RoleWithCandidates {
  role: HiringRole;
  candidates: Array<{ assessment: HiringAssessment; report: ScoreReport | null }>;
}

interface RolePipelineViewProps {
  rolesWithCandidates: RoleWithCandidates[];
  onStatusChange: (assessmentId: string, status: HiringAssessment["status"]) => void;
  onRefresh: () => void;
}

export function RolePipelineView({
  rolesWithCandidates,
  onStatusChange,
  onRefresh,
}: RolePipelineViewProps) {
  const [expandedRole, setExpandedRole] = useState<string | null>(
    rolesWithCandidates[0]?.role.id ?? null
  );
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string | null>(null);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  async function copyAssessmentLink(roleId: string) {
    try {
      const res = await fetch("/api/hiring/assessments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roleId }),
      });
      const data = await res.json();
      if (data.assessmentUrl) {
        await navigator.clipboard.writeText(data.assessmentUrl);
        setCopiedSlug(roleId);
        setTimeout(() => setCopiedSlug(null), 2000);
        onRefresh();
      }
    } catch {
      alert("Could not generate link. Try again.");
    }
  }

  // Find selected candidate for report view
  const selectedCandidate = selectedAssessmentId
    ? rolesWithCandidates
        .flatMap((r) => r.candidates)
        .find((c) => c.assessment.id === selectedAssessmentId)
    : null;

  if (selectedCandidate?.report) {
    return (
      <CandidateReport
        assessment={selectedCandidate.assessment}
        report={selectedCandidate.report}
        onBack={() => setSelectedAssessmentId(null)}
        onStatusChange={(status) => {
          onStatusChange(selectedCandidate.assessment.id, status);
          setSelectedAssessmentId(null);
        }}
      />
    );
  }

  if (rolesWithCandidates.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-warm-gray">No open roles yet. Create a role to generate your first assessment link.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {rolesWithCandidates.map(({ role, candidates }) => {
        const scored = candidates.filter((c) => c.report);
        const green = scored.filter((c) => c.report?.overall_fit === "green").length;
        const yellow = scored.filter((c) => c.report?.overall_fit === "yellow").length;
        const red = scored.filter((c) => c.report?.overall_fit === "red").length;
        const isExpanded = expandedRole === role.id;

        return (
          <div key={role.id} className="bg-dark-card border border-dark-border rounded-xl">
            {/* Role header */}
            <button
              onClick={() => setExpandedRole(isExpanded ? null : role.id)}
              className="w-full flex items-center justify-between p-5 text-left"
            >
              <div>
                <p className="font-medium text-warm-white">{role.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-xs text-warm-gray">{candidates.length} candidates</span>
                  {scored.length > 0 && (
                    <div className="flex items-center gap-2">
                      {green > 0 && <span className="text-xs text-emerald-400">{green} strong</span>}
                      {yellow > 0 && <span className="text-xs text-amber-400">{yellow} probe</span>}
                      {red > 0 && <span className="text-xs text-red-400">{red} pass</span>}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyAssessmentLink(role.id);
                  }}
                  className="flex items-center gap-1.5 text-xs text-warm-gray hover:text-warm-white transition-colors border border-dark-border rounded-lg px-3 py-1.5"
                >
                  {copiedSlug === role.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      New Link
                    </>
                  )}
                </button>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-warm-gray" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-warm-gray" />
                )}
              </div>
            </button>

            {/* Candidate list */}
            {isExpanded && (
              <div className="border-t border-dark-border p-4 space-y-2">
                {candidates.length === 0 ? (
                  <p className="text-sm text-warm-gray text-center py-4">
                    No candidates yet. Share the assessment link to get started.
                  </p>
                ) : (
                  candidates.map(({ assessment, report }) => (
                    <CandidateCard
                      key={assessment.id}
                      assessment={assessment}
                      report={report}
                      onClick={() => setSelectedAssessmentId(assessment.id)}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add components/hiring/AddRoleModal.tsx components/hiring/RolePipelineView.tsx && git commit -m "feat: add AddRoleModal and RolePipelineView components"
```

---

## Task 15: Hiring Module Dashboard Page

**Files:**
- Create: `app/dashboard/clients/[id]/hiring/page.tsx`

- [ ] **Step 1: Create the hiring page**

Create `app/dashboard/clients/[id]/hiring/page.tsx`:

```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { Users, Plus } from "lucide-react";
import { HiringRole, HiringAssessment, ScoreReport, CandidateStatus } from "@/lib/hiring-types";
import { RolePipelineView } from "@/components/hiring/RolePipelineView";
import { AddRoleModal } from "@/components/hiring/AddRoleModal";

interface RoleWithCandidates {
  role: HiringRole;
  candidates: Array<{ assessment: HiringAssessment; report: ScoreReport | null }>;
}

export default function HiringPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const [rolesWithCandidates, setRolesWithCandidates] = useState<RoleWithCandidates[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRole, setShowAddRole] = useState(false);
  const [newRoleInfo, setNewRoleInfo] = useState<{ url: string } | null>(null);

  const loadData = useCallback(async () => {
    try {
      const rolesRes = await fetch(`/api/hiring/roles?clientId=${clientId}`);
      const rolesData = await rolesRes.json();
      const roles: HiringRole[] = rolesData.roles || [];

      // For each role, load its candidates and their reports
      const rolesWithData = await Promise.all(
        roles.map(async (role) => {
          // Fetch assessments for this role
          const assRes = await fetch(`/api/hiring/roles/${role.id}/candidates`);
          const assData = await assRes.json();
          const assessments: HiringAssessment[] = assData.candidates || [];

          // Fetch report for each submitted assessment
          const candidates = await Promise.all(
            assessments.map(async (assessment) => {
              if (!assessment.submitted_at) return { assessment, report: null };
              const reportRes = await fetch(`/api/hiring/reports/${assessment.id}`);
              const reportData = await reportRes.json();
              return { assessment, report: reportData.report ?? null };
            })
          );

          return { role, candidates };
        })
      );

      setRolesWithCandidates(rolesWithData);
    } catch (err) {
      console.error("Failed to load hiring data:", err);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleStatusChange(assessmentId: string, status: CandidateStatus) {
    await fetch(`/api/hiring/candidates/${assessmentId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await loadData();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Users className="w-4.5 h-4.5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-warm-white">Surge Hire</h1>
            <p className="text-xs text-warm-gray">Pre-hire intelligence</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddRole(true)}
          className="flex items-center gap-2 bg-white text-dark text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-warm-white transition-colors"
        >
          <Plus className="w-4 h-4" />
          Open Role
        </button>
      </div>

      {/* New link confirmation */}
      {newRoleInfo && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <p className="text-sm font-medium text-emerald-400 mb-1">Role created. Assessment link ready:</p>
          <code className="text-xs text-warm-white break-all">{newRoleInfo.url}</code>
          <button
            onClick={() => {
              navigator.clipboard.writeText(newRoleInfo.url);
            }}
            className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Copy to clipboard
          </button>
        </div>
      )}

      {/* Role pipeline */}
      <RolePipelineView
        rolesWithCandidates={rolesWithCandidates}
        onStatusChange={handleStatusChange}
        onRefresh={loadData}
      />

      {/* Add role modal */}
      {showAddRole && (
        <AddRoleModal
          clientId={clientId}
          onClose={() => setShowAddRole(false)}
          onCreated={(roleId, assessmentUrl) => {
            setShowAddRole(false);
            setNewRoleInfo({ url: assessmentUrl });
            loadData();
          }}
        />
      )}
    </div>
  );
}
```

- [ ] **Step 2: Add the candidates-by-role API route**

This route is needed by the hiring page to load candidates per role. Create `app/api/hiring/roles/[roleId]/candidates/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

// GET /api/hiring/roles/[roleId]/candidates
export async function GET(
  _request: NextRequest,
  { params }: { params: { roleId: string } }
) {
  const { data, error } = await supabaseAdmin
    .from("hiring_assessments")
    .select("*")
    .eq("role_id", params.roleId)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }

  return NextResponse.json({ candidates: data });
}
```

- [ ] **Step 3: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add "app/dashboard/clients/[id]/hiring/page.tsx" "app/api/hiring/roles/[roleId]/candidates/route.ts" && git commit -m "feat: add Surge Hire client dashboard module page"
```

---

## Task 16: Add Hiring to Sidebar

**Files:**
- Modify: `components/dashboard/Sidebar.tsx`

- [ ] **Step 1: Read the current Sidebar**

Read `components/dashboard/Sidebar.tsx` and find the `clientModules` array.

- [ ] **Step 2: Add Hiring to clientModules**

In the `clientModules` array inside `Sidebar.tsx`, add the Hiring entry. Find the array (it contains objects with `key`, `href`, `icon`, and `label` fields) and add this entry:

```typescript
{ key: "hiring", href: "hiring", icon: Users, label: "Hiring" },
```

Add it after the last existing module entry. Make sure `Users` is imported from `lucide-react` at the top of the file — it likely already is, but verify.

- [ ] **Step 3: Verify the sidebar renders**

Start the dev server and navigate to `http://localhost:3000/dashboard/clients/rehab-restoration`. Confirm "Hiring" appears in the left sidebar under the client modules. Click it and verify it routes to the hiring page.

- [ ] **Step 4: Commit**

```bash
cd "/Users/austin/Marketing Agency" && git add components/dashboard/Sidebar.tsx && git commit -m "feat: add Hiring module to client dashboard sidebar"
```

---

## Task 17: End-to-End Test

- [ ] **Step 1: Create a role and generate assessment link**

1. Navigate to `http://localhost:3000/dashboard/clients/rehab-restoration`
2. Click "Hiring" in the sidebar
3. Click "Open Role"
4. Select "Water Mitigation Technician," confirm the title, click "Create Role"
5. Copy the assessment URL from the confirmation banner

- [ ] **Step 2: Complete the assessment as a candidate**

Open the assessment URL in a private/incognito window. Complete all 4 sections with realistic responses — use detailed situational answers to test scoring quality.

Submit the assessment.

Verify: the thank-you page appears.

- [ ] **Step 3: Verify the report in the dashboard**

Return to the hiring dashboard in the main window. Refresh the page. The candidate should appear with a green/yellow/red fit badge and overall score. Click the candidate card to view the full report.

Verify:
- Dimension scores display with supporting quotes
- Interview probe questions appear (for any yellow dimensions)
- Reference call guide has 4 specific questions
- Red flags section shows if any were detected
- IICRC section shows claimed certs with verification link

- [ ] **Step 4: Test status change**

Click "Advance to Interview" on the candidate report. Verify the status updates and the button disappears.

- [ ] **Step 5: Final commit**

```bash
cd "/Users/austin/Marketing Agency" && git add -A && git commit -m "feat: Surge Hire end-to-end complete"
```

---

## Self-Review Notes

**Spec coverage check:**
- Assessment flow (4 sections) - covered in Task 12
- AI scoring with dimension scores, probes, reference guide, red flags - covered in Tasks 5, 9
- IICRC one-click lookup link - covered in Task 13 (CandidateReport)
- Role pipeline with green/yellow/red breakdown - covered in Task 14 (RolePipelineView)
- Add Role modal with assessment link generation - covered in Task 14 (AddRoleModal)
- Candidate advance/pass actions - covered in Tasks 10, 13
- Sidebar entry - covered in Task 16
- All 5 role templates - covered in Task 4

**Type consistency verified:**
- `ResponseMap = Record<string, string>` used consistently in Tasks 5, 9, 12
- `FitRating = "green" | "yellow" | "red"` used in FitBadge (Task 11) and ScoreReport (Task 3)
- `CandidateStatus` used in candidates route (Task 10), CandidateReport (Task 13), hiring page (Task 15)
- `HiringRole`, `HiringAssessment`, `ScoreReport` flow consistently from API routes through to UI components
