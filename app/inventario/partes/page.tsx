import { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { DataTable } from "./components/data-table";
import { columns } from "./components/table-columns"
import Loader from "@/app/loading";
import { handleGetPartes } from "@/lib/inventario/service";

export const metadata: Metadata = {
  title: "SIRCA - Inventario",
  description: "App de inventario de la red",
};

const title = "Listado de Partes";
export const revalidate = 60

export default async function Partes() {
  const data = await handleGetPartes();

  return (
    <div className="flex flex-col h-full px-4 overflow-auto">
      <PageHeader title={title} />
      <Suspense fallback={<Loader />}>
        {data ?
          <DataTable columns={columns} data={data} />
          :
          <p>Error al Conectar con la base de datos</p>
        }
      </Suspense>
    </div>
  );
}