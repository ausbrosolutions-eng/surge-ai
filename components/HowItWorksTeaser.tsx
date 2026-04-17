const steps = [
  {
    number: "01",
    title: "Free Snapshot",
    description: "60-second analysis of where your restoration business is likely leaking revenue. No call required.",
  },
  {
    number: "02",
    title: "Ops Audit",
    description: "Two weeks. $3,500 flat. We pull your CRM data and show you exactly what is stuck, where, and worth how much. Refundable if we can't find $150K.",
  },
  {
    number: "03",
    title: "Implement",
    description: "Take the 90-day roadmap and run it internally, or hand it back for Surge to execute. Phase 1 starts at $6,500/mo.",
  },
];

export default function HowItWorksTeaser() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-28 bg-[#0A0A0A] noise-texture">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
          How It Works
        </p>
        <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-16">
          Three steps. No lock-ins.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {steps.map((step, i) => (
            <div
              key={step.number}
              className={`py-8 md:py-0 md:px-8 ${
                i < steps.length - 1 ? "border-b md:border-b-0 md:border-r border-[#2A2520]" : ""
              } ${i === 0 ? "md:pl-0" : ""} ${i === steps.length - 1 ? "md:pr-0" : ""}`}
            >
              <div className="font-display text-[48px] font-extrabold leading-none tracking-[0.02em] text-[#B87333] mb-4">
                {step.number}
              </div>
              <h3 className="font-display text-xl font-semibold tracking-[0.05em] uppercase text-[#E8E2D8] mb-3">
                {step.title}
              </h3>
              <p className="font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
