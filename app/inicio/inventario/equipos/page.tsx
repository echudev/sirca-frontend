import { Metadata } from "next";
import { Table } from "@/components/Table";
import GetEquipos from "@/lib/inventory/getEquipos";

export const metadata: Metadata = {
  title: "SIRCA - Mantenimiento",
  description: "App de mantenimiento de la red",
};

export default async function Equipos() {
  const { allEquipos } = await GetEquipos();

  return (
    <main className="flex flex-col p-4">
      <Table data={allEquipos} />
    </main>
  );
}
