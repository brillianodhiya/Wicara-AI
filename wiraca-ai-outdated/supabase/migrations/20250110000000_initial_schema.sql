-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'basic', -- 'basic' | 'pro'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meetings Table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_seconds INTEGER,
  audio_url TEXT, -- Supabase Storage URL
  status TEXT DEFAULT 'recording', -- 'recording' | 'processing' | 'completed' | 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transcripts Table
CREATE TABLE IF NOT EXISTS transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  raw_transcript JSONB, -- Full AssemblyAI response
  speakers JSONB, -- [{speaker: 'A', text: '...', start: 0, end: 5}]
  language TEXT DEFAULT 'id',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creative Outputs Table (Pro Feature)
CREATE TABLE IF NOT EXISTS creative_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  output_type TEXT NOT NULL, -- 'summary' | 'email' | 'action_items' | 'notes'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API Keys Table (BYOK Feature) 🔐
CREATE TABLE IF NOT EXISTS user_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL, -- 'assemblyai' | 'gemini'
  encrypted_key TEXT NOT NULL, -- Encrypted with user's master key
  encryption_iv TEXT NOT NULL, -- Initialization vector for AES-GCM
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, service_name)
);

-- User Preferences Table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  use_own_keys BOOLEAN DEFAULT false, -- Toggle BYOK mode
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their own data)
-- Meetings
DROP POLICY IF EXISTS "Users can view own meetings" ON meetings;
CREATE POLICY "Users can view own meetings" ON meetings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own meetings" ON meetings;
CREATE POLICY "Users can insert own meetings" ON meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own meetings" ON meetings;
CREATE POLICY "Users can update own meetings" ON meetings
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own meetings" ON meetings;
CREATE POLICY "Users can delete own meetings" ON meetings
  FOR DELETE USING (auth.uid() = user_id);

-- Transcripts
DROP POLICY IF EXISTS "Users can view own transcripts" ON transcripts;
CREATE POLICY "Users can view own transcripts" ON transcripts
  FOR SELECT USING (
    EXISTS ( SELECT 1 FROM meetings WHERE id = transcripts.meeting_id AND user_id = auth.uid() )
  );

-- API Keys
DROP POLICY IF EXISTS "Users can manage own API keys" ON user_api_keys;
CREATE POLICY "Users can manage own API keys" ON user_api_keys
  FOR ALL USING (auth.uid() = user_id);

-- Preferences
DROP POLICY IF EXISTS "Users can manage own preferences" ON user_preferences;
CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Storage Policies (Need to be applied in Supabase Storage UI or via specific storage SQL extension, but conceptual)
-- Bucket: 'recordings'
-- Policy: Give users access to their own folder (user_id/*)
