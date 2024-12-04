import {
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
  ChevronUp,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import Link from "next/link";
import { verifySession } from "@/lib/session";
import { CookieDTO } from "@/domain/user/dto";
import { logout } from "@/app/actions/auth";
import { Separator } from "@radix-ui/react-select";

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

export async function AppSidebar() {
  // user state
  const cookie: CookieDTO = await verifySession();
  const userName = cookie.data.userName;

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="hover:bg-sidebar active:bg-sidebar"
        >
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src="https://general.premioseikon.com/wp-content/uploads/2022/09/logo-BA-png-1024x921.png" />
            <AvatarFallback>logo</AvatarFallback>
          </Avatar>
          <p className="font-bold text-base">SIRCA</p>
        </SidebarMenuButton>
      </SidebarHeader>
      <Separator className="border mx-2 my-3" />
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
                <SidebarMenuButton asChild>
                  <Link href="/dashboard/inventario">
                    <Home />
                    <span>Inventario</span>
                  </Link>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {itemsInventario.map((item) => (
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
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton size="lg">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src="https://cdn3d.iconscout.com/3d/premium/thumb/hombre-avatar-6299539-5187871.png?f=webp" />
                      <AvatarFallback>user</AvatarFallback>
                    </Avatar>
                    <p className="font-bold text-base">{userName}</p>
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem>Salir</DropdownMenuItem>
                  </DialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>¿Estas seguro?</DialogTitle>
                  <DialogDescription>
                    Presiona salir para cerrar la sesión, o cualquier parte de
                    la pantalla para continuar trabajando
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="destructive" onClick={logout}>
                    Salir
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
