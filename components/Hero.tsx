import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt=""
          fill
          className="object-cover photo-treatment"
          priority
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to right, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.45) 100%)",
          }}
        />
      </div>

      <div className="absolute inset-0 noise-texture" />

      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-6">
            Ops Infrastructure for Restoration Contractors
          </p>

          <h1 className="font-display text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8]">
            Your money is stuck. We find it.
          </h1>

          <p className="mt-6 font-sans text-base sm:text-lg font-light tracking-[-0.01em] text-[#9A9086] max-w-xl leading-relaxed">
            A typical restoration contractor has 15-25% of annual revenue aging in collections with zero automated follow-up. Our 2-week Ops Audit shows you the exact number, the exact jobs, and the 90-day plan to recover it.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#audit"
              className="inline-flex items-center px-8 py-4 bg-[#B87333] text-[#0A0A0A] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] hover:bg-[#D4956A] transition-all duration-200"
            >
              Book an Ops Audit
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center px-8 py-4 border-2 border-[#B87333] text-[#E8E2D8] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] hover:bg-[#B87333] hover:text-[#0A0A0A] transition-all duration-200"
            >
              See How It Works
            </a>
          </div>

          <p className="mt-6 font-sans text-xs font-light tracking-[0.02em] text-[#5A5550] max-w-md">
            $3,500. Refundable if we can&rsquo;t identify $150K in recoverable revenue.
          </p>
        </div>
      </div>
    </section>
  );
}
