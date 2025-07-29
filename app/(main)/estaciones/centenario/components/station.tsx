"use client";

import StationView from "./data-view";
import useSSE from "@/hooks/useSSE";
import { Card, CardContent } from "@/components/ui/card";
import { WifiOff, AlertCircle, Loader2 } from "lucide-react";

interface StationData {
  time: string;
  location: string;
  co_mean: number;
  no2_mean: number;
  no_mean: number;
  nox_mean: number;
  pm10: number;
  pm10_mean: number;
  dv_mean: number;
  hr_in_mean: number;
  hr_mean: number;
  lluvia_mean: number;
  temp_in_mean: number;
  temp_mean: number;
  vv_mean: number;
}

export default function Station() {
  const { data, error, status } = useSSE<StationData>("/api/centenario");

  return (
    <div className="w-full h-full p-6 flex flex-col max-w-7xl mx-auto">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl font-bold text-center text-primary">
          Estación Centenario
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
