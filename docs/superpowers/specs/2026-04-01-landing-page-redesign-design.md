# Surge Advisory Landing Page Redesign -- Dark Editorial

**Date:** 2026-04-01
**Scope:** Full public landing page redesign. Dashboard untouched.
**Approach:** Dark Editorial -- near-black backgrounds, copper metallic accent, condensed uppercase display typography, curated stock photography with desaturated warm treatment. Quiet confidence over flashy AI-startup energy.

---

## Design Principles

1. **Restraint is the statement.** Animate 10% of elements, not 100%. Copper on 5-10% of elements, not 50%. Whitespace is a design tool, not wasted space.
2. **No AI-coded patterns.** No floating orbs, glassmorphism, gradient blobs, grid/dot backgrounds, fade-in-up on every element, three equal cards, or rounded shadow containers.
3. **Photography carries the color.** The UI is monochromatic (blacks, warm grays, copper). All visual warmth comes from stock photography.
4. **Typography creates hierarchy.** Size, weight, case, and tracking do the work -- not color or decoration.
5. **Every element earns its place.** If it doesn't serve the message or the buyer's journey, it goes.

---

## Color System

| Role | Hex | Usage |
|---|---|---|
| Primary Background | `#0A0A0A` | Page background, hero, most sections |
| Surface | `#111111` | Elevated areas, nav on scroll |
| Card/Container | `#1A1A1A` | Content blocks needing subtle separation (form only) |
| Border/Divider | `#2A2520` | Warm-toned subtle borders |
| Copper (primary accent) | `#B87333` | CTAs, key data points, active states |
| Copper Light | `#D4956A` | Hover states, metallic gradient highlights |
| Copper Dark | `#8B5E3C` | Pressed states, darker gradient stops |
| Text Primary | `#E8E2D8` | Headlines, body copy (warm off-white) |
| Text Secondary | `#9A9086` | Subheadings, supporting text, labels |
| Text Muted | `#5A5550` | Disabled, tertiary info |
| Pure White | `#FFFFFF` | Sparingly -- max emphasis on 1-2 elements per page |

**Copper Metallic Gradient** (for brand name or one key headline):
```css
background: linear-gradient(135deg, #462523 0%, #8B5E3C 25%, #D4956A 40%, #F0D5B8 50%, #D4956A 60%, #8B5E3C 75%, #462523 100%);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

**Rules:**
- No teal, coral, or blue anywhere
- Copper on max 5-10% of elements per viewport
- 2-3% opacity noise texture overlay on all `#0A0A0A` sections via `::after` pseudo-element with `mix-blend-mode: overlay`
- `::selection` background: `rgba(184, 115, 51, 0.3)`
- Custom scrollbar: 8px thumb `#2A2520`, track `#0A0A0A`, hover `#B87333`

---

## Typography

**Display Font:** Barlow Condensed (Google Fonts)
- Tight, masculine, condensed sans-serif with industrial edge
- All headlines, section titles, nav links, buttons, stat numbers

**Body Font:** Inter (already loaded)
- Clean, excellent at small sizes
- Body copy, labels, descriptions, form fields

**Type Scale:**

| Element | Font | Size (desktop) | Size (mobile) | Weight | Case | Tracking |
|---|---|---|---|---|---|---|
| Hero headline | Barlow Condensed | 80-96px | 40-48px | 700 | UPPERCASE | 0.03em |
| Section heading | Barlow Condensed | 48-56px | 28-36px | 700 | UPPERCASE | 0.03em |
| Sub-heading | Barlow Condensed | 24-32px | 20-24px | 600 | UPPERCASE | 0.05em |
| Eyebrow/label | Inter | 12px | 11px | 500 | UPPERCASE | 0.08em |
| Body text | Inter | 16px | 15px | 300 | Sentence | -0.01em |
| Body emphasis | Inter | 16px | 15px | 400 | Sentence | -0.01em |
| Stats/numbers | Barlow Condensed | 48-64px | 36-48px | 800 | n/a | 0.02em |
| Button text | Barlow Condensed | 14px | 13px | 600 | UPPERCASE | 0.1em |
| Nav links | Barlow Condensed | 16px | 14px | 500 | UPPERCASE | 0.06em |

**Key details:**
- Body text at weight 300 (light) for refined feel on dark backgrounds
- Eyebrow labels (12px, 500, uppercase, 0.08em) provide structural rhythm
- Stats in Barlow Condensed 48-64px weight 800 become visual anchors

---

## Page Structure

