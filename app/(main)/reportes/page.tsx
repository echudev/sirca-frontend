import { PageUnderConstruction } from "@/components/page-under-construction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIRCA - Reportes",
  description: "Reportes de calidad del aire",
};

export default async function ReportesPage() {
  return (
    <PageUnderConstruction />
  );
}
