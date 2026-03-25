"use client";

import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-[#0A1628] border-t border-white/10 px-4 pb-safe pt-3 pb-4 shadow-2xl">
        <p className="text-center text-xs text-white/40 mb-2.5">
          No credit card &middot; Ready in 60 sec
        </p>
        <a
          href="#contact"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-[#FF6B47] hover:bg-[#FF8B6B] text-white font-bold text-sm transition-colors"
        >
          Get Your Free Snapshot
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
