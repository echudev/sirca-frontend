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
    <main className="container mx-auto">
      <div className="flex items-center justify-between space-y-2 my-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-primary">
            Estaciones de monitoreo
          </h2>
          <p className="text-muted-foreground">
            Listado con las estaciones que se encuentran en la red de calidad
            del aire
          </p>
        </div>
      </div>
      <Suspense fallback={<Loader />}>
        <TablaEstaciones />
      </Suspense>
    </main>
  );
}
