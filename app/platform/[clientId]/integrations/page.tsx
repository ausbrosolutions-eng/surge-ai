"use client";

import { use, useState } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import { INTEGRATION_CATALOG } from "@/lib/surge/integrations/encircle";
import { Button } from "@/components/surge/ui/FormField";
import { CheckCircle2, AlertCircle, ExternalLink, RefreshCw, Plug } from "lucide-react";
import type { IntegrationConnection } from "@/lib/surge/types";

export default function IntegrationsPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = use(params);
  const { store, hydrated, syncEncircleForClient, syncJobNimbusForClient } = useSurgeStore();
  const [syncing, setSyncing] = useState<string | null>(null);
  const [banner, setBanner] = useState<string | null>(null);

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading integrations...</p>
      </main>
    );
  }

  const clientIntegrations = store.integrations.filter((i) => i.clientId === clientId);

  const getConn = (provider: string): IntegrationConnection | undefined =>
    clientIntegrations.find((c) => c.provider === provider);

  const handleConnect = (provider: string) => {
    if (provider === "encircle") {
      setSyncing(provider);
      setTimeout(() => {
        const result = syncEncircleForClient(clientId);
        setSyncing(null);
        setBanner(
          `Encircle connected successfully. Synced ${result.sessions} active field sessions. New data available in Cockpit and Claims views.`
        );
        setTimeout(() => setBanner(null), 8000);
      }, 1200);
    } else if (provider === "jobnimbus") {
      setSyncing(provider);
      setTimeout(() => {
        const result = syncJobNimbusForClient(clientId);
        setSyncing(null);
        setBanner(
          `JobNimbus resynced using API key "AI Business Analysis". ${result.jobs} jobs refreshed. Run automation to see new flags.`
        );
        setTimeout(() => setBanner(null), 8000);
      }, 1200);
    } else {
      setBanner(`${provider} connection flow not implemented yet - requires API credentials.`);
      setTimeout(() => setBanner(null), 6000);
    }
  };

  const handleResync = (provider: string) => {
    if (provider === "encircle") {
      setSyncing(provider);
      setTimeout(() => {
        const result = syncEncircleForClient(clientId);
        setSyncing(null);
        setBanner(`Resynced Encircle. ${result.sessions} active sessions refreshed.`);
        setTimeout(() => setBanner(null), 6000);
      }, 800);
    } else if (provider === "jobnimbus") {
      setSyncing(provider);
      setTimeout(() => {
        const result = syncJobNimbusForClient(clientId);
        setSyncing(null);
        setBanner(`Resynced JobNimbus. ${result.jobs} jobs refreshed.`);
        setTimeout(() => setBanner(null), 6000);
      }, 800);
    }
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333] mb-1">
            Connect your stack
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Integrations
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-2">
            The more systems you connect, the more Surge can automate. Start with your CRM, add
            field documentation, layer in accounting.
          </p>
        </div>
      </div>

      {banner && (
        <div className="mx-8 mt-4 bg-[#B87333]/10 border border-[#B87333]/30 rounded-[2px] p-4 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-[#B87333] flex-shrink-0" />
          <p className="font-sans text-sm text-[#E8E2D8]">{banner}</p>
        </div>
      )}

      <div className="p-8 space-y-4">
        {INTEGRATION_CATALOG.map((integration) => {
          const conn = getConn(integration.provider);
          const connected = conn?.status === "connected";
          const isSyncing = syncing === integration.provider;
          return (
            <div
              key={integration.provider}
              className={`bg-[#111111] border rounded-[2px] p-6 ${
                connected ? "border-[#4ADE80]/30" : "border-[#2A2520]"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded bg-[#B87333]/15 flex items-center justify-center flex-shrink-0 text-2xl">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-display text-lg font-bold text-[#E8E2D8]">
                        {integration.name}
                      </h3>
                      {connected ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-[#4ADE80]/15 text-[#4ADE80] font-sans text-[10px] font-bold tracking-wider uppercase">
                          <CheckCircle2 className="w-3 h-3" /> Connected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-[2px] bg-[#5A5550]/20 text-[#9A9086] font-sans text-[10px] font-bold tracking-wider uppercase">
                          Not Connected
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-xs text-[#5A5550] uppercase tracking-wider mb-2">
                      {integration.category}
                    </p>
                    <p className="font-sans text-sm text-[#9A9086] leading-relaxed">
                      {integration.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {connected ? (
                    <>
                      <Button
                        variant="secondary"
                        onClick={() => handleResync(integration.provider)}
                        disabled={isSyncing}
                      >
                        <RefreshCw className={`w-3 h-3 ${isSyncing ? "animate-spin" : ""}`} />
                        {isSyncing ? "Syncing..." : "Resync"}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(integration.provider)}
                      disabled={isSyncing}
                    >
                      <Plug className="w-3 h-3" />
                      {isSyncing ? "Connecting..." : "Connect"}
                    </Button>
                  )}
                </div>
              </div>

              {connected && conn && (
                <div className="bg-[#0A0A0A] rounded-[2px] p-3 mb-4 flex items-center justify-between">
                  <div>
                    <p className="font-sans text-xs text-[#9A9086]">
                      Last synced:{" "}
                      <span className="text-[#E8E2D8]">
                        {conn.lastSyncedAt
                          ? new Date(conn.lastSyncedAt).toLocaleString()
                          : "Never"}
                      </span>
                    </p>
                    <p className="font-sans text-xs text-[#5A5550] mt-0.5">
                      {conn.lastSyncSummary}
                    </p>
                  </div>
                  {conn.apiKeyMask && (
                    <p className="font-mono text-[11px] text-[#5A5550]">
                      API Key: {conn.apiKeyMask}
                    </p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[#1A1A1A]">
                <div>
                  <p className="font-sans text-[10px] font-medium tracking-widest uppercase text-[#5A5550] mb-1.5">
                    Data Surge Will Sync
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {integration.dataSync.map((item) => (
                      <span
                        key={item}
                        className="px-2 py-0.5 rounded-[2px] bg-[#1A1A1A] text-[#9A9086] font-sans text-[10px]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="font-sans text-[10px] font-medium tracking-widest uppercase text-[#5A5550] mb-1.5">
                    Requirements
                  </p>
                  <p className="font-sans text-xs text-[#9A9086] leading-relaxed">
                    {integration.requirements}
                  </p>
                  {integration.docsUrl && (
                    <a
                      href={integration.docsUrl}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1 font-sans text-xs text-[#B87333] hover:text-[#D4956A] mt-1"
                    >
                      Learn more <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Note */}
        <div className="bg-[#0A0A0A] border border-[#2A2520] rounded-[2px] p-6 mt-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#9A9086] flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-display text-sm font-bold text-[#E8E2D8] mb-1">
                About integrations
              </p>
              <p className="font-sans text-xs text-[#9A9086] leading-relaxed mb-2">
                Encircle sync is currently in demo mode with mock field data. Real Encircle API
                access requires a partnership agreement with getencircle.com, which Surge is
                pursuing as part of our restoration CRM stack.
              </p>
              <p className="font-sans text-xs text-[#9A9086] leading-relaxed">
                JobNimbus, Albi, Xcelerate, QuickBooks, and Xactimate integrations will roll out in
                Phase 4 once your preferred CRM path is finalized.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
