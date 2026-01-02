# **Implementation Plan: Wicara AI - Prototype untuk Demo Investor**

## **Executive Summary**

Dokumen ini adalah roadmap teknis untuk membangun **Minimum Viable Product (MVP)** dari **Wicara AI** yang siap didemokan kepada investor dalam waktu **4-6 minggu**. Fokus pada fitur inti yang mendemonstrasikan value proposition utama: **transkripsi real-time, speaker diarization, dan transformasi output kreatif**.

---

## **1. MVP Scope Definition**

### **🎯 Tujuan Demo Investor**
- Mendemonstrasikan **teknologi inti** yang berfungsi end-to-end
- Membuktikan **unique value proposition**: Privacy-first + Creative Output
- Menunjukkan **potensi monetisasi** melalui tiered features
- Memvalidasi **technical feasibility** dengan tech stack modern

### **✅ Fitur yang HARUS Ada (Must-Have)**

#### **Core Features (Tier 1 - Basic) - LOCAL FIRST**
1. **Local Audio Processing**
   - Record audio dari browser (Web Audio API)
   - Client-side audio processing & noise reduction
   - Support format: WebM/WAV
   - Visual feedback real-time (waveform animation)
   - **Offline-capable untuk existing data**

2. **Client-Side Transcription**
   - **Direct AssemblyAI API calls** dari browser (BYOK)
   - Support Bahasa Indonesia & English
   - Real-time processing di client-side
   - Timestamp per segment
   - **No server-side AI processing**

3. **Local Storage First**
   - **IndexedDB** untuk primary storage
   - Offline access untuk existing meetings
   - Client-side data management
   - **Supabase untuk encrypted sync saja**

4. **BYOK Management**
   - User input API keys (AssemblyAI, Gemini)
   - **Client-side encryption** dengan AES-GCM
   - Direct API calls dari browser
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
   - Responsive design (mobile-friendly)

#### **Plugin Features (Demo Only)**
7. **AI Summary Plugin**
   - Generate meeting summary (AI-powered)
   - Transform ke format:
     - Email recap
     - Action items list
     - Meeting minutes
   - **Direct Gemini API calls** dari browser (BYOK)

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
    - User input AssemblyAI & Gemini API keys
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

### **❌ Fitur yang DITUNDA (Out of Scope untuk MVP)**
- Voice fingerprint/biometric speaker ID
- Native integration dengan Zoom/Meet
- Collaboration hub untuk tim
- Advanced sentiment analysis
- Cloud storage > 7 hari
- Mobile native apps
- Advanced threat detection (ML-based)

---

## **2. Technical Architecture**

### **2.1 Tech Stack**

```
Runtime:
└── Bun 1.1.0 (Fast, modern JavaScript/TypeScript runtime)

Frontend:
├── Next.js 16.1.1 (App Router - Latest)
├── React 19 (Server Components)
├── TypeScript 5.9.2
├── TailwindCSS v4 + shadcn/ui
├── Lucide Icons
└── Serwist (PWA)

Backend:
├── Next.js API Routes (Edge Runtime)
├── Supabase (PostgreSQL + Auth + Storage)
└── Edge Functions (untuk AI processing)

AI Services:
├── AssemblyAI (Speech-to-Text + Diarization)
└── Google Gemini 2.5 Flash (Creative Output)

DevOps:
├── Vercel (Hosting + Edge Network)
├── GitHub (Version Control)
└── Supabase (Database + Storage)

Package Management:
├── package.json (Standard Node.js/Bun package format)
├── bun.lockb (Bun lockfile - faster than npm/yarn)
└── Biome (Fast linting & formatting)
```

### **2.2 Design System & Color Palette** 🎨

**Color Palette: "Sapphire Nightfall Whisper"**

