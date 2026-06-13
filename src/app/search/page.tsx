"use client";

import React, { useState } from "react";
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Sparkles, 
  BookOpen, 
  ChevronRight, 
  History, 
  TrendingUp, 
  Loader2,
  ExternalLink,
  Quote,
  AlertCircle
} from "lucide-react";
import { semanticKnowledgeSearch, SemanticKnowledgeSearchOutput } from "@/ai/flows/semantic-knowledge-search-flow";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<SemanticKnowledgeSearchOutput | null>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    try {
      const response = await semanticKnowledgeSearch({ query });
      setResult(response);
    } catch (error) {
      console.error(error);
      toast({ title: "Search Service Error", description: "Reasoning module connection failed.", variant: "destructive" });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <AppLayoutWrapper>
      <div className="max-w-4xl mx-auto space-y-12 py-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3" /> Semantic Reasoning
          </div>
          <h1 className="text-4xl font-bold font-headline">Legal Search Engine</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find concepts and precedents using natural language. Knowledge base integration pending.
          </p>
        </div>

        <div className="relative group">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
              <Input
                placeholder="Describe your legal query..."
                className="h-16 pl-12 pr-4 rounded-2xl text-lg shadow-xl border-secondary/10 focus-visible:ring-secondary/20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching} className="h-16 px-8 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-lg">
              {isSearching ? <Loader2 className="h-6 w-6 animate-spin" /> : "Search"}
            </Button>
          </form>
        </div>

        {isSearching && (
          <div className="space-y-6">
            <Card className="animate-pulse border-none shadow-none bg-muted/50">
              <CardContent className="h-40" />
            </Card>
          </div>
        )}

        {result && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="shadow-lg border-secondary/10 overflow-hidden">
              <CardHeader className="bg-secondary/5 border-b flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">AI Response</CardTitle>
                  <CardDescription>Synthesized from general reasoning.</CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {result.answer}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {!result && !isSearching && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
            <AlertCircle className="h-12 w-12 mb-4" />
            <p className="text-sm font-bold uppercase tracking-widest italic">Vector Store Not Configured</p>
            <p className="text-xs mt-1">Connect a legal database to see search results here.</p>
          </div>
        )}
      </div>
    </AppLayoutWrapper>
  );
}