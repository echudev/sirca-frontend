import { z } from "zod";

// ============================================================================
// ENUMS Y TIPOS BASE
// ============================================================================

export const StatusEnum = z.enum(["ok", "i"]);
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

export const IntervalEnum = z.enum(["minute", "hour", "day"]);
export type Interval = z.infer<typeof IntervalEnum>;

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
  contaminant: ContaminantEnum.default("co"),
  locations: z
    .string()
    .transform((val) => val.split(",").map((loc) => loc.trim()))
    .pipe(z.array(z.string()))
    .default(["centenario", "cordoba", "catalinas", "cifa"]),
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
  interval: IntervalEnum.default("hour"),
});
export type QueryParams = z.infer<typeof QueryParamsSchema>;

// ============================================================================
// SCHEMAS DE DATOS
// ============================================================================

export const DataPointSchema = z
  .object({
    time: z.string(),
  })
  .catchall(z.union([z.number(), z.string(), StatusEnum]));
export type DataPoint = z.infer<typeof DataPointSchema>;

export const QueryResultSchema = z.object({
  data: z.array(DataPointSchema),
  meta: z.object({
    contaminant: ContaminantEnum,
    locations: z.array(z.string()),
    startDate: z.string(),
    endDate: z.string(),
    interval: IntervalEnum,
    count: z.number(),
  }),
});
export type QueryResult = z.infer<typeof QueryResultSchema>;
