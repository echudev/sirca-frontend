import { MenuInventario } from "./menu-inventario";
import { MenuMantenimiento } from "./menu-mantenimiento";
import Link from "next/link";
import { Home } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

export function SidebarContentComponent() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenuButton asChild>
          <Link href="/dashboard" className="z-50">
            <Home />
            <span>Inicio</span>
          </Link>
        </SidebarMenuButton>
        <SidebarGroupLabel>Módulos</SidebarGroupLabel>
        <SidebarGroupContent>
          <MenuInventario />
          <MenuMantenimiento />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
