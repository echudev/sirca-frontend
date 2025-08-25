// freshnessService.ts
import { differenceInMinutes } from "date-fns";
import { FullLocationData } from "./models"; // el tipo que devuelve tu repo

// Umbral configurable (ej: 2 minutos)
const FRESHNESS_THRESHOLD_MINUTES = 2;

export function applyFreshnessCheck(data: FullLocationData) {
  const now = new Date();

  const freshness: Record<string, "fresh" | "stale"> = {};
  const sanitizedData = { ...data };

  for (const [key, ts] of Object.entries(data.timestamps)) {
    if (!ts) {
      freshness[key] = "stale";
      // ya está en null en data, no se toca
      continue;
    }

    const minutesOld = differenceInMinutes(now, new Date(ts));

    if (minutesOld <= FRESHNESS_THRESHOLD_MINUTES) {
      freshness[key] = "fresh";
    } else {
      freshness[key] = "stale";

      // 👉 anular los valores asociados a este measurement
      switch (key) {
        case "co":
          sanitizedData.co_mean = null;
          break;
        case "nox":
          sanitizedData.no_mean = null;
          sanitizedData.no2_mean = null;
          sanitizedData.nox_mean = null;
          break;
        case "o3":
          sanitizedData.o3_mean = null;
          break;
        case "so2":
          sanitizedData.so2_mean = null;
          break;
        case "pm10":
          sanitizedData.pm10_mean = null;
          break;
        case "meteo":
          sanitizedData.dv_mean = null;
          sanitizedData.hr_in_mean = null;
          sanitizedData.hr_mean = null;
          sanitizedData.lluvia_mean = null;
          sanitizedData.temp_mean = null;
          sanitizedData.temp_in_mean = null;
          sanitizedData.vv_mean = null;
          sanitizedData.pa_mean = null;
          break;
      }
    }
  }

  return {
    ...sanitizedData,
    freshness,
  };
}
