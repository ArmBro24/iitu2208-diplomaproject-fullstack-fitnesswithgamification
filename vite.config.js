import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/ai': 'http://localhost:8090',
      '/api/training': 'http://localhost:8081',
      '/api/gamification': 'http://localhost:8082',
      '/api/challenges': 'http://localhost:8083',
      '/api/notifications': 'http://localhost:8084',
      '/api': 'http://localhost:8080',
    },
  },
})
