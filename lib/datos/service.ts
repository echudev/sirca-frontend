import { getCoDiario } from "./repository";
import { verifySession } from "../auth-session";
import { redirect } from "next/navigation";

type Status = 'ok' | 'i';

interface InfluxDBRow {
  time: string;
  co_centenario: string;
  minuteCount_centenario: string;
  status_centenario: Status;
  co_catalinas: string;
  minuteCount_catalinas: string;
  status_catalinas: Status;
  co_cordoba: string;
  minuteCount_cordoba: string;
  status_cordoba: Status;
}

export interface CoDiarioData {
  date: string;                    // Formato: YYYY-MM-DD
  time: string;                    // Formato: HH:MM
  co_centenario: number;
  minuteCount_centenario: number;
  status_centenario: Status;
  co_catalinas: number;
  minuteCount_catalinas: number;
  status_catalinas: Status;
  co_cordoba: number;
  minuteCount_cordoba: number;
  status_cordoba: Status;
}

export async function handleGetCoDiario(): Promise<CoDiarioData[]> {
  // Verificar sesión
  const session = await verifySession();

  if (!session.isAuth) {
    // No hay sesión => No autorizado
    redirect("/login");
  }

  try {
    console.warn('Fetching CO Diario data...');
    const influxRows = await getCoDiario();
    
    // Si no hay datos, retornar array vacío
    if (!influxRows || influxRows.length === 0) {
      console.warn('No se encontraron datos de CO Diario');
      return [];
    }
    
    // Convertir los datos a InfluxDBRow[]
    const rows: InfluxDBRow[] = influxRows.map(row => ({
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
    const validRows = rows.filter(row => {
      if (!row.time) return false;
      const timestampMs = parseInt(row.time);
      if (isNaN(timestampMs)) {
        console.warn('Timestamp inválido recibido:', row.time);
        return false;
      }
      return true;
    });

    // Mapear los resultados a un formato estructurado
    const formattedData: CoDiarioData[] = validRows.map((row) => {
      // Convertir timestamp en milisegundos a fecha (ya validado)
      const timestampMs = parseInt(row.time);
        
        // Crear fecha en UTC
        const rowDate = new Date(timestampMs);
        // Formatear fecha y hora
        const dateStr = rowDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = rowDate.toTimeString().split(':').slice(0, 2).join(':'); // HH:MM

        // Formatear COs a 2 decimales
        const formatCO = (value: string | number): number => {
          const num = typeof value === 'string' ? parseFloat(value) : value;
          return parseFloat(num.toFixed(2));
        };
        
        // Función auxiliar para parsear los contadores de minutos
        const parseMinuteCount = (value: string | number): number => {
          if (value === null || value === undefined) return 0;
          const num = typeof value === 'string' ? parseInt(value, 10) : value;
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
      })

    return formattedData;
  } catch (error) {
    console.error('Error al obtener datos de CO Diario:', error);
    throw new Error('No se pudieron obtener los datos de CO Diario');
  }
}