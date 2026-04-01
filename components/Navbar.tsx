"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navLinks = [
  { label: "Results", href: "#results" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing", href: "#services" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          isScrolled || !isHomePage
            ? "bg-[#111111] border-b border-[#2A2520]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px]">
            <a href="/" className="flex items-center">
              <span className="font-display text-xl font-bold tracking-[0.03em] uppercase copper-text">
                Surge
              </span>
            </a>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="font-display text-[16px] font-medium tracking-[0.06em] uppercase text-[#E8E2D8] hover:text-[#B87333] transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="hidden md:block">
              <a
                href="#contact"
                className="inline-flex items-center px-6 py-2.5 border-2 border-[#B87333] text-[#E8E2D8] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] hover:bg-[#B87333] hover:text-[#0A0A0A] transition-all duration-200"
              >
                Get Free Snapshot
              </a>
            </div>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 text-[#E8E2D8] hover:text-[#B87333] transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A] md:hidden">
          <div className="pt-20 px-6 flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileOpen(false)}
                className="font-display text-2xl font-bold tracking-[0.03em] uppercase text-[#E8E2D8] hover:text-[#B87333] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileOpen(false)}
              className="mt-4 w-full text-center py-4 border-2 border-[#B87333] text-[#E8E2D8] font-display text-base font-semibold tracking-[0.1em] uppercase rounded-[2px] hover:bg-[#B87333] hover:text-[#0A0A0A] transition-all duration-200"
            >
              Get Your Free Snapshot
            </a>
          </div>
        </div>
      )}
    </>
  );
}
