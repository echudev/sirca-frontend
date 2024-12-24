import { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import TablaEstaciones from "./tabla-estaciones";
import Loader from "@/app/loading";

export const metadata: Metadata = {
  title: "SIRCA - Inventario",
  description: "App de inventario de la red",
};

const title = "Estaciones de monitoreo";
const description = "Listado con las estaciones que se encuentran en la red de calidad del aire";

export default function Estaciones() {
  return (
    <div className="flex flex-col p-4 overflow-auto">
      <PageHeader title={title} description={description} />
      <Suspense fallback={<Loader />}>
        <TablaEstaciones />
      </Suspense>
    </div>
  );
}
