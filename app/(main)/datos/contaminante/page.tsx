"use client";
import { useState } from "react";
import Filtros from "./components/filters";
import Chart from "./components/chart";
import Table from "./components/table";
import useFetchDatos from "@/hooks/useFetchDatos";

export interface FiltrosType {
  metrica: string;
  interval: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

export interface DataRow extends Record<string, string | number> {
  time: string;
}

export default function CrudosPage() {
  const [filters, setFilters] = useState<FiltrosType>({
    metrica: "co",
    interval: "hour",
    startDate: undefined,
    endDate: undefined,
  });
  const { data, error, isLoading, fetchDatos } = useFetchDatos();

  const handleFetch = (newFilters: FiltrosType) => {
    setFilters(newFilters);
    fetchDatos(newFilters);
  };

  return (
    <div className="space-y-8">
      <Filtros
        currentFilters={filters}
        isLoading={isLoading}
        onFetch={handleFetch}
      />
      {isLoading && <div>Cargando Datos</div>}
      {error && <div>Ocurrió el siguiente error: {error}</div>}
      {Array.isArray(data) && data.length > 0 && !isLoading && !error ? (
        <>
          <Chart data={data} />
          <Table data={data} />
        </>
      ) : (
        !isLoading && !error && <span>No hay datos disponibles.</span>
      )}
    </div>
  );
}
