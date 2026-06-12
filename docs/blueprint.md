# **App Name**: SmartHub Legal AI & Learning Platform

## Core Features:

- Enterprise AI Legal Assistant & RAG Engine: A high-performance conversational generative tool utilizing RAG with Qdrant vector storage and Ollama/DeepSeek. It acts as a reasoning tool to provide legal insights across specific modes (Research, Judiciary, Advocate, Student) with precise source retrieval.
- Document Intelligence & OCR Pipeline: An AI-powered processing pipeline for PDF parsing, OCR, and automated chunking to extract metadata and legal citations from uploaded documents for the self-hosted knowledge base.
- AI-Powered Legal Drafting Hub: A generative tool to assist in creating Civil, Criminal, and Corporate drafts using reasoning as a tool to interpret user inputs and produce professional legal templates.
- Citation & Retrieval Engine: A specialized system that ensures every AI-generated response includes verified citations, including page numbers, judgment citations, and specific section references from the internal library.
- Semantic AI Search & Knowledge Base: Advanced global search supporting natural language and legal concepts via vector embeddings for cross-referencing judgments, bare acts, and books indexed in the Qdrant database.
- Self-Hosted Infrastructure & Docker Orchestration: Production-ready deployment architecture using Docker Compose to orchestrate Next.js, FastAPI, PostgreSQL, and Nginx for a robust, localized enterprise environment.
- Automated n8n Workflows & Monitoring: Orchestrates complex backend tasks including user registration, welcome emails, document indexing, and system health monitoring through integrated n8n automation and analytics dashboards.
- Unified PostgreSQL & MinIO Data Layer: Enterprise-grade storage solution using MinIO for unstructured PDF/document storage and PostgreSQL for structured data, audit logs, and activity tracking.
- Advanced Judiciary & Resource Hub: Comprehensive resource with filters for State, Year, and Subject. Features BNS, BNSS, and BSA mapping alongside model answers, backed by the production database.
- LLB Digital Library & Mock Test Center: Structured repository for LLB programs and a robust examination engine with analytics for accuracy and rank, persisted in the localized storage layer.
- Secure JWT Auth & RBAC Management: Self-hosted authentication workflow using JWT with a tiered subscription model and role-based access control for secure platform management.

## Style Guidelines:

- A prestigious palette using Navy Blue (#002147) for authority, Gold (#D4AF37) for premium accents, and crisp White for readability.
- Full support for Dark Mode using Deep Onyx (#0c1014) as the base and a crisp Light Mode for professional environments.
- Pairing 'Alegreya' (serif) for headlines to provide a literary feel with 'Inter' (sans-serif) for functional UI elements and test interfaces.
- Thin-stroke, minimal line icons that mimic architectural diagrams, emphasizing precision and legal structure.
- A high-density responsive sidebar layout that keeps essential resources like the AI Assistant, Research Center, and Admin Panel within reach.
- Precise micro-interactions with short duration fades for chat transitions, test navigation, and smooth state-aware drafting panels.