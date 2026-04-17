# The Surge Internal Flywheel
## Eat Your Own Dog Food: Building Surge Advisory's Own Ops Infrastructure

**The irony:** Surge sells ops transformation to clients while running itself on Google Docs, memory, and hustle. This needs to change. Not because Austin lacks discipline, but because compounding returns require infrastructure.

**The test:** Can Austin, or anyone else, answer these questions in under 60 seconds?
1. How many active prospects do you have right now, by stage?
2. Which Tier 1 prospects haven't been touched in 14 days?
3. What trigger events fired this week on your target accounts?
4. What's your audit-to-retainer conversion rate?
5. What's your average deal size trend over the last 90 days?

If any answer is "let me check" or "I think it's around..." then the system isn't built yet.

**Setup time:** 4-6 hours on a Saturday. Pays back within 30 days through faster follow-up and higher conversion.

---

## The Five Layers Applied to Surge

### Layer 1: Reality Capture
**Goal:** Every customer-facing interaction is recorded, stored, and searchable.

**Tool stack:**
- **Fireflies.ai** (free tier) or **Fathom** (free) for all Zoom/Meet recording + transcript
- **Loom** (free) for video prospecting + recorded deliverables
- **Gmail** (already in place) for email history
- **Notion database** for call log + notes consolidation

**Setup:**
1. Install Fireflies Chrome extension
2. Connect to Google Calendar - auto-joins every meeting
3. Set preference: "Record only when prospect consents verbally"
4. Create Notion database: "Surge Call Log" with columns: Date, Prospect, Stage, Notes, Recording Link, Next Step

**Operating rule:** Every prospect call gets recorded + added to Notion within 24 hours. No exceptions.

---

### Layer 2: Intelligence
**Goal:** Track conversion rates, deal velocity, and signal-to-action performance.

**Tool stack:**
- **Notion CRM** (free for personal use) OR **HubSpot Free CRM** (free, more CRM-native)
- **Notion for strategy docs** (already in place)

**Recommendation:** Start with HubSpot Free. It's built for this, and the reporting dashboards are better than rolling your own in Notion. Upgrade to Starter ($20/mo) only when needed.

**HubSpot Setup (2 hours):**
1. Import contact list (any prospects touched to date)
2. Create custom pipeline stages:
   - Unreached
   - First touch sent
   - Multi-touch in progress
   - Call booked
   - Discovery call complete
   - Audit proposal sent
   - Audit booked
   - Audit complete
   - Retainer signed
   - Closed lost - reason captured
3. Create 5 required custom fields:
   - Tier (1, 2, 3)
   - ICP Score (sum of 6 dimensions)
   - Trigger Event (dropdown: Hiring, Review, Expansion, Leadership, Competitor Complaint, Award, Other)
   - Trigger Event Date
   - Referral Source (Jared, other, cold)
4. Build 3 saved views:
   - "Active Tier 1 This Week" (Tier 1 + stage not closed + last activity in last 7 days)
   - "Stale Tier 1" (Tier 1 + no activity in last 14 days)
   - "Audit Pipeline" (stage = Audit proposal sent OR Audit booked)
5. Set up weekly report email to yourself: "Monday Surge Digest" with pipeline coverage, stale deals, new signals

**Metrics to track weekly:**
- Pipeline coverage ratio (3x+ of quarterly revenue target)
- Touches per prospect (goal: 8-12 before give-up)
- Reply rate by touch number (Touch 1, Touch 2, etc.)
- Discovery call-to-audit conversion rate (goal: 40-60%)
- Audit-to-retainer conversion rate (goal: 40-60%)

---

### Layer 3: Practice
**Goal:** Rehearse the skills the intelligence layer reveals as weak.

**Tool stack:**
- Loom for self-recording
- Discovery call framework doc (`06-discovery-call-framework.md`)
- Role-play with a trusted friend or recorded solo

