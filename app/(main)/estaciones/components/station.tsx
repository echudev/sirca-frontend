"use client";

import StationView from "./data-view";
import useSSE from "@/hooks/useSSE";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff, AlertCircle, Loader2 } from "lucide-react";
import { FullLocationData } from "@/lib/location/models";

function toTitle(location: string) {
  if (!location) return "Estación";
  const pretty = location.charAt(0).toUpperCase() + location.slice(1);
  return `Estación ${pretty}`;
}

export default function Station({
  location,
  title,
}: {
  location: string;
  title?: string;
}) {
  const { data, error, status } = useSSE<FullLocationData>(`/api/${location}`);

  return (
    <div className="w-full h-full p-6 flex flex-col max-w-7xl mx-auto">
      <div className="flex justify-center items-center relative">
        <h1 className="text-4xl font-bold text-center text-primary relative z-10">
          {title ?? toTitle(location)}
        </h1>
        <h1 className="absolute text-4xl font-bold text-center text-secondary -translate-x-[1px] translate-y-[1px] z-0">
          {title ?? toTitle(location)}
        </h1>
      </div>

      {/* Estado desconectado */}
      {status === "closed" && !data && (
        <Card className="bg-white/95 backdrop-blur-sm border-border/60">
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
          <div className="flex flex-col text-muted-foreground text-base">
            <span> Contacta al soporte técnico </span>
          </div>
        </div>
      )}

      {/* Estado conectado y con datos */}
      {status === "open" && data && <StationView data={data} />}
    </div>
  );
}
