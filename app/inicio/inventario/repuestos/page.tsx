import { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import TablaPartes from "./components/data-table-ssr";
import Loader from "@/app/loading";

export const metadata: Metadata = {
  title: "SIRCA - Inventario",
  description: "App de inventario de la red",
};

const title = "Repuestos";
const description = "Listado con los repuestos nuevos y usados en la red";

export default function Repuestos() {
  return (
    <div className="flex flex-col h-full px-4 overflow-auto">
      <PageHeader title={title} description={description} />
      <Suspense fallback={<Loader />}>
        <TablaPartes />
      </Suspense>
    </div>
  );
}