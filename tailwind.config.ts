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
        // Canonical Surge palette
        page: "#0A0A0A",          // matte black, default page background
        surface: {
          DEFAULT: "#2A3439",     // gun metal, primary surface
          light: "#3B444B",       // gun metal light, hover/elevated
        },
        copper: {
          DEFAULT: "#B87333",
          dark: "#8B5A26",
          tint: "#FFF8F0",
        },
        ink: {
          primary: "#FFFFFF",
          secondary: "#9A9086",   // warm gray, subheads/metadata
          tertiary: "#6B7280",    // cool gray, de-emphasized
        },
        light: "#F5F1ED",         // warm off-white, light contexts
        // Legacy tokens kept for shadcn/ui compatibility
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
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["80px", { lineHeight: "0.96", letterSpacing: "-0.04em", fontWeight: "700" }],
        "display-lg": ["60px", { lineHeight: "1.0", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-md": ["32px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "display-sm": ["24px", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "600" }],
        "label": ["11px", { lineHeight: "1.4", letterSpacing: "0.16em", fontWeight: "500" }],
      },
      spacing: {
        "section": "96px",
        "section-lg": "128px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-up": "fade-up 600ms ease-out",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
