# Surge Hire - Pre-Hire Intelligence Module
## Design Spec | April 5, 2026 | Surge Advisory LLC

---

## Overview

Surge Hire is a pre-hire intelligence module built into the Surge Advisory client dashboard at surgeadvisory.co. It sits between "interested candidate" and "first interview" - the exact moment home service and restoration companies are flying blind.

Clients (starting with Rehab Restoration) source candidates the way they already do: Indeed and word of mouth. Surge Hire takes those candidates and runs them through a structured AI-scored assessment tied to world-class performance standards for their specific role. Clients see a ranked report card and know, before any interview, whether a candidate has what it takes.

**The core insight:** The world-class operations framework already defines what great looks like per role. Surge Hire measures candidates against it before they're hired.

---

## Problem

Home service and restoration companies (validated with Rehab Restoration / Scott and Aarron) hire primarily from Indeed and word-of-mouth referrals. The sourcing channel is not the problem. The problem is telling a good, qualified candidate who will succeed long-term from someone who will eventually be fired. There is no systematic way to assess candidates against performance standards before making an offer. Bad hires cost $15,000-$30,000+ in lost productivity and rehiring.

---

## Positioning

**Product name:** Surge Hire
**Home:** Client dashboard module at surgeadvisory.co (Agency OS)
**Target clients:** Restoration and home service companies on monthly retainer
**Competitive moat:** Role-specific world-class performance benchmarks for restoration trades built into the screening process - no generic assessment tool has this

**Pricing:**
- Add-on retainer: $400-600/month per client for unlimited assessments
- Per-hire: $250-400 per candidate fully assessed
- Placement fee (future): 8-12% of first-year salary once outcomes are proven

**Operating cost:** Under $50/month at full early-stage usage (Claude API + Supabase free tier). Margins exceed 95%.

---

## Technical Architecture

### Stack
- **Frontend:** Next.js 14 App Router (existing codebase)
- **Database:** Supabase (Postgres + storage) - new addition to the project
- **AI Scoring:** Claude API (claude-sonnet-4-6)
- **Hosting:** Vercel (existing)

### Two Surfaces

**1. Client-facing (inside Agency OS dashboard)**
Protected dashboard route, same design system as existing modules (GBP, LSA, SEO, etc.)
- View open roles with candidate pipeline per role
- Scored candidate cards with green/yellow/red fit rating
- Full candidate report with dimension scores, interview probes, reference script
- Mark candidates as advancing or passed

**2. Candidate-facing (public, no login)**
Public route: `surgeadvisory.co/assess/[client-slug]/[role-slug]-[unique-id]`
- Mobile-optimized, no account required
- Unique link generated per role opening, sharable via text or email
- Submissions trigger AI scoring automatically on the server

### New Infrastructure
- Supabase connection (Postgres for candidate data, roles, assessments, scores)
- 4-5 Next.js API routes: create role, generate assessment link, submit assessment, trigger scoring, fetch report
- Public `/assess/[...slug]` page (new route, outside auth)
- Hiring module added to existing client dashboard sidebar
- Client IDs in Supabase are seeded manually to match existing client slugs (e.g., `rehab-restoration`) - no automatic sync with localStorage needed since Surge Hire is agency-managed, not self-serve

### What Stays the Same
All existing dashboard modules, localStorage for existing client data, current Tailwind design system, Navbar, Footer, all landing page components.

---

## Database Schema (Core Tables)

```
roles
  id, client_id, title, role_type, status (open/closed), created_at

assessments
  id, role_id, unique_slug, candidate_name, candidate_email, candidate_phone
  submitted_at, status (pending/scored/advancing/passed)

assessment_responses
  id, assessment_id, section (basic_fit/situational/skills/references)
  question_key, response_text

scores
  id, assessment_id, dimension, score (1-5), confidence, supporting_quote
  fit_rating (green/yellow/red), generated_at

score_reports
  id, assessment_id, overall_fit, interview_probes (json)
  reference_guide (json), red_flags (json), iicrc_verified (bool)
```

---

## Assessment Flow

Candidate receives a unique link and completes a 15-20 minute assessment in four sections:

### Section 1: Basic Fit (5 min)
Hard filters before anything else. Auto-disqualifies non-fits without wasting time.
- Role-specific certifications held (IICRC WRT, ASD, EPA 608, etc.)
- Years of relevant experience
- On-call and weekend availability (critical for restoration)
- Geographic availability / max commute
- Compensation expectations

### Section 2: Situational Questions (10 min)
3-4 role-specific open-text scenarios. Highest-signal section - this is what AI scores most valuably. Questions are pre-built per role using world-class performance dimensions as the benchmark.

**Example (Water Mitigation Tech):**
- "A homeowner calls at 11pm with a burst pipe. You arrive and they're panicked and aggressive. Walk me through exactly how you handle the first 10 minutes."
- "You're mid-job and realize the moisture readings are higher than the initial assessment showed. The crew lead is unavailable. What do you do?"
- "Describe the most difficult job you've worked. What made it hard and what did you do?"

