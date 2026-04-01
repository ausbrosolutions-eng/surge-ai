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
        <div className="max-w-2xl">
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#9A9086] mb-6">
            Home Service Marketing
          </p>

          <h1 className="font-display text-[40px] sm:text-[56px] md:text-[72px] lg:text-[88px] font-bold leading-[0.95] tracking-[0.03em] uppercase text-[#E8E2D8]">
            Find out what&rsquo;s killing your revenue
          </h1>

          <p className="mt-6 font-sans text-base font-light tracking-[-0.01em] text-[#9A9086] max-w-md leading-relaxed">
            A free analysis of your business. We find the top 3 gaps costing you jobs. In 60 seconds.
          </p>

          <div className="mt-10">
            <a
              href="#contact"
              className="inline-flex items-center px-8 py-4 border-2 border-[#B87333] text-[#E8E2D8] font-display text-sm font-semibold tracking-[0.1em] uppercase rounded-[2px] hover:bg-[#B87333] hover:text-[#0A0A0A] transition-all duration-200"
            >
              Get My Free Growth Plan
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
