import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const PILLARS = [
  {
    label: "STRATEGY AND EXECUTION",
    body: "Most agencies hand you a strategy deck and disappear. Surge ships the workflows behind the strategy. Same hands, same session.",
  },
  {
    label: "PRODUCTIZED METHODOLOGY",
    body: "Every engagement runs the same system. No bespoke chaos. No starting from zero.",
  },
  {
    label: "BUILT FOR HOME SERVICE",
    body: "Every workflow, every cadence, every benchmark is calibrated to home service operations specifically. Generalist agencies cannot match this.",
  },
];

export function Stance() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container>
        <Eyebrow number="07">STANCE</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary">
          Why this works.
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-x-12 gap-y-10">
          {PILLARS.map((p) => (
            <div key={p.label}>
              <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
                {p.label}
              </div>
              <p className="mt-4 text-base text-ink-secondary leading-relaxed">
                {p.body}
              </p>
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
