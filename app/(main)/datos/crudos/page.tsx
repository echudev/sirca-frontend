import { Metadata } from "next";
import { fetchDatosPorContaminante } from "@/lib/datos/repository";
import Filtros from "./components/filters";
import Chart from "./components/chart";
import Table from "./components/table";
import { headers } from "next/headers";

export const metadata: Metadata = {
  title: "SIRCA - Minutales",
  description: "Datos crudos de calidad del aire",
};

export default async function CrudosPage() {
  // Obtener la URL completa desde los headers (usualmente x-url la setea Next.js)
  const header = await headers();
  const urlHeader = header.get("x-url");

  // Fallback a localhost si no está presente (solo para parseo local)
  const url = new URL(urlHeader ?? "http://localhost");
  const metrica = url.searchParams.get("metrica") ?? "co";
  const avg = url.searchParams.get("avg") ?? "hour";
  const fromString = url.searchParams.get("from") ?? new Date().toISOString();
  const toString =
    url.searchParams.get("to") ?? new Date().toLocaleDateString("es-AR");
  const from = fromString ? new Date(fromString) : undefined;
  const to = toString ? new Date(toString) : undefined;

  // Obtener los datos directamente desde la función en SSR
  const rawData = await fetchDatosPorContaminante();
  const data = Array.isArray(rawData)
    ? rawData.map((row) => ({
        time: row.time,
        centenario: Number(row.centenario ?? "s/d"),
        cordoba: Number(row.cordoba ?? "s/d"),
        catalinas: Number(row.catalinas ?? "s/d"),
      }))
    : [];

  return (
    <div className="space-y-8">
      {data && Array.isArray(data) && data.length > 0 ? (
        <>
          <Filtros currentFilters={{ metrica, avg, from, to }} />
          {data && <Chart data={data} />}
          {data && <Table data={data} />}
        </>
      ) : (
        <span>No hay datos disponibles.</span>
      )}
    </div>
  );
}
