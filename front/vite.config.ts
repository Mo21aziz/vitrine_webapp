import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The maps are lazy-loaded: pre-bundle their libraries at startup so the dev server never has to
  // re-optimise them mid-session (that caused "504 Outdated Optimize Dep" when opening a map)
  optimizeDeps: {
    include: ['leaflet', 'react-leaflet'],
  },
  server: {
    // Forward /api calls to the Express backend during development
    proxy: {
      '/api': 'http://localhost:3000',
      '/uploads': 'http://localhost:3000',
    },
  },
})
