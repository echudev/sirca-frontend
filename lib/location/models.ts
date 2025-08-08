import { z } from "zod";

// Esquemas Zod
const formatNumber = (decimals: number = 2) =>
  z
    .number()
    .nullable()
    .optional()
    .transform((val) => {
      if (val === null || val === undefined) return null;
      const multiplier = Math.pow(10, decimals);
      return Math.round(val * multiplier) / multiplier;
    });

// Timestamp flexible para el objeto final (preserva Unix epoch o convierte a Date)
const timeField = z
  .union([
    z.number().transform((val) => new Date(val * 1000)), // Unix epoch (segundos) a Date
    z.string(), // String ISO
    z.date(), // Ya es Date
    z.null(),
    z.undefined(),
  ])
  .nullable()
  .optional();
const locationField = z.string();

// Esquemas individuales
export const CoRowSchema = z.object({
  time: timeField,
  location: locationField,
  co_mean: formatNumber(2),
});

export const NoxRowSchema = z.object({
  time: timeField,
  location: locationField,
  no2_mean: formatNumber(2),
  no_mean: formatNumber(2),
  nox_mean: formatNumber(2),
});

export const O3RowSchema = z.object({
  time: timeField,
  location: locationField,
  o3_mean: formatNumber(2),
});

export const So2RowSchema = z.object({
  time: timeField,
  location: locationField,
  so2_mean: formatNumber(2),
});

export const Pm10RowSchema = z.object({
  time: timeField,
  location: locationField,
  pm10_mean: formatNumber(2),
});

export const MeteoRowSchema = z.object({
  time: timeField,
  location: locationField,
  dv_mean: formatNumber(1),
  hr_in_mean: formatNumber(1),
  hr_mean: formatNumber(1),
  lluvia_mean: formatNumber(2),
  temp_mean: formatNumber(1),
  temp_in_mean: formatNumber(1),
  vv_mean: formatNumber(2),
  pa_mean: formatNumber(1),
});

// Esquema para la respuesta combinada
export const FullLocationDataSchema = z.object({
  location: z.string(),
  timestamps: z.object({
    co: timeField,
    nox: timeField,
    o3: timeField,
    so2: timeField,
    pm10: timeField,
    meteo: timeField,
  }),
  latest_time: timeField,
  // CO data
  co_mean: formatNumber(2),
  // NOx data
  no2_mean: formatNumber(2),
  no_mean: formatNumber(2),
  nox_mean: formatNumber(2),
  // O3 data
  o3_mean: formatNumber(2),
  // SO2 data
  so2_mean: formatNumber(2),
  // PM10 data
  pm10_mean: formatNumber(2),
  // Meteo data
  dv_mean: formatNumber(1),
  hr_in_mean: formatNumber(1),
  hr_mean: formatNumber(1),
  lluvia_mean: formatNumber(2),
  temp_mean: formatNumber(1),
  temp_in_mean: formatNumber(1),
  vv_mean: formatNumber(2),
  pa_mean: formatNumber(1),
});

// Tipos inferidos
export type CoRow = z.infer<typeof CoRowSchema>;
export type NoxRow = z.infer<typeof NoxRowSchema>;
export type O3Row = z.infer<typeof O3RowSchema>;
export type So2Row = z.infer<typeof So2RowSchema>;
export type Pm10Row = z.infer<typeof Pm10RowSchema>;
export type MeteoRow = z.infer<typeof MeteoRowSchema>;
export type FullLocationData = z.infer<typeof FullLocationDataSchema>;
