import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/firebase')) {
            return 'firebase-vendor';
          }
          if (id.includes('node_modules/xlsx')) {
            return 'xlsx-vendor';
          }
          if (id.includes('node_modules/recharts')) {
            return 'recharts-vendor';
          }
          if (id.includes('node_modules/html5-qrcode') || id.includes('node_modules/qrcode')) {
            return 'qrcode-vendor';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'lucide-vendor';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'framer-vendor';
          }
        }
      }
    }
  }
})
