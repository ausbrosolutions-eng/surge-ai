import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Problem() {
  return (
    <section className="relative py-section md:py-section-lg overflow-hidden">
      {/* Right-aligned supporting visual */}
      <div className="absolute inset-y-0 right-0 w-full md:w-2/3 pointer-events-none">
        <Image
          src="/imagery/02-problem.jpg"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 66vw"
          aria-hidden
          className="object-cover object-center opacity-[0.20]"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(10,10,10,1) 0%, rgba(10,10,10,0.7) 30%, rgba(10,10,10,0.3) 100%)",
          }}
        />
      </div>

      <Container size="narrow" className="relative">
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
