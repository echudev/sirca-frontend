import { Suspense } from "react";
import { CoHorarioData } from "@/lib/datos/models";
import Grafico from "./components/graph";
import Tabla from "./components/table";
import Filtros from "./components/filters";

import { headers } from "next/headers";

export default async function HorariosPage() {
  // Obtener la URL completa desde los headers (usualmente x-url la setea Next.js)
  const header = await headers();
  const urlHeader = header.get("x-url");
  // Fallback a localhost si no está presente (solo para parseo local)
  const url = new URL(urlHeader ?? "http://localhost");
  const metrica = url.searchParams.get("metrica") ?? "co";
  const avg = url.searchParams.get("avg") ?? "horario";
  const from =
    url.searchParams.get("from") ?? new Date().toLocaleDateString("es-AR");
  const to =
    url.searchParams.get("from") ?? new Date().toLocaleDateString("es-AR");

  // Cargar datos en el servidor
  let data: CoHorarioData[] = [];
  let error: string | null = null;

  try {
  } catch (err) {
    console.error("Error loading data:", err);
    error =
      "Error al cargar los datos. Por favor, intente nuevamente más tarde.";
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          Datos de Calidad del Aire
        </h1>
        <Suspense fallback={<div>Cargando filtros...</div>}>
          <Filtros
            currentFilters={{ metrica, avg, from, to }}
            isLoading={false}
          />
        </Suspense>
      </div>

      {/* <Grafico data={data} />
      <Tabla data={data} loading={false} /> */}
    </div>
  );
}
