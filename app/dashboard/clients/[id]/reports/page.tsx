"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Phone, Star, DollarSign, Globe, Target, Save, Printer, BarChart2 } from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MetricCard from "@/components/dashboard/MetricCard";
import { MonthlyReport, ReportMetrics } from "@/lib/types";

const emptyMetrics: ReportMetrics = {
  totalLeads: 0, leadsPerChannel: {}, costPerLead: 0, phoneCallsTracked: 0,
  gbpImpressions: 0, gbpCalls: 0, gbpDirections: 0, newReviews: 0, avgRating: 0,
  websiteTraffic: 0, conversionRate: 0, adSpend: 0, roas: 0, keywordRankings: [],
};

interface BarProps { value: number; max: number; color: string; label: string; }
function Bar({ value, max, color, label }: BarProps) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-24 text-xs text-gray-400 text-right truncate">{label}</div>
      <div className="flex-1 h-5 bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      <div className="w-10 text-xs text-white text-right font-medium">{value}</div>
    </div>
  );
}

export default function ReportsPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const { store } = useStore();
  const client = store.clients.find((c) => c.id === clientId);

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [metrics, setMetrics] = useState<ReportMetrics>(emptyMetrics);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"entry" | "report">("entry");

  const clientLeadsThisMonth = store.leads.filter(
    (l) => l.clientId === clientId && l.createdAt.startsWith(selectedMonth)
  );
  const bookedLeads = clientLeadsThisMonth.filter((l) => l.status === "booked" || l.status === "completed");
  const clientReviews = store.reviews.filter((r) => r.clientId === clientId);

  const handleSave = () => {
    const report: MonthlyReport = {
      id: `${clientId}-${selectedMonth}`,
      clientId,
      month: selectedMonth,
      metrics: { ...metrics, totalLeads: clientLeadsThisMonth.length },
      createdAt: new Date().toISOString(),
    };
    const key = "blueprint_reports";
    const existing = JSON.parse(localStorage.getItem(key) || "[]") as MonthlyReport[];
    const idx = existing.findIndex((r) => r.id === report.id);
    if (idx >= 0) existing[idx] = report;
    else existing.push(report);
    localStorage.setItem(key, JSON.stringify(existing));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!client) return <div className="p-6 text-gray-400">Client not found.</div>;

  const cpl = metrics.adSpend && clientLeadsThisMonth.length
    ? Math.round(metrics.adSpend / clientLeadsThisMonth.length)
    : null;

  const bookingRate = clientLeadsThisMonth.length
    ? Math.round((bookedLeads.length / clientLeadsThisMonth.length) * 100)
    : null;

  const displayMonth = new Date(selectedMonth + "-01").toLocaleString("default", { month: "long", year: "numeric" });

  // Channel breakdown for chart
  const channelData = [
    { label: "Google LSA", value: Math.round(clientLeadsThisMonth.filter(l => l.source === "lsa").length) },
    { label: "Google Ads", value: Math.round(clientLeadsThisMonth.filter(l => l.source === "google_ads").length) },
    { label: "Organic SEO", value: Math.round(clientLeadsThisMonth.filter(l => l.source === "organic").length) },
    { label: "GBP / Maps", value: metrics.gbpCalls },
    { label: "Referral", value: Math.round(clientLeadsThisMonth.filter(l => l.source === "referral").length) },
  ];
  const maxChannel = Math.max(...channelData.map(d => d.value), 1);

  const kpiRows = [
    { kpi: "Cost Per Lead", avg: "$75–$200", strong: "$50–$75", elite: "<$50", yours: cpl !== null ? `$${cpl}` : "—", ok: cpl !== null && cpl < 75 },
    { kpi: "Lead-to-Booked Rate", avg: "30–50%", strong: "50–65%", elite: "65–80%", yours: bookingRate !== null ? `${bookingRate}%` : "—", ok: bookingRate !== null && bookingRate >= 50 },
    { kpi: "Google Review Rating", avg: "4.5", strong: "4.7", elite: "4.8+", yours: store.reviewStats[clientId]?.find(s => s.platform === "google")?.rating?.toFixed(1) ?? "—", ok: false },
    { kpi: "ROAS", avg: "2:1", strong: "3:1", elite: "4:1+", yours: metrics.roas ? `${metrics.roas}:1` : "—", ok: metrics.roas >= 3 },
    { kpi: "Website Conv. Rate", avg: "2–5%", strong: "6–8%", elite: "8–12%", yours: metrics.conversionRate ? `${metrics.conversionRate}%` : "—", ok: metrics.conversionRate >= 6 },
    { kpi: "Phone Calls Tracked", avg: "—", strong: "—", elite: "—", yours: metrics.phoneCallsTracked ? String(metrics.phoneCallsTracked) : "—", ok: false },
  ];

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Monthly Report" selectedClient={client} />
      <main className="flex-1 p-6 space-y-6">

        {/* Header row */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400">Report Month:</label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1">
            {[
              { key: "entry", label: "Data Entry", icon: BarChart2 },
              { key: "report", label: "Print Report", icon: Printer },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as "entry" | "report")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  activeTab === key ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors ml-auto"
          >
            <Save className="w-4 h-4" />
            {saved ? "Saved!" : "Save Report"}
          </button>
        </div>

        {activeTab === "entry" && (
          <>
            {/* Auto-populated metrics */}
            <div>
              <h2 className="text-base font-semibold text-white mb-3">Auto-Populated from System</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <MetricCard title="Total Leads" value={clientLeadsThisMonth.length} icon={Target} iconColor="text-blue-400" />
                <MetricCard title="Leads Booked" value={bookedLeads.length} icon={Target} iconColor="text-emerald-400" />
                <MetricCard title="New Reviews" value={clientReviews.filter((r) => r.datePosted.startsWith(selectedMonth)).length} icon={Star} iconColor="text-amber-400" />
                <MetricCard title="Est. Cost/Lead" value={cpl !== null ? `$${cpl}` : "—"} icon={DollarSign} iconColor="text-purple-400" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* GBP Metrics */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <span>📍</span> GBP Metrics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Profile Impressions", key: "gbpImpressions" },
                    { label: "GBP Phone Calls", key: "gbpCalls" },
                    { label: "Direction Requests", key: "gbpDirections" },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">{label}</label>
                      <input
                        type="number"
                        value={(metrics as unknown as Record<string, number>)[key] || ""}
                        onChange={(e) => setMetrics((m) => ({ ...m, [key]: parseInt(e.target.value) || 0 }))}
                        placeholder="0"
                        className="w-24 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white text-right focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Ads Metrics */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <span>💰</span> Google Ads Metrics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Ad Spend ($)", key: "adSpend" },
                    { label: "Phone Calls Tracked", key: "phoneCallsTracked" },
                    { label: "ROAS", key: "roas" },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">{label}</label>
                      <input
                        type="number"
                        value={(metrics as unknown as Record<string, number>)[key] || ""}
                        onChange={(e) => setMetrics((m) => ({ ...m, [key]: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                        className="w-24 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white text-right focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Website Metrics */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <span>🌐</span> Website Metrics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "Website Traffic", key: "websiteTraffic" },
                    { label: "Conversion Rate (%)", key: "conversionRate" },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">{label}</label>
                      <input
                        type="number"
                        value={(metrics as unknown as Record<string, number>)[key] || ""}
                        onChange={(e) => setMetrics((m) => ({ ...m, [key]: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                        className="w-24 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white text-right focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Metrics */}
              <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <span>⭐</span> Reputation Metrics
                </h3>
                <div className="space-y-3">
                  {[
                    { label: "New Reviews", key: "newReviews" },
                    { label: "Avg Rating", key: "avgRating" },
                  ].map(({ label, key }) => (
                    <div key={key} className="flex items-center justify-between">
                      <label className="text-xs text-gray-400">{label}</label>
                      <input
                        type="number"
                        step={key === "avgRating" ? "0.1" : "1"}
                        value={(metrics as unknown as Record<string, number>)[key] || ""}
                        onChange={(e) => setMetrics((m) => ({ ...m, [key]: parseFloat(e.target.value) || 0 }))}
                        placeholder="0"
                        className="w-24 bg-gray-900 border border-gray-600 rounded px-2 py-1 text-sm text-white text-right focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Lead Channel Chart */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Leads by Channel</h3>
              <div className="space-y-3">
                <Bar value={channelData[0].value} max={maxChannel} color="bg-blue-500" label={channelData[0].label} />
                <Bar value={channelData[1].value} max={maxChannel} color="bg-cyan-500" label={channelData[1].label} />
                <Bar value={channelData[2].value} max={maxChannel} color="bg-emerald-500" label={channelData[2].label} />
                <Bar value={channelData[3].value} max={maxChannel} color="bg-amber-500" label={channelData[3].label} />
                <Bar value={channelData[4].value} max={maxChannel} color="bg-purple-500" label={channelData[4].label} />
              </div>
            </div>

            {/* KPI Benchmarks */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">2025–2026 Industry Benchmarks</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-gray-500 font-medium pb-2 pr-6">KPI</th>
                      <th className="text-left text-gray-500 font-medium pb-2 pr-6">Avg</th>
                      <th className="text-left text-gray-500 font-medium pb-2 pr-6">Strong</th>
                      <th className="text-left text-gray-500 font-medium pb-2 pr-6">Elite</th>
                      <th className="text-left text-gray-500 font-medium pb-2">This Month</th>
                    </tr>
                  </thead>
                  <tbody>
                    {kpiRows.map((row, i) => (
                      <tr key={i} className="border-b border-gray-800/50">
                        <td className="py-2 pr-6 text-gray-300 font-medium">{row.kpi}</td>
                        <td className="py-2 pr-6 text-gray-500">{row.avg}</td>
                        <td className="py-2 pr-6 text-amber-400">{row.strong}</td>
                        <td className="py-2 pr-6 text-emerald-400">{row.elite}</td>
                        <td className={`py-2 font-bold ${row.yours === "—" ? "text-gray-600" : row.ok ? "text-emerald-400" : "text-white"}`}>
                          {row.yours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "report" && (
          <div className="bg-white rounded-xl p-8 text-gray-900 print:shadow-none" id="print-report">
            {/* Print styles */}
            <style>{`@media print { body { background: white; } .no-print { display: none; } }`}</style>

            <button
              onClick={() => window.print()}
              className="no-print mb-6 flex items-center gap-2 bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Printer className="w-4 h-4" /> Print / Save as PDF
            </button>

            {/* Report Header */}
            <div className="flex items-start justify-between mb-8 pb-6 border-b border-gray-200">
              <div>
                <div className="text-2xl font-black text-gray-900">Blueprint AI Marketing</div>
                <div className="text-sm text-gray-500 mt-0.5">Monthly Performance Report</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">{client.businessName}</div>
                <div className="text-sm text-gray-500">{displayMonth}</div>
                <div className="text-xs text-gray-400 mt-0.5 capitalize">{client.package} Package</div>
              </div>
            </div>

            {/* KPI Summary Grid */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: "Total Leads", value: clientLeadsThisMonth.length, color: "bg-blue-50 text-blue-700" },
                { label: "Leads Booked", value: bookedLeads.length, color: "bg-green-50 text-green-700" },
                { label: "Cost Per Lead", value: cpl !== null ? `$${cpl}` : "—", color: "bg-purple-50 text-purple-700" },
                { label: "New Reviews", value: metrics.newReviews || 0, color: "bg-amber-50 text-amber-700" },
              ].map((item, i) => (
                <div key={i} className={`rounded-xl p-4 ${item.color}`}>
                  <div className="text-2xl font-black">{item.value}</div>
                  <div className="text-xs font-semibold mt-0.5 opacity-70">{item.label}</div>
                </div>
              ))}
            </div>

            {/* Two column */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">GBP Performance</h3>
                <div className="space-y-2">
                  {[
                    { label: "Profile Impressions", value: metrics.gbpImpressions.toLocaleString() },
                    { label: "Phone Calls via GBP", value: metrics.gbpCalls.toLocaleString() },
                    { label: "Direction Requests", value: metrics.gbpDirections.toLocaleString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-1.5">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-bold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Paid Advertising</h3>
                <div className="space-y-2">
                  {[
                    { label: "Ad Spend", value: metrics.adSpend ? `$${metrics.adSpend.toLocaleString()}` : "—" },
                    { label: "Phone Calls Tracked", value: metrics.phoneCallsTracked.toLocaleString() },
                    { label: "ROAS", value: metrics.roas ? `${metrics.roas}:1` : "—" },
                    { label: "Cost Per Lead", value: cpl !== null ? `$${cpl}` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-1.5">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-bold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Website + Reputation */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Website</h3>
                <div className="space-y-2">
                  {[
                    { label: "Website Traffic", value: metrics.websiteTraffic.toLocaleString() },
                    { label: "Conversion Rate", value: metrics.conversionRate ? `${metrics.conversionRate}%` : "—" },
                    { label: "Booking Rate", value: bookingRate !== null ? `${bookingRate}%` : "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-1.5">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-bold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Reputation</h3>
                <div className="space-y-2">
                  {[
                    { label: "New Reviews", value: String(metrics.newReviews) },
                    { label: "Average Rating", value: metrics.avgRating ? `${metrics.avgRating} / 5.0` : "—" },
                    { label: "Total Reviews on File", value: String(clientReviews.length) },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between text-sm border-b border-gray-100 pb-1.5">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-bold text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-6 border-t border-gray-200 text-xs text-gray-400 flex justify-between">
              <span>Blueprint AI Marketing · blueprintai.marketing</span>
              <span>Generated {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
