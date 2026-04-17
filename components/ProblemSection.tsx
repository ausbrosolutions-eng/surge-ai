import Image from "next/image";

const problems = [
  {
    title: "Your collections queue is a graveyard",
    description:
      "Invoices from 6 months ago still sitting at 5.0 status. Nobody's working them systematically. You tell yourself you'll get to it. You never do.",
  },
  {
    title: "Your team is drowning in manual work",
    description:
      "Someone is retyping data from WhatsApp into JobNimbus. Someone is downloading files and ZIPping them for RIB and OCS. Someone is building reports in Google Sheets. Every one of those is a systems failure disguised as a staffing problem.",
  },
  {
    title: "You can't answer basic questions about your business",
    description:
      "Close rate by rep? Revenue by job type? Average days to collect? You'd need half a day to pull it together. Meanwhile decisions keep getting made on gut instinct.",
  },
];

export default function ProblemSection() {
  return (
    <section className="relative py-24 sm:py-32 bg-[#0A0A0A] overflow-hidden noise-texture">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center">
          <div className="lg:col-span-3">
            <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-4">
              Sound Familiar?
            </p>
            <h2 className="font-display text-[36px] sm:text-[48px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8] mb-12">
              Every restoration contractor we audit has at least two of these
            </h2>
            <div className="space-y-10">
              {problems.map((problem) => (
                <div key={problem.title} className="flex gap-4">
                  <div className="w-6 h-px bg-[#B87333] mt-3 flex-shrink-0" />
                  <div>
                    <h3 className="font-display text-lg font-semibold tracking-[0.05em] uppercase text-[#E8E2D8] mb-2">
                      {problem.title}
                    </h3>
                    <p className="font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] leading-relaxed">
                      {problem.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 relative aspect-[3/4] rounded-[2px] overflow-hidden">
            <Image
              src="/images/problem-bg.jpg"
              alt="Home service professional at work"
              fill
              className="object-cover photo-treatment"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
