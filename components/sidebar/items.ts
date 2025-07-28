import {
  Wind,
  ChartLine,
  MapPin,
  ChartNoAxesColumn,
  LayoutDashboardIcon,
} from "lucide-react";

export const inicio = [
  {
    title: "Panel General",
    url: "/panel-general",
    icon: LayoutDashboardIcon,
  },
];

export const tiempoReal = [
  {
    title: "AQI",
    url: "/aqi",
    icon: Wind,
  },
  {
    title: "Estaciones",
    url: "/estaciones",
    icon: MapPin,
  },
];

export const datosCrudos = {
  title: "Datos Crudos",
  icon: ChartNoAxesColumn,
  url: "/datos/minutales",
  items: [
    {
      title: "Minutales",
      url: "/datos/minutales",
    },
    {
      title: "Horarios",
      url: "/datos/horarios",
    },
  ],
};

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
