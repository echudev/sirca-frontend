import { influx } from "@/db/connection";

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

// CONSULTA DATOS DE INFLUXDB
export async function fetchDatosPorContaminante() {
  const database = "minutales";
  const query = `
  SELECT
  DATE_TRUNC('minute', time) AS time,
  AVG(CASE WHEN location = 'centenario' THEN co_mean END) AS centenario,
  AVG(CASE WHEN location = 'cordoba' THEN co_mean END) AS cordoba,
  AVG(CASE WHEN location = 'catalinas' THEN co_mean END) AS catalinas
  FROM co_minutales
  WHERE time >= '2025-07-29T00:00:00Z'
  AND time < '2025-07-30T00:00:00Z'
  GROUP BY DATE_TRUNC('minute', time)
  ORDER BY time;
  `;
  try {
    const rows = [];
    for await (const row of influx.query(query, database)) {
      rows.push(row);
    }
    return rows;
  } catch (error) {
    console.error("Error in fetchDatosPorContaminante:", error);
    throw error;
  }
}
