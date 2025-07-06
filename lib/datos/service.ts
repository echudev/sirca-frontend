import { getCoDiario } from "./repository";
import { verifySession } from "../auth-session";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { CoHorarioData, InfluxDBRow, Status } from "./models";

export async function handleGetCoHorario(): Promise<CoHorarioData[]> {
  // Verificar sesión
  const session = await verifySession();

  if (!session.isAuth) {
    // No hay sesión => No autorizado
    redirect("/login");
  }

  try {
    console.warn("Fetching CO Diario data...");
    const influxRows = await getCoDiario();

    // Si no hay datos, retornar array vacío
    if (!influxRows || influxRows.length === 0) {
      console.warn("No se encontraron datos de CO Diario");
      return [];
    }

    // Convertir los datos a InfluxDBRow[]
    const rows: InfluxDBRow[] = influxRows.map((row) => ({
      time: row.time,
      co_centenario: row.co_centenario,
      minuteCount_centenario: row.minuteCount_centenario,
      status_centenario: row.status_centenario as Status,
      co_catalinas: row.co_catalinas,
      minuteCount_catalinas: row.minuteCount_catalinas,
      status_catalinas: row.status_catalinas as Status,
      co_cordoba: row.co_cordoba,
      minuteCount_cordoba: row.minuteCount_cordoba,
      status_cordoba: row.status_cordoba as Status,
    }));

    // Filtrar filas sin hora o con timestamp inválido
    const validRows = rows.filter((row) => {
      if (!row.time) return false;
      const timestampMs = parseInt(row.time);
      if (isNaN(timestampMs)) {
        console.warn("Timestamp inválido recibido:", row.time);
        return false;
      }
      return true;
    });

    // Mapear los resultados a un formato estructurado
    const formattedData: CoHorarioData[] = validRows.map((row) => {
      // Convertir timestamp en milisegundos a fecha (ya validado)
      const timestampMs = parseInt(row.time); // En milisegundos UTC

      const dt = DateTime.fromMillis(timestampMs, { zone: "UTC" }) // confirmar que es UTC
        .setZone("America/Argentina/Buenos_Aires"); // convertir a UTC-3

      // separo datetime en date y time
      const dateStr = dt.toFormat("yyyy-MM-dd");
      const timeStr = dt.toFormat("HH:mm");

      // Formatear COs a 2 decimales
      const formatCO = (value: string | number): number => {
        const num = typeof value === "string" ? parseFloat(value) : value;
        return parseFloat(num.toFixed(2));
      };

      // Función auxiliar para parsear los contadores de minutos
      const parseMinuteCount = (value: string | number): number => {
        if (value === null || value === undefined) return 0;
        const num = typeof value === "string" ? parseInt(value, 10) : value;
        return isNaN(num) ? 0 : num;
      };

      return {
        date: dateStr,
        time: timeStr,
        co_centenario: formatCO(row.co_centenario),
        minuteCount_centenario: parseMinuteCount(row.minuteCount_centenario),
        status_centenario: row.status_centenario,
        co_catalinas: formatCO(row.co_catalinas),
        minuteCount_catalinas: parseMinuteCount(row.minuteCount_catalinas),
        status_catalinas: row.status_catalinas,
        co_cordoba: formatCO(row.co_cordoba),
        minuteCount_cordoba: parseMinuteCount(row.minuteCount_cordoba),
        status_cordoba: row.status_cordoba,
      };
    });

    return formattedData;
  } catch (error) {
    console.error("Error al obtener datos de CO Diario:", error);
    throw new Error("No se pudieron obtener los datos de CO Diario");
  }
}
