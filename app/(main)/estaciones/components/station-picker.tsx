"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATIONS = [
  { id: "centenario", name: "Centenario" },
  { id: "catalinas", name: "Catalinas" },
  { id: "cordoba", name: "Córdoba" },
  { id: "cifa", name: "CIFA" },
];

interface StationPickerProps {
  // Función que se llamará cuando el usuario haga clic en "Conectar"
  onConnect: (stationId: string) => void;
  // Función para desconectar
  onDisconnect: () => void;
  isConnected: boolean;
}

export default function StationPicker({
  onConnect,
  onDisconnect,
  isConnected,
}: StationPickerProps) {
  // Estado interno para guardar la estación seleccionada en el dropdown
  const [selected, setSelected] = useState(STATIONS[0].id);

  const handleConnect = () => {
    onConnect(selected);
  };

  return (
    <>
      {isConnected ? (
        <div className="">
          <Button
            onClick={onDisconnect}
            variant="outline"
            className="hover:bg-red-600 hover:text-white border-red-600 text-red-600"
          >
            Desconectar
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            onClick={handleConnect}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Conectar
          </Button>
          <Select
            value={selected}
            onValueChange={setSelected}
            disabled={isConnected}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Selecciona una estación" />
            </SelectTrigger>
            <SelectContent>
              {STATIONS.map((station) => (
                <SelectItem key={station.id} value={station.id}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
}
