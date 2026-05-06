import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="relative py-section-lg md:py-section-lg overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(184,115,51,0.06) 0%, rgba(10,10,10,0) 70%)",
        }}
      />

      <Container size="narrow" className="relative text-center">
        <h2 className="text-display-md md:text-display-lg text-ink-primary">
          See where you&apos;re losing time and revenue.
        </h2>

        <p className="mt-6 text-lg text-ink-secondary leading-relaxed max-w-[560px] mx-auto">
          5-minute intake. Personalized Surge Snapshot in your inbox in under 10 minutes.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center sm:justify-center">
          <Button href="/snapshot" variant="primary">
            Get your free Snapshot &rarr;
          </Button>
          <Button href="/snapshot#book" variant="secondary">
            Or book a 30-min call &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
