"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { WrenchIcon, ChevronRight } from "lucide-react";

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

interface Item {
  title: string;
  url: string;
}
interface ModuleMenuProps {
  title: string;
  items: Array<Item>;
}

export function ModuleMenu({ title, items }: ModuleMenuProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathName = usePathname();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible
          defaultOpen
          onOpenChange={(open) => setIsOpen(open)}
          className="group/collapsible"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={title}>
              <WrenchIcon />
              <span>{title}</span>
              <ChevronRight
                className={`ml-auto transition-transform ${
                  isOpen ? "rotate-90" : "rotate-0"
                }`}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <SidebarMenuSub>
            {items.map((item) => (
              <CollapsibleContent
                key={item.title}
                className={`transition-[max-height] ease-in-out duration-300 ${
                  isOpen ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <SidebarMenuSubItem>
                  <SidebarMenuSubButton
                    asChild
                    isActive={pathName === item.url}
                  >
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
