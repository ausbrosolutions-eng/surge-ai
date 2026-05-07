# Sunday-Prep Skill — Design Spec

**Author:** Austin Brooks
**Date:** 2026-04-26 (Sunday)
**Status:** Approved for implementation
**Skill location:** `~/.claude/skills/sunday-prep/SKILL.md`

---

## 1. Purpose

A conversational LDS-aware Sabbath ritual that sets up the week ahead by walking each of Austin's five life priorities (God, Family, Health, Work, Wealth) through a six-tier goal cascade (5-year vision → 3-year vision → annual → quarterly → monthly → weekly), produces a written week file in the Obsidian vault, and lists priority time-blocks ready for the calendar.

It is intentionally a slow, deliberate ritual, not an efficiency tool. The 30–45 minute weekly cost is the point. Sunday-prep is the keystone Sabbath use of Claude Code: it turns the day of rest into a day of preparation that compounds week over week.

## 2. Context

Austin is a lifelong member of The Church of Jesus Christ of Latter-day Saints. He has stated his life priority order as:

1. God
2. Family
3. Health
4. Work
5. Wealth / Finances

His mentor Alan Underwood gave him the principle: calendar your priorities first, build the schedule around them. Sunday-prep operationalizes that principle weekly.

**Family:** Wife Remi, sons Maverick (4) and Nash (2).

**Calling:** Teachers Quorum Advisor — one of four adult leaders for the 13–15 year-old young men in his ward. Light commitment: Wednesday Mutual at 7pm + Sunday church at 1:30pm.

**Day job:** Cherry (fintech), full-time.

**Side business:** Surge Advisory LLC (home-service marketing/ops consulting).

**Sunday rhythm:** Sunday-prep runs between 10am and 12pm before church. The skill must NOT prompt for sacrament-meeting reflection at this hour — church has not happened yet.

## 3. Goal cascade architecture

Six time horizons, each priority arcs through all six:

| Tier | Horizon | Refresh cadence |
|---|---|---|
| 5-year vision | Where life is driving to | Annually, with Remi |
| 3-year vision | Concrete imagery of life in 3 years | Annually, with Remi |
| Annual | This year's outcomes per priority | Jan + July midyear |
| Quarterly | 90-day milestones | Apr / Jul / Oct / Jan |
| Monthly | 30-day pace markers inside the quarter | 1st of each month |
| Weekly | This week's blocks + intentions | Every Sunday |

Each priority (God, Family, Health, Work, Wealth) has its own arc through this cascade.

## 4. Vault file architecture

Lives at `/Users/austin/Documents/Obsidian Vault/sunday-prep/`.

```
sunday-prep/
  README.md                       # System overview for future-Austin
  vision/
    5-year-vision.md              # Long arc (homework with Remi)
    3-year-vision.md              # Mid arc (homework with Remi)
    2026-annual.md                # This year per priority
    2026-Q2.md                    # Current quarter
    2026-04-april.md              # Current month
  weeks/
    2026-W17.md                   # This week (output of the session)
    2026-W16.md                   # Last week (read at session start)
  family/
    remi.md                       # Wife journal
    maverick.md                   # Mav (4)
    nash.md                       # Nash (2)
  calling/
    teachers-quorum.md            # Young men context, ministering touches
  reflections/                    # Overflow journal entries
```

The `family/` files are not just inputs. They are living journals that the skill writes to during the Family-priority segment every Sunday. Over years, they become a multi-year reflection archive on each person.

## 5. Session flow (steady-state, ~30–45 min)

Steady-state assumes scaffolding already exists. First-run flow is described separately in section 7.

1. **Sabbath open** — brief, reverent, NOT a sacrament reflection. Pre-church frame. Single question: "What's the spirit of this Sunday for you so far?"

2. **Silent context load** — Claude reads, without narration:
   - Today's date (determines fast Sunday, General Conference weekend, current CFM week)
   - `vision/5-year-vision.md`, `3-year-vision.md`, `2026-annual.md`, `2026-Q2.md`, current month file
   - `weeks/[last-week].md` for look-back
   - All three `family/*.md` journals
   - `calling/teachers-quorum.md`
   - Current Come Follow Me lesson (from published 2026 curriculum schedule)

3. **Last-week look-back** (5–8 min) — what was planned, what was lived, what to carry forward, what to release with grace.

4. **Priorities walk** — God → Family → Health → Work → Wealth. 3–7 min each. Per-priority structure detailed in section 6.

