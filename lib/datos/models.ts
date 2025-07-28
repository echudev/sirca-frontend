import { z } from "zod";

// ============================================================================
// ENUMS Y TIPOS BASE
// ============================================================================

// Definir el enum de Status una sola vez para reutilización
export const StatusEnum = z.enum(["ok", "i"]);
export type Status = z.infer<typeof StatusEnum>;

// ============================================================================
// SCHEMAS PRINCIPALES
// ============================================================================

// Schema para datos de contaminantes horarios (datos procesados para la UI)
export const CoHorarioSchema = z.object({
  date: z.string().describe("Formato: YYYY-MM-DD"),
  time: z.string().describe("Formato: HH:MM"),
}).and(
  // Campos dinámicos para diferentes contaminantes
  z.record(z.string(), z.union([z.number(), z.string(), StatusEnum]))
);

// Aseguramos que el tipo tenga las propiedades necesarias para la retrocompatibilidad
export type ContaminanteData = {
  date: string;
  time: string;
  [key: string]: string | number | Status; // Permite propiedades dinámicas como 'co_centenario', 'o3_centenario', etc.
};

// Schema para filas de InfluxDB (datos raw de la base de datos)
export const InfluxDBRowSchema = z.object({
  time: z.string(),
  co_centenario: z.string(),
  minuteCount_centenario: z.string(),
  status_centenario: StatusEnum,
  co_catalinas: z.string(),
  minuteCount_catalinas: z.string(),
  status_catalinas: StatusEnum,
  co_cordoba: z.string(),
  minuteCount_cordoba: z.string(),
  status_cordoba: StatusEnum,
  co_cifa: z.string(),
  minuteCount_cifa: z.string(),
  status_cifa: StatusEnum,
});

// ============================================================================
// TIPOS DERIVADOS
// ============================================================================

// Derivar tipos TypeScript de los schemas Zod
export type CoHorarioData = ContaminanteData; // Usar el tipo más flexible
export type InfluxDBRow = z.infer<typeof InfluxDBRowSchema>;
