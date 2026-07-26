// @vitest-environment node
//
// Lógica pura de servidor: no necesita DOM y el entorno `node` evita el costo
// de levantar jsdom por archivo.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Drizzle se mockea a nivel del objeto `db`: acá interesa la decisión que toma
// el rate limiter con lo que devuelve la query, no que Postgres responda.
// Las cadenas terminan devolviendo una Promise directamente porque el código
// hace `await db.select()...groupBy()`, `await db.insert()...values()` y
// `await db.delete()...where()`: en los tres casos el await cae sobre el
// último eslabón, así que no hace falta un thenable en cada paso.
const { db, spies, state } = vi.hoisted(() => {
  const state = {
    rows: [] as Array<{ kind: string; total: number }>,
  };

  const spies = {
    selectWhere: vi.fn(),
    insertValues: vi.fn(),
    deleteWhere: vi.fn(),
  };

  const db = {
    select: () => ({
      from: () => ({
        where: (condicion: unknown) => {
          spies.selectWhere(condicion);
          return { groupBy: () => Promise.resolve(state.rows) };
        },
      }),
    }),
    insert: () => ({
      values: (filas: unknown) => {
        spies.insertValues(filas);
        return Promise.resolve(undefined);
      },
    }),
    delete: () => ({
      where: (condicion: unknown) => {
        spies.deleteWhere(condicion);
        return Promise.resolve(undefined);
      },
    }),
  };

  return { db, spies, state };
});

vi.mock("@/db/drizzle", () => ({ db }));

// Los operadores se envuelven en spies conservando la implementación real: el
// objeto SQL que arma drizzle es opaco, así que la única forma de verificar QUÉ
// se filtró (email en minúsculas, techo de la ventana, discriminador) es mirar
// con qué argumentos se los llamó.
vi.mock("drizzle-orm", async (importOriginal) => {
  const actual = await importOriginal<typeof import("drizzle-orm")>();
  return {
    ...actual,
    eq: vi.fn(actual.eq),
    gte: vi.fn(actual.gte),
    lt: vi.fn(actual.lt),
  };
});

import { eq, gte, lt } from "drizzle-orm";
import {
  clearAttempts,
  isRateLimited,
  MAX_ATTEMPTS,
  recordFailedAttempt,
  WINDOW_MINUTES,
} from "@/lib/auth/rate-limit";

/** Valores comparados en cada `eq(columna, valor)`. */
function valoresComparados(): unknown[] {
  return vi.mocked(eq).mock.calls.map((llamada) => llamada[1] as unknown);
}

/** Primer valor pasado a un operador de fecha (`gte` / `lt`). */
function fechaDe(operador: typeof gte | typeof lt): Date {
  return vi.mocked(operador).mock.calls[0][1] as Date;
}

const AHORA = new Date("2026-07-26T12:00:00.000Z");

