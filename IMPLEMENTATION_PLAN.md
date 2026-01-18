# **Implementation Plan: Wicara AI - Full Project Roadmap**

## **Executive Summary**

Dokumen ini adalah master plan teknis untuk membangun **Wicara AI** dari tahap MVP hingga Production-Ready. Fokus utama adalah membangun platform yang scalable, secure, dan ubiquitious (Cloud, Local, Desktop, Mobile) dengan core features: **transkripsi real-time, speaker diarization, dan transformasi output kreatif**.

---

## **1. Product Roadmap & Phasing**

### **🎯 Strategic Objectives**
- **Phase 1 (MVP)**: Demo-ready prototype untuk validasi investor & early adopters. Focus on "It Works" & "Unique Value".
- **Phase 2 (Production)**: Feature parity dengan kompetitor, stability, dan scaling. Focus on "Robustness" & "Retention".
- **Phase 3 (Enterprise)**: Advanced security, collaboration, dan integration ecosystem. Focus on "Expansion".

### **✅ Phase 1: MVP Foundation (Week 1-6) - LEAN DEMO**
*(Features focus: Desktop/Web, Local-first, Core Transcription)*

#### **Core Features (Tier 1 - Basic) - LOCAL FIRST**
1. **Local Audio Processing**
   - Record audio dari browser/mobile (Web Audio API / Capacitor Plugin)
   - Client-side audio processing & noise reduction
   - Support format: WebM/WAV
   - Visual feedback real-time (waveform animation)
   - **Offline-capable untuk existing data**

2. **Client-Side Transcription**
   - **Direct AssemblyAI API calls** dari client (BYOK)
   - Support Bahasa Indonesia & English
   - Real-time processing di client-side
   - Timestamp per segment
   - **No server-side AI processing**

3. **Local Storage First**
   - **IndexedDB / SQLite (Mobile)** untuk primary storage
   - Offline access untuk existing meetings
   - Client-side data management
   - **Supabase untuk encrypted sync saja**

4. **BYOK Management (Enhanced)**
   - User input API keys (AssemblyAI, Gemini, **Ollama Cloud**)
   - **Client-side encryption** dengan AES-GCM
   - Direct API calls dari browser/mobile
   - **Zero-knowledge server architecture**
   - **Secure key storage** dengan PBKDF2 key derivation
   - **Memory protection** untuk API keys
   - **Auto-expire** sensitive data dari memory

5. **Speaker Diarization**
   - Identifikasi speaker otomatis (Speaker 1, Speaker 2, dst)
   - Basic speaker labeling
   - Visual differentiation per speaker

6. **Basic UI/UX**
   - Dashboard untuk list meetings
   - Recording interface yang clean
   - Transcript viewer dengan timestamp
   - Responsive design (mobile-first)

#### **Plugin Features (Demo Only)**
7. **AI Summary Plugin**
   - Generate meeting summary (AI-powered)
   - Transform ke format:
     - Email recap
     - Action items list
     - Meeting minutes
   - **Direct Gemini API calls** dari client (BYOK)

8. **Interactive Transcript Plugin**
   - Click-to-play audio dari transcript
   - Search dalam transcript
   - Export ke multiple formats (PDF, Word, TXT)
   - Share meeting results (encrypted link)

9. **Integration Plugins (Demo)**
   - Slack integration demo
   - Notion database sync
   - Google Calendar events

**Note:** Core platform FREE dengan BYOK. Plugins berbayar untuk enhanced features.