```
Section              Height      Density    Notes
-------              ------      -------    -----
1. Nav Bar           60px        --         Transparent over hero, #111111 on scroll
2. Hero              100vh       DENSE      Full-bleed photo, left-aligned text, single CTA
3. Trust Bar         80px        TIGHT      Platform names, copper accent borders
4. Problem Section   auto        OPEN       Asymmetric 60/40 layout
5. Results           auto        DENSE      Full-bleed photo with overlaid stats
6. How It Works      auto        MEDIUM     3-step horizontal, copper numbers
7. Services/Pricing  auto        DENSE      Stacked full-width blocks
8. Testimonials      auto        OPEN       Single rotating quote, large type
9. Guarantee         auto        TIGHT      One line, centered
10. Final CTA        100vh       DENSE      Full-bleed photo, form right-aligned
11. Footer           auto        MEDIUM     Minimal two-column
```

**Content density alternation:** Dense, Tight, Open, Dense, Medium, Dense, Open, Tight, Dense, Medium. This creates the magazine-like rhythm seen in Brixton, RVCA, and Vuori.

**Layout rules:**
- Max content width: 1200px centered
- Full-bleed photos and dark sections: 100vw edge-to-edge
- Asymmetric splits (60/40, 70/30) instead of equal columns
- No visible card containers, no shadows, no rounded corners on content blocks
- Separation via whitespace and subtle 1px `#2A2520` border lines
- Only the form container gets a `#1A1A1A` background with 1px border

---

## Section Specifications

### 1. Navigation
- Transparent over hero, fixed position
- Logo left: "SURGE" in Barlow Condensed 700 or copper metallic gradient
- 4-5 text links center-right: Barlow Condensed 16px, 500, uppercase, `#E8E2D8`
- One ghost CTA button far right (copper border)
- On scroll: background transitions to `#111111`, 1px `#2A2520` bottom border, 200ms
- Link hover: color shifts to `#B87333`, no underlines
- Mobile: hamburger icon, full-screen dark overlay with large stacked links

### 2. Hero (100vh)
- Full-viewport dark stock photo (tradesperson/truck/job site, desaturated warm)
- Dark gradient overlay: `linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 100%)`
- Text left-aligned in left 50%:
  - Eyebrow: Inter 12px, 500, uppercase, 0.08em, `#9A9086`
  - Headline: Barlow Condensed 80-96px, 700, uppercase, `#E8E2D8`
  - One line body: Inter 16px, 300, `#9A9086`
  - Single ghost button: copper border, transparent fill
- No floating stats, no orbs, no secondary CTA, no trade list

### 3. Trust Bar
- 1px `#2A2520` border top and bottom
- Platform names in `#5A5550` text (Inter 14px, 400) or monochrome SVG logos at 40% opacity
- Separated by copper dots or thin vertical lines
- No background change, no cards

### 4. Problem Section
- Asymmetric 60/40 layout: text block left, dark stock photo right
- NOT three equal cards
- Eyebrow label above heading
- 2-3 problem statements as simple text blocks with copper dash prefix
- Generous whitespace (100-120px padding)

### 5. Results (Full-Bleed Photo Break)
- Full-width dark stock photo (texture/detail shot)
- Large stats overlaid: Barlow Condensed 64-72px, 800, `#E8E2D8`
- Labels below stats: Inter 12px, 500, uppercase, `#9A9086`
- Single fade-in animation (opacity 0 to 1, 600ms) -- the ONLY scroll animation on the page
- No cards, no containers

### 6. How It Works
- 3-step horizontal layout
- Each step: copper number (Barlow Condensed 48px, 800, `#B87333`), step title (Barlow Condensed 24px, 600, uppercase), brief description (Inter 16px, 300)
- Steps separated by subtle `#2A2520` lines, not arrows
- Generous padding (100px top/bottom)

### 7. Services/Pricing
- Full-width horizontal blocks stacked vertically
- Each block: 1px `#2A2520` border-bottom
- Left 70%: service name (Barlow Condensed 32px), description (Inter 16px, 300), features as comma-separated text
- Right 30%: price (Barlow Condensed 40px, 800), CTA button
- Popular tier: 4px `#B87333` left border accent instead of badge/ribbon

### 8. Testimonials
- Single quote visible, centered
- Background: large copper quotation mark (Barlow Condensed 120px, `#B87333` at 30% opacity)
- Quote: Inter 24px, 300, italic, `#E8E2D8`, line-height 1.6
- Attribution: name (Inter 14px, 500, `#E8E2D8`), company (Inter 14px, 400, `#9A9086`)
- Copper dash between quote and attribution
- Nav dots: `#5A5550` default, `#B87333` active
- Very generous whitespace (140px padding)

### 9. Guarantee
- Centered, compact
- Single line: Inter 20px, 400, `#E8E2D8`
- Small copper icon or dash above

