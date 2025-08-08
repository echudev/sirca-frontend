import { NextResponse, NextRequest } from "next/server";
import { fetchLastMinuteByLocation } from "@/lib/location/repository";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ location: string }> }
) {
  const { location } = await context.params;

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const sendData = async () => {
        try {
          const data = await fetchLastMinuteByLocation(location);
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
