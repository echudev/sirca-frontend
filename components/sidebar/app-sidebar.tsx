import { Content } from "./sidebar-content";
import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar";
import { Header } from "./sidebar-header";
import { Footer } from "./sidebar-footer";

export async function AppSidebar() {
  return (
    <Sidebar variant="floating" collapsible="icon" className="z-50">
      <Header />
      <SidebarSeparator />
      <Content />
      <SidebarSeparator />
      <Footer />
    </Sidebar>
  );
}
