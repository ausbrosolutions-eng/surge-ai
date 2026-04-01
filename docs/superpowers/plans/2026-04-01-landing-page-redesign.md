# Landing Page Redesign: Dark Editorial Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the surgeadvisory.co landing page with a dark editorial aesthetic: near-black backgrounds, copper metallic accent, Barlow Condensed display typography, curated stock photography, and zero AI-coded patterns.

**Architecture:** Replace all existing landing page components in-place. Update Tailwind config with new palette and font. Rewrite globals.css utility classes. Each component is rewritten from scratch but keeps the same filename and data/content. The dashboard and API routes are untouched.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS 3.4, Barlow Condensed (Google Fonts via next/font), Inter (existing), Lucide React, minimal Framer Motion (one animation total).

**Spec:** `docs/superpowers/specs/2026-04-01-landing-page-redesign-design.md`

---

## File Map

**Modify:**
- `tailwind.config.ts` -- new color palette, new font family, remove old animations
- `app/layout.tsx` -- add Barlow Condensed font import, update body class, update metadata branding
- `app/globals.css` -- rewrite CSS variables, utility classes, add noise texture, scrollbar, selection
- `app/page.tsx` -- update section ordering (remove VSLSection, ProblemSection becomes asymmetric)
- `components/Navbar.tsx` -- dark transparent nav, copper accents, sharp buttons
- `components/Hero.tsx` -- full-bleed photo, left-aligned text, single ghost CTA
- `components/TrustBar.tsx` -- compact dark strip with copper borders
- `components/ProblemSection.tsx` -- asymmetric 60/40 layout, no cards
- `components/ResultsShowcase.tsx` -- becomes full-bleed photo with overlaid stats
- `components/HowItWorksTeaser.tsx` -- copper numbered steps, dark background
- `components/Services.tsx` -- stacked horizontal blocks, no cards
- `components/SocialProof.tsx` -- single rotating testimonial, dark background
- `components/GuaranteeSection.tsx` -- compact single line
- `components/FinalCTA.tsx` -- full-bleed photo background, dark form
- `components/SnapshotResult.tsx` -- dark theme treatment
- `components/Footer.tsx` -- minimal dark two-column
- `components/StickyMobileCTA.tsx` -- copper accent update

**Create:**
- `public/images/noise.png` -- noise texture (generated via script)
- `public/images/hero-bg.jpg` -- stock photo placeholder (sourced from Unsplash)
- `public/images/results-bg.jpg` -- stock photo placeholder
- `public/images/cta-bg.jpg` -- stock photo placeholder
- `public/images/problem-bg.jpg` -- stock photo placeholder

**Remove (content merged elsewhere):**
- `components/VSLSection.tsx` -- removed from page (YouTube embed cut for now; can re-add later)

---

## Task 1: Download Stock Photos and Create Noise Texture

**Files:**
- Create: `public/images/noise.png`
- Create: `public/images/` (directory + placeholder photos)

- [ ] **Step 1: Create the images directory and noise texture**

```bash
mkdir -p "public/images"
```

Generate a noise texture PNG using a Node.js script:

```bash
node -e "
const { createCanvas } = require('canvas');
// Fallback: create a 1x1 transparent PNG if canvas not available
const fs = require('fs');
// Minimal 200x200 noise PNG using raw buffer
const width = 200, height = 200;
const header = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
]);
// For simplicity, we'll download a pre-made noise texture
console.log('Use CSS noise instead');
"
```

Actually, we'll use a CSS-based noise approach (SVG filter) instead of a PNG file. This avoids a dependency on the `canvas` npm package. We'll implement the noise as an inline SVG data URI in globals.css.

- [ ] **Step 2: Download stock photos from Unsplash**

Download 4 stock photos. Use `curl` to fetch from Unsplash's source URLs (free, no API key needed for direct links):

```bash
# Hero: construction worker silhouette at dusk
curl -L "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80" -o "public/images/hero-bg.jpg"

# Results: close-up hands with tools
curl -L "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=1920&q=80" -o "public/images/results-bg.jpg"

# CTA: residential neighborhood aerial at dusk
curl -L "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80" -o "public/images/cta-bg.jpg"

# Problem section: home service work in progress
curl -L "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=1920&q=80" -o "public/images/problem-bg.jpg"
```

- [ ] **Step 3: Commit**

```bash
git add public/images/
git commit -m "Add stock photos for dark editorial redesign"
```

---

## Task 2: Update Tailwind Config and Fonts

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Rewrite tailwind.config.ts**

