import { useState } from "react";
import type { FiltrosType, DataRow } from "../app/(main)/datos/crudos/page";

export default function useFetchDatos() {
  const [data, setData] = useState<DataRow[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchDatos = async (filters: FiltrosType) => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({
        metrica: filters.metrica,
        avg: filters.avg,
        from: filters.from ? filters.from.toISOString() : "",
        to: filters.to ? filters.to.toISOString() : "",
      });
      const response = await fetch(`/api/datos?${params.toString()}`);
      if (!response.ok) {
        const errorText = await response.text();
        setError(errorText || "Error al obtener los datos");
        setData([]);
      } else {
        const rawData = await response.json();
        setData(Array.isArray(rawData.data) ? rawData.data : []);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Error inesperado");
      } else {
        setError("Error inesperado");
      }
      setData([]);
    }
    setIsLoading(false);
  };

  return { data, error, isLoading, fetchDatos };
}
