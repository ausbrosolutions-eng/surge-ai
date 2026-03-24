import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Surge AI | AI-Powered Revenue Consulting for Home Service Businesses",
  description:
    "We build AI-powered revenue blueprints for home service businesses ready to scale. Custom roadmaps, marketing engine, and growth consulting — you drive, we navigate.",
  keywords: [
    "home service marketing",
    "revenue blueprint",
    "AI consulting",
    "home service business growth",
    "HVAC marketing",
    "roofing marketing",
    "plumbing marketing",
    "restoration marketing",
    "local service business scaling",
    "AI marketing agency",
  ],
  authors: [{ name: "Surge AI" }],
  openGraph: {
    title: "Surge AI | AI-Powered Revenue Consulting",
    description:
      "We build the roadmap. You drive the revenue. AI-powered growth blueprints for home service businesses scaling from X to Y.",
    type: "website",
    locale: "en_US",
    siteName: "Surge AI",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surge AI | Revenue Blueprints for Home Service Businesses",
    description:
      "We build the roadmap. You drive the revenue. AI-powered growth consulting.",
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
  name: "Surge AI",
  description:
    "AI-powered revenue consulting for home service businesses. Custom growth blueprints, marketing strategy, and implementation support.",
  url: "https://withsurge.ai",
  telephone: "+1-800-000-0000",
  priceRange: "$$",
  serviceType: [
    "Revenue Blueprint",
    "AI Marketing Consulting",
    "Home Service Marketing",
    "Google LSA Management",
    "Local SEO",
    "Referral Network Development",
  ],
  areaServed: {
    "@type": "Country",
    name: "United States",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Surge AI Services",
    itemListElement: [
      {
        "@type": "Offer",
        name: "The Blueprint",
        price: "499",
        priceCurrency: "USD",
      },
      {
        "@type": "Offer",
        name: "The Surge Plan",
        price: "1500",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "RecurringCharges",
          billingPeriod: "monthly",
        },
      },
      {
        "@type": "Offer",
        name: "The Full Surge",
        price: "3500",
        priceCurrency: "USD",
        priceSpecification: {
          "@type": "RecurringCharges",
          billingPeriod: "monthly",
        },
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
      <body className={`${inter.variable} font-sans`}>
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
