"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Wifi, MapPin, Power, PowerOff } from "lucide-react";
import { Card } from "@/components/ui/card";

const STATIONS = [
  { id: "centenario", name: "Centenario", location: "Buenos Aires" },
  { id: "catalinas", name: "Catalinas", location: "Buenos Aires" },
  { id: "cordoba", name: "Córdoba", location: "Buenos Aires" },
  { id: "cifa", name: "CIFA", location: "Buenos Aires" },
];

interface StationPickerProps {
  onConnect: (stationId: string) => void;
  onDisconnect: () => void;
  isConnected: boolean;
}

export default function StationPicker({
  onConnect,
  onDisconnect,
  isConnected,
}: StationPickerProps) {
  const [selected, setSelected] = useState(STATIONS[0].id);

  const handleConnect = () => {
    onConnect(selected);
  };

  const selectedStation = STATIONS.find((station) => station.id === selected);

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-border/60 shadow-md">
      <div className="p-8">
        {isConnected ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-bold text-primary">
                      Conectado a {selectedStation?.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-700 border-green-200 font-semibold px-3 py-1"
                    >
                      <Wifi className="w-4 h-4 mr-1" />
                      En línea
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            <Button
              onClick={onDisconnect}
              variant="outline"
              className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:border-destructive/50 transition-all duration-200 font-semibold px-6 py-2"
            >
              <PowerOff className="w-5 h-5 mr-2" />
              Desconectar
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  Seleccionar Estación
                </h3>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <Select
                  value={selected}
                  onValueChange={setSelected}
                  disabled={isConnected}
                >
                  <SelectTrigger className="w-full h-12 text-base">
                    <div className="flex items-center gap-3">
                      <SelectValue placeholder="Selecciona una estación" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel className="text-base font-semibold">
                        Estaciones disponibles
                      </SelectLabel>
                      {STATIONS.map((station) => (
                        <SelectItem key={station.id} value={station.id}>
                          <div className="flex items-center gap-3 py-1">
                            <MapPin className="w-4 h-4" />
                            <div>
                              <div className="font-semibold">
                                {station.name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {station.location}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleConnect}
                className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 font-semibold px-8 py-3 h-12"
              >
                <Power className="w-5 h-5 mr-2" />
                Conectar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
