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

type CrudosChartRow = {
  timestamp: string;
  centenario: string;
  cordoba: string;
  catalinas: string;
};

interface ChartProps {
  data: {
    time: string;
    centenario: number;
    cordoba: number;
    catalinas: number;
  }[];
}

export default function Chart({ data }: ChartProps) {
  // Mapear los datos para que tengan las claves esperadas por el gráfico
  const chartData: CrudosChartRow[] = Array.isArray(data)
    ? data.map((row) => ({
        timestamp: new Intl.DateTimeFormat("es-AR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Argentina/Buenos_Aires",
        }).format(new Date(row.time)),
        centenario: Number(row.centenario).toFixed(3),
        cordoba: Number(row.cordoba).toFixed(3),
        catalinas: Number(row.catalinas).toFixed(3),
      }))
    : [];

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
        <Line
          type="monotone"
          dataKey="centenario"
          stroke="#8884d8"
          name="Centenario"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="cordoba"
          stroke="#82ca9d"
          name="Cordoba"
          dot={false}
        />
        <Line
          type="monotone"
          dataKey="catalinas"
          stroke="#ff7300"
          name="Catalinas"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
