# **Proposal Pengembangan Project 'Wicara AI' (Update Jan 2026\)**

## **1\. Visi Produk**

Menjadi asisten rapat AI pertama di Indonesia yang mengutamakan kedaulatan data (data sovereignty) dan transformasi diskusi menjadi aset kreatif instan.

## **2\. Analisis Masalah & Peluang (Data 2026\)**

* **Krisis Informasi:** Di tahun 2026, volume rapat virtual meningkat 30% dibanding 2024\. Profesional membutuhkan alat pemfilter informasi yang cerdas, bukan sekadar transkrip.  
* **Privasi adalah Prioritas:** Kebocoran data AI menjadi perhatian utama. 'Rapat AI' hadir dengan enkripsi *client-side* untuk menjamin kerahasiaan diskusi.  
* **Hyper-Efficiency:** 'Rapat AI' menggunakan model hibrida/BYOK yang memungkinkan biaya operasional hampir nol bagi *solo founder*.

## **3\. Strategi Monetisasi (Tiered Output)**

* **Tier 1: Basic (Gratis)**  
  * Transkripsi Original & Basic Diarization.  
  * Penyimpanan awan terbatas (30 hari).  
* **Tier 2: Creative & Business (Pro \- Berbayar)**  
  * **Smart Speaker Identification:** Identifikasi otomatis berbasis profil suara (Voice ID).  
  * **Output Kreatif:** Transformasi otomatis diskusi menjadi konten siap pakai (Email, Jira Ticket, Post Medsos).  
  * **Analisis Sentimen & Insight:** Mengetahui efektivitas rapat secara emosional.  
  * **BYOK Support:** Memungkinkan pengguna menggunakan kunci API mereka sendiri untuk kendali biaya penuh.

## **4\. Fase Pengembangan (Roadmap 2026\)**

### **Fase 1: Fondasi "Local-First" (Minggu 1-4)**

* Membangun *Core Engine* menggunakan **Next.js 15+** dan **React 19 Server Components**.  
* Implementasi perekaman audio *offline* dengan **PWA & Serwist**.  
* Integrasi **AssemblyAI Nano** untuk *diarization* berbiaya rendah.

### **Fase 2: Inteligensi & Identifikasi (Minggu 5-8)**

* Pengembangan modul **Speaker Identification** berbasis biometrik suara.  
* Optimasi **Gemini 2.5 Flash** untuk fitur "Creative Output".  
* Finalisasi *pitch deck* untuk aplikasi inkubator kampus.

### **Fase 3: Skalasi & Ekosistem (Minggu 9+)**

* Integrasi *Native* ke platform rapat (Zoom/Meet) melalui bot hibrida.  
* Peluncuran fitur *Collaboration Hub* untuk tim kampus/organisasi.

## **5\. Spesifikasi Teknis (Standard 2026\)**

### **1\. Teknologi (Stack 2026\)**

* **Framework:** Next.js 15+ (App Router) & React 19\.  
* **AI Orchestration:** Vercel AI SDK (Agnostik terhadap model).  
* **Backend:** Supabase (PostgreSQL) \+ Edge Functions untuk latensi rendah.  
* **AI Models:** \* STT: **AssemblyAI Nano** (Versi 2026 dengan akurasi Bahasa Indonesia \>95%).  
  * LLM: **Google Gemini 2.5 Flash** (Efisiensi token ekstrem).  
* **PWA:** Serwist (Evolusi dari Workbox) untuk sinkronisasi latar belakang.

### **2\. Struktur Database**

* **Users:** Profile, Subscription, Voice\_Fingerprint (Encrypted).  
* **Meetings:** Metadata, Audio\_Storage\_Path, Status.  
* **Transcripts:** JSON-stored timestamps dengan segmen *speaker* yang dioptimalkan.  
* **Keys:** Brankas kunci API (Encrypted via Web Crypto API).

### **3\. Keamanan (Security)**

* **Zero-Knowledge Architecture:** Kunci API pengguna dienkripsi di sisi klien. Aplikasi tidak pernah menyimpan kunci dalam bentuk teks biasa di server.  
* **AES-GCM Encryption:** Standar enkripsi militer untuk data audio dan teks transkrip.  
* **Row Level Security (RLS):** Isolasi data total antar pengguna.

### **4\. UX Experience (2026 Trends)**

* **Instant Feed:** Visualisasi audio *real-time* yang sangat halus menggunakan Canvas API.  
* **One-Click Transformation:** Tombol cepat untuk mengubah rapat menjadi format lain (Email/Docs).  
* **Interactive Player:** Klik pada kata dalam transkrip untuk mendengarkan kembali audio pada detik tersebut.  
* **Hybrid Mode Dashboard:** Pilihan mudah antara menggunakan "Cloud API" milik aplikasi atau "Own Key" milik pengguna.