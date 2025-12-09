"use client";

import { Menu } from "./sidebar-menu";
import { MenuSub } from "./sidebar-menu-sub";
import {
  datos,
  reportes,
  aqi,
  estaciones,
  descargas,
} from "@/components/sidebar/items";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function Content() {
  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Tiempo Real</SidebarGroupLabel>
        <Menu items={aqi} />
        <MenuSub
          title={estaciones.title}
          items={estaciones.items}
          icon={estaciones.icon}
        />
        <SidebarGroupLabel>Datos Históricos</SidebarGroupLabel>
        <Menu items={datos} />
        <Menu items={reportes} />
        <Menu items={descargas} />
      </SidebarGroup>
    </SidebarContent>
  );
}
