"use client";

import { usePathname } from "next/navigation";
import { clsx } from "clsx";
import { NavItem } from "./ui/NavItem";
import {
  HomeIcon,
  HammerIcon,
  BoxIcon,
  CalendarIcon,
} from "@/components/Icons";

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <div className="flex w-64 pt-6 m-3 rounded bg-gradient-to-br from-blue-500 to-blue-600 shadow-md shadow-black/80">
      <nav className="flex flex-col tems-start px-1 text-sm font-medium h-full gap-1">
        <NavItem href="/dashboard">
          <HomeIcon />
          Inicio
        </NavItem>
        <NavItem href="/dashboard/mantenimiento">
          <HammerIcon />
          Mantenimiento
        </NavItem>
        <div
          aria-label="Mantenimiento-content"
          aria-expanded="false"
          aria-controls="Mantenimiento-content"
          className={clsx("h-0 overflow-hidden transition-all", {
            "h-28": pathname.startsWith("/dashboard/mantenimiento"),
          })}
        >
          <NavItem size={2} href="/dashboard/mantenimiento/ordenes">
            Órdenes
          </NavItem>
          <NavItem size={2} href="/dashboard/mantenimiento/calibraciones">
            Calibraciones
          </NavItem>
          <NavItem size={2} href="/dashboard/mantenimiento/programado">
            Programado
          </NavItem>
        </div>
        <NavItem href="/dashboard/inventario">
          <BoxIcon />
          Inventario
        </NavItem>
        <div
          aria-label="Inventario-content"
          aria-controls="Inventario-content"
          className={clsx(
            "h-0 overflow-hidden transition-all animate-in slide-in-from-top",
            {
              "h-36": pathname.startsWith("/dashboard/inventario"),
            }
          )}
        >
          <NavItem size={2} href="/dashboard/inventario/estaciones">
            Estaciones
          </NavItem>
          <NavItem size={2} href="/dashboard/inventario/equipos">
            Equipos
          </NavItem>
          <NavItem size={2} href="/dashboard/inventario/partes">
            Partes
          </NavItem>
          <NavItem size={2} href="/dashboard/inventario/gases">
            Gases
          </NavItem>
        </div>
        <NavItem href="/dashboard/calendario">
          <CalendarIcon />
          Calendario
        </NavItem>
      </nav>
    </div>
  );
}
