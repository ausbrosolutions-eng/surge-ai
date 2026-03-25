// ============================================================
// Blueprint AI Marketing — Core Type Definitions
// ============================================================

export type TradeType =
  | "restoration"
  | "hvac"
  | "plumbing"
  | "electrical"
  | "roofing"
  | "landscaping"
  | "pest_control"
  | "cleaning"
  | "painting"
  | "garage_doors"
  | "gutters"
  | "windows"
  | "general";

export type LeadSource =
  | "lsa"
  | "google_ads"
  | "organic"
  | "gbp"
  | "referral"
  | "social"
  | "nextdoor"
  | "yelp"
  | "direct";

export interface ClientScores {
  gbp: number;
  lsa: number;
  seo: number;
  aiSearch: number;
  reputation: number;
  ads: number;
  social: number;
  overall: number;
  [key: string]: number;
}

export interface Client {
  id: string;
  name: string;
  businessName: string;
  trade: TradeType;
  phone: string;
  email: string;
  website: string;
  address: string;
  city: string;
  state: string;
  serviceArea: string[];
  package: "foundation" | "growth" | "domination";
  monthlyRetainer: number;
  adSpend: number;
  startDate: string;
  status: "active" | "onboarding" | "paused" | "prospect";
  gbpUrl: string;
  googleAdsId: string;
  lsaEnabled: boolean;
  notes: string;
  scores: ClientScores;
  createdAt: string;
  updatedAt: string;
}

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  completed: boolean;
  completedAt?: string;
  notes?: string;
  scoreWeight: number;
  learnMoreUrl?: string;
}

export interface BANTScore {
  budget: 0 | 1 | 2;
  authority: 0 | 1 | 2;
  need: 0 | 1 | 2;
  timeline: 0 | 1 | 2;
  total: number;
}

export interface Lead {
  id: string;
  clientId: string;
  name: string;
  phone: string;
  email?: string;
  source: LeadSource;
  serviceRequested: string;
  zipCode: string;
  status: "new" | "contacted" | "qualified" | "booked" | "lost" | "completed";
  urgency: "emergency" | "planned" | "maintenance";
  estimatedValue: number;
  bantScore: BANTScore;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgencyTask {
  id: string;
  clientId?: string;
  title: string;
  description: string;
  category:
    | "gbp"
    | "lsa"
    | "seo"
    | "ads"
    | "content"
    | "reputation"
    | "reporting"
    | "admin";
  priority: "urgent" | "high" | "medium" | "low";
  status: "todo" | "in_progress" | "done";
  dueDate: string;
  assignedTo: string;
  createdAt: string;
  completedAt?: string;
}

export interface ReviewEntry {
  id: string;
  clientId: string;
  platform: "google" | "yelp" | "angi" | "facebook" | "bbb";
  rating: number;
  reviewerName: string;
  reviewText: string;
  datePosted: string;
  responded: boolean;
  responseText?: string;
  responseDate?: string;
  sentiment: "positive" | "neutral" | "negative";
}

export interface KeywordRanking {
  keyword: string;
  position: number;
  change: number;
  url: string;
}

export interface ReportMetrics {
  totalLeads: number;
  leadsPerChannel: Record<string, number>;
  costPerLead: number;
  phoneCallsTracked: number;
  gbpImpressions: number;
  gbpCalls: number;
  gbpDirections: number;
  newReviews: number;
  avgRating: number;
  websiteTraffic: number;
  conversionRate: number;
  adSpend: number;
  roas: number;
  keywordRankings: KeywordRanking[];
}

export interface MonthlyReport {
  id: string;
  clientId: string;
  month: string;
  metrics: ReportMetrics;
  createdAt: string;
}

export interface GBPPost {
  id: string;
  clientId: string;
  date: string;
  type: "whats_new" | "offer" | "event";
  hasCTA: boolean;
  hasPhoto: boolean;
  title?: string;
  notes?: string;
}

export interface LSALead {
  id: string;
  clientId: string;
  date: string;
  serviceType: string;
  leadType: "call" | "message" | "booking";
  status: "booked" | "not_booked" | "pending";
  disputed: boolean;
  disputeReason?: string;
  cost: number;
}

export interface CitationEntry {
  platform: string;
  tier: 1 | 2 | 3;
  status: "not_started" | "in_progress" | "claimed" | "optimized";
  napVerified: boolean;
  url?: string;
  notes?: string;
}

export interface BacklinkEntry {
  id: string;
  clientId: string;
  source: string;
  url: string;
  authority: number;
  dateEarned: string;
  type: "press" | "directory" | "supplier" | "community" | "association";
  notes?: string;
}

export interface ContentGap {
  id: string;
  title: string;
  targetQuery: string;
  aiPlatform: string;
  status: "not_written" | "in_progress" | "published";
  publishedUrl?: string;
  notes?: string;
}

export interface ReviewPlatformStats {
  platform: "google" | "yelp" | "angi" | "facebook" | "bbb";
  rating: number;
  totalReviews: number;
  newThisMonth: number;
  lastUpdated: string;
}

export interface OutreachProspect {
  id: string;
  name: string;
  company: string;
  trade: string;
  city: string;
  phone: string;
  source: "Instagram" | "Cold Email" | "Referral" | "Other";
  status: "New" | "Contacted" | "Replied" | "Call Booked" | "Closed" | "Not Interested";
  notes: string;
  nextFollowUp: string; // ISO date string
  createdAt: string; // ISO date string
}

// Store shape
export interface AgencyStore {
  clients: Client[];
  leads: Lead[];
  tasks: AgencyTask[];
  reviews: ReviewEntry[];
  reports: MonthlyReport[];
  checklists: Record<string, ChecklistItem[]>;
  gbpPosts: GBPPost[];
  lsaLeads: LSALead[];
  citations: Record<string, CitationEntry[]>;
  backlinks: BacklinkEntry[];
  contentGaps: Record<string, ContentGap[]>;
  reviewStats: Record<string, ReviewPlatformStats[]>;
  outreach: OutreachProspect[];
  initialized: boolean;
}
