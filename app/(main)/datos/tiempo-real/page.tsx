import { PageUnderConstruction } from "@/components/page-under-construction";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SIRCA - Tiempo Real",
  description: "Tiempo Real",
};

export default async function RealTimePage() {
  return <PageUnderConstruction />;
}
