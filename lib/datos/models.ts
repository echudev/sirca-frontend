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

// Schema base para filas de InfluxDB (datos raw de la base de datos)
const BaseInfluxDBRowSchema = {
  time: z.string(),
  minuteCount_centenario: z.string(),
  status_centenario: StatusEnum,
  minuteCount_catalinas: z.string(),
  status_catalinas: StatusEnum,
  minuteCount_cordoba: z.string(),
  status_cordoba: StatusEnum,
  minuteCount_cifa: z.string(),
  status_cifa: StatusEnum,
};

// Tipos de contaminantes soportados
type Contaminant = 'co' | 'no2' | 'o3' | 'pm10' | 'pm25';
type Location = 'centenario' | 'catalinas' | 'cordoba' | 'cifa';

// Función para crear un schema con propiedades dinámicas para cada contaminante
function createContaminantSchema() {
  const contaminants: Contaminant[] = ['co', 'no2', 'o3', 'pm10', 'pm25'];
  const locations: Location[] = ['centenario', 'catalinas', 'cordoba', 'cifa'];
  
  const dynamicFields: Record<string, z.ZodOptional<z.ZodString>> = {};
  
  for (const contaminant of contaminants) {
    for (const location of locations) {
      dynamicFields[`${contaminant}_${location}`] = z.string().optional();
    }
  }
  
  return {
    ...BaseInfluxDBRowSchema,
    ...dynamicFields
  };
}

export const InfluxDBRowSchema = z.object(createContaminantSchema());

// ============================================================================
// TIPOS DERIVADOS
// ============================================================================

// Derivar tipos TypeScript de los schemas Zod
export type CoHorarioData = ContaminanteData; // Usar el tipo más flexible
export type InfluxDBRow = z.infer<typeof InfluxDBRowSchema>;
