
"use client";

import React from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "./main-sidebar";
import { Separator } from "@/components/ui/separator";

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-muted-foreground hidden md:block">
              SmartHub Enterprise Legal Platform
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-2 py-1 bg-secondary/10 border border-secondary/20 rounded text-[10px] font-bold text-secondary uppercase tracking-tight">
              Production Environment
            </div>
          </div>
        </header>
        <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
