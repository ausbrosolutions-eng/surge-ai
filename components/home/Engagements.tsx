import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

interface EngagementProps {
  client: string;
  location: string;
  body: string[];
}

function EngagementCard({ client, location, body }: EngagementProps) {
  return (
    <div className="border border-surface p-8 md:p-10">
      <div className="font-mono uppercase tracking-[0.16em] text-[11px] text-ink-secondary">
        ACTIVE ENGAGEMENT{location ? `, ${location}` : ""}
      </div>
      <div className="mt-4 text-display-sm text-ink-primary font-bold">
        {client}
      </div>
      <div className="mt-6 space-y-4">
        {body.map((line) => (
          <p key={line} className="text-base text-ink-secondary leading-relaxed">
            {line}
          </p>
        ))}
      </div>
      <div className="mt-8 font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
        BUILD-OUT IN PROGRESS
      </div>
    </div>
  );
}

export function Engagements() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container>
        <Eyebrow number="06">ENGAGEMENTS</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary max-w-[800px]">
          Who we work with.
        </h2>

        {/* Cinematic supporting image: restoration tech in water-damaged interior */}
        <div className="mt-16 relative aspect-[16/9] w-full overflow-hidden rounded-sm">
          <Image
            src="/imagery/05-engagements.jpg"
            alt="Restoration technician in protective gear examining water-damaged drywall in a residential interior"
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(10,10,10,0.4) 0%, rgba(10,10,10,0) 50%)",
            }}
          />
        </div>

        <div className="mt-12 grid md:grid-cols-2 gap-6 md:gap-10">
          <EngagementCard
            client="BLACK WOLF ROOFING"
            location="PHOENIX AZ"
            body={[
              "Workflow builds: office manager freed of 5 to 8 hours per week of repetitive admin.",
              "Marketing infrastructure: Google Business Profile and AI search visibility. Driving more inbound traffic and rank gains.",
            ]}
          />
          <EngagementCard
            client="REHAB RESTORATION"
            location=""
            body={[
              "AI fluency across the team, smoother workflows, improved data accuracy and integrity.",
              "Time freed for higher-revenue activities and stronger operational integrity.",
            ]}
          />
        </div>
      </Container>
    </section>
  );
}
