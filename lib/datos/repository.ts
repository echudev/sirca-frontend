import { influx } from "@/db/connection";

export async function getCoDiario() {
  const query = `SELECT
 date_bin(interval '1 hour', time) AS hour,
 mean("co_mean") AS co,
 COUNT("co_mean") AS minute_count,
 CASE
 WHEN COUNT("co_mean") >= 45 THEN 'ok'
 ELSE 'i'
 END AS status,
 "location"
FROM "co_table"
WHERE
 time >= now() - interval '24h'
GROUP BY
 date_bin(interval '1 hour', time),
 "location"
ORDER BY
 hour, "location"
`

const rows = influx.query(query, 'minutales')

return rows
}