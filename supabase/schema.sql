-- ============================================================
-- Blueprint AI Marketing — Supabase Schema
-- Run this in the Supabase SQL Editor to create all tables
-- ============================================================

-- Clients
CREATE TABLE IF NOT EXISTS clients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL DEFAULT '',
  business_name TEXT NOT NULL DEFAULT '',
  trade TEXT NOT NULL DEFAULT 'general',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  website TEXT DEFAULT '',
  address TEXT DEFAULT '',
  city TEXT DEFAULT '',
  state TEXT DEFAULT '',
  service_area TEXT[] DEFAULT '{}',
  package TEXT NOT NULL DEFAULT 'foundation',
  monthly_retainer NUMERIC DEFAULT 0,
  ad_spend NUMERIC DEFAULT 0,
  start_date TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'active',
  gbp_url TEXT DEFAULT '',
  google_ads_id TEXT DEFAULT '',
  lsa_enabled BOOLEAN DEFAULT false,
  notes TEXT DEFAULT '',
  scores JSONB DEFAULT '{"gbp":0,"lsa":0,"seo":0,"aiSearch":0,"reputation":0,"ads":0,"social":0,"overall":0}'::jsonb,
  created_at TEXT DEFAULT '',
  updated_at TEXT DEFAULT ''
);

-- Checklists (items stored as JSONB array per client+module)
CREATE TABLE IF NOT EXISTS checklists (
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  module TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  PRIMARY KEY (client_id, module)
);

-- Leads
CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  source TEXT DEFAULT 'direct',
  service_requested TEXT DEFAULT '',
  zip_code TEXT DEFAULT '',
  status TEXT DEFAULT 'new',
  urgency TEXT DEFAULT 'planned',
  estimated_value NUMERIC DEFAULT 0,
  bant_score JSONB DEFAULT '{"budget":0,"authority":0,"need":0,"timeline":0,"total":0}'::jsonb,
  notes TEXT DEFAULT '',
  created_at TEXT DEFAULT '',
  updated_at TEXT DEFAULT ''
);

-- Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT DEFAULT '',
  category TEXT DEFAULT 'admin',
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'todo',
  due_date TEXT DEFAULT '',
  assigned_to TEXT DEFAULT '',
  created_at TEXT DEFAULT '',
  completed_at TEXT
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  platform TEXT DEFAULT 'google',
  rating NUMERIC DEFAULT 5,
  reviewer_name TEXT DEFAULT '',
  review_text TEXT DEFAULT '',
  date_posted TEXT DEFAULT '',
  responded BOOLEAN DEFAULT false,
  response_text TEXT DEFAULT '',
  response_date TEXT DEFAULT '',
  sentiment TEXT DEFAULT 'positive'
);

-- Monthly Reports
CREATE TABLE IF NOT EXISTS reports (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  month TEXT DEFAULT '',
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TEXT DEFAULT ''
);

-- GBP Posts
CREATE TABLE IF NOT EXISTS gbp_posts (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  date TEXT DEFAULT '',
  type TEXT DEFAULT 'whats_new',
  has_cta BOOLEAN DEFAULT false,
  has_photo BOOLEAN DEFAULT false,
  title TEXT DEFAULT '',
  notes TEXT DEFAULT ''
);

-- LSA Leads
CREATE TABLE IF NOT EXISTS lsa_leads (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  date TEXT DEFAULT '',
  service_type TEXT DEFAULT '',
  lead_type TEXT DEFAULT 'call',
  status TEXT DEFAULT 'pending',
  disputed BOOLEAN DEFAULT false,
  dispute_reason TEXT DEFAULT '',
  cost NUMERIC DEFAULT 0
);

-- Citations (unique per client + platform)
CREATE TABLE IF NOT EXISTS citations (
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  tier INTEGER DEFAULT 1,
  status TEXT DEFAULT 'not_started',
  nap_verified BOOLEAN DEFAULT false,
  url TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  PRIMARY KEY (client_id, platform)
);

-- Backlinks
CREATE TABLE IF NOT EXISTS backlinks (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  source TEXT DEFAULT '',
  url TEXT DEFAULT '',
  authority INTEGER DEFAULT 0,
  date_earned TEXT DEFAULT '',
  type TEXT DEFAULT 'directory',
  notes TEXT DEFAULT ''
);

-- Content Gaps
CREATE TABLE IF NOT EXISTS content_gaps (
  id TEXT PRIMARY KEY,
  client_id TEXT REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT DEFAULT '',
  target_query TEXT DEFAULT '',
  ai_platform TEXT DEFAULT '',
  status TEXT DEFAULT 'not_written',
  published_url TEXT DEFAULT '',
  notes TEXT DEFAULT ''
);

-- Review Stats (unique per client + platform)
CREATE TABLE IF NOT EXISTS review_stats (
  client_id TEXT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  rating NUMERIC DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  new_this_month INTEGER DEFAULT 0,
  last_updated TEXT DEFAULT '',
  PRIMARY KEY (client_id, platform)
);

-- Outreach Prospects
CREATE TABLE IF NOT EXISTS outreach (
  id TEXT PRIMARY KEY,
  name TEXT DEFAULT '',
  company TEXT DEFAULT '',
  trade TEXT DEFAULT '',
  city TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  source TEXT DEFAULT 'Other',
  status TEXT DEFAULT 'New',
  notes TEXT DEFAULT '',
  next_follow_up TEXT DEFAULT '',
  created_at TEXT DEFAULT ''
);
