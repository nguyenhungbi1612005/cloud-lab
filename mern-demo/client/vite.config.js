import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Khi chạy local bằng "npm run dev", chuyển tiếp /api sang Backend local
    proxy: {
      '/api': 'http://localhost:5000',
    },
  },
})
