import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

const BUILDS = [
  {
    n: "01",
    label: "INSURANCE CARRIER + SUPPLEMENT GAP",
    title: "Catch the line items the adjuster missed.",
    body: "The agent reads every Xactimate estimate that comes back from a carrier, compares it line-by-line against your scope and photo documentation, and flags the items the adjuster missed. Your office manager reviews and submits supplements with documentation in 90 seconds, not 90 minutes.",
    stack: "Xactimate / CompanyCam / ServiceTitan or JobNimbus",
    proof: "Allianz reported an 80 percent reduction in claim processing time using agentic AI. Sedgwick&apos;s Sidekick Plus pilot processed 50,000 claim documents at over 98 percent accuracy.",
  },
  {
    n: "02",
    label: "LEAD INTAKE",
    title: "Thirty-second response. Twenty-four seven.",
    body: "A voice agent answers every inbound call, qualifies, captures details, books to your dispatch calendar, and texts the homeowner a confirmation. Your team gets a clean booked job, not a voicemail to chase later.",
    stack: "CallRail / ServiceTitan / your CRM",
    proof: "Seventy-eight percent of buyers choose the first contractor who calls them back. Top performers in the JobNimbus 2026 benchmark respond in under 30 minutes. Most contractors take 4 to 6 hours and lose the job before they ever quote it.",
  },
  {
    n: "03",
    label: "AR FOLLOW-UP",
    title: "Cadences that don&apos;t depend on your office manager remembering.",
    body: "Every invoice gets an automated cadence: 7-day check-in, 14-day reminder, 30-day escalation, 45-day call task created for a human. The agent reads payment status from your accounting system and stops the cadence the moment money lands.",
    stack: "QuickBooks Online / ServiceTitan / Stripe or your processor",
    proof: "Once an account goes 60 days past due, there&apos;s a 62 percent chance it happens again. Two-thirds of past-60 accounts hit 90 days. Sage research shows automated payment reminders move payment up by 5 days on average.",
  },
  {
    n: "04",
    label: "ESTIMATE DRAFTING",
    title: "From walk-through photos to draft estimate in two minutes.",
    body: "Field tech walks the property with CompanyCam. The agent ingests the photos, your job notes, and supplier pricing, and produces a draft estimate in the format your office manager already sends. Office manager reviews, edits if needed, and sends in under two minutes.",
    stack: "CompanyCam / Hover / Xactimate / your accounting system",
    proof: "The estimating step is where most contractors lose 5 to 10 hours per estimator per week. Senior estimators bill out at $80 plus per hour loaded. The pure labor recovery on this one workflow is six figures per year for a mid-sized firm.",
  },
  {
    n: "05",
    label: "DAILY OPERATIONS BRIEF",
    title: "Monday morning. One screen. No spreadsheets.",
    body: "Every Monday at 6 AM, the owner gets a one-screen email: open claims by stage, AR aging buckets, lead source performance for the week prior, dispatch utilization, supplements pending. The data lives in your existing systems. The agent assembles the picture.",
    stack: "Whatever you already use. We integrate, we don&apos;t replace.",
    proof: "Most owners are running blind on these numbers between monthly closes. The cost of running blind is decisions made on yesterday&apos;s gut feel, not this morning&apos;s facts.",
  },
];

export function WorkflowsBuilds() {
  return (
    <section
      id="workflow-builds"
      className="py-section md:py-section-lg border-t border-white/[0.04]"
    >
      <Container>
        <Eyebrow number="04">WHAT WE BUILD</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary max-w-[900px]">
          Five agent builds we deploy on day one.
        </h2>

        <div className="mt-16 space-y-16 md:space-y-20">
          {BUILDS.map((b) => (
            <div
              key={b.n}
              className="grid md:grid-cols-12 gap-x-12 gap-y-6 pb-12 border-b border-white/[0.04] last:border-b-0"
            >
              <div className="md:col-span-3">
                <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium">
                  <span className="text-ink-secondary">{b.n} / </span>
                  <span className="text-copper">{b.label}</span>
                </div>
              </div>

              <div className="md:col-span-9 space-y-6">
                <h3
                  className="text-2xl md:text-3xl text-ink-primary font-medium leading-snug max-w-[640px]"
                  dangerouslySetInnerHTML={{ __html: b.title }}
                />
                <p
                  className="text-base text-ink-secondary leading-relaxed max-w-[680px]"
                  dangerouslySetInnerHTML={{ __html: b.body }}
                />

                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  <div>
                    <div className="font-mono uppercase tracking-[0.16em] text-[10px] font-medium text-ink-secondary">
                      STACK
                    </div>
                    <p
                      className="mt-2 text-sm text-ink-primary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: b.stack }}
                    />
                  </div>
                  <div>
                    <div className="font-mono uppercase tracking-[0.16em] text-[10px] font-medium text-ink-secondary">
                      WHY IT MATTERS
                    </div>
                    <p
                      className="mt-2 text-sm text-ink-secondary leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: b.proof }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