**Practice ritual (every Friday, 30 min):**
1. Review 1 recorded discovery call from the week
2. Note: what did I do well? What did I miss? Where did I talk when I should have listened?
3. Pick 1 skill gap to practice next week (Implication questions, silence management, Need-Payoff framing, etc.)
4. Record a 5-minute role-play of that specific skill. Watch back. Refine.

**Once per month:**
- Do a full dry-run of the discovery call framework, solo, recorded
- Watch and grade yourself against the framework
- Identify the 1-2 persistent weaknesses and drill them the next month

---

### Layer 4: Knowledge
**Goal:** Single source of truth. Updated continuously. Canonical, not scattered.

**Current state:** Austin's strategy docs live in `docs/surge/` folder. Client context in `clients/rehab-restoration/`. Good start.

**What to build:**
1. **Master playbook** (this folder is becoming it)
2. **Swipe file** of winning emails, golden prospect quotes, case study language
3. **Battle cards** (already built in `05-battle-cards.md`)
4. **Discovery framework** (already built in `06-discovery-call-framework.md`)
5. **Case study library** (build this after Rehab's first Phase 1 result lands)

**Governance rule:** Every doc has an "Updated" date at the top. Anything not updated in 90 days gets reviewed for accuracy or deletion.

**Knowledge refresh ritual (first Monday of each month, 30 min):**
- Review all docs in `docs/surge/`
- Update any outdated numbers (pricing, case study metrics, tool costs)
- Add any new learnings from the past 30 days
- Archive anything that's no longer relevant

---

### Layer 5: Execution
**Goal:** Consistent outreach, consistent follow-up, consistent closing.

**Tool stack:**
- **Instantly.ai** ($37/mo) or **Apollo.io** ($49-99/mo) for sequence automation
- **Calendly** (free or $12/mo) for meeting booking
- **Stripe** (free) for payment links
- **Docusign** or **PandaDoc** (or just PDF + email for now) for contracts

**Recommendation:** Instantly for cold outreach + warmup + deliverability + unlimited inboxes. It's the best value for a solo operator.

**Setup (2 hours):**
1. Sign up for Instantly.ai
2. Set up secondary domain: `getsurgeadvisory.co` (keep primary for warm comms)
3. Configure SPF, DKIM, DMARC on secondary domain
4. Add 2 sending inboxes: `austin@getsurgeadvisory.co`, `hello@getsurgeadvisory.co`
5. Start warmup process (2-4 weeks before real sending)
6. Import 5-touch email templates from `04-email-cadence-templates.md`
7. Connect to HubSpot or CRM for status sync
8. Set daily send limit: 30-50 per inbox initially

**Cadence governance:**
- Cap active cadences at 5 (don't let library sprawl)
- Every cadence has a naming convention: `[Segment] - [Signal Type] - [Version Date]` e.g., `Restoration - Hiring Signal - v1.0 - 2026-04`
- Every cadence gets reviewed monthly for reply rate
- Any cadence below 5% reply after 90 days gets rebuilt or archived

---

## The Weekly Operating Rhythm

### Monday Morning (60 min)
- Review weekend's Google Alerts + LinkedIn notifications
- Check HubSpot "Monday Digest" report
- Identify 3-5 Tier 1 signals from the weekend
- Execute 5-min research sprint on each
- Send first outreach (email + LinkedIn view)

### Tuesday-Thursday (30 min/day)
- Morning: Check inbox for replies, respond within 2 hours to positive signals
- Send pre-call emails for any calls that day
- Execute Touch 2, 3, 4 for accounts in sequence
- Any trigger event = respond within 24 hours

### Friday (90 min)
- Review week's calls (practice layer: review 1 recorded call)
- Update HubSpot stages for every active prospect
- Identify stale Tier 1 accounts (14+ days no touch) and re-engage or breakup
- Send Friday breakup emails (Touch 5) to anyone at that milestone
- Plan next week's outreach targets (aim for 5-10 new Tier 1 initiations)

### Month End (2 hours)
- Review all metrics (pipeline coverage, conversion rates, reply rates)
- Identify which channels/signals produced the best pipeline
- Identify which cadences performed best/worst
- Adjust next month's focus accordingly
- Update knowledge docs with any new learnings

---

## The 30-Day Setup Plan

### Week 1: Reality Capture + Intelligence
- [ ] Install Fireflies, connect to Calendar
- [ ] Set up HubSpot Free CRM
- [ ] Import existing prospect list (all warm contacts, Jared's network ideas, anyone previously touched)
- [ ] Configure pipeline stages + custom fields
- [ ] Build the 3 saved views
- [ ] Set up Monday Digest email

### Week 2: Execution Infrastructure
- [ ] Register `getsurgeadvisory.co` domain if needed
- [ ] Configure SPF/DKIM/DMARC
- [ ] Set up Instantly.ai with 2 inboxes
- [ ] Begin email warmup (2-4 weeks)
- [ ] Import 5-touch email templates
- [ ] Set up Calendly booking page
- [ ] Create Stripe payment link for $3,500 audit
- [ ] Build one-page audit services contract

### Week 3: Knowledge + Practice
- [ ] Finalize all strategy docs in `docs/surge/`
- [ ] Create first case study draft from Rehab (even partial)
- [ ] Record first solo practice of discovery framework
- [ ] Build swipe file folder for winning content
- [ ] Set up weekly practice calendar block (Friday 30 min)

### Week 4: Activation
- [ ] Launch signal monitoring (Google Alerts, LinkedIn Nav, Indeed)
- [ ] Build initial 30-account target list (tiered + scored)
- [ ] Execute Jared champion activation conversation
- [ ] Send first 5 Tier 1 outreach emails (after warmup complete)
- [ ] Book first discovery calls

---

## Monthly Operating Budget

| Tool | Purpose | Cost |
|------|---------|------|
| HubSpot Free CRM | Pipeline + intelligence | $0 |
| Fireflies free tier | Call recording | $0 |
| Loom free tier | Video prospecting | $0 |
| Calendly free | Meeting booking | $0 |
| Instantly.ai | Cold email sequences | $37/mo |
| LinkedIn Sales Navigator | Signal monitoring | $99/mo |
| Stripe | Payment processing | Transaction fee only |
| **Total fixed monthly** | | **$136/mo** |

**Optional upgrades (scale as revenue grows):**
- HubSpot Starter: $20/mo (better reporting)
- Apollo.io: $59/mo (lead database + sequences)
- Loom paid: $8/mo (unlimited videos)
- Domain + email hosting for cold: $2-5/mo

**All-in operating cost to run Surge at scale: $150-$200/mo.** That's less than one hour of Austin's billable time.

---

## The Compound Effect

Month 1: Setup. Maybe 0-1 audits booked.
Month 2: 1-2 audits booked. First case study data coming in.
Month 3: 2-3 audits booked. Conversion math starting to be real.
Month 6: 3-5 audits/mo consistently. 40%+ converting to retainer. MRR building.
Month 12: Surge is a real business with real pipeline, real metrics, real compound growth.

**The key:** Each month's execution gets better because the previous month's intelligence feeds into the next month's targeting, messaging, and practice. That's the flywheel. Without the infrastructure, there's no compounding - just the same hustle over and over.

---

## What Austin Is Really Buying

By investing 4-6 hours this weekend plus 2-3 hrs/week ongoing, Austin buys:

1. **Time compression.** Tasks that used to require memory or ad-hoc searching now happen in a dashboard.
2. **Compound insights.** Every call, every touch, every conversion feeds the system. Next month is smarter than this month.
3. **Scalability.** The ceiling on Surge's revenue stops being "hours Austin has available" and starts being "throughput of the pipeline." Bigger ceiling.
4. **Saleability.** A business with actual CRM data, conversion rates, and documented playbooks is worth something. A business that runs on Austin's memory is worth nothing if Austin steps away.

This is the most leveraged 10 hours Austin will spend in the first 90 days of Surge.
