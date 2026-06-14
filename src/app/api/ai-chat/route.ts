import { NextResponse } from "next/server";
import { z } from "zod";
import { aiLegalAssistant } from "@/ai/flows/ai-legal-assistant-flow";

const AiChatRequestSchema = z.object({
  question: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { question } = AiChatRequestSchema.parse(body);

    const response = await aiLegalAssistant({
      legalQuestion: question,
      contextDocuments: [
        "System Status: Knowledge base connection pending initialization.",
        "Note: Using baseline legal reasoning without enterprise-specific context.",
      ],
    });

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    console.error("AI Chat API error:", error);
    const message = error?.message || "Unable to process your request at this time.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
