"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { CoDiarioData } from "@/lib/datos/service";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const promedioOptions = [
  { label: "Promedios minutales", value: "minutal" },
  { label: "Promedios horarios", value: "horario" },
];
const rangoOptions = [
  { label: "1 día", value: "1" },
  { label: "7 días", value: "7" },
  { label: "30 días", value: "30" },
  { label: "90 días", value: "90" },
];

const columns: ColumnDef<CoDiarioData>[] = [
  {
    accessorKey: "date",
    header: "Fecha",
    cell: ({ row }) => <div>{row.getValue("date")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "time",
    header: "Hora",
    cell: ({ row }) => <div>{row.getValue("time")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "co_centenario",
    header: "CO Centenario",
    cell: ({ row }) => <div>{row.getValue("co_centenario")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "minuteCount_centenario",
    header: "Minutos",
    cell: ({ row }) => <div>{row.getValue("minuteCount_centenario")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "status_centenario",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status_centenario") as string;
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === "ok"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "co_catalinas",
    header: "CO Catalinas",
    cell: ({ row }) => <div>{row.getValue("co_catalinas")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "minuteCount_catalinas",
    header: "Minutos",
    cell: ({ row }) => <div>{row.getValue("minuteCount_catalinas")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "status_catalinas",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status_catalinas") as string;
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === "ok"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "co_cordoba",
    header: "CO Córdoba",
    cell: ({ row }) => <div>{row.getValue("co_cordoba")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "minuteCount_cordoba",
    header: "Minutos",
    cell: ({ row }) => <div>{row.getValue("minuteCount_cordoba")}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "status_cordoba",
    header: "Estado",
    cell: ({ row }) => {
      const status = row.getValue("status_cordoba") as string;
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            status === "ok"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
      );
    },
    enableSorting: false,
  },
];

export default function DatosPage() {
  const [promedio, setPromedio] = useState("minutal");
  const [rango, setRango] = useState("1");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<CoDiarioData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const chartRef = useRef<ChartJS<"line", number[], string> | null>(null);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/datos");
      if (!response.ok) {
        throw new Error("Error al obtener los datos");
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      setError(
        ("Error al cargar los datos. Por favor, intente nuevamente más tarde: " +
          error) as string
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función debounced para redimensionar el gráfico
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }

    resizeTimeoutRef.current = setTimeout(() => {
      if (chartRef.current) {
        chartRef.current.resize();
        chartRef.current.update();
      }
    }, 100);
  }, []);

  // Efecto para redimensionar el gráfico cuando cambia el tamaño de la ventana
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, [handleResize]);

  // Process chart data with simplified structure
  const chartData = {
    labels: data.map((item) => `${item.date} ${item.time}`),
    datasets: [
      {
        label: "CO Centenario",
        data: data.map((item) => Number(item.co_centenario) || 0),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: "CO Catalinas",
        data: data.map((item) => Number(item.co_catalinas) || 0),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: "CO Córdoba",
        data: data.map((item) => Number(item.co_cordoba) || 0),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1000,
      easing: "easeInOutQuad" as const,
    },
    layout: {
      padding: {
        top: 10,
        right: 20,
        bottom: 20,
        left: 10,
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      title: {
        display: true,
        text: "Concentración de CO (ppm)",
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        callbacks: {
          title: function (context: any) {
            return `Fecha: ${context[0].label}`;
          },
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(2)} ppm`;
          },
          afterLabel: function (context: any) {
            const dataIndex = context.dataIndex;
            const item = data[dataIndex];
            if (item) {
              const station = context.dataset.label;
              let status = "";
              let minutes = "";

              if (station === "CO Centenario") {
                status = item.status_centenario;
                minutes = item.minuteCount_centenario.toString();
              } else if (station === "CO Catalinas") {
                status = item.status_catalinas;
                minutes = item.minuteCount_catalinas.toString();
              } else if (station === "CO Córdoba") {
                status = item.status_cordoba;
                minutes = item.minuteCount_cordoba.toString();
              }

              return [`Estado: ${status}`, `Minutos: ${minutes}`];
            }
            return "";
          },
        },
      },
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "Fecha y Hora",
        },
        ticks: {
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "CO (ppm)",
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    // No sorting or pagination, as data comes sorted from backend
  });

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">
          Datos de Calidad del Aire
        </h1>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Select value={promedio} onValueChange={setPromedio}>
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
          <Select value={rango} onValueChange={setRango}>
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
          <Button onClick={fetchData} disabled={loading} className="h-9">
            {loading ? "Cargando..." : "Traer datos"}
          </Button>
        </div>
      </div>

      {/* Gráfico */}
      {data.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="h-[500px] w-full relative">
            <Line
              ref={chartRef}
              options={chartOptions}
              data={chartData}
              className="w-full h-full"
            />
          </div>
        </div>
      )}

      {/* Tabla TanStack */}
      <div className="bg-white rounded-lg shadow p-6 mb-6 w-full">
        <h2 className="text-xl font-semibold mb-4">Datos Detallados</h2>
        <div className="overflow-auto max-h-[500px] border rounded-lg w-full">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center">
                    {loading ? "Cargando datos..." : "No hay datos disponibles"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
