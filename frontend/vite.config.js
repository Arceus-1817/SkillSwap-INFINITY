import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Ensure this matches what we expect
    proxy: {
      // Rule: Whenever axios calls "/api", send it to Java at port 8080
      '/api': {
        target: 'http://localhost:8085',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})