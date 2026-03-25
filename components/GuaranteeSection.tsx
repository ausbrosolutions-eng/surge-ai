import { ShieldCheck } from "lucide-react";

const coverageItems = [
  "The full Blueprint document",
  "The review call with our strategist",
  "Any templates or resources included",
  "No questions, no partial refunds — all of it",
];

export default function GuaranteeSection() {
  return (
    <section className="py-16 sm:py-20 bg-[#0A1628]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-[#FF6B47]/20 bg-[#FF6B47]/[0.04] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 items-center">
            {/* Left: Guarantee */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#00D4C8]/15 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-6 h-6 text-[#00D4C8]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#00D4C8]">
                  Our Guarantee
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug mb-4">
                If your Blueprint doesn&rsquo;t give you a clear path forward,
                we&rsquo;ll refund it. Full stop.
              </h2>

              <p className="text-white/55 text-base leading-relaxed mb-6 max-w-xl">
                We&rsquo;ve never had to honor this because the Blueprint works. But we want you to
                know &mdash; if you read it and think &ldquo;this isn&rsquo;t useful,&rdquo; email
                us within 7 days and we&rsquo;ll return every dollar. No questions, no hoops.
              </p>

              <div className="flex flex-wrap gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00D4C8] flex-shrink-0" />
                  <span className="text-sm text-white/60">214 blueprints delivered</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FF6B47] flex-shrink-0" />
                  <span className="text-sm text-white/60">4 refund requests ever</span>
                </div>
              </div>
            </div>

            {/* Right: What&rsquo;s covered */}
            <div className="lg:w-72 xl:w-80">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
                <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-4">
                  What the guarantee covers
                </h3>
                <ul className="space-y-3">
                  {coverageItems.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#00D4C8]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-[#00D4C8]" />
                      </div>
                      <span className="text-sm text-white/65 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
