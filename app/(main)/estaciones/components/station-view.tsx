import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const metricasUI = [
  { key: "co_mean", nombre: "CO (ppm)" },
  { key: "no_mean", nombre: "NO (ppb)" },
  { key: "no2_mean", nombre: "NO2 (ppb)" },
  { key: "nox_mean", nombre: "NOX (ppb)" },
  { key: "pm10_mean", nombre: "PM10 (ug/m3)" },
  { key: "dv_mean", nombre: "DV (°)" },
  { key: "vv_mean", nombre: "VV (m/s)" },
  { key: "temp_mean", nombre: "Temp (°C)" },
  { key: "hr_mean", nombre: "HR (%)" },
  { key: "lluvia_mean", nombre: "LLUVIA (mm)" },
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

export default function StationView({ data }: { data: StationData }) {
  // metricas de la cabina (temperatura interna, humedad interna, hora)
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
    <div className="flex flex-col gap-4 max-w-[1000px] p-2 ">
      <header className="flex flex-col gap-2">
        <h3 className="font-bold text-xl text-center text-primary">
          Estación{" "}
          {cabina.location.charAt(0).toUpperCase() +
            cabina.location.slice(1).toLowerCase()}
        </h3>
        <div className="flex flex-wrap gap-4 justify-center">
          <p>Temperatura Cabina: {cabina.temp_in_mean ?? ""} °C</p>
          <p>Humedad Cabina: {cabina.hr_in_mean ?? ""} %</p>
        </div>
      </header>
      <main className="flex flex-wrap gap-4 justify-center">
        {metricasUI.map((metrica) => (
          <Card key={metrica.key} className="w-[160px] text-center">
            <CardHeader>
              <CardTitle className="text-primary">{metrica.nombre}</CardTitle>
            </CardHeader>
            <CardContent
              className={cn(
                "font-bold",
                metricas[metrica.key] !== undefined
                  ? "text-green-600"
                  : "text-red-600"
              )}
            >
              {formatearMetrica({
                key: metrica.key,
                value: metricas[metrica.key],
              })}
            </CardContent>
          </Card>
        ))}
      </main>
      <footer className="flex flex-wrap gap-4 justify-between items-center">
        <p>
          Fecha: {cabina.time ? new Date(cabina.time).toLocaleDateString() : ""}
        </p>
        <p>
          Ultima Actualización:{" "}
          {cabina.time
            ? new Intl.DateTimeFormat("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }).format(new Date(cabina.time))
            : ""}
        </p>
      </footer>
    </div>
  );
}
