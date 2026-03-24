import {
  Client,
  Lead,
  AgencyTask,
  ReviewEntry,
  GBPPost,
  ReviewPlatformStats,
  ContentGap,
  CitationEntry,
} from "../types";

// ── Seed Client ──────────────────────────────────────────────
export const seedClient: Client = {
  id: "scott-rehab-restoration",
  name: "Scott",
  businessName: "Rehab Restoration",
  trade: "restoration",
  phone: "(720) 555-0192",
  email: "scott@rehabrestoration.com",
  website: "https://rehabrestoration.com",
  address: "123 Commerce Dr",
  city: "Denver",
  state: "CO",
  serviceArea: [
    "Denver",
    "Lakewood",
    "Arvada",
    "Westminster",
    "Thornton",
    "Englewood",
    "Littleton",
    "Aurora",
  ],
  package: "growth",
  monthlyRetainer: 3000,
  adSpend: 2500,
  startDate: "2026-03-01",
  status: "onboarding",
  gbpUrl: "",
  googleAdsId: "",
  lsaEnabled: false,
  notes:
    "Referral from network. Owner Scott is highly motivated, has been in business 8 years. Primary services: water damage, fire damage, mold remediation. Peak season is spring (flooding) and winter (frozen pipes). Competitors: SERVPRO franchise, local independents.",
  scores: {
    gbp: 0,
    lsa: 0,
    seo: 0,
    aiSearch: 0,
    reputation: 0,
    ads: 0,
    social: 0,
    overall: 0,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// ── Seed Leads ───────────────────────────────────────────────
const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const seedLeads: Lead[] = [
  {
    id: "lead-001",
    clientId: "scott-rehab-restoration",
    name: "Jennifer Walsh",
    phone: "(303) 555-8821",
    email: "jwalsh@email.com",
    source: "gbp",
    serviceRequested: "Emergency water damage — basement flooding",
    zipCode: "80226",
    status: "new",
    urgency: "emergency",
    estimatedValue: 8500,
    bantScore: {
      budget: 2,
      authority: 2,
      need: 2,
      timeline: 1,
      total: 7,
    },
    notes: "Pipe burst overnight. Insurance claim likely. Homeowner, sole decision maker.",
    createdAt: daysAgo(0),
    updatedAt: daysAgo(0),
  },
  {
    id: "lead-002",
    clientId: "scott-rehab-restoration",
    name: "Marcus Thompson",
    phone: "(720) 555-3341",
    source: "organic",
    serviceRequested: "Mold inspection and remediation",
    zipCode: "80203",
    status: "contacted",
    urgency: "planned",
    estimatedValue: 2200,
    bantScore: {
      budget: 1,
      authority: 2,
      need: 2,
      timeline: 0,
      total: 5,
    },
    notes: "Noticed mold in crawl space during renovation. No insurance. Price-sensitive.",
    createdAt: daysAgo(2),
    updatedAt: daysAgo(1),
  },
  {
    id: "lead-003",
    clientId: "scott-rehab-restoration",
    name: "Donna Reyes",
    phone: "(303) 555-7742",
    email: "dreyes@gmail.com",
    source: "referral",
    serviceRequested: "Fire and smoke damage restoration",
    zipCode: "80013",
    status: "qualified",
    urgency: "planned",
    estimatedValue: 15000,
    bantScore: {
      budget: 2,
      authority: 2,
      need: 2,
      timeline: 2,
      total: 8,
    },
    notes: "Kitchen fire last week. Insurance adjuster already visited. Wants to start ASAP.",
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
];

// ── Seed Tasks ───────────────────────────────────────────────
const daysFromNow = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};

export const seedTasks: AgencyTask[] = [
  {
    id: "task-001",
    clientId: "scott-rehab-restoration",
    title: "Claim and verify Rehab Restoration Google Business Profile",
    description:
      "Go to business.google.com, search for Rehab Restoration, claim the listing, and complete phone/postcard verification. Set up as manager, not owner, with agency email.",
    category: "gbp",
    priority: "urgent",
    status: "todo",
    dueDate: daysFromNow(2),
    assignedTo: "Austin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-002",
    clientId: "scott-rehab-restoration",
    title: "Submit to 4 data aggregators",
    description:
      "Submit NAP to Data Axle, Neustar Localeze, Foursquare, and Factual. These distribute to hundreds of directories automatically. Do this before building other citations.",
    category: "seo",
    priority: "high",
    status: "todo",
    dueDate: daysFromNow(5),
    assignedTo: "Austin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-003",
    clientId: "scott-rehab-restoration",
    title: "Set up review request text template for Scott's techs",
    description:
      "Create a simple SMS template Scott's team can copy/paste after job completion. Make it personal, include first name, direct Google review link. Test it on Scott first.",
    category: "reputation",
    priority: "high",
    status: "todo",
    dueDate: daysFromNow(3),
    assignedTo: "Austin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-004",
    clientId: "scott-rehab-restoration",
    title: "Research and document top 3 competitor ad strategies",
    description:
      "Search for 'water damage restoration Denver', 'mold remediation Denver', 'fire damage cleanup Denver'. Screenshot ads, note messaging, pricing, USPs. Use Google Ads Transparency Center.",
    category: "ads",
    priority: "medium",
    status: "todo",
    dueDate: daysFromNow(7),
    assignedTo: "Austin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-005",
    clientId: "scott-rehab-restoration",
    title: "Schedule kickoff call with Scott",
    description:
      "Use the kickoff agenda from the onboarding wizard. Goals: understand business deeply, seasonal patterns, ideal job types, competitive landscape. 60–90 min Zoom or in-person.",
    category: "admin",
    priority: "urgent",
    status: "in_progress",
    dueDate: daysFromNow(1),
    assignedTo: "Austin",
    createdAt: new Date().toISOString(),
  },
];

// ── Seed Reviews ─────────────────────────────────────────────
export const seedReviews: ReviewEntry[] = [
  {
    id: "rev-001",
    clientId: "scott-rehab-restoration",
    platform: "google",
    rating: 5,
    reviewerName: "Patricia G.",
    reviewText:
      "Scott and his team were amazing. They responded within the hour when our basement flooded. Professional, thorough, and explained every step. Highly recommend!",
    datePosted: daysAgo(14),
    responded: true,
    responseText:
      "Thank you so much, Patricia! We're so glad we could help during a stressful situation. Appreciate you taking the time to share your experience!",
    responseDate: daysAgo(13),
    sentiment: "positive",
  },
  {
    id: "rev-002",
    clientId: "scott-rehab-restoration",
    platform: "google",
    rating: 4,
    reviewerName: "David K.",
    reviewText:
      "Great work on the mold remediation. Took a little longer than expected but the result was excellent. Team was professional and courteous.",
    datePosted: daysAgo(21),
    responded: false,
    sentiment: "positive",
  },
  {
    id: "rev-003",
    clientId: "scott-rehab-restoration",
    platform: "google",
    rating: 2,
    reviewerName: "Anonymous",
    reviewText:
      "Showed up late and didn't communicate well about the schedule. Work was okay but the experience was frustrating.",
    datePosted: daysAgo(7),
    responded: false,
    sentiment: "negative",
  },
];

// ── Seed Review Platform Stats ───────────────────────────────
export const seedReviewStats: ReviewPlatformStats[] = [
  {
    platform: "google",
    rating: 4.6,
    totalReviews: 23,
    newThisMonth: 2,
    lastUpdated: new Date().toISOString(),
  },
  {
    platform: "yelp",
    rating: 4.0,
    totalReviews: 8,
    newThisMonth: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    platform: "angi",
    rating: 4.8,
    totalReviews: 11,
    newThisMonth: 1,
    lastUpdated: new Date().toISOString(),
  },
  {
    platform: "facebook",
    rating: 4.5,
    totalReviews: 6,
    newThisMonth: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    platform: "bbb",
    rating: 4.5,
    totalReviews: 3,
    newThisMonth: 0,
    lastUpdated: new Date().toISOString(),
  },
];

// ── Seed GBP Posts ───────────────────────────────────────────
export const seedGBPPosts: GBPPost[] = [
  {
    id: "post-001",
    clientId: "scott-rehab-restoration",
    date: daysAgo(18),
    type: "whats_new",
    hasCTA: true,
    hasPhoto: true,
    title: "Spring Flood Season — We're Ready",
  },
];

// ── Seed Content Gaps ────────────────────────────────────────
export const seedContentGaps: ContentGap[] = [
  {
    id: "cg-001",
    title: "What does water damage restoration cost in Denver?",
    targetQuery: "water damage restoration cost Denver",
    aiPlatform: "ChatGPT, Google AI Overview",
    status: "not_written",
  },
  {
    id: "cg-002",
    title: "How long does mold remediation take?",
    targetQuery: "how long does mold remediation take",
    aiPlatform: "Google AI Overview, Perplexity",
    status: "not_written",
  },
  {
    id: "cg-003",
    title: "Emergency water damage: what to do in the first hour",
    targetQuery: "what to do water damage first hour",
    aiPlatform: "ChatGPT, Google AI Overview",
    status: "not_written",
  },
  {
    id: "cg-004",
    title: "Does insurance cover water damage restoration?",
    targetQuery: "does insurance cover water damage restoration",
    aiPlatform: "Perplexity, Google AI Overview",
    status: "not_written",
  },
  {
    id: "cg-005",
    title: "Best water damage company in Denver",
    targetQuery: "best water damage company Denver",
    aiPlatform: "ChatGPT (high priority — this query ranks in AI)",
    status: "in_progress",
  },
];

// ── Seed Citations ───────────────────────────────────────────
export const seedCitations: CitationEntry[] = [
  { platform: "Google Business Profile", tier: 1, status: "not_started", napVerified: false },
  { platform: "Bing Places for Business", tier: 1, status: "not_started", napVerified: false },
  { platform: "Apple Maps", tier: 1, status: "not_started", napVerified: false },
  { platform: "Yelp", tier: 1, status: "claimed", napVerified: false },
  { platform: "Better Business Bureau (BBB)", tier: 1, status: "not_started", napVerified: false },
  { platform: "Yellow Pages", tier: 1, status: "not_started", napVerified: false },
  { platform: "Facebook Business", tier: 1, status: "claimed", napVerified: false },
  { platform: "Foursquare", tier: 1, status: "not_started", napVerified: false },
  { platform: "Nextdoor Business", tier: 1, status: "not_started", napVerified: false },
  { platform: "Data Axle (aggregator)", tier: 1, status: "not_started", napVerified: false },
  { platform: "Angi / HomeAdvisor", tier: 2, status: "claimed", napVerified: false },
  { platform: "Houzz", tier: 2, status: "not_started", napVerified: false },
  { platform: "Thumbtack", tier: 2, status: "not_started", napVerified: false },
  { platform: "Porch", tier: 2, status: "not_started", napVerified: false },
  { platform: "BuildZoom", tier: 2, status: "not_started", napVerified: false },
  { platform: "Contractor.com", tier: 2, status: "not_started", napVerified: false },
  { platform: "Networx", tier: 2, status: "not_started", napVerified: false },
  { platform: "Neustar Localeze (aggregator)", tier: 2, status: "not_started", napVerified: false },
  { platform: "IICRC Directory", tier: 3, status: "not_started", napVerified: false },
  { platform: "RIA (Restoration Industry Association)", tier: 3, status: "not_started", napVerified: false },
  { platform: "Local Chamber of Commerce", tier: 3, status: "not_started", napVerified: false },
  { platform: "Local BBB Chapter", tier: 3, status: "not_started", napVerified: false },
];
