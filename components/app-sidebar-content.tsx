"use client";

import { useState } from "react";
import { Calendar, Home, Inbox, Search, ChevronRight } from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import Link from "next/link";

// Inventory Menu items.
const itemsInventario = [
  {
    title: "Estaciones",
    url: "/dashboard/inventario/estaciones",
    icon: Home,
  },
  {
    title: "Equipos",
    url: "/dashboard/inventario/equipos",
    icon: Inbox,
  },
  {
    title: "Partes",
    url: "/dashboard/inventario/partes",
    icon: Calendar,
  },
  {
    title: "Gases",
    url: "/dashboard/inventario/gases",
    icon: Search,
  },
];
// Mantainance Menu items.
const itemsMantenimiento = [
  {
    title: "Órdenes",
    url: "/dashboard/mantenimiento/ordenes",
    icon: Home,
  },
  {
    title: "Calibraciones",
    url: "/dashboard/mantenimiento/calibraciones",
    icon: Inbox,
  },
  {
    title: "Programado",
    url: "/dashboard/mantenimiento/programado",
    icon: Calendar,
  },
];

export function SidebarContentComponent() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenuButton asChild>
          <Link href="/dashboard">
            <Home />
            <span>Inicio</span>
          </Link>
        </SidebarMenuButton>
        <SidebarGroupLabel>Módulos</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <Collapsible
                defaultOpen
                onOpenChange={(open) => setIsOpen(open)}
                className="group/collapsible"
              >
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    <Home />
                    <span>Inventario</span>
                    <ChevronRight
                      className={`ml-auto transition-transform ${
                        isOpen ? "rotate-90" : "rotate-0"
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <SidebarMenuSub>
                  {itemsInventario.map((item) => (
                    <CollapsibleContent
                      key={item.title}
                      className={`transition-[max-height] ease-in-out duration-300 ${
                        isOpen
                          ? "max-h-[200px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton asChild>
                          <Link href={item.url}>
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </CollapsibleContent>
                  ))}
                </SidebarMenuSub>
              </Collapsible>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/dashboard/mantenimiento">
                  <Home />
                  <span>Mantenimiento</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuSub>
                {itemsMantenimiento.map((item) => (
                  <SidebarMenuSubItem key={item.title}>
                    <SidebarMenuSubButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
