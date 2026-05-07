import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const STATS = [
  {
    value: "16 hrs/wk",
    label: "ADMIN LOAD",
    body: "Hours an office manager absorbs in a typical week. Thirty-six percent of a 45-hour week, repeated across the year.",
  },
  {
    value: "35 to 50%",
    label: "SUPPLEMENT GAP",
    body: "How much most insurance scope-of-loss documents underbill the actual repair. Industry estimates across restoration vendors.",
  },
  {
    value: "73%",
    label: "LEADS GONE COLD",
    body: "Inbound leads that never get contacted. Slow follow-up, voicemail, the call that came in at 7 PM nobody returned.",
  },
];

export function WorkflowsLeak() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container>
        <Eyebrow number="02">WHAT THIS COSTS YOU</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary max-w-[800px]">
          Three numbers most contractors haven&apos;t done the math on.
        </h2>

        <div className="mt-16 grid md:grid-cols-3 gap-x-12 gap-y-12">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="text-display-md md:text-display-lg text-copper font-semibold leading-none">
                {s.value}
              </div>
              <div className="mt-4 font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-ink-primary">
                {s.label}
              </div>
              <p className="mt-3 text-base text-ink-secondary leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-20 pt-10 border-t border-white/[0.04] max-w-[760px] space-y-6 text-lg text-ink-secondary leading-relaxed">
          <p>
            The math runs in one direction. A $5M restoration contractor doing $1M in insurance work per year and missing 30 percent of supplements is leaving $100,000 to $150,000 on the table annually.
          </p>
          <p>
            The same contractor is paying an office manager $80,000 to $95,000 fully loaded to do work that AI agents now handle in seconds. That is not a tooling problem. That is a margin problem.
          </p>
        </div>
      </Container>
    </section>
  );
}
