import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

const WORKFLOWS = [
  {
    label: "ESTIMATE DRAFTING",
    body: "AI drafts the estimate from notes; office manager reviews and sends in 90 seconds.",
  },
  {
    label: "FOLLOW-UP CADENCES",
    body: "Every estimate gets a 7-touch sequence whether or not your team has time.",
  },
  {
    label: "QUALITY SCORING",
    body: "Every job auto-scored on completion data; flags problems before reviews go bad.",
  },
  {
    label: "DAILY REPORTS",
    body: "Owner gets a Monday-morning operations brief; no spreadsheets to assemble.",
  },
  {
    label: "LEAD INTAKE",
    body: "Inbound calls and form fills auto-routed, qualified, and scheduled.",
  },
];

export function WorkflowsFeatured() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container>
        <Eyebrow number="03">WORKFLOW BUILDS</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary max-w-[800px]">
          We build AI workflows where your team already works.
        </h2>

        <div className="mt-16 grid md:grid-cols-2 gap-x-12 gap-y-10">
          {WORKFLOWS.map((wf) => (
            <div key={wf.label}>
              <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
                {wf.label}
              </div>
              <p className="mt-3 text-base text-ink-secondary leading-relaxed">
                {wf.body}
              </p>
            </div>
          ))}
        </div>

        {/* Cinematic supporting image: roofer with tablet, Phoenix skyline */}
        <div className="mt-16 relative aspect-[16/9] w-full overflow-hidden rounded-sm">
          <Image
            src="/imagery/03-workflows.jpg"
            alt="Home service technician using an AI-drafted estimate workflow on a tablet, on a residential roof in Phoenix at sunset"
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
          <Button href="/workflows" variant="primary">
            See workflow build deep dive &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
