import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function WorkflowsFinalCTA() {
  return (
    <section className="relative py-section md:py-section-lg overflow-hidden">
      <Image
        src="/imagery/06-final-cta.jpg"
        alt=""
        fill
        sizes="100vw"
        aria-hidden
        className="object-cover object-center opacity-[0.18] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.6) 50%, rgba(10,10,10,0.85) 100%)",
        }}
      />
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
          Stop subsidizing the admin tax.
        </h2>

        <p className="mt-6 text-lg text-ink-secondary leading-relaxed max-w-[600px] mx-auto">
          The work eating your office is work AI agents do well. The 16 hours a week we move back to revenue is what compounds into the next year of growth.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:items-center sm:justify-center">
          <Button
            href="mailto:austin@surgeadvisory.co?subject=Workflow%20Build%20Walk-Through&body=Hi%20Austin%2C%0A%0AI%27d%20like%20to%20book%20a%2030-minute%20walk-through%20about%20building%20AI%20workflows%20into%20our%20operation.%0A%0A-%20Business%20name%3A%20%0A-%20Trade%3A%20%0A-%20Approximate%20revenue%3A%20%0A-%20Biggest%20admin%20leak%3A%20%0A-%20Best%20times%3A%20%0A%0AThanks"
            variant="primary"
          >
            Book the walk-through &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
