import { NextResponse, NextRequest } from "next/server";
import { fetchDatosPorContaminante } from "@/lib/datos/repository";

export async function GET(request: NextRequest) {
  try {
    // Consulta a la DB
    const data = await fetchDatosPorContaminante();
    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Error fetching data" }, { status: 500 });
  }
}
