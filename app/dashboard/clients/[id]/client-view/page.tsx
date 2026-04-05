"use client";
import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import ClientViewReport from "@/components/dashboard/ClientViewReport";

export default function ClientViewPage() {
  const params = useParams();
  const clientId = params.id as string;
  const { store } = useStore();
  const router = useRouter();

  const client = store.clients.find((c) => c.id === clientId);

  // Redirect after store hydrates if client doesn't exist
  useEffect(() => {
    if (store.initialized && !client) {
      router.replace("/dashboard");
    }
  }, [store.initialized, client, router]);

  // Don't render until store is ready and client is confirmed
  if (!store.initialized || !client) return null;

  return <ClientViewReport clientId={clientId} />;
}
