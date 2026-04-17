import type { Metadata } from "next";
import SurgeNav from "@/components/surge/SurgeNav";

export const metadata: Metadata = {
  title: "Surge CRM",
  description: "Austin's operator cockpit - pipeline, signals, audits, clients",
};

export default function SurgeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E2D8] flex">
      <SurgeNav />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
