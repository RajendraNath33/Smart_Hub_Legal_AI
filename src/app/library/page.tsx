"use client";

import React, { useState } from "react";
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Library, 
  Upload, 
  FileText, 
  Search, 
  Database, 
  Filter, 
  MoreVertical,
  Loader2,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

export default function LibraryPage() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    toast({ title: "Module Not Configured", description: "Storage and indexing services are not yet connected.", variant: "destructive" });
  };

  return (
    <AppLayoutWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
              <Library className="h-8 w-8 text-secondary" /> Digital Library
            </h1>
            <p className="text-muted-foreground">Manage your localized legal repository. Repository initialization pending.</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleUpload} className="bg-primary hover:bg-primary/90">
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 bg-secondary/5 border-secondary/10">
            <CardHeader>
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-secondary">Library Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <Database className="h-3 w-3" /> Total Storage
                </span>
                <span className="text-xs font-bold italic">Not Configured Yet</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3" /> Vector Indexed
                </span>
                <span className="text-xs font-bold italic">Not Configured Yet</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <FileText className="h-3 w-3" /> OCR Characters
                </span>
                <span className="text-xs font-bold italic">Not Configured Yet</span>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-sm border-none bg-card/50">
            <CardHeader className="pb-2">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search within indexed library..." className="pl-10" disabled />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                <AlertCircle className="h-10 w-10 mb-4" />
                <h3 className="text-lg font-bold font-headline italic">No Documents Found</h3>
                <p className="text-sm">Connect a storage provider to begin indexing your legal repository.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}