"use client";

import {
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export function SidebarHeaderComponent() {
  const { open } = useSidebar();

  return (
    <SidebarHeader className="mb-5">
      <SidebarMenuButton
        size="lg"
        className="hover:bg-sidebar active:bg-sidebar hover:text-white active:text-white"
      >
        <Avatar className={`invert ${open ? "h-14 w-14 " : "h-8 w-8"}`}>
          <AvatarImage src="https://general.premioseikon.com/wp-content/uploads/2022/09/logo-BA-png-1024x921.png" />
          <AvatarFallback>logo</AvatarFallback>
        </Avatar>
        <div
          className={`flex flex-col ml-2 ${open ? "opacity-100" : "opacity-0"}`}
        >
          <p className="font-bold text-sm">APrA</p>
          <p className="text-xs">Red de Calidad del Aire</p>
        </div>
      </SidebarMenuButton>
    </SidebarHeader>
  );
}
