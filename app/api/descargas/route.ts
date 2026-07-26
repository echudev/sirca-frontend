import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSession } from "@/lib/auth-session";
import { datosService } from "@/lib/descargas/service";
import { extractQueryParams } from "@/lib/descargas/utils";

export async function GET(request: NextRequest) {
  // El matcher de proxy.ts excluye /api, así que la sesión se verifica acá.
  if (!(await getSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Extraer y procesar parámetros usando utilidades
    const params = extractQueryParams(request);

    // Usar el servicio para obtener los datos con validación
    const result = await datosService.getDatosPorEstacion(params);

    return NextResponse.json(result);
  } catch (error) {
    // Ver la nota en app/api/datos/route.ts: sólo el error de validación lleva
    // detalle, porque describe el input del propio cliente.
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Parámetros de consulta inválidos",
          details: error.issues.map((issue) => ({
            field: issue.path.join(".") || "(raíz)",
            message: issue.message,
          })),
        },
        { status: 400 },
      );
    }

    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error interno al obtener los datos" },
      { status: 500 },
    );
  }
}
