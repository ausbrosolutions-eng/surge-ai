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
  title: "Surge Advisory | Ops Infrastructure for Restoration Contractors",
  description:
    "We help restoration contractors recover stuck revenue, fix documentation gaps, and build the ops infrastructure that scales. 2-week Ops Audit starting at $3,500.",
  keywords: [
    "restoration ops consulting",
    "restoration contractor automation",
    "JobNimbus consultant",
    "Encircle integration",
    "Albi restoration CRM",
    "Xactimate automation",
    "restoration collections recovery",
    "supplement workflow automation",
    "restoration business operations",
    "fractional CTO restoration",
  ],
  authors: [{ name: "Surge Advisory" }],
  openGraph: {
    title: "Surge Advisory | Ops Infrastructure for Restoration Contractors",
    description:
      "Recover stuck revenue. Fix documentation gaps. Scale without adding admin. Built for restoration contractors doing $1M-$15M.",
    type: "website",
    locale: "en_US",
    siteName: "Surge Advisory",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surge Advisory | Ops Infrastructure for Restoration Contractors",
    description:
      "Recover stuck revenue. Fix documentation gaps. Scale without adding admin.",
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
    "Ops infrastructure and AI automation for restoration contractors. Recover stuck revenue, fix documentation gaps, scale without adding admin.",
  url: "https://surgeadvisory.co",
  priceRange: "$$$",
  serviceType: [
    "Ops Infrastructure Audit",
    "Restoration Business Automation",
    "Claims Workflow Automation",
    "JobNimbus Consulting",
    "Fractional CTO Services",
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
        name: "Surge Ops Audit",
        price: "3500",
        priceCurrency: "USD",
        description: "2-week data audit identifying stuck revenue, documentation gaps, and 90-day implementation roadmap",
      },
      {
        "@type": "Offer",
        name: "Phase 1: Foundation",
        price: "6500",
        priceCurrency: "USD",
        description: "Months 1-3 implementation retainer",
      },
      {
        "@type": "Offer",
        name: "Phase 2: Build-Out",
        price: "5000",
        priceCurrency: "USD",
        description: "Months 4-6 implementation retainer",
      },
      {
        "@type": "Offer",
        name: "Phase 3: Optimization",
        price: "3500",
        priceCurrency: "USD",
        description: "Month 7+ ongoing retainer",
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
