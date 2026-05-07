import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const QUESTIONS = [
  {
    q: "How many open insurance claims do you carry on average?",
    a: "Multiply by your average ticket. Now multiply by 35 percent. That is your supplement gap exposure if your team isn&apos;t catching every line item.",
  },
  {
    q: "How many leads landed last month?",
    a: "Multiply by 73 percent. That is the cold pile. JobNimbus 2026 data shows the top performers respond in under 30 minutes. Most contractors take 4 to 6 hours.",
  },
  {
    q: "What&apos;s your average days-to-pay after a job is complete?",
    a: "Industry average DSO for construction is 60 to 90 days. Restoration runs longer. Per One Claim Solution, more than half of restoration contractors wait over 45 days for full payment.",
  },
  {
    q: "What does your office manager cost fully loaded?",
    a: "Base salary plus 30 to 40 percent for benefits, payroll taxes, PTO, and workers comp. For a roofing or restoration firm that&apos;s typically $80,000 to $95,000.",
  },
];

export function WorkflowsMath() {
  return (
    <section
      id="walk-the-math"
      className="py-section md:py-section-lg border-t border-white/[0.04]"
    >
      <Container size="narrow">
        <Eyebrow number="03">RUN YOUR OWN NUMBERS</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary">
          Pull out your last twelve months. Answer four questions.
        </h2>

        <div className="mt-16 space-y-12">
          {QUESTIONS.map((item, i) => (
            <div
              key={i}
              className="border-l-2 border-copper/30 pl-8 hover:border-copper transition-colors"
            >
              <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
                Q{String(i + 1).padStart(2, "0")}
              </div>
              <h3
                className="mt-3 text-xl md:text-2xl text-ink-primary font-medium leading-snug"
                dangerouslySetInnerHTML={{ __html: item.q }}
              />
              <p
                className="mt-4 text-base text-ink-secondary leading-relaxed"
                dangerouslySetInnerHTML={{ __html: item.a }}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 pt-10 border-t border-white/[0.04] space-y-6 text-lg text-ink-secondary leading-relaxed">
          <p>
            Add the four numbers. That is what the current admin model costs you per year, conservatively. The number is almost always larger than the contractor expected.
          </p>
          <p>
            <span className="text-ink-primary">RIA&apos;s own data on the industry:</span>{" "}
            average overhead 38 percent of gross revenue, average net profit before taxes 3.8 percent, and more than one-third of restoration companies are breaking even or losing money. A two-percentage-point swing on profit recovery is the difference between a healthy year and a bad one.
          </p>
        </div>
      </Container>
    </section>
  );
}
