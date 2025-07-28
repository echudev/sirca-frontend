import { getInfluxData } from "./repository";
import { verifySession } from "../auth-session";
import { redirect } from "next/navigation";
import { DateTime } from "luxon";
import { CoHorarioData, InfluxDBRow, Status } from "./models";

export async function handleGetData(
  contaminante: string,
  hours: number = 25,
  interval: string = "1 hour"
): Promise<CoHorarioData[]> {
  // Verificar sesión
  const session = await verifySession();

  if (!session.isAuth) {
    // No hay sesión => No autorizado
    redirect("/login");
  }

  try {
    console.warn("Fetching data...");
    const influxRows = await getInfluxData(hours, interval, contaminante);

    // Si no hay datos, retornar array vacío
    if (!influxRows || influxRows.length === 0) {
      console.warn("No se encontraron datos");
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
      co_cifa: row.co_cifa,
      minuteCount_cifa: row.minuteCount_cifa,
      status_cifa: row.status_cifa as Status,
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

      // Helper function to safely get contaminant value
      const getContaminantValue = (loc: 'centenario' | 'catalinas' | 'cordoba' | 'cifa'): string => {
        const key = `${contaminante}_${loc}` as const;
        const value = row[key as keyof InfluxDBRow];
        return typeof value === 'string' ? value : '0';
      };

      // Create object with dynamic values based on selected contaminant
      return {
        date: dateStr,
        time: timeStr,
        [`${contaminante}_centenario`]: formatCO(getContaminantValue('centenario')),
        minuteCount_centenario: parseMinuteCount(row.minuteCount_centenario),
        status_centenario: row.status_centenario,
        [`${contaminante}_catalinas`]: formatCO(getContaminantValue('catalinas')),
        minuteCount_catalinas: parseMinuteCount(row.minuteCount_catalinas),
        status_catalinas: row.status_catalinas,
        [`${contaminante}_cordoba`]: formatCO(getContaminantValue('cordoba')),
        minuteCount_cordoba: parseMinuteCount(row.minuteCount_cordoba),
        status_cordoba: row.status_cordoba,
        [`${contaminante}_cifa`]: formatCO(getContaminantValue('cifa')),
        minuteCount_cifa: parseMinuteCount(row.minuteCount_cifa),
        status_cifa: row.status_cifa,
      };
    });

    return formattedData;
  } catch (error) {
    console.error("Error al obtener datos de CO Diario:", error);
    throw new Error("No se pudieron obtener los datos de CO Diario");
  }
}
