import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function WorkflowsHero() {
  return (
    <section className="relative pt-32 pb-section md:pt-48 md:pb-section-lg overflow-hidden">
      <Image
        src="/imagery/03-workflows.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        aria-hidden
        className="object-cover object-right opacity-[0.30] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.75) 50%, rgba(10,10,10,0.4) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 75% 15%, rgba(184,115,51,0.08) 0%, rgba(10,10,10,0) 60%)",
        }}
      />

      <Container className="relative">
        <Eyebrow number="01">WORKFLOW BUILDS</Eyebrow>

        <h1 className="mt-8 text-display-lg md:text-display-xl text-ink-primary max-w-[1000px]">
          Your office manager is losing 16 hours a week to admin.
          <br />
          <span className="text-copper">We move that time back to revenue.</span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-ink-secondary leading-relaxed max-w-[640px]">
          Roofing and restoration contractors are leaking 35 to 50 percent of every insurance claim, 73 percent of inbound leads, and one full workday a week per admin seat. The work that&apos;s eating the office is the work AI agents do well. We build the agents into the stack you already use.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:items-center">
          <Button
            href="#walk-the-math"
            variant="primary"
          >
            Walk through the math &rarr;
          </Button>
          <Button
            href="#workflow-builds"
            variant="secondary"
          >
            See an example build
          </Button>
        </div>
      </Container>
    </section>
  );
}
