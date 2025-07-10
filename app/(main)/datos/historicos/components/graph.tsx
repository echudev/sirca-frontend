import { Line } from "react-chartjs-2";
import { useRef, useCallback, useEffect } from "react";
import { CoHorarioData } from "@/lib/datos/models";
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

interface GraficoProps {
  data: CoHorarioData[];
}

export default function Grafico({ data }: GraficoProps) {
  const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

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
          title: function (context: { label: string }[]) {
            return `Fecha: ${context[0].label}`;
          },
          label: function (context: {
            dataset: { label?: string };
            parsed: { y: number };
          }) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return `${label}: ${value.toFixed(2)} ppm`;
          },
          afterLabel: function (context: {
            dataset: { label?: string };
            dataIndex: number;
          }) {
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

  const chartRef = useRef<ChartJS<"line", number[], string> | null>(null);

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

  return data.length > 0 ? (
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
  ) : null;
}