### 10. Final CTA
- Full-viewport dark stock photo (aerial neighborhood, evening light)
- Gradient overlay (right-to-left for right-aligned form)
- Left: headline + bullet points
- Right: form in `#1A1A1A` container, 1px `#2A2520` border
- Form fields: `#111111` background, `#2A2520` border, `#B87333` focus border
- Submit button: solid `#B87333`, `#0A0A0A` text

### 11. Footer
- `#0A0A0A` background (same as page, seamless)
- Two columns max: brand/tagline left, links right
- Minimal: no email signup form, no app badges
- 1px `#2A2520` border-top
- Social icons in `#5A5550`, hover `#B87333`
- Legal text in `#5A5550`, 13px

---

## Components

### Buttons

| Type | Fill | Border | Radius | Hover |
|---|---|---|---|---|
| Primary CTA | Transparent | 2px solid `#B87333` | 2px | Fills `#B87333`, text `#0A0A0A` |
| Secondary CTA | Transparent | 1px solid `#2A2520` | 2px | Border `#E8E2D8` |
| Form submit | Solid `#B87333` | None | 2px | `#D4956A` background |

All: Barlow Condensed, 14px, 600, uppercase, 0.1em tracking, padding 16px 32px.

### Form Inputs
- Background: `#111111`
- Border: 1px solid `#2A2520`, focus `#B87333`
- Text: `#E8E2D8`, placeholder `#5A5550`
- Label: Inter 12px, 500, uppercase, `#9A9086`, 0.08em tracking, positioned above field
- Border-radius: 2px

### Hover States (Global)
- Color transitions only (200ms ease)
- No transforms (no translateY, no scale)
- No shadows appearing on hover
- No glow effects

### Scroll Behavior
- No scroll-triggered entrance animations (content visible on load)
- Exception: stats on full-bleed photo section fade in once (opacity 0 to 1, 600ms, ease-out)
- Smooth scroll for anchor links

---

## Photography

### Treatment (CSS baseline)
```css
filter: saturate(0.5) brightness(0.85) contrast(1.05) sepia(0.15);
```
Tuned per image. Goal: desaturated, warm, matte, film-like.

### Subjects

| Section | Subject | Composition |
|---|---|---|
| Hero | Tradesperson or truck in dramatic lighting, shot from behind/side. Roofer on rooftop at golden hour, or branded truck at dusk. | Wide landscape, subject in left/right third |
| Results break | Close-up texture: calloused hands on a tool, welding spark, rain on windshield, boot on ladder. | Tight crop, shallow depth of field |
| Final CTA | Aerial/wide shot of residential neighborhood, warm evening light. | Wide, atmospheric, text overlay space |
| Problem section | Environmental shot of home service work in progress. | Medium shot, natural light |

### Overlay Strategy
- Hero/CTA backgrounds: `linear-gradient(to right, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.4) 100%)`
- Results photo break: `rgba(10,10,10,0.6)` uniform overlay
- Gradient direction flips for right-aligned text sections

### Stock Sources
- Unsplash, Pexels (free, good quality for trades/construction)
- Search terms: "construction worker silhouette," "truck dusk," "roofer aerial," "tradesman hands tools," "residential neighborhood evening"
- All images processed through same CSS filter for consistency

### Avoid
- Smiling-at-camera poses
- Clean uniforms or showroom-perfect trucks
- Groups high-fiving
- White studio backgrounds
- Woman-pointing-at-laptop or man-holding-iPad tropes
- Subjects should feel candid, in-motion, or contemplative

---

## Custom Details

- `::selection` background: `rgba(184, 115, 51, 0.3)`
- Custom scrollbar: 8px, thumb `#2A2520`, track `#0A0A0A`, thumb hover `#B87333`
- Noise texture: tiny PNG on all `#0A0A0A` sections, 2-3% opacity, `mix-blend-mode: overlay`, `pointer-events: none`
- Favicon: copper "S" or Surge mark on transparent

---

## What We Are NOT Doing

- No glassmorphism or backdrop-blur
- No floating orbs or animated background elements
- No gradient text (except the copper metallic on brand name)
- No teal, coral, or blue anywhere
- No three-equal-card layouts
- No card containers with shadows
- No fade-in-up animations on every element
- No grid/dot background patterns
- No rounded buttons (max 2px radius)
- No decorative icons next to every feature bullet
- No "AI startup" visual language

---

## Technical Notes

- Framework: Next.js 14 App Router (unchanged)
- Styling: Tailwind CSS with updated config (new palette, new font import)
- Fonts: Add Barlow Condensed via Google Fonts (next/font)
- Animation: Remove Framer Motion from landing page components (or reduce to single fade-in)
- Images: Stock photos in `/public/images/` with next/image optimization
- Noise texture: static PNG asset in `/public/`
- All existing dashboard routes and functionality untouched
