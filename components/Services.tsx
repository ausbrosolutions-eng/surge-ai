const tiers = [
  {
    name: "The Blueprint",
    tagline: "Start here. Most owners never need more.",
    price: "$499",
    period: "one-time",
    description: "Your fully custom growth roadmap. Built in 48 hours around your trade, market, and revenue goal.",
    features: "15-min intake, full gap assessment, market data, competitor breakdown, 9 channels ranked by ROI, 90-day action plan, 60-min review call",
    popular: false,
  },
  {
    name: "Done With You",
    tagline: "You execute. We guide.",
    price: "$1,500",
    period: "/month",
    description: "The Blueprint plus a strategic partner. Monthly calls, unlimited async support, and content on demand.",
    features: "Everything in The Blueprint (refreshed quarterly), monthly strategy call, unlimited async support, performance review, AI-generated content, review request templates, month-to-month",
    popular: true,
  },
  {
    name: "Done For You",
    tagline: "We run it. You run the business.",
    price: "From $3,500",
    period: "/month",
    description: "Full-service implementation. Every channel, fully managed, fully tied back to revenue.",
    features: "Everything in Done With You, Google LSA management, PPC campaigns, GBP optimization, reputation management, call tracking, bi-weekly calls, revenue-linked dashboard",
    popular: false,
  },
];

export default function Services() {
  return (
    <section id="services" className="relative py-24 sm:py-32 bg-[#0A0A0A] noise-texture">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
          Pricing
        </p>
        <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-4">
          Start with the Blueprint
        </h2>
        <p className="font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] mb-16 max-w-xl">
          No retainer before results. No lock-ins. The Blueprint is yours regardless of what comes next.
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
          Using ServiceTitan, Jobber, or HouseCall Pro? We include CRM setup guidance in every plan.
        </p>
      </div>
    </section>
  );
}
