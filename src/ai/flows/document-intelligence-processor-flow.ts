'use server';
/**
 * @fileOverview A Genkit flow for processing legal documents, including OCR (via multimodal model), metadata extraction, and content chunking.
 *
 * - documentIntelligenceProcessor - A function that handles the document processing.
 * - DocumentIntelligenceProcessorInput - The input type for the documentIntelligenceProcessor function.
 * - DocumentIntelligenceProcessorOutput - The return type for the documentIntelligenceProcessor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentIntelligenceProcessorInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A legal document (e.g., PDF, image, text file) as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentFileName: z.string().describe('The original filename of the document.'),
});
export type DocumentIntelligenceProcessorInput = z.infer<
  typeof DocumentIntelligenceProcessorInputSchema
>;

const DocumentIntelligenceProcessorOutputSchema = z.object({
  documentType: z
    .string()
    .describe(
      'The identified type of the legal document (e.g., "Legal Judgment", "Legal Textbook", "Contract").'
    ),
  title: z.string().describe('The main title or subject of the document.'),
  summary: z.string().describe('A brief summary of the document content.'),
  extractedMetadata: z
    .record(z.string(), z.string())
    .describe(
      'A key-value pair object containing specific metadata extracted from the document, such as "parties", "caseNumber", "date", "jurisdiction", "sections", "authors", "publicationDate", etc.'
    ),
  contentSections: z
    .array(z.string())
    .describe(
      'An array of logically coherent sections of the document, suitable for chunking and indexing in a vector database.'
    ),
});
export type DocumentIntelligenceProcessorOutput = z.infer<
  typeof DocumentIntelligenceProcessorOutputSchema
>;

export async function documentIntelligenceProcessor(
  input: DocumentIntelligenceProcessorInput
): Promise<DocumentIntelligenceProcessorOutput> {
  return documentIntelligenceProcessorFlow(input);
}

const documentIntelligenceProcessorPrompt = ai.definePrompt({
  name: 'documentIntelligenceProcessorPrompt',
  input: {schema: DocumentIntelligenceProcessorInputSchema},
  output: {schema: DocumentIntelligenceProcessorOutputSchema},
  prompt: `You are an expert legal document intelligence system. Your task is to process the provided legal document.
Carefully analyze the content of the document to perform the following steps:
1.  **Identify Document Type:** Determine the specific type of legal document.
2.  **Extract Title and Summary:** Identify the main title and provide a concise summary of its content.
3.  **Extract Key Metadata:** Identify and extract all relevant key-value metadata. This might include, but is not limited to: parties involved, case number, date of judgment/publication, jurisdiction, relevant laws/acts, authors, publication details, etc. Return this as a JSON object where keys are metadata fields and values are their extracted content.
4.  **Identify Content Sections for Chunking:** Break down the document's main body into logically coherent sections. Each section should represent a distinct idea, paragraph, or segment suitable for individual indexing. Return these as an array of strings.

Document Filename: {{{documentFileName}}}
Document Content: {{media url=documentDataUri}}`,
});

const documentIntelligenceProcessorFlow = ai.defineFlow(
  {
    name: 'documentIntelligenceProcessorFlow',
    inputSchema: DocumentIntelligenceProcessorInputSchema,
    outputSchema: DocumentIntelligenceProcessorOutputSchema,
  },
  async input => {
    const {output} = await documentIntelligenceProcessorPrompt(input);
    return output!;
  }
);
