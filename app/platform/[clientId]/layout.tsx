import type { Metadata } from "next";
import PlatformNav from "@/components/surge/PlatformNav";

export const metadata: Metadata = {
  title: "Surge Platform",
  description: "Your restoration ops platform",
};

export default function PlatformLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { clientId: string };
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#E8E2D8] flex">
      <PlatformNav clientId={params.clientId} />
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
