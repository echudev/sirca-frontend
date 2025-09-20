"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Label,
} from "recharts";

interface ChartProps {
  data: Record<string, string | number>[];
}

// data example para CO:
/*
[
  {
    "time": "2025-09-19T23:55:00Z",
    "centenario": "0.000",
    "cordoba": "0.000",
    "catalinas": "0.000",
    "cifa": "0.000",
  },
  {
    "time": "2025-09-20T00:00:00Z",
    "centenario": "0.000",
    "cordoba": "0.000",
    "catalinas": "0.000",
    "cifa": "0.000",
  }
]
*/

export default function Chart({ data }: ChartProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-gray-500">No hay datos para mostrar</span>
      </div>
    );
  }

  // Obtengo los datos ordenados por ubicación (columnas) dinámicamente excluyendo 'time'
  const locations = Object.keys(data[0] || {}).filter((key) => key !== "time");
  // Verifico si el contaminante seleccionado por el usuario es NOx totales
  // para mostrar grafico de area acumulativo no + no2 y nox
  const isNox = locations.some((location) => location.includes("NOx"));

  // Colores predefinidos para cada estación
  const stationColor: Record<string, string> = {
    centenario: "var(--color-centenario)",
    "centenario NO": "var(--color-centenario-no)",
    "centenario NO2": "var(--color-centenario-no2)",
    "centenario NOx": "var(--color-centenario-nox)",
    cordoba: "var(--color-cordoba)",
    "cordoba NO": "var(--color-cordoba-no)",
    "cordoba NO2": "var(--color-cordoba-no2)",
    "cordoba NOx": "var(--color-cordoba-nox)",
    catalinas: "var(--color-catalinas)",
    "catalinas NO": "var(--color-catalinas-no)",
    "catalinas NO2": "var(--color-catalinas-no2)",
    "catalinas NOx": "var(--color-catalinas-nox)",
    cifa: "var(--color-cifa)",
    "cifa NO": "var(--color-cifa-no)",
    "cifa NO2": "var(--color-cifa-no2)",
    "cifa NOx": "var(--color-cifa-nox)",
    otra: "var(--color-otra)",
  };

  // Mapeo los datos para el gráfico
  const chartData = data.map((row) => {
    const mappedRow: Record<string, string | number> = {
      timestamp: new Intl.DateTimeFormat("es-AR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "America/Argentina/Buenos_Aires",
      }).format(new Date(row.time)),
    };

    locations.forEach((location) => {
      mappedRow[location] =
        row[location] !== null && row[location] !== undefined
          ? Number(row[location]).toFixed(3)
          : "0.000";
    });

    return mappedRow;
  });

  return (
    <div className="flex flex-col gap-28 my-20">
      <ResponsiveContainer
        width="100%"
        height={400}
        style={{ display: isNox ? "" : "none" }}
      >
        <AreaChart
          data={chartData}
          margin={{ top: 50, right: 30, left: 0, bottom: 5 }}
        >
          <Label
            value="NO2 y NO apilados + NOx totales"
            position="top"
            offset={30}
            style={{
              fill: "var(--color-primary)",
              fontSize: 20,
              fontWeight: 600,
            }}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={{ fontSize: 12 }}></XAxis>
          <YAxis />
          <Tooltip />
          <Legend />
          {locations.map((location) =>
            location.includes("NOx") ? (
              <Line
                key={location}
                type="monotone"
                dataKey={location}
                stroke={stationColor[location] ?? "var(--color-otra)"}
                dot={false}
                strokeWidth={3}
                strokeDasharray="4 7"
              />
            ) : (
              <Area
                key={location}
                type="monotone"
                dataKey={location}
                stackId="1"
                stroke={stationColor[location] ?? "var(--color-otra)"}
                fill={stationColor[location] ?? "var(--color-otra)"}
              />
            )
          )}
        </AreaChart>
      </ResponsiveContainer>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={chartData}
          margin={{ top: 50, right: 30, left: 0, bottom: 5 }}
        >
          <Label
            value="Concentraciones por contaminante - variables individuales"
            position="top"
            offset={30}
            style={{
              fill: "var(--color-primary)",
              fontSize: 20,
              fontWeight: 600,
            }}
          />
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" tick={{ fontSize: 12 }}></XAxis>
          <YAxis />
          <Tooltip />
          <Legend />
          {locations.map((location) => (
            <Line
              key={location}
              type="linear"
              dataKey={location}
              stroke={stationColor[location] ?? "var(--color-otra)"}
              name={
                location == "catalinas"
                  ? "La Boca"
                  : location.charAt(0).toUpperCase() + location.slice(1)
              }
              dot={false}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
