import { ChecklistItem } from "../types";

// ── GBP Checklist ─────────────────────────────────────────────
export const gbpChecklist: ChecklistItem[] = [
  // Critical
  { id: "gbp-01", category: "Profile Completeness", title: "Business name matches legal name exactly", description: "NO keyword stuffing — Google actively penalizes business names that include extra keywords. Use your exact legal/registered business name.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "gbp-02", category: "Profile Completeness", title: "Primary category set to highest-revenue service", description: "Choose the single category that best represents your main service (e.g., 'Water Damage Restoration Service', 'HVAC Contractor', 'Plumber'). This is the most impactful category setting.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "gbp-03", category: "Profile Completeness", title: "All relevant secondary categories added", description: "Add every secondary category that applies to your services. More categories = more searches you can appear in.", priority: "critical", completed: false, scoreWeight: 6 },
  { id: "gbp-04", category: "Profile Completeness", title: "Business description uses full 750 characters", description: "Write a keyword-rich description that naturally mentions your services, service area, and key differentiators. Use the full 750-character limit.", priority: "critical", completed: false, scoreWeight: 6 },
  { id: "gbp-05", category: "Profile Completeness", title: "Phone number matches website and all directories EXACTLY", description: "Your NAP (Name, Address, Phone) must be 100% identical across every platform. Even formatting differences (dashes vs dots) signal inconsistency to Google.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "gbp-06", category: "Profile Completeness", title: "Website URL verified and working", description: "Make sure the linked website URL resolves correctly, loads fast, and the page is the correct landing page (not a 404 or redirect chain).", priority: "critical", completed: false, scoreWeight: 4 },
  { id: "gbp-07", category: "Profile Completeness", title: "Complete service area added (all cities + zip codes)", description: "Add every city and zip code in your service area. This defines where you can appear in 'near me' searches.", priority: "critical", completed: false, scoreWeight: 6 },
  { id: "gbp-08", category: "Profile Completeness", title: "All hours set including holiday hours", description: "Incomplete hours signal to Google and AI that the profile is unmaintained. Set holiday hours proactively to avoid 'may have holiday hours' warning.", priority: "critical", completed: false, scoreWeight: 4 },
  // High
  { id: "gbp-09", category: "Profile Completeness", title: "All services listed with individual descriptions", description: "Add each service as a separate item with a unique description. This helps Google understand your full service scope.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "gbp-10", category: "Profile Completeness", title: "Pricing added where applicable", description: "Adding price ranges builds trust and filters out unqualified leads. Even 'Starting at $X' is better than nothing.", priority: "high", completed: false, scoreWeight: 3 },
  { id: "gbp-11", category: "Profile Completeness", title: "All business attributes filled", description: "Fill every applicable attribute: 24/7 availability, emergency services, veteran-led, women-led, free estimates, financing available, etc.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "gbp-12", category: "Profile Completeness", title: "'From the business' description completed", description: "This is your editorial section — use it to highlight your story, values, and what makes you different. AI pulls from this section.", priority: "high", completed: false, scoreWeight: 3 },
  { id: "gbp-13", category: "Profile Completeness", title: "Q&A pre-populated with 8+ questions and answers", description: "Don't wait for customers to ask questions. Pre-seed the Q&A section with common questions. Answers must be consistent with website and reviews.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "gbp-14", category: "Profile Completeness", title: "GBP linked to LSA account", description: "Connect your Google Business Profile to your Local Service Ads account. This syncs reviews and strengthens both profiles.", priority: "high", completed: false, scoreWeight: 3 },
  // Photos
  { id: "gbp-15", category: "Photos", title: "10+ high-quality photos uploaded", description: "Profiles with 10+ photos get 45% more direction requests and 31% more website clicks. Quality matters — no blurry or dark photos.", priority: "critical", completed: false, scoreWeight: 6 },
  { id: "gbp-16", category: "Photos", title: "Team/technician photos uploaded", description: "Photos of real team members dramatically increase trust and conversion. Customers want to know who is coming to their home.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "gbp-17", category: "Photos", title: "Branded vehicle/truck photos", description: "Show your branded trucks — this signals professionalism and makes you look like an established operation.", priority: "high", completed: false, scoreWeight: 3 },
  { id: "gbp-18", category: "Photos", title: "Before/after project photos (min 3 sets)", description: "Before/after photos are the highest-converting photo type. Show the transformation clearly. Include job type in file name.", priority: "critical", completed: false, scoreWeight: 5 },
  { id: "gbp-19", category: "Photos", title: "Work-in-progress shots", description: "Photos of work in progress demonstrate you're active and show customers what to expect during a job.", priority: "medium", completed: false, scoreWeight: 2 },
  { id: "gbp-20", category: "Photos", title: "License/certification plaques photographed", description: "Photo of your actual license or certification plaques adds a powerful trust signal. Customers look for this.", priority: "medium", completed: false, scoreWeight: 2 },
  { id: "gbp-21", category: "Photos", title: "Cover photo optimized for mobile", description: "The cover photo appears prominently in mobile Maps results. Choose a professional, wide-format photo that displays well in a banner crop.", priority: "medium", completed: false, scoreWeight: 2 },
];

// ── LSA Checklist ─────────────────────────────────────────────
export const lsaChecklist: ChecklistItem[] = [
  { id: "lsa-01", category: "Verification", title: "Background check submitted", description: "Business owner background check is mandatory for Google Verification. Submit via the LSA dashboard.", priority: "critical", completed: false, scoreWeight: 15 },
  { id: "lsa-02", category: "Verification", title: "License documentation uploaded", description: "Upload current trade license documentation. Must match your listed services.", priority: "critical", completed: false, scoreWeight: 15 },
  { id: "lsa-03", category: "Verification", title: "Insurance documentation uploaded", description: "General liability insurance required. Upload current COI.", priority: "critical", completed: false, scoreWeight: 10 },
  { id: "lsa-04", category: "Verification", title: "Business registration verified", description: "Business must be registered. Google verifies your state business registration.", priority: "critical", completed: false, scoreWeight: 10 },
  { id: "lsa-05", category: "Verification", title: "GBP account connected to LSA", description: "Linking GBP and LSA syncs your reviews across both platforms, improving LSA ranking.", priority: "critical", completed: false, scoreWeight: 10 },
  // Settings
  { id: "lsa-06", category: "Settings", title: "Bidding set to 'Maximize Leads' (NOT Max Per Lead)", description: "Maximize Leads bidding lets Google's algorithm optimize spend. Max Per Lead bidding typically underperforms.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "lsa-07", category: "Settings", title: "Service area focused and tight", description: "Start with a tight geographic focus. Broader = higher competition. Expand as performance data accumulates.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "lsa-08", category: "Settings", title: "All lead types enabled: calls, messages, direct booking", description: "Enable every lead type Google offers. More channels = more leads. Review message leads daily.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "lsa-09", category: "Settings", title: "Lead dispute process documented", description: "Document when and how to dispute: wrong number, out-of-area, duplicate calls, wrong service. Dispute within 30 days.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "lsa-10", category: "Settings", title: "Every lead marked as booked or not booked", description: "This is critical. Marking leads as booked/not booked trains Google's algorithm. Aim for 80%+ booking rate signal.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "lsa-11", category: "Settings", title: "Seasonal budget increases scheduled", description: "Plan budget increases 2-3 weeks before peak season. Don't wait until demand spikes.", priority: "medium", completed: false, scoreWeight: 3 },
  { id: "lsa-12", category: "Settings", title: "Separate account if multiple locations", description: "Each location should have its own LSA account for proper geographic targeting and lead attribution.", priority: "medium", completed: false, scoreWeight: 3 },
];

// ── SEO Checklist ─────────────────────────────────────────────
export const seoChecklist: ChecklistItem[] = [
  // Homepage
  { id: "seo-01", category: "Homepage", title: "Primary keyword in H1 tag", description: "The H1 should clearly state what you do and where. Example: 'Denver's Trusted Water Damage Restoration Company'", priority: "critical", completed: false, scoreWeight: 7 },
  { id: "seo-02", category: "Homepage", title: "Phone number in header, clickable on mobile", description: "Phone number must be prominent, above the fold, and use tel: link for mobile tap-to-call functionality.", priority: "critical", completed: false, scoreWeight: 5 },
  { id: "seo-03", category: "Homepage", title: "Service area mentioned in first 100 words", description: "Google needs to understand your geographic relevance quickly. Mention your primary city in the first paragraph.", priority: "critical", completed: false, scoreWeight: 5 },
  { id: "seo-04", category: "Homepage", title: "Trust signals above the fold", description: "Years in business, review stars, certification badges should be visible without scrolling on desktop.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "seo-05", category: "Homepage", title: "Meta title includes city + service", description: "Example: 'Water Damage Restoration Denver CO | Rehab Restoration'. Under 60 characters.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "seo-06", category: "Homepage", title: "Meta description has CTA", description: "Include a call to action. Example: 'Call now for 24/7 emergency response. Free estimates. Licensed & insured.'", priority: "medium", completed: false, scoreWeight: 3 },
  // Schema
  { id: "seo-07", category: "Schema Markup", title: "LocalBusiness schema implemented", description: "JSON-LD LocalBusiness schema must include: name, address, phone, hours, geo, service area, aggregate rating.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "seo-08", category: "Schema Markup", title: "Service schema on service pages", description: "Each service page should have Service schema markup with name, description, provider, and area served.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "seo-09", category: "Schema Markup", title: "FAQPage schema on FAQ sections", description: "FAQ schema is one of the highest-value schema types for AI Overviews. Implement on every FAQ section.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "seo-10", category: "Schema Markup", title: "AggregateRating schema implemented", description: "Pulls star ratings into Google search results. Requires accurate review count and average rating.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "seo-11", category: "Schema Markup", title: "Schema validated with Rich Results Test", description: "Test every schema implementation at search.google.com/test/rich-results. Fix all errors before launch.", priority: "critical", completed: false, scoreWeight: 4 },
  { id: "seo-12", category: "Schema Markup", title: "No schema errors in Search Console", description: "Check Google Search Console > Enhancements monthly for schema errors and warnings.", priority: "high", completed: false, scoreWeight: 3 },
  // Links
  { id: "seo-13", category: "Link Building", title: "Local Chamber of Commerce listing", description: "Chamber listings are high-DA, Google-trusted local citations. Membership is usually $200-500/year and worth it.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "seo-14", category: "Link Building", title: "Industry association listing", description: "For restoration: IICRC, RIA. For HVAC: PHCC, ACCA. These are trusted niche-specific signals.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "seo-15", category: "Link Building", title: "Supplier 'find a pro' page", description: "Get listed on supplier/manufacturer contractor pages (e.g., Carrier dealer locator, GAF certified contractor).", priority: "medium", completed: false, scoreWeight: 3 },
];

// ── AI Search Checklist ───────────────────────────────────────
export const aiSearchChecklist: ChecklistItem[] = [
  // Entity
  { id: "ai-01", category: "Entity Optimization", title: "Business name identical across all platforms", description: "Your business name must be EXACTLY the same on website, GBP, Yelp, BBB, Facebook, and all directories. No abbreviations, no variations.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "ai-02", category: "Entity Optimization", title: "GBP linked to and from website", description: "Your website should link to your GBP (via 'Leave a Review' link) and GBP should link to your website.", priority: "critical", completed: false, scoreWeight: 6 },
  { id: "ai-03", category: "Entity Optimization", title: "All social profiles link to website", description: "Every social media profile (Facebook, Instagram, LinkedIn, YouTube) should link back to your website.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "ai-04", category: "Entity Optimization", title: "Google Knowledge Panel claimed", description: "If a Knowledge Panel appears when searching your business name, claim and verify it via Google Search Console.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "ai-05", category: "Entity Optimization", title: "NAP 100% consistent across 40+ citations", description: "Every citation must have identical Name, Address, Phone formatting. Inconsistency weakens entity signals.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "ai-06", category: "Entity Optimization", title: "'About' page with owner name, history, and credentials", description: "Your About page is a primary entity signal. Include: owner name, years in business, certifications, service area, business history.", priority: "high", completed: false, scoreWeight: 5 },
  // E-E-A-T Experience
  { id: "ai-07", category: "E-E-A-T: Experience", title: "About Us page with real owner/tech photos", description: "Real photos of the owner and team dramatically improve trust. No stock photos — AI can detect generic images.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "ai-08", category: "E-E-A-T: Experience", title: "First-person content with experience statements", description: "Content that says 'In our 8 years restoring Denver homes...' signals genuine experience to AI evaluators.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "ai-09", category: "E-E-A-T: Experience", title: "Before/after photos and case studies on website", description: "Visual proof of work is one of the strongest experience signals. Include project details and outcomes.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "ai-10", category: "E-E-A-T: Experience", title: "Video of work being performed", description: "Video content showing actual work is the gold standard of experience signals. YouTube + embedded on site.", priority: "medium", completed: false, scoreWeight: 3 },
  // E-E-A-T Expertise
  { id: "ai-11", category: "E-E-A-T: Expertise", title: "Trade certifications prominently displayed", description: "Display certifications visibly: IICRC for restoration, NATE for HVAC, etc. Include license numbers.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "ai-12", category: "E-E-A-T: Expertise", title: "Author bios with credentials on blog posts", description: "Blog posts authored by credentialed team members signal expertise to both Google and AI models.", priority: "medium", completed: false, scoreWeight: 3 },
  { id: "ai-13", category: "E-E-A-T: Expertise", title: "Technical, specific FAQ content", description: "FAQs that answer nuanced trade questions (not generic) demonstrate real expertise that AI models recognize.", priority: "high", completed: false, scoreWeight: 4 },
  // E-E-A-T Trustworthiness
  { id: "ai-14", category: "E-E-A-T: Trustworthiness", title: "SSL/HTTPS active", description: "HTTPS is a basic trust signal. Check that all pages serve securely and there are no mixed-content warnings.", priority: "critical", completed: false, scoreWeight: 5 },
  { id: "ai-15", category: "E-E-A-T: Trustworthiness", title: "Privacy policy + Terms of Service pages", description: "Required for trust. Google and AI models look for these pages as signals of a legitimate business.", priority: "high", completed: false, scoreWeight: 3 },
  { id: "ai-16", category: "E-E-A-T: Trustworthiness", title: "Physical address on every page", description: "Display your physical address in the footer of every page. No P.O. boxes — they signal lower legitimacy.", priority: "high", completed: false, scoreWeight: 3 },
  { id: "ai-17", category: "E-E-A-T: Trustworthiness", title: "BBB accreditation active", description: "BBB accreditation is specifically cited by AI models as a trust signal. The annual fee is worth it.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "ai-18", category: "E-E-A-T: Trustworthiness", title: "Responding to 100% of reviews on all platforms", description: "Unanswered reviews signal poor trust. AI models assess this. Respond to every review within 72 hours.", priority: "critical", completed: false, scoreWeight: 5 },
  // Bing/ChatGPT
  { id: "ai-19", category: "Bing / ChatGPT", title: "Bing Places fully claimed and optimized", description: "ChatGPT uses Bing's index. Claim at bing.com/forbusiness (redesigned Oct 2025). Fill every field including amenities.", priority: "critical", completed: false, scoreWeight: 7 },
  { id: "ai-20", category: "Bing / ChatGPT", title: "All amenities filled in Bing Places", description: "Copilot checks specific attributes like hasWiFi when answering queries. Fill every field available.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "ai-21", category: "Bing / ChatGPT", title: "IndexNow enabled on website", description: "IndexNow notifies Bing/Google instantly when content is updated. Free to implement. Critical for fresh AI citations.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "ai-22", category: "Bing / ChatGPT", title: "Bing Webmaster Tools set up", description: "Set up Bing Webmaster Tools and check the AI Performance report (launched Feb 2026) to see AI citation activity.", priority: "high", completed: false, scoreWeight: 4 },
  // AI Content
  { id: "ai-23", category: "AI Content Strategy", title: "FAQ sections have FAQPage schema", description: "FAQPage schema is the #1 schema type for Google AI Overviews. Implement on every page with Q&A content.", priority: "critical", completed: false, scoreWeight: 6 },
  { id: "ai-24", category: "AI Content Strategy", title: "Content has direct answer capsules", description: "Each major section starts with a 40-60 word direct answer to the implied question. AI pulls these for featured answers.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "ai-25", category: "AI Content Strategy", title: "Statistics cited with source links", description: "AI models prefer content that cites data sources. Add citations and links to stats throughout content.", priority: "medium", completed: false, scoreWeight: 3 },
  // Voice
  { id: "ai-26", category: "Voice Search", title: "FAQ pages in natural Q&A format", description: "Voice queries are conversational. FAQs written as natural questions and complete answers rank well for voice.", priority: "high", completed: false, scoreWeight: 4 },
  { id: "ai-27", category: "Voice Search", title: "Local knowledge base content", description: "Content like 'Average cost of water damage restoration in Denver' answers voice queries directly.", priority: "medium", completed: false, scoreWeight: 3 },
];

// ── Reputation Checklist ──────────────────────────────────────
export const reputationChecklist: ChecklistItem[] = [
  { id: "rep-01", category: "Review Generation", title: "Verbal review ask script given to all techs", description: "Every technician should have the verbal ask script memorized or on a card. Practice it until it's natural.", priority: "critical", completed: false, scoreWeight: 15 },
  { id: "rep-02", category: "Review Generation", title: "SMS review request template created", description: "Create the SMS template with client name, direct Google review link, and tech name. Test it first.", priority: "critical", completed: false, scoreWeight: 15 },
  { id: "rep-03", category: "Review Generation", title: "SMS sent within 2 hours of job completion", description: "The 2-hour window has dramatically higher conversion than next-day sends. Set up trigger or reminder.", priority: "critical", completed: false, scoreWeight: 10 },
  { id: "rep-04", category: "Review Generation", title: "48-hour email follow-up configured", description: "Send a follow-up email if no review within 48 hours. Include direct link, make it personal.", priority: "high", completed: false, scoreWeight: 8 },
  { id: "rep-05", category: "Review Generation", title: "5-day final SMS reminder set up", description: "One final SMS at 5 days. After this, do not follow up further — multiple asks feel pushy.", priority: "medium", completed: false, scoreWeight: 5 },
  { id: "rep-06", category: "Monitoring", title: "Responding to 100% of Google reviews", description: "Every review — positive and negative — needs a response. Consumers check response behavior before calling.", priority: "critical", completed: false, scoreWeight: 15 },
  { id: "rep-07", category: "Monitoring", title: "Monitoring all platforms weekly", description: "Check Google, Yelp, Facebook, Angi, and BBB at least once per week for new reviews.", priority: "high", completed: false, scoreWeight: 8 },
  { id: "rep-08", category: "Monitoring", title: "Negative reviews responded to within 24 hours", description: "Negative reviews responded to quickly signal professionalism. Never leave a negative review unanswered.", priority: "critical", completed: false, scoreWeight: 10 },
  { id: "rep-09", category: "Monitoring", title: "Review velocity tracking set up (1-2/week goal)", description: "Track new reviews per week. Alert if no new reviews in 14 days — review velocity impacts LSA ranking.", priority: "high", completed: false, scoreWeight: 7 },
  { id: "rep-10", category: "Platforms", title: "Google review link created and distributed to team", description: "Generate the direct Google review link from GBP dashboard. Share with all team members for easy sending.", priority: "critical", completed: false, scoreWeight: 7 },
];

// ── Ads Checklist ─────────────────────────────────────────────
export const adsChecklist: ChecklistItem[] = [
  { id: "ads-01", category: "Campaign Structure", title: "Branded Search Campaign created and active", description: "Protect your brand name from competitors bidding on it. Usually very low CPC with high CTR.", priority: "high", completed: false, scoreWeight: 8 },
  { id: "ads-02", category: "Campaign Structure", title: "Emergency/Urgent keyword campaign running", description: "Separate high-bid emergency campaign for 'emergency [service] near me' type queries. These convert 3-5x higher.", priority: "critical", completed: false, scoreWeight: 12 },
  { id: "ads-03", category: "Campaign Structure", title: "Service-specific campaigns created", description: "One campaign per major service line. Separate messaging, keywords, and landing pages per service.", priority: "high", completed: false, scoreWeight: 8 },
  { id: "ads-04", category: "Campaign Structure", title: "Remarketing display campaign active", description: "Retarget website visitors with display ads for 30 days. Shows brand credibility and keeps you top of mind.", priority: "medium", completed: false, scoreWeight: 5 },
  { id: "ads-05", category: "Ad Setup", title: "Responsive Search Ads with 12+ headlines", description: "Create RSAs with at least 12 distinct headlines and 4 descriptions. Pin the most critical headline to position 1.", priority: "critical", completed: false, scoreWeight: 10 },
  { id: "ads-06", category: "Ad Setup", title: "Call extensions with tracking number", description: "Add CallRail tracking numbers as call extensions. This is how you attribute phone calls to Google Ads.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "ads-07", category: "Ad Setup", title: "Location extensions linked to GBP", description: "Linking location extensions shows your address in ads and improves local relevance signals.", priority: "high", completed: false, scoreWeight: 6 },
  { id: "ads-08", category: "Ad Setup", title: "Sitelink extensions (4+ links added)", description: "Add links to specific service pages. More extensions = more ad real estate = better CTR.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "ads-09", category: "Ad Setup", title: "Callout extensions added", description: "Add callouts: 'Licensed & Insured', 'Free Estimates', '24/7 Emergency', 'Same Day Service'.", priority: "high", completed: false, scoreWeight: 5 },
  { id: "ads-10", category: "Tracking", title: "Conversion tracking properly configured", description: "Track calls (via CallRail import), form submissions, and booking completions. Smart bidding requires conversion data.", priority: "critical", completed: false, scoreWeight: 10 },
  { id: "ads-11", category: "Tracking", title: "Negative keyword list applied to all campaigns", description: "Add comprehensive negative keyword list: DIY, jobs, careers, free, how to, school, certification, parts, supply, reddit.", priority: "critical", completed: false, scoreWeight: 8 },
  { id: "ads-12", category: "Tracking", title: "Call conversions imported into Google Ads", description: "Import CallRail call data as Google Ads conversions. This enables smart bidding to optimize for actual calls.", priority: "critical", completed: false, scoreWeight: 10 },
];

// ── Social Media Checklist ────────────────────────────────────
export const socialChecklist: ChecklistItem[] = [
  { id: "soc-01", category: "Facebook", title: "Facebook Business Page fully set up", description: "Complete all fields: description, services, hours, phone, website, service area. Enable reviews.", priority: "critical", completed: false, scoreWeight: 15 },
  { id: "soc-02", category: "Facebook", title: "Posting 3-5x per week on Facebook", description: "Facebook is the primary home service buyer platform (ages 35-65). Consistent posting keeps you in local feeds.", priority: "high", completed: false, scoreWeight: 10 },
  { id: "soc-03", category: "Nextdoor", title: "Nextdoor Business Profile created", description: "Set up your free Nextdoor Business Profile. This is the most underutilized platform for home services with the highest local trust.", priority: "critical", completed: false, scoreWeight: 15 },
  { id: "soc-04", category: "Nextdoor", title: "Responding to Recommendations requests on Nextdoor", description: "Check the Recommendations section weekly. When neighbors ask for a [trade], respond quickly with your offer.", priority: "high", completed: false, scoreWeight: 10 },
  { id: "soc-05", category: "Instagram", title: "Instagram Business profile optimized", description: "Professional photo, bio with service + location, link in bio to booking/quote page.", priority: "high", completed: false, scoreWeight: 8 },
  { id: "soc-06", category: "Instagram", title: "Posting Reels 2-3x per week", description: "Reels get dramatically more reach than static posts on Instagram. Before/after transformations perform best.", priority: "high", completed: false, scoreWeight: 8 },
  { id: "soc-07", category: "YouTube", title: "YouTube channel created and branded", description: "Even 1-2 how-to videos on YouTube can rank in Google search results. This is free organic placement.", priority: "medium", completed: false, scoreWeight: 8 },
  { id: "soc-08", category: "Content", title: "Seasonal content calendar planned", description: "Map out seasonal content for the full year aligned to peak demand periods for the trade.", priority: "medium", completed: false, scoreWeight: 6 },
  { id: "soc-09", category: "Content", title: "Before/after content posted regularly", description: "Before/after content is the highest-engagement content type for home services. Post at minimum weekly.", priority: "high", completed: false, scoreWeight: 10 },
  { id: "soc-10", category: "Content", title: "Emergency preparedness content created", description: "'What to do if your pipe bursts' type content is valuable, shareable, and drives brand awareness.", priority: "medium", completed: false, scoreWeight: 5 },
  { id: "soc-11", category: "Advertising", title: "Facebook audience targeting configured (homeowners, 30-65)", description: "Run ads targeting homeowners age 30-65 within service area radius. Start at $15-25/day.", priority: "medium", completed: false, scoreWeight: 5 },
];

// ── Map module names to checklists ────────────────────────────
export const checklistMap: Record<string, ChecklistItem[]> = {
  gbp: gbpChecklist,
  lsa: lsaChecklist,
  seo: seoChecklist,
  aiSearch: aiSearchChecklist,
  reputation: reputationChecklist,
  ads: adsChecklist,
  social: socialChecklist,
};

export function calculateScore(items: ChecklistItem[]): number {
  if (!items.length) return 0;
  const total = items.reduce((sum, i) => sum + i.scoreWeight, 0);
  const earned = items.reduce(
    (sum, i) => sum + (i.completed ? i.scoreWeight : 0),
    0
  );
  return Math.round((earned / total) * 100);
}

export function calculateOverallScore(scores: Record<string, number>): number {
  const weights: Record<string, number> = {
    gbp: 0.25,
    lsa: 0.15,
    seo: 0.2,
    aiSearch: 0.15,
    reputation: 0.15,
    ads: 0.1,
  };
  return Math.round(
    Object.entries(weights).reduce(
      (sum, [key, w]) => sum + (scores[key] || 0) * w,
      0
    )
  );
}
