import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth-session";
import { LocationEnum } from "@/lib/location/models";
import { fetchLastMinuteByLocation } from "@/lib/location/repository";
import { applyFreshnessCheck } from "@/lib/location/service";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ location: string }> },
) {
  // El matcher de proxy.ts excluye /api, así que la sesión se verifica acá.
  if (!(await getSession())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { location: rawLocation } = await context.params;

  // El repositorio interpola este valor en SQL crudo: sin el enum, cualquier
  // string de la URL termina dentro del WHERE.
  const parsed = LocationEnum.safeParse(rawLocation);
  if (!parsed.success) {
    return NextResponse.json({ error: "Estación inválida" }, { status: 404 });
  }
  const location = parsed.data;

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const sendData = async () => {
        try {
          const data = await fetchLastMinuteByLocation(location);
          const sanitizedData = applyFreshnessCheck(data);
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(sanitizedData)}\n\n`),
          );
        } catch (error) {
          console.error("Error fetching data:", error);
          controller.enqueue(
            encoder.encode("event: error\ndata: DB query failed\n\n"),
          );
        }
      };

      await sendData();

      const interval = setInterval(sendData, 60000);

      // Close on client abort
      request.signal.onabort = () => {
        clearInterval(interval);
        controller.close();
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Encoding": "none",
    },
  });
}
