// utils/textProcessor.ts
import type { Chunk } from '../types';

const CHUNK_SIZE = 1000;
const CHUNK_OVERLAP = 200;

// ==========================================
// TEXT CHUNKING
// ==========================================
export const chunkText = (docId: string, docName: string, text: string): Chunk[] => {
  const chunks: Chunk[] = [];
  let index = 0;
  let chunkIndex = 0;
  
  while (index < text.length) {
    const end = Math.min(index + CHUNK_SIZE, text.length);
    chunks.push({
      id: `${docId}-chunk-${chunkIndex}`,
      documentId: docId,
      documentName: docName,
      content: text.slice(index, end),
    });
    index += CHUNK_SIZE - CHUNK_OVERLAP;
    chunkIndex++;
  }
  
  return chunks;
};

// ==========================================
// IMPROVED RETRIEVAL (Better than keyword matching)
// ==========================================
export const retrieveRelevantChunks = (query: string, chunks: Chunk[], topK: number = 5): Chunk[] => {
  if (chunks.length === 0) return [];
  
  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);
  
  const scoredChunks = chunks.map(chunk => {
    const chunkLower = chunk.content.toLowerCase();
    let score = 0;
    
    // Exact phrase match (highest priority)
    if (chunkLower.includes(queryLower)) {
      score += 10;
    }
    
    // Individual word matches
    for (const word of queryWords) {
      const wordCount = (chunkLower.match(new RegExp(word, 'g')) || []).length;
      score += wordCount * 2;
    }
    
    // Proximity bonus (words appearing close together)
    for (let i = 0; i < queryWords.length - 1; i++) {
      const word1 = queryWords[i];
      const word2 = queryWords[i + 1];
      const regex = new RegExp(`${word1}\\s+\\w*\\s*${word2}`, 'gi');
      if (regex.test(chunkLower)) {
        score += 3;
      }
    }
    
    return { chunk, score };
  });

  scoredChunks.sort((a, b) => b.score - a.score);
  
  return scoredChunks
    .slice(0, topK)
    .filter(sc => sc.score > 0)
    .map(sc => sc.chunk);
};