describe("rate limit de login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.rows = [];
    vi.useFakeTimers();
    vi.setSystemTime(AHORA);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("isRateLimited", () => {
    it("no limita cuando no hay intentos registrados", async () => {
      state.rows = [];

      expect(await isRateLimited("juan@example.com", "203.0.113.7")).toBe(false);
    });

    it("no limita con un intento menos que el techo de email", async () => {
      state.rows = [{ kind: "email", total: MAX_ATTEMPTS.email - 1 }];

      expect(await isRateLimited("juan@example.com", "203.0.113.7")).toBe(false);
    });

    // El corte es `>=`, no `>`: con el techo exacto ya hay que bloquear. Un
    // off-by-one acá regala un intento gratis por ventana, que multiplicado por
    // ventanas es una diferencia real para un atacante.
    it("limita al alcanzar exactamente el techo de email", async () => {
      state.rows = [{ kind: "email", total: MAX_ATTEMPTS.email }];

      expect(await isRateLimited("juan@example.com", "203.0.113.7")).toBe(true);
    });

    it("no limita con un intento menos que el techo de IP", async () => {
      state.rows = [{ kind: "ip", total: MAX_ATTEMPTS.ip - 1 }];

      expect(await isRateLimited("juan@example.com", "203.0.113.7")).toBe(false);
    });

    it("limita al alcanzar exactamente el techo de IP", async () => {
      state.rows = [{ kind: "ip", total: MAX_ATTEMPTS.ip }];

      expect(await isRateLimited("juan@example.com", "203.0.113.7")).toBe(true);
    });

    // Cada discriminador se compara contra SU techo. Si el conteo de IP se
    // midiera contra el de email, una oficina detrás de un NAT se bloquearía
    // sola con 5 errores repartidos entre personas distintas.
    it("mide cada kind contra su propio techo", async () => {
      state.rows = [{ kind: "ip", total: MAX_ATTEMPTS.email + 1 }];

      expect(await isRateLimited("juan@example.com", "203.0.113.7")).toBe(false);
    });

    it("limita si cualquiera de los dos discriminadores agotó su cupo", async () => {
      state.rows = [
        { kind: "email", total: 1 },
        { kind: "ip", total: MAX_ATTEMPTS.ip },
      ];

      expect(await isRateLimited("juan@example.com", "203.0.113.7")).toBe(true);
    });

    // Sin normalizar, JUAN@… y juan@… serían cubos separados y el techo de 5 se
    // convertiría en 5 por cada variante de mayúsculas que el atacante invente.
    it("normaliza el email a minúsculas antes de contar", async () => {
      await isRateLimited("JUAN@Example.COM", "203.0.113.7");

      const valores = valoresComparados();
      expect(valores).toContain("juan@example.com");
      expect(valores).not.toContain("JUAN@Example.COM");
    });

    it("no filtra por IP cuando no se pudo determinar", async () => {
      await isRateLimited("juan@example.com", null);

      // Sin IP sólo queda el discriminador de email; si igual se armara la rama
      // de IP, se contaría contra un identificador vacío compartido por todos.
      expect(valoresComparados()).not.toContain("ip");
    });

    it("cuenta sólo dentro de la ventana deslizante", async () => {
      await isRateLimited("juan@example.com", "203.0.113.7");

      const esperado = new Date(AHORA.getTime() - WINDOW_MINUTES * 60 * 1000);
      expect(fechaDe(gte)).toEqual(esperado);
    });
  });

  describe("recordFailedAttempt", () => {
    it("registra el intento para email e IP", async () => {
      await recordFailedAttempt("juan@example.com", "203.0.113.7");

      expect(spies.insertValues).toHaveBeenCalledWith([
        { kind: "email", identifier: "juan@example.com" },
        { kind: "ip", identifier: "203.0.113.7" },
      ]);
    });

    it("registra sólo el email cuando no hay IP", async () => {
      await recordFailedAttempt("juan@example.com", null);

      expect(spies.insertValues).toHaveBeenCalledWith([
        { kind: "email", identifier: "juan@example.com" },
      ]);
    });

    it("normaliza el email a minúsculas al registrar", async () => {
      await recordFailedAttempt("JUAN@Example.COM", null);

      // Tiene que coincidir con la normalización de isRateLimited: si una
      // guarda con mayúsculas y la otra cuenta en minúsculas, nunca se alcanza
      // el techo y el rate limit queda desactivado en silencio.
      expect(spies.insertValues).toHaveBeenCalledWith([
        { kind: "email", identifier: "juan@example.com" },
      ]);
    });

    it("purga los intentos que quedaron fuera de la ventana", async () => {
      await recordFailedAttempt("juan@example.com", "203.0.113.7");

      // Sin esta limpieza la tabla crece sin techo: son filas que ya no cuentan
      // para ninguna decisión.
      expect(spies.deleteWhere).toHaveBeenCalledTimes(1);
      const esperado = new Date(AHORA.getTime() - WINDOW_MINUTES * 60 * 1000);
      expect(fechaDe(lt)).toEqual(esperado);
    });
  });

  describe("clearAttempts", () => {
    it("borra los intentos del email en minúsculas", async () => {
      await clearAttempts("JUAN@Example.COM");

      const valores = valoresComparados();
      expect(valores).toContain("email");
      expect(valores).toContain("juan@example.com");
      expect(spies.deleteWhere).toHaveBeenCalledTimes(1);
    });

    // Dejar los intentos de IP es deliberado: si un login exitoso también los
    // limpiara, un atacante con una sola credencial válida se resetea el
    // contador de IP a voluntad y el techo por origen deja de existir.
    it("no toca los intentos registrados por IP", async () => {
      await clearAttempts("juan@example.com");

      expect(valoresComparados()).not.toContain("ip");
    });
  });
});
