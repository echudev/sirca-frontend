"use server";

import { handleGetCoHorario } from "@/lib/datos/service";

export async function getCOWithParams() {
  try {
    const data = await handleGetCoHorario();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error al obtener los datos");
  }
}
