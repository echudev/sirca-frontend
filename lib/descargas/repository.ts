/**
 * @file Repositorio para la consulta de datos desde InfluxDB.
 * @description Maneja las consultas dinámicas a InfluxDB3 para diferentes contaminantes y meteorología,
 * realizando la unificación de datos basada en el tiempo y ajustes específicos de sensores.
 * @author Ezequiel Maranda
 * @version 1.1.0
 * @since 2026-03-11
 */

import { influx } from "@/db/influx";
import { TABLE_CONFIG } from "./config";

/**
 * Función auxiliar para recolectar todas las filas de un iterable asíncrono.
 * @param iterable El flujo de datos asíncrono desde InfluxDB.
 * @returns Un array con todos los registros obtenidos.
 */
// Helper function to collect all rows from an async iterable
async function collectRows<T>(iterable: AsyncIterable<T>): Promise<Array<T>> {
  const rows: Array<T> = [];
  for await (const row of iterable) {
    rows.push(row);
  }
  return rows;
}

/**
 * Consulta y unifica datos de múltiples tablas de InfluxDB para una estación específica.
 *
 * @param params Objetos con los parámetros de búsqueda:
 * - location: ID de la estación.
 * - startDate: Fecha de inicio (ISO).
 * - endDate: Fecha de fin (ISO).
 * - integration: Tipo de promedio ("hour" o "minute").
 *
 * @returns Objeto con los datos unificados y ordenados cronológicamente.
 */
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
          ? `MAX(${metric}) AS ${metric.replace("_mean", "")}`
          : `AVG(${metric}) AS ${metric.replace("_mean", "")}`,
      )
      .join(", ");

    let query: string;
    if (integration === "hour") {
      query = `
      SELECT
        DATE_BIN('1 hour', time - INTERVAL '1 minute', '1970-01-01') AS time,
        location,
        ${metricsSelect},
        COUNT(*) AS ${key}_k_status
      FROM ${table}
      WHERE location = '${location}'
        AND status = 'k'
        AND (time - INTERVAL '1 minute') >= '${startDate}'
        AND (time - INTERVAL '1 minute') < '${endDate}'
      GROUP BY DATE_BIN('1 hour', time - INTERVAL '1 minute', '1970-01-01'), location
      ORDER BY time ASC
    `;
    } else if (integration === "minute") {
      // Para datos minutales, agrupar por minuto truncado con prioridad de status
      // Para integración por minuto, seleccionar directamente sin filtrado por status
      // Asumiendo que los datos están limpios y hay máximo un registro por minuto
      const metricsSelect = metrics
        .map((metric) => `${metric} AS ${metric.replace("_mean", "")}`)
        .join(", ");

      query = `
        SELECT
          DATE_BIN('1 minute', time, '1970-01-01') AS time,
          location,
          ${metricsSelect},
          status AS ${key}_status
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
            >,
          );
          return { key, rows, success: true };
        } catch (error) {
          console.error(`Error querying ${table} for ${location}:`, error);
          return { key, rows: [], success: false, error };
        }
      }),
    );

    // rowMap se utiliza para unificar las métricas de diferentes tablas (CO, NOx, etc.)
    // que corresponden al mismo instante de tiempo en una única fila.
    const rowMap = new Map<string, Record<string, string | number>>();

    // Recorremos los resultados de las consultas (una por cada tabla en TABLE_CONFIG)
    results.forEach((result, index) => {
      if (result.status === "fulfilled" && result.value.success) {
        const { key, rows } = result.value;

        // Procesamos cada registro individual de la tabla actual
        rows.forEach((row) => {
          // Convertir el timestamp a milisegundos de forma confiable
          let timeMs: number;
          if (typeof row.time === "number") {
            timeMs = row.time;
          } else {
            timeMs = new Date(String(row.time || "")).getTime();
          }

          // Restamos 1 hora (3600000 ms) para pm10 en Córdoba o Catalinas
          // Esto se hace solo cuando el pm10 se mide con el equipo MetOne Bam1020
          // El bam1020 primero mide durante una hora, y muestra el resultado durante la hora siguiente
          if (
            key === "pm10" &&
            (location === "cordoba" ||
              location === "catalinas" ||
              location === "centenario")
          ) {
            timeMs -= 60 * 60 * 1000;
          }

          // Si después del ajuste el registro cae antes del startDate pedido, lo descartamos.
          // Esto ocurre cuando el primer registro del día (00:00) baja a las 23:xx del día anterior.
          if (timeMs < new Date(startDate).getTime()) {
            return;
          }

          // Convertir timestamp de milisegundos a ISO string para tener la key unificada
          const timeISO = new Date(Math.round(timeMs)).toISOString();

          // Buscamos si ya existe una fila para este timestamp en el mapa de unión
          const timeKey = timeISO;
          const existingRow = rowMap.get(timeKey);

          if (existingRow) {
            // Unificamos: agregamos las nuevas métricas al objeto existente en el mapa
            // Object.assign muta el objeto por referencia, actualizando el valor en el Map
            Object.assign(existingRow, row);
            existingRow.time = timeISO;
          } else {
            // Primera vez que vemos este horario: creamos un nuevo registro base
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
