import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"), // Configuración del alias "@"
      // `server-only` lanza al importarse fuera de la condición "react-server",
      // que Vitest no aplica. Apuntamos al no-op que el propio paquete expone
      // para esa condición, en vez de agregar "react-server" a resolve.conditions
      // (eso cambiaría también cómo resuelve React y rompería tests de UI).
      "server-only": path.resolve(
        __dirname,
        "./node_modules/server-only/empty.js",
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.ts",
  },
});
