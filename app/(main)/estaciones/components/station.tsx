"use client";

import { useState } from "react";
import StationPicker from "./station-picker";
import StationView from "./station-view";
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
  const [connectionUrl, setConnectionUrl] = useState<string | null>(null);

  const { data, error, status } = useSSE<StationData>(connectionUrl);

  const handleConnect = (stationId: string) => {
    setConnectionUrl(`/api/${stationId}`);
  };

  const handleDisconnect = () => {
    setConnectionUrl(null);
  };

  const isConnected = status === "open" || status === "connecting";

  return (
    <div className="w-full bg-gradient-to-br from-slate-100 via-blue-50/30 to-indigo-50/20 p-6 flex flex-col">
      <div className="max-w-7xl mx-auto w-full flex flex-col space-y-6">
        {/* Header de la página */}
        <div className="text-center space-y-3 flex-shrink-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/80 bg-clip-text text-transparent drop-shadow-sm">
            Estaciones de Calidad del Aire
          </h1>
          <p className="text-muted-foreground text-base max-w-3xl mx-auto leading-relaxed">
            Conecta a las estaciones de monitoreo atmosférico para visualizar
            datos en tiempo real.
          </p>
        </div>

        {/* Selector de estación */}
        <div className="flex-shrink-0">
          <StationPicker
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
            isConnected={isConnected}
          />
        </div>

        {/* Contenido principal */}
        <main className="flex-1">
          {/* Estado desconectado */}
          {status === "closed" && !data && (
            <Card className="bg-white/95 backdrop-blur-sm border-border/60 min-h-[400px] shadow-xl">
              <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="p-6 bg-muted/50 rounded-full mb-6 shadow-lg">
                  <WifiOff className="w-16 h-16 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">
                  No conectado
                </h3>
                <p className="text-muted-foreground max-w-lg text-lg leading-relaxed">
                  Selecciona una estación y hacé clic en Conectar para comenzar
                  a recibir datos.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Estado conectando */}
          {status === "connecting" && (
            <Card className="bg-white/95 backdrop-blur-sm border-primary/30 min-h-[400px] shadow-xl">
              <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="p-6 bg-primary/10 rounded-full mb-6 shadow-lg">
                  <Loader2 className="w-16 h-16 text-primary animate-spin" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-3">
                  Conectando...
                </h3>
                <p className="text-primary/80 text-lg">
                  Estableciendo conexión con la estación de monitoreo
                </p>
              </CardContent>
            </Card>
          )}

          {/* Estado de error */}
          {error && (
            <Card className="bg-white/95 backdrop-blur-sm border-destructive/30 min-h-[400px] shadow-xl">
              <CardContent className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="p-6 bg-destructive/10 rounded-full mb-6 shadow-lg">
                  <AlertCircle className="w-16 h-16 text-destructive" />
                </div>
                <h3 className="text-2xl font-bold text-destructive mb-3">
                  Error de conexión
                </h3>
                <p className="text-destructive/80 mb-6 max-w-lg text-lg">
                  {error}
                </p>
                <div className="flex items-center gap-3 text-muted-foreground text-base">
                  <WifiOff className="w-5 h-5" />
                  <span>Verifica la conexión e intenta nuevamente</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estado conectado y con datos */}
          {status === "open" && data && <StationView data={data} />}
        </main>
      </div>
    </div>
  );
}
