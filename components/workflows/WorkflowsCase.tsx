import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const BUILT = [
  "AR follow-up cadences across QuickBooks and ServiceTitan",
  "A supplement gap detection agent on every Xactimate estimate",
  "A voice agent on the main line for after-hours and overflow",
  "A Monday operations brief for the owner",
];

const CHANGED = [
  "Office manager&apos;s admin load dropped from roughly 30 hours a week to roughly 10",
  "The owner stopped doing the AR call himself on Friday afternoons",
  "Supplements that used to drop because nobody had time to chase them started getting filed within 48 hours of the carrier estimate landing",
  "The owner finally had a real picture of the business going into Monday",
];

export function WorkflowsCase() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container>
        <Eyebrow number="07">FROM THE FIELD</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary max-w-[900px]">
          What this looks like for a $5M restoration contractor in the Southwest.
        </h2>

        <div className="mt-12 max-w-[760px] space-y-6 text-lg text-ink-secondary leading-relaxed">
          <p>
            The owner had seven figures stuck in AR aging buckets past 60 days. Office manager was working 50-hour weeks, with an estimated 60 percent of that time going to repetitive admin: chasing carriers, retyping estimates, calling for late payments, fielding inbound leads that should have been booked the day they came in.
          </p>
        </div>

        <div className="mt-16 grid md:grid-cols-2 gap-x-16 gap-y-12">
          <div>
            <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
              WHAT WE BUILT
            </div>
            <ul className="mt-6 space-y-4">
              {BUILT.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-base text-ink-secondary leading-relaxed"
                >
                  <span className="text-copper font-mono text-xs mt-[7px] shrink-0">
                    /
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
              WHAT CHANGED IN 90 DAYS
            </div>
            <ul className="mt-6 space-y-4">
              {CHANGED.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-base text-ink-secondary leading-relaxed"
                >
                  <span className="text-copper font-mono text-xs mt-[7px] shrink-0">
                    /
                  </span>
                  <span dangerouslySetInnerHTML={{ __html: item }} />
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-16 max-w-[760px] text-lg text-ink-secondary leading-relaxed">
          The labor capacity recovered is the floor. The supplement and AR recovery is the ceiling. Both showed up.
        </p>
      </Container>
    </section>
  );
}
