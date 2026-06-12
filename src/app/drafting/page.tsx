
"use client";

import React, { useState } from "react";
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  FileText, 
  Loader2, 
  Sparkles, 
  Copy, 
  Download, 
  CheckCircle2, 
  ShieldAlert,
  Save
} from "lucide-react";
import { legalDraftingAssistant, LegalDraftingOutput } from "@/ai/flows/legal-drafting-assistant-flow";
import { toast } from "@/hooks/use-toast";

export default function DraftingPage() {
  const [docType, setDocType] = useState("Civil Suit");
  const [keyDetails, setKeyDetails] = useState("");
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftedDoc, setDraftedDoc] = useState("");

  const handleGenerate = async () => {
    if (!keyDetails.trim()) {
      toast({ title: "Missing details", description: "Please provide essential facts for the draft.", variant: "destructive" });
      return;
    }

    setIsGenerating(true);
    try {
      const result: LegalDraftingOutput = await legalDraftingAssistant({
        documentType: docType,
        keyDetails,
        additionalInstructions
      });
      setDraftedDoc(result.draftedDocument);
      toast({ title: "Draft Generated", description: "Your legal document is ready for review." });
    } catch (error) {
      console.error(error);
      toast({ title: "Drafting Error", description: "Failed to generate document. Check AI service connectivity.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftedDoc);
    toast({ title: "Copied", description: "Document text copied to clipboard." });
  };

  return (
    <AppLayoutWrapper>
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-secondary" /> AI Drafting Hub
          </h1>
          <p className="text-muted-foreground">Generate production-ready legal templates and petitions using reasoning-aware AI.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-lg">Draft Configuration</CardTitle>
              <CardDescription>Specify the parameters for your legal document.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="doc-type">Document Type</Label>
                <Select value={docType} onValueChange={setDocType}>
                  <SelectTrigger id="doc-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Civil Suit">Civil Suit</SelectItem>
                    <SelectItem value="Criminal Complaint">Criminal Complaint</SelectItem>
                    <SelectItem value="Writ Petition">Writ Petition</SelectItem>
                    <SelectItem value="Employment Contract">Employment Contract</SelectItem>
                    <SelectItem value="Legal Notice">Legal Notice</SelectItem>
                    <SelectItem value="Bail Application">Bail Application</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="key-details">Key Facts & Details</Label>
                <Textarea
                  id="key-details"
                  placeholder="Describe the parties involved, dates, grievances, and specific relief sought..."
                  className="min-h-[150px] resize-none"
                  value={keyDetails}
                  onChange={(e) => setKeyDetails(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground italic">Be as specific as possible for better structural accuracy.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructions">Additional Instructions (Optional)</Label>
                <Input
                  id="instructions"
                  placeholder="e.g., 'Use formal high court tone', 'Include section 482 CrPC references'"
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10 flex gap-3 items-start text-xs text-muted-foreground">
                <ShieldAlert className="h-4 w-4 text-secondary shrink-0" />
                <p>Ensure all generated content is reviewed by a qualified legal professional before filing. AI drafts are meant for baseline structuring.</p>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 border-t">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating} 
                className="w-full bg-secondary text-primary hover:bg-secondary/90 font-bold"
              >
                {isGenerating ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Drafting...</>
                ) : (
                  <><Sparkles className="h-4 w-4 mr-2" /> Generate Legal Draft</>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card className="shadow-lg h-full flex flex-col">
            <CardHeader className="border-b flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Generated Draft</CardTitle>
                <CardDescription>Review and finalize your document.</CardDescription>
              </div>
              {draftedDoc && (
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={handleCopy} title="Copy to Clipboard">
                    <Copy className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Download PDF">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Save to Cloud">
                    <Save className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 relative min-h-[500px]">
              {draftedDoc ? (
                <ScrollArea className="h-full p-6">
                  <pre className="font-body text-sm whitespace-pre-wrap leading-relaxed text-foreground/90">
                    {draftedDoc}
                  </pre>
                </ScrollArea>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 text-muted-foreground/40">
                  <FileText className="h-16 w-16 mb-4 opacity-10" />
                  <p className="font-headline italic text-lg">No draft generated yet.</p>
                  <p className="text-xs mt-1">Configure your requirements on the left to start.</p>
                </div>
              )}
            </CardContent>
            {draftedDoc && (
              <CardFooter className="border-t bg-muted/10 py-3 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Draft verified against enterprise legal guidelines
                </span>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}
