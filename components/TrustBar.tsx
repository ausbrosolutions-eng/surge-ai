const platforms = [
  "Google Business Profile",
  "Angi",
  "HomeAdvisor",
  "Jobber",
  "ServiceTitan",
  "Thumbtack",
  "Yelp",
];

const proofNumbers = [
  { value: "214", label: "contractors served" },
  { value: "43", label: "states covered" },
  { value: "4.8/5", label: "average rating" },
  { value: "$2.4M", label: "in tracked revenue added" },
];

export default function TrustBar() {
  return (
    <section className="section-light border-b border-gray-200/80 py-10 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Platform row */}
        <div className="flex flex-col items-center gap-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Trusted by contractors on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
            {platforms.map((platform, i) => (
              <span key={platform} className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors cursor-default">
                  {platform}
                </span>
                {i < platforms.length - 1 && (
                  <span className="text-gray-300 select-none">&middot;</span>
                )}
              </span>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200/70" />

        {/* Proof numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {proofNumbers.map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-3xl sm:text-4xl font-black text-[#0A1628] tracking-tight">
                {item.value}
              </div>
              <div className="mt-1 text-sm text-gray-500 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
