# ClaimRelay MVP Build Spec
## Phase 1: Single-Player Claims Dashboard for Rehab Restoration

Design spec created 2026-04-09. This document defines what gets built for the initial rollout to Scott's team at Rehab Restoration.

**Goal:** Replace spreadsheets, email threads, and memory with a single dashboard where Scott's team tracks every insurance claim from first notice of loss to final payment.

**Target users:** Rehab Restoration office managers, project managers, and Scott (owner). Team juggling 10-50+ open claims across multiple carriers.

**Core value prop:** Know exactly where every dollar is. See what's overdue. Never miss a state deadline.

---

## Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Framework | Next.js 14 App Router | TypeScript strict, App Router only |
| Database | Supabase (Postgres + Auth + Storage) | Schema already created |
| Styling | Tailwind CSS 3.4 + shadcn/ui | New York style, zinc base |
| Icons | Lucide React | Consistent with Agency OS |
| Charts | Recharts | Aging buckets, payment trends |
| Hosting | Vercel | Free tier to start |
| File Storage | Supabase Storage | ESX files, photos, documents |

**Color palette:**
- Navy: #0F172A (sidebar, headers)
- Teal/Sky: #0EA5E9 (primary actions, active states)
- Green: #22C55E (paid, approved, positive)
- Amber: #F59E0B (pending, warning, under review)
- Red: #EF4444 (overdue, denied, alerts)
- Slate: #F8FAFC (page backgrounds), #E2E8F0 (borders)

**Project location:** `~/ClaimRelay` (standalone repo, separate from Agency OS)

---

## Database Schema

Schema is already created in Supabase. Tables:

1. **companies** -- id, name, phone, email, address, city, state, zip, license_number
2. **users** -- id (matches auth.users), company_id FK, email, full_name, role (owner/admin/project_manager/office_staff)
3. **carriers** -- id, company_id FK, name, phone, claims_email, portal_url, supplement_portal_url, avg_days_to_pay, supplement_difficulty, supplement_requirements, estimating_software, managed_repair_network, adjuster_model, desk_adjusting_level, notes
4. **state_compliance_deadlines** -- id, state_code, state_name, acknowledge_days, accept_deny_days, pay_after_acceptance_days, calendar_type, notes, source_url (global reference table, no RLS)
5. **claims** -- id, company_id FK, carrier_id FK, claim_number, policy_number, insured_name/phone/email, property_address/city/state/zip, loss_type, loss_date, date_of_loss_reported, adjuster_name/phone/email/type/company, mortgage_company/phone/loss_draft_status/threshold, status, total_estimate, total_approved, total_paid, deductible, depreciation_held/recovery_deadline/recovery_status, notes, created_by FK
6. **claim_documents** -- id, claim_id FK, file_name, file_type, file_url, file_size, uploaded_by FK, notes
7. **claim_line_items** -- id, claim_id FK, source, supplement_id FK, category, item_code, description, quantity, unit, unit_price, total, status, ai_flag_reason
8. **supplements** -- id, claim_id FK, supplement_number, reason, total_amount, status, submitted_date, response_date, approved_amount, ai_generated, notes, created_by FK
9. **claim_status_history** -- id, claim_id FK, old_status, new_status, changed_by FK, notes
10. **payments** -- id, claim_id FK, payment_type, amount, payment_date, check_number, payment_method, notes, recorded_by FK
11. **claim_communications** -- id, claim_id FK, direction, type, contact_name, summary, follow_up_date, follow_up_completed, created_by FK

**RLS:** Enabled on all tables (except state_compliance_deadlines). Users can only access data where company_id matches their own. Helper function `get_user_company_id()` returns company_id for `auth.uid()`.

**Indexes:** claims.company_id, claims.carrier_id, claims.status, claims.created_at, claim_documents.claim_id, claim_line_items.claim_id, supplements.claim_id, payments.claim_id

---

## App Structure

