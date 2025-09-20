import { influx } from "@/db/influx";

// CONSULTA DATOS DE INFLUXDB CON PARÁMETROS DINÁMICOS
export async function fetchDatosPorContaminante(params: {
  contaminant: string;
  locations: string[];
  startDate: string;
  endDate: string;
  interval: string;
}) {
  const database = "minutales";
  const { contaminant, locations, startDate, endDate, interval } = params;

  // Mapear contaminantes a sus tablas correspondientes
  const tableMap: Record<string, string> = {
    co: "co_minutales",
    no2: "nox_minutales",
    no: "nox_minutales",
    nox: "nox_minutales",
    pm10: "pm10_minutales",
    pm25: "pm25_minutales",
    o3: "o3_minutales",
    so2: "so2_minutales",
  };

  const table = tableMap[contaminant] || "co_minutales";

  // Mapear contaminantes a sus columnas correspondientes
  const columnMap: Record<string, string> = {
    co: "co_mean",
    no2: "no2_mean",
    no: "no_mean",
    nox: "nox_mean",
    pm10: "pm10_mean",
    pm25: "pm25_mean",
    o3: "o3_mean",
    so2: "so2_mean",
  };

  const column = columnMap[contaminant] || "co_mean";

  // Si el usuario pide nox_mean, buscamos no, no2 y nox (oxidos totales)
  let locationSelects;
  if (column === "nox_mean") {
    locationSelects = locations
      .map(
        (location) =>
          `AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN no2_mean END) AS "${location} NO2",
          AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN no_mean END) AS "${location} NO",
          AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN nox_mean END) AS "${location} NOx"`
      )
      .join(",\n  ");
  } else {
    // Construir SELECT dinámico para las ubicaciones (estructura original que funciona con InfluxDB)
    locationSelects = locations
      .map(
        (location) =>
          `AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN ${column} END) AS "${location}"`
      )
      .join(",\n  ");
  }

  const query = `
  SELECT
  DATE_TRUNC('${interval}', time) AS time,
  ${locationSelects}
  FROM ${table}
  WHERE time >= '${startDate}'
  AND time < '${endDate}'
  GROUP BY DATE_TRUNC('${interval}', time)
  ORDER BY time;
  `;

  try {
    const rows = [];
    for await (const row of influx.query(query, database)) {
      rows.push(row);
    }
    return {
      data: rows,
      meta: {
        contaminant,
        locations,
        startDate,
        endDate,
        interval,
      },
    };
  } catch (error) {
    console.error("Error in fetchDatosPorContaminante:", error);
    throw error;
  }
}
