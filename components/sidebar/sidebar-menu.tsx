"use client";

import { ModuleMenu } from "./module-menu";
import { inventario, mantenimiento } from "@/lib/modules";
import Link from "next/link";
import { Home } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

export function SidebarContentComponent() {
  const pathname = usePathname();
  return (
    <SidebarContent className="my-5">
      <SidebarGroup>
        <SidebarMenuButton
          asChild
          tooltip={"Inicio"}
          isActive={pathname === "/dashboard"}
        >
          <Link href="/dashboard" className="z-50">
            <Home />
            <span>Inicio</span>
          </Link>
        </SidebarMenuButton>
        <SidebarGroupLabel>Módulos</SidebarGroupLabel>
        <SidebarGroupContent>
          <ModuleMenu
            title={inventario.title}
            items={inventario.items}
            icon={inventario.icon}
          />
          <ModuleMenu
            title={mantenimiento.title}
            items={mantenimiento.items}
            icon={mantenimiento.icon}
          />
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
