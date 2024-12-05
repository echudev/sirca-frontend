"use client";

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
  SidebarSeparator,
} from "@/components/ui/sidebar";

export function SidebarContentComponent() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenuButton asChild>
          <Link href="/dashboard">
            <Home />
            <span>Inicio</span>
          </Link>
        </SidebarMenuButton>
        <SidebarSeparator />
        <SidebarGroupLabel>Módulos</SidebarGroupLabel>
        <SidebarGroupContent>
          <MenuInventario />
          <MenuMantenimiento />
        </SidebarGroupContent>
        <SidebarSeparator />
      </SidebarGroup>
    </SidebarContent>
  );
}
