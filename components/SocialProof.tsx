"use client";

import { useState } from "react";

const testimonials = [
  {
    name: "Scott M.",
    company: "Water Damage Restoration",
    location: "Phoenix, AZ",
    quote: "Before this, our phone wasn't ringing from Google at all. Within 60 days we were getting 15 to 20 calls a week just from our GBP and LSAs. I didn't know how invisible we actually were until I saw the numbers.",
  },
  {
    name: "Mike R.",
    company: "HVAC Service Company",
    location: "Houston, TX",
    quote: "I was spending $4,000 a month on ads and couldn't tell you where a single job came from. They rebuilt everything. We cut ad spend by 30% and lead volume doubled. First time I've actually understood my own marketing.",
  },
  {
    name: "Dave & Lisa T.",
    company: "Summit Roofing",
    location: "Nashville, TN",
    quote: "Went from 18 Google reviews to 94 in three months. All real, all from real customers. That alone put us in the Map Pack for every keyword in our city. The review system runs while we sleep.",
  },
];

export default function SocialProof() {
  const [active, setActive] = useState(0);
  const t = testimonials[active];

  return (
    <section className="relative py-32 sm:py-40 bg-[#0A0A0A] noise-texture">
      <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="font-display text-[120px] leading-none text-[#B87333] opacity-30 select-none mb-[-40px]">
            &ldquo;
          </div>
          <blockquote className="font-sans text-xl sm:text-2xl font-light italic text-[#E8E2D8] leading-relaxed mb-8">
            {t.quote}
          </blockquote>
          <div className="w-12 h-px bg-[#B87333] mx-auto mb-6" />
          <div className="font-sans text-sm font-medium text-[#E8E2D8] mb-1">{t.name}</div>
          <div className="font-sans text-sm font-normal text-[#9A9086]">
            {t.company} &middot; {t.location}
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                  i === active ? "bg-[#B87333]" : "bg-[#5A5550]"
                }`}
                aria-label={`Testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
