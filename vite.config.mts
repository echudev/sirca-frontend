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
    coverage: {
      provider: "v8",
      // text: tabla en consola (CI). html: reporte navegable en /coverage.
      // lcovonly: sólo el lcov.info (formato estándar para Codecov/SonarQube).
      // Es "lcovonly" y no "lcov" a propósito: "lcov" además duplica todo el
      // reporte HTML dentro de coverage/lcov-report/.
      reporter: ["text", "html", "lcovonly"],
      reportsDirectory: "./coverage",
      // Sin `include` explícito, v8 sólo mide los archivos que algún test importó,
      // con lo cual todo lo que no tiene tests desaparece del reporte y el número
      // sale inflado. Listamos las carpetas de código propio para que lo no
      // testeado aparezca en 0% en vez de no aparecer.
      // Sólo extensiones de código: sin el filtro, v8 intenta parsear como JS
      // cosas como db/seed/*.sql y escupe un RollupError por archivo.
      include: [
        "app/**/*.{ts,tsx}",
        "components/**/*.{ts,tsx}",
        "db/**/*.{ts,tsx}",
        "hooks/**/*.{ts,tsx}",
        "lib/**/*.{ts,tsx}",
      ],
      exclude: [
        // Generado por shadcn/ui: se regenera con el CLI, no lo mantenemos nosotros.
        "components/ui/**",
        // Declarativo, sin lógica que ejecutar: tablas de Drizzle, tipos, layouts.
        "db/schema/**",
        "**/layout.tsx",
        "**/*.d.ts",
        "**/types.ts",
        "**/config.ts",
        // OJO: models.ts NO va acá. Parece declarativo por el nombre, pero es
        // donde viven los schemas de Zod: whitelist de estaciones, topes de
        // rango y refinamientos de fecha. Es la capa que impide que llegue
        // texto arbitrario al SQL interpolado del repositorio, así que su
        // cobertura tiene que verse.
      ],
      // Pisos anti-retroceso ("ratchet"), NO objetivos. Están apenas por debajo
      // de lo medido hoy en lib/** (statements 84.3 / branches 77.7 /
      // functions 86.7 / lines 84.0): el CI avisa si la cobertura BAJA. Al
      // sumar tests, subir estos números en el mismo PR para fijar el piso.
      // Lo que queda sin cubrir: los huecos de lib/auth-session.ts
      // (getSession/verifySession) y lib/auth/repository.ts.
      thresholds: {
        "lib/**": {
          statements: 84,
          branches: 77,
          functions: 86,
          lines: 84,
        },
      },
    },
  },
});
