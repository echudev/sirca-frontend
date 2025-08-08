import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  Zap,
  Cloud,
  WindArrowDownIcon,
  Compass,
  type LucideIcon,
} from "lucide-react";

// Tipos de apoyo para tipar las métricas y evitar indexación por string
export enum MetricKey {
  CO_MEAN = "co_mean",
  NO_MEAN = "no_mean",
  NO2_MEAN = "no2_mean",
  NOX_MEAN = "nox_mean",
  PM10_MEAN = "pm10_mean",
  O3_MEAN = "o3_mean",
  SO2_MEAN = "so2_mean",
  TEMP_MEAN = "temp_mean",
  HR_MEAN = "hr_mean",
  DV_MEAN = "dv_mean",
  VV_MEAN = "vv_mean",
  LLUVIA_MEAN = "lluvia_mean",
  PA_MEAN = "pa_mean",
}

export type CategoryDef = {
  categoria: string;
  color: string;
  bgColor: string;
  borderColor: string;
  metrics: Array<{
    key: MetricKey;
    nombre: string;
    nombreCompleto?: string;
    unidad: string;
    icon: LucideIcon;
  }>;
};

// Categorías de métricas con iconos y colores
export const metricasCategorizadas: CategoryDef[] = [
  {
    categoria: "Contaminantes",
    color: "from-primary to-primary/80",
    bgColor: "bg-gradient-to-br from-primary/5 to-primary/10",
    borderColor: "border-primary/20",
    metrics: [
      {
        key: MetricKey.CO_MEAN,
        nombre: "CO",
        nombreCompleto: "Monóxido de Carbono",
        unidad: "ppm",
        icon: Cloud,
      },
      {
        key: MetricKey.NO_MEAN,
        nombre: "NO",
        nombreCompleto: "Óxido de Nitrógeno",
        unidad: "ppb",
        icon: Zap,
      },
      {
        key: MetricKey.NO2_MEAN,
        nombre: "NO₂",
        nombreCompleto: "Dióxido de Nitrógeno",
        unidad: "ppb",
        icon: Zap,
      },
      {
        key: MetricKey.NOX_MEAN,
        nombre: "NOₓ",
        nombreCompleto: "Óxidos Totales",
        unidad: "ppb",
        icon: Zap,
      },
      {
        key: MetricKey.PM10_MEAN,
        nombre: "PM₁₀",
        nombreCompleto: "Material Particulado < 10 μm",
        unidad: "μg/m³",
        icon: CloudRain,
      },
      {
        key: MetricKey.O3_MEAN,
        nombre: "O3",
        nombreCompleto: "Ozóno",
        unidad: "ppb",
        icon: CloudRain,
      },
      {
        key: MetricKey.SO2_MEAN,
        nombre: "SO₂",
        nombreCompleto: "Dióxido de Azufre",
        unidad: "ppb",
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
        key: MetricKey.TEMP_MEAN,
        nombre: "Temperatura",
        nombreCompleto: "Temperatura",
        unidad: "°C",
        icon: Thermometer,
      },
      {
        key: MetricKey.HR_MEAN,
        nombre: "Humedad",
        nombreCompleto: "Humedad Relativa",
        unidad: "%",
        icon: Droplets,
      },
      {
        key: MetricKey.DV_MEAN,
        nombre: "Dirección Viento",
        nombreCompleto: "Dirección del Viento",
        unidad: "°",
        icon: Compass,
      },
      {
        key: MetricKey.VV_MEAN,
        nombre: "Velocidad Viento",
        nombreCompleto: "Velocidad del Viento",
        unidad: "m/s",
        icon: Wind,
      },
      {
        key: MetricKey.LLUVIA_MEAN,
        nombre: "Lluvia",
        nombreCompleto: "Precipitaciones",
        unidad: "mm",
        icon: CloudRain,
      },
      {
        key: MetricKey.PA_MEAN,
        nombre: "Presión Atm",
        nombreCompleto: "Presión Atmosférica",
        unidad: "hPa",
        icon: WindArrowDownIcon,
      },
    ],
  },
];
