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
  prompt: `You are a highly intelligent and experienced legal professional. Your task is to provide a comprehensive, well-reasoned answer to the user's legal question, based strictly on the provided context documents.

  Ensure that every factual statement or legal principle mentioned in your answer is supported by a precise citation from the context. For each citation, directly quote the relevant passage from the context document into the 'citations' array. If a specific point cannot be found in the provided context, state that explicitly within your answer.

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
