"use client"

import React, { useRef, useCallback, useEffect } from "react";
import { Line } from "react-chartjs-2";
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

export default function Grafico({ data }: GraficoProps): React.ReactNode {
  const resizeTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Detectar el tipo de contaminante a partir de los datos
  const detectContaminante = () => {
    if (data.length === 0) return 'co';
    
    // Buscar la primera propiedad que comience con un contaminante conocido
    const firstItem = data[0];
    const keys = Object.keys(firstItem);
    
    for (const contaminante of ['co', 'o3', 'nox']) {
      if (keys.some(key => key.startsWith(contaminante + '_'))) {
        return contaminante;
      }
    }
    
    return 'co'; // Valor por defecto
  };
  
  const contaminante = detectContaminante();
  const contaminanteLabel = contaminante.toUpperCase();
  
  // Process chart data with simplified structure
  const chartData = {
    labels: data.map((item) => `${item.date} ${item.time}`),
    datasets: [
      {
        label: `${contaminanteLabel} Centenario`,
        data: data.map((item) => Number(item[`${contaminante}_centenario`]) || 0),
        borderColor: "#22c55e",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: `${contaminanteLabel} Catalinas`,
        data: data.map((item) => Number(item[`${contaminante}_catalinas`]) || 0),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: `${contaminanteLabel} Córdoba`,
        data: data.map((item) => Number(item[`${contaminante}_cordoba`]) || 0),
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5,
      },
      {
        label: `${contaminanteLabel} CIFA`,
        data: data.map((item) => Number(item[`${contaminante}_cifa`]) || 0),
        borderColor: "#a855f7",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
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
        text: `Concentración de ${contaminanteLabel} (ppm)`,
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

              // Extraer la ubicación del nombre de la estación
              let location = "";
              if (station?.includes("Centenario")) location = "centenario";
              else if (station?.includes("Catalinas")) location = "catalinas";
              else if (station?.includes("Córdoba")) location = "cordoba";
              else if (station?.includes("CIFA")) location = "cifa";
              
              if (location) {
                status = item[`status_${location}`] as string;
                minutes = item[`minuteCount_${location}`]?.toString() || "0";
              }

              return [`Estado: ${status}`, `Minutos: ${minutes}`];
            }
            return "";
          }
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
          text: `${contaminanteLabel} (ppm)`,
        },
        beginAtZero: true,
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false
    }
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
