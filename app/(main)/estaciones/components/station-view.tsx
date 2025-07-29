import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Clock,
  Calendar,
  Zap,
  Cloud,
} from "lucide-react";

interface StationData {
  time: string;
  co_mean: number;
  location: string;
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

// Categorías de métricas con iconos y colores
const metricasCategorizadas = [
  {
    categoria: "Contaminantes",
    color: "from-primary to-primary/80",
    bgColor: "bg-gradient-to-br from-primary/5 to-primary/10",
    borderColor: "border-primary/20",
    metrics: [
      {
        key: "co_mean",
        nombre: "CO",
        nombreCompleto: "Monóxido de Carbono",
        unidad: "ppm",
        icon: Cloud,
      },
      {
        key: "no_mean",
        nombre: "NO",
        nombreCompleto: "Óxido de Nitrógeno",
        unidad: "ppb",
        icon: Zap,
      },
      {
        key: "no2_mean",
        nombre: "NO₂",
        nombreCompleto: "Dióxido de Nitrógeno",
        unidad: "ppb",
        icon: Zap,
      },
      {
        key: "nox_mean",
        nombre: "NOₓ",
        nombreCompleto: "Óxidos Totales",
        unidad: "ppb",
        icon: Zap,
      },
      {
        key: "pm10_mean",
        nombre: "PM₁₀",
        nombreCompleto: "Material Particulado < 10 μm",
        unidad: "μg/m³",
        icon: CloudRain,
      },
    ],
  },
  {
    categoria: "Meteorología",
    color: "from-secondary to-secondary/80",
    bgColor: "bg-gradient-to-br from-secondary/5 to-secondary/10",
    borderColor: "border-secondary/20",
    metrics: [
      {
        key: "temp_mean",
        nombre: "Temperatura",
        nombreCompleto: "Temperatura",
        unidad: "°C",
        icon: Thermometer,
      },
      {
        key: "hr_mean",
        nombre: "Humedad",
        nombreCompleto: "Humedad Relativa",
        unidad: "%",
        icon: Droplets,
      },
      {
        key: "dv_mean",
        nombre: "Dirección Viento",
        nombreCompleto: "Dirección del Viento",
        unidad: "°",
        icon: Wind,
      },
      {
        key: "vv_mean",
        nombre: "Velocidad Viento",
        nombreCompleto: "Velocidad del Viento",
        unidad: "m/s",
        icon: Wind,
      },
      {
        key: "lluvia_mean",
        nombre: "Lluvia",
        nombreCompleto: "Precipitaciones",
        unidad: "mm",
        icon: CloudRain,
      },
    ],
  },
];

const formatearMetrica = (metrica: { key: string; value: string | number }) => {
  if (
    metrica.key === "hr_mean" ||
    metrica.key === "hr_in_mean" ||
    metrica.key === "dv_mean" ||
    metrica.key === "pm10_mean"
  ) {
    return metrica.value !== null && metrica.value !== undefined
      ? Number(metrica.value).toFixed(0)
      : "s/d";
  }
  if (
    metrica.key === "no_mean" ||
    metrica.key === "no2_mean" ||
    metrica.key === "nox_mean" ||
    metrica.key === "temp_mean"
  ) {
    return metrica.value !== null && metrica.value !== undefined
      ? Number(metrica.value).toFixed(1)
      : "s/d";
  }
  if (metrica.key === "co_mean") {
    return metrica.value !== null && metrica.value !== undefined
      ? Number(metrica.value).toFixed(3)
      : "s/d";
  }
  if (metrica.key === "lluvia_mean") {
    return metrica.value !== null && metrica.value !== undefined
      ? metrica.value
      : "s/d";
  }
  return metrica.value;
};

const metricValidator = (metrica: string | number) => {
  if (metrica === null || metrica === undefined || metrica === "s/d") {
    return false;
  }
  return true;
};

const getStatusColor = (metrica: string | number, key: string) => {
  if (!metricValidator(metrica)) return "text-muted-foreground";

  // Lógica de colores basada en valores críticos
  const value = Number(metrica);

  if (key === "co_mean") {
    if (value > 9) return "text-destructive";
    if (value > 4.5) return "text-orange-500";
    return "text-green-600";
  }

  if (key === "no2_mean") {
    if (value > 200) return "text-destructive";
    if (value > 100) return "text-orange-500";
    return "text-green-600";
  }

  if (key === "pm10_mean") {
    if (value > 150) return "text-destructive";
    if (value > 75) return "text-orange-500";
    return "text-green-600";
  }

  return "text-primary";
};

export default function StationView({ data }: { data: StationData }) {
  const cabina = Object.fromEntries(
    Object.entries(data).filter(
      ([key]) =>
        key === "time" ||
        key === "hr_in_mean" ||
        key === "temp_in_mean" ||
        key === "location"
    )
  );
  const metricas = Object.fromEntries(
    Object.entries(data).filter(
      ([key]) =>
        key !== "location" &&
        key !== "time" &&
        key !== "temp_in_mean" &&
        key !== "hr_in_mean"
    )
  );

  return (
    <div className="flex flex-col rounded-xl p-6 border-2 border-border/50 shadow-lg">
      {/* Métricas organizadas por categorías */}
      <div className="space-y-6">
        {metricasCategorizadas.map((categoria) => (
          <div key={categoria.categoria} className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "w-1 h-6 rounded-full bg-gradient-to-b",
                  categoria.color
                )}
              />
              <h2 className="text-xl font-semibold text-foreground">
                {categoria.categoria}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {categoria.metrics.map((metrica) => {
                const IconComponent = metrica.icon;
                const value = metricas[metrica.key];
                const formattedValue = formatearMetrica({
                  key: metrica.key,
                  value,
                });
                const isValid = metricValidator(value);
                const statusColor = getStatusColor(value, metrica.key);

                return (
                  <Card
                    key={metrica.key}
                    className={cn(
                      "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2 shadow-md hover:shadow-primary/10 cursor-pointer min-w-0",
                      categoria.bgColor,
                      categoria.borderColor
                    )}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex flex-col gap-2">
                        {categoria.categoria === "Contaminantes" ? (
                          // Diseño especial para contaminantes: recuadro con nombre y unidad
                          <div className="flex flex-col gap-2">
                            <div
                              className={cn(
                                "px-3 py-2 rounded-lg bg-gradient-to-r shadow-md",
                                categoria.color
                              )}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-primary-foreground font-bold text-base">
                                  {metrica.nombre}
                                </span>
                                <span className="text-primary-foreground/80 font-medium text-xs">
                                  {metrica.unidad}
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          // Diseño normal para meteorología: icono + nombre + unidad
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "p-2 rounded-lg bg-gradient-to-r shadow-md flex-shrink-0",
                                categoria.color
                              )}
                            >
                              <IconComponent className="w-4 h-4 text-secondary-foreground" />
                            </div>
                            <div className="flex items-center justify-between min-w-0 flex-1">
                              <CardTitle className="text-sm font-semibold text-foreground truncate">
                                {metrica.nombre}
                              </CardTitle>
                              <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                                {metrica.unidad}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-3">
                      <div
                        className={cn(
                          "text-2xl font-bold transition-colors text-center",
                          isValid ? statusColor : "text-muted-foreground"
                        )}
                      >
                        {formattedValue}
                      </div>
                      {!isValid && (
                        <div className="text-xs text-muted-foreground mt-2 text-center">
                          Sin datos
                        </div>
                      )}
                    </CardContent>

                    {/* Footer con nombre completo para contaminantes */}
                    {categoria.categoria === "Contaminantes" && (
                      <div className="px-4 pb-3">
                        <div className="text-xs text-muted-foreground text-center leading-tight">
                          {metrica.nombreCompleto}
                        </div>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer compacto con información temporal unificada */}
      <div className="flex justify-end items-center pt-4 mt-6 border-t-2 border-border/50 text-sm text-muted-foreground">
        {/* Condiciones de cabina */}
        <div className="flex items-center gap-4 mr-auto">
          <div className="flex flex-col items-center gap-1 px-3 py-2 bg-accent/20 border border-accent/40 rounded-lg">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-primary" />
              <span className="text-primary font-semibold text-sm">
                {cabina.temp_in_mean ?? "N/A"} °C
              </span>
            </div>
            <span className="text-xs font-medium">Temperatura Cabina</span>
          </div>
          <div className="flex flex-col items-center gap-1 px-3 py-2 bg-accent/20 border border-accent/40 rounded-lg">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary " />
              <span className="text-primary font-semibold text-sm">
                {cabina.hr_in_mean ?? "N/A"} %
              </span>
            </div>
            <span className="text-xs font-medium">Humedad Cabina</span>
          </div>
        </div>
        {/* Fecha y hora */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {cabina.time
              ? new Date(cabina.time).toLocaleDateString("es-AR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Fecha no disponible"}
          </span>
          <span className="font-medium flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Última actualización:{" "}
            {cabina.time
              ? new Intl.DateTimeFormat("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).format(new Date(cabina.time))
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
