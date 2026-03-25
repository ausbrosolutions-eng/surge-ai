const credibility = [
  { label: "10+ years", sub: "home service marketing" },
  { label: "Angi & ServiceTitan", sub: "former partner" },
  { label: "43 states", sub: "clients served" },
];

export default function AboutSection() {
  return (
    <section className="section-light py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          {/* Left: Story */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0A1628]/8 text-[#0A1628] text-xs font-bold uppercase tracking-widest mb-6">
              Why We Built This
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] leading-tight mb-6">
              Built by someone who watched contractors get burned by bad marketing.
            </h2>

            <div className="space-y-4 text-gray-600 text-base leading-relaxed">
              <p>
                My dad ran a plumbing company for 22 years. He was the best plumber in three
                counties &mdash; and he still got pushed around by agencies that charged $4,000 a
                month to run ads that drove clicks to a website nobody ever called from.
              </p>
              <p>
                He didn&rsquo;t know what was working. The agency didn&rsquo;t tell him. He just
                kept writing the check because he didn&rsquo;t know what else to do.
              </p>
              <p>
                I built Surge because I knew there had to be a better way. Today we combine the
                research power of AI with real home service marketing expertise &mdash; so you get
                the roadmap a Fortune 500 company would pay $50,000 for, at a price that makes
                sense for a 5-truck operation.
              </p>
              <p className="text-[#0A1628] font-semibold">
                You&rsquo;re already great at the trade. The problem isn&rsquo;t your work.
              </p>
            </div>

            {/* Credibility pills */}
            <div className="mt-8 flex flex-wrap gap-4">
              {credibility.map((c) => (
                <div
                  key={c.label}
                  className="flex flex-col px-4 py-3 rounded-xl bg-white border border-gray-200 shadow-sm"
                >
                  <span className="text-sm font-bold text-[#0A1628]">{c.label}</span>
                  <span className="text-xs text-gray-400 mt-0.5">{c.sub}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Founder note */}
          <div className="lg:pt-4">
            <div className="relative rounded-2xl border border-gray-200 bg-white shadow-md p-8 sm:p-10">
              {/* Decorative corner accent */}
              <div className="absolute top-0 left-0 w-1 h-16 bg-[#00D4C8] rounded-tl-2xl rounded-bl-none" />

              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-5">
                A note from the founder
              </p>

              <div className="space-y-4 text-gray-600 text-sm leading-relaxed">
                <p>
                  Every contractor I&rsquo;ve talked to has the same frustration: they&rsquo;re
                  good at what they do, they work hard, and they still can&rsquo;t figure out why
                  the phone isn&rsquo;t ringing the way it should.
                </p>
                <p>
                  The answer is almost never the quality of their work. It&rsquo;s that nobody has
                  ever sat down and built them a real plan &mdash; one that looks at their actual
                  market, their actual competition, and tells them exactly what to do next.
                </p>
                <p>
                  That&rsquo;s the Blueprint. It&rsquo;s not a generic checklist. It&rsquo;s not a
                  Google Ads account with no context. It&rsquo;s the roadmap your business has
                  always needed.
                </p>
                <p className="text-gray-700 font-medium">
                  And unlike your old agency &mdash; you keep it forever.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-[#0A1628] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  JS
                </div>
                <div>
                  <div className="text-sm font-bold text-[#0A1628]">Jordan S.</div>
                  <div className="text-xs text-gray-400">Founder, Surge AI</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
