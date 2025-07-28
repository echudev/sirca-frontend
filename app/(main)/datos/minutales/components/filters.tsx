"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


const contaminantesOptions = [
  { label: "CO", value: "co" },
  { label: "NOx", value: "nox" },
  { label: "O3", value: "o3" },
];

const promedioOptions = [
  { label: "Horarios", value: "horario" },
  { label: "Diarios", value: "diario" },
];
const rangoOptions = [
  { label: "1 día", value: "1" },
  { label: "7 días", value: "7" },
  { label: "30 días", value: "30" },
];

interface FiltrosProps {
  currentFilters: {
    promedio: string;
    rango: string;
    contaminante: string;
  };
  isLoading?: boolean;
}

export default function FilterBar({ currentFilters, isLoading = false }: FiltrosProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Estado local para los selects
  const [localFilters, setLocalFilters] = useState(currentFilters);

  const handleChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams(localFilters);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      
      <Select 
        value={localFilters.contaminante} 
        onValueChange={(value) => handleChange('contaminante', value)}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {contaminantesOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select 
        value={localFilters.promedio} 
        onValueChange={(value) => handleChange('promedio', value)}
        disabled={isLoading}
      >
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
      
      <Select 
        value={localFilters.rango} 
        onValueChange={(value) => handleChange('rango', value)}
        disabled={isLoading}
      >
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
      <button
        className="btn btn-primary ml-4"
        onClick={handleApply}
        disabled={isLoading}
      >
        Traer Datos
      </button>
    </div>
  );
}