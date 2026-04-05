# Client View Dashboard — Design Spec
**Date:** 2026-04-05

---

## Goal

Add a client-facing report card page to the Agency OS that shows a client their marketing results for the current month — leads, reputation, GBP activity, and task completion — all pulled automatically from existing localStorage data. No extra data entry required.

---

## Architecture

### Route
`app/dashboard/clients/[id]/client-view/page.tsx`

Single new page component. Accessed via a "Client View" button added to the existing client detail header. Opens in a new browser tab so the agency can hand the screen to the client during calls without exposing the internal dashboard.

### Component File
`components/dashboard/ClientViewReport.tsx`

Reads all data from `useStore()` — no props drilling, no new store keys, no new data entry fields.

### Access Pattern
- Agency opens client detail page (`/dashboard/clients/[id]/gbp` or any module tab)
- Clicks "Client View" button (new button in client header area)
- New tab opens at `/dashboard/clients/[id]/client-view`
- Clean report card — no sidebar, no internal nav, no module tabs
- Subtle "← Back to Agency View" link in top-right corner

---

## Data Sources

All data is derived from existing localStorage store keys. Nothing new is stored.

| Metric | Store source | Derivation |
|---|---|---|
| Business name | `client.businessName` | Direct |
| Marketing score | `client.scores.overall` | Direct |
| Report month/year | — | `new Date()` formatted |
| Total leads this month | `leads[]` | Filter by `clientId` + current calendar month on `createdAt` |
| Leads vs last month | `leads[]` | Same filter on prior month; compute delta |
| Cost per lead | `client.adSpend`, leads count | `adSpend / leadsThisMonth` — raw adSpend dollar never displayed |
| CPL trend | `reports[]` | Compare to prior month `ReportMetrics.costPerLead` if report exists; else omit trend |
| New reviews this month | `reviewStats[clientId]` | Sum `newThisMonth` across all platforms |
| Google rating | `reviewStats[clientId]` | Platform `"google"` entry `rating` |
| GBP posts this month | `gbpPosts[]` | Filter by `clientId` + current month on `date` |
| Citations optimized | `citations[clientId]` | Count where `status === "optimized"` |
| Tasks completed | `checklists[clientId_*]` | Count `completed === true` across all modules vs total items |
| Lead source breakdown | `leads[]` | Group this month's leads by `source`; top 4 sources shown |

### What is stripped from client view
- `client.notes` (internal agency notes)
- `client.monthlyRetainer` (pricing)
- `client.adSpend` raw value (used only to compute CPL)
- `client.email`, `client.googleAdsId` (internal identifiers)
- All checklist item `notes` fields (internal task commentary)
- Module scores breakdown (`client.scores.gbp`, `.lsa`, etc.) — only `overall` shown

---

## Layout — Report Card (Layout C)

### Page shell
- Full-page white/dark background matching agency OS dark theme (`bg-[#0A1628]`)
- No sidebar, no top nav, no module tabs — fully clean
- Max-width container (`max-w-2xl mx-auto`) centered — feels like a document, not a dashboard
- Print-friendly spacing

### Section 1 — Header
```
[Business Name]                              [82 / 100]
Marketing Report · April 2026
```
- Business name: `text-xl font-bold text-white`
- Score badge: teal-bordered pill — `82 / 100` with green/yellow/red tint based on score range (≥75 green, 50–74 yellow, <50 red)
- Month label: `text-sm text-gray-400`

### Section 2 — Metric Rows
Clean label/value rows with a bottom border separator. Each row:
```
[Label]                    [Value]  [Trend indicator]
```

Rows in order:
1. Total Leads — `24` — `↑ +4 vs last month` (green) or `↓ -2` (red) or omit if no prior data
2. Cost Per Lead — `$68` — `↓ better` (green) or `↑ higher` (red) or omit
3. New Reviews — `+6` — no trend indicator
4. Google Rating — `4.8★` — no trend indicator
5. GBP Posts Published — `8` — no trend indicator
6. Citations Built — `14` — no trend indicator (cumulative total, not monthly delta)
7. Tasks Completed — `28 / 34` — shown as fraction, no trend

Label: `text-sm text-gray-400`
Value: `text-sm font-semibold text-white`
Trend up (good): `text-emerald-400 text-xs`
Trend down (bad): `text-red-400 text-xs`

### Section 3 — Lead Source Breakdown
Header: "Where Your Leads Came From"
Bar chart: horizontal bars, top 4 sources by count, same hand-coded SVG/div approach used elsewhere in the codebase (no recharts).

Source label mapping (display names for LeadSource enum values):
- `lsa` → "Google LSA"
- `google_ads` → "Google Ads"
- `gbp` → "Google Business Profile"
- `organic` → "Organic Search"
- `referral` → "Referral"
- `social` → "Social Media"
- `nextdoor` → "Nextdoor"
- `yelp` → "Yelp"
- `direct` → "Direct"

Bar colors: cycle through teal (`#00D4C8`), blue (`#3b82f6`), emerald (`#10b981`), amber (`#f59e0b`).

### Section 4 — Footer
```
Powered by Surge Advisory  ·  surgeadvisory.co
```
- Small, subtle — `text-xs text-gray-600`
- No other agency branding or pricing visible

---

## "Client View" Button Placement

Added to the existing client detail page header. The client detail pages live at:
`app/dashboard/clients/[id]/[module]/page.tsx`

Each module page renders a shared client header (currently inline or via a shared component — check at implementation time). The button:
- Label: "Client View"
- Icon: `ExternalLink` from lucide-react
- Style: secondary/ghost button — teal border, dark fill — consistent with existing dashboard button styles
- `target="_blank"` link to `/dashboard/clients/${clientId}/client-view`

---

## Edge Cases

| Situation | Handling |
|---|---|
| No leads this month | "Total Leads: 0" — no trend indicator |
| No prior month data for trend | Omit the trend indicator entirely (no arrow, no text) |
| No reviewStats for client | Review rows show "—" placeholder |
| adSpend is 0 | CPL row shows "—" (can't compute) |
| No GBP posts this month | "0" — no trend |
| No citations data | "—" |
| Client not found (bad ID) | Redirect to `/dashboard` |

---

## Files Affected

| Action | File |
|---|---|
| Create | `app/dashboard/clients/[id]/client-view/page.tsx` |
| Create | `components/dashboard/ClientViewReport.tsx` |
| Modify | Existing client detail header — add "Client View" button |

The existing client detail header needs to be located at implementation time. It may be inline in each module page or in a shared layout — the implementer should check `app/dashboard/clients/[id]/` structure before modifying.

---

## Out of Scope

- Authentication / access control (this is a screen-share tool, not a public URL)
- PDF export
- Email delivery
- Month selector (always shows current month)
- Editable metrics or client-facing comments
- Any new localStorage keys or store mutations
