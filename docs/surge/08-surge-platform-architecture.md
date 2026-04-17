# The Surge Platform Architecture
## Consulting As The Attraction Offer, Platform As The Retention Engine

**The thesis:** Austin's 6-month consulting engagement delivers the ops transformation. The Surge Platform is the software layer clients keep paying for after the consulting engagement ends. This is the classic agency-to-SaaS pivot, done right.

**Two users, one platform:**
- **Austin (operator):** Manages his consulting business, tracks pipeline, delivers audits, oversees retainer clients
- **Restoration contractor (client):** Logs in daily to run their operations, see recovered revenue in real time, train their team

**The key insight:** A client who logs in to see "$47,500 recovered this month thanks to the Surge collection sequence" is a client who doesn't cancel the retainer. The platform IS the deliverable. The consulting was the installation.

---

## Platform Structure

### Three Experiences, One Codebase

```
/
├── (public)          Marketing site - prospects land here
├── /dashboard        Austin's Surge CRM (operator view)
└── /platform         Client-facing Restoration Ops Platform (multi-tenant)
```

### Austin's CRM (/dashboard)

The daily operator cockpit. What Austin opens every morning.

**Pages:**
- `/dashboard` - **The Cockpit.** Today's priorities, pipeline coverage, audit delivery status, revenue snapshot
- `/dashboard/pipeline` - Prospects by SPIN/PACI stage. Drag between stages. Signal alerts inline.
- `/dashboard/signals` - Trigger event feed. Real-time alerts from monitoring (hiring, reviews, expansions)
- `/dashboard/audits` - Active paid audits. Day-by-day delivery status. 14-day timeline tracking.
- `/dashboard/clients` - Retainer clients. Phase (1/2/3). Health score. MRR.
- `/dashboard/activities` - Call recordings, emails sent, notes. Searchable knowledge graph.
- `/dashboard/knowledge` - Battle cards, cadences, frameworks. The playbook.
- `/dashboard/revenue` - MRR trend, audit revenue, pipeline value, forecasting.

### Client Platform (/platform)

What a restoration contractor sees when they log in.

**Pages:**
- `/platform/[clientId]` - **The Operations Cockpit.** Revenue recovery ticker, action queue, team scorecards.
- `/platform/[clientId]/collections` - Live collections recovery dashboard. Every stuck invoice. Automated follow-ups.
- `/platform/[clientId]/claims` - Active claims. Adjuster tracking. Supplement queue. Documentation status.
- `/platform/[clientId]/team` - Staff scorecards. Individual KPIs. Training progress. Leaderboard.
- `/platform/[clientId]/academy` - Training library. Role-based playbooks. Practice scenarios. Certification tracking.
- `/platform/[clientId]/jobs` - Pipeline view of every active job. Aging, documentation, billing readiness.
- `/platform/[clientId]/automation` - Active automations (SMS sequences, document checks, alerts). Health status.
- `/platform/[clientId]/reports` - Auto-generated reports. Delivered weekly to inbox.

---

## The Data Model (Additions To Existing)

### New Entities

**Prospect** - People in the sales pipeline (pre-audit)
```typescript
{
  id, companyName, contactName, title, email, phone, linkedIn,
  trade, annualRevenue, employeeCount, city, state,
  tier: 1 | 2 | 3,
  icpScore: number (6-30),
  stage: 'unreached' | 'touched' | 'responding' | 'meeting_booked' | 
         'discovery_done' | 'audit_proposed' | 'audit_booked' | 
         'audit_delivered' | 'retainer_signed' | 'lost',
  spinStage: 'situation' | 'problem' | 'implication' | 'payoff',
  triggerEvent: 'hiring' | 'review' | 'expansion' | 'leadership' | 
                'competitor' | 'award' | 'referral' | 'cold',
  triggerEventDate,
  referralSource, // e.g., "Jared Watts"
  lastTouch, nextTouch, touchCount,
  notes, createdAt, updatedAt
}
```

