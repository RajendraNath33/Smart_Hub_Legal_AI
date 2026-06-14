'use server';
/**
 * @fileOverview This file implements a Genkit flow for an AI Legal Assistant.
 * It allows legal professionals to ask complex legal questions and receive
 * well-reasoned, comprehensive answers with precise citations from an internal knowledge base.
 *
 * - aiLegalAssistant - A function that handles the AI legal assistant process.
 * - AILegalAssistantInput - The input type for the aiLegalAssistant function.
 * - AILegalAssistantOutput - The return type for the aiLegalAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AILegalAssistantInputSchema = z.object({
  legalQuestion: z.string().describe('The complex legal question asked by the user.'),
  contextDocuments: z.array(z.string()).describe('Relevant legal documents or excerpts from the internal knowledge base to be used as context for the answer. Each string represents a document or a chunk of text.'),
});
export type AILegalAssistantInput = z.infer<typeof AILegalAssistantInputSchema>;

const AILegalAssistantOutputSchema = z.object({
  answer: z.string().describe('The well-reasoned and comprehensive answer to the legal question.'),
  citations: z.array(z.string()).describe('Precise citations from the provided context documents, directly quoting the relevant passages that support statements in the answer.'),
});
export type AILegalAssistantOutput = z.infer<typeof AILegalAssistantOutputSchema>;

export async function aiLegalAssistant(input: AILegalAssistantInput): Promise<AILegalAssistantOutput> {
  return aiLegalAssistantFlow(input);
}

const aiLegalAssistantPrompt = ai.definePrompt({
  name: 'aiLegalAssistantPrompt',
  input: {schema: AILegalAssistantInputSchema},
  output: {schema: AILegalAssistantOutputSchema},
  prompt: `You are SmartHub Legal AI Assistant.
  Answer legal education questions in simple Hindi and English.
  Do not give final legal advice.
  Always say: verify with bare act, judgment, or advocate before court use.

  Use only the provided context documents when answering.
  If the answer cannot be fully supported by the context, say that the information is not available.

  Legal Question: {{{legalQuestion}}}

  Context Documents:
  {{#each contextDocuments}}
  - {{{this}}}
  {{/each}}`,
});

const aiLegalAssistantFlow = ai.defineFlow(
  {
    name: 'aiLegalAssistantFlow',
    inputSchema: AILegalAssistantInputSchema,
    outputSchema: AILegalAssistantOutputSchema,
  },
  async input => {
    const {output} = await aiLegalAssistantPrompt(input);
    return output!;
  }
);
