"use client";

import React, { useEffect } from "react";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "./main-sidebar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && !["/login", "/register", "/forgot-password"].includes(pathname)) {
      router.push("/login");
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user && !["/login", "/register", "/forgot-password"].includes(pathname)) {
    return null;
  }

  return (
    <SidebarProvider>
      <MainSidebar />
      <SidebarInset className="bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 sticky top-0 bg-background/80 backdrop-blur-md z-10">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex-1">
            <h1 className="text-sm font-semibold text-muted-foreground hidden md:block">
              SmartHub Legal AI & Learning Platform
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="px-2 py-1 bg-secondary/10 border border-secondary/20 rounded text-[10px] font-bold text-secondary uppercase tracking-tight">
              Ready
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