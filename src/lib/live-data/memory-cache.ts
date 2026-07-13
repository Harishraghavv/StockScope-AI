// In-memory TTL cache — avoids needing Prisma/PostgreSQL for caching live
// stock data. Each entry has an expiration timestamp; expired entries are
// silently evicted on read. This lives in the Node.js process memory and
// resets on server restart, which is fine for a dev/demo context.

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class MemoryCache {
  private store = new Map<string, CacheEntry<unknown>>();

  get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.data as T;
  }

  set<T>(key: string, data: T, ttlMs: number): void {
    this.store.set(key, { data, expiresAt: Date.now() + ttlMs });
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  /** Returns the number of non-expired entries */
  size(): number {
    let count = 0;
    const now = Date.now();
    for (const [key, entry] of this.store) {
      if (now > entry.expiresAt) {
        this.store.delete(key);
      } else {
        count++;
      }
    }
    return count;
  }
}

// Singleton caches for different data types
export const quoteCache = new MemoryCache();
export const detailsCache = new MemoryCache();
export const historyCache = new MemoryCache();
