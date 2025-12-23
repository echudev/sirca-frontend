import { influx } from "@/db/influx";

// Table configurations with their respective metrics
const TABLE_CONFIG = {
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

// Helper function to collect all rows from an async iterable
async function collectRows<T>(iterable: AsyncIterable<T>): Promise<Array<T>> {
  const rows: Array<T> = [];
  for await (const row of iterable) {
    rows.push(row);
  }
  return rows;
}

// CONSULTA DATOS DE INFLUXDB CON PARÁMETROS DINÁMICOS
export async function fetchDatosPorEstacion(params: {
  location: string;
  startDate: string;
  endDate: string;
  integration: string;
}) {
  const database = "minutales";
  const { location, startDate, endDate, integration } = params;

  // DEBUG: Log de parámetros recibidos
  console.log("=== DEBUG fetchDatosPorEstacion ===");
  console.log("Params recibidos:", { location, startDate, endDate, integration });
  console.log("startDate parseado:", new Date(startDate));
  console.log("endDate parseado:", new Date(endDate));

  // Build queries for each table
  const queries = Object.entries(TABLE_CONFIG).map(([key, config]) => {
    const { table, metrics } = config;
    const metricsSelect = metrics
      .map((metric) => `AVG(${metric}) AS ${metric.replace("_mean", "")}`)
      .join(", ");

    let query: string;
    if (integration === "hour") {
      query = `
      SELECT
        DATE_TRUNC('${integration}', time) AS time,
        location,
        ${metricsSelect},
        COUNT(*) AS ${key}_k_status
      FROM ${table}
      WHERE location = '${location}'
        AND status = 'k'
        AND time >= '${startDate}'
        AND time < '${endDate}'
      GROUP BY DATE_TRUNC('${integration}', time), location
      ORDER BY time ASC
    `;
    } else if (integration === "minute") {
      // Para datos minutales, seleccionar campos directamente sin agregación
      const metricsSelectDirect = metrics
        .map((metric) => `${metric} AS ${metric.replace("_mean", "")}`)
        .join(", ");

      query = `
        SELECT
          time,
          location,
          ${metricsSelectDirect},
          status as ${key}_status
        FROM ${table}
        WHERE location = '${location}'
          AND time >= '${startDate}'
          AND time < '${endDate}'
        ORDER BY time ASC
      `;
    } else {
      throw new Error("Invalid integration");
    }

    return { key, query, table };
  });

  // DEBUG: Log de la primera query generada
  if (queries.length > 0) {
    console.log("Query ejemplo (primera tabla):", queries[0].query);
  }

  try {
    // Execute all queries in parallel
    const results = await Promise.allSettled(
      queries.map(async ({ key, query, table }) => {
        try {
          const rows = await collectRows(
            influx.query(query, database) as AsyncIterable<
              Record<string, string | number>
            >
          );
          return { key, rows, success: true };
        } catch (error) {
          console.error(`Error querying ${table} for ${location}:`, error);
          return { key, rows: [], success: false, error };
        }
      })
    );

    // Collect all rows from successful queries
    const allRows: Array<Record<string, string | number>> = [];
    const rowMap = new Map<string, Record<string, string | number>>();

    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.success) {
        const { key, rows } = result.value;
        // DEBUG: Log del primer timestamp de cada tabla
        if (rows.length > 0 && index === 0) {
          console.log(`=== DEBUG tipo de timestamp ===`);
          console.log(`Tabla: ${key}`);
          console.log(`row.time value:`, rows[0].time);
          console.log(`row.time typeof:`, typeof rows[0].time);
          console.log(`row.time constructor:`, rows[0].time?.constructor?.name);
        }
        rows.forEach((row) => {
          // Convertir timestamp de milisegundos a ISO string
          let timeISO: string;
          if (typeof row.time === "number") {
            // Redondear para evitar decimales extraños y convertir a ISO
            timeISO = new Date(Math.round(row.time)).toISOString();
          } else if (typeof row.time === "string") {
            timeISO = row.time;
          } else {
            timeISO = String(row.time || "");
          }

          const timeKey = timeISO;
          const existingRow = rowMap.get(timeKey);

          if (existingRow) {
            // Merge with existing row for this time bucket
            Object.assign(existingRow, row);
            existingRow.time = timeISO;
          } else {
            // Create new row for this time bucket
            const newRow: Record<string, string | number> = {
              ...row,
              time: timeISO,
              location: row.location || location,
            };
            rowMap.set(timeKey, newRow);
          }
        });
      } else if (result.status === "rejected") {
        console.error(`Query ${queries[index].key} failed:`, result.reason);
      }
    });

    // Convert map to array and sort by time
    const sortedRows = Array.from(rowMap.values()).sort((a, b) => {
      const timeA = new Date(String(a.time)).getTime();
      const timeB = new Date(String(b.time)).getTime();
      return timeA - timeB;
    });

    // DEBUG: Log de datos resultantes
    console.log("Total filas devueltas:", sortedRows.length);
    if (sortedRows.length > 0) {
      console.log("Primera fila (time):", sortedRows[0].time);
      console.log("Última fila (time):", sortedRows[sortedRows.length - 1].time);
      // Mostrar algunas filas de ejemplo alrededor de las 12:00
      const ejemplos = sortedRows.filter((row) => {
        const timeStr = String(row.time);
        return timeStr.includes("11:") || timeStr.includes("12:") || timeStr.includes("13:");
      }).slice(0, 5);
      console.log("Ejemplos cerca de las 12:00:", ejemplos.map(r => r.time));
    }

    return {
      data: sortedRows,
      meta: {
        location,
        startDate,
        endDate,
        integration,
      },
    };
  } catch (error) {
    console.error("Error in fetchDatosPorEstacion:", error);
    throw error;
  }
}
