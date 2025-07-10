"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const promedioOptions = [
  { label: "Promedios minutales", value: "minutal" },
  { label: "Promedios horarios", value: "horario" },
];
const rangoOptions = [
  { label: "1 día", value: "1" },
  { label: "7 días", value: "7" },
  { label: "30 días", value: "30" },
  { label: "90 días", value: "90" },
];

interface FiltrosProps {
  fetchData: () => Promise<void>;
  loading: boolean;
}

export default function Filtros({ fetchData, loading }: FiltrosProps) {
  const [promedio, setPromedio] = useState("minutal");
  const [rango, setRango] = useState("1");

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      <Select value={promedio} onValueChange={setPromedio}>
        <SelectTrigger className="w-[180px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {promedioOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={rango} onValueChange={setRango}>
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {rangoOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={fetchData} disabled={loading} className="h-9">
        {loading ? "Cargando..." : "Traer datos"}
      </Button>
    </div>
  );
}
