import {
  WrenchIcon,
  Package2Icon,
  HomeIcon,
  Calendar,
  BarChart2Icon,
} from "lucide-react";

export const inicio = [
  {
    title: "Inicio",
    url: "/inicio",
    icon: HomeIcon,
  },
  {
    title: "Calendario",
    url: "/calendario",
    icon: Calendar,
  },
];

// Mantainance , WrenchIconMenu items.
export const mantenimiento = {
  title: "Mantenimiento",
  icon: WrenchIcon,
  items: [
    {
      title: "Órdenes",
      url: "/mantenimiento/ordenes",
    },
    {
      title: "Calibraciones",
      url: "/mantenimiento/calibraciones",
    },
    {
      title: "Programado",
      url: "/mantenimiento/programado",
    },
  ],
};

export const inventario = {
  title: "Inventario",
  icon: Package2Icon,
  items: [
    {
      title: "Estaciones",
      url: "/inventario/estaciones",
    },
    {
      title: "Equipos",
      url: "/inventario/equipos",
    },
    {
      title: "Partes",
      url: "/inventario/partes",
    },
    {
      title: "Gases",
      url: "/inventario/gases",
    },
  ],
};

export const datos = {
  title: "Datos",
  icon: BarChart2Icon,
  defaultUrl: "/datos/historicos",
  items: [
    {
      title: "Históricos",
      url: "/datos/historicos",
    },
    {
      title: "Tiempo Real",
      url: "/datos/tiempo-real",
    },
    {
      title: "AQI",
      url: "/datos/aqi",
    },
  ],
};
