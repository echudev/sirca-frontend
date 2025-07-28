import { NextResponse, NextRequest } from "next/server";
import { fetchLastMinuteCentenario } from "@/lib/datos/repository";

export const dynamic = "force-dynamic"; // Necesario para streaming

export async function GET(request: NextRequest) {
  // 1. Crear un transformador de stream
  const encoder = new TextEncoder();

  // 2. Inicializar el stream de respuesta
  const stream = new ReadableStream({
    async start(controller) {
      // Función para enviar datos al cliente
      const sendData = async () => {
        try {
          // Consulta a la DB
          const data = await fetchLastMinuteCentenario();

          // Formatear como evento SSE
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );
        } catch (error) {
          console.error("Error fetching data:", error);
          controller.enqueue(
            encoder.encode("event: error\ndata: DB query failed\n\n")
          );
        }
      };

      // Enviar primer set de datos
      await sendData();

      // Configurar intervalo para actualizaciones (60s)
      const interval = setInterval(sendData, 60000);

      // Manejar cierre de conexión
      request.signal.onabort = () => {
        clearInterval(interval);
        controller.close();
      };
    },
  });

  // 3. Devolver la respuesta como stream SSE
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Encoding": "none",
    },
  });
}
