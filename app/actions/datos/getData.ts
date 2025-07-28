import { handleGetData } from "@/lib/datos/service";

type Filters = {
  contaminante: string;
  promedio: string;
  rango: string;
};

export async function getDataWithParams(filters: Filters) {
  try {
    // Convertir el rango a un número de horas
    const hours = parseInt(filters.rango) * 24; // Convertir días a horas
    const interval = filters.promedio === 'horario' ? 'hour' : 'day';
    const contaminante = filters.contaminante;
    console.warn(hours, interval, contaminante);
    
    const data = await handleGetData(contaminante, hours, interval);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error al obtener los datos");
  }
}