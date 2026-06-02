import type { NextRequest } from "next/server";

/**
 * Utilidades para manejar parámetros de consulta
 */

/**
 * Extrae parámetros de una URL y los convierte a un objeto plano
 */
export function extractQueryParams(
  request: NextRequest,
): Record<string, unknown> {
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, unknown> = {};

  // Convertir todos los parámetros a un objeto plano
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}
