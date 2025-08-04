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
} from "recharts";

interface ChartProps {
  data: Record<string, string | number>[];
}

export default function Chart({ data }: ChartProps) {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <span className="text-gray-500">No hay datos para mostrar</span>
      </div>
    );
  }

  // Obtener las ubicaciones (columnas) dinámicamente excluyendo 'time'
  const locations = Object.keys(data[0] || {}).filter((key) => key !== "time");

  // Colores predefinidos para las líneas
  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ff7300",
    "#ffc658",
    "#8dd1e1",
    "#d084d0",
    "#ffb347",
    "#87ceeb",
  ];

  // Mapear los datos para el gráfico
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
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={chartData}
        margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Legend />
        {locations.map((location, index) => (
          <Line
            key={location}
            type="linear"
            dataKey={location}
            stroke={colors[index % colors.length]}
            name={location.charAt(0).toUpperCase() + location.slice(1)}
            dot={false}
            strokeWidth={2}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
