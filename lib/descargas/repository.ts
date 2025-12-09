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

  // Build queries for each table
  const queries = Object.entries(TABLE_CONFIG).map(([key, config]) => {
    const { table, metrics } = config;
    const metricsSelect = metrics
      .map((metric) => `AVG(${metric}) AS ${metric}`)
      .join(", ");

    const query = `
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

    return { key, query, table };
  });

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
        rows.forEach((row) => {
          const timeKey = String(row.time || "");
          const existingRow = rowMap.get(timeKey);

          if (existingRow) {
            // Merge with existing row for this time bucket
            Object.assign(existingRow, row);
          } else {
            // Create new row for this time bucket
            const newRow: Record<string, string | number> = {
              time: row.time || "",
              location: row.location || location,
              ...row,
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