Replace the entire colors section and add the new font family. Remove old animations (shimmer, slideUp). Keep only a simple fadeIn.

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Editorial palette
        dark: {
          DEFAULT: "#0A0A0A",
          surface: "#111111",
          card: "#1A1A1A",
          border: "#2A2520",
        },
        copper: {
          DEFAULT: "#B87333",
          light: "#D4956A",
          dark: "#8B5E3C",
        },
        warm: {
          white: "#E8E2D8",
          gray: "#9A9086",
          muted: "#5A5550",
        },
        // Keep shadcn/ui CSS variable colors for dashboard compatibility
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-barlow)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Update app/layout.tsx to add Barlow Condensed**

```typescript
import type { Metadata } from "next";
import { Inter, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  variable: "--font-barlow",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Surge Advisory | Revenue Consulting for Home Service Businesses",
  description:
    "We build revenue blueprints for home service businesses ready to scale. Custom roadmaps, marketing strategy, and growth consulting.",
  keywords: [
    "home service marketing",
    "revenue blueprint",
    "home service business growth",
    "HVAC marketing",
    "roofing marketing",
    "plumbing marketing",
    "restoration marketing",
    "local service business scaling",
    "marketing agency",
  ],
  authors: [{ name: "Surge Advisory" }],
  openGraph: {
    title: "Surge Advisory | Revenue Consulting for Home Service Businesses",
    description:
      "We build the roadmap. You drive the revenue. Growth blueprints for home service businesses scaling from X to Y.",
    type: "website",
    locale: "en_US",
    siteName: "Surge Advisory",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surge Advisory | Revenue Blueprints for Home Service Businesses",
    description:
      "We build the roadmap. You drive the revenue.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Surge Advisory",
  description:
    "Revenue consulting for home service businesses. Custom growth blueprints, marketing strategy, and implementation support.",
  url: "https://surgeadvisory.co",
  priceRange: "$$",
  serviceType: [
    "Revenue Blueprint",
    "Marketing Consulting",
    "Home Service Marketing",
    "Google LSA Management",
    "Local SEO",
  ],
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Surge Advisory Services",
    itemListElement: [
      {
        "@type": "Offer",
        name: "The Blueprint",
        price: "499",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Done With You",
        price: "1500",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "Done For You",
        price: "3500",
        priceCurrency: "USD",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${barlowCondensed.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Verify the build compiles**

```bash
cd "/Users/austin/Marketing Agency" && npm run build 2>&1 | tail -20
```

Expected: Build succeeds (or only warns about unused imports in components we haven't updated yet).

- [ ] **Step 4: Commit**

```bash
git add tailwind.config.ts app/layout.tsx
git commit -m "Update Tailwind config and fonts for dark editorial palette"
```

---

## Task 3: Rewrite globals.css

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Rewrite globals.css with new theme variables and utilities**

Replace the content of `app/globals.css`. Keep the shadcn/ui CSS variable structure for dashboard compatibility but update the dark theme values. Add noise texture, scrollbar, selection styles, and new utility classes.

The new globals.css should contain:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 29 52% 46%;
    --primary-foreground: 0 0% 100%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222 47% 11%;
    --muted: 210 40% 96%;
    --muted-foreground: 215 16% 47%;
    --accent: 210 40% 96%;
    --accent-foreground: 222 47% 11%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 214 32% 91%;
    --input: 214 32% 91%;
    --ring: 29 52% 46%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 0 0% 4%;
    --foreground: 34 23% 88%;
    --card: 0 0% 7%;
    --card-foreground: 34 23% 88%;
    --popover: 0 0% 7%;
    --popover-foreground: 34 23% 88%;
    --primary: 29 52% 46%;
    --primary-foreground: 0 0% 4%;
    --secondary: 20 8% 12%;
    --secondary-foreground: 34 23% 88%;
    --muted: 20 8% 12%;
    --muted-foreground: 25 7% 37%;
    --accent: 20 8% 12%;
    --accent-foreground: 34 23% 88%;
    --destructive: 0 62% 30%;
    --destructive-foreground: 34 23% 88%;
    --border: 18 10% 15%;
    --input: 18 10% 15%;
    --ring: 29 52% 46%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground antialiased;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  html {
    scroll-behavior: smooth;
  }

  /* Custom selection color */
  ::selection {
    background: rgba(184, 115, 51, 0.3);
    color: #E8E2D8;
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-track {
    background: #0A0A0A;
  }
  ::-webkit-scrollbar-thumb {
    background: #2A2520;
    border-radius: 4px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #B87333;
  }
}

@layer utilities {
  /* Noise texture overlay for dark sections */
  .noise-texture::after {
    content: '';
    position: absolute;
    inset: 0;
    opacity: 0.03;
    pointer-events: none;
    mix-blend-mode: overlay;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 256px 256px;
  }

  /* Photo treatment filter */
  .photo-treatment {
    filter: saturate(0.5) brightness(0.85) contrast(1.05) sepia(0.15);
  }

  /* Copper metallic gradient text */
  .copper-text {
    background: linear-gradient(
      135deg,
      #462523 0%,
      #8B5E3C 25%,
      #D4956A 40%,
      #F0D5B8 50%,
      #D4956A 60%,
      #8B5E3C 75%,
      #462523 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}
```

