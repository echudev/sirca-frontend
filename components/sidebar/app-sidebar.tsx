import { SidebarContentComponent } from "./sidebar-content";
import Link from "next/link";
import { ChevronUp, LogOutIcon, UserPenIcon, PlusIcon } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
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

import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { verifySession } from "@/lib/session";
import { CookieDTO } from "@/backend/modules/user/dto";
import { logout } from "@/backend/modules/user/actions";

export async function AppSidebar() {
  // user cookie sesion data
  const cookie: CookieDTO = await verifySession();
  const userName = cookie.data.userName;
  const userRole = cookie.data.role;

  return (
    <Sidebar variant="floating" collapsible="icon">
      <SidebarHeader className="mb-5">
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
      <SidebarContentComponent />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
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
                    <UserPenIcon />
                    <span>Mi Perfil</span>
                  </DropdownMenuItem>
                  {userRole === "ADMIN" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <PlusIcon />
                        <span>Registrar Usuario</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <SidebarSeparator />
                  <DialogTrigger className="w-full">
                    <DropdownMenuItem>
                      <LogOutIcon />
                      <span>Salir</span>
                    </DropdownMenuItem>
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
