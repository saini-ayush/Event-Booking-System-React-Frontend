// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/api": "http://localhost:8000",
    },
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@components": path.resolve(__dirname, "./src/components"),
      "@contexts": path.resolve(__dirname, "./src/contexts"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@app-types": path.resolve(__dirname, "./src/types"),
    },
  },
});