Note: This is a complete replacement. The old `.section-light`, `.section-dark`, `.card-solid`, `.gradient-hero`, `.gradient-text`, `.gradient-border`, `.glass`, `.glow-*`, `.grid-bg`, `.dot-bg`, `.orb` classes are all removed. Dashboard components that reference any of these old classes may break -- but the spec says dashboard is untouched for now, and dashboard pages use their own component styles.

- [ ] **Step 2: Verify build**

```bash
cd "/Users/austin/Marketing Agency" && npm run build 2>&1 | tail -20
```

- [ ] **Step 3: Commit**

```bash
git add app/globals.css
git commit -m "Rewrite globals.css for dark editorial theme"
```

---

## Task 4: Rewrite Navbar

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Rewrite Navbar.tsx**

Complete replacement. Remove Framer Motion, remove Waves icon, remove teal/coral colors. Add Barlow Condensed, copper accents, transparent-to-dark scroll behavior.

```tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Results", href: "#results" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#services" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled || !isHomePage
            ? "bg-[#111111] border-b border-[#2A2520]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">
            {/* Logo */}
            <a href="/" className="flex items-center">
              <span className="font-display text-xl font-bold tracking-[0.03em] uppercase copper-text">
                Surge
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-display text-[16px] font-medium tracking-[0.06em] uppercase text-[#E8E2D8] hover:text-[#B87333] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:block">
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-2.5 border-2 border-[#B87333] text-[#E8E2D8] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] hover:bg-[#B87333] hover:text-[#0A0A0A] transition-all duration-200"
              >
                Get Free Snapshot
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-[#E8E2D8] hover:text-[#B87333] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A] md:hidden">
          <div className="pt-20 px-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="font-display text-2xl font-bold tracking-[0.03em] uppercase text-[#E8E2D8] hover:text-[#B87333] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileOpen(false)}
              className="mt-4 w-full text-center py-4 border-2 border-[#B87333] text-[#E8E2D8] font-display text-base font-semibold tracking-[0.1em] uppercase rounded-[2px] hover:bg-[#B87333] hover:text-[#0A0A0A] transition-all duration-200"
            >
              Get Your Free Snapshot
            </a>
          </div>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Navbar.tsx
git commit -m "Rewrite Navbar for dark editorial design"
```

---

## Task 5: Rewrite Hero

**Files:**
- Modify: `components/Hero.tsx`

- [ ] **Step 1: Rewrite Hero.tsx**

Complete replacement. Remove all Framer Motion, orbs, floating stats, trade list, centered layout. Replace with full-bleed photo hero, left-aligned text, single ghost CTA.

```tsx
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover photo-treatment"
          priority
        />
        {/* Dark gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.45) 100%)",
          }}
        />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 noise-texture" />

      {/* Content */}
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-6">
            Home Service Marketing
          </p>

          {/* Headline */}
          <h1 className="font-display text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8]">
            Find out what&rsquo;s killing your revenue
          </h1>

          {/* Subline */}
          <p className="mt-6 font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] max-w-md leading-relaxed">
            A free analysis of your business. We find the top 3 gaps costing you jobs. In 60 seconds.
          </p>

          {/* CTA */}
          <div className="mt-10">
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 border-2 border-[#B87333] text-[#E8E2D8] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] hover:bg-[#B87333] hover:text-[#0A0A0A] transition-all duration-200"
            >
              Get My Free Growth Plan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Hero.tsx
git commit -m "Rewrite Hero with full-bleed photo and left-aligned text"
```

---

## Task 6: Rewrite TrustBar

**Files:**
- Modify: `components/TrustBar.tsx`

- [ ] **Step 1: Rewrite TrustBar.tsx**

Compact dark strip with copper accent borders. Platform names in muted text.

```tsx
const platforms = [
  "Google",
  "Angi",
  "ServiceTitan",
  "Jobber",
  "Yelp",
  "HomeAdvisor",
  "Thumbtack",
];

export default function TrustBar() {
  return (
    <section className="relative border-t border-b border-[#2A2520] py-6 bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {platforms.map((platform, i) => (
            <span key={platform} className="flex items-center gap-6">
              <span className="font-sans text-sm font-normal text-[#5A5550]">
                {platform}
              </span>
              {i < platforms.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-[#B87333]" />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/TrustBar.tsx
git commit -m "Rewrite TrustBar as compact dark strip with copper dots"
```

---

## Task 7: Rewrite ProblemSection (Asymmetric 60/40)

**Files:**
- Modify: `components/ProblemSection.tsx`

- [ ] **Step 1: Rewrite ProblemSection.tsx**

