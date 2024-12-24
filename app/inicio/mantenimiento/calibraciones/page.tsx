import { PageUnderConstruction } from "@/components/page-under-construction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIRCA - Mantenimiento",
  description: "App de mantenimiento de la red",
};

export default async function Calibraciones() {
  return (
    <PageUnderConstruction />
  );
}
