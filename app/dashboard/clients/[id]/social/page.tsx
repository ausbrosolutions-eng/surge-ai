"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, Calendar, List, Plus, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import ProgressRing from "@/components/dashboard/ProgressRing";
import ChecklistItemRow from "@/components/dashboard/ChecklistItem";

const platformConfig = [
  { key: "facebook", label: "Facebook", icon: "📘", priority: "#1", why: "Primary home service buyer is 35-65 — Facebook's core demographic. 68% of U.S. adults use Facebook.", freq: "3-5x/week", tip: "Join local community Facebook groups and add value before promoting." },
  { key: "nextdoor", label: "Nextdoor", icon: "🏘️", priority: "#2 — Most Underutilized", why: "Neighborhood-specific verified addresses. A neighbor's recommendation carries massive trust weight.", freq: "2-3x/month", tip: "Respond to Recommendations requests within 1 hour. Neighbors see you operate locally." },
  { key: "instagram", label: "Instagram", icon: "📸", priority: "#3", why: "Best for homeowners 25-40. Reels generate 3x more reach than static posts.", freq: "4-5x/week", tip: "Post before/after Reels. They are the highest-engagement content type for home services." },
  { key: "youtube", label: "YouTube", icon: "▶️", priority: "#4 — Long Term Brand", why: "YouTube videos appear in Google search results — free organic placement. Also builds trust with AI models.", freq: "1-2 videos/month", tip: "'How long does water damage restoration take?' — answer this on YouTube and rank in Google too." },
  { key: "tiktok", label: "TikTok", icon: "🎵", priority: "#5", why: "Growing homeowner overlap. Authentic, unpolished content outperforms produced content.", freq: "3-5x/week", tip: "Day-in-the-life content and before/afters perform extremely well." },
];

const contentIdeas = [
  { title: "Before/After Transformation", type: "Video/Photo", platform: "All", engagement: "⭐⭐⭐⭐⭐", notes: "Highest converting content type for home services. Always include the 'before' context." },
  { title: "Seasonal Maintenance Reminder", type: "Post", platform: "Facebook, Nextdoor", engagement: "⭐⭐⭐⭐", notes: "E.g., 'It's March — spring flooding season is coming. Here's how to protect your home.'" },
  { title: "Emergency Preparedness Tips", type: "Post/Video", platform: "All", engagement: "⭐⭐⭐⭐", notes: "'What to do if your pipe bursts at 2 AM' — shareable, valuable, builds authority." },
  { title: "Day in the Life of a Technician", type: "Video", platform: "TikTok, Instagram Reels", engagement: "⭐⭐⭐⭐", notes: "Unpolished, authentic. Shows professionalism and human side of the business." },
  { title: "Weather-Triggered Content", type: "Post", platform: "Facebook, Nextdoor", engagement: "⭐⭐⭐⭐⭐", notes: "Post within hours of storms/weather events: 'After last night's storm, check your...' Very timely." },
  { title: "Customer Video Testimonial", type: "Video", platform: "Facebook, YouTube", engagement: "⭐⭐⭐⭐⭐", notes: "Ask happy customers to record a 30-second video review. Gold for ads too." },
];

const DAYS_OF_WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const PLATFORM_COLORS: Record<string, string> = {
  facebook: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  instagram: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  nextdoor: "bg-green-500/20 text-green-300 border-green-500/30",
  youtube: "bg-red-500/20 text-red-300 border-red-500/30",
  tiktok: "bg-purple-500/20 text-purple-300 border-purple-500/30",
};

interface CalendarPost {
  id: string;
  day: string;
  platform: string;
  topic: string;
  type: string;
}

function generateWeeklyCalendar(businessName: string, city: string): CalendarPost[] {
  return [
    { id: "1", day: "Mon", platform: "facebook", topic: `Before/after job showcase — ${city} restoration`, type: "Photo" },
    { id: "2", day: "Mon", platform: "instagram", topic: "Before/after Reel — team in action", type: "Reel" },
    { id: "3", day: "Tue", platform: "nextdoor", topic: `${businessName} is serving your neighborhood`, type: "Post" },
    { id: "4", day: "Wed", platform: "facebook", topic: "Emergency prep tips — what to do when disaster strikes", type: "Post" },
    { id: "5", day: "Wed", platform: "instagram", topic: "Day-in-the-life of our crew", type: "Story" },
    { id: "6", day: "Thu", platform: "facebook", topic: `Customer testimonial from ${city} homeowner`, type: "Video" },
    { id: "7", day: "Thu", platform: "tiktok", topic: "Behind the scenes restoration timelapse", type: "Video" },
    { id: "8", day: "Fri", platform: "instagram", topic: "Friday feature — team/crew spotlight", type: "Post" },
    { id: "9", day: "Fri", platform: "facebook", topic: "Weekend tip — seasonal maintenance reminder", type: "Post" },
    { id: "10", day: "Sat", platform: "instagram", topic: "Weekend before/after showcase", type: "Reel" },
    { id: "11", day: "Sun", platform: "facebook", topic: "Community spotlight or local news share", type: "Post" },
  ];
}

