"use client";

import { MenuSub } from "./sidebar-menu-sub";
import { Menu } from "./sidebar-menu";
import {
  inventario,
  mantenimiento,
  inicio,
  datos,
} from "@/components/sidebar/items";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

export function Content() {
  return (
    <SidebarContent className="my-5">
      <SidebarGroup>
        <Menu items={inicio} />
        <SidebarGroupLabel>Módulos</SidebarGroupLabel>
        <SidebarGroupContent>
          <MenuSub
            title={datos.title}
            items={datos.items}
            icon={datos.icon}
            defaultUrl={datos.defaultUrl}
          />
          <MenuSub
            title={inventario.title}
            items={inventario.items}
            icon={inventario.icon}
          />
          <MenuSub
            title={mantenimiento.title}
            items={mantenimiento.items}
            icon={mantenimiento.icon}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
