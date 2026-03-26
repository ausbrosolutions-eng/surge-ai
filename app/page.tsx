import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import HowItWorksTeaser from "@/components/HowItWorksTeaser";
import VSLSection from "@/components/VSLSection";
import ResultsShowcase from "@/components/ResultsShowcase";
import Services from "@/components/Services";
import SocialProof from "@/components/SocialProof";
import GuaranteeSection from "@/components/GuaranteeSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustBar />
      <HowItWorksTeaser />
      <VSLSection />
      <ResultsShowcase />
      <Services />
      <SocialProof />
      <GuaranteeSection />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}
