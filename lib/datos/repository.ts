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

  const runQuery = async (query: string) => {
    const rows: Record<string, string | number>[] = [];
    for await (const row of influx.query(query, database)) {
      rows.push(row as Record<string, string | number>);
    }
    return rows;
  };

  const buildQuery = (table: string, selects: string) => `
  SELECT
  DATE_TRUNC('${interval}', time) AS time,
  ${selects}
  FROM ${table}
  WHERE time >= '${startDate}'
  AND time < '${endDate}'
  GROUP BY DATE_TRUNC('${interval}', time)
  ORDER BY time;
  `;

  try {
    // PM10 y PM2.5 viven en tablas distintas: corremos dos queries en paralelo
    // y mergeamos por time para devolver un único dataset.
    if (contaminant === "pm1025") {
      const pm10Selects = locations
        .map(
          (location) =>
            `AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN pm10_mean END) AS "${location} PM10"`,
        )
        .join(",\n  ");
      const pm25Selects = locations
        .map(
          (location) =>
            `AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN pm25_mean END) AS "${location} PM25"`,
        )
        .join(",\n  ");

      const [pm10Rows, pm25Rows] = await Promise.all([
        runQuery(buildQuery("pm10_minutales", pm10Selects)),
        runQuery(buildQuery("pm25_minutales", pm25Selects)),
      ]);

      const mergedByTime = new Map<string, Record<string, string | number>>();
      for (const row of [...pm10Rows, ...pm25Rows]) {
        const time = String(row.time);
        const existing = mergedByTime.get(time);
        mergedByTime.set(time, existing ? { ...existing, ...row } : { ...row });
      }
      const data = Array.from(mergedByTime.values()).sort((a, b) =>
        String(a.time).localeCompare(String(b.time)),
      );

      return {
        data,
        meta: { contaminant, locations, startDate, endDate, interval },
      };
    }

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

    let locationSelects;
    if (column === "nox_mean") {
      locationSelects = locations
        .map(
          (location) =>
            `AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN no2_mean END) AS "${location} NO2",
          AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN no_mean END) AS "${location} NO",
          AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN nox_mean END) AS "${location} NOx"`,
        )
        .join(",\n  ");
    } else {
      locationSelects = locations
        .map(
          (location) =>
            `AVG(CASE WHEN LOWER(TRIM(location)) = LOWER(TRIM('${location}')) THEN ${column} END) AS "${location}"`,
        )
        .join(",\n  ");
    }

    const rows = await runQuery(buildQuery(table, locationSelects));
    return {
      data: rows,
      meta: { contaminant, locations, startDate, endDate, interval },
    };
  } catch (error) {
    console.error("Error in fetchDatosPorContaminante:", error);
    throw error;
  }
}
