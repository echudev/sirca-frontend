// Table configurations with their respective metrics
export const TABLE_CONFIG = {
  nox: {
    table: "nox_minutales",
    metrics: ["no_mean", "no2_mean", "nox_mean"],
  },
  co: {
    table: "co_minutales",
    metrics: ["co_mean"],
  },
  o3: {
    table: "o3_minutales",
    metrics: ["o3_mean"],
  },
  pm10: {
    table: "pm10_minutales",
    metrics: ["pm10_mean"],
  },
  so2: {
    table: "so2_minutales",
    metrics: ["so2_mean"],
  },
  meteo: {
    table: "meteo_minutales",
    metrics: [
      "dv_mean",
      "vv_mean",
      "temp_mean",
      "hr_mean",
      "pa_mean",
      "uv_mean",
      "lluvia_mean",
      "rs_mean",
    ],
  },
} as const;

export type TableConfig = typeof TABLE_CONFIG;
