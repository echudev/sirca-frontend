"use client";

import { useState } from "react";
import StationPicker from "./station-picker";
import StationView from "./station-view";
import useSSE from "@/hooks/useSSE";

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
  // Estado para guardar la URL a la que nos vamos a conectar.
  // Se inicializa en null para que no haya conexión al principio.
  const [connectionUrl, setConnectionUrl] = useState<string | null>(null);

  const { data, error, status } = useSSE<StationData>(connectionUrl);

  // Esta función se la pasamos al StationPicker.
  // Se ejecuta cuando el usuario presiona "Conectar".
  const handleConnect = (stationId: string) => {
    setConnectionUrl(`/api/${stationId}`);
  };

  // Función para desconectar
  const handleDisconnect = () => {
    setConnectionUrl(null); // Poner la URL a null cerrará la conexión en el hook
  };

  const isConnected = status === "open" || status === "connecting";

  return (
    <div className="flex flex-col gap-4 p-4">
      <StationPicker
        onConnect={handleConnect}
        onDisconnect={handleDisconnect}
        isConnected={isConnected}
      />

      <main>
        {status === "closed" && !data && (
          <div className="text-center text-slate-600">Desconectado.</div>
        )}
        {status === "connecting" && <div>Conectando...</div>}
        {error && (
          <div className="p-4 text-red-700 bg-red-100 border border-red-400 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}
        {status === "open" && data && <StationView data={data} />}
      </main>
    </div>
  );
}
