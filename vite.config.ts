import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  build: {
    target: "esnext",
  },
  plugins: [react()],
  optimizeDeps: {
    exclude: ["@rolldown/browser"],
  },
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
    fs: {
      strict: false,
    },
  },
});
