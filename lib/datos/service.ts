import { getCoDiario } from "./repository";
import { verifySession } from "../auth-session";
import { redirect } from "next/navigation";

type Status = 'ok' | 'i';
type Location = 'centenario' | 'catalinas' | 'cordoba';

export interface CoDiarioData {
  date: string;       // Formato: YYYY-MM-DD
  time: string;       // Formato: HH:MM
  co: number;         // Valor de CO con 2 decimales
  minuteCount: number;
  status: Status;
  location: Location;
}

interface InfluxDBRow {
  hour: string;
  co: string;
  minute_count: string;
  status: Status;
  location: Location;
}

export interface GroupedCoDiarioData {
  groupedData: Map<Location, CoDiarioData[]>;
  allLocations: Location[];
}

export async function handleGetCoDiario(): Promise<CoDiarioData[]> {
  // Verificar sesión
  const session = await verifySession();

  if (!session.isAuth) {
    // No hay sesión => No autorizado
    redirect("/login");
  }

  try {
    // Obtener datos de InfluxDB
    const rowsGenerator = await getCoDiario();
    const rows: InfluxDBRow[] = [];
    
    // Convertir el AsyncGenerator a un array
    for await (const row of rowsGenerator) {
      rows.push({
        hour: String(row.hour),
        co: String(row.co),
        minute_count: String(row.minute_count),
        status: row.status,
        location: row.location
      });
    }

    // Mapear los resultados a un formato estructurado
    const formattedData: CoDiarioData[] = rows
      .filter(row => row.hour) // Filtrar filas sin hora
      .map((row) => {
        // Convertir timestamp en milisegundos a fecha
        const timestampMs = parseInt(row.hour);
        if (isNaN(timestampMs)) {
          console.warn('Timestamp inválido recibido:', row.hour);
          return null;
        }
        
        // Crear fecha en UTC
        const utcDate = new Date(timestampMs);
        
        // Convertir a hora de Argentina (UTC-3)
        const argentinaOffset = 3 * 60 * 60 * 1000; // 3 horas en milisegundos
        const argentinaDate = new Date(utcDate.getTime() - argentinaOffset);
        
        // Formatear fecha y hora
        const dateStr = argentinaDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const timeStr = argentinaDate.toTimeString().split(':').slice(0, 2).join(':'); // HH:MM
        
        // Formatear CO a 2 decimales
        const coValue = parseFloat(parseFloat(row.co).toFixed(2));
        
        return {
          date: dateStr,
          time: timeStr,
          co: coValue,
          minuteCount: parseInt(row.minute_count) || 0,
          status: row.status,
          location: row.location,
        };
      })
      .filter((row): row is CoDiarioData => row !== null); // Filtrar filas nulas

    return formattedData;
  } catch (error) {
    console.error('Error al obtener datos de CO Diario:', error);
    throw new Error('No se pudieron obtener los datos de CO Diario');
  }
}