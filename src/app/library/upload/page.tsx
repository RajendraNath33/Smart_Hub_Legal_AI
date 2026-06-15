"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppLayoutWrapper } from "../../../components/layout/app-layout-wrapper";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Upload, ArrowLeft, FileText, Loader2 } from "lucide-react";
import { useAuth } from "../../../components/auth-provider";
import { db } from "../../../lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "../../../hooks/use-toast";
import { getDocument } from "pdfjs-dist/legacy/build/pdf";

const categories = [
  "Bare Act",
  "Judgment",
  "Notes",
  "Article",
  "Case Law",
] as const;

type Category = (typeof categories)[number];

export default function LibraryUploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Bare Act");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  const canSubmit = useMemo(() => {
    return !!title.trim() && !!file && !isUploading;
  }, [title, file, isUploading]);

  const extractTextFromPdf = async (pdfFile: File) => {
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await getDocument({ data: arrayBuffer, disableWorker: true }).promise;
    const pageTexts: string[] = [];

    for (let i = 1; i <= pdf.numPages; i += 1) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const text = content.items.map((item: any) => item.str).join(" ");
      pageTexts.push(text);
    }

    return pageTexts.join("\n\n");
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || !user || !file) return;

    setIsUploading(true);
    setExtractedText("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const uploadResponse = await fetch("/api/library/upload", {
        method: "POST",
        body: formData,
      });

      const result = await uploadResponse.json();

      if (!uploadResponse.ok) {
        throw new Error(result.error || "Failed to upload PDF to R2.");
      }

      const { r2Key, r2Url } = result;
      let pdfText: string | null = null;
      let extractionStatus: "completed" | "failed" = "completed";

      try {
        pdfText = await extractTextFromPdf(file);
        setExtractedText(pdfText);
      } catch (extractError) {
        console.warn("Text extraction failed, saving metadata anyway:", extractError);
        extractionStatus = "failed";
        toast({
          title: "Upload Completed",
          description: "PDF uploaded, but text extraction failed. Document metadata was still saved.",
          variant: "warning",
        });
      }

      await addDoc(collection(db, "legal_documents"), {
        title: title.trim(),
        category,
        notes: notes.trim() || null,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: serverTimestamp(),
        r2Key,
        r2Url,
        extractedText: pdfText,
        extractionStatus,
        uploaderUid: user.uid,
        vectorEmbedding: null,
        embeddingStatus: "pending",
        createdAt: serverTimestamp(),
      });

      if (extractionStatus === "completed") {
        toast({ title: "PDF uploaded successfully", description: "PDF uploaded successfully" });
      }

      router.push("/library");
    } catch (error: any) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error?.message || "Unable to upload the document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <AppLayoutWrapper>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-secondary" /> Upload Legal Document
            </h1>
            <p className="text-muted-foreground">Add PDF documents to the SmartHub Legal Knowledge Base.</p>
          </div>
          <Button asChild variant="secondary">
            <Link href="/library" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" /> Back to Library
            </Link>
          </Button>
        </div>

        <Card className="bg-card/50 border border-border">
          <CardHeader>
            <CardTitle>Document Upload</CardTitle>
            <CardDescription>Upload PDF files and extract searchable text metadata.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter document title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
                    <SelectTrigger id="category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="pdf">PDF File</Label>
                <Input
                  id="pdf"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional internal notes for this document"
                  rows={4}
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <Button type="submit" disabled={!canSubmit} className="flex items-center gap-2">
                  {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {isUploading ? "Uploading..." : "Upload PDF"}
                </Button>
                <p className="text-xs text-muted-foreground">Only authenticated users may upload documents.</p>
              </div>
            </form>

            {file && (
              <div className="rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
                <p className="font-semibold">Selected file:</p>
                <p>{file.name}</p>
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            {extractedText && (
              <div className="rounded-2xl border border-border bg-muted/50 p-4">
                <h3 className="text-sm font-semibold">Extracted Text Preview</h3>
                <p className="mt-2 text-sm leading-relaxed line-clamp-4">{extractedText}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayoutWrapper>
  );
}