**Signal** - Trigger events detected from monitoring
```typescript
{
  id, type: 'hiring' | 'review' | 'expansion' | 'leadership' | 'competitor' | 'award',
  source: 'google_alerts' | 'linkedin' | 'indeed' | 'reviews' | 'manual',
  companyName, contactName,
  summary, // "Acme Restoration is hiring an Ops Manager in Phoenix"
  url, // link to source
  detectedAt,
  prospectId, // if matched to known prospect, else null
  status: 'new' | 'reviewed' | 'actioned' | 'dismissed',
  actionTaken // "created Tier 1 outreach sequence on 2026-04-20"
}
```

**Audit** - Paid Ops Audit delivery tracking
```typescript
{
  id, prospectId, clientId, // converts from prospect to client after audit
  startDate, targetDeliveryDate,
  stage: 'contract_sent' | 'paid' | 'kickoff_scheduled' | 'kickoff_done' | 
         'data_pulled' | 'analysis' | 'report_draft' | 'report_delivered' | 
         'review_call_done' | 'converted_to_retainer' | 'lost_post_audit',
  paymentAmount: number, // typically 3500
  apiAccessGranted: boolean,
  findings: {
    stuckRevenue: number,
    blockedJobs: number,
    dataIntegrityScore: number, // 0-100
    recommendedPath: 'A' | 'B' | 'C',
    projectedROI: number
  },
  outcomes: {
    retainerConverted: boolean,
    retainerPhase: 1 | 2 | 3,
    creditApplied: boolean
  }
}
```

**Activity** - Every customer-facing interaction logged
```typescript
{
  id, prospectId, clientId,
  type: 'email_sent' | 'email_received' | 'call' | 'meeting' | 'linkedin_touch' | 
        'contract_sent' | 'payment_received' | 'note',
  direction: 'inbound' | 'outbound',
  subject, summary, // auto-extracted from Fireflies
  recordingUrl,
  sentiment: 'positive' | 'neutral' | 'negative',
  spinStageReached, // for calls: where did the conversation reach?
  nextStepIdentified, nextStepDate,
  createdAt
}
```

**Revenue Event** - Actual money in/out for Surge reporting
```typescript
{
  id, type: 'audit_payment' | 'retainer_payment' | 'referral_payout' | 'expense',
  amount: number,
  clientId, prospectId,
  description, // "Rehab Restoration - April 2026 Phase 1"
  date
}
```

### New Client-Side Entities (for the Platform)

**Client Business Metrics** - The numbers their dashboard shows
```typescript
{
  clientId, asOfDate,
  collections: {
    totalStuck: number, // $1,300,000
    jobsStuck: number, // 293
    avgDaysAged: number, // 199
    recoveredThisMonth: number,
    recoveredYTD: number,
    oldestJob: { jobId, daysAged, amount, customer }
  },
  pipeline: {
    activeJobs: number,
    pipelineValue: number,
    blockedAtBilling: number,
    documentationGapScore: number // 0-100
  },
  team: {
    memberCount: number,
    activeToday: number,
    avgScorecardThisWeek: number
  }
}
```

**Job** - Jobs pulled from their CRM (JobNimbus, Albi, etc.)
```typescript
{
  id, clientId, externalJobId, // ID in their CRM
  customerName, address,
  jobType: 'water' | 'fire' | 'mold' | 'other',
  carrier, adjusterName, adjusterEmail,
  status, // raw status from their CRM
  stage: 'lead' | 'estimate' | 'mitigation' | 'rebuild' | 'billing' | 'collections' | 'closed',
  amount, daysInCurrentStage, daysFromFNOL,
  flags: string[], // ['missing_moisture_log', 'no_adjuster_reply_14d']
  lastActivity, assignedTech, assignedAdmin
}
```

**Staff Member** - Client's team
```typescript
{
  id, clientId, name, role: 'owner' | 'ops_manager' | 'admin' | 'tech' | 'estimator',
  email,
  kpis: { // weekly metrics
    jobsHandled, docsCompleted, supplementsApproved, reviewsGenerated,
    collectionsFollowedUp, avgResponseTimeHours
  },
  trainingProgress: {
    coursesCompleted: string[],
    certificationsEarned: string[],
    currentCourse: string | null
  },
  scorecardThisWeek: number, // 0-100
  scorecardTrend: 'up' | 'down' | 'flat'
}
```

