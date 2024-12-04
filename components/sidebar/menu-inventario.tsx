"use client";

import { useState } from "react";
import Link from "next/link";
import { Package2Icon, ChevronRight } from "lucide-react";

import {
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

// Inventory Menu items.
const itemsInventario = [
  {
    title: "Estaciones",
    url: "/dashboard/inventario/estaciones",
  },
  {
    title: "Equipos",
    url: "/dashboard/inventario/equipos",
  },
  {
    title: "Partes",
    url: "/dashboard/inventario/partes",
  },
  {
    title: "Gases",
    url: "/dashboard/inventario/gases",
  },
];

export function MenuInventario() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible
          defaultOpen
          onOpenChange={(open) => setIsOpen(open)}
          className="group/collapsible"
        >
          <CollapsibleTrigger asChild>
            <Link href="/dashboard/inventario">
              <SidebarMenuButton>
                <Package2Icon />
                <span>Inventario</span>
                <ChevronRight
                  className={`ml-auto transition-transform ${
                    isOpen ? "rotate-90" : "rotate-0"
                  }`}
                />
              </SidebarMenuButton>
            </Link>
          </CollapsibleTrigger>
          <SidebarMenuSub>
            {itemsInventario.map((item) => (
              <CollapsibleContent
                key={item.title}
                className={`transition-[max-height] ease-in-out duration-300 ${
                  isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
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
    </SidebarMenu>
  );
}
