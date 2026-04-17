# Surge Deployment Checklist
## Shipping to surgeadvisory.co on Vercel

**Total time:** ~30-45 minutes end-to-end.

Follow in order. Don't skip steps - a few of them protect client data.

---

## Step 1: Pre-Flight Local Verification (5 min)

Confirm the app builds and runs before pushing anything.

```bash
cd "/Users/austin/Marketing Agency"

# Clean build check
npm run build

# Dev server smoke test
npm run dev
```

Open each of these and confirm they load without errors:
- [ ] `http://localhost:3000` - public marketing site
- [ ] `http://localhost:3000/auth` - login page (should see the lock icon)
- [ ] `http://localhost:3000/surge` - should redirect to /auth
- [ ] `http://localhost:3000/platform/rehab-restoration` - should redirect to /auth

Set a local password to test the login flow:
```bash
# In .env.local
SURGE_ACCESS_PASSWORD=test1234
```

Restart dev server. Now:
- [ ] Go to `/surge`, get redirected to `/auth`
- [ ] Enter `test1234`, confirm redirect to `/surge`
- [ ] Reload page - session persists (cookie works)

---

## Step 2: Review What You're About to Deploy (5 min)

Commit history check:

```bash
git status
git diff --stat
```

You'll see a lot of changes. Expected additions:
- `app/surge/*` - Austin's internal CRM
- `app/platform/*` - client-facing platform
- `app/auth/*` + `app/api/auth/*` - login
- `components/surge/*` - UI components
- `lib/surge/*` - types, store, rules, integrations, emails
- `docs/surge/*` - strategy docs
- `middleware.ts` - route protection
- `public/robots.txt` - search indexing rules
- `.env.production.example` - env var template

Files modified:
- `app/layout.tsx` - metadata updated to restoration ops
- `components/Hero.tsx`, `Services.tsx`, etc. - repositioned copy
- `CLAUDE.md` - sales/enablement knowledge added

---

## Step 3: Commit and Push (3 min)

```bash
cd "/Users/austin/Marketing Agency"

# Stage everything except local env
git add .

# Double-check .env.local is NOT in staged files
git status | grep -i env
# Expected: only .env.production.example appears. NOT .env.local.

# Commit in logical chunks (or one big commit if you prefer)
git commit -m "feat: Surge Platform v1 - CRM, client portal, automation, integrations

- Rebuilt public site for restoration ops positioning
- Built Austin's internal CRM at /surge (pipeline, signals, audits, activities)
- Built multi-tenant client platform at /platform/[clientId]
- Added rules engine for client + prospect automation
- Added Encircle and JobNimbus integration stubs with mock sync
- Added weekly report generator with email digest HTML template
- Added password gate for all internal routes via middleware
- Strategy docs in docs/surge/

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to main (auto-triggers Vercel build)
git push origin main
```

---

## Step 4: Configure Vercel Environment Variables (5 min)

Before the build finishes, set the env vars so the deployed site works.

Go to: **vercel.com** → your `surgeadvisory` project → **Settings** → **Environment Variables**

### Required Now (or internal routes won't work)

| Variable | Value | Environment |
|----------|-------|-------------|
| `SURGE_ACCESS_PASSWORD` | Pick a strong password you'll share with Scott/Aaron later | Production |

### Carry Over From .env.local (required for marketing site)

| Variable | Value | Environment |
|----------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Copy from your local `.env.local` | Production |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Copy from your local `.env.local` | Production |
| `SUPABASE_SERVICE_ROLE_KEY` | Copy from your local `.env.local` | Production |

(Check your `.env.local` for any other keys already in use - copy them all over.)

### Optional (can add later without redeploy)

| Variable | When to Add |
|----------|-------------|
| `RESEND_API_KEY` | When you're ready to actually send weekly digest emails to Scott |
| `JN_API_KEY` | When Scott shares the "AI Business Analysis" key for live JN sync |
| `ENCIRCLE_API_KEY` | After Encircle partnership is signed |
| `TWILIO_ACCOUNT_SID/AUTH_TOKEN/PHONE_NUMBER` | When SMS automation goes live |
| `STRIPE_PUBLIC_KEY/SECRET_KEY/WEBHOOK_SECRET` | When you productize the $3,500 audit with payment link |

---

## Step 5: Trigger Redeploy After Env Vars Set (2 min)

Vercel will have auto-started a build from your git push. If it finished before you set `SURGE_ACCESS_PASSWORD`, the auth routes won't work.

Fix: **Deployments** tab → find the latest deployment → three-dot menu → **Redeploy**.

Wait ~90 seconds for build to complete.

---

## Step 6: Post-Deploy Verification (10 min)

Open `https://surgeadvisory.co` and test:

### Public site (should work, no auth)
- [ ] Homepage loads with "Your money is stuck. We find it." headline
- [ ] Click "Book an Ops Audit" - scrolls to pricing section
- [ ] "/about" page loads
- [ ] "/how-it-works" page loads
- [ ] "/pricing" page loads
- [ ] "/faq" page loads
- [ ] Footer shows "Ops infrastructure and AI automation for restoration contractors"

### Internal routes (should redirect to /auth)
- [ ] Visit `https://surgeadvisory.co/surge` - redirects to `/auth`
- [ ] Visit `https://surgeadvisory.co/platform/rehab-restoration` - redirects to `/auth`
- [ ] Visit `https://surgeadvisory.co/dashboard` - redirects to `/auth`

