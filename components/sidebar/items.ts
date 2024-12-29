import { WrenchIcon, Package2Icon, HomeIcon, Calendar } from "lucide-react";

export const inicio = [
  {
    title: "Inicio",
    url: "/inicio",
    icon: HomeIcon,
  },
  {
    title: "Calendario",
    url: "/inicio/calendario",
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
      url: "/inicio/mantenimiento/ordenes",
    },
    {
      title: "Calibraciones",
      url: "/inicio/mantenimiento/calibraciones",
    },
    {
      title: "Programado",
      url: "/inicio/mantenimiento/programado",
    },
  ],
};

export const inventario = {
  title: "Inventario",
  icon: Package2Icon,
  items: [
    {
      title: "Estaciones",
      url: "/inicio/inventario/estaciones",
    },
    {
      title: "Equipos",
      url: "/inicio/inventario/equipos",
    },
    {
      title: "Repuestos",
      url: "/inicio/inventario/repuestos",
    },
    {
      title: "Gases",
      url: "/inicio/inventario/gases",
    },
  ],
};
