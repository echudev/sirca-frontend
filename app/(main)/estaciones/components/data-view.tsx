import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FullLocationData } from "@/lib/location/models";
import { cn } from "@/lib/utils";
import { Thermometer, Droplets, Clock, Calendar } from "lucide-react";
import { metricasCategorizadas } from "./data-items";

export default function StationView({ data }: { data: FullLocationData }) {
  return (
    <div className="flex flex-col">
      <header className=" flex justify-center">
        <div className="flex flex-col sm:gap-5 md:gap-2 lg:gap-28 md:flex-row items-center p-4 my-6 border-b-2 border-border/50 text-sm text-muted-foreground">
          {/* Condiciones de cabina */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-accent/20 border border-accent/40 rounded-lg">
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-primary" />
                <span className="text-primary font-semibold text-sm">
                  {data.temp_in_mean !== null ? data.temp_in_mean : "s/d"} °C
                </span>
              </div>
              <span className="text-xs font-medium">Temperatura Cabina</span>
            </div>
            <div className="flex flex-col items-center gap-1 px-3 py-2 bg-accent/20 border border-accent/40 rounded-lg">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-primary " />
                <span className="text-primary font-semibold text-sm">
                  {data.hr_in_mean !== null ? data.hr_in_mean : "s/d"} %
                </span>
              </div>
              <span className="text-xs font-medium">Humedad Cabina</span>
            </div>
          </div>
          {/* Fecha y hora actualizacion*/}
          <div className="flex flex-col items-center gap-2">
            <span className="font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {data.latest_time
                ? new Date(data.latest_time).toLocaleDateString("es-AR", {
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
              {data.latest_time
                ? new Intl.DateTimeFormat("es-AR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  }).format(new Date(data.latest_time))
                : "N/A"}
            </span>
          </div>
        </div>
      </header>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {categoria.metrics.map((metrica) => {
                const IconComponent = metrica.icon;
                const value = data[metrica.key];
                return (
                  <Card
                    key={metrica.key}
                    className={cn(
                      "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-2 shadow-md hover:shadow-primary/10 cursor-pointer",
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
                          value == null ? "text-red-500" : "text-green-700"
                        )}
                      >
                        {value ?? "s/d"}
                      </div>
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
    </div>
  );
}
