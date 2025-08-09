"use client";

import StationView from "./data-view";
import useSSE from "@/hooks/useSSE";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff, AlertCircle, Loader2 } from "lucide-react";
import { FullLocationData } from "@/lib/location/models";

function toTitle(location: string) {
  if (!location) return "Estación";
  return `Estación ${location}`;
}

export default function Station({ location }: { location: string }) {
  const { data, error, status } = useSSE<FullLocationData>(`/api/${location}`);

  return (
    <div className="w-full h-full p-6 flex flex-col max-w-7xl mx-auto">
      <div className="flex items-center relative gap-3">
        <div className="w-1 h-6 rounded-full bg-primary" />
        <h1 className="text-2xl font-bold text-primary relative z-10 uppercase tracking-wider">
          {toTitle(location)}
        </h1>
      </div>

      {/* Estado desconectado */}
      {status === "closed" && !data && (
        <Card className="bg-white/95 backdrop-blur-xs border-border/60">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="p-6 bg-muted/50 rounded-full">
              <WifiOff className="w-16 h-16 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-muted-foreground mb-3">
              No conectado
            </h3>
          </CardContent>
        </Card>
      )}

      {/* Estado conectando */}
      {status === "connecting" && (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
          <div className="p-6 bg-primary/10 rounded-full mb-6">
            <Loader2 className="w-16 h-16 text-primary animate-spin" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-3">
            Conectando...
          </h3>
        </div>
      )}

      {/* Estado de error */}
      {error && (
        <div className="w-full h-full flex flex-col items-center justify-center text-center">
          <div className="p-6 bg-destructive/10 rounded-full mb-6 shadow-lg">
            <AlertCircle className="w-16 h-16 text-destructive" />
          </div>
          <h3 className="text-2xl font-bold text-destructive mb-3">
            Error de conexión
          </h3>
          <p className="text-destructive/80 mb-6 max-w-lg text-lg">{error}</p>
        </div>
      )}

      {/* Estado conectado y con datos */}
      {status === "open" && data && <StationView data={data} />}
    </div>
  );
}
