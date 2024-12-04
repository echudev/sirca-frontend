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
} from "@/components/ui/sidebar";

export function SidebarContentComponent() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <Link href="/dashboard" className=" my-3">
          <SidebarMenuButton>
            <Home />
            <span>Inicio</span>
          </SidebarMenuButton>
        </Link>
        <SidebarGroupLabel>Módulos</SidebarGroupLabel>
        <SidebarGroupContent>
          <MenuInventario />
          <MenuMantenimiento />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