5. **Week synthesis** — produces `weeks/[this-week].md`. The week file contains:
   - Top-of-file: the "one thing" focus sentence
   - Sabbath open reflection
   - Last-week look-back
   - Per-priority section: relevant goals from each cascade tier, intentions, time-blocks
   - Time-block summary at the bottom (in a format ready to paste into calendar in v1)

6. **One-thing close** — "If only one thing happened this week, what would it be?" Single sentence. Written to the top of the week file.

## 6. Per-priority structure

| Priority | Reads | Asks | Proposes blocks | Writes back to |
|---|---|---|---|---|
| **God** | God cascade + `calling/teachers-quorum.md` + this week's CFM lesson | "What's God teaching you?" / "What does this week's CFM lesson invite you to do differently?" / "Anything you owe a young man this week?" | Mutual Wed 7pm (recurring), CFM personal study time, temple visit if planned, fast offering (1st Sunday) | `calling/teachers-quorum.md` (when a specific young man comes up) |
| **Family** ⭐ | Remi/Maverick/Nash journals + Family cascade | Per person: "What's on your mind about [name] this week? What do they need? What's one thing you can do?" | Date night with Remi, FHE Monday, kid 1:1 windows | `family/remi.md`, `family/maverick.md`, `family/nash.md` (with approval gate — see section 6.1) |
| **Health** | Health cascade + last week's adherence notes | "Where's your body this week? What does it need?" Grounded against Q2 milestone | Training sessions, meal prep windows | week file |
| **Work** | Work cascade (Cherry + Surge tracked separately under Work priority) | "Top 1–2 outcomes at Cherry this week? At Surge?" | Deep-work windows, key meetings (no specific calendar invites — just protected blocks) | week file |
| **Wealth** | Wealth cascade | "Tithing current? Anything moving on the financial picture?" Fast-Sunday: surfaces fast offering reminder | Rare — typically a 30-min money review block when needed | week file |

⭐ The Family segment is the deepest by design. The journal-write-back to Remi/Maverick/Nash files is the long-arc archive: by the time the boys leave home, the parents have years of weekly reflections on each of them.

### 6.1 Family journal approval gate (critical)

The family journals are Austin's voice for his family to read someday, not Claude's voice summarizing what Austin said. To preserve authenticity, the skill MUST follow this protocol every time it writes to `remi.md`, `maverick.md`, or `nash.md`:

1. **Draft the entry from Austin's words during the conversation** — pulling from what he actually said, in language as close to his own phrasing as possible. No AI flourish, no synthesis-summarizing, no em dashes (per Austin's writing rule).
2. **Show the proposed entry to Austin in full** before writing anything to disk. Format: clear preview block.
3. **Offer three explicit choices:**
   - "Looks good, write it as-is"
   - "Let me edit it" — Austin types changes inline, skill writes the edited version
   - "Let me rewrite in my own words" — Austin types the entry from scratch, skill writes that
4. **Only write to the file after explicit approval.** Never write a draft and ask forgiveness.
5. **No silent merging.** Each Sunday's entry is a distinct timestamped block — never edited into prior entries.

This same approval gate applies to `calling/teachers-quorum.md` when the skill considers writing about specific young men.

It does NOT apply to the week file (`weeks/[this-week].md`), the goal files, or other vault writes — those are Austin's outputs to himself, not voice-archives others will read. Those can be written more freely with a final "want to edit anything before I save?" pass at the end.

## 7. First-run vs steady-state

**First-run (today, 2026-04-26, ~75–90 min):**

The first session is partly a setup ritual:

