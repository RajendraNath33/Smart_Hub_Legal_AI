'use server';
/**
 * @fileOverview A Genkit flow for performing semantic searches on a legal knowledge base.
 *
 * - semanticKnowledgeSearch - A function that handles natural language and conceptual queries to search the knowledge base.
 * - SemanticKnowledgeSearchInput - The input type for the semanticKnowledgeSearch function.
 * - SemanticKnowledgeSearchOutput - The return type for the semanticKnowledgeSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SemanticKnowledgeSearchInputSchema = z.object({
  query: z.string().describe('The natural language or conceptual query for the legal knowledge base.'),
});
export type SemanticKnowledgeSearchInput = z.infer<typeof SemanticKnowledgeSearchInputSchema>;

const SemanticKnowledgeSearchOutputSchema = z.object({
  answer: z.string().describe('The comprehensive answer to the user\'s query, synthesized from relevant documents.'),
  citations: z.array(z.object({
    documentId: z.string().describe('Identifier of the cited legal document (e.g., case name, act name).'),
    snippet: z.string().describe('The exact or paraphrased relevant snippet from the document.'),
    pageNumber: z.number().optional().describe('The page number within the document (if applicable).'),
    // Add more citation details as needed for production, e.g., 'judgmentDate', 'court', 'section', etc.
  })).describe('A list of verified citations supporting the generated answer.'),
});
export type SemanticKnowledgeSearchOutput = z.infer<typeof SemanticKnowledgeSearchOutputSchema>;

// Placeholder for the semantic search tool. In a real application, this would interact with Qdrant.
const semanticSearchTool = ai.defineTool(
  {
    name: 'semanticSearch',
    description: 'Performs a semantic search on the legal knowledge base to retrieve relevant documents based on a natural language query. Returns an array of document snippets.',
    inputSchema: z.object({
      searchQuery: z.string().describe('The natural language query to use for searching the legal knowledge base.'),
    }),
    outputSchema: z.array(z.object({
      documentId: z.string(),
      snippet: z.string(),
      pageNumber: z.number().optional(),
    })).describe('An array of relevant document snippets or summaries from the knowledge base, including document ID and page number.'),
  },
  async (input) => {
    console.log(`Executing semanticSearch tool with query: "${input.searchQuery}"`);
    // --- MOCK IMPLEMENTATION ---
    // In a real scenario, this would call out to Qdrant or a similar vector database
    // for semantic search and retrieval.
    // For now, it returns mock data based on simple keyword matching.
    const mockDocuments = [
      {
        documentId: 'Indian Penal Code, 1860',
        snippet: 'Section 300 defines murder as punishable by death or imprisonment for life.',
        pageNumber: 120,
      },
      {
        documentId: 'Criminal Procedure Code, 1973',
        snippet: 'Section 154 deals with information in cognizable cases, leading to the First Information Report (FIR).',
        pageNumber: 50,
      },
      {
        documentId: 'Case: R. v. Dudley and Stephens (1884)',
        snippet: 'This famous English case established that necessity is not a defence to a charge of murder, even in extreme circumstances.',
        pageNumber: 10,
      },
      {
        documentId: 'Indian Evidence Act, 1872',
        snippet: 'Section 65B provides for the admissibility of electronic records as evidence in court proceedings.',
        pageNumber: 30,
      },
      {
        documentId: 'Constitution of India',
        snippet: 'Article 21 guarantees the right to life and personal liberty, stating that no person shall be deprived of his life or personal liberty except according to procedure established by law.',
        pageNumber: 15,
      },
      {
        documentId: 'The Companies Act, 2013',
        snippet: 'Section 135 mandates Corporate Social Responsibility (CSR) for certain companies, requiring them to spend a percentage of their profits on specified activities.',
        pageNumber: 80,
      },
    ];

    const lowerCaseQuery = input.searchQuery.toLowerCase();
    const results = mockDocuments.filter(doc =>
      doc.snippet.toLowerCase().includes(lowerCaseQuery) ||
      doc.documentId.toLowerCase().includes(lowerCaseQuery)
    );

    if (results.length === 0) {
        // Return a default generic result if no specific match to ensure context for the LLM.
        return [{
            documentId: 'General Legal Knowledge Base',
            snippet: 'No highly specific documents found for your query in the mock database. Providing general legal context.',
            pageNumber: undefined,
        }];
    }
    return results;
    // --- END MOCK IMPLEMENTATION ---
  }
);

const semanticKnowledgeSearchPrompt = ai.definePrompt({
  name: 'semanticKnowledgeSearchPrompt',
  input: {schema: SemanticKnowledgeSearchInputSchema},
  output: {schema: SemanticKnowledgeSearchOutputSchema},
  tools: [semanticSearchTool], // Make the semantic search tool available to the LLM
  prompt: `You are an expert legal research assistant for the SmartHub Legal AI & Learning Platform.
Your task is to answer legal queries by semantically searching a self-hosted legal knowledge base and providing comprehensive answers with precise citations.

Follow these steps:
1. **Analyze the user's query carefully.**
2. **Use the 'semanticSearch' tool to retrieve relevant legal documents, precedents, bare acts, or academic materials from the knowledge base.** Formulate the 'searchQuery' for the tool based on the user's input, aiming to get the most relevant context.
3. **Synthesize a clear and comprehensive answer based *only* on the information retrieved from the search tool.** Do not make up information. If the search results state that no specific documents were found, acknowledge this.
4. **For every piece of information used in your answer, provide a precise citation.** The citation must include the 'documentId' and 'snippet' from the search results, and if available, the 'pageNumber'. Format citations clearly within your answer using the structure: [DocumentId, Snippet, Page Number (if available)].
5. If no relevant information is found by the search tool, clearly state that you could not find specific information in the knowledge base and offer general legal context if appropriate, but avoid hallucinating details.

User Query: {{{query}}}`
});

export async function semanticKnowledgeSearch(input: SemanticKnowledgeSearchInput): Promise<SemanticKnowledgeSearchOutput> {
  return semanticKnowledgeSearchFlow(input);
}

const semanticKnowledgeSearchFlow = ai.defineFlow(
  {
    name: 'semanticKnowledgeSearchFlow',
    inputSchema: SemanticKnowledgeSearchInputSchema,
    outputSchema: SemanticKnowledgeSearchOutputSchema,
  },
  async (input) => {
    const {output} = await semanticKnowledgeSearchPrompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }
    return output;
  }
);
