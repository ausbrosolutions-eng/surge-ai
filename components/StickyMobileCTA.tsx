"use client";

import { useState, useEffect } from "react";

export default function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-[#111111] border-t border-[#2A2520] px-4 pt-3 pb-4">
        <a
          href="#contact"
          className="flex items-center justify-center w-full py-4 bg-[#B87333] hover:bg-[#D4956A] text-[#0A0A0A] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-colors"
        >
          Get Your Free Snapshot
        </a>
      </div>
    </div>
  );
}
