import { Table } from "@/components/Table";
import { Metadata } from "next";
import GetOrdenes from "@/lib/inventory/getOrdenes";

export const metadata: Metadata = {
  title: "SIRCA - Mantenimiento",
  description: "App de mantenimiento de la red",
};

export default async function Ordenes() {
  const { allOrdenes } = await GetOrdenes();

  return (
    <main className="flex flex-col p-4">
      <Table data={allOrdenes} />
    </main>
  );
}
