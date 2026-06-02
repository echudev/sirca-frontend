"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface Item {
  title: string;
  url: string;
}
interface ModuleMenuProps {
  title: string;
  icon: LucideIcon;
  items: Array<Item>;
  defaultUrl?: string;
}

export function MenuSub({
  title,
  items,
  icon: Icon,
  defaultUrl,
}: ModuleMenuProps) {
  const [isOpen, setIsOpen] = useState(true);
  const pathName = usePathname();
  const router = useRouter();

  const handleTitleClick = () => {
    if (defaultUrl) {
      router.push(defaultUrl);
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Collapsible
          defaultOpen
          onOpenChange={(open) => setIsOpen(open)}
          className="group/collapsible"
        >
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={title}
              onClick={defaultUrl ? handleTitleClick : undefined}
              className={defaultUrl ? "cursor-pointer" : ""}
            >
              <Icon />
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
                    onClick={() => router.push(item.url)}
                    className={cn("cursor-pointer")}
                  >
                    <span className="select-none">{item.title}</span>
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
