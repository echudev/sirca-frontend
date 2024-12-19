import { Metadata } from "next";
import { Suspense } from "react";
import TablaEstaciones from "./tabla-estaciones";
import Loader from "@/app/loading";

export const metadata: Metadata = {
  title: "SIRCA - Inventario",
  description: "App de inventario de la red",
};

export default function Estaciones() {
  return (
    <div className="flex flex-col h-full space-y-5 p-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Estaciones de monitoreo
        </h2>
        <p className="text-muted-foreground">
          Listado con las estaciones que se encuentran en la red de calidad del
          aire
        </p>
      </div>
      <Suspense fallback={<Loader />}>
        <TablaEstaciones />
      </Suspense>
    </div>
  );
}
