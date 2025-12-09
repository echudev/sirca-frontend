import {
  Wind,
  ChartLine,
  MapPin,
  ChartNoAxesColumn,
  Download,
} from "lucide-react";

export const aqi = [
  {
    title: "AQI",
    url: "/aqi",
    icon: Wind,
  },
];

export const estaciones = {
  title: "Estaciones",
  icon: MapPin,
  url: "/estaciones",
  items: [
    {
      title: "Centenario",
      url: "/estaciones/centenario",
    },
    {
      title: "La Boca",
      url: "/estaciones/catalinas",
    },
    {
      title: "Córdoba",
      url: "/estaciones/cordoba",
    },
    {
      title: "CIFA",
      url: "/estaciones/cifa",
    },
  ],
};

export const datos = [
  {
    title: "Explorar Datos",
    url: "/datos/contaminante",
    icon: ChartLine,
  },
];

export const reportes = [
  {
    title: "Reportes",
    url: "/reportes",
    icon: ChartNoAxesColumn,
  },
];

export const descargas = [
  {
    title: "Descargas",
    url: "/descargas",
    icon: Download,
  },
];
