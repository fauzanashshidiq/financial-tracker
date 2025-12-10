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
import { Toaster } from "sonner";
import React from "react";

const breadcrumbLabels = {
  dashboard: "Dashboard",
  transaksi: "Transaksi",
  tambah: "Tambah",
  edit: "Edit",
  detail: "Detail",
  budget: "Smart Budget Assistant",
  history: "History",
  profile: "Profile",
};

export function DashboardLayout({ children }) {
  const saved = localStorage.getItem("sidebar-open");
  const defaultOpen = saved === null ? true : saved === "true";

  const { pathname } = useLocation();
  const segments = pathname.split("/").filter(Boolean);

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Toaster richColors position="top-right" />

        <header className="flex py-4 items-center gap-2 px-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Breadcrumb>
              <BreadcrumbList>
                {segments.map((segment, index) => {
                  const path = "/" + segments.slice(0, index + 1).join("/");
                  const label = breadcrumbLabels[segment] || segment;
                  const isLast = index === segments.length - 1;

                  return (
                    <React.Fragment key={path}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage className="capitalize">
                            {label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <Link to={path} className="capitalize">
                              {label}
                            </Link>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  );
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
