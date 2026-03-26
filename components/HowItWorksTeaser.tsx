import { ClipboardList, FileText, Rocket, ArrowRight } from "lucide-react";
import Link from "next/link";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Free Blueprint Snapshot",
    subtitle: "Know your biggest gap in 60 seconds",
    iconColor: "text-[#00D4C8]",
    iconBg: "bg-[#00D4C8]/10",
  },
  {
    icon: FileText,
    number: "02",
    title: "Custom Revenue Blueprint",
    subtitle: "Your plan, built in 48 hours",
    iconColor: "text-[#FF6B47]",
    iconBg: "bg-[#FF6B47]/10",
  },
  {
    icon: Rocket,
    number: "03",
    title: "Execute on Your Terms",
    subtitle: "DIY, guided, or fully managed",
    iconColor: "text-green-400",
    iconBg: "bg-green-500/10",
  },
];

export default function HowItWorksTeaser() {
  return (
    <section className="bg-white border-b border-gray-100 py-14">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-0">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1 w-full sm:w-auto">
              <div className="flex items-center gap-4 flex-1">
                <div
                  className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center flex-shrink-0`}
                >
                  <step.icon className={`w-6 h-6 ${step.iconColor}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-300 mb-0.5">{step.number}</div>
                  <div className="text-sm font-bold text-[#0A1628] leading-tight">
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">{step.subtitle}</div>
                </div>
              </div>

              {/* Connector arrow — between steps only */}
              {index < steps.length - 1 && (
                <div className="hidden sm:flex items-center justify-center w-10 flex-shrink-0">
                  <ArrowRight className="w-4 h-4 text-gray-200" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/how-it-works"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0A1628] hover:text-[#00D4C8] transition-colors"
          >
            See the full process
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
