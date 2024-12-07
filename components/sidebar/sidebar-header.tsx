"use client";

import {
  SidebarHeader,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import balogo from "../../public/BA-secondary.png";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export function SidebarHeaderComponent() {
  const { open } = useSidebar();

  return (
    <SidebarHeader className="mb-5">
      <SidebarMenuButton
        size="lg"
        className="hover:bg-sidebar active:bg-sidebar hover:text-white active:text-white"
      >
        <Avatar className={open ? "h-14 w-14 " : "h-8 w-8"}>
          <AvatarImage src={balogo.src} alt="logo" />
          <AvatarFallback>BA</AvatarFallback>
        </Avatar>
        <div
          className={`flex flex-col ml-2 text-secondary transition-transform ${open ? "delay-300 translate-y-0 opacity-100" : "opacity-0 -translate-y-40"}`}
        >
          <p className="font-bold text-sm">APrA</p>
          <p className="text-xs">Red de Calidad del Aire</p>
        </div>
      </SidebarMenuButton>
    </SidebarHeader>
  );
}
