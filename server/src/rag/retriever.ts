import { loadDocuments, chunkDocuments, type Document } from './loader.js';
import { generateEmbedding, generateEmbeddings, findTopK } from './embeddings.js';
import { cacheGet, cacheSet } from '../cache/redis.js';

interface IndexedChunk {
    id: string;
    text: string;
    metadata: Document['metadata'];
    embedding: number[];
}

// In-memory vector store
let vectorStore: IndexedChunk[] = [];
let isInitialized = false;

/**
 * Initialize the RAG retriever by loading and indexing documents
 */
export async function initRetriever(): Promise<void> {
    if (isInitialized) {
        console.log('✅ RAG retriever already initialized');
        return;
    }

    console.log('📚 Initializing RAG retriever...');

    try {
        // Check cache first
        const cachedStore = await cacheGet<IndexedChunk[]>('rag:vector-store');
        if (cachedStore && cachedStore.length > 0) {
            vectorStore = cachedStore;
            isInitialized = true;
            console.log(`✅ RAG loaded ${vectorStore.length} chunks from cache`);
            return;
        }

        // Load and chunk documents
        const documents = loadDocuments();
        const chunks = chunkDocuments(documents);

        console.log(`📄 Processing ${chunks.length} document chunks...`);

        // Generate embeddings for all chunks
        const texts = chunks.map((c) => c.text);
        const embeddings = await generateEmbeddings(texts);

        // Build vector store
        vectorStore = chunks.map((chunk, index) => ({
            ...chunk,
            embedding: embeddings[index],
        }));

        // Cache the vector store
        await cacheSet('rag:vector-store', vectorStore, 24 * 60 * 60); // 24 hours

        isInitialized = true;
        console.log(`✅ RAG retriever initialized with ${vectorStore.length} chunks`);
    } catch (error) {
        console.error('❌ Failed to initialize RAG retriever:', error);
        // Continue without RAG - will use fallback
        isInitialized = true;
    }
}

/**
 * Retrieve relevant documents for a query
 */
export async function retrieve(
    query: string,
    options: {
        topK?: number;
        minScore?: number;
        category?: 'visa' | 'entry' | 'advisory' | 'passport';
        country?: string;
    } = {}
): Promise<Array<{ text: string; metadata: Document['metadata']; score: number }>> {
    const { topK = 3, minScore = 0.5, category, country } = options;

    if (!isInitialized || vectorStore.length === 0) {
        console.warn('RAG retriever not initialized, returning empty results');
        return [];
    }

    try {
        // Generate query embedding
        const queryEmbedding = await generateEmbedding(query);

        // Filter chunks if category/country specified
        let filteredChunks = vectorStore;
        if (category) {
            filteredChunks = filteredChunks.filter((c) => c.metadata.category === category);
        }
        if (country) {
            filteredChunks = filteredChunks.filter(
                (c) => c.metadata.country?.toLowerCase() === country.toLowerCase()
            );
        }

        if (filteredChunks.length === 0) {
            return [];
        }

        // Find most similar chunks
        const embeddings = filteredChunks.map((c) => c.embedding);
        const topResults = findTopK(queryEmbedding, embeddings, topK);

        // Filter by minimum score and return results
        return topResults
            .filter((r) => r.score >= minScore)
            .map((r) => ({
                text: filteredChunks[r.index].text,
                metadata: filteredChunks[r.index].metadata,
                score: r.score,
            }));
    } catch (error) {
        console.error('RAG retrieval error:', error);
        return [];
    }
}

/**
 * Get context for a travel regulations query
 */
export async function getRegulationsContext(
    query: string,
    country?: string
): Promise<string> {
    const results = await retrieve(query, {
        topK: 3,
        minScore: 0.4,
        country,
    });

    if (results.length === 0) {
        return '';
    }

    // Format context for LLM
    const context = results
        .map((r, i) => {
            const sourceInfo = r.metadata.country
                ? `[Source: ${r.metadata.source}, Country: ${r.metadata.country}]`
                : `[Source: ${r.metadata.source}]`;
            return `--- Document ${i + 1} (Relevance: ${(r.score * 100).toFixed(0)}%) ${sourceInfo}\n${r.text}`;
        })
        .join('\n\n');

    return `## Travel Regulations Context\n\n${context}`;
}

/**
 * Check if retriever is ready
 */
export function isRetrieverReady(): boolean {
    return isInitialized && vectorStore.length > 0;
}
