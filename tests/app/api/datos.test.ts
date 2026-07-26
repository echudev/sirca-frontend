// @vitest-environment node
//
// El route handler es la frontera pública: acá se decide quién entra y qué se
// le cuenta al cliente cuando algo falla. Los servicios van mockeados porque lo
// que se prueba es el contrato HTTP, no la consulta.
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("@/lib/auth-session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/datos/service", () => ({
  datosService: { getDatosPorContaminante: vi.fn() },
}));

import { GET } from "@/app/api/datos/route";
import { getSession } from "@/lib/auth-session";
import { datosService } from "@/lib/datos/service";

const SESION = {
  userId: "1",
  userName: "Juan",
  email: "juan@example.com",
  role: "VIEWER",
};

function pedido(query = "contaminant=co&locations=centenario") {
  return new NextRequest(`http://localhost/api/datos?${query}`);
}

describe("GET /api/datos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(SESION);
  });

  describe("autorización", () => {
    it("responde 401 sin sesión", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      const res = await GET(pedido());

      expect(res.status).toBe(401);
      await expect(res.json()).resolves.toEqual({ error: "No autorizado" });
    });

    // El corte va antes de tocar el servicio: si no, un anónimo puede disparar
    // consultas a InfluxDB —que se pagan por uso— sin estar autenticado.
    it("no consulta datos cuando no hay sesión", async () => {
      vi.mocked(getSession).mockResolvedValue(null);

      await GET(pedido());

      expect(datosService.getDatosPorContaminante).not.toHaveBeenCalled();
    });
  });

  describe("respuesta exitosa", () => {
    it("devuelve lo que entrega el servicio", async () => {
      const resultado = { data: [{ time: "2026-01-01T00:00:00Z" }], meta: {} };
      vi.mocked(datosService.getDatosPorContaminante).mockResolvedValue(
        resultado as never,
      );

      const res = await GET(pedido());

      expect(res.status).toBe(200);
      await expect(res.json()).resolves.toEqual(resultado);
    });

    it("le pasa al servicio los parámetros de la query", async () => {
      vi.mocked(datosService.getDatosPorContaminante).mockResolvedValue({
        data: [],
        meta: {},
      } as never);

      await GET(pedido("contaminant=pm10&locations=cifa&interval=day"));

      expect(datosService.getDatosPorContaminante).toHaveBeenCalledWith({
        contaminant: "pm10",
        locations: "cifa",
        interval: "day",
      });
    });
  });

  describe("errores", () => {
    it("responde 400 con el detalle cuando la validación falla", async () => {
      vi.mocked(datosService.getDatosPorContaminante).mockRejectedValue(
        new ZodError([
          {
            code: "invalid_value",
            path: ["contaminant"],
            message: "Contaminante inválido",
          } as never,
        ]),
      );

      const res = await GET(pedido("contaminant=plutonio"));
      const cuerpo = await res.json();

      expect(res.status).toBe(400);
      // El detalle describe lo que mandó el propio cliente, así que devolverlo
      // no expone nada del servidor y ahorra una ida y vuelta para depurar.
      expect(cuerpo.details).toEqual([
        { field: "contaminant", message: "Contaminante inválido" },
      ]);
    });

    // Los refinamientos sobre el objeto entero (por ejemplo el tope de rango)
    // pueden venir sin path. Sin el fallback, el cliente recibe un campo vacío
    // y no sabe a qué parte de su pedido se refiere el error.
    it("nombra (raíz) al error que no apunta a un campo", async () => {
      vi.mocked(datosService.getDatosPorContaminante).mockRejectedValue(
        new ZodError([
          { code: "custom", path: [], message: "Rango demasiado grande" },
        ] as never),
      );

      const res = await GET(pedido());
      const cuerpo = await res.json();

      expect(cuerpo.details).toEqual([
        { field: "(raíz)", message: "Rango demasiado grande" },
      ]);
    });

    it("responde 500 genérico ante un fallo interno", async () => {
      const consola = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(datosService.getDatosPorContaminante).mockRejectedValue(
        new Error("connect ECONNREFUSED influx"),
      );

      const res = await GET(pedido());

      expect(res.status).toBe(500);
      await expect(res.json()).resolves.toEqual({
        error: "Error interno al obtener los datos",
      });
      consola.mockRestore();
    });

    // Un error de InfluxDB trae el SQL y los nombres de tabla en el mensaje.
    // Devolverlo al cliente le regala el esquema a cualquiera que fuerce un
    // fallo; queda en el log del servidor, que es donde sirve.
    it("no filtra el mensaje interno al cliente", async () => {
      const consola = vi.spyOn(console, "error").mockImplementation(() => {});
      const interno = "SELECT * FROM co_minutales WHERE location = 'cifa'";
      vi.mocked(datosService.getDatosPorContaminante).mockRejectedValue(
        new Error(interno),
      );

      const res = await GET(pedido());
      const cuerpo = JSON.stringify(await res.json());

      expect(cuerpo).not.toContain("co_minutales");
      expect(cuerpo).not.toContain("SELECT");
      expect(consola).toHaveBeenCalled();
      consola.mockRestore();
    });
  });
});
