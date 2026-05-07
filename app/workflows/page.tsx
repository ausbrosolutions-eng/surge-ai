import type { Metadata } from "next";
import { Navbar } from "@/components/home/Navbar";
import { Footer } from "@/components/home/Footer";
import { WorkflowsHero } from "@/components/workflows/WorkflowsHero";
import { WorkflowsLeak } from "@/components/workflows/WorkflowsLeak";
import { WorkflowsMath } from "@/components/workflows/WorkflowsMath";
import { WorkflowsBuilds } from "@/components/workflows/WorkflowsBuilds";
import { WorkflowsWhyNow } from "@/components/workflows/WorkflowsWhyNow";
import { WorkflowsStance } from "@/components/workflows/WorkflowsStance";
import { WorkflowsCase } from "@/components/workflows/WorkflowsCase";
import { WorkflowsOffer } from "@/components/workflows/WorkflowsOffer";
import { WorkflowsFinalCTA } from "@/components/workflows/WorkflowsFinalCTA";
import { WorkflowsSources } from "@/components/workflows/WorkflowsSources";

export const metadata: Metadata = {
  title: "Workflow Builds | Surge Advisory",
  description:
    "Your office manager is losing 16 hours a week to admin. Surge installs AI agents into the stack you already use, recovers the supplement gap on every claim, and moves the leak back to revenue.",
  openGraph: {
    title: "Workflow Builds | Surge Advisory",
    description:
      "AI agent workflows for roofing and restoration contractors. Stop losing 35 to 50 percent of every insurance claim to admin overload.",
    type: "website",
  },
};

export default function WorkflowsPage() {
  return (
    <>
      <Navbar />
      <main>
        <WorkflowsHero />
        <WorkflowsLeak />
        <WorkflowsMath />
        <WorkflowsBuilds />
        <WorkflowsWhyNow />
        <WorkflowsStance />
        <WorkflowsCase />
        <WorkflowsOffer />
        <WorkflowsFinalCTA />
        <WorkflowsSources />
      </main>
      <Footer />
    </>
  );
}
