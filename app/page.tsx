import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import VSLSection from "@/components/VSLSection";
import ResultsShowcase from "@/components/ResultsShowcase";
import ComparisonTable from "@/components/ComparisonTable";
import Services from "@/components/Services";
import GuaranteeSection from "@/components/GuaranteeSection";
import OfferLadder from "@/components/OfferLadder";
import SocialProof from "@/components/SocialProof";
import AboutSection from "@/components/AboutSection";
import FAQ from "@/components/FAQ";
import FreeTrialOffer from "@/components/FreeTrialOffer";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustBar />
      <ProblemSection />
      <HowItWorks />
      <VSLSection />
      <ResultsShowcase />
      <ComparisonTable />
      <Services />
      <GuaranteeSection />
      <OfferLadder />
      <SocialProof />
      <AboutSection />
      <FAQ />
      <FreeTrialOffer />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}
