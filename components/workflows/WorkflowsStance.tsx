import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PILLARS = [
  {
    label: "CLOUD TO DIRT",
    body: "I have spent the last decade running revenue strategy at a venture-backed fintech and shipping production code at the same time. I also know what an Xactimate scope of loss looks like, what a 60-day AR aging bucket feels like, and what a roofer means when they say a supplement got stuck at 5.0. Most AI vendors only have one of those layers. The work needs both.",
  },
  {
    label: "FOUNDATION FIRST",
    body: "Every workflow starts with the same exercise. Twelve rules the agent cannot break. Sixteen sample outputs that define what good looks like. A feedback loop that runs 100 cycles in 100 minutes instead of 100 weeks. We do that work before any code ships. Most AI deployments fail because they skip it.",
  },
  {
    label: "INSIDE YOUR STACK",
    body: "I do not ask you to rip out ServiceTitan, JobNimbus, Xactimate, CompanyCam, QuickBooks, or your CRM. I build agents that sit on top of what you already use, take the rote work, and hand the results back where your team already looks. The team&apos;s day-to-day workflow does not change. The output volume does.",
  },
];

export function WorkflowsStance() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container>
        <Eyebrow number="06">WHY ME, NOT A GENERIC AI VENDOR</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary max-w-[900px]">
          Most AI consultants ship demos.
          <br />
          <span className="text-copper">I ship workflows that survive Tuesday.</span>
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-x-12 gap-y-10">
          {PILLARS.map((p) => (
            <div key={p.label}>
              <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
                {p.label}
              </div>
              <p
                className="mt-4 text-base text-ink-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: p.body }}
              />
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-white/[0.04]">
          <div className="font-mono uppercase tracking-[0.16em] text-[11px] text-ink-secondary">
            AUSTIN BROOKS, FOUNDER, SURGE ADVISORY. MESA, AZ.
          </div>
        </div>
      </Container>
    </section>
  );
}
