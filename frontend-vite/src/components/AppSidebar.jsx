import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, LogOut, ArrowLeftRight, Bot, User } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: Home },
  { title: "Transaksi", url: "/transaksi", icon: ArrowLeftRight },
  { title: "Smart Budget Assistant", url: "/budget", icon: Bot },
  { title: "Profile", url: "/profile", icon: User },
];

export function AppSidebar() {
  const { open } = useSidebar();

  useEffect(() => {
    localStorage.setItem("sidebar-open", open);
  }, [open]);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader
        className={`px-4 py-4 border-b transition-all ${
          !open ? "opacity-0 h-0 overflow-hidden" : ""
        }`}
      >
        <h1 className="text-xl font-bold">FinTrack</h1>
      </SidebarHeader>

      <SidebarContent className="mx-2">
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      to={item.url}
                      className={`flex items-center ${
                        open ? "gap-2" : "justify-center"
                      } w-full`}
                    >
                      <item.icon className={open ? "" : "mx-auto"} />
                      {open && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t px-4 py-3">
        <SidebarMenuButton
          className="text-red-600 hover:text-red-700 hover:bg-red-100"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          <LogOut className="text-red-600" />
          {open && <span className="text-red-600">Logout</span>}
        </SidebarMenuButton>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
