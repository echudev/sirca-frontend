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

// Schema para datos de CO horario (datos procesados para la UI)
export const CoHorarioSchema = z.object({
  date: z.string().describe("Formato: YYYY-MM-DD"),
  time: z.string().describe("Formato: HH:MM"),
  co_centenario: z.number(),
  minuteCount_centenario: z.number(),
  status_centenario: StatusEnum,
  co_catalinas: z.number(),
  minuteCount_catalinas: z.number(),
  status_catalinas: StatusEnum,
  co_cordoba: z.number(),
  minuteCount_cordoba: z.number(),
  status_cordoba: StatusEnum,
});

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
});

// ============================================================================
// TIPOS DERIVADOS
// ============================================================================

// Derivar tipos TypeScript de los schemas Zod
export type CoHorarioData = z.infer<typeof CoHorarioSchema>;
export type InfluxDBRow = z.infer<typeof InfluxDBRowSchema>;