```
~/ClaimRelay/
  app/
    page.tsx                          # Landing/marketing page (minimal)
    layout.tsx                        # Root layout (Inter font, metadata)
    (auth)/
      login/page.tsx                  # Email/password sign in
      signup/page.tsx                 # Company + user registration
      layout.tsx                     # Centered card layout, navy bg
    dashboard/
      layout.tsx                     # Sidebar + top bar shell
      page.tsx                       # Money-first dashboard
      claims/
        page.tsx                     # Claims list (filterable table)
        new/page.tsx                 # New claim form
        [id]/
          page.tsx                   # Claim detail (sidebar + tabs)
      carriers/
        page.tsx                     # Carrier directory
      settings/
        page.tsx                     # Company settings, user management
    api/
      esx-parse/route.ts            # ESX file parsing endpoint
  components/
    ui/                              # shadcn/ui components
    dashboard/
      sidebar.tsx                    # Main nav sidebar
      top-bar.tsx                    # Page title + user menu
    claims/
      claim-sidebar.tsx             # Persistent claim context sidebar
      documents-tab.tsx             # Document upload + grid
      line-items-tab.tsx            # Parsed line items table
      supplements-tab.tsx           # Supplement tracking
      payments-tab.tsx              # Payment recording
      timeline-tab.tsx              # Status history timeline
      comms-tab.tsx                 # Communications log
      claim-form.tsx                # New/edit claim form
      claims-table.tsx              # Filterable claims list
    dashboard/
      outstanding-hero.tsx          # Big money hero card
      aging-buckets.tsx             # 0-30, 31-60, 61-90, 90+ cards
      overdue-table.tsx             # Overdue claims table
      recent-activity.tsx           # Recent activity feed
  lib/
    supabase/
      client.ts                     # Browser Supabase client
      server.ts                     # Server Supabase client (cookies)
      middleware.ts                 # Middleware Supabase client
    types/
      database.ts                   # Full TypeScript types matching schema
    data/
      seed-carriers.ts              # Top 20 carrier intelligence data
      seed-states.ts                # 50-state compliance deadlines
    utils/
      aging.ts                      # Days-open calculations, aging bucket logic
      currency.ts                   # Dollar formatting
      esx-parser.ts                 # ESX (ZIP/XML) parsing logic
      dates.ts                      # Date formatting, deadline calculations
  middleware.ts                      # Auth protection for /dashboard/*
```

---

## Feature Specs

### 1. Authentication

**Sign Up (`/signup`):**
- Form fields: full name, company name, email, password
- Server action creates: Supabase auth user, company row, user row (role: owner)
- Redirects to `/dashboard` on success
- Inline error display on failure

**Sign In (`/login`):**
- Form fields: email, password
- Server action calls `supabase.auth.signInWithPassword`
- Redirects to `/dashboard` on success
- Link to `/signup`

**Middleware:**
- Protect all `/dashboard/*` routes
- No session redirects to `/login`
- Active session on `/login` redirects to `/dashboard`

**Seed data:**
- Pre-create Rehab Restoration company with Scott's user account
- Pre-seed top 20 carriers linked to Rehab's company_id
- Pre-seed 50-state compliance deadlines (global table)
- Pre-seed 5-8 sample claims with realistic data (mix of statuses, carriers, loss types)

### 2. Dashboard Layout

**Sidebar (`components/dashboard/sidebar.tsx`):**
- Fixed left, 256px wide, navy #0F172A background
- ClaimRelay wordmark at top
- Nav links with Lucide icons:
  - Dashboard (LayoutDashboard)
  - Claims (FileText)
  - Carriers (Building2)
  - Settings (Settings)
- Active link: sky-500/20 background
- Collapsible on mobile (Sheet component)

**Top Bar (`components/dashboard/top-bar.tsx`):**
- Current page title (derived from route)
- Right: user initials avatar, name, sign out button

### 3. Dashboard Home (Money-First)

**Outstanding Hero Card:**
- Dark gradient background (navy to slate-800)
- Large total outstanding amount
- Breakdown: Approved/Awaiting, Under Review, Overdue 60+
- Each with dollar amount and color coding

**Aging Buckets (4 cards):**
- 0-30 days (green) | 31-60 days (amber) | 61-90 days (red) | 90+ days (dark red)
- Each shows: dollar total + claim count

**Overdue Claims Table:**
- Columns: Claim #, Carrier, Insured, Days Open, Outstanding Amount
- Sorted by days open descending
- Claim # links to claim detail
- Only shows claims past 30 days without full payment

**Recent Activity Feed:**
- Last 10 activities across all claims
- Shows: action description, claim reference, timestamp
- Drawn from claim_status_history, payments, claim_documents, claim_communications

### 4. Claims List

