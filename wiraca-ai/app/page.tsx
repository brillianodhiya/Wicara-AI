import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center" style={{ color: '#262B40' }}>
      {/* Hero Section */}
      <div className="w-full text-white py-20 px-4" style={{ background: 'linear-gradient(to right, #0474C4, #06457F)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Wicara AI</h1>
              <p className="text-xl md:text-2xl mb-8">
                Transcribe, analyze, and transform your meetings with AI-powered tools.
                <span className="block mt-2 font-bold">Your keys, your data, your control.</span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  href="/dashboard" 
                  className="px-6 py-3 rounded-lg font-medium text-lg transition-colors"
                  style={{ background: '#ffffff', color: '#06457F' }}
                >
                  Get Started
                </Link>
                <Link 
                  href="/(auth)/login" 
                  className="px-6 py-3 rounded-lg font-medium text-lg transition-colors"
                  style={{ background: 'transparent', color: '#ffffff', border: '2px solid #ffffff' }}
                >
                  Login
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative w-full h-64 md:h-96">
                <Image
                  src="/hero-image.svg"
                  alt="Wicara AI Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-16 px-4" style={{ background: '#ffffff' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: '#262B40' }}>Key Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(168, 196, 236, 0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(4, 116, 196, 0.2)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#0474C4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#262B40' }}>Audio Recording & Transcription</h3>
              <p style={{ color: 'rgba(38, 43, 64, 0.8)' }}>
                Record meetings directly in your browser and get accurate transcriptions with speaker diarization.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(168, 196, 236, 0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(4, 116, 196, 0.2)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#0474C4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#262B40' }}>BYOK (Bring Your Own Key)</h3>
              <p style={{ color: 'rgba(38, 43, 64, 0.8)' }}>
                Use your own API keys for AssemblyAI and Gemini. Full control over your data and costs.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl" style={{ backgroundColor: 'rgba(168, 196, 236, 0.2)' }}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'rgba(4, 116, 196, 0.2)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#0474C4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#262B40' }}>Creative Output Transformation</h3>
              <p style={{ color: 'rgba(38, 43, 64, 0.8)' }}>
                Transform transcripts into summaries, action items, and email drafts with AI-powered tools.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Plugin Marketplace Section */}
      <div className="w-full py-16 px-4" style={{ backgroundColor: 'rgba(44, 68, 76, 0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: '#262B40' }}>Plugin Marketplace</h2>
          <p className="text-center mb-12 max-w-2xl mx-auto" style={{ color: 'rgba(38, 43, 64, 0.8)' }}>
            Extend Wicara AI's functionality with our growing collection of plugins.
            Pay only for the features you need.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Plugin 1 */}
            <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #A8C4EC' }}>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#262B40' }}>AI Summary Plugin</h3>
              <p className="mb-4" style={{ color: 'rgba(38, 43, 64, 0.8)' }}>
                Generate concise meeting summaries with key points and insights.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: '#0474C4' }}>Rp 79.000/bulan</span>
                <button className="px-4 py-2 rounded transition-colors" style={{ backgroundColor: '#0474C4', color: '#ffffff' }}>
                  Learn More
                </button>
              </div>
            </div>

            {/* Plugin 2 */}
            <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #A8C4EC' }}>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#262B40' }}>Slack Integration</h3>
              <p className="mb-4" style={{ color: 'rgba(38, 43, 64, 0.8)' }}>
                Share meeting summaries and action items directly to Slack channels.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: '#0474C4' }}>Rp 49.000/bulan</span>
                <button className="px-4 py-2 rounded transition-colors" style={{ backgroundColor: '#0474C4', color: '#ffffff' }}>
                  Learn More
                </button>
              </div>
            </div>

            {/* Plugin 3 */}
            <div className="p-6 rounded-xl shadow-sm" style={{ backgroundColor: '#ffffff', border: '1px solid #A8C4EC' }}>
              <h3 className="text-xl font-semibold mb-2" style={{ color: '#262B40' }}>Speaker Identification</h3>
              <p className="mb-4" style={{ color: 'rgba(38, 43, 64, 0.8)' }}>
                Advanced speaker identification with custom voice profiles.
              </p>
              <div className="flex justify-between items-center">
                <span className="font-medium" style={{ color: '#0474C4' }}>Rp 109.000/bulan</span>
                <button className="px-4 py-2 rounded transition-colors" style={{ backgroundColor: '#0474C4', color: '#ffffff' }}>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-16 px-4 text-white" style={{ backgroundColor: '#0474C4' }}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform your meetings?</h2>
          <p className="text-xl mb-8">
            Get started with Wicara AI today. No credit card required for the free tier.
          </p>
          <Link 
            href="/(auth)/register" 
            className="px-8 py-3 rounded-lg font-medium text-lg inline-block transition-colors"
            style={{ backgroundColor: '#ffffff', color: '#06457F' }}
          >
            Sign Up Now
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-8 px-4 text-white" style={{ backgroundColor: '#2C444C' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">Wicara AI</h3>
              <p style={{ color: '#A8C4EC' }}>Your meeting assistant with data sovereignty</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/" className="transition-colors" style={{ color: '#ffffff' }}>Home</Link>
              <Link href="/features" className="transition-colors" style={{ color: '#ffffff' }}>Features</Link>
              <Link href="/pricing" className="transition-colors" style={{ color: '#ffffff' }}>Pricing</Link>
              <Link href="/contact" className="transition-colors" style={{ color: '#ffffff' }}>Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid rgba(38, 43, 64, 0.3)', color: '#A8C4EC' }}>
            <p>&copy; {new Date().getFullYear()} Wicara AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
