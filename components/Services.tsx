const tiers = [
  {
    name: "Surge Ops Audit",
    tagline: "Start here. Find the money before committing to the build.",
    price: "$3,500",
    period: "one-time",
    description: "A 2-week data audit of your restoration business. We identify stuck revenue, documentation gaps, and the 90-day roadmap to fix them. Refundable if we can't find $150K in recoverable revenue.",
    features: "90-min kickoff call, full pipeline audit, collections exposure analysis, documentation gap report, tech stack evaluation, 20-page branded report, 60-min review call, credits toward retainer if you move forward",
    popular: true,
  },
  {
    name: "Phase 1: Foundation",
    tagline: "Months 1-3 implementation.",
    price: "$6,500",
    period: "/month",
    description: "The intensive build period. Required field enforcement, first automations live, core integrations deployed, team training begins.",
    features: "Weekly strategy calls, tech stack setup or platform migration lead, collection SMS sequence live, document keyword check automated, Encircle and/or CRM migration kickoff, first revenue recovery underway",
    popular: false,
  },
  {
    name: "Phase 2: Build-Out",
    tagline: "Months 4-6 implementation.",
    price: "$5,000",
    period: "/month",
    description: "The full automation suite deployed. Team trained. Reporting live. Customer comms automated.",
    features: "Bi-weekly strategy calls, full automation suite built, customer milestone SMS live, reporting dashboards delivered, AI estimate writing pilot, carrier portal automations, team training complete",
    popular: false,
  },
  {
    name: "Phase 3: Optimization",
    tagline: "Month 7+ ongoing partnership.",
    price: "$3,500",
    period: "/month",
    description: "Ongoing maintenance, performance tuning, new feature builds. Surge stays in the room as your fractional CTO.",
    features: "Monthly strategy call, ongoing automation maintenance, new feature builds as needed, on-call support for owners and ops leads, quarterly business review",
    popular: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-[#0A0A0A] noise-texture">
      <span id="audit" className="absolute -top-20" aria-hidden="true" />
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
          Pricing
        </p>
        <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-4">
          Start with the Audit
        </h2>
        <p className="font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] mb-16 max-w-xl">
          No retainer commitment until we&rsquo;ve shown you the data. The Audit is yours regardless of what comes next. If we can&rsquo;t find $150K in recoverable revenue, you get the $3,500 back.
        </p>

        <div className="space-y-0">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`border-b border-[#2A2520] py-10 ${
                tier.popular ? "border-l-4 border-l-[#B87333] pl-8" : "pl-0"
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
                <div className="lg:w-[70%]">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-2xl sm:text-[32px] font-bold tracking-[0.03em] uppercase text-[#E8E2D8]">
                      {tier.name}
                    </h3>
                    {tier.popular && (
                      <span className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333]">
                        Most Popular
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-sm font-light text-[#9A9086] mb-3">{tier.tagline}</p>
                  <p className="font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] leading-relaxed mb-4">
                    {tier.description}
                  </p>
                  <p className="font-sans text-sm font-light text-[#5A5550] leading-relaxed">{tier.features}</p>
                </div>

                <div className="lg:w-[30%] lg:text-right flex flex-col items-start lg:items-end gap-4">
                  <div>
                    <span className="font-display text-[40px] font-extrabold leading-none tracking-[0.02em] text-[#E8E2D8]">
                      {tier.price}
                    </span>
                    <span className="font-sans text-sm font-light text-[#5A5550] ml-1">{tier.period}</span>
                  </div>
                  <a
                    href="#contact"
                    className={`inline-flex items-center px-8 py-3 font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] transition-all duration-200 ${
                      tier.popular
                        ? "bg-[#B87333] text-[#0A0A0A] hover:bg-[#D4956A]"
                        : "border-2 border-[#2A2520] text-[#E8E2D8] hover:border-[#E8E2D8]"
                    }`}
                  >
                    {tier.popular ? "Get Started" : "Learn More"}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 font-sans text-sm font-light text-[#5A5550]">
          Using JobNimbus, Albi, Xcelerate, PSA, or Encircle? We work natively on every restoration stack. Audit first. Retainer second. Never the other way around.
        </p>
      </div>
    </section>
  );
}
