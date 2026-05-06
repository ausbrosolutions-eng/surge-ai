import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function FinalCTA() {
  return (
    <section className="relative py-section md:py-section-lg overflow-hidden">
      {/* Subtle background scene: hands typing into intake form */}
      <Image
        src="/imagery/06-final-cta.jpg"
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className="object-cover object-center opacity-[0.18] pointer-events-none"
      />
      {/* Darkening overlay so type stays readable */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.85) 100%)",
        }}
      />
      {/* Atmospheric copper glow on top */}
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
          <Button
            href="mailto:austin@surgeadvisory.co?subject=Surge%20Snapshot%20Request&body=Hi%20Austin%2C%0A%0AI%27d%20like%20a%20Surge%20Snapshot%20for%20my%20home%20service%20business.%0A%0A-%20Business%20name%3A%20%0A-%20Trade%3A%20%0A-%20Website%3A%20%0A-%20Biggest%20operational%20pain%3A%20%0A%0AThanks"
            variant="primary"
          >
            Get your free Snapshot &rarr;
          </Button>
          <Button
            href="mailto:austin@surgeadvisory.co?subject=Surge%20Strategy%20Call&body=Hi%20Austin%2C%0A%0AI%27d%20like%20to%20book%20a%2030-min%20call%20about%20my%20home%20service%20business.%0A%0A-%20Business%20name%3A%20%0A-%20Trade%3A%20%0A-%20Best%20times%3A%20%0A%0AThanks"
            variant="secondary"
          >
            Or book a 30-min call &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
