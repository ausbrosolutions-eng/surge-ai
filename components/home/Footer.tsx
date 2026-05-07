import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Wordmark } from "@/components/brand/Wordmark";

const SITEMAP_LINKS = [
  { href: "/workflows", label: "WORKFLOWS" },
  { href: "/marketing", label: "MARKETING" },
  { href: "/method", label: "METHOD" },
  { href: "/about", label: "ABOUT" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] py-16 md:py-20">
      <Container>
        <div className="grid md:grid-cols-3 gap-12 md:gap-8">
          <div>
            <Wordmark size="md" />
            <p className="mt-6 font-mono uppercase tracking-[0.16em] text-[11px] text-ink-secondary leading-relaxed">
              OPERATING SYSTEM FOR HOME SERVICE BUSINESSES
            </p>
          </div>

          <div>
            <div className="font-mono uppercase tracking-[0.16em] text-[11px] text-ink-secondary mb-6">
              SITEMAP
            </div>
            <ul className="space-y-3">
              {SITEMAP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-mono uppercase tracking-[0.04em] text-xs text-ink-primary hover:text-copper transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono uppercase tracking-[0.16em] text-[11px] text-ink-secondary mb-6">
              CONTACT
            </div>
            <ul className="space-y-3 text-sm text-ink-primary">
              <li>
                <a
                  href="mailto:austin@surgeadvisory.co"
                  className="hover:text-copper transition-colors"
                >
                  austin@surgeadvisory.co
                </a>
              </li>
              <li>
                <a
                  href="tel:+14806521992"
                  className="hover:text-copper transition-colors"
                >
                  (480) 652-1992
                </a>
              </li>
              <li className="text-ink-secondary">Mesa, AZ</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between gap-4">
          <div className="font-mono uppercase tracking-[0.16em] text-[10px] text-ink-secondary">
            &copy; 2026 SURGE ADVISORY LLC
          </div>
        </div>
      </Container>
    </footer>
  );
}
