import { SidebarContentComponent } from "./sidebar-content";

import { ChevronUp } from "lucide-react";

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
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
import { Separator } from "@/components/ui/separator";

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { verifySession } from "@/lib/session";
import { CookieDTO } from "@/domain/user/dto";
import { logout } from "@/app/actions/auth";

export async function AppSidebar() {
  // user cookie sesion data
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
      <Separator className="mt-3" />
      <SidebarContentComponent />
      <Separator className="mb-3" />
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
