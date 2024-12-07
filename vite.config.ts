import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"), // Configuración del alias "@"
    },
  },
  test: {
    globals: true,
    environment: "jsdom", // O "node" si no necesitas DOM
    setupFiles: "./tests/setup.ts", // Archivos de configuración para pruebas
  },
});
