import { Metadata } from "next";
import Station from "./components/station";

export const metadata: Metadata = {
  title: "SIRCA - Estaciones",
  description: "Estaciones de monitoreo atmosférico",
};

export default function EstacionesPage() {
  return <Station />;
}
