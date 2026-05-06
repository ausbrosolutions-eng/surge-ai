import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

const SERVICES = [
  {
    label: "LOCAL SEO",
    body: "Service area pages, schema, citations, technical foundation.",
  },
  {
    label: "GOOGLE BUSINESS PROFILE",
    body: "Posts, photos, Q&A, review cadence. Daily presence, weekly rank gains.",
  },
  {
    label: "AI SEARCH OPTIMIZATION",
    body: "ChatGPT, Copilot, Google AI Overviews. The searches Google can't show you in Search Console.",
  },
  {
    label: "REVIEW SYSTEMS",
    body: "SMS-triggered review requests, response automation, reputation monitoring.",
  },
  {
    label: "ATTRIBUTION",
    body: "CallRail, GA4, ad-spend-to-job tracking. Every dollar in maps to a dollar out.",
  },
];

export function MarketingFeatured() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container>
        <Eyebrow number="04">MARKETING INFRASTRUCTURE</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary max-w-[800px]">
          We make you findable on every search Google and AI run.
        </h2>

        <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-10">
          {SERVICES.map((s) => (
            <div key={s.label}>
              <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
                {s.label}
              </div>
              <p className="mt-3 text-base text-ink-secondary leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-16">
          <Button href="/marketing" variant="primary">
            See marketing infrastructure deep dive &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
