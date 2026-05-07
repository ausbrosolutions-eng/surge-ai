import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export function WorkflowsOffer() {
  return (
    <section className="py-section md:py-section-lg border-t border-white/[0.04]">
      <Container size="narrow">
        <Eyebrow number="08">WHERE TO START</Eyebrow>

        <h2 className="mt-8 text-display-md md:text-display-lg text-ink-primary">
          We start with one workflow.
          <br />
          <span className="text-copper">Usually the one that&apos;s bleeding.</span>
        </h2>

        <div className="mt-12 space-y-6 text-lg text-ink-secondary leading-relaxed">
          <p>
            The first build is scoped to one specific leak in your operation. Pick the one that hurts most: AR aging, supplement leakage, lead response time, or the estimating bottleneck. We build it, train your team into it, and prove the ROI before we touch anything else.
          </p>
          <p>
            The first workflow typically lands within three weeks of kickoff. The first month&apos;s invoice usually pays for itself before the second month&apos;s invoice is due.
          </p>
          <p>
            After the first workflow, we expand into the next one your team flags. Most contractors run three to five workflows on their stack within the first six months.
          </p>
        </div>

        <div className="mt-12 flex flex-col sm:flex-row gap-4 sm:items-center">
          <Button
            href="mailto:austin@surgeadvisory.co?subject=Workflow%20Build%20Walk-Through&body=Hi%20Austin%2C%0A%0AI%27d%20like%20to%20book%20a%2030-minute%20walk-through%20about%20building%20AI%20workflows%20into%20our%20operation.%0A%0A-%20Business%20name%3A%20%0A-%20Trade%3A%20%0A-%20Approximate%20revenue%3A%20%0A-%20Biggest%20admin%20leak%3A%20%0A-%20Best%20times%3A%20%0A%0AThanks"
            variant="primary"
          >
            Book a 30-minute walk-through &rarr;
          </Button>
          <Button
            href="mailto:austin@surgeadvisory.co?subject=Question%20about%20workflow%20builds"
            variant="secondary"
          >
            Or email me directly
          </Button>
        </div>
      </Container>
    </section>
  );
}
