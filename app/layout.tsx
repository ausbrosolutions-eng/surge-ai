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
