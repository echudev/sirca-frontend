// @vitest-environment node
//
// Esta ruta es un SSE: mantiene la conexión abierta y reenvía el último minuto
// cada 60s. Lo que interesa verificar son las dos guardas previas al stream
// —sesión y estación válida— porque el segmento de la URL baja a un
// repositorio que lo interpola en SQL, y el primer chunk que sale al cliente.
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth-session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/location/repository", () => ({
  fetchLastMinuteByLocation: vi.fn(),
}));

vi.mock("@/lib/location/service", () => ({
  applyFreshnessCheck: vi.fn((data) => data),
}));

import { GET } from "@/app/api/[location]/route";
import { getSession } from "@/lib/auth-session";
import { fetchLastMinuteByLocation } from "@/lib/location/repository";

const SESION = {
  userId: "1",
  userName: "Juan",
  email: "juan@example.com",
  role: "VIEWER",
};

/** Lector del stream de la respuesta, con un error claro si no trae cuerpo. */
function lectorDe(res: Response) {
  if (!res.body) throw new Error("La respuesta no trae stream");
  return res.body.getReader();
}

function pedido(location: string, signal?: AbortSignal) {
  const request = new NextRequest(`http://localhost/api/${location}`, {
    signal,
  });
  return [request, { params: Promise.resolve({ location }) }] as const;
}

describe("GET /api/[location]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(SESION);
    vi.mocked(fetchLastMinuteByLocation).mockResolvedValue({
      location: "cifa",
      co_mean: 1,
    } as never);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("autorización", () => {
    it("responde 401 sin sesión", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const res = await GET(...pedido("cifa"));

      expect(res.status).toBe(401);
      expect(fetchLastMinuteByLocation).not.toHaveBeenCalled();
    });
  });

  describe("validación de la estación", () => {
    it("responde 404 ante una estación que no existe", async () => {
      const res = await GET(...pedido("rosario"));

      expect(res.status).toBe(404);
      await expect(res.json()).resolves.toEqual({ error: "Estación inválida" });
    });

    // El segmento de la URL termina interpolado en el WHERE de siete queries.
    // El enum es la única barrera, y esto verifica que corte antes de bajar.
    it("no llega al repositorio con un intento de inyección", async () => {
      const res = await GET(...pedido("cifa' OR '1'='1"));

      expect(res.status).toBe(404);
      expect(fetchLastMinuteByLocation).not.toHaveBeenCalled();
    });

    it.each(["centenario", "cordoba", "catalinas", "cifa"])(
      "acepta la estación %s",
      async (location) => {
        const controlador = new AbortController();

        const res = await GET(...pedido(location, controlador.signal));
        controlador.abort();

        expect(res.status).toBe(200);
      },
    );
  });

  describe("stream", () => {
    it("responde como event-stream sin cachear", async () => {
      const controlador = new AbortController();

      const res = await GET(...pedido("cifa", controlador.signal));
      controlador.abort();

      // Sin no-cache, un proxy intermedio puede quedarse con el primer evento
      // y servirlo indefinidamente: el panel mostraría siempre el mismo minuto.
      expect(res.headers.get("Content-Type")).toBe("text/event-stream");
      expect(res.headers.get("Cache-Control")).toContain("no-cache");
    });

    it("emite el primer dato apenas se conecta", async () => {
      const controlador = new AbortController();

      const res = await GET(...pedido("cifa", controlador.signal));
      const { value } = await lectorDe(res).read();
      controlador.abort();

      // El primer envío es inmediato y no espera al intervalo de 60s: si no,
      // el panel arrancaría vacío durante un minuto en cada carga.
      const chunk = new TextDecoder().decode(value);
      expect(chunk.startsWith("data: ")).toBe(true);
      expect(JSON.parse(chunk.replace("data: ", ""))).toMatchObject({
        co_mean: 1,
      });
    });

    it("emite un evento de error sin detalle cuando falla la consulta", async () => {
      const consola = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(fetchLastMinuteByLocation).mockRejectedValue(
        new Error("SELECT * FROM co_minutales"),
      );
      const controlador = new AbortController();

      const res = await GET(...pedido("cifa", controlador.signal));
      const { value } = await lectorDe(res).read();
      controlador.abort();

      const chunk = new TextDecoder().decode(value);
      expect(chunk).toContain("event: error");
      expect(chunk).not.toContain("co_minutales");
      consola.mockRestore();
    });
  });
});