### Section 3: Skills Self-Assessment (3 min)
Rate yourself on role-specific skills. Equipment familiarity, software (JobNimbus), physical requirements. Includes a calibration question to detect over-inflators - the AI cross-references self-ratings against situational response quality.

### Section 4: References (2 min)
Two references: name, relationship, phone number, how long they've known the candidate. Used to generate the structured reference call guide in the report.

---

## Role Templates

Pre-built assessment templates map directly to the world-class ops framework (Aarron Johansen, April 2026). Each template contains role-specific situational questions, performance dimensions, and skills checklist.

**v1 Templates:**
1. Water Mitigation Technician
2. Reconstruction Project Manager
3. Estimator
4. Operations Manager / Team Lead
5. Front Office / Job Coordinator

Templates are configurable per client - dimensions and questions can be adjusted without rebuilding from scratch.

---

## AI Scoring and Report Card

On assessment submission, Claude API scores the candidate and generates a structured report. Report is stored in Supabase and displayed in the client dashboard.

### What Gets Scored

**Per-dimension score (1-5)** against world-class performance dimensions for the role.

Example dimensions for Water Mitigation Tech:
- Customer communication under stress
- Technical protocol knowledge
- Urgency and emergency response mindset
- Team coordination
- Documentation discipline

Each dimension outputs:
- Score (1-5)
- Confidence level (low/medium/high)
- 1-2 direct quotes from the candidate's responses that justify the score

### Overall Fit Rating
**Green** - Strong hire, advance to interview
**Yellow** - Potential with coaching, probe specific dimensions
**Red** - Pass

This is the first thing the client sees when they open a candidate card.

### Interview Probe Questions
For any dimension scoring yellow, the report generates 2-3 specific follow-up questions to ask in the first interview. Clients walk in already knowing exactly where to probe rather than running a generic interview.

### Reference Call Guide
Role-specific structured script for the reference call. Questions designed to surface real information rather than generic praise.

Example: "On a scale of 1-10, how reliable were they for on-call and emergency response? Tell me about a specific time they were called after hours - how did they handle it?"

### Red Flag Alerts
- Inconsistencies between self-reported skills and situational response quality
- Availability mismatches against role requirements
- Compensation expectations outside client range
- Response patterns suggesting low accountability or blame-shifting

---

## Option C: AI Intelligence Layer

What separates Surge Hire from any generic assessment tool. Background intelligence runs automatically after submission.

### v1 (Ships with Core)

**IICRC Certification Verification**
IICRC does not have a public API. The report generates a direct verification link to iicrc.org/find-a-professional pre-filled with the candidate's name, so the reviewer can confirm in one click. The candidate's claimed certifications are displayed alongside the link for easy comparison. Automated verification is a v2 consideration if IICRC introduces an API.

**Structured Reference Intelligence**
Reference call guide generated from weak dimensions. Specific, probing questions that replace the standard "they were great" reference call. Reference call notes can be logged back into the candidate profile.

### v2 (After Core is Validated)

**LinkedIn Signal Analysis**
Tenure patterns (do they job-hop every 6 months?), career trajectory, and validation that self-reported experience matches actual work history.

**Employment History Consistency Check**
Cross-references assessment claims against public data. Catches exaggeration before it becomes a bad hire.

---

## Client Dashboard Module - UI Specs

### Hiring Module Entry (Sidebar)
Added to existing Agency OS sidebar under client navigation. Icon: Users (Lucide). Label: "Hiring."

### Role Pipeline View (Main View)
- List of open roles for the client
- Candidate count per role with green/yellow/red breakdown
- "Add Role" button to create a new opening and generate assessment link
- Click role to open candidate list

### Candidate List View
- Card per candidate: name, role, submission date, overall fit badge (Green/Yellow/Red), overall score
- Click card to open full report
- Actions: Advance, Pass, Copy Assessment Link

### Full Report View
- Candidate header: name, contact, submission date, overall fit rating
- Dimension score grid with quotes
- Interview probe questions section
- Reference call guide section
- Red flags section (if any)
- IICRC verification status
- Export as PDF button

---

## Validation Context

- **Beta client:** Rehab Restoration (Scott Wahrer and Aarron Johansen)
- **Validated pain:** Candidates come from Indeed and word-of-mouth; primary problem is assessing quality and predicting long-term fit, not sourcing
- **Existing asset:** World-class ops framework already built (April 2026) defines role-specific performance dimensions - this is the scoring backbone
- **Design philosophy:** Ship the foundation, get real feedback from Scott and Aarron, fine-tune based on actual usage

---

## Out of Scope (v1)

- Video response recording (add in v2 if clients want it)
- Automated LinkedIn scraping (v2)
- Candidate-initiated applications (clients send the link, candidates don't self-discover)
- Multi-location role management
- Applicant tracking beyond the Surge Hire pipeline (not replacing JobNimbus or a full ATS)
- Payment processing inside the tool (billed separately via existing retainer invoices)