Asymmetric layout: text left (60%), dark photo right (40%). No cards, no Framer Motion. Copper dash prefix on each problem.

```tsx
import Image from "next/image";

const problems = [
  {
    title: "Your phone goes quiet and you don't know why",
    description:
      "Last month was great. This month the calls dried up. You're running your business on hope, not a system.",
  },
  {
    title: "You're paying an agency and can't explain what you're getting",
    description:
      "They send a report with impressions and clicks. Your phone isn't ringing more. You're paying $2,500/mo and your gut says it isn't working.",
  },
  {
    title: "You know you need to grow but don't know the next move",
    description:
      "You want to hit $3M. Or $5M. But nobody's ever built you a roadmap for how to actually get there.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#0A0A0A] overflow-hidden noise-texture">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          {/* Left: Text (60%) */}
          <div className="lg:col-span-3">
            {/* Eyebrow */}
            <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
              Sound Familiar?
            </p>

            {/* Heading */}
            <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-12">
              Every contractor we work with had at least two of these
            </h2>

            {/* Problem list */}
            <div className="space-y-10">
              {problems.map((problem) => (
                <div key={problem.title} className="flex gap-4">
                  {/* Copper dash */}
                  <div className="w-6 h-px bg-[#B87333] mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-[0.05em] uppercase text-[#E8E2D8] mb-2">
                      {problem.title}
                    </h3>
                    <p className="font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Photo (40%) */}
          <div className="lg:col-span-2 relative aspect-[3/4] rounded-[2px] overflow-hidden">
            <Image
              src="/images/problem-bg.jpg"
              alt="Home service professional at work"
              fill
              className="object-cover photo-treatment"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ProblemSection.tsx
git commit -m "Rewrite ProblemSection as asymmetric 60/40 layout"
```

---

## Task 8: Rewrite ResultsShowcase (Full-Bleed Photo with Stats)

**Files:**
- Modify: `components/ResultsShowcase.tsx`

- [ ] **Step 1: Rewrite ResultsShowcase.tsx**

Full-bleed dark photo with large overlaid stats. Single fade-in animation (the only one on the page). No cards.

```tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

const stats = [
  { value: "312%", label: "More Inbound Calls" },
  { value: "4.1x", label: "Average Client ROI" },
  { value: "91%", label: "Client Retention Rate" },
  { value: "48hrs", label: "First Deliverable" },
];

export default function ResultsShowcase() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="results" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background photo */}
      <div className="absolute inset-0">
        <Image
          src="/images/results-bg.jpg"
          alt=""
          fill
          className="object-cover photo-treatment"
        />
        <div className="absolute inset-0 bg-[#0A0A0A]/60" />
      </div>

      {/* Noise */}
      <div className="absolute inset-0 noise-texture" />

      {/* Content */}
      <div ref={ref} className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
          Real Results
        </p>

        <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-16 max-w-xl">
          Numbers from real contractors in your trade
        </h2>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12"
        >
          {stats.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-[48px] sm:text-[64px] font-extrabold leading-none tracking-[0.02em] text-[#E8E2D8]">
                {stat.value}
              </div>
              <div className="mt-2 font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086]">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        <p className="mt-12 font-sans text-xs font-normal text-[#5A5550] max-w-md">
          Results are from top-performing clients. Individual results vary based on market, competition, and starting position.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ResultsShowcase.tsx
git commit -m "Rewrite ResultsShowcase as full-bleed photo with overlaid stats"
```

---

## Task 9: Rewrite HowItWorksTeaser

**Files:**
- Modify: `components/HowItWorksTeaser.tsx`

- [ ] **Step 1: Rewrite HowItWorksTeaser.tsx**

Dark background. 3 copper-numbered steps. Separated by subtle border lines. No icons, no arrows.

```tsx
const steps = [
  {
    number: "01",
    title: "Free Snapshot",
    description: "60-second analysis of your biggest revenue gap and top 3 growth channels.",
  },
  {
    number: "02",
    title: "Custom Blueprint",
    description: "Your full growth roadmap, built in 48 hours around your trade, market, and revenue goal.",
  },
  {
    number: "03",
    title: "Execute",
    description: "DIY with the Blueprint, get guided support, or hand it all off. Your call.",
  },
];

export default function HowItWorksTeaser() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-28 bg-[#0A0A0A] noise-texture">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Eyebrow */}
        <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
          How It Works
        </p>

        <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-16">
          Three steps. No lock-ins.
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`py-8 md:py-0 md:px-8 ${
                i < steps.length - 1
                  ? "border-b md:border-b-0 md:border-r border-[#2A2520]"
                  : ""
              } ${i === 0 ? "md:pl-0" : ""} ${i === steps.length - 1 ? "md:pr-0" : ""}`}
            >
              {/* Copper number */}
              <div className="font-display text-[48px] font-extrabold leading-none tracking-[0.02em] text-[#B87333] mb-4">
                {step.number}
              </div>

              {/* Title */}
              <h3 className="font-display text-xl font-semibold tracking-[0.05em] uppercase text-[#E8E2D8] mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/HowItWorksTeaser.tsx
git commit -m "Rewrite HowItWorks with copper numbers and dark background"
```

