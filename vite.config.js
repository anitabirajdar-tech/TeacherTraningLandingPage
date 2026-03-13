import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Fallback all routes to index.html so react-router works on direct /admin visits
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
})
