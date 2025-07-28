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
export async function getInfluxData(
  hours: number = 25,
  interval: string = "hour",
  contaminante: string = "co"
) {
  const dateTruncUnit = interval === "day" ? "day" : "hour";
  const dateBinInterval = interval === "day" ? "'1 day'" : "'1 hour'";

  const query = `
  SELECT date_bin(interval ${dateBinInterval}, time) AS hour,
  AVG(CASE WHEN "location" = 'centenario' THEN "${contaminante}_mean" END) AS centenario,
  COUNT(CASE WHEN "location" = 'centenario' THEN "${contaminante}_mean" END) AS "minuteCount_centenario",
  CASE WHEN COUNT(CASE WHEN "location" = 'centenario' THEN "${contaminante}_mean" END) >= 45 THEN 'ok' ELSE 'i' END AS status_centenario,
  
  AVG(CASE WHEN "location" = 'catalinas' THEN "${contaminante}_mean" END) AS catalinas,
  COUNT(CASE WHEN "location" = 'catalinas' THEN "${contaminante}_mean" END) AS "minuteCount_catalinas",
  CASE WHEN COUNT(CASE WHEN "location" = 'catalinas' THEN "${contaminante}_mean" END) >= 45 THEN 'ok' ELSE 'i' END AS status_catalinas,

  AVG(CASE WHEN "location" = 'cordoba' THEN "${contaminante}_mean" END) AS cordoba,
  COUNT(CASE WHEN "location" = 'cordoba' THEN "${contaminante}_mean" END) AS "minuteCount_cordoba",
  CASE WHEN COUNT(CASE WHEN "location" = 'cordoba' THEN "${contaminante}_mean" END) >= 45 THEN 'ok' ELSE 'i' END AS status_cordoba,

  AVG(CASE WHEN "location" = 'cifa' THEN "${contaminante}_mean" END) AS cifa,
  COUNT(CASE WHEN "location" = 'cifa' THEN "${contaminante}_mean" END) AS "minuteCount_cifa",
  CASE WHEN COUNT(CASE WHEN "location" = 'cifa' THEN "${contaminante}_mean" END) >= 45 THEN 'ok' ELSE 'i' END AS status_cifa
  
  FROM "measurements"
  WHERE time >= date_trunc('${dateTruncUnit}', now() - interval '${hours} hours')
  AND time < date_trunc('${dateTruncUnit}', now())
  GROUP BY 1
  ORDER BY hour;
  `;

  try {
    const result = [];
    for await (const row of influx.query(query, "minutales")) {
      // Crear un objeto con los valores dinámicos según el contaminante seleccionado
      const resultObj = {
        time: new Date(row.hour).getTime().toString(),
        [`${contaminante}_centenario`]: row.centenario || "0",
        minuteCount_centenario: row.minuteCount_centenario?.toString() || "0",
        status_centenario: row.status_centenario || "i",
        [`${contaminante}_catalinas`]: row.catalinas || "0",
        minuteCount_catalinas: row.minuteCount_catalinas?.toString() || "0",
        status_catalinas: row.status_catalinas || "i",
        [`${contaminante}_cordoba`]: row.cordoba || "0",
        minuteCount_cordoba: row.minuteCount_cordoba?.toString() || "0",
        status_cordoba: row.status_cordoba || "i",
        [`${contaminante}_cifa`]: row.cifa || "0",
        minuteCount_cifa: row.minuteCount_cifa?.toString() || "0",
        status_cifa: row.status_cifa || "i",
      };
      result.push(resultObj);
    }
    return result;
  } catch (error) {
    console.error("Error in getCoDiario:", error);
    throw error;
  }
}
