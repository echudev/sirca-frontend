import { Wind, ChartLine, MapPin, ChartNoAxesColumn } from "lucide-react";

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
      title: "Catalinas",
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
    title: "Por Contaminante",
    url: "/datos/contaminante",
    icon: ChartNoAxesColumn,
  },
];

export const reportes = [
  {
    title: "Reportes",
    url: "/reportes",
    icon: ChartLine,
  },
];

// Mantainance , WrenchIconMenu items.
// export const mantenimiento = {
//   title: "Mantenimiento",
//   icon: WrenchIcon,
//   items: [
//     {
//       title: "Órdenes",
//       url: "/mantenimiento/ordenes",
//     },
//     {
//       title: "Calibraciones",
//       url: "/mantenimiento/calibraciones",
//     },
//     {
//       title: "Programado",
//       url: "/mantenimiento/programado",
//     },
//   ],
// };

// export const inventario = {
//   title: "Inventario",
//   icon: Package2Icon,
//   items: [
//     {
//       title: "Estaciones",
//       url: "/inventario/estaciones",
//     },
//     {
//       title: "Equipos",
//       url: "/inventario/equipos",
//     },
//     {
//       title: "Partes",
//       url: "/inventario/partes",
//     },
//     {
//       title: "Gases",
//       url: "/inventario/gases",
//     },
//   ],
// };
