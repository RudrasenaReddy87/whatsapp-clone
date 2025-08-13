import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  },
  server: {
    proxy: {
      '/webhook': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  }
})
