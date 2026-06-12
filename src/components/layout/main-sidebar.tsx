
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  MessageSquare, 
  FileText, 
  Search, 
  Library, 
  Gavel, 
  BookOpen, 
  GraduationCap, 
  Settings, 
  ShieldCheck, 
  Activity,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator
} from "@/components/ui/sidebar";

const mainNav = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/" },
  { name: "AI Assistant", icon: MessageSquare, href: "/ai-assistant" },
  { name: "Legal Search", icon: Search, href: "/search" },
  { name: "Drafting Hub", icon: FileText, href: "/drafting" },
];

const resourceNav = [
  { name: "Judiciary Hub", icon: Gavel, href: "/judiciary" },
  { name: "Digital Library", icon: Library, href: "/library" },
  { name: "LLB Portal", icon: GraduationCap, href: "/llb" },
  { name: "Mock Tests", icon: BookOpen, href: "/tests" },
];

const adminNav = [
  { name: "Infrastructure", icon: Activity, href: "/admin/infrastructure" },
  { name: "User Management", icon: ShieldCheck, href: "/admin/users" },
  { name: "Settings", icon: Settings, href: "/admin/settings" },
];

export function MainSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-sidebar-border/50">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 bg-secondary rounded-lg flex items-center justify-center font-bold text-secondary-foreground">
            SH
          </div>
          <span className="font-headline font-bold text-lg text-sidebar-foreground truncate group-data-[collapsible=icon]:hidden">
            SmartHub AI
          </span>
        </Link>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 font-bold uppercase tracking-wider text-[10px] group-data-[collapsible=icon]:hidden">
            CORE PLATFORM
          </SidebarGroupLabel>
          <SidebarMenu>
            {mainNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.name}
                  className="hover:bg-sidebar-accent transition-all"
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 font-bold uppercase tracking-wider text-[10px] group-data-[collapsible=icon]:hidden">
            LEARNING & RESOURCES
          </SidebarGroupLabel>
          <SidebarMenu>
            {resourceNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.name}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 font-bold uppercase tracking-wider text-[10px] group-data-[collapsible=icon]:hidden">
            ENTERPRISE ADMIN
          </SidebarGroupLabel>
          <SidebarMenu>
            {adminNav.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton 
                  asChild 
                  isActive={pathname === item.href}
                  tooltip={item.name}
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/50 p-4">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
          <div className="h-8 w-8 rounded-full bg-secondary/20 border border-secondary/30 flex items-center justify-center font-bold text-secondary text-xs">
            JD
          </div>
          <div className="flex flex-col truncate group-data-[collapsible=icon]:hidden">
            <span className="text-xs font-bold text-sidebar-foreground">John Doe, Esq.</span>
            <span className="text-[10px] text-sidebar-foreground/60">Enterprise Tier</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
