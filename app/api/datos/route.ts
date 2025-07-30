import { NextResponse, NextRequest } from "next/server";
import { fetchDatosPorContaminante } from "@/lib/datos/repository";

export async function GET(request: NextRequest) {
  try {
    // Extraer parámetros de búsqueda de la URL
    const searchParams = request.nextUrl.searchParams;
    
    // Parsear parámetros con valores por defecto
    const contaminant = searchParams.get('contaminant') || 'co';
    const locationsParam = searchParams.get('locations');
    const locations = locationsParam ? locationsParam.split(',') : ['centenario', 'cordoba', 'catalinas'];
    const startDate = searchParams.get('startDate') || '2025-07-29T00:00:00Z';
    const endDate = searchParams.get('endDate') || '2025-07-30T00:00:00Z';
    const interval = searchParams.get('interval') || 'minute';
    
    const params = {
      contaminant,
      locations,
      startDate,
      endDate,
      interval
    };

    // Validar y sanitizar parámetros
    const validContaminants = ['co', 'no2', 'no', 'nox', 'pm10', 'pm25', 'o3'];
    if (!validContaminants.includes(params.contaminant)) {
      return NextResponse.json({ 
        error: `Contaminant '${params.contaminant}' is not valid. Valid options: ${validContaminants.join(', ')}` 
      }, { status: 400 });
    }

    const validIntervals = ['minute', 'hour', 'day'];
    if (!validIntervals.includes(params.interval)) {
      return NextResponse.json({ 
        error: `Interval '${params.interval}' is not valid. Valid options: ${validIntervals.join(', ')}` 
      }, { status: 400 });
    }

    // Consulta a la DB con parámetros dinámicos
    const result = await fetchDatosPorContaminante(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
