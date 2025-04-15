import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
  build: {
    target: 'esnext',
  },
  plugins: [Vue()],
  optimizeDeps: {
    exclude: ['@rolldown/browser'],
  },
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
    fs: {
      strict: false,
    },
  },
})
