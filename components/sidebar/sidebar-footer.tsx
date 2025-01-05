"use server";

import Link from "next/link";
import { ChevronUp, LogOutIcon, UserPenIcon, PlusIcon } from "lucide-react";
import {
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
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import { verifySession } from "@/lib/auth-session";
import { logout } from "@/app/actions/auth/";


interface CookieResponse {
  isAuth: boolean;
  data: {
    userId: string;
    userName: string;
    role: string;
  };
}

export async function Footer() {
  // user cookie sesion data
  const cookie: CookieResponse = await verifySession();
  const userName = cookie.data.userName;
  const userRole = cookie.data.role;

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size={"lg"}>
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
                  Presiona salir para cerrar la sesión, o cualquier parte de la
                  pantalla para continuar trabajando
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
  );
}
