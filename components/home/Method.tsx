import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

const STEPS = [
  {
    label: "SNAPSHOT",
    body: "Free 5-minute intake. Personalized brief in your inbox in 10 minutes.",
  },
  {
    label: "WORKFLOW BUILDS",
    body: "We install the AI workflows that give your team their day back.",
  },
  {
    label: "MARKETING INFRASTRUCTURE",
    body: "We turn on the lead engine they can finally answer.",
  },
];

export function Method() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container>
        <Eyebrow number="05">METHOD</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary max-w-[800px]">
          Fix the back-office. Then turn on the lead engine.
        </h2>

        <div className="mt-16 relative">
          {/* Desktop horizontal connecting line */}
          <div
            aria-hidden
            className="hidden md:block absolute top-6 left-[16%] right-[16%] h-px bg-copper/30"
          />

          <div className="grid md:grid-cols-3 gap-12 relative">
            {STEPS.map((step, i) => (
              <div key={step.label} className="relative">
                {/* Step number badge */}
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-page border-2 border-copper text-copper font-mono font-medium text-sm relative z-10">
                  0{i + 1}
                </div>
                <div className="mt-6 font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
                  {step.label}
                </div>
                <p className="mt-3 text-base text-ink-secondary leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <Button href="/method" variant="primary">
            See the full method &rarr;
          </Button>
        </div>
      </Container>
    </section>
  );
}
