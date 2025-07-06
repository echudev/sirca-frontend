"use client";

import { useState, useEffect } from "react";

import { CoHorarioData } from "@/lib/datos/models";
import { getCOWithParams } from "@/app/actions/datos/co";
import Grafico from "./components/graph";
import Tabla from "./components/table";
import Filtros from "./components/filters";

export default function HistoricosPage() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CoHorarioData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCOWithParams();
      setData(result);
    } catch (error) {
      setError(
        ("Error al cargar los datos. Por favor, intente nuevamente más tarde: " +
          error) as string
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
        <Filtros fetchData={fetchData} loading={loading} />
      </div>

      <Grafico data={data} />
      <Tabla data={data} loading={loading} />
    </div>
  );
}
