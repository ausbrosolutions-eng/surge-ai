"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "How It Works", href: "/how-it-works" },
  { label: "Results", href: "#results" },
  { label: "Pricing", href: "#services" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
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
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled || !isHomePage
            ? "bg-[#0A1628]/95 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-[#00D4C8] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Waves className="w-4 h-4 text-[#0A1628]" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Surge{" "}
                <span className="text-[#00D4C8] font-semibold">AI</span>
              </span>
            </a>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors duration-200 relative group"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#00D4C8] group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-xs text-white/30 font-medium">
                214 contractors served
              </span>
              <a
                href="#contact"
                className="px-5 py-2.5 rounded-lg bg-[#FF6B47] hover:bg-[#FF8B6B] text-white text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-[#FF6B47]/30 hover:-translate-y-0.5"
              >
                Get Free Snapshot
              </a>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 bg-[#0A1628]/98 backdrop-blur-md border-b border-white/10 md:hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-base font-medium text-white/80 hover:text-white py-2 border-b border-white/10 transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#contact"
                onClick={() => setIsMobileOpen(false)}
                className="mt-2 w-full text-center px-5 py-3 rounded-lg bg-[#FF6B47] hover:bg-[#FF8B6B] text-white font-semibold transition-colors"
              >
                Get Your Free Blueprint Snapshot
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
