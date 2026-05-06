import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-section md:pt-48 md:pb-section-lg overflow-hidden">
      {/* Atmospheric copper glow */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-100 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 75% 15%, rgba(184,115,51,0.08) 0%, rgba(10,10,10,0) 60%)",
        }}
      />

      <Container className="relative">
        <Eyebrow number="01">OPERATING SYSTEM FOR HOME SERVICE BUSINESSES</Eyebrow>

        <h1 className="mt-8 text-display-lg md:text-display-xl text-ink-primary max-w-[1000px]">
          Your team is buried in admin work.
          <br />
          <span className="text-copper">We dig them out.</span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-ink-secondary leading-relaxed max-w-[560px]">
          Surge installs AI workflows that automate the back-office work eating your team&apos;s day, then turns on the marketing infrastructure to fill the pipeline they can finally answer.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:items-center">
          <Button href="/snapshot" variant="primary">
            Get your free Snapshot &rarr;
          </Button>
          <Button href="/snapshot#book" variant="secondary">
            Or book a 30-min call
          </Button>
        </div>
      </Container>
    </section>
  );
}
