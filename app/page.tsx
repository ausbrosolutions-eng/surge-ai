import { Navbar } from "@/components/home/Navbar";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Problem } from "@/components/home/Problem";
import { Modules } from "@/components/home/Modules";
import { WorkflowsFeatured } from "@/components/home/WorkflowsFeatured";
import { MarketingFeatured } from "@/components/home/MarketingFeatured";
import { Method } from "@/components/home/Method";
import { Engagements } from "@/components/home/Engagements";
import { Stance } from "@/components/home/Stance";
import { FinalCTA } from "@/components/home/FinalCTA";
import { Footer } from "@/components/home/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Problem />
        <Modules />
        <WorkflowsFeatured />
        <MarketingFeatured />
        <Method />
        <Engagements />
        <Stance />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
