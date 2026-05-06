import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Problem() {
  return (
    <section className="py-section md:py-section-lg">
      <Container size="narrow">
        <Eyebrow number="02">THE PROBLEM</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary">
          The phone isn&apos;t the problem.
        </h2>

        <div className="mt-8 space-y-6 text-lg text-ink-secondary leading-relaxed">
          <p>
            Most home service businesses don&apos;t have a lead problem, they have a back-office problem. The estimates that don&apos;t get sent. The follow-ups that drop. The reviews that never get asked for. The leads that ring through to voicemail at 7 PM.
          </p>
          <p>
            Pouring more leads into that bucket doesn&apos;t fix the bucket. It just spills faster.
          </p>
        </div>
      </Container>
    </section>
  );
}
