"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Copy, Check, RefreshCw, FileText, Hash, Mail, MessageSquare, Globe } from "lucide-react";
import { useStore } from "@/lib/store";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Content templates by type
const CONTENT_TYPES = [
  { id: "gbp-post", label: "GBP Post", icon: Globe, color: "text-amber-400", bg: "bg-amber-500/10" },
  { id: "social-post", label: "Social Post", icon: Hash, color: "text-blue-400", bg: "bg-blue-500/10" },
  { id: "blog-outline", label: "Blog Outline", icon: FileText, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { id: "email", label: "Email Campaign", icon: Mail, color: "text-purple-400", bg: "bg-purple-500/10" },
  { id: "review-response", label: "Review Response", icon: MessageSquare, color: "text-pink-400", bg: "bg-pink-500/10" },
  { id: "sms", label: "Review Request SMS", icon: MessageSquare, color: "text-cyan-400", bg: "bg-cyan-500/10" },
];

const GBP_TOPICS = [
  "Spring flooding season — protect your home",
  "Summer AC tip (if applicable)",
  "Fall furnace/HVAC maintenance reminder",
  "Winter pipe protection tips",
  "Before/after project highlight",
  "Team spotlight",
  "New service announcement",
  "Community involvement / local event",
  "Emergency availability reminder",
  "Customer testimonial feature",
  "Certification/award announcement",
  "Storm damage awareness",
];

const SOCIAL_TOPICS = [
  "Weather-triggered emergency alert",
  "Before & after project reveal",
  "\"Did you know?\" educational tip",
  "Day in the life of a technician",
  "Seasonal maintenance reminder",
  "Behind the scenes / equipment feature",
  "Customer video testimonial share",
  "Common disaster prevention tip",
  "Local community shoutout",
  "Team member introduction",
];

const BLOG_TOPICS = [
  "What to do immediately after water damage",
  "Does homeowners insurance cover mold remediation?",
  "How to tell if your home has hidden mold",
  "Crawl space encapsulation cost guide",
  "How long does water damage restoration take?",
  "Fire damage restoration: what to expect",
  "5 signs you have a moisture problem",
  "How to choose a restoration company",
  "Water damage vs flood damage: insurance differences",
  "Mold vs mildew: what's the difference?",
];

const EMAIL_TYPES = [
  "Past customer re-engagement (check-in + Home Shield offer)",
  "Storm season preparation email",
  "Review request follow-up sequence",
  "New service announcement",
  "Seasonal maintenance reminder",
  "Referral program launch email",
  "Thank you + upsell after job completion",
];

// Template generator functions
function generateGBPPost(client: { businessName: string; city: string; phone: string }, topic: string): string {
  const posts: Record<string, string> = {
    "Spring flooding season — protect your home": `🌧️ Spring is here in ${client.city} — and so is flooding season.

If you discover water damage this spring, every hour matters. Water that sits for more than 24 hours can lead to mold growth that's significantly harder and more expensive to remediate.

Here's what to do if you experience flooding:
✅ Turn off electricity to affected areas
✅ Don't walk through standing water
✅ Document everything with photos
✅ Call a certified restoration team immediately

We're available 24/7 at ${client.phone}. IICRC-certified, insurance-approved, and in your neighborhood within hours.

📞 Save this number now — you'll want it when it matters.

#WaterDamage #${client.city.replace(/[^a-zA-Z]/g, "")} #FloodDamage #RestorationExperts`,

    "Before/after project highlight": `The homeowner called us at 11 PM after discovering flooding in their basement. By morning, our team had it fully extracted and drying equipment installed.

This is why we stay available 24/7. Water damage waits for no one.

When disaster strikes, Rehab Restoration is there — fast, certified, and fully insured.

Call us at ${client.phone} or search "${client.businessName}" on Google to see our reviews.

#BeforeAndAfter #WaterDamage #${client.city.replace(/[^a-zA-Z]/g, "")} #Restoration`,

    "Emergency availability reminder": `📞 Reminder: We are available 24 hours a day, 7 days a week, 365 days a year.

Water damage. Fire damage. Mold. Asbestos. Storm damage. We handle it all — and we respond FAST.

Our team is IICRC-certified and fully licensed in ${client.city} and surrounding areas. We work directly with your insurance company so you don't have to.

Save our number: ${client.phone}

One call. We handle everything.

#Emergency24_7 #WaterDamage #${client.city.replace(/[^a-zA-Z]/g, "")} #HomeRestoration`,
  };

  const match = posts[topic];
  if (match) return match;

  // Generic template for other topics
  return `📢 ${topic}

At ${client.businessName}, we're committed to protecting the homes in ${client.city} and surrounding communities.

Whether you're dealing with water damage, fire damage, mold, or just need a trusted restoration partner — we're here when you need us most.

✅ 24/7 Emergency Response
✅ IICRC Certified
✅ Insurance Claim Assistance
✅ Licensed & Insured in ${client.city}

Have questions? Call us at ${client.phone} or visit our Google profile for 100+ verified reviews.

#HomeRestoration #${client.city.replace(/[^a-zA-Z]/g, "")} #${client.businessName.replace(/\s+/g, "")}`;
}

function generateSocialPost(client: { businessName: string; city: string; phone: string; trade: string }, topic: string, platform: string): string {
  const isShort = platform === "Instagram Reels caption" || platform === "TikTok";

  if (topic === "Weather-triggered emergency alert") {
    return isShort
      ? `🚨 Storm just hit ${client.city}? We're on it. 24/7 emergency response — call ${client.phone}. Don't wait. Water damage gets worse every hour. #WaterDamage #Emergency #${client.city.replace(/[^a-zA-Z]/g, "")}`
      : `🚨 Attention ${client.city} homeowners — if last night's storm affected your home, call us NOW.

Water damage that sits for more than 24 hours can develop mold. Mold remediation costs 3–5x more than water mitigation alone.

Our team is dispatched and on the road. We handle:
• Water extraction and structural drying
• Full documentation for your insurance claim
• Mold prevention treatment post-mitigation

We work directly with your adjuster — you do nothing but make one call.

📞 ${client.phone}
⏱️ Average response time: under 60 minutes

#WaterDamage #${client.city.replace(/[^a-zA-Z]/g, "")} #StormDamage #EmergencyRestoration #Insurance`;
  }

  if (topic === "Day in the life of a technician") {
    return `Ever wonder what goes into a full water damage restoration? Here's what a typical day looks like for our team 👇

🚨 6:47 AM — Emergency call. Basement flooding. Customer panicking.
🚐 7:32 AM — Team on site. Assessment complete. Drying equipment going in.
📋 9:15 AM — Insurance adjuster contact made. Documentation submitted.
📸 12:00 PM — Progress photos sent to homeowner via text. They finally exhale.
🌬️ Day 3 — Final moisture readings taken. Below threshold. ✅
🏠 Day 5 — Equipment removed. Air quality certificate issued.
😊 Result — Homeowner gets their home back, and we get a 5-star review.

THIS is why we do what we do.

${client.phone} | 24/7

#Restoration #BehindTheScenes #WaterDamage #${client.city.replace(/[^a-zA-Z]/g, "")}`;
  }

  return `${topic} — ${client.businessName}

Serving ${client.city} and surrounding communities 24/7.

📞 ${client.phone}
⭐ 4.7 stars | 100+ Google reviews

#HomeServices #${client.city.replace(/[^a-zA-Z]/g, "")} #${client.trade}`;
}

function generateBlogOutline(client: { businessName: string; city: string }, topic: string): string {
  const citySlug = client.city.split(",")[0].trim();
  return `BLOG POST OUTLINE
Title: "${topic} in ${citySlug}"
Target Keyword: "${topic.toLowerCase()} ${citySlug.toLowerCase()}"
Word Count Target: 1,000–1,500 words
Author: ${client.businessName}

META DESCRIPTION (155 chars):
"${topic} in ${citySlug}? Learn what to do, what it costs, and how ${client.businessName} can help. Free estimates and 24/7 emergency response."

OUTLINE:
─────────────────────────────────────
H1: ${topic} in ${citySlug}: Everything You Need to Know

Introduction (100–150 words)
• Open with the problem/scenario the reader is experiencing
• Establish authority: "${client.businessName} has handled [X]+ cases in ${citySlug}"
• Brief overview of what this post covers

H2: [Section 1 — The Core Problem]
• What causes this issue
• Warning signs to watch for
• Why acting fast matters (cost/risk implication)

H2: [Section 2 — What To Do First]
• Step-by-step immediate actions
• What NOT to do
• Safety considerations

H2: [Section 3 — The Professional Restoration Process]
• What happens when a professional team arrives
• Timeline expectations
• How insurance typically handles this

H2: [Section 4 — Cost Factors in ${citySlug}]
• Factors that affect cost
• Average price ranges (general, not exact)
• How insurance coverage works

H2: How ${client.businessName} Handles This in ${citySlug}
• Our specific process and certifications
• Why local matters
• What makes us different (IICRC, EPA, response time, insurance liaison)

H2: Frequently Asked Questions
• 4–6 FAQ items as H3s
• Answer each in 2–4 sentences
• Use conversational, question-based language (voice search + AI Overview optimized)

Conclusion + CTA (100 words)
• Summarize key points
• Clear CTA: "Call ${client.businessName} now at [PHONE]"
• Link to contact/booking page

─────────────────────────────────────
INTERNAL LINKS TO ADD:
• Link to main Water Damage page
• Link to Insurance Claims guide
• Link to About/Certifications page

SCHEMA TO ADD:
• Article schema
• FAQPage schema for the FAQ section
• LocalBusiness schema in footer`;
}

function generateEmail(client: { businessName: string; city: string; phone: string }, type: string): string {
  if (type.includes("re-engagement")) {
    return `SUBJECT: We were thinking about your home, [First Name]

Hi [First Name],

It's been [X months] since we helped restore your home after [damage type]. We hope everything has held up perfectly since then.

We wanted to reach out for two reasons:

1. A quick check-in. Have you noticed any moisture, musty smells, or anything that concerns you? Water damage can sometimes reveal itself weeks or months after a job — we want to make sure you're fully protected.

2. We're launching something new: The ${client.businessName} Home Shield.

For just $29/month, Home Shield members get:
✅ Annual crawl space and moisture inspection
✅ Priority emergency response (front of the queue)
✅ 15% discount on all future services
✅ Dedicated member support line

Because you trusted us during one of the most stressful moments of homeownership, we're giving you the first 3 months free.

No commitment. Cancel anytime.

Reply to this email or call us at ${client.phone} to get started.

Talk soon,
[Your Name]
${client.businessName}
${client.phone}

P.S. If you know anyone who recently experienced water, fire, or mold damage, we'd be grateful for the referral. We pay $150 per completed job you send our way.`;
  }

  if (type.includes("storm")) {
    return `SUBJECT: [First Name], is your home protected this storm season?

Hi [First Name],

[Season] storms are here — and in ${client.city}, that means flooding, roof damage, and moisture issues that can be invisible until they're serious.

Here's a quick checklist to protect your home before the next storm:
□ Check your sump pump (test it now, not during a storm)
□ Clear gutters and downspouts
□ Inspect your roof for missing or damaged shingles
□ Check crawl space moisture levels
□ Know your insurance deductible before you need it

If a storm does impact your home, the most important thing you can do is call a certified restoration company within the first 24 hours. Water that sits becomes mold. Mold is 3–5x more expensive than the original water damage.

We're available 24/7 at ${client.phone}.

Stay safe this season,
[Your Name]
${client.businessName}`;
  }

  return `SUBJECT: [Customize subject line for this email type]

Hi [First Name],

[Opening — personalize to the specific situation]

[Main message — value first, pitch second]

[Clear, single call-to-action]

[Signature]
[Your Name]
${client.businessName}
${client.phone}

Note: Customize this template for "${type}" — add specific details, offers, and personalization relevant to your client relationship.`;
}

function generateSMS(client: { businessName: string; phone: string }): string {
  return `SMS TEMPLATE — Review Request (send within 2 hours of job completion)

─── Version 1 (Short) ───
Hi [First Name]! Thanks for trusting ${client.businessName} today. We'd love it if you left us a quick Google review — it takes 30 seconds and means everything to our small team. [GOOGLE REVIEW LINK] — ${client.businessName}

─── Version 2 (Warm) ───
[First Name], thank you for choosing ${client.businessName} during a stressful time. If we earned it, we'd really appreciate a Google review — your experience helps other homeowners in ${"{city}"} know they can trust us. [GOOGLE REVIEW LINK]

─── Version 3 (Follow-up — send Day 5 if no review) ───
Hey [First Name], we hope your home is back to normal! Quick reminder — if you have 30 seconds, a Google review from you would help us more than you know. No pressure at all. [GOOGLE REVIEW LINK] — Team at ${client.businessName}

─── SMS Best Practices ───
• Send within 2 hours of job completion (highest response rate)
• Never send more than 2 follow-ups total
• Always include the direct Google review link (get it from GBP → Share Profile → Copy review link)
• Keep it under 160 characters if possible
• Add your name for a personal touch`;
}

export default function ContentPage({ params }: { params: { id: string } }) {
  const clientId = params.id;
  const { store } = useStore();
  const client = store.clients.find((c) => c.id === clientId);

  const [selectedType, setSelectedType] = useState("gbp-post");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [platform, setPlatform] = useState("Facebook");
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);
  const [customTopic, setCustomTopic] = useState("");

  function getTopics() {
    switch (selectedType) {
      case "gbp-post": return GBP_TOPICS;
      case "social-post": return SOCIAL_TOPICS;
      case "blog-outline": return BLOG_TOPICS;
      case "email": return EMAIL_TYPES;
      case "review-response": return ["Positive review response", "Neutral review response", "Negative review response"];
      case "sms": return ["Review request SMS sequence"];
      default: return [];
    }
  }

  function generate() {
    if (!client) return;
    const topic = customTopic || selectedTopic;
    if (!topic) return;

    const c = { businessName: client.businessName, city: client.city, phone: client.phone, trade: client.trade };

    let output = "";
    switch (selectedType) {
      case "gbp-post":
        output = generateGBPPost(c, topic);
        break;
      case "social-post":
        output = generateSocialPost(c, topic, platform);
        break;
      case "blog-outline":
        output = generateBlogOutline(c, topic);
        break;
      case "email":
        output = generateEmail(c, topic);
        break;
      case "review-response":
        if (topic.includes("Positive")) {
          output = `POSITIVE REVIEW RESPONSE TEMPLATE

"Thank you so much, [Reviewer Name]! We really appreciate you taking the time to share your experience. It means the world to our team to know we were able to help during such a stressful time. We're always here for you — 24/7 — if you ever need us again. We'll pass your kind words along to the crew!"

─── Tips ───
• Always use their name if it's in the review
• Mention a specific detail from their review if possible
• Keep it under 80 words
• Don't add promotional language to review responses`;
        } else if (topic.includes("Negative")) {
          output = `NEGATIVE REVIEW RESPONSE TEMPLATE

"Thank you for sharing your experience, [Name]. We sincerely apologize that this didn't meet your expectations — that's not the standard we hold ourselves to. We'd very much like to make this right. Please reach out to us directly at ${c.phone} so we can address this personally. We take every piece of feedback seriously."

─── Rules for Negative Reviews ───
• Respond within 24 hours — never let it sit
• Acknowledge without admitting fault
• NEVER argue or be defensive
• Always take it offline (give direct phone number)
• Keep response under 100 words
• Never offer refunds or compensation in the response`;
        } else {
          output = `NEUTRAL/MIXED REVIEW RESPONSE TEMPLATE

"Hi [Name], thank you for the feedback and for giving us the opportunity to help with your restoration needs. We're glad [positive aspect from review]. We hear you on [concern from review] — that's something our team is actively working to improve. If there's anything we can do to earn a 5-star experience from you, please give us a call at ${c.phone}."

─── Note ───
Neutral reviews (3–4 stars) are often the most recoverable. A thoughtful, personal response can flip a 3-star to a 5-star if you follow up.`;
        }
        break;
      case "sms":
        output = generateSMS(c);
        break;
    }

    setGenerated(output);
    setCopied(false);
  }

  function copy() {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  if (!client) return <div className="p-6 text-gray-400">Client not found.</div>;

  const topics = getTopics();

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <DashboardHeader title="AI Content Generator" selectedClient={client} />
      <main className="flex-1 p-6 space-y-6">

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-300 font-medium mb-1">✨ Content pre-built for {client.businessName}</p>
          <p className="text-sm text-gray-400">
            All generated content is automatically customized with {client.businessName}'s business name, city ({client.city}), and phone number. Ready to copy-paste or lightly edit.
          </p>
        </div>

        {/* Content type selector */}
        <div>
          <p className="text-sm font-semibold text-white mb-3">Select Content Type</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => { setSelectedType(type.id); setSelectedTopic(""); setGenerated(""); }}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all ${
                  selectedType === type.id
                    ? `${type.bg} border-current ${type.color}`
                    : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600"
                }`}
              >
                <type.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{type.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Topic + options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
            <p className="text-sm font-semibold text-white mb-3">Choose a Topic</p>
            <div className="space-y-1.5 max-h-60 overflow-y-auto mb-3">
              {topics.map((topic) => (
                <button
                  key={topic}
                  onClick={() => { setSelectedTopic(topic); setCustomTopic(""); }}
                  className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                    selectedTopic === topic
                      ? "bg-blue-600/20 text-blue-300 border border-blue-500/30"
                      : "text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
            <div className="border-t border-gray-700 pt-3">
              <p className="text-xs text-gray-500 mb-1.5">Or type a custom topic:</p>
              <input
                value={customTopic}
                onChange={(e) => { setCustomTopic(e.target.value); setSelectedTopic(""); }}
                placeholder="e.g., New commercial property manager partnership"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col">
            <p className="text-sm font-semibold text-white mb-3">Options</p>

            {selectedType === "social-post" && (
              <div className="mb-4">
                <label className="text-xs text-gray-400 block mb-1.5">Platform</label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                >
                  {["Facebook", "Instagram", "Instagram Reels caption", "Nextdoor", "LinkedIn", "TikTok"].map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            )}

            <div className="bg-gray-900 rounded-lg border border-gray-700 p-3 mb-4 flex-1">
              <p className="text-xs text-gray-500 mb-1">Auto-filled from client profile:</p>
              <p className="text-xs text-gray-300">📍 {client.city}</p>
              <p className="text-xs text-gray-300">📞 {client.phone}</p>
              <p className="text-xs text-gray-300">🏢 {client.businessName}</p>
              <p className="text-xs text-gray-300">🔧 {client.trade}</p>
            </div>

            <button
              onClick={generate}
              disabled={!selectedTopic && !customTopic}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Generate Content
            </button>
          </div>
        </div>

        {/* Output */}
        {generated && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800 border border-gray-700 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">Generated Content</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={generate}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-sans">{generated}</pre>
          </motion.div>
        )}

        {/* Content calendar reminder */}
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
          <p className="text-sm font-semibold text-white mb-2">📅 Content Calendar Tip</p>
          <p className="text-sm text-gray-400">
            Generate 4–8 pieces at once and schedule them in batches. GBP posts should go live on Tuesday–Thursday for highest engagement. Social posts before 9 AM or after 6 PM perform best for home service audiences on Facebook.
          </p>
        </div>
      </main>
    </div>
  );
}
