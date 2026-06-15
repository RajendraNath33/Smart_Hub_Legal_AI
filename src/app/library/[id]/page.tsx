"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, ArrowLeft, ExternalLink, CalendarDays, Tag, Link as LinkIcon, ListMusic } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface DocumentRecord {
  id: string;
  title: string;
  category: string;
  uploadDate?: { toDate: () => Date } | null;
  fileUrl: string;
  fileName?: string;
  extractedText?: string;
  notes?: string;
}

export default function LibraryDocumentPage() {
  const params = useParams();
  const documentId = typeof params?.id === "string" ? params.id : undefined;
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!documentId) return;

    const loadDocument = async () => {
      setLoading(true);
      setError(null);

      try {
        const documentRef = doc(db, "legal_documents", documentId);
        const snapshot = await getDoc(documentRef);

        if (!snapshot.exists()) {
          setError("Document not found.");
          setDocument(null);
          return;
        }

        setDocument({
          id: snapshot.id,
          ...(snapshot.data() as Omit<DocumentRecord, "id">),
        });
      } catch (loadError) {
        console.error("Failed to load document details:", loadError);
        setError("Unable to load document details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  return (
    <AppLayoutWrapper>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-secondary" /> Document Details
            </h1>
            <p className="text-muted-foreground">Review metadata, preview extracted text, and open the document in your browser.</p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/library" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Library
            </Link>
          </Button>
        </div>

        <Card className="bg-card/50 border border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Document Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center text-muted-foreground">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary"></div>
                <p className="font-medium">Loading document details…</p>
              </div>
            ) : error ? (
              <div className="rounded-3xl border border-destructive/20 bg-destructive/10 p-8 text-center text-destructive">
                <p className="font-semibold">{error}</p>
                <p className="mt-2 text-sm text-muted-foreground">Check the document ID or return to the library.</p>
              </div>
            ) : document ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 rounded-3xl border border-border bg-background p-6">
                    <div className="flex items-center gap-3 text-secondary">
                      <FileText className="h-5 w-5" />
                      <span className="text-sm uppercase tracking-[0.18em] font-semibold">Title</span>
                    </div>
                    <p className="text-lg font-semibold">{document.title}</p>
                    <p className="text-sm text-muted-foreground">{document.fileName}</p>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-border bg-background p-6">
                    <div className="flex items-center gap-3 text-secondary">
                      <Tag className="h-5 w-5" />
                      <span className="text-sm uppercase tracking-[0.18em] font-semibold">Category</span>
                    </div>
                    <p className="text-lg font-semibold">{document.category}</p>
                    <p className="text-sm text-muted-foreground">{document.uploadDate ? new Date(document.uploadDate.toDate()).toLocaleDateString() : "Unknown"}</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-3 rounded-3xl border border-border bg-background p-6">
                    <div className="flex items-center gap-3 text-secondary">
                      <CalendarDays className="h-5 w-5" />
                      <span className="text-sm uppercase tracking-[0.18em] font-semibold">Uploaded</span>
                    </div>
                    <p>{document.uploadDate ? new Date(document.uploadDate.toDate()).toLocaleString() : "Date not available"}</p>
                  </div>

                  <div className="space-y-3 rounded-3xl border border-border bg-background p-6">
                    <div className="flex items-center gap-3 text-secondary">
                      <LinkIcon className="h-5 w-5" />
                      <span className="text-sm uppercase tracking-[0.18em] font-semibold">Source</span>
                    </div>
                    <a
                      href={document.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/90"
                    >
                      View Document
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {document.notes ? (
                  <div className="rounded-3xl border border-border bg-background p-6">
                    <div className="flex items-center gap-3 text-secondary">
                      <ListMusic className="h-5 w-5" />
                      <span className="text-sm uppercase tracking-[0.18em] font-semibold">Upload Notes</span>
                    </div>
                    <p className="whitespace-pre-line text-sm leading-7 text-muted-foreground">{document.notes}</p>
                  </div>
                ) : null}

                <div className="rounded-3xl border border-border bg-background p-6">
                  <div className="flex items-center gap-3 text-secondary mb-4">
                    <FileText className="h-5 w-5" />
                    <span className="text-sm uppercase tracking-[0.18em] font-semibold">Extracted Text Preview</span>
                  </div>
                  {document.extractedText ? (
                    <div className="space-y-4 text-sm leading-7 text-muted-foreground">
                      <p className="line-clamp-6">{document.extractedText}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span className="rounded-full border border-border px-2 py-1">{document.extractedText.length.toLocaleString()} characters extracted</span>
                        <span className="rounded-full border border-border px-2 py-1">First page preview only</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No extracted text was stored for this document.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-background p-10 text-center text-muted-foreground">
                <p>No document details available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayoutWrapper>
  );
}
