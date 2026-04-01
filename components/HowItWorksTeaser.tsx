const steps = [
  {
    number: "01",
    title: "Free Snapshot",
    description: "60-second analysis of your biggest revenue gap and top 3 growth channels.",
  },
  {
    number: "02",
    title: "Custom Blueprint",
    description: "Your full growth roadmap, built in 48 hours around your trade, market, and revenue goal.",
  },
  {
    number: "03",
    title: "Execute",
    description: "DIY with the Blueprint, get guided support, or hand it all off. Your call.",
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
