"use client";

import React, { useState, useRef, useEffect } from "react";
import { AppLayoutWrapper } from "@/components/layout/app-layout-wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  ShieldCheck, 
  Quote, 
  Scale, 
  Search,
  BookOpen,
  FileText
} from "lucide-react";
import { aiLegalAssistant, AILegalAssistantOutput } from "@/ai/flows/ai-legal-assistant-flow";
import { cn } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
  citations?: string[];
  timestamp: Date;
};

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Welcome to SmartHub Legal AI. I am your specialized reasoning engine. How can I assist with your legal research today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const result: AILegalAssistantOutput = await aiLegalAssistant({
        legalQuestion: currentInput,
        contextDocuments: [
          "System Status: Knowledge base connection pending initialization.",
          "Note: Using baseline legal reasoning without enterprise-specific context."
        ]
      });

      const aiMsg: Message = {
        role: "assistant",
        content: result.answer,
        citations: result.citations,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      const errorMsg: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error processing your request. Please check the AI service configuration.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayoutWrapper>
      <div className="flex flex-col h-[calc(100vh-160px)] max-w-5xl mx-auto border rounded-2xl overflow-hidden bg-card/50 shadow-xl border-secondary/10">
        <div className="flex items-center justify-between px-6 py-4 border-b bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-secondary rounded-lg">
              <Scale className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-headline font-bold">Legal Reasoning Assistant</h2>
              <div className="flex items-center gap-1.5 text-[10px] text-secondary font-bold uppercase tracking-wider">
                <ShieldCheck className="h-3 w-3" /> Reasoning Active
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2">
             <Badge variant="outline" className="text-secondary border-secondary/30 text-[10px]">Ready</Badge>
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx} className={cn(
                "flex gap-4",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}>
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
                  msg.role === "assistant" ? "bg-secondary text-primary border-secondary/30" : "bg-primary text-white border-primary-foreground/10"
                )}>
                  {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>
                <div className={cn(
                  "flex flex-col max-w-[85%] space-y-2",
                  msg.role === "user" ? "items-end" : ""
                )}>
                  <div className={cn(
                    "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    msg.role === "assistant" ? "bg-muted shadow-sm" : "bg-primary text-primary-foreground shadow-md"
                  )}>
                    {msg.content}
                  </div>
                  
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="space-y-2 mt-2">
                      <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Quote className="h-3 w-3" /> Evidence
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {msg.citations.map((cite, cidx) => (
                          <div key={cidx} className="p-2 rounded border bg-background text-[11px] text-muted-foreground italic flex items-start gap-2 max-w-md">
                            <BookOpen className="h-3 w-3 mt-0.5 shrink-0 text-secondary" />
                            {cite}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <span className="text-[10px] text-muted-foreground px-2">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-4">
                <div className="h-8 w-8 rounded-lg bg-secondary text-primary flex items-center justify-center animate-pulse">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted px-4 py-3 rounded-2xl flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-secondary" />
                  <span className="text-xs text-muted-foreground">Synthesizing legal reasoning...</span>
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        <div className="p-6 border-t bg-background/50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-secondary transition-colors" />
              <Input
                placeholder="Ask a legal question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="pl-10 h-12 bg-background border-border hover:border-secondary focus-visible:ring-secondary/20 transition-all rounded-xl shadow-inner"
              />
            </div>
            <Button type="submit" disabled={isLoading || !input.trim()} className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/90 shadow-lg">
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </AppLayoutWrapper>
  );
}