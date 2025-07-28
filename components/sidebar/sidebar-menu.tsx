"use client";

import { usePathname, useRouter } from "next/navigation";
import { LucideIcon } from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

interface Item {
  title: string;
  url: string;
  icon: LucideIcon;
}
interface ModuleMenuProps {
  items: Array<Item>;
}

export function Menu({ items }: ModuleMenuProps) {
  const pathName = usePathname();
  const router = useRouter();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {items.map((item) => (
          <SidebarMenuButton
            key={item.title}
            tooltip={item.title}
            isActive={pathName === item.url}
            onClick={() => router.push(item.url)}
            // className="my-1"
          >
            <item.icon className="z-50" />
            <span>{item.title}</span>
          </SidebarMenuButton>
        ))}
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
