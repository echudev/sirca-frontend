import { type NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSession } from "@/lib/auth-session";
import { datosService } from "@/lib/datos/service";
import { extractQueryParams } from "@/lib/datos/utils";

export async function GET(request: NextRequest) {
  // El matcher de proxy.ts excluye /api, así que la sesión se verifica acá.
  if (!(await getSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    // Extraer y procesar parámetros usando utilidades
    const params = extractQueryParams(request);

    // Usar el servicio para obtener los datos con validación
    const result = await datosService.getDatosPorContaminante(params);

    return NextResponse.json(result);
  } catch (error) {
    // Validación: el detalle describe los parámetros que mandó el propio cliente,
    // así que devolverlo no expone nada del servidor y ayuda a depurar.
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

    // Cualquier otra cosa es un fallo interno: se loguea completo del lado del
    // servidor y al cliente le va un mensaje genérico. No devolver error.message
    // acá — en un fallo de InfluxDB trae el SQL y los nombres de tabla.
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error interno al obtener los datos" },
      { status: 500 },
    );
  }
}