1. Creates the vault folder scaffolding
2. Seeds `vision/5-year-vision.md` and `vision/3-year-vision.md` with prompt templates (Austin's homework with Remi this week)
3. Walks 2026 annual + Q2 + April goals across all 5 priorities
4. Initializes `family/remi.md`, `family/maverick.md`, `family/nash.md` with a first entry each
5. Sets up `calling/teachers-quorum.md` with current context
6. Creates the "Priorities" Google Calendar manually (one-time setup, instructions provided)
7. Then walks the actual current-week (W17) plan with the scaffolding now in place
8. Writes `README.md` documenting the system

**Steady-state (every Sunday after, ~30–45 min):**

Skips scaffolding. Reads existing files. Runs the flow in section 5. Refreshes the monthly file on the first Sunday of the month, the quarterly file at the start of each quarter.

## 8. Calendar integration (phased)

**v1 — markdown only (today through ~6 weeks of weekly use):**

The skill outputs a time-block list at the bottom of the week file, formatted for easy paste/manual entry into a Google Calendar. Austin manually creates events on a "Priorities" calendar in his Google Workspace.

Why phased: do not build OAuth and calendar API plumbing before we know what time-blocks actually belong there. v1 lets the block patterns surface naturally over a few weeks of use.

**v2 — Google Calendar API (after ~6 weeks of stable patterns):**

Add OAuth integration. The skill writes events directly to the "Priorities" calendar. Color coding:
- God = white/gold
- Family = green
- Health = orange
- Work = navy
- Wealth = gray

The "Priorities" calendar lives in Austin's Surge Google Workspace and is shared to his personal Gmail so it appears on his iPhone via the Google Calendar app or iOS Calendar. This makes Mac-based Sunday planning land on his phone for mobile execution during the week.

v2 is a separate spec. This document covers v1.

## 9. Sabbath protection

Cross-session Sabbath behavior is already handled by the global memory `user_lds_faith_sabbath.md` (written 2026-04-26 in this same conversation). Any Claude Code session on a Sunday gently flags if Austin drifts to client/business/code work and offers to redirect. The Sunday-prep skill itself does not need to police this; it embodies the right Sabbath use.

## 10. Skill metadata

Frontmatter shape (matches existing skill conventions in `~/.claude/skills/`):

```yaml
---
name: sunday-prep
description: Conversational LDS-aware Sabbath ritual that walks Austin's 5 life priorities (God, Family, Health, Work, Wealth) through a 6-tier goal cascade (5yr/3yr/annual/quarterly/monthly/weekly) every Sunday morning before church. Reads vision/goal/family-journal files from the Obsidian vault, walks priority-by-priority with reflective questions, writes back to family journals as a long-arc archive, and produces a week file with time-blocks ready for the "Priorities" Google Calendar. Triggers when Austin says "/sunday-prep", "Sunday session", "Sabbath prep", "let's plan the week", or runs Claude Code on a Sunday morning between 9am and 1pm Mountain.
roles: [personal]
integrations: [obsidian]
---
```

## 11. Out of scope (explicitly NOT in v1)

- Google Calendar API integration (deferred to v2)
- Automatic CFM lesson lookup via web fetch (v1 uses a static 2026 schedule embedded in the skill)
- Multi-user / sharing (Remi access is via shared calendar, not skill access)
- Mobile invocation (skill is Mac-only; phone is calendar-consumer only)
- Daily check-ins between Sundays (intentional — Sunday is the ritual; weekdays execute)
- Integration with weekly-checkin (the existing retrospective skill) — these can pair later but Sunday-prep is forward-looking and self-contained

## 12. Success criteria

The skill is working if, six months from now (October 2026):
- Austin has run Sunday-prep at least 20 of the last 26 weeks
- The vault contains a populated `vision/`, current-quarter file, current-month file, all 26 week files, and family journals with substantive entries on Remi/Maverick/Nash spanning months
- His weekly time-blocks visibly reflect the priority order (God and Family blocks land on calendar BEFORE Work fills in around them, not after)
- He can point to at least one specific outcome that traces from a 5-year vision goal → annual → quarterly → monthly → weekly → done
- Future-Austin reading any week file alone (with no other context) understands what mattered that week and why

## 13. Implementation notes for the writing-plans phase

- Skill body must implement the full first-run scaffolding flow detailed in section 7
- Skill must adapt language based on time-of-day on Sunday (pre-church 10am–1pm vs. post-church 4pm+) — pre-church should NOT reference sacrament meeting
- Skill must adapt to fast Sunday (1st Sunday of month) by surfacing fast offering reminder during Wealth segment
- Skill must adapt to General Conference weekends (April + October, specific weekends per the 2026 calendar) by replacing CFM lesson with conference focus
- The CFM 2026 schedule should be embedded as a constant in the skill (Old Testament curriculum for 2026; specific week-to-reading mapping). Do not web-fetch.
- All vault writes must use the obsidian-markdown skill conventions where applicable (frontmatter, wikilinks for cross-references between week files and goal files)
- Family journal entries written by the skill must be timestamped and Sunday-attributed so the archive structure is clear when read months later
- Family journal AND calling-notes writes MUST go through the approval gate defined in section 6.1 — preview, then offer (write-as-is / edit / rewrite) — before any disk write. This is a hard contract, not a "should." Voice authenticity in the long-arc archive depends on it.
- The skill must NEVER write em dashes in any vault content (per Austin's writing rule in CLAUDE.md)
- The week-file template should keep family journal entries in `family/*.md`, not duplicate them into the week file (DRY — week file links to journals, doesn't copy from them)