### Login flow
- [ ] On `/auth`, enter wrong password - see "Incorrect access code" error
- [ ] Enter correct password - redirect to `/surge`
- [ ] Navigate through `/surge/pipeline`, `/surge/signals`, `/surge/audits` - all load
- [ ] Navigate to `/platform/rehab-restoration` - loads the client cockpit
- [ ] Try each platform tab (Collections, Claims, Team, Actions, Reports, Integrations, Academy)

### Data persistence
- [ ] On `/surge/pipeline`, click "Add Prospect" and create a test entry
- [ ] Refresh the page - the prospect is still there (localStorage working)
- [ ] On `/platform/rehab-restoration/actions`, click "Run Automation" - action items generated

### Robots check
- [ ] Visit `https://surgeadvisory.co/robots.txt` - see the disallow rules for /surge, /platform, /dashboard

---

## Step 7: Share Access (when ready)

### For yourself
You're done. Log in with the password whenever you need to work.

### For Scott/Aaron (later, when they're ready to start using the platform)
Send them:

```
Hi Scott,

The Rehab Restoration platform is ready for your team to start using.

Login: https://surgeadvisory.co/platform/rehab-restoration
Access code: [the password you set]

First thing to try:
1. Go to the Cockpit - you'll see this week's focus items
2. Visit Collections - every stuck invoice with aging
3. Check Claims - all adjusters ranked by exposure
4. Team tab shows weekly scorecards

I'll be adding real data from your JobNimbus account over the next 2 weeks.

Austin
```

### For Jared (when you want him testing client features)
Same link, same access code. Everyone on Rehab's team uses the same code for now.

---

## Step 8: Schedule Follow-Ups

Put these on your calendar:

- [ ] **Day 3 post-deploy:** Log in and check for any error patterns. Check Vercel Analytics for any 500s.
- [ ] **Day 7:** Share platform access with Scott/Aaron. Schedule 30-min walkthrough.
- [ ] **Day 14:** Start wiring real JN sync (once Scott confirms API key).
- [ ] **Day 30:** Swap mock email send for real Resend integration.

---

## Rollback Plan (Just in Case)

If anything breaks in production:

```bash
# Option 1: Vercel dashboard → Deployments → find the last good one → "Promote to Production"

# Option 2: git-based rollback
cd "/Users/austin/Marketing Agency"
git log --oneline -10              # find the last-known-good commit
git revert <bad-commit-sha>        # creates a new commit that undoes the bad one
git push origin main               # triggers rebuild
```

---

## Known Limitations (Document for Yourself)

Things that work in the deployed version but have specific constraints:

1. **localStorage-only data** - Each browser keeps its own data. If you add a prospect on your laptop, Scott won't see it on his phone. This is fine for now; when you're ready for true multi-user, migrate the SurgeStore to Supabase (similar to how the main app already works).

2. **Mock Encircle and mock JobNimbus** - The sync buttons work but generate synthetic data. Wire real APIs when credentials arrive (see docs/surge/07-surge-internal-flywheel.md for the integration path).

3. **Email digests are mock-sent** - The "Send to Owner" button on reports returns success but doesn't actually hit Scott's inbox. Flip the switch by setting `RESEND_API_KEY` and uncommenting the fetch call in `lib/surge/emails/weeklyDigest.ts`.

4. **No scheduled automation yet** - Rules must be triggered manually via the "Run Automation" buttons. To schedule daily/weekly runs, add Vercel Cron handlers in `app/api/cron/` and reference them in `vercel.json`.

5. **Single password for all users** - Anyone with the password gets the same access. When you need role separation (Austin sees everything, Scott only sees Rehab's platform, Jared has limited view), migrate to Clerk or NextAuth.

---

## First 30 Days Success Metrics

After going live, measure:

| Metric | Target | Where to check |
|--------|--------|----------------|
| Internal CRM daily use | At least 3x/week | `/surge/activities` volume |
| New prospects logged | 5-10 per week | `/surge/pipeline` |
| Signals actioned within 48 hr | 90% | `/surge/signals` |
| Discovery calls booked | 2-3 per week | Activity log |
| First paid audit closed | Within 30 days | `/surge/audits` |
| First client platform login by Scott | Within 14 days | Send him the link |

If any of these slip, revisit the relevant docs/surge/ playbook and adjust.

---

## Support Questions

**"The build failed on Vercel."**
Most common cause: missing env var or mismatched Next.js version. Check the Vercel build logs (Deployments → click the failed deployment → View Logs). Copy the first error and run the same build locally with `npm run build` to reproduce.

**"I changed the password and now I'm locked out."**
Clear the `surge_auth` cookie in your browser (DevTools → Application → Cookies → delete surge_auth). Then log in again with the new password.

**"How do I reset the platform back to seed data?"**
Open browser DevTools → Console → run `localStorage.removeItem('surge-platform-v1')` → refresh page. Seed data loads fresh.

**"Scott says the platform is slow."**
Phase 5 work: most of the platform data is computed on every render. If it gets sluggish with real data volumes, introduce React Query or SWR and cache the store reads. Not urgent until you have 100+ jobs per client.
