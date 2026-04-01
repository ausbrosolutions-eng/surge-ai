import Image from "next/image";

const problems = [
  {
    title: "Your phone goes quiet and you don't know why",
    description:
      "Last month was great. This month the calls dried up. You're running your business on hope, not a system.",
  },
  {
    title: "You're paying an agency and can't explain what you're getting",
    description:
      "They send a report with impressions and clicks. Your phone isn't ringing more. You're paying $2,500/mo and your gut says it isn't working.",
  },
  {
    title: "You know you need to grow but don't know the next move",
    description:
      "You want to hit $3M. Or $5M. But nobody's ever built you a roadmap for how to actually get there.",
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
              Every contractor we work with had at least two of these
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
