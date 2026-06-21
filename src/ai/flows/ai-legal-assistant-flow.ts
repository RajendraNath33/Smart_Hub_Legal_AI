'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AILegalAssistantInputSchema = z.object({
  legalQuestion: z.string(),
  contextDocuments: z.array(z.string()),
});

export type AILegalAssistantInput = z.infer<typeof AILegalAssistantInputSchema>;

const AILegalAssistantOutputSchema = z.object({
  answer: z.string(),
  citations: z.array(z.string()),
});

export type AILegalAssistantOutput = z.infer<typeof AILegalAssistantOutputSchema>;

export async function aiLegalAssistant(
  input: AILegalAssistantInput
): Promise<AILegalAssistantOutput> {
  return aiLegalAssistantFlow(input);
}

const aiLegalAssistantPrompt = ai.definePrompt({
  name: 'aiLegalAssistantPrompt',
  input: { schema: AILegalAssistantInputSchema },
  output: { schema: AILegalAssistantOutputSchema },
  prompt: `
You are SmartHub Legal AI Assistant.

STRICT RULES:
1. Answer ONLY from the provided context documents.
2. Do NOT use outside knowledge.
3. Do NOT guess.
4. Do NOT give final legal advice.
5. If the answer is not clearly available in the provided context, say exactly:
"इस विषय में मेरे अपलोडेड लीगल डेटाबेस में पर्याप्त जानकारी उपलब्ध नहीं है।"
6. Answer mainly in simple Hindi. Use English legal terms where useful.
7. Always add this warning:
"कृपया कोर्ट में उपयोग से पहले Bare Act, Judgment या Advocate से verify करें."
8. Mention source document names in citations.
9. Keep answer structured and easy for LLB students and advocates.

Legal Question:
{{{legalQuestion}}}

Context Documents:
{{#each contextDocuments}}
---
{{{this}}}
{{/each}}

Return:
- answer
- citations
`,
});

const aiLegalAssistantFlow = ai.defineFlow(
  {
    name: 'aiLegalAssistantFlow',
    inputSchema: AILegalAssistantInputSchema,
    outputSchema: AILegalAssistantOutputSchema,
  },
  async (input) => {
    if (!input.contextDocuments || input.contextDocuments.length === 0) {
      return {
        answer:
          'इस विषय में मेरे अपलोडेड लीगल डेटाबेस में पर्याप्त जानकारी उपलब्ध नहीं है।\n\nकृपया कोर्ट में उपयोग से पहले Bare Act, Judgment या Advocate से verify करें.',
        citations: [],
      };
    }

    const hasRealContext = input.contextDocuments.some((doc) => {
      const clean = doc.replace(/Document:\s*/gi, '').trim();
      return clean.length > 100;
    });

    if (!hasRealContext) {
      return {
        answer:
          'इस विषय में मेरे अपलोडेड लीगल डेटाबेस में पर्याप्त जानकारी उपलब्ध नहीं है।\n\nकृपया कोर्ट में उपयोग से पहले Bare Act, Judgment या Advocate से verify करें.',
        citations: [],
      };
    }

    const { output } = await aiLegalAssistantPrompt(input);

    return (
      output || {
        answer:
          'इस विषय में मेरे अपलोडेड लीगल डेटाबेस में पर्याप्त जानकारी उपलब्ध नहीं है।\n\nकृपया कोर्ट में उपयोग से पहले Bare Act, Judgment या Advocate से verify करें.',
        citations: [],
      }
    );
  }
);