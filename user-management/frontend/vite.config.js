import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configure Vite for React development and forward API requests to Express.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The browser can call /api/... on its own origin while Express runs on port 8000.
      '/api': 'http://localhost:8000',
    },
  },
})
