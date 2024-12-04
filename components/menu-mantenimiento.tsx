"use client";

import { useState } from "react";
import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

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

// Mantainance Menu items.
const itemsMantenimiento = [
  {
    title: "Órdenes",
    url: "/dashboard/mantenimiento/ordenes",
  },
  {
    title: "Calibraciones",
    url: "/dashboard/mantenimiento/calibraciones",
  },
  {
    title: "Programado",
    url: "/dashboard/mantenimiento/programado",
  },
];

export function MenuMantenimiento() {
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
            <SidebarMenuButton>
              <Home />
              <span>Mantenimiento</span>
              <ChevronRight
                className={`ml-auto transition-transform ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <SidebarMenuSub>
            {itemsMantenimiento.map((item) => (
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
