"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const contaminantesOptions = [
  { label: "CO", value: "co" },
  { label: "NOx", value: "nox" },
  { label: "PM10", value: "pm10" },
  { label: "O3", value: "o3" },
  { label: "SO2", value: "so2" },
];

const promedioOptions = [
  { label: "Minutales", value: "minute" },
  { label: "Horarios", value: "hour" },
  { label: "Diarios", value: "day" },
];

interface FiltrosProps {
  currentFilters: {
    metrica: string;
    avg: string;
    from: string;
    to: string;
  };
  isLoading?: boolean;
}

export default function Filtros({
  currentFilters,
  isLoading = false,
}: FiltrosProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Estado local para los selects
  const [localFilters, setLocalFilters] = useState(currentFilters);
  // Estado para popup de date pickers
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  const handleChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    const params = new URLSearchParams(localFilters);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center">
      {/* Select contaminante (metrica) */}
      <Select
        value={localFilters.metrica}
        onValueChange={(value) => handleChange("metrica", value)}
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

      {/* Select promedio (minutal, horario, diario) */}
      <Select
        value={localFilters.avg ?? ""}
        onValueChange={(value) => handleChange("avg", value)}
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

      {/* from date picker */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1">
          Desde
        </Label>
        <Popover open={openFrom} onOpenChange={setOpenFrom}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {localFilters.from ? localFilters.from : "Elegir Fecha"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={
                localFilters.from ? new Date(localFilters.from) : undefined
              }
              captionLayout="dropdown"
              onSelect={(date) => {
                handleChange("from", String(date));
                setOpenFrom(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* to date picker */}
      <div className="flex flex-col gap-3">
        <Label htmlFor="date" className="px-1">
          Hasta
        </Label>
        <Popover open={openTo} onOpenChange={setOpenTo}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className="w-48 justify-between font-normal"
            >
              {localFilters.to ? localFilters.to : "Elegir Fecha"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={localFilters.to ? new Date(localFilters.to) : undefined}
              captionLayout="dropdown"
              onSelect={(date) => {
                handleChange("to", String(date));
                setOpenTo(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

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
