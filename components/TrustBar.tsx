const platforms = [
  "Google",
  "Angi",
  "ServiceTitan",
  "Jobber",
  "Yelp",
  "HomeAdvisor",
  "Thumbtack",
];

export default function TrustBar() {
  return (
    <section className="relative border-t border-b border-[#2A2520] py-6 bg-[#0A0A0A]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {platforms.map((platform, i) => (
            <span key={platform} className="flex items-center gap-6">
              <span className="font-sans text-sm font-normal text-[#5A5550]">
                {platform}
              </span>
              {i < platforms.length - 1 && (
                <span className="w-1 h-1 rounded-full bg-[#B87333]" />
              )}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