```css
/* Primary Colors */
--primary-blue: #0474C4        /* Vibrant Blue - Primary actions, CTAs */
--primary-slate: #5379AE        /* Slate Blue - Secondary elements */
--primary-teal: #2C444C         /* Dark Teal - Backgrounds, cards */

/* Accent Colors */
--accent-light: #A8C4EC         /* Light Blue - Highlights, hover states */
--accent-deep: #06457F          /* Deep Blue - Active states, links */
--accent-dark: #262B40          /* Navy - Text, borders */

/* Semantic Usage */
Primary Button: #0474C4
Secondary Button: #5379AE
Background (Dark): #2C444C
Background (Light): #A8C4EC
Text Primary: #262B40
Text Secondary: #06457F
Accent/Hover: #5379AE
Card Background: #2C444C with opacity
```

**TailwindCSS Configuration:**

```javascript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        sapphire: {
          50: '#A8C4EC',   // Light accent
          100: '#5379AE',  // Slate blue
          500: '#0474C4',  // Primary blue
          700: '#06457F',  // Deep blue
          900: '#262B40',  // Navy dark
        },
        nightfall: {
          DEFAULT: '#2C444C', // Dark teal
          light: '#5379AE',
          dark: '#262B40',
        }
      }
    }
  }
}
```

**Component Color Guidelines:**

