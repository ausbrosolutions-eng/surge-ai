import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PROOF = [
  {
    label: "KLARNA",
    body: "Customer service agent handled 2.3 million conversations in its first month, the equivalent of 700 full-time agents, on track for $40 million in annual profit improvement.",
  },
  {
    label: "JPMORGAN COIN",
    body: "Reviews contracts in seconds that previously consumed 360,000 lawyer hours per year.",
  },
  {
    label: "ALLIANZ PROJECT NEMO",
    body: "First agentic AI claim system cut processing time by 80 percent.",
  },
];

export function WorkflowsWhyNow() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container size="narrow">
        <Eyebrow number="05">THE WINDOW</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary">
          The contractors building this in 2026 buy the next decade of advantage.
        </h2>

        <div className="mt-12 space-y-8 text-lg text-ink-secondary leading-relaxed">
          <p>
            <span className="text-ink-primary">McKinsey, November 2025.</span>{" "}
            Fifty-seven percent of US work hours can be automated with technology that exists today. AI agents handle 44 percent of that on their own. Roles concentrated in administrative work face the highest automation potential of any category McKinsey measured.
          </p>
          <p>
            <span className="text-ink-primary">Insurance, year over year.</span>{" "}
            AI adoption among major carriers jumped from 8 percent in 2024 to 34 percent in 2025. The carriers your customers buy from are running this playbook on themselves. The contractors who match them on the response side are the ones who close.
          </p>
          <p>
            <span className="text-ink-primary">ServiceTitan benchmark.</span>{" "}
            AI adoption among home service contractors more than doubled in 2025, hitting 38 percent. The other 62 percent will follow within 24 months. The advantage compounds for whoever moves first.
          </p>
        </div>
      </Container>

      <Container className="mt-20">
        <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-ink-secondary">
          CROSS-INDUSTRY PROOF
        </div>
        <div className="mt-8 grid md:grid-cols-3 gap-x-12 gap-y-10">
          {PROOF.map((p) => (
            <div key={p.label}>
              <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
                {p.label}
              </div>
              <p className="mt-3 text-base text-ink-secondary leading-relaxed">
                {p.body}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-16 text-lg text-ink-secondary leading-relaxed max-w-[760px]">
          The pattern is the same in every category. The rote work moves to the agent. The human moves to higher leverage. The margin shows up in the operator&apos;s pocket.
        </p>
      </Container>
    </section>
  );
}