#### **BYOK Features (Bring Your Own Key)**
10. **API Key Management**
    - User input AssemblyAI, Gemini, & **Ollama Cloud** API keys
    - **Unlimited usage** (sesuai user's API quota)
    - Cost calculator untuk transparency
    - Usage monitoring & alerts
    - Secure key storage di Supabase (encrypted)

11. **Plugin Marketplace System (Indonesia First)**
    - **Core Platform**: FREE unlimited transcription dengan BYOK
    - **Productivity Plugins**: AI summaries, action items, email generator (Rp 79.000/bulan)
    - **Integration Plugins**: Slack, Notion, Google Calendar (Rp 49.000-Rp 59.000/bulan)
    - **Advanced Plugins**: Sentiment analysis, speaker ID (Rp 99.000-Rp 109.000/bulan)
    - **Enterprise Plugins**: Team collaboration, compliance (Rp 129.000-Rp 159.000/bulan)
    - **Third-Party Plugins**: Developer ecosystem dengan revenue sharing
    - **Dual Currency**: Rupiah untuk Indonesia, USD untuk international ($1 = Rp 16.000)

### **🔒 Security Requirements (MVP MUST-HAVE)**

#### **Client-Side Security**
- **Content Security Policy (CSP)** untuk XSS prevention
- **API Key Encryption** dengan AES-GCM
- **Secure Memory Management** untuk sensitive data
- **Input Validation & Sanitization**
- **Rate Limiting** untuk Wicara AI API endpoints (auth, settings)
- **Usage Monitoring** untuk external API transparency (BYOK)

#### **Server-Side Security**
- **Enhanced RLS Policies** di Supabase
- **Request Signature Validation**
- **CORS & Origin Validation**
- **Audit Logging** untuk security events
- **Environment Variable Protection**

#### **Network Security**
- **HTTPS Only** (HSTS enforcement)
- **API Call Signing** untuk integrity
- **Origin Validation** untuk prevent abuse
- **Request/Response Encryption**

### **🚀 Phase 2: Production Features (Post-MVP)**
#### **Feature Expansion**
- **Mobile Native Apps**: Android (.apk) & iOS (.ipa) via Capacitor.
- **Docker Deployment**: Containerized version for Enterprise/Self-host.
- **Advanced Integrations**:
  - Slack Bot for meeting summaries.
  - Notion Database Sync.
  - Google Calendar two-way sync.
- **Plugin Marketplace System**:
  - Payment Gateway Integration (Midtrans/Stripe).
  - Public Marketplace UI.
  - Developer Portal.

#### **Technical Hardening**
- Voice fingerprint/biometric speaker ID
- Collaboration hub untuk tim
- Advanced sentiment analysis
- Cloud storage > 7 hari
- Advanced threat detection (ML-based)

---

## **2. Technical Architecture**

### **2.1 Tech Stack**

```
Runtime:
└── Bun 1.1.0+ (Fast, modern JavaScript/TypeScript runtime)

Frontend (Application Core):
├── Vite 6.0 (Build Tool - Fast & Lightweight)
├── React 19 (UI Library)
├── TypeScript 5.7+
├── Ant Design (Rapid UI Development)
├── React Router v7 (Routing)
├── Serwist (PWA Support)

Backend / Services:
├── Supabase (Database + Auth + Storage)
├── Edge Functions (Optional - for specific cloud logic)

Wrappers (Multi-Platform):
├── Electron (Desktop: .exe, .dmg, .AppImage)
├── Capacitor (Mobile: .apk, .ipa)
├── Docker (Server: Container)

AI Services:
├── AssemblyAI (Speech-to-Text + Diarization)
├── Google Gemini 2.5 Flash (Creative Output)
└── Ollama Cloud (New - Open LLM Option)

DevOps / Deployment:
├── Vercel (Cloud Version Hosting)
├── GitHub (Version Control)

Package Management:
├── package.json
├── bun.lockb
└── Biome (Fast linting & formatting)
```

### **2.2 Design System & Color Palette** 🎨

**Design System: Ant Design (Default)**

Kami menggunakan default theme dari Ant Design untuk mempercepat development. Fokus utama adalah fungsionalitas dan kecepatan implementasi.

**Component Color Guidelines:**

- **Primary Color:** Ant Design Default Blue (`#1677ff`)
- **Components:** Standard Ant Design components (Buttons, Inputs, Cards, etc.)
- **Layout:** Ant Design Layout (Header, Sider, Content)
- **Feedback:** Ant Design Message, Notification, and Modal

### **2.3 System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (Web / Desktop / Mobile)              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   Record UI  │  │  Transcript  │  │  Transform   │           │
│  │(PWA/Exe/App) │  │   Viewer     │  │   Output     │           │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│         │                  │                  │                 │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│              Client-Side Processing (Vite/React)        │
│    (Direct API Calls - No Intermediate Server)          │
└─────────┬──────────────────┬──────────────────┬──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────┐  ┌──────────────────────────────┐
│   Supabase (Cloud)  │  │      External AI APIs        │
│  (Auth, Sync, DB)   │  │  ┌────────────┐ ┌──────────┐ │
│                     │  │  │ AssemblyAI │ │  Gemini  │ │
│                     │  │  └────────────┘ └──────────┘ │
└─────────────────────┘  │  ┌──────────────┐            │
                         │  │ Ollama Cloud │            │
                         │  └──────────────┘            │
                         └──────────────────────────────┘
```

### **2.4 Database Schema (Supabase)**

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'basic', -- 'basic' | 'pro'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Meetings Table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  duration_seconds INTEGER,
  audio_url TEXT, -- Supabase Storage URL
  status TEXT DEFAULT 'recording', -- 'recording' | 'processing' | 'completed' | 'failed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Transcripts Table
CREATE TABLE transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  raw_transcript JSONB, -- Full AssemblyAI response
  speakers JSONB, -- [{speaker: 'A', text: '...', start: 0, end: 5}]
  language TEXT DEFAULT 'id',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Creative Outputs Table (Pro Feature)
CREATE TABLE creative_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  meeting_id UUID REFERENCES meetings(id) ON DELETE CASCADE,
  output_type TEXT NOT NULL, -- 'summary' | 'email' | 'action_items' | 'notes'
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- API Keys Table (BYOK Feature) 🔐
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL, -- 'assemblyai' | 'gemini' | 'ollama'
  encrypted_key TEXT NOT NULL, -- Encrypted with user's master key
  encryption_iv TEXT NOT NULL, -- Initialization vector for AES-GCM
  is_active BOOLEAN DEFAULT true,
  last_used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, service_name)
);

-- User Preferences Table
CREATE TABLE user_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  use_own_keys BOOLEAN DEFAULT false, -- Toggle BYOK mode
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Row Level Security (RLS)
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE creative_outputs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies (users can only access their own data)
CREATE POLICY "Users can view own meetings" ON meetings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own meetings" ON meetings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own API keys" ON user_api_keys
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);
```

---

## **3. Development Timeline (4-6 Minggu)**

### **Week 1: Foundation & Setup**
**Goal:** Project setup (Vite + Electron + Capacitor) + Basic UI + Auth

#### **Tasks:**
- [ ] **Setup Deno 2.6.3 / Node** environment
- [ ] Initialize **Vite + React 19** project
- [ ] Configure **Electron** main script
- [ ] Initialize **Capacitor** for Mobile
- [ ] Setup Supabase & Auth
- [ ] Setup PWA
- [ ] Dockerfile creation

#### **Deliverables:**
- ✅ Tech stack ready (Web, Desktop, Mobile ready)
- ✅ Authentication working
- ✅ Responsive UI Skeleton

---

### **Week 2: Audio Recording & Upload**
**Goal:** Capture audio (Web/Desktop/Mobile) + Upload

#### **Tasks:**
- [ ] Web Audio API (Web/Electron)
- [ ] **Capacitor Voice Recorder Plugin** (Mobile)
- [ ] Unified Recording Hook
- [ ] Upload to Supabase Storage
- [ ] Meetings CRUD

#### **Deliverables:**
- ✅ Audio recorder working on all platforms
- ✅ Cloud sync

---

### **Week 3: Transcription & Diarization**
**Goal:** Integrasi AssemblyAI + Transcript UI

#### **Tasks:**
- [ ] AssemblyAI API integration
- [ ] Speaker handling logic
- [ ] Transcript Viewer UI
- [ ] Search functionality

#### **Deliverables:**
- ✅ Transcription pipeline working
- ✅ Searchable transcripts

---

### **Week 4: BYOK & Security** 🔐
**Goal:** Secure Key Management

#### **Tasks:**
- [ ] Web Crypto API implementation
- [ ] Secure Storage (Capacitor Secure Storage for Mobile)
- [ ] API Key Management UI
- [ ] Ollama Cloud support

#### **Deliverables:**
- ✅ Secure BYOK across platforms

---

### **Week 5: AI & Interactive Features**
**Goal:** Creative Output + Player

#### **Tasks:**
- [ ] Gemini & Ollama prompts
- [ ] Output generation UI
- [ ] Interactive Audio Player
- [ ] PDF/TXT Export

#### **Deliverables:**
- ✅ AI Summaries
- ✅ Interactive Player

---

### **Week 6: Packaging & Deployment**
**Goal:** Build ALL artifacts

#### **Tasks:**
- [ ] **Web:** Deploy to Vercel
- [ ] **Desktop:** Build .exe (Electron Builder)
- [ ] **Mobile:** Build .apk (Capacitor Android)
- [ ] **Docker:** Build Image
- [ ] Demo Prep

#### **Deliverables:**
- ✅ **Cloud URL**
- ✅ **Installer (.exe)**
- ✅ **Mobile App (.apk)**
- ✅ **Docker Image**

---

## **4. Demo Scenarios untuk Investor**

### **Scenario 1: True Multi-Platform**
**Duration:** 2-3 menit
1. **Desktop:** Open .exe, start recording.
2. **Mobile:** Open App, show synced meeting (if online) or local recording.
3. **Web:** Access dashboard from browser.

### **Scenario 2: Basic Flow (Tier 1 - Free)**
**Duration:** 3-4 menit
1. **Login**
2. **Record Audio**
3. **View Transcript** (Speaker Diarization)
4. **Search**

### **Scenario 3: BYOK with Ollama Cloud** 🔐
**Duration:** 3-4 menit
1. **Settings** → Input Ollama Cloud API Key.
2. **Toggle BYOK Mode**.
3. **Process Meeting** using Ollama.
4. **Show Cost Savings**.

---

## **5. Success Metrics untuk Demo**

### **Technical Metrics**
- ✅ Transcription accuracy: >90%
- ✅ App Load Time: <1s
- ✅ Consistent Experience across Web, Desktop, Mobile

### **Business Metrics**
- ✅ **Ubiquity:** "We are everywhere our user is."
- ✅ **Flexibility:** Cloud or Local, your choice.

---

## **6. Resource Requirements**

**Solo Developer:**
- **Stack:** Vite, React, Electron, Capacitor.
- **Skills:** TypeScript, React, Cross-platform build tools.

**Services:**
- **Vercel:** Free tier.
- **Supabase:** Free tier.
- **AssemblyAI / Gemini / Ollama:** Pay-as-you-go / Free tiers.

---

## **7. Risk Mitigation**
- **Mobile Native Features:** Use Capacitor community plugins for audio.
- **Build Complexity:** Automate builds with scripts.

---

## **9. Checklist Sebelum Demo**
- [ ] **Web:** Deployed.
- [ ] **Desktop:** .exe ready.
- [ ] **Mobile:** .apk ready on reliable device.
- [ ] **Docker:** Container running.

---

## **11. Quick Start Guide (All-in-One)**

### **Prerequisites**
```bash
bun --version
# Android Studio (for Mobile build)
# Node.js 20+
```

### **Step 1: Setup**
```bash
bun create vite wicara-ai --template react-ts
cd wicara-ai
bun install
bun add antd @supabase/supabase-js react-router-dom@6 @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
npx cap init
```

### **Step 2: Electron Setup**
*(See previous section for Electron main.cjs setup)*

### **Step 3: Capacitor Setup**
```bash
npx cap add android
# npx cap add ios (if macOS)
```

### **Step 4: Build All**
```bash
# Web
bun run build

# Desktop
bun run electron:build

# Mobile
bun run build
npx cap sync
npx cap open android
```

---

## **Conclusion**
Plan ini sekarang mencakup **5 Target Output**:
1. **Cloud Web** (Vercel)
2. **Local Source** (Dev)
3. **Docker Container** (Enterprise)
4. **Desktop .exe** (Electron)
5. **Mobile .apk** (Capacitor)

Semua dibangun dari **satu basis kode (Vite + React)** untuk efisiensi maksimal.
