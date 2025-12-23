import {
  Thermometer,
  Droplets,
  Wind,
  CloudRain,
  WindArrowDownIcon,
  Compass,
  Sun,
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
  RS_MEAN = "rs_mean",
  UV_MEAN = "uv_mean",
}

type Contaminante = {
  key: MetricKey;
  nombre: string;
  nombreCompleto?: string;
  unidad: string;
};

type Meteorologica = {
  key: MetricKey;
  nombre: string;
  nombreCompleto?: string;
  unidad: string;
  icon: LucideIcon;
};

export const contaminantes: Contaminante[] = [
  {
    key: MetricKey.CO_MEAN,
    nombre: "CO",
    nombreCompleto: "Monóxido de Carbono",
    unidad: "ppm",
  },
  {
    key: MetricKey.NO_MEAN,
    nombre: "NO",
    nombreCompleto: "Óxido de Nitrógeno",
    unidad: "ppb",
  },
  {
    key: MetricKey.NO2_MEAN,
    nombre: "NO₂",
    nombreCompleto: "Dióxido de Nitrógeno",
    unidad: "ppb",
  },
  {
    key: MetricKey.NOX_MEAN,
    nombre: "NOₓ",
    nombreCompleto: "Óxidos Totales",
    unidad: "ppb",
  },
  {
    key: MetricKey.PM10_MEAN,
    nombre: "PM₁₀",
    nombreCompleto: "Material Particulado",
    unidad: "μg/m³",
  },
  {
    key: MetricKey.O3_MEAN,
    nombre: "O3",
    nombreCompleto: "Ozóno",
    unidad: "ppb",
  },
  {
    key: MetricKey.SO2_MEAN,
    nombre: "SO₂",
    nombreCompleto: "Dióxido de Azufre",
    unidad: "ppb",
  },
];

export const meteorologica: Meteorologica[] = [
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
  {
    key: MetricKey.RS_MEAN,
    nombre: "Radiación Solar",
    nombreCompleto: "Radiación Solar",
    unidad: "W/m²",
    icon: Sun,
  },
  {
    key: MetricKey.UV_MEAN,
    nombre: "UV",
    nombreCompleto: "Ultravioleta",
    unidad: "UV",
    icon: Sun,
  },
];
