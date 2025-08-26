import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FullLocationData } from "@/lib/location/models";
import { cn } from "@/lib/utils";
import { Thermometer, Droplets, Clock, Calendar } from "lucide-react";
import { contaminantes, meteorologica } from "./items";
import CardCabina from "./ui/card-cabina";

export default function DataGrid({ data }: { data: FullLocationData }) {
  return (
    <div className="flex flex-col">
      <header className="flex flex-col w-full gap-5 lg:gap-28 md:flex-row pb-6 items-center my-6 border-b border-primary/30 text-sm text-muted-foreground">
        {/* Condiciones de cabina */}
        <div className="flex gap-4">
          <CardCabina
            label="Temperatura Cabina"
            icon={<Thermometer className="w-4 h-4 text-primary" />}
            value={
              data.temp_in_mean !== null ? data.temp_in_mean + " °C" : "s/d"
            }
          />
          <CardCabina
            label="Humedad Cabina"
            icon={<Droplets className="w-4 h-4 text-primary " />}
            value={data.hr_in_mean !== null ? data.hr_in_mean + " %" : "s/d"}
          />
        </div>
        {/* Fecha y hora actualizacion*/}
        <div className="flex flex-col gap-2">
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
      </header>

      {/* Contaminantes Title */}
      <div className="my-6 space-y-4" aria-label="Contaminantes">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-primary" />
          <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">
            Contaminantes
          </h2>
        </div>
        {/* Metricas Contaminantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {contaminantes.map((contaminante) => {
            const value = data[contaminante.key];
            return (
              <Card
                key={contaminante.key}
                className="relative p-5 overflow-hidden border border-border/40 bg-gradient-to-br from-primary to-primary/80 backdrop-blur-sm transition-all duration-300 hover:shadow-md shadow-sm shadow-black/30 cursor-pointer"
              >
                <CardHeader className="p-0">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-primary-foreground/80 font-bold text-base">
                        {contaminante.nombre}
                      </span>
                      <span className="text-primary-foreground/80 font-medium text-xs">
                        ({contaminante.unidad})
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="py-3 px-0">
                  <div
                    className={cn(
                      "text-3xl font-bold transition-all",
                      value == null
                        ? "text-primary-foreground/60"
                        : "text-green-300"
                    )}
                  >
                    {value ?? "s/d"}
                  </div>
                </CardContent>

                <div className="text-xs text-primary-foreground/70 leading-tight">
                  {contaminante.nombreCompleto}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Meteorologica Title */}
      <div className="my-6 space-y-4" aria-label="Meteorologica">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 rounded-full bg-primary" />
          <h2 className="text-xl font-semibold text-foreground uppercase tracking-wider">
            Meteorológica
          </h2>
        </div>
        {/* Metricas Meteorológicas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {meteorologica.map((meteo) => {
            const IconComponent = meteo.icon;
            const value = data[meteo.key];
            return (
              <Card
                key={meteo.key}
                className="relative py-3 px-5 overflow-hidden border border-primary/60 bg-gradient-to-br from-secondary/20 to-secondary/50 backdrop-blur-sm transition-all duration-300 hover:shadow-md shadow-sm shadow-black/30 cursor-pointer"
              >
                <CardTitle className="text-sm font-semibold text-primary">
                  {meteo.nombre}
                </CardTitle>
                <CardContent className="p-0 my-1 flex justify-between items-center text-primary/80">
                  <IconComponent className="w-5 h-5" />
                  <div
                    className={cn(
                      "text-xl font-bold transition-colors",
                      value == null ? "text-primary/70" : "text-primary"
                    )}
                  >
                    {value ?? "s/d"}{" "}
                    <span className="text-xs">{meteo.unidad}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
