import { NextResponse } from "next/server";
import { z } from "zod";
import { aiLegalAssistant } from "@/ai/flows/ai-legal-assistant-flow";
import { supabase } from "@/lib/supabase";

const AiChatRequestSchema = z.object({
  question: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = AiChatRequestSchema.parse(body);

    const { data, error } = await supabase
      .from("legal_documents")
      .select("title, extracted_text")
      .limit(20);

    if (error) {
      throw new Error(error.message);
    }

    const contextDocuments =
      data?.map((doc) => {
        return `Document: ${doc.title}

${doc.extracted_text || ""}`;
      }) || [];

    const response = await aiLegalAssistant({
      legalQuestion: question,
      contextDocuments,
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("AI Chat API error:", error);

    const message =
      error?.message || "Unable to process your request at this time.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}