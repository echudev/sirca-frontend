// @vitest-environment node
//
// Misma frontera que /api/datos pero para la descarga de archivos. Se prueba
// igual porque las garantías son las mismas y conviene que no se separen: si
// una de las dos rutas afloja el 401 o empieza a filtrar el error interno, hay
// un test que lo dice.
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

vi.mock("@/lib/auth-session", () => ({
  getSession: vi.fn(),
}));

vi.mock("@/lib/descargas/service", () => ({
  datosService: { getDatosPorEstacion: vi.fn() },
}));

import { GET } from "@/app/api/descargas/route";
import { getSession } from "@/lib/auth-session";
import { datosService } from "@/lib/descargas/service";

const SESION = {
  userId: "1",
  userName: "Juan",
  email: "juan@example.com",
  role: "VIEWER",
};

function pedido(query = "location=cifa&integration=hour") {
  return new NextRequest(`http://localhost/api/descargas?${query}`);
}

describe("GET /api/descargas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getSession).mockResolvedValue(SESION);
  });

  it("responde 401 sin sesión y no consulta nada", async () => {
    vi.mocked(getSession).mockResolvedValue(null);

    const res = await GET(pedido());

    expect(res.status).toBe(401);
    expect(datosService.getDatosPorEstacion).not.toHaveBeenCalled();
  });

  it("devuelve lo que entrega el servicio", async () => {
    const resultado = { data: [{ time: "2026-01-01T00:00:00Z" }], meta: {} };
    vi.mocked(datosService.getDatosPorEstacion).mockResolvedValue(
      resultado as never,
    );

    const res = await GET(pedido());

    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual(resultado);
  });

  it("le pasa al servicio los parámetros de la query", async () => {
    vi.mocked(datosService.getDatosPorEstacion).mockResolvedValue({
      data: [],
      meta: {},
    } as never);

    await GET(pedido("location=cordoba&integration=minute"));

    expect(datosService.getDatosPorEstacion).toHaveBeenCalledWith({
      location: "cordoba",
      integration: "minute",
    });
  });

  it("responde 400 con el detalle cuando la validación falla", async () => {
    vi.mocked(datosService.getDatosPorEstacion).mockRejectedValue(
      new ZodError([
        {
          code: "invalid_value",
          path: ["location"],
          message: "Estación inválida",
        } as never,
      ]),
    );

    const res = await GET(pedido("location=rosario"));
    const cuerpo = await res.json();

    expect(res.status).toBe(400);
    expect(cuerpo.details).toEqual([
      { field: "location", message: "Estación inválida" },
    ]);
  });

  it("nombra (raíz) al error que no apunta a un campo", async () => {
    vi.mocked(datosService.getDatosPorEstacion).mockRejectedValue(
      new ZodError([
        { code: "custom", path: [], message: "Rango demasiado grande" },
      ] as never),
    );

    const cuerpo = await (await GET(pedido())).json();

    expect(cuerpo.details).toEqual([
      { field: "(raíz)", message: "Rango demasiado grande" },
    ]);
  });

  it("responde 500 genérico sin filtrar el error interno", async () => {
    const consola = vi.spyOn(console, "error").mockImplementation(() => {});
    vi.mocked(datosService.getDatosPorEstacion).mockRejectedValue(
      new Error("SELECT * FROM meteo_minutales"),
    );

    const res = await GET(pedido());
    const cuerpo = JSON.stringify(await res.json());

    expect(res.status).toBe(500);
    expect(cuerpo).not.toContain("meteo_minutales");
    expect(consola).toHaveBeenCalled();
    consola.mockRestore();
  });
});
