"use client";

import { use, useState, useMemo } from "react";
import { useSurgeStore } from "@/lib/surge/store";
import { Button } from "@/components/surge/ui/FormField";
import { Modal } from "@/components/surge/ui/Modal";
import { FileText, Download, Sparkles, TrendingUp, TrendingDown, AlertCircle, Trophy, Mail, Send } from "lucide-react";

export default function ReportsPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = use(params);
  const { store, hydrated, generateReport, previewReportDigest, sendReportDigest } = useSurgeStore();
  const [generating, setGenerating] = useState(false);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [emailPreview, setEmailPreview] = useState<{ subject: string; htmlBody: string } | null>(null);
  const [sending, setSending] = useState(false);
  const [sendBanner, setSendBanner] = useState<string | null>(null);

  const metrics = store.metrics.find((m) => m.clientId === clientId);
  const client = store.retainerClients.find((c) => c.id === clientId);
  const reports = useMemo(
    () =>
      store.weeklyReports
        .filter((r) => r.clientId === clientId)
        .sort((a, b) => b.generatedAt.localeCompare(a.generatedAt)),
    [store.weeklyReports, clientId]
  );
  const selectedReport = useMemo(
    () => reports.find((r) => r.id === selectedReportId) || reports[0] || null,
    [reports, selectedReportId]
  );

  if (!hydrated) {
    return (
      <main className="flex-1 p-8">
        <p className="font-sans text-sm text-[#9A9086]">Loading reports...</p>
      </main>
    );
  }

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      const report = generateReport(clientId);
      setGenerating(false);
      if (report) setSelectedReportId(report.id);
    }, 1500);
  };

  const handlePreviewEmail = () => {
    if (!selectedReport) return;
    const preview = previewReportDigest(selectedReport.id);
    if (preview) setEmailPreview(preview);
  };

  const handleSendEmail = async () => {
    if (!selectedReport) return;
    setSending(true);
    const result = await sendReportDigest(selectedReport.id);
    setSending(false);
    setEmailPreview(null);
    setSendBanner(
      result.success
        ? `Weekly digest queued for delivery to ${client?.contactName}. (Mock send - wire Resend/SendGrid API key to go live.)`
        : `Send failed: ${result.error}`
    );
    setTimeout(() => setSendBanner(null), 8000);
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="border-b border-[#2A2520] bg-[#0A0A0A] px-8 py-6 flex items-end justify-between">
        <div>
          <p className="font-sans text-xs font-medium tracking-[0.08em] uppercase text-[#B87333] mb-1">
            Automated Reports
          </p>
          <h1 className="font-display text-3xl font-bold tracking-[0.02em] uppercase text-[#E8E2D8]">
            Reports
          </h1>
          <p className="font-sans text-xs text-[#5A5550] mt-2">
            AI-generated weekly performance reports. Delivered to owner inbox every Monday at 7 AM.
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={generating}>
          <Sparkles className={`w-3 h-3 ${generating ? "animate-pulse" : ""}`} />
          {generating ? "Generating..." : "Generate Weekly Report"}
        </Button>
      </div>

      {sendBanner && (
        <div className="mx-8 mt-4 bg-[#4ADE80]/10 border border-[#4ADE80]/30 rounded-[2px] p-4 flex items-center gap-3">
          <Mail className="w-4 h-4 text-[#4ADE80] flex-shrink-0" />
          <p className="font-sans text-sm text-[#E8E2D8]">{sendBanner}</p>
        </div>
      )}

      <Modal
        open={!!emailPreview}
        onClose={() => setEmailPreview(null)}
        title="Email preview"
        subtitle={emailPreview?.subject}
        maxWidth="xl"
      >
        {emailPreview && (
          <div className="space-y-4">
            <div className="bg-[#0A0A0A] border border-[#2A2520] rounded-[2px] p-3 text-xs text-[#9A9086]">
              <div>
                <span className="text-[#5A5550]">To:</span>{" "}
                <span className="text-[#E8E2D8]">{client?.contactName} &lt;{client?.contactName.toLowerCase().replace(/\s+/g, ".")}@{client?.companyName.toLowerCase().replace(/\s+/g, "")}.com&gt;</span>
              </div>
              <div>
                <span className="text-[#5A5550]">From:</span>{" "}
                <span className="text-[#E8E2D8]">Austin at Surge &lt;austin@surgeadvisory.co&gt;</span>
              </div>
              <div>
                <span className="text-[#5A5550]">Subject:</span>{" "}
                <span className="text-[#E8E2D8]">{emailPreview.subject}</span>
              </div>
            </div>
            <div className="bg-white rounded-[2px] overflow-hidden max-h-[500px] overflow-y-auto">
              <iframe
                srcDoc={emailPreview.htmlBody}
                className="w-full border-0"
                style={{ minHeight: "700px", height: "700px" }}
                title="Email preview"
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#2A2520]">
              <Button variant="secondary" onClick={() => setEmailPreview(null)}>
                Close
              </Button>
              <Button onClick={handleSendEmail} disabled={sending}>
                <Send className="w-3 h-3" />
                {sending ? "Sending..." : "Send to Owner"}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <div className="p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Report List Sidebar */}
        <div className="lg:col-span-1">
          <h2 className="font-display text-xs font-bold tracking-[0.1em] uppercase text-[#9A9086] mb-3">
            History
          </h2>
          <div className="space-y-2">
            {reports.length === 0 ? (
              <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-4 text-center">
                <p className="font-sans text-xs text-[#9A9086]">No reports yet.</p>
                <p className="font-sans text-[11px] text-[#5A5550] mt-1">
                  Click &ldquo;Generate&rdquo; to create your first weekly report.
                </p>
              </div>
            ) : (
              reports.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReportId(r.id)}
                  className={`w-full text-left p-3 rounded-[2px] border transition-colors ${
                    selectedReport?.id === r.id
                      ? "bg-[#B87333]/10 border-[#B87333]/40"
                      : "bg-[#111111] border-[#2A2520] hover:border-[#B87333]/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-3.5 h-3.5 text-[#B87333]" />
                    <p className="font-sans text-xs font-semibold text-[#E8E2D8]">
                      Week of {new Date(r.weekStarting).toLocaleDateString()}
                    </p>
                  </div>
                  <p className="font-sans text-[11px] text-[#5A5550]">
                    ${r.highlights.revenueRecovered.toLocaleString()} recovered ·{" "}
                    {r.highlights.actionItemsCompleted} actions
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Report Detail */}
        <div className="lg:col-span-3">
          {!selectedReport ? (
            <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] p-12 text-center">
              <Sparkles className="w-10 h-10 text-[#B87333] mx-auto mb-4" />
              <h2 className="font-display text-xl font-bold text-[#E8E2D8] mb-2">
                Generate your first weekly report
              </h2>
              <p className="font-sans text-sm text-[#9A9086] max-w-md mx-auto">
                Click the generate button above. Surge will analyze the past week&rsquo;s metrics,
                jobs, team performance, and action items to produce a full executive summary.
              </p>
            </div>
          ) : (
            <div className="bg-[#111111] border border-[#2A2520] rounded-[2px] overflow-hidden">
              {/* Report Header */}
              <div className="bg-gradient-to-br from-[#B87333]/10 to-transparent border-b border-[#B87333]/20 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-sans text-[10px] font-bold tracking-widest uppercase text-[#B87333] mb-1">
                      Weekly Performance Report
                    </p>
                    <h2 className="font-display text-2xl font-bold text-[#E8E2D8]">
                      {client?.companyName} ·{" "}
                      {new Date(selectedReport.weekStarting).toLocaleDateString()} -{" "}
                      {new Date(selectedReport.weekEnding).toLocaleDateString()}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" onClick={handlePreviewEmail}>
                      <Mail className="w-3 h-3" /> Email Preview
                    </Button>
                    <Button variant="secondary">
                      <Download className="w-3 h-3" /> PDF
                    </Button>
                  </div>
                </div>
                <p className="font-sans text-sm text-[#9A9086] leading-relaxed">
                  {selectedReport.summary}
                </p>
              </div>

              {/* Highlights */}
              <div className="p-6 border-b border-[#1A1A1A]">
                <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4">
                  Highlights
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <Highlight
                    label="Revenue Recovered"
                    value={`$${selectedReport.highlights.revenueRecovered.toLocaleString()}`}
                    change={selectedReport.weekOverWeek.recoveryChange}
                    unit="$"
                  />
                  <Highlight
                    label="Jobs Closed"
                    value={selectedReport.highlights.jobsClosed}
                  />
                  <Highlight
                    label="Supplements"
                    value={selectedReport.highlights.supplementsApproved}
                  />
                  <Highlight
                    label="Actions Done"
                    value={selectedReport.highlights.actionItemsCompleted}
                  />
                  <Highlight
                    label="Doc Score"
                    value={`${selectedReport.highlights.documentationGapScore}/100`}
                  />
                </div>
              </div>

              {/* Top Performers */}
              {selectedReport.topPerformers.length > 0 && (
                <div className="p-6 border-b border-[#1A1A1A]">
                  <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4 flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-[#FBBF24]" /> Top Performers
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {selectedReport.topPerformers.map((p, i) => (
                      <div
                        key={p.staffId}
                        className={`bg-[#0A0A0A] rounded-[2px] p-4 ${
                          i === 0 ? "border border-[#FBBF24]/30" : "border border-[#2A2520]"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-display text-sm font-bold text-[#E8E2D8]">
                            {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {p.name}
                          </p>
                          <p className="font-display text-lg font-bold text-[#B87333]">
                            {p.score}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Concerns */}
              {selectedReport.concerns.length > 0 && (
                <div className="p-6 border-b border-[#1A1A1A]">
                  <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-[#EF4444]" /> Flagged for Leadership
                  </h3>
                  <ul className="space-y-2">
                    {selectedReport.concerns.map((c, i) => (
                      <li
                        key={i}
                        className="bg-[#EF4444]/5 border border-[#EF4444]/20 rounded-[2px] p-3 font-sans text-sm text-[#E8E2D8] leading-relaxed"
                      >
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Next Week Priorities */}
              <div className="p-6">
                <h3 className="font-display text-sm font-bold tracking-[0.08em] uppercase text-[#E8E2D8] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#4ADE80]" /> Next Week Priorities
                </h3>
                <ol className="space-y-2">
                  {selectedReport.nextWeekPriorities.map((p, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 bg-[#0A0A0A] rounded-[2px] p-3"
                    >
                      <span className="font-display text-sm font-bold text-[#B87333] w-5 flex-shrink-0">
                        {i + 1}.
                      </span>
                      <p className="font-sans text-sm text-[#E8E2D8] leading-relaxed">{p}</p>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Footer */}
              <div className="bg-[#0A0A0A] px-6 py-4 border-t border-[#1A1A1A]">
                <p className="font-sans text-[11px] text-[#5A5550]">
                  Generated {new Date(selectedReport.generatedAt).toLocaleString()} · Surge Advisory
                  platform · Your success manager: Austin Brooks · Next check-in:{" "}
                  {client?.nextCheckIn
                    ? new Date(client.nextCheckIn).toLocaleDateString()
                    : "TBD"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function Highlight({
  label,
  value,
  change,
  unit = "",
}: {
  label: string;
  value: string | number;
  change?: number;
  unit?: string;
}) {
  return (
    <div>
      <p className="font-sans text-[10px] font-medium tracking-widest uppercase text-[#9A9086] mb-1">
        {label}
      </p>
      <p className="font-display text-xl font-bold text-[#E8E2D8] mb-0.5">{value}</p>
      {change !== undefined && change !== 0 && (
        <div className="flex items-center gap-1">
          {change > 0 ? (
            <TrendingUp className="w-3 h-3 text-[#4ADE80]" />
          ) : (
            <TrendingDown className="w-3 h-3 text-[#EF4444]" />
          )}
          <p
            className={`font-sans text-[11px] ${
              change > 0 ? "text-[#4ADE80]" : "text-[#EF4444]"
            }`}
          >
            {change > 0 ? "+" : ""}
            {unit === "$" ? `$${Math.abs(change).toLocaleString()}` : Math.abs(change).toFixed(0)}
          </p>
        </div>
      )}
    </div>
  );
}
