import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section className="relative pt-32 pb-section md:pt-48 md:pb-section-lg overflow-hidden">
      {/* Cinematic background scene */}
      <Image
        src="/imagery/01-hero.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden
        className="object-cover object-right opacity-[0.35] pointer-events-none"
      />
      {/* Darkening gradient over image */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.7) 50%, rgba(10,10,10,0.4) 100%)",
        }}
      />
      {/* Atmospheric copper glow on top */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
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
            Or book a 30-min call
          </Button>
        </div>
      </Container>
    </section>
  );
}