export default function SocialPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const { store, toggleChecklistItem } = useStore();
  const client = store.clients.find((c) => c.id === clientId);
  const checklists = store.checklists[`${clientId}_social`] || [];
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"strategy" | "calendar">("strategy");
  const [calendarPosts, setCalendarPosts] = useState<CalendarPost[]>(() =>
    client ? generateWeeklyCalendar(client.businessName, client.city) : []
  );
  const [addingPost, setAddingPost] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ platform: "facebook", topic: "", type: "Post" });

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const score = client?.scores.social ?? 0;

  const grouped = checklists.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof checklists>);

  if (!client) return <div className="p-6 text-gray-400">Client not found.</div>;

  const postsByDay = DAYS_OF_WEEK.reduce((acc, d) => {
    acc[d] = calendarPosts.filter((p) => p.day === d);
    return acc;
  }, {} as Record<string, CalendarPost[]>);

  function addPost(day: string) {
    if (!newPost.topic.trim()) return;
    setCalendarPosts((prev) => [...prev, { id: Date.now().toString(), day, ...newPost }]);
    setNewPost({ platform: "facebook", topic: "", type: "Post" });
    setAddingPost(null);
  }

  function removePost(id: string) {
    setCalendarPosts((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="Social Media Strategy" selectedClient={client} />
      <main className="flex-1 p-6 space-y-6">

        {/* Score */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 flex items-center gap-6">
          <ProgressRing score={score} size={100} strokeWidth={8} />
          <div>
            <h2 className="text-lg font-bold text-white">Social Media Score</h2>
            <p className="text-sm text-gray-400 mt-1">
              Social drives brand awareness and referral amplification — not primary lead gen, but critical for trust.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              💡 Nextdoor is the most underutilized platform for home services with the highest local trust factor.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-800 border border-gray-700 rounded-lg p-1 w-fit">
          {[
            { key: "strategy", label: "Strategy & Guide", icon: List },
            { key: "calendar", label: "Content Calendar", icon: Calendar },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as "strategy" | "calendar")}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {activeTab === "strategy" && (
          <>
            {/* Platform Priority */}
            <div>
              <h2 className="text-base font-semibold text-white mb-3">Platform Priority Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {platformConfig.map((p, i) => (
                  <motion.div
                    key={p.key}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-gray-800 border border-gray-700 rounded-xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{p.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-white">{p.label}</p>
                          <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{p.priority}</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">{p.why}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-xs text-gray-500">📅 {p.freq}</span>
                        </div>
                        <p className="text-xs text-emerald-400 mt-2 bg-emerald-500/5 rounded p-2">
                          💡 {p.tip}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Content Ideas */}
            <div>
              <h2 className="text-base font-semibold text-white mb-3">Content That Drives Leads</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Content Type</th>
                      <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Format</th>
                      <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Platform</th>
                      <th className="text-left text-xs text-gray-500 font-medium pb-2 pr-4">Engagement</th>
                      <th className="text-left text-xs text-gray-500 font-medium pb-2">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {contentIdeas.map((idea, i) => (
                      <tr key={i} className="border-b border-gray-800">
                        <td className="py-2 pr-4 text-gray-200 font-medium text-xs">{idea.title}</td>
                        <td className="py-2 pr-4 text-gray-400 text-xs">{idea.type}</td>
                        <td className="py-2 pr-4 text-gray-400 text-xs">{idea.platform}</td>
                        <td className="py-2 pr-4 text-xs">{idea.engagement}</td>
                        <td className="py-2 text-gray-500 text-xs">{idea.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Checklist */}
            <div>
              <h2 className="text-base font-semibold text-white mb-3">Social Media Checklist</h2>
              <div className="space-y-4">
                {Object.entries(grouped).map(([category, items]) => (
                  <div key={category}>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{category}</p>
                    <div className="space-y-1.5">
                      {items.map((item) => (
                        <ChecklistItemRow
                          key={item.id}
                          item={item}
                          onToggle={(id) => toggleChecklistItem(clientId, "social", id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post Templates */}
            <div>
              <h2 className="text-base font-semibold text-white mb-3">Copy-Paste Post Templates</h2>
              <div className="space-y-3">
                {[
                  { label: "Spring Flood Season (March-May)", text: `🌧️ Spring flooding season is here in ${client.city}. If you experience water damage — don't wait. Fast response prevents mold and structural damage.\n\n✅ 24/7 emergency response\n✅ Insurance claim assistance\n✅ Licensed & certified team\n\nSave this number: ${client.phone}\n\n#WaterDamage #${client.city} #RehabRestoration` },
                  { label: "Emergency Service Post", text: `🚨 Water damage emergency? We respond in under 60 minutes.\n\nOur team is standing by 24/7 for:\n• Burst pipes\n• Basement flooding\n• Storm damage\n• Sewage backup\n\nDon't let water damage sit — every hour increases the damage. Call us now: ${client.phone}\n\n#EmergencyRestoration #${client.city}` },
                  { label: "Nextdoor Recommendation Response", text: `Hi neighbors! ${client.businessName} here — we're a local ${client.city} restoration company serving this community for years. We handle water damage, fire damage, and mold remediation with a 24/7 response team. Happy to answer any questions or give a free estimate. Feel free to message us or call ${client.phone}.` },
                ].map((tmpl, i) => (
                  <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-semibold text-gray-300">{tmpl.label}</p>
                      <button
                        onClick={() => copy(tmpl.text, i)}
                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"
                      >
                        {copiedIdx === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedIdx === i ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <pre className="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed font-sans">{tmpl.text}</pre>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === "calendar" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-semibold text-white">Weekly Content Calendar</h2>
                <p className="text-xs text-gray-500 mt-0.5">Drag-and-drop planner for weekly social posts. Auto-populated with recommended content.</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {Object.entries(PLATFORM_COLORS).map(([p, cls]) => (
                  <span key={p} className={`text-xs px-2 py-0.5 rounded-full border ${cls}`}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <div key={day} className="min-h-[200px]">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 text-center">{day}</div>
                  <div className="space-y-1.5">
                    {postsByDay[day].map((post) => (
                      <div
                        key={post.id}
                        className={`rounded-lg border p-2 text-xs group relative ${PLATFORM_COLORS[post.platform] || "bg-gray-700 text-gray-300 border-gray-600"}`}
                      >
                        <div className="font-medium capitalize text-[10px] opacity-70 mb-0.5">{post.platform} · {post.type}</div>
                        <div className="leading-tight">{post.topic}</div>
                        <button
                          onClick={() => removePost(post.id)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    {addingPost === day ? (
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-2 space-y-1.5">
                        <select
                          value={newPost.platform}
                          onChange={(e) => setNewPost((p) => ({ ...p, platform: e.target.value }))}
                          className="w-full bg-gray-900 text-xs text-white border border-gray-600 rounded px-1 py-0.5 focus:outline-none"
                        >
                          {Object.keys(PLATFORM_COLORS).map((pl) => (
                            <option key={pl} value={pl}>{pl.charAt(0).toUpperCase() + pl.slice(1)}</option>
                          ))}
                        </select>
                        <select
                          value={newPost.type}
                          onChange={(e) => setNewPost((p) => ({ ...p, type: e.target.value }))}
                          className="w-full bg-gray-900 text-xs text-white border border-gray-600 rounded px-1 py-0.5 focus:outline-none"
                        >
                          {["Post", "Photo", "Video", "Reel", "Story"].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          value={newPost.topic}
                          onChange={(e) => setNewPost((p) => ({ ...p, topic: e.target.value }))}
                          placeholder="Post topic..."
                          className="w-full bg-gray-900 text-xs text-white border border-gray-600 rounded px-1 py-0.5 focus:outline-none placeholder-gray-600"
                          onKeyDown={(e) => e.key === "Enter" && addPost(day)}
                          autoFocus
                        />
                        <div className="flex gap-1">
                          <button onClick={() => addPost(day)} className="flex-1 bg-blue-600 text-white text-[10px] rounded py-0.5">Add</button>
                          <button onClick={() => setAddingPost(null)} className="flex-1 bg-gray-700 text-gray-300 text-[10px] rounded py-0.5">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingPost(day)}
                        className="w-full flex items-center justify-center gap-1 text-[10px] text-gray-600 hover:text-gray-400 border border-dashed border-gray-700 hover:border-gray-600 rounded-lg py-1.5 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Summary */}
            <div className="mt-6 bg-gray-800 border border-gray-700 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Weekly Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(PLATFORM_COLORS).map(([platform, cls]) => {
                  const count = calendarPosts.filter((p) => p.platform === platform).length;
                  return (
                    <div key={platform} className={`rounded-lg border p-3 text-center ${cls}`}>
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-[10px] capitalize opacity-70 mt-0.5">{platform}</div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 text-xs text-gray-500">
                Total: <span className="text-white font-medium">{calendarPosts.length} posts/week</span>
                {" · "}Recommended min: <span className="text-amber-400">8 posts/week</span>
                {" · "}
                {calendarPosts.length >= 12
                  ? <span className="text-emerald-400">On track!</span>
                  : <span className="text-orange-400">Add {12 - calendarPosts.length} more posts</span>}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
