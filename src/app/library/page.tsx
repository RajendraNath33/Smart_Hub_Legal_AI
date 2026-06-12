
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
  ChevronRight,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const mockDocs = [
  { id: 1, name: "Indian Penal Code 1860.pdf", size: "4.2 MB", type: "Bare Act", status: "Indexed", date: "2024-03-10" },
  { id: 2, name: "Criminal Procedure Code.pdf", size: "3.8 MB", type: "Bare Act", status: "Indexed", date: "2024-03-11" },
  { id: 3, name: "Kesavananda Bharati Case.pdf", size: "12.4 MB", type: "Judgment", status: "Indexed", date: "2024-03-12" },
  { id: 4, name: "Corporate Laws Vol 1.pdf", size: "22.1 MB", type: "Textbook", status: "Processing", date: "2024-03-14" },
  { id: 5, name: "Draft Contract Template.pdf", size: "1.1 MB", type: "Draft", status: "Stored", date: "2024-03-15" },
];

export default function LibraryPage() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast({ title: "Upload Success", description: "Document has been sent to the OCR pipeline for indexing." });
    }, 2000);
  };

  return (
    <AppLayoutWrapper>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
              <Library className="h-8 w-8 text-secondary" /> Digital Library
            </h1>
            <p className="text-muted-foreground">Manage your localized legal repository. Powered by MinIO and Qdrant.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary/5">
              <Filter className="h-4 w-4 mr-2" /> Filter
            </Button>
            <Button onClick={handleUpload} disabled={isUploading} className="bg-primary hover:bg-primary/90">
              {isUploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
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
                <span className="text-sm font-bold">1.2 GB / 10 GB</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Vector Indexed
                </span>
                <span className="text-sm font-bold">142 Documents</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-xs text-muted-foreground flex items-center gap-2">
                  <FileText className="h-3 w-3" /> OCR Characters
                </span>
                <span className="text-sm font-bold">1.4M Pages</span>
              </div>
              <div className="mt-4 p-4 rounded-xl bg-background border border-secondary/20">
                <h4 className="text-xs font-bold mb-2">n8n Indexing Status</h4>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-600">WORKFLOW ACTIVE</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2 shadow-sm border-none bg-card/50">
            <CardHeader className="pb-2">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search within indexed library..." className="pl-10" />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Document Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockDocs.map((doc) => (
                    <TableRow key={doc.id} className="group hover:bg-muted/50 transition-colors cursor-pointer">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 rounded border border-primary/10 group-hover:bg-secondary/10 transition-colors">
                            <FileText className="h-4 w-4 text-primary group-hover:text-secondary" />
                          </div>
                          <div>
                            <div className="text-sm font-bold truncate max-w-[200px]">{doc.name}</div>
                            <div className="text-[10px] text-muted-foreground uppercase">{doc.size} • {doc.date}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter">
                          {doc.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <div className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            doc.status === "Indexed" ? "bg-emerald-500" : doc.status === "Processing" ? "bg-amber-500 animate-pulse" : "bg-blue-500"
                          )} />
                          <span className="text-[10px] font-bold text-muted-foreground">{doc.status}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
