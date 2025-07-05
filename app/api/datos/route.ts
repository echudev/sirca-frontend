import { NextRequest, NextResponse } from "next/server";
import { handleGetCoDiario } from "@/lib/datos/service";

export async function GET(request: NextRequest) {
  try {
    const data = await handleGetCoDiario();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Error al obtener los datos" },
      { status: 500 }
    );
  }
}
