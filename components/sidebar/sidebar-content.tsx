"use client";

import { Menu } from "./sidebar-menu";
import { MenuSub } from "./sidebar-menu-sub";
import {
  inicio,
  datos,
  reportes,
  estaciones,
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
        <SidebarGroupLabel className="mt-2">Inicio</SidebarGroupLabel>
        <Menu items={inicio} />
        <MenuSub
          title={estaciones.title}
          items={estaciones.items}
          icon={estaciones.icon}
        />
        <SidebarGroupLabel className="mt-2">Datos de la Red</SidebarGroupLabel>
        <Menu items={datos} />
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
