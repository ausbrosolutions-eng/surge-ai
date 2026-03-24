"use client";

import { Waves, Twitter, Linkedin, Github, Mail, ArrowRight } from "lucide-react";

const footerLinks = {
  Services: [
    { label: "The Blueprint", href: "#services" },
    { label: "The Surge Plan", href: "#services" },
    { label: "The Full Surge", href: "#services" },
    { label: "AI Integration Setup", href: "#services" },
  ],
  Company: [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Results & Case Studies", href: "#results" },
    { label: "FAQ", href: "#faq" },
    { label: "About", href: "#" },
    { label: "Contact", href: "#contact" },
  ],
  Resources: [
    { label: "Free Blueprint Snapshot", href: "#contact" },
    { label: "Revenue Growth Blog", href: "#" },
    { label: "Home Service Marketing Guide", href: "#" },
    { label: "ROI Calculator", href: "#" },
    { label: "Case Studies", href: "#" },
  ],
};

const socials = [
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Mail, label: "Email", href: "mailto:hello@withsurge.ai" },
];

export default function Footer() {
  return (
    <footer className="bg-[#060e1c] border-t border-white/10 text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center glow-teal group-hover:scale-105 transition-transform">
                <Waves className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Surge{" "}
                <span className="text-blue-400 font-semibold">AI</span>
              </span>
            </a>

            <p className="text-white/40 text-sm leading-relaxed max-w-xs mb-6">
              We build the roadmap. You drive the revenue. AI-powered growth
              consulting for home service businesses ready to scale.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center hover:bg-blue-500/20 hover:border-blue-500/40 text-white/40 hover:text-blue-400 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Newsletter mini CTA */}
            <div className="mt-8">
              <p className="text-xs font-semibold text-white/30 uppercase tracking-widest mb-3">
                Revenue Growth Newsletter
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 min-w-0 px-3.5 py-2.5 rounded-lg border border-white/10 bg-white/5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/30"
                />
                <button className="px-3.5 py-2.5 rounded-lg bg-[#FF6B47] hover:bg-[#FF8B6B] transition-colors flex-shrink-0">
                  <ArrowRight className="w-4 h-4 text-white" />
                </button>
              </div>
              <p className="text-xs text-white/20 mt-2">
                Weekly home service growth strategies. No spam.
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-5">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} Surge AI. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/25">
            <a href="#" className="hover:text-white/50 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white/50 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-white/50 transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
