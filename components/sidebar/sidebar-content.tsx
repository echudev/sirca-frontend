"use client";

import { Menu } from "./sidebar-menu";
import { MenuSub } from "./sidebar-menu-sub";
import {
  inicio,
  datosCrudos,
  reportes,
  tiempoReal,
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
        <SidebarGroupLabel>Inicio</SidebarGroupLabel>
        <Menu items={inicio} />
        <SidebarGroupLabel>Datos en Tiempo Real</SidebarGroupLabel>
        <Menu items={tiempoReal} />
        <SidebarGroupLabel>Hiostóricos</SidebarGroupLabel>
        <MenuSub
          title={datosCrudos.title}
          items={datosCrudos.items}
          icon={datosCrudos.icon}
        />
        <Menu items={reportes} />
        {/* <MenuSub
            title={inventario.title}
            items={inventario.items}
            icon={inventario.icon}
          />
          <MenuSub
            title={mantenimiento.title}
            items={mantenimiento.items}
            icon={mantenimiento.icon}
          /> */}
      </SidebarGroup>
    </SidebarContent>
  );
}
