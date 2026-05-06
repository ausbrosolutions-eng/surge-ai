import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import Link from "next/link";

interface ModuleCardProps {
  number: string;
  label: string;
  headline: string;
  body: string;
  href: string;
}

function ModuleCard({ number, label, headline, body, href }: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="group block border border-surface p-8 md:p-10 transition-colors hover:border-copper"
      style={{
        background:
          "linear-gradient(135deg, rgba(184,115,51,0.04) 0%, rgba(10,10,10,1) 100%)",
      }}
    >
      <Eyebrow number={number}>{label}</Eyebrow>
      <h3 className="mt-6 text-display-sm md:text-display-md text-ink-primary">
        {headline}
      </h3>
      <p className="mt-4 text-base text-ink-secondary leading-relaxed">
        {body}
      </p>
      <div className="mt-8 font-mono uppercase tracking-[0.04em] text-xs text-copper group-hover:text-copper-dark transition-colors">
        Learn more &rarr;
      </div>
    </Link>
  );
}

export function Modules() {
  return (
    <section className="py-section md:py-section-lg">
      <Container>
        <Eyebrow variant="warm">MODULES</Eyebrow>

        <div className="mt-10 grid md:grid-cols-2 gap-6 md:gap-10">
          <ModuleCard
            number="01"
            label="WORKFLOW BUILDS"
            headline="AI agents inside Jobber, ServiceTitan, HouseCall Pro."
            body="Estimate drafting, follow-up cadences, quality scoring, daily reports, lead intake. The repetitive work, automated."
            href="/workflows"
          />
          <ModuleCard
            number="02"
            label="MARKETING INFRASTRUCTURE"
            headline="Local SEO, GBP, AI search, reviews, attribution."
            body="Findable on Google, ChatGPT, and Copilot. Reviews flowing. Every dollar attributed. Your phone rings."
            href="/marketing"
          />
        </div>
      </Container>
    </section>
  );
}
