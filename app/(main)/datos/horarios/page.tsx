import { PageUnderConstruction } from "@/components/page-under-construction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIRCA - Horarios",
  description: "Promedios horarios de los datos de calidad del aire",
};

export default async function HorariosPage() {
  return <PageUnderConstruction />;
}