---

## Task 10: Rewrite Services/Pricing

**Files:**
- Modify: `components/Services.tsx`

- [ ] **Step 1: Rewrite Services.tsx**

Stacked full-width horizontal blocks. No cards. Left 70% content, right 30% price + CTA. Popular tier gets copper left border.

```tsx
const tiers = [
  {
    name: "The Blueprint",
    tagline: "Start here. Most owners never need more.",
    price: "$499",
    period: "one-time",
    description:
      "Your fully custom growth roadmap. Built in 48 hours around your trade, market, and revenue goal.",
    features:
      "15-min intake, full gap assessment, market data, competitor breakdown, 9 channels ranked by ROI, 90-day action plan, 60-min review call",
    popular: false,
  },
  {
    name: "Done With You",
    tagline: "You execute. We guide.",
    price: "$1,500",
    period: "/month",
    description:
      "The Blueprint plus a strategic partner. Monthly calls, unlimited async support, and content on demand.",
    features:
      "Everything in The Blueprint (refreshed quarterly), monthly strategy call, unlimited async support, performance review, AI-generated content, review request templates, month-to-month",
    popular: true,
  },
  {
    name: "Done For You",
    tagline: "We run it. You run the business.",
    price: "From $3,500",
    period: "/month",
    description:
      "Full-service implementation. Every channel, fully managed, fully tied back to revenue.",
    features:
      "Everything in Done With You, Google LSA management, PPC campaigns, GBP optimization, reputation management, call tracking, bi-weekly calls, revenue-linked dashboard",
    popular: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-[#0A0A0A] noise-texture">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
          Pricing
        </p>
        <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-4">
          Start with the Blueprint
        </h2>
        <p className="font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] mb-16 max-w-xl">
          No retainer before results. No lock-ins. The Blueprint is yours regardless of what comes next.
        </p>

        {/* Tier blocks */}
        <div className="space-y-0">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`border-b border-[#2A2520] py-10 ${
                tier.popular ? "border-l-4 border-l-[#B87333] pl-8" : "pl-0"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                {/* Left: Content (70%) */}
                <div className="lg:w-[70%]">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-2xl sm:text-[32px] font-bold tracking-[0.03em] uppercase text-[#E8E2D8]">
                      {tier.name}
                    </h3>
                    {tier.popular && (
                      <span className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333]">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-sm font-light text-[#9A9086] mb-3">
                    {tier.tagline}
                  </p>
                  <p className="font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] leading-relaxed mb-4">
                    {tier.description}
                  </p>
                  <p className="font-sans text-sm font-light text-[#5A5550] leading-relaxed">
                    {tier.features}
                  </p>
                </div>

                {/* Right: Price + CTA (30%) */}
                <div className="lg:w-[30%] lg:text-right flex flex-col items-start lg:items-end gap-4">
                  <div>
                    <span className="font-display text-[40px] font-extrabold leading-none tracking-[0.02em] text-[#E8E2D8]">
                      {tier.price}
                    </span>
                    <span className="font-sans text-sm font-light text-[#5A5550] ml-1">
                      {tier.period}
                    </span>
                  </div>
                  <a
                    href="#contact"
                    className={`inline-flex items-center px-8 py-3 font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-all duration-200 ${
                      tier.popular
                        ? "bg-[#B87333] text-[#0A0A0A] hover:bg-[#D4956A]"
                        : "border-2 border-[#2A2520] text-[#E8E2D8] hover:border-[#E8E2D8]"
                    }`}
                  >
                    {tier.popular ? "Get Started" : "Learn More"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CRM note */}
        <p className="mt-10 font-sans text-sm font-light text-[#5A5550]">
          Using ServiceTitan, Jobber, or HouseCall Pro? We include CRM setup guidance in every plan.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Services.tsx
git commit -m "Rewrite Services as stacked horizontal blocks with copper accent"
```

---

## Task 11: Rewrite SocialProof (Single Rotating Testimonial)

**Files:**
- Modify: `components/SocialProof.tsx`

- [ ] **Step 1: Rewrite SocialProof.tsx**

Single rotating testimonial on dark background. Large quote with copper quotation mark. No cards, no stats grid (stats moved to ResultsShowcase).

```tsx
"use client";

import { useState } from "react";

const testimonials = [
  {
    name: "Scott M.",
    company: "Water Damage Restoration",
    location: "Phoenix, AZ",
    quote:
      "Before this, our phone wasn't ringing from Google at all. Within 60 days we were getting 15 to 20 calls a week just from our GBP and LSAs. I didn't know how invisible we actually were until I saw the numbers.",
  },
  {
    name: "Mike R.",
    company: "HVAC Service Company",
    location: "Houston, TX",
    quote:
      "I was spending $4,000 a month on ads and couldn't tell you where a single job came from. They rebuilt everything. We cut ad spend by 30% and lead volume doubled. First time I've actually understood my own marketing.",
  },
  {
    name: "Dave & Lisa T.",
    company: "Summit Roofing",
    location: "Nashville, TN",
    quote:
      "Went from 18 Google reviews to 94 in three months. All real, all from real customers. That alone put us in the Map Pack for every keyword in our city. The review system runs while we sleep.",
  },
];

export default function SocialProof() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="relative py-32 sm:py-40 bg-[#0A0A0A] noise-texture">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Large copper quotation mark */}
          <div className="font-display text-[120px] leading-none text-[#B87333] opacity-30 select-none mb-[-40px]">
            &ldquo;
          </div>

          {/* Quote */}
          <blockquote className="font-sans text-xl sm:text-2xl font-light italic text-[#E8E2D8] leading-relaxed mb-8">
            {t.quote}
          </blockquote>

          {/* Copper dash divider */}
          <div className="w-12 h-px bg-[#B87333] mx-auto mb-6" />

          {/* Attribution */}
          <div className="font-sans text-sm font-medium text-[#E8E2D8] mb-1">
            {t.name}
          </div>
          <div className="font-sans text-sm font-normal text-[#9A9086]">
            {t.company} &middot; {t.location}
          </div>

          {/* Nav dots */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  i === active ? "bg-[#B87333]" : "bg-[#5A5550]"
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SocialProof.tsx
git commit -m "Rewrite SocialProof as single rotating testimonial"
```

---

## Task 12: Rewrite GuaranteeSection

**Files:**
- Modify: `components/GuaranteeSection.tsx`

- [ ] **Step 1: Rewrite GuaranteeSection.tsx**

Compact, centered, single line. No icons, no colored dots.

```tsx
export default function GuaranteeSection() {
  return (
    <section className="py-12 sm:py-16 bg-[#0A0A0A] border-t border-b border-[#2A2520]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Copper dash */}
        <div className="w-8 h-px bg-[#B87333] mx-auto mb-6" />

        <p className="font-sans text-lg sm:text-xl font-normal text-[#E8E2D8]">
          Not useful in 7 days? Full refund. No questions.
        </p>

        <p className="mt-3 font-sans text-sm font-normal text-[#5A5550]">
          214 blueprints delivered &middot; 98.1% satisfaction rate
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/GuaranteeSection.tsx
git commit -m "Rewrite GuaranteeSection as compact single-line"
```

---

## Task 13: Rewrite FinalCTA

**Files:**
- Modify: `components/FinalCTA.tsx`

- [ ] **Step 1: Rewrite FinalCTA.tsx**

Full-bleed photo background with right-aligned dark form. Remove orbs, light theme, Framer Motion entrance animations. Keep form logic and SnapshotResult integration.

```tsx
"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import SnapshotResult, { type SnapshotData } from "./SnapshotResult";

const revenueOptions = [
  "Under $500k/year",
  "$500k - $1M/year",
  "$1M - $3M/year",
  "$3M - $8M/year",
  "$8M - $20M/year",
  "Over $20M/year",
];

const challengeOptions = [
  "Not enough leads coming in",
  "Leads aren't converting to booked jobs",
  "Don't know where marketing spend is going",
  "No clear roadmap to my revenue goal",
  "Need to scale faster without adding chaos",
  "Other",
];

const LOADING_MESSAGES = [
  "Analyzing your market...",
  "Identifying your biggest revenue gap...",
  "Ranking your top 3 channels...",
  "Customizing your growth plan...",
  "Almost ready...",
];

interface FormData {
  name: string;
  email: string;
  company: string;
  monthlyRevenue: string;
  biggestChallenge: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  company?: string;
  monthlyRevenue?: string;
  biggestChallenge?: string;
}

export default function FinalCTA() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    monthlyRevenue: "",
    biggestChallenge: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snapshot, setSnapshot] = useState<SnapshotData | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      setLoadingMsgIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isSubmitting]);

  const validate = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) {
      e.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Enter a valid email address";
    }
    if (!form.company.trim()) e.company = "Business name is required";
    if (!form.monthlyRevenue) e.monthlyRevenue = "Select your revenue range";
    if (!form.biggestChallenge) e.biggestChallenge = "Select your biggest challenge";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSnapshot(data.snapshot as SnapshotData);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = (field: keyof FormErrors) =>
    `w-full px-4 py-3 bg-[#111111] border text-sm text-[#E8E2D8] placeholder-[#5A5550] rounded-[2px] transition-colors duration-200 focus:outline-none focus:border-[#B87333] ${
      errors[field] ? "border-red-500/60" : "border-[#2A2520]"
    }`;

  return (
    <>
      {/* Loading modal */}
      {isSubmitting && (
        <div className="fixed inset-0 bg-[#0A0A0A]/90 z-50 flex items-center justify-center px-4">
          <div className="max-w-sm w-full text-center">
            <Loader2 className="w-8 h-8 text-[#B87333] animate-spin mx-auto mb-6" />
            <p className="font-sans text-base font-normal text-[#E8E2D8] min-h-[1.5rem]">
              {LOADING_MESSAGES[loadingMsgIndex]}
            </p>
          </div>
        </div>
      )}

      <section id="contact" className="relative min-h-screen flex items-center py-24 sm:py-32 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <Image
            src="/images/cta-bg.jpg"
            alt=""
            fill
            className="object-cover photo-treatment"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to left, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.45) 100%)",
            }}
          />
        </div>

        <div className="absolute inset-0 noise-texture" />

        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: Copy */}
            <div>
              <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
                Free Blueprint Snapshot
              </p>
              <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-6">
                Find out what&rsquo;s costing you jobs
              </h2>
              <div className="space-y-3 mb-8">
                {[
                  "Your #1 revenue gap, named",
                  "Top 3 channels for your trade",
                  "One action to take this week",
                  "Your market's competitive blind spot",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B87333] flex-shrink-0" />
                    <span className="font-sans text-sm font-light text-[#9A9086]">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
              <p className="font-sans text-xs font-normal text-[#5A5550] border-l border-[#2A2520] pl-4">
                Reviewed by a real person within 24 hours. No automated pitch.
              </p>
            </div>

            {/* Right: Form */}
            <div className="bg-[#1A1A1A] border border-[#2A2520] rounded-[2px] p-7 sm:p-8">
              {snapshot ? (
                <SnapshotResult
                  snapshot={snapshot}
                  name={form.name}
                  company={form.company}
                />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <div>
                    <div className="font-display text-lg font-bold tracking-[0.03em] uppercase text-[#E8E2D8] mb-0.5">
                      Build My Free Snapshot
                    </div>
                    <p className="font-sans text-sm font-light text-[#5A5550] mb-5">
                      60 seconds. No credit card. Yours to keep.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="Scott Miller"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className={inputClass("name")}
                      />
                      {errors.name && (
                        <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">
                        Business Email *
                      </label>
                      <input
                        type="email"
                        placeholder="scott@yourbusiness.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className={inputClass("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Miller Plumbing & Drain"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className={inputClass("company")}
                    />
                    {errors.company && (
                      <p className="mt-1 text-xs text-red-400">{errors.company}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">
                      Annual Revenue *
                    </label>
                    <select
                      value={form.monthlyRevenue}
                      onChange={(e) => setForm({ ...form, monthlyRevenue: e.target.value })}
                      className={inputClass("monthlyRevenue")}
                    >
                      <option value="" disabled>Select a range</option>
                      {revenueOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.monthlyRevenue && (
                      <p className="mt-1 text-xs text-red-400">{errors.monthlyRevenue}</p>
                    )}
                  </div>

                  <div>
                    <label className="block font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-1.5">
                      Biggest Challenge *
                    </label>
                    <select
                      value={form.biggestChallenge}
                      onChange={(e) => setForm({ ...form, biggestChallenge: e.target.value })}
                      className={inputClass("biggestChallenge")}
                    >
                      <option value="" disabled>Select your main challenge</option>
                      {challengeOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                    {errors.biggestChallenge && (
                      <p className="mt-1 text-xs text-red-400">{errors.biggestChallenge}</p>
                    )}
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-[2px] bg-red-500/10 border border-red-500/30 text-sm text-red-400">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4 bg-[#B87333] hover:bg-[#D4956A] disabled:opacity-60 disabled:cursor-not-allowed text-[#0A0A0A] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-all duration-200 mt-2"
                  >
                    Build My Free Snapshot
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center font-sans text-xs font-normal text-[#5A5550] mt-2">
                    No spam. No commitment.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/FinalCTA.tsx
git commit -m "Rewrite FinalCTA with full-bleed photo and dark form"
```

---

## Task 14: Rewrite Footer and StickyMobileCTA

**Files:**
- Modify: `components/Footer.tsx`
- Modify: `components/StickyMobileCTA.tsx`

- [ ] **Step 1: Rewrite Footer.tsx**

Minimal dark two-column. Remove newsletter, remove social icons grid, simplify.

```tsx
const footerLinks = {
  Services: [
    { label: "The Blueprint", href: "/#services" },
    { label: "Done With You", href: "/#services" },
    { label: "Done For You", href: "/#services" },
  ],
  Company: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Results", href: "/#results" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/#contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2520]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <a href="/" className="inline-block mb-4">
              <span className="font-display text-xl font-bold tracking-[0.03em] uppercase copper-text">
                Surge
              </span>
            </a>
            <p className="font-sans text-sm font-light text-[#5A5550] max-w-xs leading-relaxed">
              Revenue consulting for home service businesses ready to scale.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display text-xs font-semibold tracking-[0.08em] uppercase text-[#5A5550] mb-5">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="font-sans text-sm font-light text-[#9A9086] hover:text-[#B87333] transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#2A2520]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs font-normal text-[#5A5550]">
            &copy; {new Date().getFullYear()} Surge Advisory. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-sans text-xs font-normal text-[#5A5550] hover:text-[#B87333] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-sans text-xs font-normal text-[#5A5550] hover:text-[#B87333] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Rewrite StickyMobileCTA.tsx**

```tsx
"use client";

import { useState, useEffect } from "react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-[#111111] border-t border-[#2A2520] px-4 pt-3 pb-4">
        <a
          href="#contact"
          className="flex items-center justify-center w-full py-4 bg-[#B87333] hover:bg-[#D4956A] text-[#0A0A0A] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-colors"
        >
          Get Your Free Snapshot
        </a>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx components/StickyMobileCTA.tsx
git commit -m "Rewrite Footer and StickyMobileCTA for dark editorial theme"
```

---

## Task 15: Update SnapshotResult for Dark Theme

**Files:**
- Modify: `components/SnapshotResult.tsx`

- [ ] **Step 1: Update SnapshotResult.tsx color scheme**

Update all colors from light theme (white backgrounds, gray text, teal/coral accents) to dark theme (dark backgrounds, warm-white text, copper accent). Keep the same structure and Framer Motion entrance animations since these are response animations, not scroll animations.

The key changes:
- All `bg-white` and `bg-gray-50` become `bg-[#111111]`
- All `border-gray-200` become `border-[#2A2520]`
- All `text-gray-900` become `text-[#E8E2D8]`
- All `text-gray-600` become `text-[#9A9086]`
- All `text-gray-500` become `text-[#9A9086]`
- All `text-[#00D4C8]` / `text-[#008F8A]` become `text-[#B87333]`
- All `text-[#FF6B47]` become `text-[#D4956A]`
- All `bg-[#00D4C8]/8` become `bg-[#B87333]/10`
- All `border-[#00D4C8]/25` become `border-[#B87333]/25`
- All `bg-[#FF6B47]/8` become `bg-[#D4956A]/10`
- All `border-[#FF6B47]/25` become `border-[#D4956A]/25`
- `RANK_COLORS` become `["#B87333", "#D4956A", "#8B5E3C"]`
- Final CTA button: `bg-[#B87333] hover:bg-[#D4956A] text-[#0A0A0A]`

- [ ] **Step 2: Commit**

```bash
git add components/SnapshotResult.tsx
git commit -m "Update SnapshotResult colors for dark editorial theme"
```

---

## Task 16: Update page.tsx Section Order

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update page.tsx**

Remove VSLSection import and usage. The new page order matches the spec.

```tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemSection from "@/components/ProblemSection";
import ResultsShowcase from "@/components/ResultsShowcase";
import HowItWorksTeaser from "@/components/HowItWorksTeaser";
import Services from "@/components/Services";
import SocialProof from "@/components/SocialProof";
import GuaranteeSection from "@/components/GuaranteeSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A]">
      <Navbar />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <ResultsShowcase />
      <HowItWorksTeaser />
      <Services />
      <SocialProof />
      <GuaranteeSection />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "Update page.tsx section order and remove VSLSection"
```

---

## Task 17: Build Verification and Final Cleanup

**Files:**
- All modified files

- [ ] **Step 1: Run the build**

```bash
cd "/Users/austin/Marketing Agency" && npm run build 2>&1 | tail -30
```

Expected: Build succeeds. Fix any TypeScript or import errors.

- [ ] **Step 2: Run the dev server and verify visually**

```bash
cd "/Users/austin/Marketing Agency" && npm run dev
```

Open http://localhost:3000 and verify:
- Dark background throughout
- Copper accents on CTAs and numbers
- Barlow Condensed on headlines (uppercase, condensed)
- Inter light (300) on body text
- Stock photos loading with desaturated treatment
- No teal, coral, or blue anywhere
- No floating orbs or glassmorphism
- Form submits correctly
- Mobile nav works

- [ ] **Step 3: Delete unused VSLSection**

```bash
rm "components/VSLSection.tsx"
git add -u components/VSLSection.tsx
git commit -m "Remove unused VSLSection component"
```

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "Fix build issues from dark editorial redesign"
```
