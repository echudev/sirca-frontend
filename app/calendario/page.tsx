import { PageUnderConstruction } from "@/components/page-under-construction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIRCA - Calendario",
  description: "Calendario de la red",
};

export default async function Configuracion() {
  return (
    <PageUnderConstruction />
  );
}
