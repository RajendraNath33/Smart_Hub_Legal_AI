"use client";

import React from "react";
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  FileText, 
  MessageSquare, 
  Search, 
  Activity, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Clock,
  ArrowUpRight,
  ShieldAlert
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Indexed Judgments", value: "Not Configured Yet", icon: Database, color: "text-blue-500" },
  { label: "AI Drafting Requests", value: "Not Configured Yet", icon: FileText, color: "text-amber-500" },
  { label: "Active RAG Sessions", value: "Not Configured Yet", icon: MessageSquare, color: "text-emerald-500" },
  { label: "System Uptime", value: "Not Configured Yet", icon: Activity, color: "text-secondary" },
];

const quickActions = [
  { name: "Legal Research", href: "/search", desc: "Search through legal databases and bare acts." },
  { name: "Drafting Assistant", href: "/drafting", desc: "Generate legal drafts and templates." },
  { name: "AI Assistant", href: "/ai-assistant", desc: "Consult the AI reasoner for complex queries." },
  { name: "Case Library", href: "/library", desc: "Manage your indexed document collection." },
];

export default function Dashboard() {
  return (
    <AppLayoutWrapper>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2">SmartHub Legal AI & Learning Platform</h1>
          <p className="text-muted-foreground tracking-tight">System control center. All modules are currently in initial state.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={stat.color}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="text-sm font-bold font-headline text-muted-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg border-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Available Modules</CardTitle>
                <CardDescription>Common legal operations and workflows.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickActions.map((action) => (
                  <Link key={action.name} href={action.href}>
                    <div className="group p-4 rounded-xl border border-border bg-background hover:border-secondary hover:shadow-md transition-all h-full flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm mb-1 group-hover:text-secondary transition-colors">{action.name}</h3>
                        <p className="text-xs text-muted-foreground">{action.desc}</p>
                      </div>
                      <div className="mt-4 flex items-center text-[10px] font-bold text-secondary uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                        Launch <ArrowUpRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Logs</CardTitle>
                <CardDescription>Real-time updates from core services.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Activity className="h-8 w-8 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground font-medium italic">No active system events recorded yet.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-primary text-primary-foreground border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5" /> Engine Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-70">
                    <span>Reasoning Engine</span>
                    <span className="text-secondary font-bold italic">Not Configured Yet</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-70">
                    <span>Vector Storage</span>
                    <span className="text-secondary font-bold italic">Not Configured Yet</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-70">
                    <span>Document Processing</span>
                    <span className="text-secondary font-bold italic">Not Configured Yet</span>
                  </div>
                </div>
                <div className="mt-6 p-4 rounded-lg bg-white/5 border border-white/10 flex gap-2 items-start">
                  <ShieldAlert className="h-4 w-4 text-secondary shrink-0" />
                  <p className="text-[10px] leading-tight">System initialization required to start processing enterprise legal requests.</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-md font-headline">Platform Support</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>For assistance with the SmartHub Legal AI & Learning Platform, please contact support.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}