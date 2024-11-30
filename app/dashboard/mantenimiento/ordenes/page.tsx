import { Filters } from "@/components/Filters";
import { Table } from "@/components/Table";
import { Metadata } from "next";
import GetOrdenes from "@/app/lib/getOrdenes";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "SIRCA - Mantenimiento",
  description: "App de mantenimiento de la red",
};

export default async function Ordenes() {
  const { allOrdenes } = await GetOrdenes();

  return (
    <main className="flex flex-col p-4">
      <Header
        title="Ordenes de Trabajo"
        path="Mantenimiento"
        subpath="Ordenes"
      />
      <Filters />
      <Table data={allOrdenes} />
    </main>
  );
}
