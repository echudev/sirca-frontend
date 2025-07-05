import { cookies } from "next/headers";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Suspense } from "react";
import Loading from "../loading";
import { AppBreadCrumb } from "@/components/app-breadcrumb";

export const metadata = {
  title: "SIRCA - Inicio",
  description: "Sistema de Gestion de la Red de Calidad del Aire.",
};

export default async function InicioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // sidebar state
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className="w-full h-screen p-3">
        <div className="flex flex-col rounded bg-gray-50 shadow-md shadow-black/25 h-full">
          <div className="flex flex-shrink-0">
            <SidebarTrigger />
            <AppBreadCrumb />
          </div>
          <div className="flex-1 overflow-y-auto">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
}
