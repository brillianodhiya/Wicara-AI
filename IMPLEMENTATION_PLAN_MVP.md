# **Implementation Plan: Wicara AI - LEAN DEMO (MVP)**

## **Executive Summary**

Dokumen ini adalah roadmap teknis untuk membangun **Minimum Viable Product (MVP)** dari **Wicara AI** yang siap didemokan kepada investor dalam waktu **4-6 minggu**. Fokus pada fitur inti yang mendemonstrasikan value proposition utama: **transkripsi real-time, speaker diarization, dan transformasi output kreatif**.

---

## **1. MVP Scope Definition**

### **🎯 Tujuan Demo Investor**
- Mendemonstrasikan **teknologi inti** yang berfungsi end-to-end (Cloud & Local)
- Membuktikan **unique value proposition**: Privacy-first + Creative Output
- Menunjukkan **versatility deployment** (Prioritas utama):
  1. **Versi Cloud** (Web accessible) - Main Demo
  2. **Versi Executable (.exe)** - Premium Desktop Experience
  3. **(Optional/Stretch)** Mobile & Docker - Hanya jika waktu memungkinkan
- Memvalidasi **technical feasibility** dengan tech stack modern & flexible

### **✅ Fitur yang HARUS Ada (Must-Have)**

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
   - Dashboard simple
   - Recording interface
   - Transcript viewer
   - Markdown viewer untuk hasil summary


#### **Plugin Features (Demo Focus)**
7. **AI Summary Plugin (Simple)**
   - Generate "Meeting Minutes" button (Gemini/Ollama)
   - Tampilkan hasil text di sebelah transcript
   - Copy to clipboard button

**Note:** Fitur kompleks seperti *Integration Plugins (Slack/Notion)* dan *Marketplace System* di-**HIDE** dulu dari scope Development MVP. Kita hardcode 1-2 fitur AI saja untuk demo.

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

### **Week 2: Core Audio & Transcription**
**Goal:** Record -> Transcribe (The "Aha!" Moment)

#### **Tasks:**
- [ ] Web Audio API (Recorder Hook)
- [ ] AssemblyAI Integration (Simple)
- [ ] Real-time Transcript UI

---

### **Week 3-4: AI Features & Polish**
**Goal:** Summary Generation & Desktop Build

#### **Tasks:**
- [ ] API Key Input UI (BYOK Simple)
- [ ] Gemini/Ollama Integration for Summary
- [ ] Electron Build Configuration
- [ ] Deploy Vercel

#### **Deliverables:**
- ✅ Working AI Summary
- ✅ Web & Desktop App ready

---



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
2. **Desktop .exe** (Electron)

Mobile & Docker dijadikan target "Phase 2" setelah demo sukses.

Semua dibangun dari **satu basis kode (Vite + React)** untuk efisiensi maksimal.
