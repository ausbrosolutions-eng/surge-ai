import { Container } from "@/components/ui/Container";

const SOURCES = [
  {
    label: "McKinsey, Nov 2025",
    note: "57% automation potential",
    href: "https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/the-economic-potential-of-generative-ai-the-next-productivity-frontier",
  },
  {
    label: "RIA Cost of Doing Business 2024",
    note: "38% overhead, 3.8% net profit",
    href: "https://www.restorationindustry.org/codb",
  },
  {
    label: "JobNimbus Peak Performance 2026",
    note: "Lead response benchmarks",
    href: "https://contractormarketingpros.net/blog/jobnimbus-peak-perfomance-2026-roofing-industry-data/",
  },
  {
    label: "ServiceTitan Industry Report 2025",
    note: "Contractor AI adoption",
    href: "https://www.servicetitan.com/press/residential-industry-report-2025",
  },
  {
    label: "One Claim Solution",
    note: "Restoration AR data",
    href: "https://www.oneclaimsolution.com/state-of-the-industry-report-2023-how-restoration-contractors-can-secure-payment-grow/",
  },
  {
    label: "Casey Response / HBR / Drift",
    note: "Lead leakage and 5-minute rule",
    href: "https://caseyresponse.com/blog/lead-response-time-statistics",
  },
  {
    label: "Time etc, 2025",
    note: "36% admin burden in small business",
    href: "https://www.timeetc.com/resources/how-to-achieve-more/the-big-price-of-small-tasks-how-entrepreneurs-may-be-unwittingly-keeping-their-businesses-small/",
  },
  {
    label: "OpenAI / Klarna",
    note: "2.3M conversations, 700 FTE equivalent",
    href: "https://openai.com/index/klarna/",
  },
  {
    label: "Allianz Project Nemo",
    note: "80% claim time reduction",
    href: "https://www.allianz.com/en/mediacenter/news/articles/251103-when-the-storm-clears-so-should-the-claim-queue.html",
  },
  {
    label: "Sedgwick Sidekick Plus",
    note: "98% doc accuracy in pilot",
    href: "https://www.sedgwick.com/blog/claims-and-ai-reimagining-the-experience-with-intelligent-automation/",
  },
  {
    label: "PYMNTS, 2026",
    note: "8% to 34% insurance AI adoption",
    href: "https://www.pymnts.com/artificial-intelligence-2/2026/ai-agents-are-now-running-the-back-office-at-insurance-giants/",
  },
  {
    label: "Sage SMB research, 2025",
    note: "5-day faster payment with automation",
    href: "https://www.sage.com/en-gb/company/digital-newsroom/2025/05/09/the-hidden-admin-burden-on-small-businesses/",
  },
  {
    label: "Roofing Contractor magazine",
    note: "AR aging compounding risk",
    href: "https://www.roofingcontractor.com/articles/101733-the-art-of-accounts-receivable",
  },
  {
    label: "JPMorgan COIN coverage",
    note: "360,000 lawyer hours saved",
    href: "https://www.abajournal.com/news/article/jpmorgan_chase_uses_tech_to_save_360000_hours_of_annual_work_by_lawyers_and",
  },
];

export function WorkflowsSources() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container>
        <div className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-ink-secondary">
          SOURCES
        </div>
        <h3 className="mt-6 text-xl md:text-2xl text-ink-primary font-medium leading-snug max-w-[600px]">
          Every number on this page is defensible. Click through to verify.
        </h3>

        <ul className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-4">
          {SOURCES.map((s, i) => (
            <li key={i} className="text-sm leading-relaxed flex gap-3">
              <span className="text-copper font-mono text-xs mt-[5px] shrink-0">
                /
              </span>
              <span>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-primary hover:text-copper transition-colors"
                >
                  {s.label}
                </a>
                <span className="text-ink-secondary"> &middot; </span>
                <span className="text-ink-secondary">{s.note}</span>
              </span>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
