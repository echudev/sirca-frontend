import { NextRequest } from "next/server";

/**
 * Utilidades para manejar parámetros de consulta
 */

/**
 * Extrae parámetros de una URL y los convierte a un objeto plano
 */
export function extractQueryParams(request: NextRequest): Record<string, unknown> {
  const searchParams = request.nextUrl.searchParams;
  const params: Record<string, unknown> = {};

  // Convertir todos los parámetros a un objeto plano
  searchParams.forEach((value, key) => {
    params[key] = value;
  });

  return params;
}

/**
 * Parsea parámetros de búsqueda con valores por defecto
 */
export function parseSearchParams(request: NextRequest): Record<string, string | undefined> {
  const searchParams = request.nextUrl.searchParams;
  
  return {
    contaminant: searchParams.get("contaminant") || undefined,
    locations: searchParams.get("locations") || undefined,
    startDate: searchParams.get("startDate") || undefined,
    endDate: searchParams.get("endDate") || undefined,
    interval: searchParams.get("interval") || undefined,
  };
}

/**
 * Convierte una cadena de ubicaciones separadas por comas a array
 */
export function parseLocations(locationsString?: string): string[] | undefined {
  if (!locationsString) return undefined;
  return locationsString.split(",").map(loc => loc.trim());
}

/**
 * Valida y formatea fechas ISO
 */
export function formatDateParam(dateString?: string): string | undefined {
  if (!dateString) return undefined;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return undefined;
    return date.toISOString();
  } catch {
    return undefined;
  }
}