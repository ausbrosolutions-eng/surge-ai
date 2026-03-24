"use client";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { store } = useStore();

  // Extract client ID from URL if present
  const clientIdMatch = pathname.match(/\/dashboard\/clients\/([^\/]+)/);
  const selectedClientId = clientIdMatch?.[1];

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar
        clients={store.clients}
        selectedClientId={selectedClientId}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
