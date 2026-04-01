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