**Action Item** - The client's daily to-do queue
```typescript
{
  id, clientId, assignedToStaffId,
  type: 'call_adjuster' | 'upload_docs' | 'follow_up_invoice' | 'supplement_prep' | 
        'response_review' | 'training_assigned',
  priority: 'urgent' | 'high' | 'medium',
  title, description,
  dollarImpact: number, // "$4,200 at risk if not actioned"
  dueDate, completedAt,
  sourceJob, // link to the Job that triggered this
  generatedBy: 'surge_automation' | 'manual' | 'ai_recommendation'
}
```

**Course** - Training academy content
```typescript
{
  id, title, description,
  role: 'office_admin' | 'estimator' | 'tech' | 'ops_manager' | 'owner',
  durationMinutes, modules: Module[],
  requiredForRole: boolean, // mandatory vs optional
  unlockCondition: string // e.g., "Complete 10 collection follow-ups"
}
```

---

## Behavior Change Mechanics

The platform isn't just data visualization. It actively drives behavior.

### 1. The Daily Focus Ring
At the top of the client cockpit: "Do these 3 things today, nothing else."
- Auto-generated from highest-impact action items
- Shows dollar impact of each: "Call adjuster Johnson at State Farm - $8,400 at stake"
- Greys out other tabs until focus items are done (optional gamification setting)

### 2. Real-Time Dollar Recovery Ticker
A live counter at the top of the cockpit showing collections recovered this month thanks to the platform. Unmissable. Refreshes every time a stuck invoice gets paid.

### 3. Streak Tracking
- "X consecutive days with <3 overdue follow-ups"
- "X consecutive weeks with 100% documentation compliance at 3.3"
- "X consecutive days team completed all daily focus items"
- Streaks show social proof pressure to the team

### 4. Staff Scorecards With Leaderboard
- Every team member has a public scorecard
- Weekly winner gets called out on the home cockpit
- Scorecard components: jobs handled, docs on-time, supplements approved, response time
- Gamified but not punitive - praise high performance, alert on slips

### 5. Skill Gap → Training Trigger
- Platform detects: Silvia is slow on response time
- Auto-assigns: "Customer Response Excellence (15-min course)"
- Certification unlocks: new features in her dashboard
- Management sees team development velocity, not just performance

### 6. Nudges Before Slips Become Problems
- "Response time is 22% slower this week than last week - is everything OK?"
- Sends to ops manager before customers notice
- Nudge copy is coaching, not punishment

### 7. The Comparison Layer
- "Rehab's collection velocity this month: top 12% of Surge clients your size"
- Positive social proof
- Private: nobody sees others' data, just their percentile

### 8. Progressive Feature Unlocking
- New clients start with core features
- As they hit maturity milestones, advanced features unlock
- "Automated supplement drafting unlocks when your documentation score exceeds 85"
- Creates investment in the platform's ongoing value

---

## The Roll-Out Sequence

### Phase 1 (This Session): Foundation
- [x] Design doc (this file)
- [ ] Extend types with new entities (Prospect, Signal, Audit, Activity, Job, Staff, ActionItem)
- [ ] Update store with new entity handlers
- [ ] Build new Austin CRM dashboard at `/dashboard`
- [ ] Build new client platform dashboard at `/dashboard/clients/[id]/platform`
- [ ] Update seed data with Austin's own pipeline + Rehab's metrics

### Phase 2 (Next Session): Sales Engine
- [ ] `/dashboard/pipeline` - Full prospect pipeline with SPIN stages, drag-and-drop
- [ ] `/dashboard/signals` - Trigger event feed with filtering
- [ ] `/dashboard/audits` - Paid audit delivery tracker
- [ ] `/dashboard/activities` - Call and email log with search

### Phase 3: Client Platform Depth
- [ ] `/platform/[clientId]/collections` - Collections recovery dashboard (the hero feature)
- [ ] `/platform/[clientId]/claims` - Claims workflow with adjuster tracking
- [ ] `/platform/[clientId]/team` - Staff scorecards + leaderboard
- [ ] `/platform/[clientId]/academy` - Training library with role-based paths

