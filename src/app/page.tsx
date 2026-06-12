
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
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Indexed Judgments", value: "45,201", icon: Database, color: "text-blue-500" },
  { label: "AI Drafting Requests", value: "1,248", icon: FileText, color: "text-amber-500" },
  { label: "Active RAG Sessions", value: "42", icon: MessageSquare, color: "text-emerald-500" },
  { label: "System Uptime", value: "99.99%", icon: Activity, color: "text-secondary" },
];

const quickActions = [
  { name: "New Legal Research", href: "/search", desc: "Search through BNS, judgments and bare acts." },
  { name: "Draft a Petition", href: "/drafting", desc: "Generate professional legal drafts with AI." },
  { name: "Ask Legal Assistant", href: "/ai-assistant", desc: "Complex reasoning based on internal context." },
  { name: "Review Case Library", href: "/library", desc: "Manage and index your PDF collection." },
];

export default function Dashboard() {
  return (
    <AppLayoutWrapper>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2">Platform Overview</h1>
          <p className="text-muted-foreground">Welcome back, Counselor. All systems are operational.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="border-none shadow-sm bg-card/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <div className={stat.color}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-emerald-500 flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> +2.4%
                  </span>
                </div>
                <div className="text-2xl font-bold font-headline">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg border-primary/5">
              <CardHeader>
                <CardTitle className="text-lg">Enterprise Quick Actions</CardTitle>
                <CardDescription>Commonly used legal operations and workflows.</CardDescription>
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
                        Launch Service <ArrowUpRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Infrastructure Activity</CardTitle>
                <CardDescription>Ollama and Qdrant synchronization logs.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { event: "Qdrant Indexing Complete", time: "2 mins ago", detail: "Judiciary Hub: State Supreme Court 2024", type: "success" },
                    { event: "Ollama Model Load", time: "15 mins ago", detail: "DeepSeek-R1 Legal Reasoner specialized", type: "info" },
                    { event: "MinIO Storage Sync", time: "1 hour ago", detail: "Document processing queue cleared", type: "success" },
                  ].map((log, i) => (
                    <div key={i} className="flex gap-4 items-start pb-4 border-b last:border-0">
                      <div className={cn(
                        "mt-1 p-1 rounded-full",
                        log.type === "success" ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                      )}>
                        {log.type === "success" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">{log.event}</span>
                          <span className="text-[10px] text-muted-foreground">{log.time}</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{log.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-primary text-primary-foreground border-none">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Cpu className="h-5 w-5" /> AI Health Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Ollama (DeepSeek-R1)</span>
                    <span className="text-secondary font-bold">READY</span>
                  </div>
                  <div className="h-1.5 w-full bg-primary-foreground/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[85%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Qdrant (Vector Store)</span>
                    <span className="text-secondary font-bold">STABLE</span>
                  </div>
                  <div className="h-1.5 w-full bg-primary-foreground/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[98%]"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>MinIO (File Object)</span>
                    <span className="text-secondary font-bold">SYNCED</span>
                  </div>
                  <div className="h-1.5 w-full bg-primary-foreground/10 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary w-[72%]"></div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-4 bg-transparent border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 text-xs">
                  Run Diagnostic
                </Button>
              </CardContent>
            </Card>

            <Card className="border-secondary/20 bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-md font-headline">Enterprise Support</CardTitle>
              </CardHeader>
              <CardContent className="text-xs space-y-2">
                <p>For system deployment issues or n8n workflow failures, contact IT support at <span className="font-bold underline">ops@smarthub.legal</span></p>
                <div className="pt-2">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Local Server ID:</span>
                  <p className="font-mono text-[10px] bg-background p-1 rounded border mt-1">SH-NODE-PROD-0042</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
