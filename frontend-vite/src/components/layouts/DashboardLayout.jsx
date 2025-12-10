import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { useLocation, Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

const breadcrumbLabels = {
  "/dashboard": "Dashboard",
  "/transaksi": "Transaksi",
  "/budget": "Smart Budget Assistant",
  "/profile": "Profile",
};

export function DashboardLayout({ children }) {
  const saved = localStorage.getItem("sidebar-open");
  const defaultOpen = saved === null ? true : saved === "true";

  const location = useLocation();
  const path = location.pathname;
  const title = breadcrumbLabels[path] || "Menu";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />

      <SidebarInset>
        <header className="flex py-4 items-center gap-2 px-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger />

            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
