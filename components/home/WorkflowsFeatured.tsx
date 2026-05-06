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

        <div className="mt-16">
          <Button href="/workflows" variant="primary">
            See workflow build deep dive &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
