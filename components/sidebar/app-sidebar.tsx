import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar";
import { Content } from "./sidebar-content";
import { Footer } from "./sidebar-footer";
import { Header } from "./sidebar-header";

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
