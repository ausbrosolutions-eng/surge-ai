---
description: Surge AI codebase architecture and critical rules
globs: ["app/**", "components/**", "lib/**"]
---

# Surge AI Codebase

## Tech Stack
- Framework: Next.js 14.2.5 (App Router) -- NOT Next.js 15
- Language: TypeScript (strict)
- Styling: Tailwind CSS 3.4 with custom palette -- teal #00D4C8, coral #FF6B47, navy #0A1628
- Animation: Framer Motion
- Icons: Lucide React only
- State: localStorage via useStore() hook -- no backend, no database, no auth

## Project Structure
```
app/
  page.tsx                        # Public landing page
  layout.tsx                      # Root layout + metadata
  dashboard/clients/[id]/         # 9 client modules (gbp, lsa, seo, ai-search,
                                  # reputation, ads, social, content, reports)
components/
  Navbar.tsx Footer.tsx Hero.tsx  # Landing page sections
  dashboard/Sidebar.tsx           # Agency OS navigation
lib/
  store.ts                        # All state (localStorage)
  types.ts                        # TypeScript interfaces
  data/seedData.ts                # Rehab Restoration seed client
```

## Critical Rules
- Next.js 14: params is a plain object: `const clientId = params.id` -- NEVER use(params)
- All blue-* Tailwind classes resolve to teal (#00D4C8) -- intentional override
- `use client` directive required on all interactive components
- No new npm dependencies without discussion
- Never commit .env or .env.local
- Do not modify lib/store.ts schema without updating lib/types.ts
