import { WrenchIcon, Package2Icon } from "lucide-react";

// Mantainance , WrenchIconMenu items.
export const mantenimiento = {
  title: "Mantenimiento",
  icon: WrenchIcon,
  items: [
    {
      title: "Órdenes",
      url: "/dashboard/mantenimiento/ordenes",
    },
    {
      title: "Calibraciones",
      url: "/dashboard/mantenimiento/calibraciones",
    },
    {
      title: "Programado",
      url: "/dashboard/mantenimiento/programado",
    },
  ],
};

export const inventario = {
  title: "Inventario",
  icon: Package2Icon,
  items: [
    {
      title: "Estaciones",
      url: "/dashboard/inventario/estaciones",
    },
    {
      title: "Equipos",
      url: "/dashboard/inventario/equipos",
    },
    {
      title: "Partes",
      url: "/dashboard/inventario/partes",
    },
    {
      title: "Gases",
      url: "/dashboard/inventario/gases",
    },
  ],
};