### Phase 4: Behavior Change Layer
- [ ] Daily focus ring component
- [ ] Real-time recovery ticker
- [ ] Streak tracking engine
- [ ] Nudge notification system

### Phase 5: Intelligence & Automation
- [ ] Auto-generated action items from job data
- [ ] Skill gap detection and training assignment
- [ ] Weekly auto-generated reports
- [ ] Owner/team email digests

### Phase 6: Integrations
- [ ] JobNimbus API sync (jobs, contacts, statuses)
- [ ] Albi API sync
- [ ] QuickBooks for payment data
- [ ] Twilio for outbound SMS
- [ ] Fireflies for auto-logging activities
- [ ] Zapier webhooks for custom integrations

---

## The Pricing Model (How This Becomes Recurring Revenue)

### Consulting Engagement (The Attraction Offer)
- Ops Audit: $3,500 one-time
- Phase 1-2-3 Retainer: $6,500 → $5,000 → $3,500/mo over 6 months
- Total consulting revenue per client in Year 1: $37,500 + audit

### Platform Subscription (The Recurring Engine)
Month 7 onwards, after consulting engagement ends:
- **Starter:** $497/mo - Core collections dashboard, action queue, 5 staff seats
- **Growth:** $997/mo - Everything + staff training academy, advanced automations, 15 seats
- **Scale:** $1,997/mo - Everything + multi-branch support, custom automations, unlimited seats, priority support

### The Math
A client who:
- Pays $37,500 for the consulting engagement in Year 1
- Converts to Growth tier at $997/mo starting Month 7
- Stays on platform for 3 more years

...is worth $37,500 + ($997 × 30 months) = **$67,410 LTV**

With 5 clients at this model: $337,050 LTV. At 10 clients: $674,100 LTV.

**The platform is what converts a 6-month consulting engagement into a multi-year recurring relationship.**

---

## Plug-And-Play for Any Service Business

The architecture is restoration-first but designed for adjacency:

### Core concepts that generalize
- Stuck revenue / aging receivables → every service business has these
- Documentation requirements → varies by trade but structure is same
- Staff training with role-based paths → universal
- Action queue driven by data → universal
- Behavior change via gamification → universal

### Per-trade customization (easy to add)
- HVAC: "maintenance agreement compliance score" instead of "documentation gap score"
- Plumbing: "warranty claim workflow" variant of claims workflow
- Roofing: "insurance supplement" is essentially identical to restoration
- Any service business: "review velocity," "response time," "close rate"

### Multi-tenant architecture
- `clientId` scopes every data model
- Row-level security at the database layer (when backend is built)
- Shared UI, customized per-tenant by trade type

**Any business can sign up, connect their CRM (or start manual), and be live on the platform in under 30 minutes.**

---

## The Strategic Moat

Why this is defensible:

1. **The data compounds.** Every audit teaches the platform more about restoration ops patterns. After 50 audits, the platform can auto-diagnose new clients faster than any human consultant.

2. **The training library compounds.** Every client's team completes courses. Surge learns which content drives behavior change. The library keeps improving.

3. **The integrations compound.** Every new CRM integration benefits every existing client. Network effect on the tool layer.

4. **The benchmarks compound.** With 50+ clients, every dashboard can show "you rank in the top X% vs. peers." Nobody else has that dataset.

5. **The champion network compounds.** Every Rehab-style champion becomes a referral funnel. Jared brings 3 leads; those clients bring 3 more each; power law of distribution.

**No marketing agency has any of this.** No generic automation consultant has any of this. Any restoration-specific competitor would take 3+ years to catch up on data alone.

---

## What We're Building Right Now (This Session)

Given context/time constraints, this session focuses on:

1. ✅ This design doc
2. Extended data model (types)
3. Updated store with new entity support
4. Austin's new CRM cockpit at `/dashboard`
5. The client platform cockpit at `/dashboard/clients/[id]/platform`
6. Seed data showing both Austin's pipeline AND Rehab's metrics

The rest is scaffolded in code comments and documented in this roadmap. Next session starts where this session ends.
