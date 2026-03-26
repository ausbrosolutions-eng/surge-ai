import Navbar from "@/components/Navbar";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "How It Works — Surge AI",
  description: "The 3-step process from free snapshot to a fully custom revenue blueprint for your home service business.",
};

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#0A1628]">
      <Navbar />
      <div className="pt-24 pb-4 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white/70 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Home
        </Link>
      </div>
      <HowItWorks />
      <Footer />
    </main>
  );
}