- **Headers/Navigation:** `bg-nightfall` (#2C444C) with `text-sapphire-50`
- **Primary Buttons:** `bg-sapphire-500 hover:bg-sapphire-700`
- **Secondary Buttons:** `bg-sapphire-100 hover:bg-sapphire-500`
- **Cards:** `bg-nightfall/80` with `border-sapphire-100`
- **Text:** Primary `text-sapphire-900`, Secondary `text-sapphire-700`
- **Links:** `text-sapphire-700 hover:text-sapphire-500`
- **Active States:** `bg-sapphire-500` or `border-sapphire-500`
- **Waveform Visualization:** Gradient from `#0474C4` to `#5379AE`
- **Speaker Tags:** Rotate through sapphire palette shades

### **2.3 System Architecture Diagram**

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Record UI  │  │  Transcript  │  │  Transform   │  │
│  │   (PWA)      │  │   Viewer     │  │   Output     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         │                  │                  │          │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes (Edge)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Upload Audio │  │ Get Transcript│ │ AI Transform │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼──────────┘
          │                  │                  │
          ▼                  ▼                  ▼
┌─────────────────────┐  ┌──────────────────────────────┐
│   Supabase Storage  │  │      External AI APIs        │
│   (Audio Files)     │  │  ┌────────────┐ ┌──────────┐ │
└─────────────────────┘  │  │ AssemblyAI │ │  Gemini  │ │
                         │  └────────────┘ └──────────┘ │
┌─────────────────────┐  └──────────────────────────────┘
│ Supabase PostgreSQL │
│ ┌─────────────────┐ │
│ │ users           │ │
│ │ meetings        │ │
│ │ transcripts     │ │
│ └─────────────────┘ │
└─────────────────────┘
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
  service_name TEXT NOT NULL, -- 'assemblyai' | 'gemini'
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
**Goal:** Project setup + Basic UI + Authentication

#### **Tasks:**
- [ ] **Setup Deno 2.6.3** environment
- [ ] Initialize Next.js 16.1.1 project dengan Deno
- [ ] Configure deno.json dengan tasks & imports
- [ ] Setup TailwindCSS + shadcn/ui components
- [ ] **Configure custom color palette** (Sapphire Nightfall Whisper)
- [ ] Configure Supabase project (database + auth + storage)
- [ ] Implement authentication flow (email/password + OAuth)
- [ ] Create basic layout & navigation dengan color scheme
- [ ] Setup PWA dengan Serwist
- [ ] Create database schema & RLS policies

#### **Deliverables:**
- ✅ Working authentication system
- ✅ Responsive dashboard layout
- ✅ Database structure ready

---

### **Week 2: Audio Recording & Upload**
**Goal:** Capture audio dari browser + Upload ke storage

#### **Tasks:**
- [ ] Implement Web Audio API untuk recording
- [ ] Create recording UI dengan waveform visualization (sapphire gradient)
- [ ] Add start/stop/pause controls (sapphire-500 buttons)
- [ ] Implement audio file upload ke Supabase Storage
- [ ] Create meetings CRUD operations
- [ ] Add loading states & error handling
- [ ] Test offline recording capability (PWA)

#### **Deliverables:**
- ✅ Functional audio recorder
- ✅ Audio files tersimpan di Supabase Storage
- ✅ Meeting metadata tersimpan di database

---

### **Week 3: Transcription & Diarization**
**Goal:** Integrasi AssemblyAI + Display transcript

#### **Tasks:**
- [ ] Setup AssemblyAI API integration
- [ ] Create API route untuk submit audio ke AssemblyAI
- [ ] Implement webhook handler untuk transcription results
- [ ] Parse speaker diarization data
- [ ] Create transcript viewer component
- [ ] Add speaker color coding
- [ ] Implement timestamp display
- [ ] Add search functionality dalam transcript

#### **Deliverables:**
- ✅ Working transcription pipeline
- ✅ Speaker-separated transcript display
- ✅ Searchable transcript viewer

---

### **Week 4: BYOK Implementation & Security** 🔐
**Goal:** Implement Bring Your Own Key feature dengan client-side encryption

#### **Tasks:**
- [ ] Implement Web Crypto API untuk client-side encryption
- [ ] Create API key management UI (input, toggle, delete)
- [ ] Build encryption/decryption utilities (AES-GCM)
- [ ] Create API key storage system di Supabase
- [ ] Implement key validation (test API keys)
- [ ] Add toggle "Use App Credits" vs "Use My Keys"
- [ ] Create cost calculator/estimator
- [ ] Update API routes untuk support BYOK mode
- [ ] Add security warnings & best practices UI

#### **Deliverables:**
- ✅ Secure BYOK system working end-to-end
- ✅ User dapat input & manage API keys
- ✅ Client-side encryption implemented
- ✅ Cost transparency features

---

### **Week 5: Creative Output & Interactive Player**
**Goal:** Gemini integration + Interactive transcript player

#### **Tasks:**
- [ ] Setup Google Gemini API (with BYOK support)
- [ ] Create prompt templates untuk:
  - Meeting summary
  - Email format
  - Action items extraction
  - Structured notes
- [ ] Implement API route untuk AI transformation
- [ ] Create UI untuk select output type
- [ ] Add copy-to-clipboard functionality
- [ ] Implement audio player component
- [ ] Sync audio playback dengan transcript highlighting
- [ ] Add click-to-seek functionality (click word → jump to timestamp)
- [ ] Implement playback controls (play/pause/speed)

#### **Deliverables:**
- ✅ AI-powered output transformation (BYOK-enabled)
- ✅ Interactive transcript player
- ✅ Multiple output formats available

---

### **Week 6: Testing, Demo Prep & Deployment**
**Goal:** Bug fixes + Demo scenarios + Production deployment

#### **Tasks:**
- [ ] End-to-end testing semua fitur
- [ ] Fix critical bugs
- [ ] Optimize performance (lazy loading, code splitting)
- [ ] Create demo data & scenarios
- [ ] Prepare demo script
- [ ] Setup production environment di Vercel
- [ ] Configure custom domain (optional)
- [ ] Create demo video/screenshots
- [ ] Prepare pitch deck dengan screenshots

#### **Deliverables:**
- ✅ Production-ready prototype
- ✅ Demo scenarios prepared
- ✅ Deployed to production URL

---

## **4. Demo Scenarios untuk Investor**

### **Scenario 1: Basic Flow (Tier 1 - Free)**
**Duration:** 3-4 menit

1. **Login** → Show clean authentication
2. **Start Recording** → Demo audio capture dengan waveform
3. **Stop Recording** → Upload & processing state
4. **View Transcript** → Show speaker diarization
5. **Search Feature** → Demonstrate transcript search

**Key Message:** "Ini adalah fitur gratis yang sudah memberikan value signifikan"

---

### **Scenario 2: Premium Flow (Tier 2 - Pro)**
**Duration:** 4-5 menit

1. **Select Existing Meeting** → Show meeting history
2. **View Transcript** → Interactive player demo
3. **Click Word** → Jump to audio timestamp
4. **Transform Output:**
   - Generate summary
   - Create email recap
   - Extract action items
5. **Copy & Use** → Show how easy to use output

**Key Message:** "Premium features mengubah rapat menjadi aset produktif"

---

### **Scenario 3: BYOK & Cost Control Demo** 🔐
**Duration:** 3-4 menit

1. **Navigate to Settings** → API Keys section
2. **Add API Keys:**
   - Input AssemblyAI key
   - Input Gemini key
   - Show client-side encryption indicator
3. **Toggle BYOK Mode** → "Use My Keys" activated
4. **Cost Calculator** → Show transparency (estimated cost per meeting)
5. **Process Meeting** → Demonstrate using user's own keys
6. **Show Usage Stats** → No app credits consumed

**Key Message:** "User punya kontrol penuh atas biaya & data mereka - ini adalah true data sovereignty"

---

### **Scenario 4: Privacy & Security Demo**
**Duration:** 2-3 menit

1. Show **data encryption** indicator
2. Demonstrate **user isolation** (RLS)
3. Explain **client-side encryption** architecture (API keys never stored plain-text)
4. Show **data deletion** capability

**Key Message:** "Privacy-first bukan hanya marketing, tapi built-in architecture"

---

## **5. Success Metrics untuk Demo**

### **Technical Metrics**
- ✅ Transcription accuracy: >90% untuk Bahasa Indonesia
- ✅ Speaker diarization accuracy: >85%
- ✅ Page load time: <2 detik
- ✅ Audio processing time: <30 detik untuk 5 menit audio
- ✅ Zero critical bugs during demo

### **UX Metrics**
- ✅ Intuitive UI (investor bisa navigate tanpa tutorial)
- ✅ Smooth animations & transitions
- ✅ Mobile responsive (demo di phone juga)
- ✅ Professional design (modern, clean)

### **Business Metrics**
- ✅ Clear differentiation antara Free vs Pro tier
- ✅ Demonstrable ROI untuk Pro users
- ✅ Scalable architecture (explain how it scales)

---

## **6. Resource Requirements**

### **6.1 Development Resources**

**Solo Developer (You):**
- **Time commitment:** 30-40 jam/minggu
- **Skills required:**
  - Next.js/React (intermediate-advanced)
  - TypeScript
  - API integration
  - Database design
  - UI/UX basics

**Tools & Services:**
- **Code Editor:** VS Code
- **Design:** Figma (optional, untuk mockups)
- **Project Management:** GitHub Projects / Notion

### **6.2 API & Service Costs (Estimasi)**

```
Development Phase (1-2 bulan):
├── AssemblyAI: $50-100 (testing)
├── Google Gemini: $20-50 (testing)
├── Supabase: $0 (Free tier cukup)
├── Vercel: $0 (Free tier cukup)
└── Domain: $10-15/tahun (optional)

Total: ~$80-165 untuk development

Demo Phase:
├── Prepare 5-10 sample meetings
├── Cost per demo: ~$2-5
└── Total demo budget: $20-50
```

### **6.3 Infrastructure**

**Development:**
- Local development environment
- Git version control
- Supabase cloud (free tier)

**Production (Demo):**
- Vercel deployment (free tier)
- Supabase production instance (free tier)
- CDN untuk static assets (included in Vercel)

---

## **7. Risk Mitigation**

### **Risk 1: API Costs Overrun**
**Mitigation:**
- Set API rate limits
- Use caching untuk repeated requests
- Monitor usage dengan alerts
- Prepare fallback ke cheaper alternatives

### **Risk 2: Transcription Accuracy Issues**
**Mitigation:**
- Test dengan berbagai aksen Bahasa Indonesia
- Prepare disclaimer untuk accuracy
- Have manual correction feature (future)
- Use high-quality audio samples untuk demo

### **Risk 3: Technical Bugs During Demo**
**Mitigation:**
- Extensive testing sebelum demo
- Prepare backup demo video
- Have pre-recorded meetings ready
- Practice demo scenario 10+ kali

### **Risk 4: Scope Creep**
**Mitigation:**
- Stick to MVP scope strictly
- Document "future features" separately
- Use feature flags untuk incomplete features
- Prioritize ruthlessly

---

## **8. Post-Demo Roadmap (Teaser untuk Investor)**

### **Phase 2: Enhanced Intelligence (Month 3-4)**
- Voice fingerprint untuk speaker identification
- Sentiment analysis
- Meeting effectiveness scoring
- Multi-language support expansion

### **Phase 3: Integration & Collaboration (Month 5-6)**
- Zoom/Google Meet bot integration
- Team collaboration features
- Shared meeting workspace
- Calendar integration

### **Phase 4: Enterprise Features (Month 7+)**
- BYOK (Bring Your Own Key) support
- SSO & advanced security
- Custom branding
- API untuk third-party integration
- Analytics dashboard

---

## **9. Checklist Sebelum Demo**

### **1 Week Before Demo:**
- [ ] All core features working end-to-end
- [ ] UI polished & professional (verify color palette consistency)
- [ ] Create 5 demo meeting samples (various scenarios)
- [ ] Test on different browsers (Chrome, Safari, Firefox)
- [ ] Test on mobile devices
- [ ] Prepare pitch deck dengan screenshots (showcase sapphire theme)
- [ ] Record backup demo video

### **1 Day Before Demo:**
- [ ] Final testing semua demo scenarios
- [ ] Check API keys & quotas
- [ ] Verify production deployment
- [ ] Prepare demo script
- [ ] Test internet connection
- [ ] Charge devices
- [ ] Have backup plan ready

### **During Demo:**
- [ ] **Start dengan BYOK feature** (unique differentiator!)
- [ ] Show cost transparency & control
- [ ] Demo Creative Output transformation
- [ ] Show, don't tell (live demo > slides)
- [ ] Prepare untuk Q&A teknis
- [ ] Have metrics ready (accuracy, speed, etc.)
- [ ] Demonstrate privacy & encryption features
- [ ] End dengan clear call-to-action

---

## **10. Development Best Practices**

### **Code Quality:**
- Use TypeScript untuk type safety
- Write clean, documented code
- Follow Next.js best practices
- Implement error boundaries
- Add proper loading states

### **Performance:**
- Lazy load components
- Optimize images (next/image)
- Use React Server Components
- Implement caching strategies
- Monitor Core Web Vitals

### **Security (BYOK-Enhanced):**
- **Client-side encryption** untuk API keys (Web Crypto API + AES-GCM)
- Never expose API keys di client (even encrypted keys use user-specific master key)
- Implement rate limiting
- Use environment variables untuk app-level keys
- Enable RLS di Supabase
- Sanitize user inputs
- **Zero-knowledge architecture** - server never sees plain-text API keys

### **Testing:**
- Test critical user flows
- Test error scenarios
- Test on slow networks
- Test offline capabilities (PWA)
- Cross-browser testing

---

## **11. Quick Start Guide (Bun + Next.js 16.1.1)**

### **Prerequisites**
```bash
# Verify Bun installation
bun --version
# Should show: bun 1.1.0 or higher

# System Requirements (Next.js 16.1.1):
# - Bun 1.1.0+ (faster than Node.js)
# - Operating systems: macOS, Windows (including WSL), Linux
# - Supported browsers: Chrome 111+, Edge 111+, Firefox 111+, Safari 16.4+
```

### **Step 1: Setup Next.js Project dengan Bun**
```bash
# Create Next.js 16.1.1 project
bun create next-app@latest wicara-ai

# Pilih options (Next.js 16.1.1 defaults):
# ✓ TypeScript: Yes
# ✓ Biome: Yes (faster than ESLint)
# ✓ React Compiler: Yes (optimization)
# ✓ Tailwind CSS: Yes
# ✓ src/ directory: No
# ✓ App Router: Yes (recommended)
# ✓ Customize import alias: No (gunakan @/* default)

cd wicara-ai
```

**Alternative dengan recommended defaults:**
```bash
# Skip prompts dengan recommended defaults
bun create next-app@latest wicara-ai --yes
cd wicara-ai
```

### **Step 2: Configure package.json**
```json
{
  "name": "wicara-ai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbo",
    "build": "next build",
    "start": "next start",
    "lint": "biome check",
    "format": "biome format --write"
  },
  "dependencies": {
    "next": "16.1.1",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.5.0",
    "lucide-react": "^0.460.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "ai": "^4.0.0",
    "@ai-sdk/google": "^1.0.0"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.3.10",
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "^1.0.0",
    "tailwindcss": "^4",
    "postcss": "^8"
  }
}
```

**Note:** Next.js 16.1.1 includes **React Compiler** option untuk automatic optimization.

### **Step 3: Install Dependencies**
```bash
# Install dependencies dengan Bun (sangat cepat)
bun install

# Atau install specific package
bun add @supabase/supabase-js @supabase/ssr lucide-react

# Install dev dependencies
bun add -d @biomejs/biome babel-plugin-react-compiler
```

### **Step 4: Setup shadcn/ui**
```bash
# Initialize shadcn/ui dengan Bun
bunx shadcn-ui@latest init

# Add components
bunx shadcn-ui@latest add button
bunx shadcn-ui@latest add card
bunx shadcn-ui@latest add input
bunx shadcn-ui@latest add label
bunx shadcn-ui@latest add textarea
bunx shadcn-ui@latest add dialog
bunx shadcn-ui@latest add dropdown-menu
bunx shadcn-ui@latest add avatar
```

### **Step 5: Configure Environment Variables**
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

ASSEMBLYAI_API_KEY=your_assemblyai_key
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **Step 6: Configure TailwindCSS dengan Color Palette**
```javascript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sapphire: {
          50: '#A8C4EC',   // Light accent
          100: '#5379AE',  // Slate blue
          500: '#0474C4',  // Primary blue
          700: '#06457F',  // Deep blue
          900: '#262B40',  // Navy dark
        },
        nightfall: {
          DEFAULT: '#2C444C', // Dark teal
          light: '#5379AE',
          dark: '#262B40',
        }
      }
    }
  },
  plugins: [],
};
export default config;
```

### **Step 7: Setup Supabase**
1. Create project di supabase.com
2. Run database migrations (schema dari section 2.4)
3. Configure storage bucket untuk audio files
4. Enable authentication providers

### **Step 8: Start Development dengan Bun**
```bash
# Run development server dengan Turbopack (Next.js 16.1.1)
bun dev

# Open http://localhost:3000
```

**Next.js 16.1.1 Features:**
- ✅ **Turbopack** untuk faster development (default)
- ✅ **React Compiler** untuk automatic optimization
- ✅ **App Router** dengan Server Components
- ✅ **Improved caching** dan performance
- ✅ **Bun runtime** untuk faster execution

### **Step 9: Build untuk Production**
```bash
# Build project (optimized untuk production)
bun run build

# Start production server
bun start
```

### **Step 10: Linting & Code Quality**
```bash
# Run linter (Biome)
bun run lint

# Fix formatting issues
bun run format
```

---

## **12. Folder Structure**

```
wicara-ai/
├── package.json (Bun/Node.js package configuration)
├── bun.lockb (Bun lockfile - binary format)
├── biome.json (Biome linter configuration)
├── .env.local (Environment variables)
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── dashboard/
│   │   ├── meetings/
│   │   │   └── [id]/
│   │   └── settings/
│   │       ├── api-keys/ (BYOK management)
│   │       └── preferences/
│   ├── api/
│   │   ├── meetings/
│   │   ├── transcribe/
│   │   ├── transform/
│   │   ├── keys/ (API key validation & management)
│   │   └── webhooks/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/ (shadcn components)
│   ├── audio/
│   │   ├── AudioRecorder.tsx
│   │   ├── AudioPlayer.tsx
│   │   └── Waveform.tsx
│   ├── transcript/
│   │   ├── TranscriptViewer.tsx
│   │   ├── SpeakerSegment.tsx
│   │   └── TranscriptSearch.tsx
│   ├── transform/
│   │   ├── OutputSelector.tsx
│   │   └── OutputDisplay.tsx
│   ├── settings/ (BYOK components)
│   │   ├── ApiKeyManager.tsx
│   │   ├── KeyInput.tsx
│   │   ├── KeyToggle.tsx
│   │   └── CostCalculator.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Sidebar.tsx
│       └── Footer.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── ai/
│   │   ├── assemblyai.ts
│   │   └── gemini.ts
│   ├── crypto/ (BYOK encryption)
│   │   ├── encryption.ts (AES-GCM utilities)
│   │   ├── keyManager.ts
│   │   └── validator.ts
│   └── utils.ts
├── types/
│   ├── database.ts
│   ├── meeting.ts
│   └── transcript.ts
├── public/
│   └── sw.js (service worker)
├── next.config.js (Next.js configuration)
├── tailwind.config.ts (TailwindCSS configuration)
├── tsconfig.json (TypeScript configuration)
├── node_modules/ (dependencies)
└── .next/ (build output)
```

---

## **13. Key Differentiators untuk Pitch**

### **1. Privacy-First Architecture**
- Client-side encryption
- Zero-knowledge storage
- Data sovereignty (Indonesia)
- RLS untuk isolasi data

### **2. Creative Output (Unique Value)**
- Bukan hanya transkrip, tapi actionable content
- AI-powered transformation
- Multiple output formats
- One-click productivity

### **3. BYOK (Bring Your Own Key) - Game Changer** 🔐
- **User punya kontrol penuh** atas API costs
- **Client-side encryption** - zero-knowledge architecture
- **Cost transparency** dengan calculator
- Toggle mudah antara app credits vs own keys
- **True data sovereignty** - user owns everything

### **4. Modern Tech Stack**
- **Bun 1.1.0** - Ultra-fast JavaScript runtime
- **Next.js 16.1.1** - Latest version dengan Turbopack + React Compiler
- **React 19** Server Components dengan automatic optimization
- **Biome** - Faster linting & formatting (10x ESLint)
- **TailwindCSS v4** - Latest styling framework
- Edge computing untuk speed
- PWA untuk offline capability
- Scalable architecture

**Next.js 16.1.1 + Bun Latest Features:**
- ✅ React Compiler untuk automatic performance optimization
- ✅ Turbopack untuk 53% faster local development
- ✅ Bun runtime untuk 4x faster execution
- ✅ Improved caching & revalidation strategies
- ✅ Enhanced Server Components performance
- ✅ Zero-config Biome integration

### **5. Indonesian Market Focus**
- **Bahasa Indonesia First** - UI/UX dalam Bahasa Indonesia
- **Local Pricing Strategy** - Rupiah pricing yang affordable
- **Cultural Understanding** - Meeting habits & preferences
- **Local Payment Methods** - GoPay, OVO, Dana, Bank Transfer
- **Indonesian Data Sovereignty** - Data storage dalam negeri (future)
- **Local Customer Support** - Bahasa Indonesia support team

---

## **Conclusion**

Implementation plan ini dirancang untuk menghasilkan **working prototype** yang impressive dalam **4-6 minggu**. Fokus pada **core value proposition** dan **demo-able features** yang bisa meyakinkan investor tentang:

1. ✅ **Technical feasibility** - It works!
2. ✅ **Market differentiation** - It's unique!
3. ✅ **Monetization potential** - It can make money!
4. ✅ **Scalability** - It can grow!

**Next Steps:**
1. Review plan ini dan adjust sesuai kebutuhan
2. Setup development environment (Deno 2.6.3 + Next.js 16.1.1)
3. Start Week 1 tasks
4. Maintain momentum dengan daily progress tracking

**References:**
- [Next.js 16.1.1 Documentation](https://nextjs.org/docs)
- [Deno 2.6.3 Documentation](https://deno.land)
- [React Compiler Guide](https://react.dev/learn/react-compiler)
- [Biome Linter](https://biomejs.dev)

**Good luck! 🚀**
