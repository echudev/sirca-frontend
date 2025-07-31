import { influx } from "@/db/influx";

// CONSULTA ULTIMO MINUTO DE ESTACION CENENARIO
export async function fetchLastMinuteCentenario() {
  const database = "minutales";
  const query = `
        WITH latest_times AS (
            SELECT MAX(time) as max_time FROM (
                SELECT time FROM co_minutales 
                UNION ALL
                SELECT time FROM nox_minutales
                UNION ALL  
                SELECT time FROM pm10_minutales
                UNION ALL
                SELECT time FROM meteo_minutales
            )
        )
        SELECT 
            COALESCE(c.time, n.time, p.time, m.time) as time,
            COALESCE(c.location, n.location, p.location, m.location) as location,
            c.co_mean,
            n.no2_mean, n.no_mean, n.nox_mean,
            p.pm10, p.pm10_mean,
            m.dv_mean, m.hr_in_mean, m.hr_mean, m.lluvia_mean, m.temp_mean, m.temp_in_mean, m.vv_mean
        FROM latest_times lt
        LEFT JOIN co_minutales c ON c.time >= lt.max_time - INTERVAL '1 minute'
        LEFT JOIN nox_minutales n ON n.time >= lt.max_time - INTERVAL '1 minute'  
        LEFT JOIN pm10_minutales p ON p.time >= lt.max_time - INTERVAL '1 minute'
        LEFT JOIN meteo_minutales m ON m.time >= lt.max_time - INTERVAL '1 minute';
    `;

  try {
    const rows = [];
    for await (const row of influx.query(query, database)) {
      rows.push(row);
    }
    return rows[0];
  } catch (error) {
    console.error("Error in fetchLastMinuteCentenario:", error);
    throw error;
  }
}

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

  // Construir SELECT dinámico para las ubicaciones (estructura original que funciona con InfluxDB)
  const locationSelects = locations
    .map(
      (location) =>
        `AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN ${column} END) AS "${location}"`
    )
    .join(",\n  ");

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
