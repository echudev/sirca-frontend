import { type NextRequest, NextResponse } from "next/server";
import { datosService } from "@/lib/descargas/service";
import { extractQueryParams } from "@/lib/descargas/utils";

export async function GET(request: NextRequest) {
  try {
    // Extraer y procesar parámetros usando utilidades
    const params = extractQueryParams(request);

    // Usar el servicio para obtener los datos con validación
    const result = await datosService.getDatosPorEstacion(params);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);

    // Manejar errores de validación y otros
    if (error instanceof Error) {
      const message = error.message;

      // Errores de validación de Zod
      if (message.includes("Invalid") || message.includes("Required")) {
        return NextResponse.json({ error: message }, { status: 400 });
      }

      // Otros errores de negocio
      return NextResponse.json({ error: message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Error interno al obtener los datos" },
      { status: 500 },
    );
  }
}
