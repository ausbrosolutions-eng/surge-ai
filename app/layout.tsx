import type { Metadata } from "next";
import { inter, jetbrainsMono } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Surge Advisory, operating system for home service businesses",
  description:
    "Surge installs AI workflows that automate the back-office work eating your team's day, then turns on the marketing infrastructure to fill the pipeline they can finally answer.",
  metadataBase: new URL("https://surgeadvisory.co"),
  openGraph: {
    title: "Surge Advisory, operating system for home service businesses",
    description:
      "AI workflow builds + marketing infrastructure for home service businesses.",
    url: "https://surgeadvisory.co",
    siteName: "Surge Advisory",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Surge Advisory",
    description:
      "Operating system for home service businesses.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-page text-ink-primary font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
