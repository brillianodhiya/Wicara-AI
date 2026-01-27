import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Custom branding plugin
const brandingPlugin = () => ({
  name: 'branding-plugin',
  buildStart() {
    console.log('\n')
    console.log('  ╔═══════════════════════════════════════╗')
    console.log('  ║                                       ║')
    console.log('  ║   🎙️  Wicara AI by Kanrishaurus       ║')
    console.log('  ║                                       ║')
    console.log('  ╚═══════════════════════════════════════╝')
    console.log('\n')
  }
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    brandingPlugin(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Wicara AI - Meeting Assistant',
        short_name: 'Wicara AI',
        description: 'Privacy-first AI meeting assistant with transcription and summarization',
        theme_color: '#1677ff',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            // All external API calls → NetworkOnly (never cache)
            // Matches: api.assemblyai.com, generativelanguage.googleapis.com, api.openai.com, etc.
            urlPattern: /^https:\/\/.*\.(com|io|ai|dev|cloud)\/(api|v1|v2|v3|v4)?\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Localhost APIs (Ollama local) → NetworkOnly
            urlPattern: /^http:\/\/localhost:\d+\/.*/i,
            handler: 'NetworkOnly',
          },
          {
            // Other external HTTPS resources → NetworkFirst with cache fallback
            urlPattern: /^https:\/\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'external-resources',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    })
  ],
  base: './',
  server: {
    allowedHosts: ["silent-island-001d.tunnl.gg"]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-antd': ['antd', '@ant-design/icons'],
          'vendor-supabase': ['@supabase/supabase-js'],
          'vendor-ai': ['@google/generative-ai', 'assemblyai'],
        }
      }
    },
    chunkSizeWarningLimit: 900 // Increase limit slightly for remaining chunks
  }
})
