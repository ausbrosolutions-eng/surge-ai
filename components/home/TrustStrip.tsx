import { Container } from "@/components/ui/Container";

const TOOLS = ["JOBBER", "HOUSECALL PRO", "FIELDEDGE"];

export function TrustStrip() {
  return (
    <section className="bg-surface border-y border-white/[0.04] py-6">
      <Container>
        <div className="flex flex-wrap items-center gap-x-12 gap-y-3 justify-center md:justify-between">
          <span className="font-mono uppercase tracking-[0.16em] text-[11px] text-ink-secondary">
            Trusted by home service operators running on
          </span>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {TOOLS.map((tool) => (
              <span
                key={tool}
                className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-ink-primary"
              >
                {tool}
              </span>
            ))}
            <span className="font-mono uppercase tracking-[0.16em] text-[11px] font-medium text-copper">
              + MORE
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
