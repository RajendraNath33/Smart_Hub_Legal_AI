"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Library, Upload, FileText, Search, Database, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface DocumentRecord {
  id: string;
  title: string;
  category: string | null;
  file_name?: string | null;
  file_url?: string | null;
  r2_key?: string | null;
  extracted_text?: string | null;
  notes?: string | null;
  upload_date?: string | null;
}

function computeRelevanceScore(doc: DocumentRecord, normalizedQuery: string) {
  if (!normalizedQuery) return 0;
  const countOccurrences = (source?: string | null) => {
    if (!source) return 0;
    return source.toLowerCase().split(normalizedQuery).length - 1;
  };

  let score = 0;
  score += countOccurrences(doc.title) * 15;
  score += countOccurrences(doc.category) * 10;
  score += countOccurrences(doc.file_name) * 4;
  score += countOccurrences(doc.notes) * 3;
  score += countOccurrences(doc.extracted_text) * 1;
  return score;
}

function snippetForDocument(doc: DocumentRecord, queryText: string) {
  const text = doc.extracted_text || `${doc.title} ${doc.category ?? ""} ${doc.file_name ?? ""} ${doc.notes ?? ""}`;
  const normalized = queryText.toLowerCase().trim();
  const lowerText = text.toLowerCase();
  const index = lowerText.indexOf(normalized);

  if (index === -1) return text.slice(0, 120) + (text.length > 120 ? "…" : "");

  const start = Math.max(0, index - 45);
  const end = Math.min(text.length, index + normalized.length + 80);
  const snippet = text.slice(start, end).trim();
  return `${start > 0 ? "…" : ""}${snippet}${end < text.length ? "…" : ""}`;
}

export default function LibraryPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const { data, error } = await supabase
          .from("legal_documents")
          .select("*")
          .order("upload_date", { ascending: false });

        if (error) throw error;

        setDocuments((data ?? []) as DocumentRecord[]);
      } catch (error) {
        console.error("Failed to load library documents:", error);
        toast({
          title: "Unable to load documents",
          description: "Please refresh or try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    const normalized = searchTerm.trim().toLowerCase();

    return documents
      .map((doc) => ({
        ...doc,
        score: computeRelevanceScore(doc, normalized),
      }))
      .filter((doc) => normalized === "" || doc.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(b.upload_date ?? 0).getTime() - new Date(a.upload_date ?? 0).getTime();
      });
  }, [documents, searchTerm]);

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
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/library/upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload Document
            </Link>
          </Button>
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
                <Input
                  placeholder="Search within indexed library..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-70">
                  <Loader2 className="h-10 w-10 mb-4 animate-spin" />
                  <h3 className="text-lg font-bold font-headline italic">Loading documents...</h3>
                </div>
              ) : filteredDocuments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-40">
                  <AlertCircle className="h-10 w-10 mb-4" />
                  <h3 className="text-lg font-bold font-headline italic">No Documents Found</h3>
                  <p className="text-sm">Upload a legal PDF or adjust your search query.</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Upload Date</TableHead>
                        <TableHead>Preview</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredDocuments.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>
                            <Link href={`/library/${doc.id}`} className="font-semibold text-secondary hover:underline">
                              {doc.title}
                            </Link>
                            {searchTerm && (
                              <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                                {snippetForDocument(doc, searchTerm)}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>{doc.category ?? "-"}</TableCell>
                          <TableCell>{doc.upload_date ? new Date(doc.upload_date).toLocaleDateString() : "-"}</TableCell>
                          <TableCell>
                            <Link href={`/library/${doc.id}`} className="text-secondary underline hover:text-secondary/80">
                              View
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}