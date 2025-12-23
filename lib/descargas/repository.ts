import { influx } from "@/db/influx";
import { TABLE_CONFIG } from "./config";

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
      .map((metric) =>
        metric === "lluvia_mean"
          ? `SUM(${metric}) AS ${metric.replace("_mean", "")}`
          : `AVG(${metric}) AS ${metric.replace("_mean", "")}`
      )
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
