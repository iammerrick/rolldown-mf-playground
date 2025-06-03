export interface RolldownConfig {
  // Input Options
  external: string[];
  format: "es" | "cjs" | "iife" | "umd";
  minify: boolean;
  sourcemap: boolean;
  treeshake: boolean;
  platform: "browser" | "node";

  // Output Options
  dir: string;
  entryFileNames: string;
  chunkFileNames: string;
}

export const DEFAULT_CONFIG: RolldownConfig = {
  external: [
    "react/jsx-runtime",
    "react",
    "react-dom",
    "@module-federation/runtime",
  ],
  format: "es",
  minify: false,
  sourcemap: false,
  treeshake: true,
  platform: "browser",
  dir: "dist",
  entryFileNames: "[name].js",
  chunkFileNames: "[name]-[hash].js",
};

export const CONFIG_STORAGE_KEY = "rolldown-config";