**Filterable table with columns:**
- Claim # (link to detail)
- Insured Name
- Carrier
- Loss Type (badge)
- Status (color-coded badge)
- Estimated / Approved / Paid / Outstanding
- Days Open
- Last Activity

**Filters:**
- Status dropdown (multi-select)
- Carrier dropdown
- Loss type dropdown
- Search (claim #, insured name, address)

**Actions:**
- "+ New Claim" button top right
- Click row to open claim detail
- Sort by any column

### 5. New Claim Form

**Sections:**
1. **Loss Info** -- claim_number, loss_type (dropdown), loss_date, date_of_loss_reported
2. **Insured** -- insured_name, insured_phone, insured_email
3. **Property** -- property_address, property_city, property_state (dropdown), property_zip
4. **Carrier** -- carrier_id (searchable dropdown from seeded carriers), policy_number
5. **Adjuster** -- adjuster_name, adjuster_phone, adjuster_email, adjuster_type (dropdown), adjuster_company
6. **Financials** -- total_estimate, deductible, depreciation_held, depreciation_recovery_deadline
7. **Mortgage** -- mortgage_company, mortgage_company_phone, mortgage_loss_draft_status (dropdown), mortgage_threshold
8. **Notes** -- free text

On save: creates claim row, creates initial status_history entry (new), redirects to claim detail.

Carrier selection auto-populates carrier intel in a small info card next to the form (supplement difficulty, requirements preview).

### 6. Claim Detail (Sidebar + Tabs)

**Header (compact, sticky):**
- Back link to claims list
- Claim # + status badge + insured name + loss type
- Financial summary: Estimated | Approved | Paid | Outstanding
- "Update Status" dropdown button

**Left Sidebar (220px, always visible):**
- Insured contact (name, phone clickable tel:, email clickable mailto:)
- Adjuster contact (name, phone, email, type badge)
- Carrier info (name, supplement difficulty with color badge)
- Property address
- State deadline alert (if approaching or past due, show red/amber card with specific deadline info)
- Depreciation tracking (amount held, deadline, status with color)
- Mortgage status (if applicable)

**Tabs (6 total, fill remaining width):**

#### Tab 1: Documents
- Upload button (multi-file, accepts .esx, .pdf, .jpg, .png, .doc, .docx)
- File grid showing: icon by type, filename, file type badge, size, upload date
- Click to preview/download
- ESX files get a "Parse Estimate" button that extracts line items into the Line Items tab
- Delete button per document

#### Tab 2: Line Items
- Table: Category | Item Code | Description | Qty | Unit | Unit Price | Total | Status
- Status column: included (default), denied, pending
- Source badge: "Original" or "Supplement #N"
- Sortable by category, total
- Summary row at bottom with total
- Populated by ESX parser or manual entry
- "Add Line Item" button for manual additions

#### Tab 3: Supplements
- Card per supplement showing: supplement #, reason, amount, status badge, submitted date, response date, approved amount
- "New Supplement" button opens form: reason (text), total_amount, line items to include
- Status updates: draft, submitted, under_review, approved, partial_approved, denied
- When approved: updates claim total_approved

#### Tab 4: Payments
- Payment recording form: payment_type (dropdown), amount, payment_date, check_number, payment_method (dropdown), notes
- Payment history table: date, type badge, amount, check #, method, recorded by
- Running totals at top: Total Paid, Remaining, Deductible Status
- Depreciation recovery section: amount held, deadline, status, "Submit Recovery" action

#### Tab 5: Timeline
- Vertical timeline showing all claim activity chronologically
- Sources: status changes, document uploads, payments recorded, communications logged, supplements submitted/updated
- Each entry: timestamp, icon by type, description, user who performed action
- Auto-generated from claim_status_history + join queries on other tables

#### Tab 6: Communications
- Log form: direction (inbound/outbound), type (phone/email/portal/in_person/note), contact_name, summary, follow_up_date
- List of all communications newest first
- Follow-up indicators: upcoming (amber), overdue (red), completed (green strikethrough)
- "Mark Complete" button on follow-ups

### 7. ESX Parser

**How it works:**
- ESX files are ZIP archives containing XML
- API route `/api/esx-parse` accepts the uploaded file
- Extracts the ZIP, reads the XML structure
- Parses line items: category (room/area), item_code (Xactimate code), description, quantity, unit, unit_price, total
- Returns structured JSON array of line items
- Client saves line items to claim_line_items table with source='original_estimate'

**Implementation:**
- Use `jszip` to extract the ZIP
- Parse XML with a lightweight parser (fast-xml-parser)
- Map Xactimate XML structure to our line item schema
- Handle edge cases: multiple pages/areas, subtotals, O&P lines

### 8. Carrier Intelligence

**Carrier directory page (`/dashboard/carriers`):**
- Table of all carriers with: name, supplement difficulty badge, estimating software, managed repair network
- Click to expand: full requirements text, portal URLs (clickable), adjuster model, notes
- Search by carrier name

**Contextual display:**
- On claim detail sidebar: carrier name + difficulty badge + key requirement snippet
- On new claim form: carrier selection shows info card with difficulty and top requirement
- Supplement difficulty colors: easy (green), moderate (amber), moderate_hard (orange), hard (red), hardest (dark red)

**Seed data (top 20 carriers):**
State Farm, Progressive, Allstate, Liberty Mutual, USAA, Farmers, Nationwide, Travelers, American Family, Erie, Auto-Owners, Cincinnati Financial, Chubb, Hartford, Amica Mutual, CSAA, Shelter, Westfield, Safeco, Hippo

Each with: real claims phone numbers, portal URLs, supplement requirements, difficulty rankings, adjuster model, managed repair network -- all sourced from research docs.

### 9. State Compliance Deadlines

**Pre-seeded for all 50 states.** Key fields per state:
- Acknowledge deadline (days)
- Accept/deny deadline (days)
- Pay after acceptance deadline (days)
- Calendar type (business days vs calendar days)

**How it surfaces:**
- Claim detail sidebar: based on property_state, show applicable deadlines
- Auto-calculate actual deadline dates from claim's date_of_loss_reported
- Color coding: green (on track), amber (within 3 days), red (past due)
- Past-due deadlines show "Carrier is X days past [state] deadline" with the specific statute reference

### 10. Communications Log

**Log entry form fields:**
- Direction: inbound / outbound (toggle)
- Type: phone, email, portal, in_person, note (icon buttons)
- Contact name (auto-suggest from claim's adjuster/insured)
- Summary (textarea)
- Follow-up date (optional date picker)

**Display:**
- Chronological list, newest first
- Each entry: direction arrow, type icon, contact name, summary preview, timestamp
- Follow-up badge if follow_up_date set and not completed
- Dashboard can pull "upcoming follow-ups" across all claims

---

## Seed Data for Rehab Restoration

Pre-populate so Scott's team sees real-looking data on first login:

**Company:** Rehab Restoration (Mesa, AZ)

**Sample claims (5-8):**
- Water loss, State Farm, status: under_review, 67 days open, $18,400 estimate
- Fire loss, Allstate, status: supplement_submitted, 45 days, $42,000 estimate
- Storm/wind, Travelers, status: approved, 30 days, $8,900 estimate
- Mold, USAA, status: estimating, 12 days, $15,200 estimate
- Water loss, Liberty Mutual, status: paid, 0 outstanding, $11,300 estimate
- Water loss, Erie, status: new, 3 days, TBD estimate
- Storm, Progressive, status: payment_pending, 52 days, $22,100 estimate
- Fire, Nationwide, status: work_in_progress, 38 days, $31,500 estimate

Each with: realistic insured names, Mesa/Phoenix-area addresses, adjuster info, some with mortgage companies, appropriate payment records, status history entries, and a few communications logged.

---

## What's Deferred (Not in This Build)

- AI supplement gap detection (Claude API line item analysis)
- Adjuster share links and two-sided marketplace
- Bulk photo upload with AI auto-tagging
- Analytics/reporting page with charts
- Email notifications via Resend
- Multi-location support
- Depreciation recovery automation
- Supplement package generation

---

## Success Criteria

Scott's team can:
1. Log in and see all open claims with outstanding balances at a glance
2. Add a new claim in under 2 minutes
3. Upload documents (photos, ESX files) and see parsed line items
4. Record payments and track what's owed vs what's been paid
5. See carrier-specific supplement requirements before submitting
6. Know when a carrier has missed a state-mandated deadline
7. Log every call/email with an adjuster and set follow-up reminders
8. Track depreciation recovery deadlines so money doesn't expire
