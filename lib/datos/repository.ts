import { influx } from "@/db/connection";

export async function getCoDiario() {
  const query = `
  SELECT date_bin(interval '1 hour', time) AS hour,
  AVG(CASE WHEN "location" = 'centenario' THEN "co_mean" END) AS co_centenario,
  COUNT(CASE WHEN "location" = 'centenario' THEN "co_mean" END) AS "minuteCount_centenario",
  CASE WHEN COUNT(CASE WHEN "location" = 'centenario' THEN "co_mean" END) >= 45 THEN 'ok' ELSE 'i' END AS status_centenario,
  
  AVG(CASE WHEN "location" = 'catalinas' THEN "co_mean" END) AS co_catalinas,
  COUNT(CASE WHEN "location" = 'catalinas' THEN "co_mean" END) AS "minuteCount_catalinas",
  CASE WHEN COUNT(CASE WHEN "location" = 'catalinas' THEN "co_mean" END) >= 45 THEN 'ok' ELSE 'i' END AS status_catalinas,

  AVG(CASE WHEN "location" = 'cordoba' THEN "co_mean" END) AS co_cordoba,
  COUNT(CASE WHEN "location" = 'cordoba' THEN "co_mean" END) AS "minuteCount_cordoba",
  CASE WHEN COUNT(CASE WHEN "location" = 'cordoba' THEN "co_mean" END) >= 45 THEN 'ok' ELSE 'i' END AS status_cordoba
  
  FROM "co_table"
  WHERE time >= date_trunc('hour', now() - interval '25h')
  AND time < date_trunc('hour', now())
  GROUP BY date_bin(interval '1 hour', time)
  ORDER BY hour;
  `;

  try {
    const result = [];
    for await (const row of influx.query(query, "minutales")) {
      result.push({
        time: new Date(row.hour).getTime().toString(),
        co_centenario: row.co_centenario || "0",
        minuteCount_centenario: row.minuteCount_centenario?.toString() || "0",
        status_centenario: row.status_centenario || "i",
        co_catalinas: row.co_catalinas || "0",
        minuteCount_catalinas: row.minuteCount_catalinas?.toString() || "0",
        status_catalinas: row.status_catalinas || "i",
        co_cordoba: row.co_cordoba || "0",
        minuteCount_cordoba: row.minuteCount_cordoba?.toString() || "0",
        status_cordoba: row.status_cordoba || "i",
      });
    }
    return result;
  } catch (error) {
    console.error("Error in getCoDiario:", error);
    throw error;
  }
}
