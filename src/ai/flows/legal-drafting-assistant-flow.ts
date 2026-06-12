'use server';
/**
 * @fileOverview A Genkit flow for an AI-powered legal drafting assistant.
 *
 * - legalDraftingAssistant - A function that handles the generation of legal documents.
 * - LegalDraftingInput - The input type for the legalDraftingAssistant function.
 * - LegalDraftingOutput - The return type for the legalDraftingAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LegalDraftingInputSchema = z.object({
  documentType: z
    .string()
    .describe('The type of legal document to draft (e.g., Petition, Contract, Legal Notice).'),
  keyDetails: z
    .string()
    .describe('Essential facts, parties involved, and other crucial details for the document.'),
  additionalInstructions: z
    .string()
    .describe('Any specific formatting requirements, clauses, or stylistic preferences.')
    .optional(),
});
export type LegalDraftingInput = z.infer<typeof LegalDraftingInputSchema>;

const LegalDraftingOutputSchema = z.object({
  draftedDocument: z.string().describe('The generated legal document.'),
});
export type LegalDraftingOutput = z.infer<typeof LegalDraftingOutputSchema>;

export async function legalDraftingAssistant(
  input: LegalDraftingInput
): Promise<LegalDraftingOutput> {
  return legalDraftingAssistantFlow(input);
}

const legalDraftingAssistantPrompt = ai.definePrompt({
  name: 'legalDraftingAssistantPrompt',
  input: {schema: LegalDraftingInputSchema},
  output: {schema: LegalDraftingOutputSchema},
  prompt: `You are an expert legal drafting assistant. Your task is to generate a legal document based on the provided information.

Document Type: {{{documentType}}}

Key Details:
{{{keyDetails}}}

Additional Instructions:
{{#if additionalInstructions}}
{{{additionalInstructions}}}
{{else}}
No specific additional instructions provided. Please draft a standard version.
{{/if}}

Please draft the document, ensuring it adheres to standard legal formats and uses appropriate legal terminology. The output MUST be a complete legal document as a single string.`,
});

const legalDraftingAssistantFlow = ai.defineFlow(
  {
    name: 'legalDraftingAssistantFlow',
    inputSchema: LegalDraftingInputSchema,
    outputSchema: LegalDraftingOutputSchema,
  },
  async input => {
    const {output} = await legalDraftingAssistantPrompt(input);
    return output!;
  }
);
