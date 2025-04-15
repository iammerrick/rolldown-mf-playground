import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'

export default defineConfig({
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
  resolve: {
    alias: {
      '@napi-rs/wasm-runtime/fs':
        '/Users/kevin/Developer/open-source/napi-rs/wasm-runtime/dist/fs.js',
      '@napi-rs/wasm-runtime':
        '/Users/kevin/Developer/open-source/napi-rs/wasm-runtime/dist/runtime.js',
    },
  },
})
