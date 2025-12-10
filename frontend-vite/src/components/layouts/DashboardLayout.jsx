import {
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/AppSidebar";

export function DashboardLayout({ children }) {
  const saved = localStorage.getItem("sidebar-open");
  const defaultOpen = saved === null ? true : saved === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />

      <SidebarInset>
        <header className="flex py-4 items-center gap-2 px-4 border-b bg-white">
          <SidebarTrigger />
          <h2 className="font-semibold">Dashboard</h2>
        </header>

        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
