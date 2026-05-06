import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

const SERVICES = [
  {
    label: "GOOGLE BUSINESS PROFILE",
    body: "Posts, photos, questions and answers, review cadence. Daily presence, weekly rank gains.",
  },
  {
    label: "AI SEARCH OPTIMIZATION",
    body: "ChatGPT, Copilot, Google AI Overviews. The searches Google cannot show you in Search Console.",
  },
  {
    label: "REVIEW SYSTEMS",
    body: "Text-triggered review requests, response automation, reputation monitoring.",
  },
  {
    label: "ATTRIBUTION",
    body: "Call tracking, Google Analytics, ad-spend-to-job tracking. Every dollar in maps to a dollar out.",
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

        {/* Cinematic supporting image: pool service technician with branded truck */}
        <div className="mt-16 relative aspect-[16/9] w-full overflow-hidden rounded-sm">
          <Image
            src="/imagery/04-marketing.jpg"
            alt="Pool service technician walking to a residential pool with a branded service truck visible in the driveway"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0) 50%)",
            }}
          />
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
