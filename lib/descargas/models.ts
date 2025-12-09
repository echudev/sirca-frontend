import { z } from "zod";
import {
  promedioOptions,
  locationOptions,
} from "@/app/(main)/descargas/components/filters";

// ============================================================================
// ENUMS Y TIPOS BASE
// ============================================================================

export const StatusEnum = z.enum(["k", "i"]);
export type Status = z.infer<typeof StatusEnum>;

export const ContaminantEnum = z.enum([
  "co",
  "no2",
  "no",
  "nox",
  "pm10",
  "pm25",
  "o3",
  "so2",
]);
export type Contaminant = z.infer<typeof ContaminantEnum>;

export const IntegrationEnum = z.enum(["minute", "hour"]);
export type Integration = z.infer<typeof IntegrationEnum>;

export const LocationEnum = z.enum([
  "centenario",
  "cordoba",
  "catalinas",
  "cifa",
]);
export type Location = z.infer<typeof LocationEnum>;

// ============================================================================
// SCHEMAS DE REQUEST/RESPONSE
// ============================================================================

export const QueryParamsSchema = z.object({
  location: LocationEnum.default("centenario"),
  startDate: z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), {
      message: "Invalid datetime",
    })
    .default("2025-07-29T00:00:00Z"),
  endDate: z
    .string()
    .refine((s) => !Number.isNaN(Date.parse(s)), {
      message: "Invalid datetime",
    })
    .default("2025-07-30T00:00:00Z"),
  integration: IntegrationEnum.default("hour"),
});
export type QueryParams = z.infer<typeof QueryParamsSchema>;

// ============================================================================
// SCHEMAS DE DATOS
// ============================================================================

// Helper to convert BigInt to number and handle null values
const bigIntToNumberOrNull = z.preprocess(
  (val) => {
    if (typeof val === "bigint") {
      return Number(val);
    }
    if (val === null || val === undefined) {
      return null;
    }
    return val;
  },
  z.union([z.number(), z.string(), StatusEnum, z.null()]).nullable()
);

// Helper to convert time to string (handles number, Date, string, BigInt)
const timeToString = z.preprocess((val) => {
  if (val === null || val === undefined) {
    return "";
  }
  if (typeof val === "bigint") {
    return String(Number(val));
  }
  if (typeof val === "number") {
    // If it's a timestamp, convert to ISO string
    return new Date(val).toISOString();
  }
  if (val instanceof Date) {
    return val.toISOString();
  }
  return String(val);
}, z.string());

export const DataPointSchema = z
  .object({
    time: timeToString,
  })
  .catchall(bigIntToNumberOrNull);
export type DataPoint = z.infer<typeof DataPointSchema>;

export const QueryResultSchema = z.object({
  data: z.array(DataPointSchema),
  meta: z.object({
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    integration: z.string(),
    count: z.number(),
  }),
});
export type QueryResult = z.infer<typeof QueryResultSchema>;

// Validación con Zod para los inputs de en filtros
export const filtrosSchema = z
  .object({
    integration: z
      .string()
      .refine((v) => promedioOptions.some((o) => o.value === v), {
        message: "Seleccioná un tipo de integración.",
      }),
    location: z
      .string()
      .refine((s) => locationOptions.some((o) => o.value === s), {
        message: "Seleccioná una estación válida.",
      }),
    startDate: z.preprocess(
      (arg) => {
        if (arg instanceof Date) return arg;
        if (typeof arg === "string") {
          const d = new Date(arg);
          return isNaN(d.getTime()) ? undefined : d;
        }
        return undefined;
      },
      z.instanceof(Date, {
        message: 'Seleccioná una fecha "desde" válida.',
      })
    ),
    endDate: z.preprocess(
      (arg) => {
        if (arg instanceof Date) return arg;
        if (typeof arg === "string") {
          const d = new Date(arg);
          return isNaN(d.getTime()) ? undefined : d;
        }
        return undefined;
      },
      z.instanceof(Date, {
        message: 'Seleccioná una fecha "hasta" válida.',
      })
    ),
  })
  .refine((d) => d.startDate.getTime() <= d.endDate.getTime(), {
    message: 'La fecha "desde" debe ser anterior o igual a la fecha "hasta".',
    path: ["startDate"],
  });
