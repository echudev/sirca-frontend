"use client";

import { useState } from "react";
import type { FiltrosType } from "../page";
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
  { label: "Minutos", value: "minute" },
  { label: "Horas", value: "hour" },
  { label: "Días", value: "day" },
];

interface FiltrosProps {
  currentFilters: FiltrosType;
  isLoading?: boolean;
  onFetch?: (filters: FiltrosType) => void;
}

export default function Filtros({
  currentFilters,
  isLoading = false,
  onFetch,
}: FiltrosProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Estado local para los selects
  const [localFilters, setLocalFilters] = useState(currentFilters);
  // Estado para popup de date pickers
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);

  // Helper que formatea la fecha para la UI: 'lun, dd/mm/yyyy'
  const formatDateUI = (date: string | Date | undefined) => {
    if (!date) return "Elegir Fecha";
    const d = typeof date === "string" ? new Date(date) : date;
    if (isNaN(d.getTime())) return "Elegir Fecha";
    return d.toLocaleDateString("es-AR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleChange = (key: string, value: string) => {
    setLocalFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // Convierte los valores a tipo Date para cumplir con FiltrosType
    const toDate = (date: string | Date | undefined): Date | undefined => {
      if (!date) return undefined;
      if (typeof date === "string") {
        const d = new Date(date);
        return isNaN(d.getTime()) ? undefined : d;
      }
      return date;
    };
    const filtersToSend = {
      metrica: localFilters.metrica,
      avg: localFilters.avg,
      from: toDate(localFilters.from),
      to: toDate(localFilters.to),
    };
    if (onFetch) onFetch(filtersToSend);
    // Para la URL, sigue enviando en formato UTC z
    const toUTCZ = (date: string | Date | undefined) => {
      if (!date) return "";
      const d = typeof date === "string" ? new Date(date) : date;
      if (isNaN(d.getTime())) return "";
      return d.toISOString();
    };
    const params = new URLSearchParams({
      metrica: localFilters.metrica,
      avg: localFilters.avg,
      from: toUTCZ(localFilters.from),
      to: toUTCZ(localFilters.to),
    });
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="p-2">
      <header className="mb-10">
        <h1 className="text-2xl text-primary/90 font-bold text-center">
          Datos de Calidad del Aire
        </h1>
        <h2 className="text-secondary-foreground/60 text-center">
          Seleccioná el contaminante, el tipo de integración y el rango de
          fechas para consultar los datos.
        </h2>
      </header>
      <div className="flex flex-col flex-wrap md:flex-row gap-4 items-center justify-center text-primary">
        {/* Select contaminante (metrica) */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="metrica" className="px-1">
            Métrica
          </Label>
          <Select
            name="metrica"
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
        </div>

        {/* Select promedio (minutal, horario, diario) */}
        <div className="flex flex-col gap-3">
          <Label htmlFor="avg" className="px-1">
            Integración
          </Label>
          <Select
            name="avg"
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
        </div>

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
                {formatDateUI(localFilters.from)}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={
                  localFilters.from ? new Date(localFilters.from) : undefined
                }
                captionLayout="dropdown"
                onSelect={(date) => {
                  handleChange("from", date ? date.toUTCString() : "");
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
                {formatDateUI(localFilters.to)}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={
                  localFilters.to ? new Date(localFilters.to) : undefined
                }
                captionLayout="dropdown"
                onSelect={(date) => {
                  handleChange("to", date ? date.toUTCString() : "");
                  setOpenTo(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          className="btn btn-primary text-primary bg-secondary hover:bg-secondary/60 ml-4 mt-auto"
          onClick={handleApply}
          disabled={isLoading}
        >
          Traer Datos
        </Button>
      </div>
    </div>
  );
}
