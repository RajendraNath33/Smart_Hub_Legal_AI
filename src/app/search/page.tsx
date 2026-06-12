
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
  Quote
} from "lucide-react";
import { semanticKnowledgeSearch, SemanticKnowledgeSearchOutput } from "@/ai/flows/semantic-knowledge-search-flow";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <AppLayoutWrapper>
      <div className="max-w-4xl mx-auto space-y-12 py-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="h-3 w-3" /> Semantic Reasoning Engine
          </div>
          <h1 className="text-4xl font-bold font-headline">Enterprise Legal Search</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find judgments, bare acts, and legal concepts using natural language queries powered by Qdrant vector storage.
          </p>
        </div>

        <div className="relative group">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-secondary transition-colors" />
              <Input
                placeholder="Describe your legal query (e.g., 'Recent cases on electronic evidence authentication under Section 65B')"
                className="h-16 pl-12 pr-4 rounded-2xl text-lg shadow-xl border-secondary/10 focus-visible:ring-secondary/20"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={isSearching} className="h-16 px-8 rounded-2xl bg-primary hover:bg-primary/90 font-bold text-lg">
              {isSearching ? <Loader2 className="h-6 w-6 animate-spin" /> : "Search"}
            </Button>
          </form>
          {!result && (
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest py-1">Trending:</span>
              {["Article 21 Rights", "BNS Mapping", "Anticipatory Bail", "65B Evidence", "Corporate CSR"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => { setQuery(tag); }}
                  className="px-3 py-1 bg-muted rounded-full text-xs hover:bg-secondary/20 hover:text-secondary transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
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
                  <CardTitle className="text-lg">AI Synthesized Response</CardTitle>
                  <CardDescription>Generated based on your internal knowledge base.</CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-200 uppercase text-[10px] font-bold">Verified Citation</Badge>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="leading-relaxed text-foreground/90 whitespace-pre-wrap">
                  {result.answer}
                </p>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-secondary" /> Related Document Snippets
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.citations.map((cite, i) => (
                  <Card key={i} className="hover:border-secondary/50 transition-colors shadow-sm group">
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="p-1.5 bg-primary/5 rounded border border-primary/10 group-hover:bg-secondary/10 transition-colors">
                          <BookOpen className="h-4 w-4 text-primary group-hover:text-secondary" />
                        </div>
                        <Badge variant="ghost" className="text-[10px] font-bold text-secondary">
                          Pg. {cite.pageNumber || "N/A"}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-primary group-hover:text-secondary transition-colors truncate">{cite.documentId}</h4>
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg text-xs italic text-muted-foreground flex items-start gap-2 border-l-2 border-secondary/30">
                          <Quote className="h-3 w-3 shrink-0 text-secondary opacity-50" />
                          <span className="line-clamp-3">{cite.snippet}</span>
                        </div>
                      </div>
                      <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-widest h-8 hover:bg-secondary/5">
                        View Full Document <ExternalLink className="h-3 w-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {!result && !isSearching && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-12">
            <Card className="bg-primary/5 border-primary/10 border-dashed">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <History className="h-4 w-4 text-secondary" /> Your Recent Searches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["Criminal Procedure Act Section 144", "Recent Supreme Court Judgments 2024", "Contract Law Defaults"].map((item) => (
                  <div key={item} className="text-xs text-muted-foreground py-2 border-b flex justify-between items-center group cursor-pointer hover:text-foreground">
                    {item} <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-secondary/5 border-secondary/10 border-dashed">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-secondary" /> Popular Queries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {["BNS to IPC Mapping Table", "New Digital Evidence Rules", "Labor Law Compliance 2024"].map((item) => (
                  <div key={item} className="text-xs text-muted-foreground py-2 border-b flex justify-between items-center group cursor-pointer hover:text-foreground">
                    {item} <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayoutWrapper>
  );
}
