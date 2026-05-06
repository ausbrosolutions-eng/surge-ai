"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Wordmark } from "@/components/brand/Wordmark";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/workflows", label: "WORKFLOWS" },
  { href: "/marketing", label: "MARKETING" },
  { href: "/method", label: "METHOD" },
  { href: "/about", label: "ABOUT" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          scrolled
            ? "bg-page/90 backdrop-blur-md border-b border-white/[0.04]"
            : "bg-transparent"
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" aria-label="Surge Advisory home">
              <Wordmark size="md" />
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <ul className="flex items-center gap-8">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-mono uppercase tracking-[0.04em] text-xs text-ink-secondary hover:text-copper transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Button href="/snapshot" variant="tertiary">
                GET SNAPSHOT &rarr;
              </Button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-ink-primary"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </Container>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-page md:hidden">
          <Container>
            <div className="flex items-center justify-between h-16">
              <Wordmark size="md" />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="text-ink-primary"
              >
                <X size={24} />
              </button>
            </div>
            <ul className="flex flex-col gap-6 mt-12">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-mono uppercase tracking-[0.04em] text-base text-ink-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-12">
              <Button href="/snapshot" variant="primary">
                Get your free Snapshot &rarr;
              </Button>
            </div>
          </Container>
        </div>
      )}
    </>
  );
}
