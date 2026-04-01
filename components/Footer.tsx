const footerLinks = {
  Services: [
    { label: "The Blueprint", href: "/#services" },
    { label: "Done With You", href: "/#services" },
    { label: "Done For You", href: "/#services" },
  ],
  Company: [
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Results", href: "/#results" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/#contact" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2520]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div>
            <a href="/" className="inline-block mb-4">
              <span className="font-display text-xl font-bold tracking-[0.03em] uppercase copper-text">
                Surge
              </span>
            </a>
            <p className="font-sans text-sm font-light text-[#5A5550] max-w-xs leading-relaxed">
              Revenue consulting for home service businesses ready to scale.
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-display text-xs font-semibold tracking-[0.08em] uppercase text-[#5A5550] mb-5">
                {category}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="font-sans text-sm font-light text-[#9A9086] hover:text-[#B87333] transition-colors duration-200">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-[#2A2520]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs font-normal text-[#5A5550]">
            &copy; {new Date().getFullYear()} Surge Advisory. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-sans text-xs font-normal text-[#5A5550] hover:text-[#B87333] transition-colors">Privacy Policy</a>
            <a href="#" className="font-sans text-xs font-normal text-[#5A5550] hover:text-[#B87333] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
