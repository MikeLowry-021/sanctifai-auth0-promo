/**
 * Scripture API client with LRU caching
 * Uses bible.helloao.org (no API key required)
 */

interface VerseResult {
  reference: string;
  text: string;
  translation: string;
}

interface CacheEntry {
  data: VerseResult;
  timestamp: number;
}

class LRUCache {
  private cache = new Map<string, CacheEntry>();
  private maxSize = 200;
  private ttl = 24 * 60 * 60 * 1000;

  get(key: string): VerseResult | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    this.cache.delete(key);
    this.cache.set(key, entry);
    return entry.data;
  }

  set(key: string, data: VerseResult): void {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
}

const cache = new LRUCache();

// Handle both client (Vite) and server (Node.js) environments
const BASE_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_SCRIPTURE_API_BASE
  ? import.meta.env.VITE_SCRIPTURE_API_BASE
  : 'https://bible.helloao.org';

function normalizeReference(ref: string): string {
  return ref.trim().replace(/\s+/g, ' ');
}

export async function getVerse(
  ref: string,
  translation: string = 'WEB'
): Promise<VerseResult> {
  const normalizedRef = normalizeReference(ref);
  const cacheKey = `${translation}:${normalizedRef}`;
  
  const cached = cache.get(cacheKey);
  if (cached) return cached;
  
  try {
    const url = `${BASE_URL}/api/${translation}/${encodeURIComponent(normalizedRef)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Scripture API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const result: VerseResult = {
      reference: normalizedRef,
      text: data.text || data.verse || '',
      translation
    };
    
    cache.set(cacheKey, result);
    return result;
    
  } catch (error) {
    console.error(`Failed to fetch verse ${ref}:`, error);
    
    return {
      reference: normalizedRef,
      text: `[Unable to load ${normalizedRef}]`,
      translation
    };
  }
}

export async function getVerses(
  refs: string[],
  translation: string = 'WEB'
): Promise<VerseResult[]> {
  const promises = refs.map(ref => getVerse(ref, translation));
  return Promise.all(promises);
}

export async function search(
  query: string,
  translation: string = 'WEB'
): Promise<Array<{ reference: string; text: string }>> {
  console.warn('Scripture search not yet implemented');
  return [];
}
