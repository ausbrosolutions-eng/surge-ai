import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import ResultsShowcase from "@/components/ResultsShowcase";
import ComparisonTable from "@/components/ComparisonTable";
import Services from "@/components/Services";
import GuaranteeSection from "@/components/GuaranteeSection";
import SocialProof from "@/components/SocialProof";
import AboutSection from "@/components/AboutSection";
import FAQ from "@/components/FAQ";
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
      <ResultsShowcase />
      <ComparisonTable />
      <Services />
      <GuaranteeSection />
      <SocialProof />
      <AboutSection />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}
