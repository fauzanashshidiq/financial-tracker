import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Home, Inbox, Search, LogOut } from "lucide-react";

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
  { title: "Transaksi", url: "/transaksi", icon: Inbox },
  { title: "Smart Budget Assistant", url: "/budget", icon: Calendar },
  { title: "Profile", url: "/profile", icon: Search },
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

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
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
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          <LogOut />
          {open && <span>Logout</span>}
        </SidebarMenuButton>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
