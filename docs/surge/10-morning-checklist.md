# Morning Checklist - Deployment Finish Line
## Wake up, run through this, site is live

**What already happened overnight:** The Surge Platform v1 commit was pushed to GitHub. Vercel should have auto-detected the push and started a build. The build may have succeeded but the site won't work correctly until you complete Step 1 below.

**Total time needed:** 15-20 minutes.

---

## Step 1: Set the Access Password in Vercel (CRITICAL - DO THIS FIRST)

If you don't do this, anyone visiting `/surge` will hit a 500 error because `SURGE_ACCESS_PASSWORD` isn't configured.

1. Open [vercel.com/dashboard](https://vercel.com/dashboard) and log in
2. Click into the `surge-ai` project (or whatever it's named - should match the GitHub repo)
3. **Settings** → **Environment Variables**
4. Add new variable:
   - **Key:** `SURGE_ACCESS_PASSWORD`
   - **Value:** [pick a strong password - this is what you'll use to log in AND what you'll eventually share with Scott/Aaron]
   - **Environments:** Check only **Production** for now (uncheck Preview and Development)
5. Click **Save**

**Suggested password format:** `rehab-ops-[year]!` or similar - memorable but not guessable. Write it down somewhere secure (1Password, Bitwarden, Apple Keychain).

---

## Step 2: Carry Over Supabase Keys From Local

The marketing site needs Supabase to work (existing dashboard uses it). Copy these from your local `.env.local`:

```bash
cd "/Users/austin/Marketing Agency"
cat .env.local | grep SUPABASE
```

You'll see something like:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...
```

Copy each to Vercel env vars (same place as Step 1). Set environment to **Production**.

Any other keys in your `.env.local` (Twilio, OpenAI, etc.)? Copy those too - the existing `/api/ai-fulfillment` and `/api/leads` routes may depend on them.

---

## Step 3: Trigger a Redeploy

The build that ran on push happened BEFORE you set the env vars. So the password gate will fail on the current deployment.

1. In Vercel dashboard → **Deployments** tab
2. Find the most recent deployment (should be from the push that just happened - commit message "feat: Surge Platform v1")
3. Three-dot menu (...) on the right → **Redeploy**
4. Confirm redeploy. Wait ~90 seconds for build.

---

## Step 4: Verify The Live Site (5 minutes)

Open `https://surgeadvisory.co` in a browser.

### Public pages (no auth required):
- [ ] Homepage loads with headline "Your money is stuck. We find it."
- [ ] Eyebrow says "Ops Infrastructure for Restoration Contractors"
- [ ] "Book an Ops Audit" button works
- [ ] Pricing section shows 4 tiers: Surge Ops Audit ($3,500), Phase 1 ($6,500), Phase 2 ($5,000), Phase 3 ($3,500)
- [ ] Footer says "Ops infrastructure and AI automation for restoration contractors"

### Auth flow:
- [ ] Go to `https://surgeadvisory.co/surge` - should redirect to `/auth`
- [ ] See the lock icon login screen with "Private Access" heading
- [ ] Enter wrong password - see "Incorrect access code" error
- [ ] Enter correct password (from Step 1) - redirect to `/surge`

### Internal platform:
- [ ] `/surge` loads the operator cockpit
- [ ] Pipeline, Signals, Audits, Clients, Revenue, Activities, Knowledge all load
- [ ] `/platform/rehab-restoration` loads the client cockpit
- [ ] Each platform tab loads (Collections, Claims, Actions, Jobs, Team, Academy, Integrations, Reports)

### robots.txt check:
- [ ] `https://surgeadvisory.co/robots.txt` loads and shows Disallow rules for /surge, /platform, /dashboard

---

## Step 5: Rotate Your GitHub Personal Access Token (SECURITY)

**Heads up:** Your git remote has a Personal Access Token baked into the URL. It's visible in git config on this machine:

```
origin: https://ghp_XXXXXXXX@github.com/ausbrosolutions-eng/surge-ai.git
```

This is functional but not ideal. If someone gets local access to your machine (or you push config somewhere), the token leaks.

### The fix (5 min):

1. Go to [github.com/settings/tokens](https://github.com/settings/tokens)
2. Find the token currently embedded (starts with `ghp_y7sMdXJa`)
3. Click **Delete** to revoke it
4. Switch to HTTPS + Git Credential Manager, OR switch to SSH:

**Option A: SSH (recommended, simpler long-term):**
```bash
cd "/Users/austin/Marketing Agency"
# Generate SSH key if you don't have one
ls ~/.ssh/id_ed25519.pub 2>/dev/null || ssh-keygen -t ed25519

# Copy the public key, add it to github.com/settings/keys
cat ~/.ssh/id_ed25519.pub

# Switch remote to SSH
git remote set-url origin git@github.com:ausbrosolutions-eng/surge-ai.git

# Verify
git remote -v
```

**Option B: HTTPS with credential manager (Mac built-in):**
```bash
git remote set-url origin https://github.com/ausbrosolutions-eng/surge-ai.git
git config --global credential.helper osxkeychain
# Next push will prompt for credentials and cache them in Keychain
```

---

## Step 6: Test On Your Phone

Log out on desktop, open the site on your phone. Confirm:
- [ ] Marketing site looks good on mobile
- [ ] Login flow works
- [ ] Cockpit is readable (may need mobile polish later)

---

## Step 7: Update Relay Business Card

The marketing site now officially says Surge Advisory does "Ops Infrastructure for Restoration Contractors" - not "Home Service Marketing." Consider updating:
- LinkedIn profile (company page + your headline)
- Email signature
- Any pitch decks or one-pagers you've shared
- Stripe product descriptions if the audit is already set up

---

## Optional Step 8: Share Access With Scott/Aaron (This Week)

When you're ready to give Rehab their first look at the platform, send this email:

**Subject:** Rehab Restoration platform - early look

Hi Scott (and Aaron),

The platform I've been building for your business is live and ready for you to poke around.

**Access:** https://surgeadvisory.co/platform/rehab-restoration
**Password:** [the one you set in Step 1]

Quick tour of what you'll see:
- **Cockpit** - the dashboard you'll hit first thing Monday mornings
- **Collections** - every stuck invoice with aging, the ones to chase first
- **Claims** - adjusters ranked by exposure, with ghosted ones flagged
- **Team** - scorecards for Zoie, Silvia, Jared, Tammy (right now these are sample numbers - real data flows in once we wire up your JN sync)
- **Reports** - click "Generate Weekly Report" to see what I'll be auto-emailing you every Monday

Data right now is sample/seeded based on our audit findings. Over the next 2 weeks I'll wire up the live JobNimbus sync so it's your real data updating in real-time.

Poke around. Let me know what feels right and what needs adjustment.

Austin

---

## What's Actually Live Right Now vs. What's Still Mocked

Honest breakdown so you know what to explain vs. wire up later:

### Live and working:
- Public marketing site with new positioning
- Password gate on all internal routes
- All CRM workflows (add prospect, log activity, manage pipeline)
- All client platform workflows (action queue, scorecards, reports)
- Automation rules engine (generates action items from patterns in data)
- Email digest HTML generation (preview works perfectly)
- localStorage persistence (data survives page reloads per browser)

### Mocked (work in UI, need wiring):
- **Encircle sync** - mock data generation, not real API pulls
- **JobNimbus sync** - mock data refresh, not real API pulls
- **Email send** - preview perfect, actual delivery not wired (no RESEND_API_KEY)
- **Scheduled automation** - must be triggered manually via Run Automation buttons

### Not yet built:
- Real multi-user auth (everyone uses same password)
- Cross-browser data sync (localStorage is per-browser)
- Vercel Cron for scheduled automation
- SMS automation via Twilio
- Stripe payment link for Ops Audit

See `docs/surge/09-deployment-checklist.md` for the full gap analysis and wiring checklist for each.

---

## If Something Breaks

**"Login page shows error about missing password."**
→ You forgot Step 1. Set `SURGE_ACCESS_PASSWORD` in Vercel, redeploy.

**"Build failed on Vercel."**
→ Check Deployments tab → click the failed build → View Logs. Copy first error. Most likely a missing env var. Fix and redeploy.

**"I set the password correctly but still get redirected to /auth."**
→ Clear cookies for surgeadvisory.co. Log in again.

**"Platform data looks wrong / shows weird stuff."**
→ Open DevTools → Console → `localStorage.removeItem('surge-platform-v1')` → refresh. Seeds reload fresh.

**"I accidentally broke something in the code."**
→ `git revert HEAD` → `git push origin main`. Vercel auto-deploys the revert.

---

## You're Good

Go back to sleep. When you wake up, 20 minutes gets the site live. The platform, the CRM, the client portal, the automation - all of it already works. Only thing missing is you pushing a few buttons in Vercel and clicking redeploy.

Sleep well.

Austin's Surge Platform - Ready to ship.
