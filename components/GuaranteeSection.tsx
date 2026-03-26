import { ShieldCheck } from "lucide-react";

export default function GuaranteeSection() {
  return (
    <section className="py-16 sm:py-20 bg-white border-t border-gray-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-12 h-12 rounded-xl bg-[#00D4C8]/10 border border-[#00D4C8]/20 flex items-center justify-center mx-auto mb-5">
          <ShieldCheck className="w-6 h-6 text-[#00D4C8]" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-[#0A1628] leading-snug mb-3">
          Not useful in 7 days? Full refund.
        </h2>

        <p className="text-gray-500 text-base max-w-lg mx-auto mb-6">
          Read the Blueprint. If it doesn&rsquo;t give you a clear path forward, email us and we&rsquo;ll return every dollar. No questions.
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#00D4C8] flex-shrink-0" />
            <span>214 blueprints delivered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#FF6B47] flex-shrink-0" />
            <span>98.1% satisfaction rate</span>
          </div>
        </div>
      </div>
    </section>
  );
}
